
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Users,
  Settings,
  Bell,
  BarChart3,
  CalendarDays,
  Shield,
  UserCog
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const AdminControls = () => {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [systemFeatures, setSystemFeatures] = useState({
    onlineBooking: true,
    patientPortal: true,
    medicationReminders: true,
    labResults: true,
  });

  // Dialog states
  const [showUsageReports, setShowUsageReports] = useState(false);
  const [showManageStaff, setShowManageStaff] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  const handleFeatureToggle = (feature: keyof typeof systemFeatures) => {
    setSystemFeatures({
      ...systemFeatures,
      [feature]: !systemFeatures[feature]
    });
    
    toast({
      title: `System Feature Updated`,
      description: `${feature} has been ${systemFeatures[feature] ? 'disabled' : 'enabled'}.`,
    });
  };

  const sendSystemMessage = () => {
    toast({
      title: "System Message Sent",
      description: "Your message has been sent to all patients.",
    });
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} />
            Administrator Controls
          </CardTitle>
          <CardDescription>
            Manage patient portal and system settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="system" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="system">
                <Settings className="mr-2 h-4 w-4" />
                System
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="mr-2 h-4 w-4" />
                Users
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="system">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Online Appointment Booking</p>
                    <p className="text-sm text-muted-foreground">
                      Allow patients to book appointments online
                    </p>
                  </div>
                  <Switch 
                    checked={systemFeatures.onlineBooking}
                    onCheckedChange={() => handleFeatureToggle('onlineBooking')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Patient Portal Access</p>
                    <p className="text-sm text-muted-foreground">
                      Enable patient access to their health records
                    </p>
                  </div>
                  <Switch 
                    checked={systemFeatures.patientPortal}
                    onCheckedChange={() => handleFeatureToggle('patientPortal')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Medication Reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Send automated medication reminders to patients
                    </p>
                  </div>
                  <Switch 
                    checked={systemFeatures.medicationReminders}
                    onCheckedChange={() => handleFeatureToggle('medicationReminders')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Lab Results Sharing</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically share lab results with patients
                    </p>
                  </div>
                  <Switch 
                    checked={systemFeatures.labResults}
                    onCheckedChange={() => handleFeatureToggle('labResults')}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Send system updates via email
                    </p>
                  </div>
                  <Switch 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Send system updates via SMS
                    </p>
                  </div>
                  <Switch 
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
                
                <div className="mt-6">
                  <p className="font-medium mb-2">Send System Message</p>
                  <textarea 
                    className="w-full p-2 border rounded-md h-24 resize-none"
                    placeholder="Enter a message to send to all patients..."
                  />
                  <Button 
                    className="mt-2"
                    onClick={sendSystemMessage}
                  >
                    Send to All Patients
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="newpatients" />
                  <label
                    htmlFor="newpatients"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Automatically approve new patient registrations
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="twofactor" />
                  <label
                    htmlFor="twofactor"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Require two-factor authentication for staff
                  </label>
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => setShowUsageReports(true)}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Usage Reports
                  </Button>
                  <Button variant="outline" onClick={() => setShowManageStaff(true)}>
                    <UserCog className="mr-2 h-4 w-4" />
                    Manage Staff
                  </Button>
                  <Button variant="outline" onClick={() => setShowScheduleDialog(true)}>
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Save Settings</Button>
        </CardFooter>
      </Card>

      {/* Usage Reports Dialog */}
      <Dialog open={showUsageReports} onOpenChange={setShowUsageReports}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Usage Reports</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Patient Portal Usage</h3>
              <div className="h-[200px] bg-muted rounded-md mt-2 p-4 flex items-center justify-center">
                <p className="text-center text-muted-foreground">Chart showing patient portal logins will display here</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">Staff Activity</h3>
              <div className="h-[200px] bg-muted rounded-md mt-2 p-4 flex items-center justify-center">
                <p className="text-center text-muted-foreground">Chart showing staff activity will display here</p>
              </div>
            </div>
            <Button className="w-full" onClick={() => setShowUsageReports(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Staff Dialog */}
      <Dialog open={showManageStaff} onOpenChange={setShowManageStaff}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Staff</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-md p-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Dr. Jane Smith</p>
                  <p className="text-sm text-muted-foreground">Cardiologist</p>
                </div>
                <Button variant="outline" size="sm">Edit Permissions</Button>
              </div>
            </div>
            <div className="border rounded-md p-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Dr. Michael Johnson</p>
                  <p className="text-sm text-muted-foreground">General Practitioner</p>
                </div>
                <Button variant="outline" size="sm">Edit Permissions</Button>
              </div>
            </div>
            <div className="border rounded-md p-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Nurse Sarah Wilson</p>
                  <p className="text-sm text-muted-foreground">Registered Nurse</p>
                </div>
                <Button variant="outline" size="sm">Edit Permissions</Button>
              </div>
            </div>
            <Button onClick={() => setShowManageStaff(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Staff Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Staff Schedule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-md p-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Dr. Jane Smith</p>
                  <p className="text-sm text-muted-foreground">Mon, Wed, Fri: 9AM - 5PM</p>
                </div>
                <Button variant="outline" size="sm">Edit Schedule</Button>
              </div>
            </div>
            <div className="border rounded-md p-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Dr. Michael Johnson</p>
                  <p className="text-sm text-muted-foreground">Tue, Thu: 8AM - 4PM</p>
                </div>
                <Button variant="outline" size="sm">Edit Schedule</Button>
              </div>
            </div>
            <div className="border rounded-md p-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Nurse Sarah Wilson</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri: 9AM - 6PM</p>
                </div>
                <Button variant="outline" size="sm">Edit Schedule</Button>
              </div>
            </div>
            <Button onClick={() => setShowScheduleDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
