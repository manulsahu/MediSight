
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth, onAuthStateChange, checkUserRole, storeDoctorData, storePatientData } from "@/lib/firebase";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  isDoctor: boolean;
  setIsDoctor: (value: boolean) => void;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  isDoctor: false,
  setIsDoctor: () => {},
  userRole: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDoctor, setIsDoctor] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Check role in Firestore
          const role = await checkUserRole(user.uid);
          
          if (role) {
            setUserRole(role);
            setIsDoctor(role === "doctor");
          } else {
            // If role not found in Firestore, check localStorage
            const localUserType = localStorage.getItem('userType');
            const isDoctorRole = localUserType === 'doctor';
            
            setIsDoctor(isDoctorRole);
            setUserRole(isDoctorRole ? "doctor" : "patient");
            
            // Store user data in Firestore based on role
            if (isDoctorRole) {
              await storeDoctorData(user.uid, {
                email: user.email,
                name: user.displayName || user.email?.split('@')[0] || "",
                photoURL: user.photoURL || ""
              });
            } else {
              await storePatientData(user.uid, {
                email: user.email,
                name: user.displayName || user.email?.split('@')[0] || "",
                photoURL: user.photoURL || ""
              });
            }
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          
          // Fallback to localStorage
          const userType = localStorage.getItem('userType');
          const isDoctorEmail = user.email?.endsWith('@doctor.com') || false;
          
          // Set doctor status based on localStorage or email
          const doctorStatus = userType === 'doctor' || isDoctorEmail;
          setIsDoctor(doctorStatus);
          setUserRole(doctorStatus ? "doctor" : "patient");
        }
      } else {
        setIsDoctor(false);
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isDoctor, setIsDoctor, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
