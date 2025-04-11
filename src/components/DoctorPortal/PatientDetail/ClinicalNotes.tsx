
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type ClinicalNotesProps = {
  patient: any;
  editingNotes: boolean;
  setEditingNotes: React.Dispatch<React.SetStateAction<boolean>>;
  onSaveNotes: () => void;
  setPatient: React.Dispatch<React.SetStateAction<any>>;
};

export const ClinicalNotes = ({ 
  patient, 
  editingNotes, 
  setEditingNotes, 
  onSaveNotes, 
  setPatient 
}: ClinicalNotesProps) => {
  if (!patient) return null;
  
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base">Clinical Notes</CardTitle>
        {editingNotes ? (
          <Button size="sm" onClick={onSaveNotes}>
            <Save size={16} className="mr-1" />
            Save
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setEditingNotes(true)}>
            <Edit size={16} className="mr-1" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {editingNotes ? (
          <Textarea 
            value={patient.notes} 
            onChange={(e) => setPatient({...patient, notes: e.target.value})}
            rows={4}
            className="w-full"
          />
        ) : (
          <p className="text-sm">{patient.notes}</p>
        )}
      </CardContent>
    </Card>
  );
};
