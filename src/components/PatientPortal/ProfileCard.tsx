
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Edit2, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { updateUserProfile } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ProfileCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    bloodType: "",
    allergies: "",
    emergencyContact: "",
  });

  useEffect(() => {
    // Load patient profile data from Firestore when dialog opens
    const fetchPatientProfile = async () => {
      if (!user?.uid || !editDialog) return;
      
      setIsLoading(true);
      try {
        const docRef = doc(db, "patients", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData({
            displayName: user.displayName || data.name || "",
            phoneNumber: data.phone || "",
            address: data.address || "",
            dateOfBirth: data.dob || "",
            bloodType: data.bloodType || "",
            allergies: data.allergies || "",
            emergencyContact: data.emergencyContact || "",
          });
        } else {
          // If no profile exists yet, initialize with user data
          setProfileData({
            displayName: user.displayName || "",
            phoneNumber: "",
            address: "",
            dateOfBirth: "",
            bloodType: "",
            allergies: "",
            emergencyContact: "",
          });
        }
      } catch (error) {
        console.error("Error fetching patient profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatientProfile();
  }, [user, editDialog]);

  const handleEditProfile = () => {
    setEditDialog(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update Firebase Auth display name
      await updateUserProfile(user, { displayName: profileData.displayName });
      
      // Save to Firestore
      const patientRef = doc(db, "patients", user.uid);
      await setDoc(patientRef, {
        name: profileData.displayName,
        phone: profileData.phoneNumber,
        address: profileData.address,
        dob: profileData.dateOfBirth,
        bloodType: profileData.bloodType,
        allergies: profileData.allergies,
        emergencyContact: profileData.emergencyContact,
        updatedAt: new Date()
      }, { merge: true });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setEditDialog(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 cursor-pointer" onClick={handleEditProfile}>
        <AvatarImage src={user?.photoURL || ""} />
        <AvatarFallback>{user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">{user?.displayName || user?.email?.split("@")[0] || "User"}</div>
        <div className="text-xs text-muted-foreground">Patient</div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center mb-4">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={user?.photoURL || ""} />
                  <AvatarFallback>{profileData.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <Button size="sm" variant="outline">Change Photo</Button>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm" htmlFor="displayName">Name</label>
                <Input
                  id="displayName"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm" htmlFor="email">Email</label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm" htmlFor="phone">Phone</label>
                <Input
                  id="phone"
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm" htmlFor="address">Address</label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm" htmlFor="dob">Birth Date</label>
                <Input
                  id="dob"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm" htmlFor="bloodType">Blood Type</label>
                <Input
                  id="bloodType"
                  value={profileData.bloodType}
                  onChange={(e) => setProfileData({...profileData, bloodType: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm" htmlFor="allergies">Allergies</label>
                <Input
                  id="allergies"
                  value={profileData.allergies}
                  onChange={(e) => setProfileData({...profileData, allergies: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm" htmlFor="emergency">Emergency Contact</label>
                <Input
                  id="emergency"
                  value={profileData.emergencyContact}
                  onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileCard;
