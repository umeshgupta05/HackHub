import { Loader2 } from "lucide-react";
import HackathonCard from "@/components/HackathonCard";
import { motion } from "framer-motion"; // Import motion

interface Hackathon {
  id: string;
  name: string;
  date: string;
  location: string;
  max_participants: number;
  current_participants: number;
  description: string;
  status: string;
  image_url?: string;
  website_url?: string;
  prize_pool?: number;
  registration_deadline?: string;
  technologies?: string[];
}

interface HackathonGridProps {
  loading: boolean;
  hackathons: Hackathon[];
  onDelete: (id: string) => void;
}

// Define container variants for staggered animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delay between each child animation
    },
  },
};

// Define item variants for individual hackathon cards
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <p className="text-gray-500">No hackathons found matching your criteria.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {hackathons.map((hackathon) => (
        <motion.div key={hackathon.id} variants={itemVariants}>
          <HackathonCard
            hackathon={hackathon}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
