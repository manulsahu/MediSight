
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type MedicationManagerProps = {
  patient: any;
  setPatient: React.Dispatch<React.SetStateAction<any>>;
};

export const MedicationManager = ({ patient, setPatient }: MedicationManagerProps) => {
  const { toast } = useToast();
  const [showAddMedicationDialog, setShowAddMedicationDialog] = useState(false);
  const [showEditMedicationDialog, setShowEditMedicationDialog] = useState(false);
  const [editingMedicationIndex, setEditingMedicationIndex] = useState<number | null>(null);
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: ""
  });
  
  const frequencyOptions = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "Every other day",
    "Once weekly",
    "As needed"
  ];
  
  const timeOptions = [
    "Morning",
    "Noon",
    "Afternoon",
    "Evening",
    "Bedtime",
    "With meals",
    "Before meals",
    "After meals",
    "Morning/Evening",
    "As needed"
  ];
  
  const handleAddMedication = () => {
    if (!patient) return;
    
    // Validate inputs
    if (!newMedication.name.trim() || !newMedication.dosage.trim() || 
        !newMedication.frequency || !newMedication.time) {
      toast({
        title: "Incomplete information",
        description: "Please fill in all medication details",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would update the Firestore record
    const updatedPatient = {...patient};
    updatedPatient.medications = [...(updatedPatient.medications || []), {...newMedication}];
    setPatient(updatedPatient);
    
    toast({
      title: "Medication added",
      description: `${newMedication.name} has been added to the patient's medications.`
    });
    
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      time: ""
    });
    setShowAddMedicationDialog(false);
  };
  
  const handleEditMedication = () => {
    if (!patient || editingMedicationIndex === null) return;
    
    // Validate inputs
    if (!newMedication.name.trim() || !newMedication.dosage.trim() || 
        !newMedication.frequency || !newMedication.time) {
      toast({
        title: "Incomplete information",
        description: "Please fill in all medication details",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would update the Firestore record
    const updatedPatient = {...patient};
    updatedPatient.medications[editingMedicationIndex] = {...newMedication};
    setPatient(updatedPatient);
    
    toast({
      title: "Medication updated",
      description: `${newMedication.name} has been updated.`
    });
    
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      time: ""
    });
    setShowEditMedicationDialog(false);
    setEditingMedicationIndex(null);
  };
  
  const handleDeleteMedication = (index: number) => {
    if (!patient) return;
    
    const medicationName = patient.medications[index].name;
    const updatedPatient = {...patient};
    updatedPatient.medications = updatedPatient.medications.filter((_: any, i: number) => i !== index);
    setPatient(updatedPatient);
    
    toast({
      title: "Medication removed",
      description: `${medicationName} has been removed from the patient's medications.`
    });
  };
  
  const openEditDialog = (index: number) => {
    if (!patient || !patient.medications[index]) return;
    
    setNewMedication({...patient.medications[index]});
    setEditingMedicationIndex(index);
    setShowEditMedicationDialog(true);
  };
  
  if (!patient) return null;

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAddMedicationDialog(true)}
            >
              <Plus size={14} className="mr-1" />
              Add Medication
            </Button>
            {patient.medications && patient.medications.length > 0 ? (
              patient.medications.map((med: any, idx: number) => (
                <div key={idx} className="p-3 border rounded-md">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{med.name} ({med.dosage})</p>
                      <p className="text-xs text-muted-foreground">
                        {med.frequency} • {med.time}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(idx)}>
                        <Edit size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteMedication(idx)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No medications prescribed yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Medication Dialog */}
      <Dialog open={showAddMedicationDialog} onOpenChange={setShowAddMedicationDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Medication</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium" htmlFor="med-name">Medication Name</label>
              <Input
                id="med-name"
                value={newMedication.name}
                onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                placeholder="e.g., Lisinopril"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="med-dosage">Dosage</label>
              <Input
                id="med-dosage"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                placeholder="e.g., 10mg"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="med-frequency">Frequency</label>
              <Select 
                value={newMedication.frequency} 
                onValueChange={(value) => setNewMedication({...newMedication, frequency: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="med-time">Time</label>
              <Select 
                value={newMedication.time} 
                onValueChange={(value) => setNewMedication({...newMedication, time: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMedicationDialog(false)}>Cancel</Button>
            <Button onClick={handleAddMedication}>Add Medication</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Medication Dialog */}
      <Dialog open={showEditMedicationDialog} onOpenChange={setShowEditMedicationDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Medication</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium" htmlFor="edit-med-name">Medication Name</label>
              <Input
                id="edit-med-name"
                value={newMedication.name}
                onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="edit-med-dosage">Dosage</label>
              <Input
                id="edit-med-dosage"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="edit-med-frequency">Frequency</label>
              <Select 
                value={newMedication.frequency} 
                onValueChange={(value) => setNewMedication({...newMedication, frequency: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="edit-med-time">Time</label>
              <Select 
                value={newMedication.time} 
                onValueChange={(value) => setNewMedication({...newMedication, time: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditMedicationDialog(false)}>Cancel</Button>
            <Button onClick={handleEditMedication}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
