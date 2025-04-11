
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Save, Loader2 } from "lucide-react";
import { User } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

type DoctorProfileProps = {
  user: User | null;
  open: boolean;
  onClose: () => void;
};

export const DoctorProfile = ({ user, open, onClose }: DoctorProfileProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    specialization: "Primary Care Physician",
    licenseNumber: "MD-12345-FL",
    contactPhone: "+1 (555) 987-6543",
    officeHours: "Monday to Friday, 9:00 AM - 5:00 PM",
    photoUrl: ""
  });

  useEffect(() => {
    // Load doctor profile data from Firestore when dialog opens
    const fetchDoctorProfile = async () => {
      if (!user?.uid || !open) return;
      
      setIsLoading(true);
      try {
        const docRef = doc(db, "doctors", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData({
            name: data.name || user.displayName || "",
            specialization: data.specialization || "Primary Care Physician",
            licenseNumber: data.licenseNumber || "MD-12345-FL",
            contactPhone: data.contactPhone || "+1 (555) 987-6543",
            officeHours: data.officeHours || "Monday to Friday, 9:00 AM - 5:00 PM",
            photoUrl: data.photoUrl || user.photoURL || ""
          });
        } else {
          // If no profile exists yet, initialize with user data
          setProfileData({
            name: user.displayName || "",
            specialization: "Primary Care Physician",
            licenseNumber: "MD-12345-FL",
            contactPhone: "+1 (555) 987-6543",
            officeHours: "Monday to Friday, 9:00 AM - 5:00 PM",
            photoUrl: user.photoURL || ""
          });
        }
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctorProfile();
  }, [user, open]);

  const handleSaveProfile = async () => {
    if (!user?.uid) return;
    
    setIsLoading(true);
    try {
      // Save to Firestore
      const docRef = doc(db, "doctors", user.uid);
      await setDoc(docRef, {
        name: profileData.name,
        specialization: profileData.specialization,
        licenseNumber: profileData.licenseNumber,
        contactPhone: profileData.contactPhone,
        officeHours: profileData.officeHours,
        photoUrl: profileData.photoUrl,
        updatedAt: new Date()
      }, { merge: true });
      
      // Also update the user document to ensure name is updated everywhere
      await updateDoc(doc(db, "users", user.uid), {
        name: profileData.name
      });
      
      // Update the auth profile to ensure displayName is updated
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: profileData.name
        });
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
      
      onClose();
    } catch (error) {
      console.error("Error saving doctor profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <span>Doctor Profile</span>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center mb-4">
            <Avatar className="h-20 w-20 mb-4">
              <AvatarImage src={user?.photoURL || ""} />
              <AvatarFallback>{profileData.name?.charAt(0) || user?.email?.charAt(0) || "D"}</AvatarFallback>
            </Avatar>
            <Input 
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              className="max-w-[250px] text-center"
            />
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 border rounded-md">
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Specialization</h4>
              <Input 
                value={profileData.specialization}
                onChange={(e) => setProfileData({...profileData, specialization: e.target.value})}
              />
            </div>
            <div className="p-4 border rounded-md">
              <h4 className="font-medium text-sm text-muted-foreground mb-1">License Number</h4>
              <Input 
                value={profileData.licenseNumber}
                onChange={(e) => setProfileData({...profileData, licenseNumber: e.target.value})}
              />
            </div>
            <div className="p-4 border rounded-md">
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Contact</h4>
              <Input 
                value={profileData.contactPhone}
                onChange={(e) => setProfileData({...profileData, contactPhone: e.target.value})}
              />
            </div>
            <div className="p-4 border rounded-md">
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Office Hours</h4>
              <Input 
                value={profileData.officeHours}
                onChange={(e) => setProfileData({...profileData, officeHours: e.target.value})}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-end">
          <Button 
            variant="default" 
            className="mr-2" 
            onClick={handleSaveProfile} 
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save size={16} className="mr-2" />
            )}
            Save Changes
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
