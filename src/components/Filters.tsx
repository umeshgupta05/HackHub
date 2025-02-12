
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface FiltersProps {
  selectedStatus: string;
  selectedSkillLevel: string;
  onStatusChange: (value: string) => void;
  onSkillLevelChange: (value: string) => void;
  skillLevels: string[];
}

const Filters = ({
  selectedStatus,
  selectedSkillLevel,
  onStatusChange,
  onSkillLevelChange,
  skillLevels,
}: FiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Status</label>
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Skill Level</label>
        <Select value={selectedSkillLevel} onValueChange={onSkillLevelChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select skill level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {skillLevels.map((level) => (
              <SelectItem key={level} value={level.toLowerCase()}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Filters;
