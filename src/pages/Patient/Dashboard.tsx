
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProfileCard from "@/components/PatientPortal/ProfileCard";
import ReportUpload from "@/components/PatientPortal/ReportUpload";
import { LogOut, Calendar } from "lucide-react";
import { signOut } from "@/lib/firebase";
import AppointmentDialog from "@/components/PatientPortal/AppointmentDialog";
import HealthSuggestions from "@/components/PatientPortal/HealthSuggestions";

const PatientDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect from useEffect
  }

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://cdn.discordapp.com/attachments/1275127310395379795/1360016256866193408/04_11_2025_X-Design.png?ex=680d5bd7&is=680c0a57&hm=2bf9d08b9de905844ff670174b888375456bacf16961ed4eb86dc0c037536b01&')" }}>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="healthcare-container py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ProfileCard />
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={() => setShowAppointmentDialog(true)}
              >
                <Calendar size={18} />
                <span className="hidden sm:inline">Appointments</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="healthcare-container py-6">
        <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Report Upload Section */}
          <div>
            <ReportUpload />
          </div>
          
          {/* Health Analysis Section */}
          <div>
            <HealthSuggestions />
          </div>
        </div>
      </main>
      
      {/* Appointment Dialog */}
      <AppointmentDialog 
        open={showAppointmentDialog} 
        onOpenChange={setShowAppointmentDialog} 
      />
    </div>
  );
};

export default PatientDashboard;
