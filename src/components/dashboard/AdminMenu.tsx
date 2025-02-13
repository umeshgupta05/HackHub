
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings, PlusCircle, BarChart, Users } from "lucide-react";

interface AdminMenuProps {
  onAddHackathon: () => void;
  onManageUsers?: () => void;
  onViewAnalytics?: () => void;
}

export const AdminMenu = ({ onAddHackathon, onManageUsers, onViewAnalytics }: AdminMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onAddHackathon}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Hackathon
        </DropdownMenuItem>
        {onManageUsers && (
          <DropdownMenuItem onClick={onManageUsers}>
            <Users className="mr-2 h-4 w-4" />
            Manage Users
          </DropdownMenuItem>
        )}
        {onViewAnalytics && (
          <DropdownMenuItem onClick={onViewAnalytics}>
            <BarChart className="mr-2 h-4 w-4" />
            View Analytics
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
