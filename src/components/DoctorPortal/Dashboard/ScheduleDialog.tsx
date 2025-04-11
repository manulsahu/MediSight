
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ScheduleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ScheduleDialog = ({ open, onOpenChange }: ScheduleDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Doctor Schedule</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="day">
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
          <TabsContent value="day" className="h-[400px] overflow-auto">
            <div className="space-y-4">
              <div className="text-center font-medium py-2 border-b">
                Today, April 6, 2025
              </div>
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => {
                  const hour = 8 + i;
                  const isPast = hour < 10;
                  const isCurrent = hour === 10;
                  
                  return (
                    <div 
                      key={i} 
                      className={`p-3 border rounded-md ${
                        isPast ? 'opacity-60' : 
                        isCurrent ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{`${hour}:00 AM`}</span>
                        {i === 2 && <Badge>Appointment</Badge>}
                      </div>
                      
                      {i === 2 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">John Doe</p>
                          <p className="text-xs text-muted-foreground">Follow-up consultation</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="week">
            <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
              <p>Week view coming soon</p>
            </div>
          </TabsContent>
          <TabsContent value="month">
            <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
              <p>Month view coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;
