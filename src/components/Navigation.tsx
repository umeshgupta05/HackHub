
import React from 'react';
import { Bell, PlusCircle, Search, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface NavigationProps {
  onAddHackathon: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  notifications: Array<{ id: number; message: string }>;
}

const Navigation = ({
  onAddHackathon,
  searchTerm,
  onSearchChange,
  notifications,
}: NavigationProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              HackHub
            </h1>
          </div>
          
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search hackathons..."
                className="w-full pl-10 bg-white/50"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={onAddHackathon}
              className="bg-primary hover:bg-primary-hover text-white transition-colors duration-200"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Hackathon
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger className="relative">
                <Bell className="h-5 w-5 text-gray-600 hover:text-gray-900 transition-colors" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {notifications.map((notif) => (
                  <DropdownMenuItem key={notif.id}>
                    {notif.message}
                  </DropdownMenuItem>
                ))}
                {notifications.length === 0 && (
                  <DropdownMenuItem>No notifications</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon">
              <User className="h-5 w-5 text-gray-600 hover:text-gray-900 transition-colors" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
