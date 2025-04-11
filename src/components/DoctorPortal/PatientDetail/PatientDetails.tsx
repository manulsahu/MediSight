
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PatientHeader } from "./PatientHeader";
import { PatientInfo } from "./PatientInfo";
import { MedicalReports } from "./MedicalReports";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type PatientDetailsProps = {
  patient: any;
  setPatient: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
};

export const PatientDetails = ({ patient, setPatient, onClose }: PatientDetailsProps) => {
  const { toast } = useToast();
  const [editingBasicInfo, setEditingBasicInfo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSavePatientInfo = async () => {
    if (!patient || !patient.id) return;
    
    setIsSaving(true);
    try {
      // Update patient data in Firestore
      const patientRef = doc(db, "patients", patient.id);
      await updateDoc(patientRef, {
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        address: patient.address,
        dob: patient.dob,
        bloodType: patient.bloodType,
        condition: patient.condition,
        allergies: patient.allergies,
        updatedAt: serverTimestamp()
      });
      
      setEditingBasicInfo(false);
      toast({
        title: "Patient information updated",
        description: "The patient information has been updated successfully."
      });
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating the patient information.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!patient) return null;
  
  // Ensure all arrays exist with defaults if they're undefined
  const patientWithDefaults = {
    ...patient,
    reports: patient.reports || [],
  };
  
  return (
    <div className="py-6">
      <PatientHeader 
        patient={patientWithDefaults}
        editingBasicInfo={editingBasicInfo}
        setEditingBasicInfo={setEditingBasicInfo}
        onSave={handleSavePatientInfo}
      />

      {/* Patient Information */}
      <div className="space-y-6">
        <PatientInfo 
          patient={patientWithDefaults}
          editingBasicInfo={editingBasicInfo}
          onSave={handleSavePatientInfo}
          setPatient={setPatient}
        />

        <MedicalReports patient={patientWithDefaults} setPatient={setPatient} />

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} disabled={isSaving}>Close</Button>
        </div>
      </div>
    </div>
  );
};
