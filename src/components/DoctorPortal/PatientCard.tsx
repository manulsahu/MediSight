
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type PatientCardProps = {
  patient: {
    id: string;
    name: string;
    avatar: string;
    lastVisit: string;
    condition: string;
  };
  onClick: (patient: any) => void;
};

export const PatientCard = ({ patient, onClick }: PatientCardProps) => {
  return (
    <div
      key={patient.id}
      className="p-4 cursor-pointer hover:bg-muted/50 flex justify-between items-center"
      onClick={() => onClick(patient)}
    >
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={patient.avatar} />
          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{patient.name}</h3>
          <p className="text-sm text-muted-foreground">
            Last visit: {patient.lastVisit}
          </p>
        </div>
      </div>
      <Badge variant="outline">{patient.condition}</Badge>
    </div>
  );
};
