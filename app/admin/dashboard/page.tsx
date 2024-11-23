"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Timer, CheckCircle2, Clock, Search, MapPin, AlertCircle, MoreVertical, Table, Grid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeamMember {
  netid: string;
  name: string;
  section: string;
}

interface TeamData {
  _id: string;
  netID: string;
  section: string;
  fullName: string;
  groupMembers: TeamMember[];
  progress: Array<Record<string, Date>>;
  goodProgress: string[];
  idealRoute: string[];
  groupColorCounter: number;
  initialTime: string;
  fingerPrint: string;
}

const getMemberNetIDs = (groupMembers: Record<string, any>) => {
  return Object.keys(groupMembers || {}).filter(key => key !== 'sections');
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'cards' | 'spreadsheet'>('cards');
  const teamsPerPage = 25;

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      const data = await response.json();
      setTeams(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      setTeams([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    const interval = setInterval(fetchTeams, 30000);
    return () => clearInterval(interval);
  }, []);

  const getFilteredTeams = (status: 'active' | 'completed') => {
    return teams.filter(team => {
      const isCompleted = team.goodProgress.length === team.idealRoute.length;
      const isStatusMatch = status === 'completed' ? isCompleted : !isCompleted;
      
      // Get all members including team leader
      const allMembers = [
        { netid: team.netID, name: team.fullName, section: team.section },
        ...team.groupMembers
      ];

      // Search through team ID, names, and netIDs
      const matchesSearch = searchTerm.toLowerCase().trim() === '' || 
        allMembers.some(member => 
          member.netid.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
      return isStatusMatch && matchesSearch;
    });
  };

  // Function to get the route color name
  const getRouteColor = (colorNumber: number): string => {
    switch (colorNumber) {
      case 1: return 'Yellow';
      case 2: return 'Red';
      case 3: return 'Green';
      case 4: return 'Blue';
      default: return 'Unknown';
    }
  };

  const paginatedTeams = (teams: TeamData[]) => {
    const startIndex = (currentPage - 1) * teamsPerPage;
    return teams.slice(startIndex, startIndex + teamsPerPage);
  };

  const totalPages = Math.ceil(getFilteredTeams(activeTab as 'active' | 'completed').length / teamsPerPage);

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-8">
        <div className="flex items-center justify-center h-full">
          <Timer className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  const SpreadsheetView = ({ teams }: { teams: TeamData[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left border">Team ID</th>
            <th className="p-2 text-left border">Members & Sections</th>
            <th className="p-2 text-left border">Route Color</th>
            <th className="p-2 text-left border">Progress</th>
            <th className="p-2 text-left border">Time Elapsed</th>
            <th className="p-2 text-left border">Current Node</th>
            <th className="p-2 text-left border">Status</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => {
            const isCompleted = team.goodProgress.length === team.idealRoute.length;
            const progress = Math.round((team.goodProgress.length / team.idealRoute.length) * 100);
            const elapsedTime = (() => {
              const start = new Date(team.initialTime).getTime();
              const elapsed = Date.now() - start;
              const minutes = Math.floor(elapsed / 60000);
              const seconds = Math.floor((elapsed % 60000) / 1000);
              return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            })();
            const lastNode = team.goodProgress[team.goodProgress.length - 1] || 'Starting';
            const allMembers = [
              { netid: team.netID, name: team.fullName, section: team.section },
              ...team.groupMembers
            ];

            return (
              <tr key={team._id} className="border-t hover:bg-gray-50">
                <td className="p-2 border w-24">{team.netID}</td>
                <td className="p-2 border">
                  <div className="space-y-1.5">
                    {allMembers.map(member => (
                      <div key={member.netid} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium">{member.netid}</span>
                          <span className="text-gray-500 ml-1">({member.name})</span>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {member.section}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-2 border w-28 text-center">
                  <Badge>{getRouteColor(team.groupColorCounter)}</Badge>
                </td>
                <td className="p-2 border w-40">
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="h-2 w-20" />
                    <span className="text-sm">{progress}%</span>
                  </div>
                </td>
                <td className="p-2 border w-28">{elapsedTime}</td>
                <td className="p-2 border w-28">{lastNode}</td>
                <td className="p-2 border w-28">
                  <Badge 
                    variant={isCompleted ? "secondary" : "default"}
                    className={isCompleted ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"}
                  >
                    {isCompleted ? 'completed' : 'active'}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const Pagination = () => (
    <div className="flex justify-center gap-2 mt-4">
      <Button
        variant="outline"
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            variant={currentPage === i + 1 ? "default" : "outline"}
            onClick={() => setCurrentPage(i + 1)}
            className="w-8"
          >
            {i + 1}
          </Button>
        ))}
      </div>
      <Button
        variant="outline"
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );

  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Monitor team progress and completion status</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search teams..."
              className="pl-8 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setViewMode(v => v === 'cards' ? 'spreadsheet' : 'cards')}
            className="flex items-center gap-2"
          >
            {viewMode === 'cards' ? <Table className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            {viewMode === 'cards' ? 'Spreadsheet View' : 'Card View'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="active" className="flex gap-2">
            <Clock className="h-4 w-4" />
            Active ({getFilteredTeams('active').length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Completed ({getFilteredTeams('completed').length})
          </TabsTrigger>
        </TabsList>

        {viewMode === 'cards' ? (
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
              {paginatedTeams(getFilteredTeams(activeTab as 'active' | 'completed')).map((team) => (
                <TeamCard key={team._id} team={team} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <SpreadsheetView teams={paginatedTeams(getFilteredTeams(activeTab as 'active' | 'completed'))} />
        )}

        <Pagination />
      </Tabs>
    </div>
  );
}

function TeamCard({ team }: { team: TeamData }) {
  const isCompleted = team.goodProgress.length === team.idealRoute.length;
  const progress = Math.round((team.goodProgress.length / team.idealRoute.length) * 100);
  const allMembers = [
    { netid: team.netID, name: team.fullName, section: team.section },
    ...team.groupMembers
  ];
  
  const elapsedTime = (() => {
    const start = new Date(team.initialTime).getTime();
    const elapsed = Date.now() - start;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  })();

  const lastNode = team.goodProgress[team.goodProgress.length - 1] || 'Starting';

  const getRouteColor = (colorNumber: number): string => {
    switch (colorNumber) {
      case 1: return 'Yellow';
      case 2: return 'Red';
      case 3: return 'Green';
      case 4: return 'Blue';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">Team {team.netID}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                {allMembers.length} members
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {team.section}
              </div>
            </div>
            <Badge 
              variant={isCompleted ? "secondary" : "default"}
              className={isCompleted ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"}
            >
              {isCompleted ? 'completed' : 'active'}
            </Badge>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {elapsedTime}
            </div>
            <div className="flex items-center">
              Node {lastNode}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full">
                View Details
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                Route Color: {getRouteColor(team.groupColorCounter)}
              </DropdownMenuItem>
              <DropdownMenuItem className="whitespace-normal">
                Ideal Route: {team.idealRoute.join(' → ')}
              </DropdownMenuItem>
              <DropdownMenuItem className="whitespace-normal">
                Progress: {team.goodProgress.join(' → ')}
              </DropdownMenuItem>
              <DropdownMenuItem className="whitespace-normal">
                Members: {allMembers.map(m => `${m.netid} (${m.name})`).join(', ')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}