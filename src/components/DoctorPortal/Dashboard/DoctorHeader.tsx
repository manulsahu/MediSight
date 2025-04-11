
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Calendar } from "lucide-react";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type DoctorHeaderProps = {
  user: User | null;
  notifications: any[];
  onSignOut: () => void;
  onShowProfileDialog: () => void;
  onShowScheduleDialog: () => void;
  onShowAddPatientDialog: () => void;
  onShowAddStaffDialog: () => void;
  onOpenMessages: () => void;
  onShowAppointments: () => void;
};

const DoctorHeader = ({
  user,
  notifications,
  onSignOut,
  onShowProfileDialog,
  onShowScheduleDialog,
  onShowAddPatientDialog,
  onShowAddStaffDialog,
  onOpenMessages,
  onShowAppointments,
}: DoctorHeaderProps) => {
  const [doctorName, setDoctorName] = useState<string>("");

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (!user?.uid) return;
      
      try {
        const docRef = doc(db, "doctors", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDoctorName(data.name || user.displayName || user?.email?.split('@')[0] || "Doctor");
        } else {
          setDoctorName(user.displayName || user?.email?.split('@')[0] || "Doctor");
        }
      } catch (error) {
        console.error("Error fetching doctor name:", error);
        setDoctorName(user?.displayName || user?.email?.split('@')[0] || "Doctor");
      }
    };
    
    fetchDoctorProfile();
    
    // Set up a listener to refresh the doctor name whenever the profile dialog is opened/closed
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.uid) {
        fetchDoctorProfile();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="healthcare-container py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-lg font-medium">Doctor Portal</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={onShowAppointments}
            >
              <Calendar size={18} />
              <span className="hidden sm:inline">Appointments</span>
            </Button>
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={onShowProfileDialog}
            >
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={user?.photoURL || ""} />
                <AvatarFallback>{doctorName?.charAt(0) || user?.email?.charAt(0) || "D"}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm hidden sm:inline-block">
                {doctorName}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={onSignOut}>
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DoctorHeader;
