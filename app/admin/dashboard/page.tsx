// app/admin/dashboard/page.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Users, MapPin, Clock, ArrowUpRight, Trophy, Medal, Timer, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function AdminDashboard() {
  // Mock data
  const stats = [
    {
      title: "Active Teams",
      value: "12",
      description: "Currently in progress",
      icon: Users,
    },
    {
      title: "Total Nodes",
      value: "24",
      description: "Across campus",
      icon: MapPin,
    },
    {
      title: "Average Time",
      value: "45m",
      description: "To complete activity",
      icon: Clock,
    },
    {
      title: "Success Rate",
      value: "89%",
      description: "Teams completing activity",
      icon: Trophy,
    },
  ];

  const recentActivity = [
    { team: "Team Alpha", action: "Reached node: Library", time: "2 mins ago" },
    { team: "Team Beta", action: "Started activity", time: "5 mins ago" },
    { team: "Team Gamma", action: "Completed activity", time: "10 mins ago" },
  ];

  const leaderboardData = [
    {
      rank: 1,
      team: "Team Alpha",
      members: ["John D.", "Jane S."],
      completionTime: "45:22",
      nodesVisited: 12,
      totalNodes: 12,
      trend: "up",
      lastNodeTime: "2 mins ago",
      efficiency: 98
    },
    {
      rank: 2,
      team: "Team Omega",
      members: ["Alice J.", "Bob W."],
      completionTime: "48:15",
      nodesVisited: 12,
      totalNodes: 12,
      trend: "down",
      lastNodeTime: "5 mins ago",
      efficiency: 95
    },
    {
      rank: 3,
      team: "Team Beta",
      members: ["Carol B.", "David L."],
      completionTime: "50:30",
      nodesVisited: 11,
      totalNodes: 12,
      trend: "up",
      lastNodeTime: "1 min ago",
      efficiency: 92
    },
    {
      rank: 4,
      team: "Team Delta",
      members: ["Eve M.", "Frank P."],
      completionTime: "52:45",
      nodesVisited: 10,
      totalNodes: 12,
      trend: "down",
      lastNodeTime: "3 mins ago",
      efficiency: 88
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Previous header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Dashboard</h1>
          <p className="text-gray-500">Monitor student progress and activity status</p>
        </div>
        <Button>
          New Session
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Leaderboard */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Leaderboard
                </CardTitle>
                <CardDescription>Top performing teams</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboardData.map((team) => (
                <div
                  key={team.rank}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full 
                      ${team.rank === 1 ? 'bg-yellow-100' : 
                        team.rank === 2 ? 'bg-gray-100' : 
                        team.rank === 3 ? 'bg-orange-100' : 'bg-gray-50'}`}
                    >
                      <span className={`text-sm font-bold
                        ${team.rank === 1 ? 'text-yellow-700' :
                          team.rank === 2 ? 'text-gray-700' :
                          team.rank === 3 ? 'text-orange-700' : 'text-gray-500'}`}
                      >
                        #{team.rank}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{team.team}</p>
                        {team.trend === 'up' ? (
                          <ArrowUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Timer className="h-3 w-3" />
                        {team.completionTime}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1">
                      {team.efficiency}% efficient
                    </Badge>
                    <div className="w-32">
                      <Progress 
                        value={(team.nodesVisited / team.totalNodes) * 100} 
                        className="h-1.5"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {team.nodesVisited}/{team.totalNodes} nodes
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Teams */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Active Teams</CardTitle>
            <CardDescription>Currently participating teams and their progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Team Alpha", "Team Beta", "Team Gamma"].map((team) => (
                <div
                  key={team}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center space-x-4">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{team}</p>
                      <p className="text-sm text-gray-500">Node 5/12</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions from participating teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-lg border p-4"
                >
                  <Activity className="h-5 w-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="font-medium">{activity.team}</p>
                    <p className="text-sm text-gray-500">{activity.action}</p>
                  </div>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}