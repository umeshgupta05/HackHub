
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import HackathonCard from "@/components/HackathonCard";
import Filters from "@/components/Filters";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Hackathon {
  id: string;
  name: string;
  date: string;
  location: string;
  max_participants: number;
  current_participants: number;
  description: string;
  status: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [filteredHackathons, setFilteredHackathons] = useState<Hackathon[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications] = useState([]);
  const [newHackathon, setNewHackathon] = useState({
    name: "",
    date: "",
    location: "",
    maxParticipants: "",
    description: "",
  });

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setUserProfile(profile);
    };

    const fetchHackathons = async () => {
      const { data, error } = await supabase
        .from("hackathons")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch hackathons",
        });
      } else {
        setHackathons(data || []);
        setFilteredHackathons(data || []);
      }
      setLoading(false);
    };

    getUserProfile();
    fetchHackathons();
  }, [navigate]);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let filtered = [...hackathons];

    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        hackathon => hackathon.status === selectedStatus
      );
    }

    // Apply date filter
    if (selectedDate) {
      filtered = filtered.filter(
        hackathon => hackathon.date === selectedDate
      );
    }

    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        hackathon =>
          hackathon.name.toLowerCase().includes(searchLower) ||
          hackathon.description.toLowerCase().includes(searchLower) ||
          hackathon.location.toLowerCase().includes(searchLower)
      );
    }

    setFilteredHackathons(filtered);
  }, [hackathons, selectedStatus, selectedDate, searchTerm]);

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

      setFormOpen(false);
      toast({
        title: "Success",
        description: "Hackathon added successfully!",
      });

      // Refresh hackathons list
      const { data } = await supabase
        .from("hackathons")
        .select("*")
        .order("created_at", { ascending: false });
      setHackathons(data || []);

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

  const handleDeleteHackathon = async (id: string) => {
    try {
      const { error } = await supabase
        .from("hackathons")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setHackathons(hackathons.filter((h) => h.id !== id));
      toast({
        title: "Success",
        description: "Hackathon deleted successfully",
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
    <div className="min-h-screen bg-gray-50">
      <Navigation
        onAddHackathon={() => setFormOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        notifications={notifications}
        userProfile={userProfile}
      />

      <main className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <Filters
            selectedStatus={selectedStatus}
            selectedSkillLevel={selectedSkillLevel}
            onStatusChange={setSelectedStatus}
            onSkillLevelChange={setSelectedSkillLevel}
            skillLevels={["Beginner", "Intermediate", "Advanced"]}
          />
          <div className="w-full md:w-auto">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full md:w-auto"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {filteredHackathons.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No hackathons found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
                {filteredHackathons.map((hackathon) => (
                  <HackathonCard
                    key={hackathon.id}
                    hackathon={hackathon}
                    onDelete={handleDeleteHackathon}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
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
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFormSubmit}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
