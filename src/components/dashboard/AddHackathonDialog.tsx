
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface AddHackathonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHackathonAdded: () => void;
}

interface NewHackathon {
  name: string;
  date: string;
  location: string;
  maxParticipants: string;
  description: string;
  collegeName: string;
  coordinatorName: string;
  coordinatorEmail: string;
  coordinatorPhone: string;
  skillLevel: string;
  teamSizeMin: string;
  teamSizeMax: string;
  registrationDeadline: string;
  prizePool: string;
  technologies: string;
}

export const AddHackathonDialog = ({ open, onOpenChange, onHackathonAdded }: AddHackathonDialogProps) => {
  const [newHackathon, setNewHackathon] = useState<NewHackathon>({
    name: "",
    date: "",
    location: "",
    maxParticipants: "",
    description: "",
    collegeName: "",
    coordinatorName: "",
    coordinatorEmail: "",
    coordinatorPhone: "",
    skillLevel: "All Levels",
    teamSizeMin: "1",
    teamSizeMax: "4",
    registrationDeadline: "",
    prizePool: "",
    technologies: "",
  });

  const validateForm = () => {
    const requiredFields = [
      "name", "date", "location", "maxParticipants", "description",
      "collegeName", "coordinatorName", "coordinatorEmail", "coordinatorPhone",
      "registrationDeadline"
    ];
    
    const missingFields = requiredFields.filter(field => !newHackathon[field as keyof NewHackathon]);
    
    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: `Please fill in all required fields: ${missingFields.join(", ")}`,
      });
      return false;
    }

    if (!newHackathon.coordinatorEmail.includes("@")) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid coordinator email address",
      });
      return false;
    }

    return true;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("hackathons").insert([{
        name: newHackathon.name,
        date: newHackathon.date,
        location: newHackathon.location,
        max_participants: parseInt(newHackathon.maxParticipants),
        description: newHackathon.description,
        created_by: user.id,
        college_name: newHackathon.collegeName,
        coordinator_name: newHackathon.coordinatorName,
        coordinator_email: newHackathon.coordinatorEmail,
        coordinator_phone: newHackathon.coordinatorPhone,
        skill_level: newHackathon.skillLevel,
        team_size_min: parseInt(newHackathon.teamSizeMin),
        team_size_max: parseInt(newHackathon.teamSizeMax),
        registration_deadline: newHackathon.registrationDeadline,
        prize_pool: parseFloat(newHackathon.prizePool) || 0,
        technologies: newHackathon.technologies.split(",").map(t => t.trim()).filter(t => t),
      }]);

      if (error) throw error;

      onOpenChange(false);
      toast({
        title: "Success",
        description: "Hackathon added successfully!",
      });

      onHackathonAdded();

      // Reset form
      setNewHackathon({
        name: "",
        date: "",
        location: "",
        maxParticipants: "",
        description: "",
        collegeName: "",
        coordinatorName: "",
        coordinatorEmail: "",
        coordinatorPhone: "",
        skillLevel: "All Levels",
        teamSizeMin: "1",
        teamSizeMax: "4",
        registrationDeadline: "",
        prizePool: "",
        technologies: "",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Hackathon</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name*</label>
              <Input
                value={newHackathon.name}
                onChange={(e) => setNewHackathon({ ...newHackathon, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">College Name*</label>
              <Input
                value={newHackathon.collegeName}
                onChange={(e) => setNewHackathon({ ...newHackathon, collegeName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Date*</label>
              <Input
                type="date"
                value={newHackathon.date}
                onChange={(e) => setNewHackathon({ ...newHackathon, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Registration Deadline*</label>
              <Input
                type="date"
                value={newHackathon.registrationDeadline}
                onChange={(e) => setNewHackathon({ ...newHackathon, registrationDeadline: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Location*</label>
              <Input
                value={newHackathon.location}
                onChange={(e) => setNewHackathon({ ...newHackathon, location: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Participants*</label>
              <Input
                type="number"
                value={newHackathon.maxParticipants}
                onChange={(e) => setNewHackathon({ ...newHackathon, maxParticipants: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Coordinator Name*</label>
              <Input
                value={newHackathon.coordinatorName}
                onChange={(e) => setNewHackathon({ ...newHackathon, coordinatorName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Coordinator Email*</label>
              <Input
                type="email"
                value={newHackathon.coordinatorEmail}
                onChange={(e) => setNewHackathon({ ...newHackathon, coordinatorEmail: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Coordinator Phone*</label>
              <Input
                value={newHackathon.coordinatorPhone}
                onChange={(e) => setNewHackathon({ ...newHackathon, coordinatorPhone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Prize Pool</label>
              <Input
                type="number"
                value={newHackathon.prizePool}
                onChange={(e) => setNewHackathon({ ...newHackathon, prizePool: e.target.value })}
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Min Team Size</label>
              <Input
                type="number"
                value={newHackathon.teamSizeMin}
                onChange={(e) => setNewHackathon({ ...newHackathon, teamSizeMin: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Team Size</label>
              <Input
                type="number"
                value={newHackathon.teamSizeMax}
                onChange={(e) => setNewHackathon({ ...newHackathon, teamSizeMax: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Technologies (comma-separated)</label>
            <Input
              value={newHackathon.technologies}
              onChange={(e) => setNewHackathon({ ...newHackathon, technologies: e.target.value })}
              placeholder="React, Node.js, Python, etc."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description*</label>
            <Textarea
              value={newHackathon.description}
              onChange={(e) => setNewHackathon({ ...newHackathon, description: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleFormSubmit}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
