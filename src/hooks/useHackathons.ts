
import { useState, useEffect } from "react";
import Hackathon from "@/models/Hackathon"; // Import the Mongoose Hackathon model
import { toast } from "@/components/ui/use-toast";

interface HackathonType { // Renamed to avoid conflict with Mongoose model
  id: string;
  name: string;
  date: string;
  location: string;
  max_participants?: number;
  current_participants?: number;
  description: string;
  status?: string;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  college_name?: string;
  coordinator_name?: string;
  coordinator_email?: string;
  coordinator_phone?: string;
  skill_level?: string;
  team_size_min?: number;
  team_size_max?: number;
  registration_deadline?: string;
  prize_pool?: number;
  technologies?: string[];
  image_url?: string;
  website_url?: string;
}

export const useHackathons = () => {
  const [hackathons, setHackathons] = useState<HackathonType[]>([]);
  const [filteredHackathons, setFilteredHackathons] = useState<HackathonType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  const fetchHackathons = async () => {
    try {
      // Mongoose query to fetch hackathons
      const data = await Hackathon.find().sort({ date: 1 });

      setHackathons(data.map(doc => ({ ...doc.toObject(), id: doc._id.toString() })) || []);
      setFilteredHackathons(data.map(doc => ({ ...doc.toObject(), id: doc._id.toString() })) || []);
    } catch (error: any) {
      console.error("Error fetching hackathons:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch hackathons",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHackathon = async (id: string) => {
    try {
      // Mongoose query to delete a hackathon
      const result = await Hackathon.findByIdAndDelete(id);

      if (!result) throw new Error("Hackathon not found");

      setHackathons(hackathons.filter((h) => h.id !== id));
      setFilteredHackathons(filteredHackathons.filter((h) => h.id !== id));
      
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

  useEffect(() => {
    let filtered = [...hackathons];

    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        hackathon => hackathon.status === selectedStatus
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        hackathon => hackathon.date === selectedDate
      );
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        hackathon =>
          hackathon.name.toLowerCase().includes(searchLower) ||
          hackathon.description.toLowerCase().includes(searchLower) ||
          hackathon.location.toLowerCase().includes(searchLower) ||
          (hackathon.college_name && hackathon.college_name.toLowerCase().includes(searchLower)) ||
          (hackathon.technologies && hackathon.technologies.some(tech => 
            tech.toLowerCase().includes(searchLower)
          ))
      );
    }

    setFilteredHackathons(filtered);
  }, [hackathons, selectedStatus, selectedDate, searchTerm]);

  useEffect(() => {
    fetchHackathons();
  }, []);

  return {
    hackathons: filteredHackathons,
    loading,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedDate,
    setSelectedDate,
    handleDeleteHackathon,
    fetchHackathons,
  };
};
