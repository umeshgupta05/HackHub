import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import Filters from "@/components/Filters";
import { useHackathons } from "@/hooks/useHackathons";
import { HackathonGrid } from "@/components/dashboard/HackathonGrid";
import { AddHackathonDialog } from "@/components/dashboard/AddHackathonDialog";
import { motion } from "framer-motion"; // Import motion

const Dashboard = () => {
  const navigate = useNavigate();
  const [notifications] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        onAddHackathon={() => setFormOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        notifications={notifications}
      />

      <main className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6"
        >
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
        </motion.div>

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
