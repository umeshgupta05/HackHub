
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
}

export const AddHackathonDialog = ({ open, onOpenChange, onHackathonAdded }: AddHackathonDialogProps) => {
  const [newHackathon, setNewHackathon] = React.useState<NewHackathon>({
    name: "",
    date: "",
    location: "",
    maxParticipants: "",
    description: "",
  });

  const handleFormSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("hackathons").insert([{
        name: newHackathon.name,
        date: newHackathon.date,
        location: newHackathon.location,
        max_participants: parseInt(newHackathon.maxParticipants),
        description: newHackathon.description,
        created_by: user.id
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Hackathon</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={newHackathon.name}
              onChange={(e) => setNewHackathon({ ...newHackathon, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={newHackathon.date}
              onChange={(e) => setNewHackathon({ ...newHackathon, date: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input
              value={newHackathon.location}
              onChange={(e) => setNewHackathon({ ...newHackathon, location: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Max Participants</label>
            <Input
              type="number"
              value={newHackathon.maxParticipants}
              onChange={(e) => setNewHackathon({ ...newHackathon, maxParticipants: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
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
