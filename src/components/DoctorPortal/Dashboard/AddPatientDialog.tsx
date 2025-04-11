
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AddPatientDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPatient: () => void;
};

const AddPatientDialog = ({
  open,
  onOpenChange,
  onAddPatient,
}: AddPatientDialogProps) => {
  const { toast } = useToast();
  const [patientData, setPatientData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    bloodType: "",
    allergies: ""
  });
  
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPatientData({
      ...patientData,
      [id.replace("patient", "").toLowerCase()]: value
    });
  };
  
  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!patientData.name || !patientData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in at least the name and email fields.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, add patient to Firestore
    // Add code here to store the patient in Firebase
    
    // Clear form
    setPatientData({
      name: "",
      email: "",
      phone: "",
      address: "",
      dob: "",
      bloodType: "",
      allergies: ""
    });
    
    // Call the onAddPatient callback
    onAddPatient();
    
    // Show success message
    toast({
      title: "Patient Added",
      description: `${patientData.name} has been added successfully.`
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleAddPatient}>
          <div className="space-y-2">
            <Label htmlFor="patientName">Full Name <span className="text-red-500">*</span></Label>
            <Input 
              id="patientName" 
              placeholder="Enter patient name" 
              value={patientData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientEmail">Email <span className="text-red-500">*</span></Label>
            <Input 
              id="patientEmail" 
              type="email" 
              placeholder="Enter patient email"
              value={patientData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientPhone">Phone Number</Label>
            <Input 
              id="patientPhone" 
              placeholder="Enter patient phone number"
              value={patientData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientAddress">Address</Label>
            <Input 
              id="patientAddress" 
              placeholder="Enter patient address"
              value={patientData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientDOB">Date of Birth</Label>
            <Input 
              id="patientDOB" 
              type="date"
              value={patientData.dob}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientBloodType">Blood Type</Label>
            <Select 
              value={patientData.bloodType} 
              onValueChange={(value) => setPatientData({...patientData, bloodType: value})}
            >
              <SelectTrigger id="patientBloodType">
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                {bloodTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientAllergies">Allergies</Label>
            <Input 
              id="patientAllergies" 
              placeholder="Enter patient allergies (or None)"
              value={patientData.allergies}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Patient</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientDialog;
