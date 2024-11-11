// app/admin/dashboard/teams/components/new-team-dialog.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPlus, Timer, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

export function NewTeamDialog({ open, onOpenChange }) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Add a new team to the activity
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label>Team Name</Label>
              <Input placeholder="Enter team name" />
            </div>
            <div>
              <Label>Team Members</Label>
              <div className="space-y-2">
                <Input placeholder="Enter email address" />
                <Button type="button" variant="outline" size="sm" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Another Member
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Team</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }