
import { Loader2 } from "lucide-react";
import HackathonCard from "@/components/HackathonCard";

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

interface HackathonGridProps {
  loading: boolean;
  hackathons: Hackathon[];
  onDelete: (id: string) => void;
}

export const HackathonGrid = ({ loading, hackathons, onDelete }: HackathonGridProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hackathons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hackathons found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
      {hackathons.map((hackathon) => (
        <HackathonCard
          key={hackathon.id}
          hackathon={hackathon}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
