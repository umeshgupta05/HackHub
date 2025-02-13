
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import Filters from "@/components/Filters";
import { useHackathons } from "@/hooks/useHackathons";
import { HackathonGrid } from "@/components/dashboard/HackathonGrid";
import { AddHackathonDialog } from "@/components/dashboard/AddHackathonDialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [notifications] = useState([]);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("all");

  const {
    hackathons,
    loading,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedDate,
    setSelectedDate,
    handleDeleteHackathon,
    fetchHackathons,
  } = useHackathons();

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

    getUserProfile();
  }, [navigate]);

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
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6">
          <div className="w-full md:w-auto">
            <Filters
              selectedStatus={selectedStatus}
              selectedSkillLevel={selectedSkillLevel}
              onStatusChange={setSelectedStatus}
              onSkillLevelChange={setSelectedSkillLevel}
              skillLevels={["Beginner", "Intermediate", "Advanced"]}
            />
          </div>
          <div className="w-full md:w-48">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <HackathonGrid
          loading={loading}
          hackathons={hackathons}
          onDelete={handleDeleteHackathon}
        />
      </main>

      <AddHackathonDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onHackathonAdded={fetchHackathons}
      />
    </div>
  );
};

export default Dashboard;
