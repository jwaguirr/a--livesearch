// app/admin/dashboard/teams/page.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search as SearchIcon,
  Users,
  MapPin,
  Clock,
  PlayCircle,
  PauseCircle,
  Ban,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CommandSearch } from './components/command-search';
import { TeamDetailsDialog } from './components/team-details-dialog';
import { NewTeamDialog } from './components/new-team-dialog';
import { cn } from "@/lib/utils";

// Mock data import
import { mockTeams } from './data/mock-teams';

export default function TeamsPage() {
  const [teams, setTeams] = useState(mockTeams);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  const filteredTeams = React.useMemo(() => {
    return teams.filter(team => {
      const matchesSearch = 
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.members.some(member => 
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.email.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        team.currentNode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = 
        filter === 'all' || 
        team.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [teams, searchQuery, filter]);

  const handleSearch = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsSearching(false);
  }, []);

  const handleStatusChange = (teamId, newStatus) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, status: newStatus } : team
    ));
  };

  const handleViewDetails = (team) => {
    setSelectedTeam(team);
    setShowTeamDetails(true);
  };

  return (
    <div className="p-8 space-y-6">
      <CommandSearch teams={teams} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Teams</h1>
          <p className="text-gray-500">Manage and monitor team progress</p>
        </div>
        <div className="flex gap-4">
          <div className="relative flex items-center">
            <SearchIcon className={cn(
              "absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4",
              isSearching ? "text-black" : "text-gray-500"
            )} />
            <Input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={handleSearch}
              className={cn(
                "pl-8 w-64",
                isSearching && "pr-8"
              )}
            />
            {isSearching && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-[#00205C] border-t-transparent rounded-full" />
              </div>
            )}
            <kbd className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
          <Button onClick={() => setShowNewTeamDialog(true)}>
            <Users className="w-4 h-4 mr-2" />
            Create Team
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">
                All Teams ({teams.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Active ({teams.filter(t => t.status === 'active').length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({teams.filter(t => t.status === 'completed').length})
              </TabsTrigger>
              <TabsTrigger value="paused">
                Paused ({teams.filter(t => t.status === 'paused').length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredTeams.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">No teams found</h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? `No teams match the search "${searchQuery}"`
                  : "No teams match the selected filter"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onViewDetails={handleViewDetails}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>

      <TeamDetailsDialog
        open={showTeamDetails}
        onOpenChange={setShowTeamDetails}
        team={selectedTeam}
      />
      <NewTeamDialog
        open={showNewTeamDialog}
        onOpenChange={setShowNewTeamDialog}
      />
    </div>
  );
}

// TeamCard component (can be moved to a separate file)

function TeamCard({ team, onViewDetails, onStatusChange }) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h3 className="text-lg font-semibold">{team.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Users className="w-4 h-4 mr-1" />
                  {team.members.length} members
                </div>
              </div>
            </div>
  
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {team.currentNode}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  {team.timeElapsed}
                </div>
              </div>
  
              <div className="flex flex-col items-end">
                <Badge 
                  variant={team.status === "active" ? "default" : "secondary"}
                  className={
                    team.status === "active" ? "bg-green-100 text-green-800" :
                    team.status === "paused" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }
                >
                  {team.status}
                </Badge>
                <div className="mt-2 w-32">
                  <Progress value={(team.progress / team.totalNodes) * 100} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {team.progress}/{team.totalNodes} nodes
                  </p>
                </div>
              </div>
  
              <Button variant="ghost" size="icon" onClick={() => onViewDetails(team)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
  
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDetails(team)}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(team.id, "active")}>
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Activity
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(team.id, "paused")}>
                    <PauseCircle className="w-4 h-4 mr-2" />
                    Pause Activity
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Ban className="w-4 h-4 mr-2" />
                    Disqualify
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }