
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
import { Check, X, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";

type AppointmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type AppointmentType = {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  status: "pending" | "accepted" | "rejected";
  appointmentDate?: Date;
  createdAt: Date;
};

const AppointmentDialog = ({ open, onOpenChange }: AppointmentDialogProps) => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
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
      const q = query(appointmentsRef, where("doctorId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      const appointmentsList: AppointmentType[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        appointmentsList.push({
          id: doc.id,
          doctorId: data.doctorId || "",
          patientId: data.patientId || "",
          patientName: data.patientName || "Unknown Patient",
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

  const handleAccept = (appointment: AppointmentType) => {
    setSelectedAppointment(appointment);
    setShowCalendar(true);
  };

  const handleConfirmAppointment = async () => {
    if (!selectedAppointment || !selectedDate) return;
    
    try {
      const appointmentRef = doc(db, "appointments", selectedAppointment.id);
      await updateDoc(appointmentRef, {
        status: "accepted",
        appointmentDate: selectedDate,
        updatedAt: serverTimestamp()
      });
      
      toast({
        title: "Appointment Accepted",
        description: `Appointment with ${selectedAppointment.patientName} has been scheduled.`
      });
      
      setShowCalendar(false);
      setSelectedAppointment(null);
      setSelectedDate(undefined);
      fetchAppointments();
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast({
        title: "Update Failed",
        description: "Failed to confirm appointment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (appointment: AppointmentType) => {
    try {
      const appointmentRef = doc(db, "appointments", appointment.id);
      await updateDoc(appointmentRef, {
        status: "rejected",
        updatedAt: serverTimestamp()
      });
      
      toast({
        title: "Appointment Rejected",
        description: `Appointment request from ${appointment.patientName} has been rejected.`
      });
      
      fetchAppointments();
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      toast({
        title: "Update Failed",
        description: "Failed to reject appointment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Appointment Requests</DialogTitle>
          <DialogDescription>
            View and manage appointment requests from patients.
          </DialogDescription>
        </DialogHeader>

        {!showCalendar ? (
          <>
            <div className="space-y-4">
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
                                <p className="font-medium">{appointment.patientName}</p>
                                <p className="text-xs text-muted-foreground">
                                  Requested on {new Date(appointment.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline" 
                                size="sm" 
                                className="flex items-center text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleAccept(appointment)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleReject(appointment)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No pending appointment requests
                </div>
              )}
              
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
                                <p className="font-medium">{appointment.patientName}</p>
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
                <div className="text-center py-4 text-muted-foreground">
                  No upcoming appointments
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Select Appointment Date</h3>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>
            </div>
            
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                setShowCalendar(false);
                setSelectedAppointment(null);
                setSelectedDate(undefined);
              }}>
                Cancel
              </Button>
              <Button 
                disabled={!selectedDate}
                onClick={handleConfirmAppointment}
              >
                Confirm Appointment
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
