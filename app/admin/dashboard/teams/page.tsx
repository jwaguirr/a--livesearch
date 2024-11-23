"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Timer, Trophy, Award, Medal, Clock, Search, MapPin, AlertCircle, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

const formatElapsedTime = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const getLastActivityTime = (team: TeamData): number => {
  if (!team.progress.length) return new Date(team.initialTime).getTime();
  const lastProgress = team.progress[team.progress.length - 1];
  const lastNode = team.goodProgress[team.goodProgress.length - 1];
  return new Date(lastProgress[lastNode]).getTime();
};

export default function LeaderboardPage() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-8">
        <div className="flex items-center justify-center h-full">
          <Timer className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  const sortedTeams = [...teams].sort((a, b) => {
    const progressA = (a.goodProgress.length / a.idealRoute.length) * 100;
    const progressB = (b.goodProgress.length / b.idealRoute.length) * 100;
    if (progressB !== progressA) return progressB - progressA;
    return getLastActivityTime(b) - getLastActivityTime(a);
  });

  // Get recent activity (last 10 node completions)
  const recentActivity = teams.flatMap(team => {
    const progressEntries = team.progress.map((progressObj, index) => {
      const nodeLetter = Object.keys(progressObj)[0];
      const timestamp = new Date(progressObj[nodeLetter]);
      
      // Get complete team info for display
      const allMembers = [
        { netid: team.netID, name: team.fullName, section: team.section },
        ...team.groupMembers
      ];
      
      return {
        teamId: team.netID,
        teamLeader: team.fullName,
        members: allMembers,
        timestamp,
        node: nodeLetter,
        progress: Math.round((team.goodProgress.length / team.idealRoute.length) * 100)
      };
    });

    return progressEntries;
  })
  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  .slice(0, 10);

  const getMedalInfo = (position: number) => {
    switch (position) {
      case 0: // First place
        return {
          icon: <Trophy className="h-6 w-6 text-yellow-500" />,
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          numberColor: "text-yellow-600"
        };
      case 1: // Second place
        return {
          icon: <Medal className="h-6 w-6 text-blue-400" />,
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          numberColor: "text-blue-600"
        };
      case 2: // Third place
        return {
          icon: <Award className="h-6 w-6 text-orange-600" />,
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          numberColor: "text-orange-700"
        };
      default: // Other positions
        return {
          icon: null,
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          numberColor: "text-gray-500"
        };
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Team Rankings</h1>
        <p className="text-gray-500">Live leaderboard and activity feed</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="space-y-4">
                {sortedTeams.map((team, index) => {
                  const progress = Math.round((team.goodProgress.length / team.idealRoute.length) * 100);
                  const isCompleted = team.goodProgress.length === team.idealRoute.length;
                  const lastNode = team.goodProgress[team.goodProgress.length - 1] || 'Starting';
                  const allMembers = [
                    { netid: team.netID, name: team.fullName, section: team.section },
                    ...team.groupMembers
                  ];
                  const medalInfo = getMedalInfo(index);

                  return (
                    <div 
                      key={team._id} 
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all
                        ${medalInfo.bgColor} ${medalInfo.borderColor}
                        ${index < 3 ? 'transform hover:scale-102 shadow-sm' : 'hover:bg-gray-100'}`}
                    >
                      <div className={`flex items-center justify-center w-12 ${index < 3 ? 'relative' : ''}`}>
                        {medalInfo.icon && (
                          <div className="absolute -left-1">
                            {medalInfo.icon}
                          </div>
                        )}
                        <span className={`text-2xl font-bold ${medalInfo.numberColor} ${index < 3 ? 'ml-4' : ''}`}>
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">Team {team.netID}</h3>
                            <div className="text-sm text-gray-500">
                              Led by {team.fullName}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              Members: {allMembers.map(m => m.name).join(', ')}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 w-full">
                            <Badge 
                              variant={isCompleted ? "secondary" : "default"}
                              className={`
                                ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                                ${index < 3 ? 'scale-110' : ''}
                              `}
                            >
                              {progress}% complete
                            </Badge>
                            {index < 3 && progress === 100 && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                Finished!
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Progress 
                          value={progress} 
                          className={`h-2 ${index < 3 ? 'bg-gray-200' : ''}`}
                        />
                        <div className="flex justify-between mt-2 text-sm text-gray-500">
                          <span>Current: Node {lastNode}</span>
                          <span>Team Section: {team.section}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0">
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium">Team {activity.teamId}</div>
                      <div className="text-sm text-gray-500">
                        Reached Node {activity.node}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Team Leader: {activity.teamLeader}
                      </div>
                      <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3" />
                        {activity.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        })}
                        <span className="text-gray-300">•</span>
                        <span>{activity.progress}% complete</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}