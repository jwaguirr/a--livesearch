// app/admin/dashboard/teams/components/team-details-dialog.tsx
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserPlus, Timer, Clock } from "lucide-react";

interface TeamDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: any | null;
}

export function TeamDetailsDialog({ open, onOpenChange, team }: TeamDetailsDialogProps) {
  if (!team) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{team.name} Details</DialogTitle>
          <DialogDescription>
            Activity progress and team information
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="progress" className="w-full">
          <TabsList>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-500">Overall Progress</Label>
                <Progress value={(team.progress / team.totalNodes) * 100} className="mt-2" />
                <p className="text-sm mt-1">
                  {team.progress} of {team.totalNodes} nodes completed
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Completed Nodes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {team.completedNodes.map((node, index) => (
                      <div key={node.id} className="flex items-center justify-between p-2 border-b">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          <span>{node.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(node.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>
            <div className="space-y-2">
              {team.members.map((member) => (
                <Card key={member.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                    <Badge variant="outline">{member.role}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-gray-500" />
                    <Label>Average Time per Node</Label>
                  </div>
                  <p className="text-2xl font-bold mt-2">{team.averageNodeTime}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <Label>Estimated Completion</Label>
                  </div>
                  <p className="text-2xl font-bold mt-2">{team.estimatedCompletion}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}