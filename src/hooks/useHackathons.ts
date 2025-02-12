
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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

export const useHackathons = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [filteredHackathons, setFilteredHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

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
          hackathon.location.toLowerCase().includes(searchLower)
      );
    }

    setFilteredHackathons(filtered);
  }, [hackathons, selectedStatus, selectedDate, searchTerm]);

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
