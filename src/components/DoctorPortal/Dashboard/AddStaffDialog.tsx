
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AddStaffDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStaff: () => void;
};

const AddStaffDialog = ({
  open,
  onOpenChange,
  onAddStaff,
}: AddStaffDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onAddStaff(); }}>
          <div className="space-y-2">
            <Label htmlFor="staffName">Full Name</Label>
            <Input id="staffName" placeholder="Enter staff name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staffEmail">Email</Label>
            <Input id="staffEmail" type="email" placeholder="Enter staff email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staffRole">Role</Label>
            <Input id="staffRole" placeholder="E.g. Nurse, Receptionist, etc." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staffPhone">Phone Number</Label>
            <Input id="staffPhone" placeholder="Enter staff phone number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staffAccess">Access Level</Label>
            <select 
              id="staffAccess" 
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="basic">Basic (View Only)</option>
              <option value="standard">Standard (View & Edit)</option>
              <option value="admin">Admin (Full Access)</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Staff</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffDialog;
