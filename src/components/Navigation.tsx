import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { AdminMenu } from './dashboard/AdminMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion'; // Import motion

interface NavigationProps {
  onAddHackathon: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  notifications: Array<{ id: string; message: string }>;
  userProfile?: {
    full_name: string;
  };
}

const Navigation = ({
  onAddHackathon,
  searchTerm,
  onSearchChange,
  notifications,
  userProfile,
}: NavigationProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    navigate('/auth/login');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center py-2 sm:py-0 space-y-2 sm:space-y-0">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent"
            >
              HackHub
            </motion.h1>
            {isMobile && (
              <div className="flex items-center space-x-2">
                <AdminMenu onAddHackathon={onAddHackathon} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="font-medium">
                      {userProfile?.full_name || 'User Profile'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full sm:flex-1 sm:max-w-md sm:mx-4"
          >
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
          </motion.div>

          {!isMobile && (
            <div className="flex items-center space-x-4">
              <AdminMenu onAddHackathon={onAddHackathon} />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative"
                  >
                    <Button variant="ghost" size="icon">
                      <Bell className="h-5 w-5" />
                      {notifications.length > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center"
                        >
                          {notifications.length}
                        </motion.span>
                      )}
                    </Button>
                  </motion.div>
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">
                    {userProfile?.full_name || 'User Profile'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
