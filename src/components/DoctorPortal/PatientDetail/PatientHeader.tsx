
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";

type PatientHeaderProps = {
  patient: any;
  editingBasicInfo: boolean;
  setEditingBasicInfo: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: () => void;
};

export const PatientHeader = ({ 
  patient, 
  editingBasicInfo, 
  setEditingBasicInfo, 
  onSave 
}: PatientHeaderProps) => {
  if (!patient) return null;
  
  return (
    <div className="flex items-center gap-3 mb-6">
      <Avatar className="h-16 w-16">
        <AvatarImage src={patient.avatar} />
        <AvatarFallback className="text-2xl">{patient.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{patient.name}</h2>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => {
                if (editingBasicInfo) {
                  onSave();
                } else {
                  setEditingBasicInfo(true);
                }
              }}
            >
              {editingBasicInfo ? (
                <><Save size={16} className="mr-1" /> Save</>
              ) : (
                <><Edit size={16} className="mr-1" /> Edit</>
              )}
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{patient.email}</p>
      </div>
    </div>
  );
};
