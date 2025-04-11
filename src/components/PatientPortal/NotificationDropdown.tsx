
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock notifications - would come from Firebase in a real app
const notifications = [
  {
    id: "1",
    type: "medication",
    title: "Medication Reminder",
    message: "Time to take Lisinopril (10mg)",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "appointment",
    title: "Upcoming Appointment",
    message: "Appointment with Dr. Smith tomorrow at 10:00 AM",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "3",
    type: "report",
    title: "Lab Results Available",
    message: "Your recent blood test results are now available",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    type: "message",
    title: "Message from Dr. Johnson",
    message: "Please remember to monitor your blood pressure daily",
    time: "2 days ago",
    read: true,
  },
];

const NotificationDropdown = () => {
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="p-4 border-b">
            <h3 className="font-medium">Notifications</h3>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.slice(0, 3).map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b ${
                  !notification.read ? "bg-muted/50" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </div>
                <p className="text-sm mt-1">{notification.message}</p>
              </div>
            ))}
          </div>
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setShowAllNotifications(true)}
            >
              View all notifications
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* All Notifications Dialog */}
      <Dialog open={showAllNotifications} onOpenChange={setShowAllNotifications}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>All Notifications</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto max-h-[60vh]">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-md ${
                  !notification.read ? "bg-muted/50" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </div>
                <p className="text-sm mt-1">{notification.message}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationDropdown;
