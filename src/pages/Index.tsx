import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Filters from '@/components/Filters';
import HackathonCard from '@/components/HackathonCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion'; // Import motion

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

// Define container variants for staggered animation in the grid
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Define item variants for individual hackathon cards
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Index = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [filteredHackathons, setFilteredHackathons] = useState<Hackathon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications] = useState([
    { id: "1", message: 'Registration deadline for Web3 Hackathon approaching' },
    { id: "2", message: 'New team request from John Doe' },
  ]);
  const [newHackathon, setNewHackathon] = useState({
    name: '',
    date: '',
    location: '',
    max_participants: '',
    description: '',
  });

  const { toast } = useToast();
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

  useEffect(() => {
    setTimeout(() => {
      setHackathons([
        {
          id: "1",
          name: 'AI Innovation Challenge',
          date: '2025-02-15',
          location: 'Online',
          max_participants: 200,
          current_participants: 150,
          description: 'Join us for an exciting hackathon focused on artificial intelligence and machine learning innovations.',
          status: 'upcoming',
        },
        {
          id: "2",
          name: 'Blockchain Summit 2025',
          date: '2025-01-30',
          location: 'Mumbai',
          max_participants: 100,
          current_participants: 90,
          description: 'Build the future of Web3 with innovative blockchain solutions.',
          status: 'ongoing',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...hackathons];

    if (selectedStatus !== 'all') {
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

  const handleFormSubmit = () => {
    const newHackathonWithId: Hackathon = {
      id: `${hackathons.length + 1}`,
      name: newHackathon.name,
      date: newHackathon.date,
      location: newHackathon.location,
      max_participants: parseInt(newHackathon.max_participants),
      current_participants: 0,
      description: newHackathon.description,
      status: 'upcoming',
    };
    setHackathons([...hackathons, newHackathonWithId]);
    setFormOpen(false);
    toast({
      title: "Success",
      description: "Hackathon added successfully!",
      duration: 3000,
    });
  };

  const handleDeleteHackathon = (id: string) => {
    setHackathons(hackathons.filter((hackathon) => hackathon.id !== id));
    toast({
      title: "Deleted",
      description: "Hackathon has been removed",
      duration: 3000,
    });
  };

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
              skillLevels={skillLevels}
            />
          </div>
          <div className="w-full md:w-auto">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full md:w-auto"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {filteredHackathons.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <p className="text-gray-500">No hackathons found matching your criteria.</p>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredHackathons.map((hackathon) => (
                  <motion.div key={hackathon.id} variants={itemVariants}>
                    <HackathonCard
                      hackathon={hackathon}
                      onDelete={handleDeleteHackathon}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </main>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle>Add New Hackathon</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newHackathon.name}
                  onChange={(e) => setNewHackathon({ ...newHackathon, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={newHackathon.date}
                  onChange={(e) => setNewHackathon({ ...newHackathon, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={newHackathon.location}
                  onChange={(e) => setNewHackathon({ ...newHackathon, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Participants</label>
                <Input
                  type="number"
                  value={newHackathon.max_participants}
                  onChange={(e) => setNewHackathon({ ...newHackathon, max_participants: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newHackathon.description}
                  onChange={(e) => setNewHackathon({ ...newHackathon, description: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleFormSubmit}>Submit</Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
