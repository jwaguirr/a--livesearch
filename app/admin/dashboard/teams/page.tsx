"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Timer, Medal, Clock, Search, MapPin, AlertCircle, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TeamData {
  _id: string;
  netID: string;
  section: string;
  groupMembers: Record<string, any>;
  sections: string[];
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
  // Get the timestamp from the last progress object by accessing the node key
  const lastNode = team.goodProgress[team.goodProgress.length - 1];
  return new Date(lastProgress[lastNode]).getTime();
};

export default function TeamsPage() {
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
    // Get all progress entries with their timestamps and nodes
    const progressEntries = team.progress.map((progressObj, index) => {
      // Get the node letter that was recorded in this progress entry
      const nodeLetter = Object.keys(progressObj)[0];
      // Get the timestamp for this progress entry
      const timestamp = new Date(progressObj[nodeLetter]);
      
      return {
        teamId: team.netID,
        timestamp,
        node: nodeLetter,
        progress: Math.round((team.goodProgress.length / team.idealRoute.length) * 100)
      };
    });

    return progressEntries;
  })
  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  .slice(0, 10);

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
              <Medal className="h-5 w-5" />
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

                  return (
                    <div key={team._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-500 w-8">
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">Team {team.netID}</h3>
                            <div className="text-sm text-gray-500">
                              {Object.keys(team.groupMembers || {}).filter(key => key !== 'sections').join(', ')}
                            </div>
                          </div>
                          <Badge 
                            variant={isCompleted ? "secondary" : "default"}
                            className={isCompleted ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"}
                          >
                            {progress}% complete
                          </Badge>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between mt-2 text-sm text-gray-500">
                          <span>Current: Node {lastNode}</span>
                          <span>Section {team.section}</span>
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