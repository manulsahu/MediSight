
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { signOut, getAllPatients } from "@/lib/firebase";

// Import components
import { PatientList } from "@/components/DoctorPortal/PatientList";
import { PatientDetails } from "@/components/DoctorPortal/PatientDetail/PatientDetails";
import { DoctorProfile } from "@/components/DoctorPortal/DoctorProfile";

// Import refactored dashboard components
import DoctorHeader from "@/components/DoctorPortal/Dashboard/DoctorHeader";
import AddPatientDialog from "@/components/DoctorPortal/Dashboard/AddPatientDialog";
import AddStaffDialog from "@/components/DoctorPortal/Dashboard/AddStaffDialog";
import ScheduleDialog from "@/components/DoctorPortal/Dashboard/ScheduleDialog";
import MessagesDialog from "@/components/DoctorPortal/Dashboard/MessagesDialog";
import PatientReportsViewer from "@/components/DoctorPortal/PatientReportsViewer";
import AppointmentDialog from "@/components/DoctorPortal/AppointmentDialog";

const DoctorDashboard = () => {
  const { user, loading, isDoctor } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State variables
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [isPatientDetailOpen, setIsPatientDetailOpen] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showAddPatientDialog, setShowAddPatientDialog] = useState(false);
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showMessagesDialog, setShowMessagesDialog] = useState(false);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  
  // Fetch patients data
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const fetchedPatients = await getAllPatients();
        if (fetchedPatients && fetchedPatients.length > 0) {
          setPatients(fetchedPatients);
        } else {
          // Use mock data if no real patients yet
          setPatients([
            {
              id: "1",
              name: "John Doe",
              avatar: "",
              lastVisit: "2025-04-01",
              condition: "Hypertension",
              email: "john.doe@example.com",
              phone: "+1 (555) 123-4567",
              address: "123 Main St, Boston MA",
              dob: "1975-05-15",
              bloodType: "A+",
              allergies: "Penicillin",
              reports: [
                { title: "Blood Test", date: "2025-03-28", url: "#" },
                { title: "ECG", date: "2025-03-28", url: "#" }
              ]
            },
            {
              id: "2",
              name: "Jane Smith",
              avatar: "",
              lastVisit: "2025-03-25",
              condition: "Type 2 Diabetes",
              email: "jane.smith@example.com",
              phone: "+1 (555) 987-6543",
              address: "456 Oak St, Chicago IL",
              dob: "1982-08-20",
              bloodType: "O-",
              allergies: "None",
              reports: [
                { title: "HbA1c", date: "2025-03-20", url: "#" },
                { title: "Kidney Function", date: "2025-03-20", url: "#" }
              ]
            },
            {
              id: "3",
              name: "Robert Johnson",
              avatar: "",
              lastVisit: "2025-03-15",
              condition: "Asthma",
              email: "robert.j@example.com",
              phone: "+1 (555) 456-7890",
              address: "789 Pine St, New York NY",
              dob: "1990-12-10",
              bloodType: "B+",
              allergies: "Pollen, Dust",
              reports: [
                { title: "Pulmonary Function", date: "2025-03-10", url: "#" }
              ]
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    
    if (user) {
      fetchPatients();
    }
  }, [user]);
  
  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/signin");
      } else if (!isDoctor) {
        // If user is not marked as a doctor, redirect to patient dashboard
        navigate("/patient/dashboard");
      }
    }
  }, [user, loading, navigate, isDoctor]);

  // Event handlers
  const handleSignOut = async () => {
    try {
      localStorage.removeItem('userType');
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const openPatientDetail = (patient: any) => {
    setSelectedPatient(patient);
    setIsPatientDetailOpen(true);
  };
  
  const handleAddPatient = () => {
    toast({
      title: "Patient Added",
      description: "New patient has been added successfully",
    });
    setShowAddPatientDialog(false);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || !isDoctor) {
    return null; // Will redirect from useEffect
  }

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://cdn.discordapp.com/attachments/1275127310395379795/1360016256866193408/04_11_2025_X-Design.png?ex=67f99557&is=67f843d7&hm=d0c1ed832c9256e18918613e33819812f3f7cdbe31d39c0846de8628f23c3193&')" }}>
      {/* Header */}
      <DoctorHeader
        user={user}
        notifications={[]}
        onSignOut={handleSignOut}
        onShowProfileDialog={() => setShowProfileDialog(true)}
        onShowScheduleDialog={() => setShowScheduleDialog(true)}
        onShowAddPatientDialog={() => setShowAddPatientDialog(true)}
        onShowAddStaffDialog={() => setShowAddStaffDialog(false)}
        onOpenMessages={() => {}}
        onShowAppointments={() => setShowAppointmentDialog(true)}
      />

      {/* Main content */}
      <main className="healthcare-container py-6">
        <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
        
        {/* Patient Reports Viewer */}
        <PatientReportsViewer />
        
        {/* Patient Management */}
        <h2 className="text-xl font-semibold my-6">Patient Management</h2>
        
        {/* Search and patient list */}
        <PatientList patients={patients} onSelectPatient={openPatientDetail} />
      </main>

      {/* Doctor Profile Dialog */}
      <DoctorProfile 
        user={user} 
        open={showProfileDialog} 
        onClose={() => setShowProfileDialog(false)}
      />
      
      {/* Appointment Dialog */}
      <AppointmentDialog
        open={showAppointmentDialog}
        onOpenChange={setShowAppointmentDialog}
      />

      {/* Patient Detail Sheet */}
      <Sheet open={isPatientDetailOpen} onOpenChange={setIsPatientDetailOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-auto">
          <SheetHeader className="flex flex-row justify-between items-center">
            <SheetTitle>Patient Details</SheetTitle>
          </SheetHeader>
          
          <PatientDetails 
            patient={selectedPatient} 
            setPatient={setSelectedPatient} 
            onClose={() => setIsPatientDetailOpen(false)} 
          />
        </SheetContent>
      </Sheet>
      
      {/* Dialogs */}
      <AddPatientDialog 
        open={showAddPatientDialog} 
        onOpenChange={setShowAddPatientDialog}
        onAddPatient={handleAddPatient}
      />
    </div>
  );
};

export default DoctorDashboard;
