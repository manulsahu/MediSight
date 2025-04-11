
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

// Mock medication schedule - would come from Firestore in a real app
const todaySchedule = [
  {
    id: "1",
    medicationName: "Amoxicillin",
    dosage: "500mg",
    time: "08:00 AM",
    taken: true,
  },
  {
    id: "2",
    medicationName: "Lisinopril",
    dosage: "10mg",
    time: "09:00 AM",
    taken: true,
  },
  {
    id: "3",
    medicationName: "Amoxicillin",
    dosage: "500mg",
    time: "02:00 PM",
    taken: false,
  },
  {
    id: "4",
    medicationName: "Atorvastatin",
    dosage: "20mg",
    time: "08:00 PM",
    taken: false,
  },
  {
    id: "5",
    medicationName: "Amoxicillin",
    dosage: "500mg",
    time: "10:00 PM",
    taken: false,
  },
];

const MedicationSchedule = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Today's Schedule</CardTitle>
        <p className="text-sm text-muted-foreground">{today}</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {todaySchedule.map((schedule) => (
            <div
              key={schedule.id}
              className={`p-4 flex justify-between items-center ${
                schedule.taken ? "bg-muted/30" : "hover:bg-muted/10"
              }`}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`font-medium ${
                      schedule.taken ? "text-muted-foreground line-through" : ""
                    }`}
                  >
                    {schedule.medicationName}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({schedule.dosage})
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{schedule.time}</p>
              </div>
              
              {schedule.taken ? (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  <Check size={14} className="mr-1" /> Taken
                </Badge>
              ) : (
                <Badge>Due</Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationSchedule;
