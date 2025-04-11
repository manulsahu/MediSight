
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock medication data - would come from Firestore in a real app
const medications = [
  {
    id: "1",
    name: "Amoxicillin",
    dosage: "500mg",
    frequency: "3 times daily",
    prescribedBy: "Dr. Smith",
    prescribedDate: "2025-03-20",
    endDate: "2025-04-28",
    instructions: "Take with food",
    remaining: 15,
  },
  {
    id: "2",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    prescribedBy: "Dr. Johnson",
    prescribedDate: "2025-03-10",
    endDate: "2025-10-10",
    instructions: "Take in the morning",
    remaining: 45,
  },
  {
    id: "3",
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    prescribedBy: "Dr. Smith",
    prescribedDate: "2025-02-15",
    endDate: "2025-05-15",
    instructions: "Take in the evening",
    remaining: 20,
  },
];

const MedicationList = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Prescribed Medications</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {medications.map((medication) => (
            <div key={medication.id} className="p-4 hover:bg-muted/50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{medication.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {medication.dosage} · {medication.frequency}
                  </p>
                </div>
                <Badge variant="outline">
                  {medication.remaining} left
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-2">
                <div>
                  <span className="block text-xs">Prescribed by</span>
                  <span>{medication.prescribedBy}</span>
                </div>
                <div>
                  <span className="block text-xs">End Date</span>
                  <span>{medication.endDate}</span>
                </div>
              </div>
              
              <p className="text-sm mt-2 text-muted-foreground italic">{medication.instructions}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationList;
