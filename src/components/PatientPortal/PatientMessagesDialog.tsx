
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PatientMessagesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
};

const PatientMessagesDialog: React.FC<PatientMessagesDialogProps> = ({
  open,
  onOpenChange,
  userId
}) => {
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([
    {
      id: "1",
      sender: "doctor",
      name: "Dr. Smith",
      message: "Hello! How are you feeling today?",
      timestamp: "10:30 AM"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!open) return;
    
    // In a real app, fetch messages from Firestore here
    setIsLoading(true);
    
    // Simulated API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [open]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add patient's message to the chat
    const message = {
      id: Date.now().toString(),
      sender: "patient",
      name: "You",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage("");
    
    // In a real app, store the message in Firestore
    // For now, just simulate a response
    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        sender: "doctor",
        name: "Dr. Smith",
        message: "Thank you for your message. I'll review your case and get back to you soon.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>DS</AvatarFallback>
            </Avatar>
            Dr. Smith
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {isLoading ? (
            <div className="text-center">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No messages yet. Start a conversation with your doctor!
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "patient" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.sender === "patient"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium">{msg.name}</span>
                    <span className="text-xs opacity-70">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send size={16} />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PatientMessagesDialog;
