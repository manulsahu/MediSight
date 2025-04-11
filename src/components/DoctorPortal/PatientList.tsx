
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search } from "lucide-react";
import { PatientCard } from "./PatientCard";

type PatientListProps = {
  patients: any[];
  onSelectPatient: (patient: any) => void;
};

export const PatientList = ({ patients, onSelectPatient }: PatientListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Apply strict null checks to prevent toLowerCase errors
  const filteredPatients = searchTerm 
    ? patients.filter(p => {
        if (!p) return false;
        
        const name = p.name || "";
        const email = p.email || "";
        const condition = p.condition || "";
        const searchTermLower = searchTerm.toLowerCase();
        
        return name.toLowerCase().includes(searchTermLower) || 
               email.toLowerCase().includes(searchTermLower) ||
               condition.toLowerCase().includes(searchTermLower);
      })
    : patients;
    
  return (
    <div className="mb-6">
      <div className="flex gap-2 mb-4">
        <Input 
          placeholder="Search patients..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Button>
          <Search size={18} className="mr-2" />
          Search
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center">
            <Users size={18} className="mr-2" />
            Patients ({filteredPatients.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredPatients.map((patient) => (
              patient && <PatientCard 
                key={patient.id} 
                patient={patient} 
                onClick={() => onSelectPatient(patient)} 
              />
            ))}
            
            {filteredPatients.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No patients found matching "{searchTerm}"
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
