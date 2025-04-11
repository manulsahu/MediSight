
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sendMessage, getChatMessages } from "@/lib/firebase";

type MessagesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patients: any[];
  selectedPatient: any | null;
  setSelectedPatient: (patient: any) => void;
};

const MessagesDialog = ({
  open,
  onOpenChange,
  patients = [], // Provide a default empty array
  selectedPatient,
  setSelectedPatient,
}: MessagesDialogProps) => {
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Get current user
  const currentUserId = "doctor-123"; // This would come from auth context in a real app
  
  useEffect(() => {
    if (!open || !selectedPatient) return;
    
    setLoading(true);
    
    // Create chat ID by combining doctor and patient IDs
    const chatId = [currentUserId, selectedPatient.id].sort().join('_');
    
    // Get messages for selected patient
    const unsubscribe = getChatMessages(chatId, (fetchedMessages) => {
      setMessages(fetchedMessages || []); // Ensure we have an array even if fetchedMessages is undefined
      setLoading(false);
    });
    
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [open, selectedPatient, currentUserId]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedPatient) return;
    
    try {
      await sendMessage(currentUserId, selectedPatient.id, newMessage);
      setNewMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been sent to the patient."
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Ensure patients is always an array
  const safePatients = Array.isArray(patients) ? patients : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Patient Messages</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Patients sidebar */}
          <div className="w-1/3 border-r overflow-y-auto">
            <div className="p-2">
              <Input placeholder="Search patients..." className="mb-2" />
              
              <div className="space-y-1">
                {safePatients.map(patient => (
                  <div 
                    key={patient.id}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted ${
                      selectedPatient?.id === patient.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{patient.name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{patient.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {patient.lastMessage || "No recent messages"}
                      </p>
                    </div>
                  </div>
                ))}

                {safePatients.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No patients found
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Message content */}
          <div className="w-2/3 flex flex-col">
            {selectedPatient ? (
              <>
                <div className="p-3 border-b">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{selectedPatient.name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedPatient.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{selectedPatient.email || ''}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loading ? (
                    <div className="flex justify-center">
                      <p className="text-muted-foreground">Loading messages...</p>
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender === currentUserId ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.sender === currentUserId
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center">
                      <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
                    </div>
                  )}
                </div>
                
                <form onSubmit={handleSendMessage} className="p-3 border-t">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Type your message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit">Send</Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a patient to view messages
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessagesDialog;
