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

const Index = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [filteredHackathons, setFilteredHackathons] = useState<Hackathon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Registration deadline for Web3 Hackathon approaching' },
    { id: 2, message: 'New team request from John Doe' },
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
          id: '1',
          name: 'AI Innovation Challenge',
          date: '2025-02-15',
          location: 'Online',
          max_participants: 200,
          current_participants: 150,
          description: 'Join us for an exciting hackathon focused on artificial intelligence and machine learning innovations.',
          status: 'upcoming',
        },
        {
          id: '2',
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

    // Apply status filter
    if (selectedStatus !== 'all') {
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

  const handleFormSubmit = () => {
    const newHackathonWithId = {
      id: hackathons.length + 1,
      ...newHackathon,
      current_participants: 0,
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
        <Filters
          selectedStatus={selectedStatus}
          selectedSkillLevel={selectedSkillLevel}
          onStatusChange={setSelectedStatus}
          onSkillLevelChange={setSelectedSkillLevel}
          skillLevels={skillLevels}
        />
        <div className="w-full md:w-auto">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full md:w-auto"
          />
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
