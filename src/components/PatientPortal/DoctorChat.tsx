
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock chat data - would come from Firestore in a real app
const initialMessages = [
  {
    id: "1",
    sender: "doctor",
    name: "Dr. Smith",
    message: "How are you feeling today? Any side effects from the medication?",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    sender: "patient",
    name: "You",
    message: "I'm feeling better, but I still have a slight headache in the morning.",
    timestamp: "10:32 AM",
  },
  {
    id: "3",
    sender: "doctor",
    name: "Dr. Smith",
    message: "That's a known side effect. Try taking the medication with food. If it continues, we might need to adjust the dosage.",
    timestamp: "10:35 AM",
  },
];

const DoctorChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      sender: "patient",
      name: "You",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
    
    // Simulate doctor response after delay
    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        sender: "doctor",
        name: "Dr. Smith",
        message: "Thanks for the update. I've noted this in your chart. Let me know if you need anything else.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, response]);
    }, 3000);
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Ask Your Doctor</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full gap-2"
            onClick={() => setIsOpen(true)}
          >
            <MessageCircle size={16} />
            Chat with Dr. Smith
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            {messages.map((msg) => (
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
            ))}
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
    </>
  );
};

export default DoctorChat;
