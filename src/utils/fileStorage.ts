import { doc, updateDoc, arrayUnion, collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "./cloudinary";

export type FileRecord = {
  id?: string;
  patientId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: Date;
};

export const uploadAndStoreFile = async (
  file: File, 
  patientId: string
): Promise<FileRecord> => {
  try {
    console.log(`Starting upload process for ${file.name} (${file.size} bytes, type: ${file.type})`);
    
    // 1. Upload to Cloudinary
    const fileUrl = await uploadToCloudinary(file);
    console.log(`Cloudinary upload complete: ${fileUrl}`);
    
    // 2. Store reference in Firestore
    const fileRecord: FileRecord = {
      patientId,
      fileName: file.name,
      fileUrl,
      fileType: file.type,
      uploadedAt: new Date()
    };
    
    console.log(`Storing file record in Firestore:`, fileRecord);
    
    const docRef = await addDoc(collection(db, "patientFiles"), {
      ...fileRecord,
      uploadedAt: serverTimestamp() 
    });
    
    console.log(`File record stored with ID: ${docRef.id}`);
    
    // Also add to patient's reports array
    await updateDoc(doc(db, "patients", patientId), {
      reports: arrayUnion({
        title: file.name,
        date: new Date().toISOString().split('T')[0],
        url: fileUrl
      })
    });
    
    console.log(`Updated patient document with new report`);
    
    return {
      ...fileRecord,
      id: docRef.id
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const getFileRecordsForPatient = async (patientId: string): Promise<FileRecord[]> => {
  try {
    console.log(`Fetching file records for patient ${patientId}`);
    
    // Create a query against the patientFiles collection
    const q = query(collection(db, "patientFiles"), where("patientId", "==", patientId));
    const querySnapshot = await getDocs(q);
    
    // Map the query results to FileRecord objects
    const files: FileRecord[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      files.push({
        id: doc.id,
        patientId: data.patientId,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        uploadedAt: data.uploadedAt?.toDate() || new Date()
      });
    });
    
    console.log(`Found ${files.length} files for patient ${patientId}`);
    return files;
  } catch (error) {
    console.error("Error getting file records:", error);
    return [];
  }
};

export const deleteFileRecord = async (fileId: string, patientId: string, fileName: string, fileUrl: string): Promise<boolean> => {
  try {
    console.log(`Deleting file ${fileName} (ID: ${fileId}) for patient ${patientId}`);
    
    // 1. Delete the file record from patientFiles collection
    await deleteDoc(doc(db, "patientFiles", fileId));
    
    // 2. Also remove from patient's reports array
    const patientRef = doc(db, "patients", patientId);
    const patientSnap = await getDoc(patientRef);
    
    if (patientSnap.exists()) {
      // Find and remove the report with matching title (filename) and url
      await updateDoc(patientRef, {
        reports: arrayRemove({
          title: fileName,
          date: new Date(patientSnap.data().reports?.find((r: any) => 
            r.title === fileName && r.url === fileUrl)?.date || new Date().toISOString().split('T')[0]),
          url: fileUrl
        })
      });
    }
    
    console.log(`Successfully deleted file record ${fileId}`);
    return true;
  } catch (error) {
    console.error("Error deleting file record:", error);
    return false;
  }
};
