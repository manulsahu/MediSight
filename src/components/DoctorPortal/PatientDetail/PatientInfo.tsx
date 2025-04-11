import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clipboard, Save } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

type PatientInfoProps = {
  patient: any;
  editingBasicInfo: boolean;
  onSave: () => void;
  setPatient: React.Dispatch<React.SetStateAction<any>>;
};

export const PatientInfo = ({ patient, editingBasicInfo, onSave, setPatient }: PatientInfoProps) => {
  if (!patient) return null;
  
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center">
          <Clipboard size={16} className="mr-2" />
          Basic Information
        </CardTitle>
        {editingBasicInfo && (
          <Button size="sm" onClick={onSave}>
            <Save size={16} className="mr-1" />
            Save
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {editingBasicInfo ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input 
                value={patient.name}
                onChange={(e) => setPatient({...patient, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input 
                value={patient.phone}
                onChange={(e) => setPatient({...patient, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input 
                value={patient.email}
                type="email"
                onChange={(e) => setPatient({...patient, email: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input 
                value={patient.address}
                onChange={(e) => setPatient({...patient, address: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date of Birth</label>
              <Input 
                value={patient.dob}
                type="date"
                onChange={(e) => setPatient({...patient, dob: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Blood Type</label>
              <Select 
                value={patient.bloodType || ""} 
                onValueChange={(value) => setPatient({...patient, bloodType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Condition</label>
              <Input 
                value={patient.condition}
                onChange={(e) => setPatient({...patient, condition: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Allergies</label>
              <Input 
                value={patient.allergies}
                onChange={(e) => setPatient({...patient, allergies: e.target.value})}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-muted-foreground">Phone</p>
              <p>{patient.phone}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Date of Birth</p>
              <p>{patient.dob}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Email</p>
              <p>{patient.email}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Blood Type</p>
              <p>{patient.bloodType || "Not specified"}</p>
            </div>
            <div className="col-span-2">
              <p className="font-medium text-muted-foreground">Address</p>
              <p>{patient.address}</p>
            </div>
            <div className="col-span-2">
              <p className="font-medium text-muted-foreground">Condition</p>
              <p>{patient.condition}</p>
            </div>
            <div className="col-span-2">
              <p className="font-medium text-muted-foreground">Allergies</p>
              <p>{patient.allergies}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
