
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { Users, Calendar as CalendarIcon } from "lucide-react";

type AppointmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type AppointmentType = {
  id: string;
  doctorId: string;
  patientId: string;
  doctorName: string;
  status: "pending" | "accepted" | "rejected";
  appointmentDate?: Date;
  createdAt: Date;
};

type DoctorType = {
  id: string;
  name: string;
  specialty?: string;
  email: string;
  photoURL?: string;
};

const AppointmentDialog = ({ open, onOpenChange }: AppointmentDialogProps) => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [doctors, setDoctors] = useState<DoctorType[]>([]);
  const [showDoctorsList, setShowDoctorsList] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorType | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (open && user) {
      fetchAppointments();
    }
  }, [open, user]);

  const fetchAppointments = async () => {
    if (!user?.uid) return;
    
    try {
      const appointmentsRef = collection(db, "appointments");
      const q = query(appointmentsRef, where("patientId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      const appointmentsList: AppointmentType[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        appointmentsList.push({
          id: doc.id,
          doctorId: data.doctorId || "",
          patientId: data.patientId || "",
          doctorName: data.doctorName || "Unknown Doctor",
          status: data.status || "pending",
          appointmentDate: data.appointmentDate?.toDate(),
          createdAt: data.createdAt?.toDate() || new Date()
        });
      });
      
      setAppointments(appointmentsList);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const doctorsRef = collection(db, "doctors");
      const querySnapshot = await getDocs(doctorsRef);
      
      const doctorsList: DoctorType[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        doctorsList.push({
          id: doc.id,
          name: data.name || "Unknown Doctor",
          specialty: data.specialty || "",
          email: data.email || "",
          photoURL: data.photoURL || ""
        });
      });
      
      setDoctors(doctorsList);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleRequestAppointment = () => {
    setShowDoctorsList(true);
    fetchDoctors();
  };

  const handleSelectDoctor = (doctor: DoctorType) => {
    setSelectedDoctor(doctor);
  };

  const handleSendRequest = async () => {
    if (!selectedDoctor || !user) return;
    
    try {
      await addDoc(collection(db, "appointments"), {
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        patientId: user.uid,
        patientName: user.displayName || user.email,
        status: "pending",
        createdAt: serverTimestamp()
      });
      
      toast({
        title: "Request Sent",
        description: `Appointment request sent to Dr. ${selectedDoctor.name}`
      });
      
      setShowDoctorsList(false);
      setSelectedDoctor(null);
      fetchAppointments();
    } catch (error) {
      console.error("Error sending appointment request:", error);
      toast({
        title: "Request Failed",
        description: "Failed to send appointment request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Appointments</DialogTitle>
          <DialogDescription>
            View your upcoming appointments and request new ones.
          </DialogDescription>
        </DialogHeader>

        {!showDoctorsList ? (
          <>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Upcoming Appointments</h3>
              
              {appointments.filter(a => a.status === "accepted").length > 0 ? (
                <div className="space-y-3">
                  {appointments
                    .filter(a => a.status === "accepted")
                    .map(appointment => (
                      <Card key={appointment.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{appointment.doctorName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.appointmentDate 
                                    ? new Date(appointment.appointmentDate).toLocaleDateString() 
                                    : "Date pending"}
                                </p>
                              </div>
                            </div>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Confirmed
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming appointments
                </div>
              )}
              
              <h3 className="text-sm font-medium">Pending Requests</h3>
              {appointments.filter(a => a.status === "pending").length > 0 ? (
                <div className="space-y-3">
                  {appointments
                    .filter(a => a.status === "pending")
                    .map(appointment => (
                      <Card key={appointment.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{appointment.doctorName}</p>
                                <p className="text-xs text-muted-foreground">
                                  Requested on {new Date(appointment.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                              Pending
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No pending requests
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button onClick={handleRequestAppointment}>
                Request Appointment
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Select a Doctor</h3>
              
              {doctors.length > 0 ? (
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {doctors.map(doctor => (
                    <Card 
                      key={doctor.id} 
                      className={`cursor-pointer ${selectedDoctor?.id === doctor.id ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => handleSelectDoctor(doctor)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={doctor.photoURL || ""} />
                            <AvatarFallback>{doctor.name?.charAt(0) || "D"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{doctor.name}</p>
                            <p className="text-sm text-muted-foreground">{doctor.specialty || "General Practitioner"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Loading doctors...
                </div>
              )}
            </div>
            
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                setShowDoctorsList(false);
                setSelectedDoctor(null);
              }}>
                Cancel
              </Button>
              <Button 
                disabled={!selectedDoctor}
                onClick={handleSendRequest}
              >
                Send Request
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
