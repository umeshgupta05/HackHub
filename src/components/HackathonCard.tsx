
import React from 'react';
import { Calendar, MapPin, Users, Trash2, Link as LinkIcon, Trophy, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
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
  };
  onDelete: (id: string) => void;
}

const HackathonCard = ({ hackathon, onDelete }: HackathonCardProps) => {
  const navigate = useNavigate();
  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 animate-scale-in h-full flex flex-col">
      {hackathon.image_url && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <img
            src={hackathon.image_url}
            alt={hackathon.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="text-lg sm:text-xl font-bold line-clamp-2">
            {hackathon.name}
            {hackathon.website_url && (
              <a
                href={hackathon.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center ml-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <LinkIcon className="h-4 w-4" />
              </a>
            )}
          </CardTitle>
          <Badge variant="secondary" className={`${statusColors[hackathon.status as keyof typeof statusColors]} whitespace-nowrap`}>
            {hackathon.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{new Date(hackathon.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{hackathon.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{hackathon.current_participants}/{hackathon.max_participants} Participants</span>
          </div>
          {hackathon.prize_pool && (
            <div className="flex items-center text-gray-600">
              <Trophy className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{formatCurrency(hackathon.prize_pool)} Prize Pool</span>
            </div>
          )}
          {hackathon.registration_deadline && (
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm">Registration ends: {new Date(hackathon.registration_deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        <p className="text-gray-600 text-sm line-clamp-3">{hackathon.description}</p>
        {hackathon.technologies && hackathon.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {hackathon.technologies.map((tech, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between space-x-2 mt-auto">
        <Button
          className="flex-1 bg-primary hover:bg-primary-hover text-white transition-colors duration-200"
          onClick={() => navigate(`/hackathon/${hackathon.id}`)}
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
