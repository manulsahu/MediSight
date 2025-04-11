
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile,
  UserCredential
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  getDocs,
  query, 
  where, 
  serverTimestamp, 
  arrayUnion, 
  onSnapshot 
} from "firebase/firestore";
import { 
  getStorage, 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjZpsbqXrhPySHq2J24ph5TFekO07x34Y",
  authDomain: "health-care-dcdb4.firebaseapp.com",
  projectId: "health-care-dcdb4",
  storageBucket: "health-care-dcdb4.firebasestorage.app",
  messagingSenderId: "926916390459",
  appId: "1:926916390459:web:a2720b8c2379eebd19361e",
  measurementId: "G-RESGSYSXNF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Authentication functions
export const signInWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signOut = () => {
  return firebaseSignOut(auth);
};

export const updateUserProfile = (user: User, data: { displayName?: string, photoURL?: string }) => {
  return updateProfile(user, data);
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions for patients
export const storePatientData = async (userId: string, data: any) => {
  try {
    await setDoc(doc(db, "patients", userId), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      role: "patient"
    }, { merge: true });
    
    // Store user role in users collection for easy queries
    await setDoc(doc(db, "users", userId), {
      role: "patient",
      email: data.email,
      name: data.name || "",
      createdAt: serverTimestamp()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error("Error storing patient data:", error);
    return false;
  }
};

// Firestore functions for doctors
export const storeDoctorData = async (userId: string, data: any) => {
  try {
    await setDoc(doc(db, "doctors", userId), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      role: "doctor"
    }, { merge: true });
    
    // Store user role in users collection for easy queries
    await setDoc(doc(db, "users", userId), {
      role: "doctor",
      email: data.email,
      name: data.name || "",
      createdAt: serverTimestamp()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error("Error storing doctor data:", error);
    return false;
  }
};

// Check user role
export const checkUserRole = async (userId: string): Promise<string | null> => {
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return docSnap.data()?.role || null;
    }
    return null;
  } catch (error) {
    console.error("Error checking user role:", error);
    return null;
  }
};

// Upload PDF to Firebase Storage
export const uploadPDF = async (file: File, userId: string, category: string = "reports") => {
  try {
    const fileRef = storageRef(storage, `${category}/${userId}/${file.name}`);
    const uploadResult = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);
    
    // Store reference in Firestore
    await updateDoc(doc(db, "patients", userId), {
      pdfFiles: arrayUnion({
        name: file.name,
        url: downloadURL,
        category: category,
        uploadedAt: serverTimestamp()
      })
    });
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw error;
  }
};

// Get all patients
export const getAllPatients = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "patients"));
    const patients: any[] = [];
    querySnapshot.forEach((doc) => {
      patients.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return patients;
  } catch (error) {
    console.error("Error getting patients:", error);
    return [];
  }
};

// Get all doctors
export const getAllDoctors = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "doctors"));
    const doctors: any[] = [];
    querySnapshot.forEach((doc) => {
      doctors.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return doctors;
  } catch (error) {
    console.error("Error getting doctors:", error);
    return [];
  }
};

// Chat functions
export const sendMessage = async (senderId: string, receiverId: string, message: string) => {
  try {
    const chatId = [senderId, receiverId].sort().join('_');
    
    await setDoc(doc(db, "chats", chatId, "messages", Date.now().toString()), {
      sender: senderId,
      text: message,
      createdAt: serverTimestamp()
    });
    
    // Update chat metadata
    await setDoc(doc(db, "chats", chatId), {
      participants: [senderId, receiverId],
      lastMessage: message,
      lastMessageTime: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
};

// Get chat messages
export const getChatMessages = (chatId: string, callback: (messages: any[]) => void) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  
  return onSnapshot(messagesRef, (snapshot) => {
    const messages: any[] = [];
    snapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    // Sort messages by timestamp
    messages.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return aTime - bTime;
    });
    callback(messages);
  });
};

export default app;
