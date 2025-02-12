
import React from 'react';
import { Calendar, MapPin, Users, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';

interface HackathonCardProps {
  hackathon: {
    id: number;
    name: string;
    date: string;
    location: string;
    maxParticipants: number;
    currentParticipants: number;
    description: string;
    status: string;
  };
  onDelete: (id: number) => void;
}

const HackathonCard = ({ hackathon, onDelete }: HackathonCardProps) => {
  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 animate-scale-in">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{hackathon.name}</CardTitle>
          <Badge variant="secondary" className={statusColors[hackathon.status as keyof typeof statusColors]}>
            {hackathon.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(hackathon.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{hackathon.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>{hackathon.currentParticipants}/{hackathon.maxParticipants} Participants</span>
          </div>
        </div>
        <p className="text-gray-600 line-clamp-2">{hackathon.description}</p>
      </CardContent>
      <CardFooter className="justify-between space-x-2">
        <Button
          className="flex-1 bg-primary hover:bg-primary-hover text-white transition-colors duration-200"
          onClick={() => alert(`View details of ${hackathon.name}`)}
        >
          View Details
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          onClick={() => onDelete(hackathon.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HackathonCard;
