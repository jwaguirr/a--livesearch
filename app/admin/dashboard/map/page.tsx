// app/admin/dashboard/map/page.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Plus, Users, Edit2, Trash2 } from "lucide-react";

// Mock data for nodes
const initialNodes = [
  { 
    id: 1, 
    name: "Fondren Library", 
    coordinates: { x: 150, y: 200 },
    teamsPresent: ["Team Alpha"],
    description: "Main entrance of Fondren Library",
    isCheckpoint: true,
  },
  { 
    id: 2, 
    name: "Rice Memorial Center", 
    coordinates: { x: 300, y: 250 },
    teamsPresent: ["Team Beta", "Team Gamma"],
    description: "Near the coffee shop",
    isCheckpoint: true,
  },
  // Add more nodes...
];

export default function MapPage() {
  const [nodes, setNodes] = useState(initialNodes);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [showNodeDetails, setShowNodeDetails] = useState(false);

  // SVG Map dimensions
  const mapWidth = 800;
  const mapHeight = 600;

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setShowNodeDetails(true);
  };

  const handleMapClick = (e) => {
    if (isAddingNode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setSelectedNode({ 
        id: nodes.length + 1,
        coordinates: { x, y },
        teamsPresent: [],
        isCheckpoint: false,
      });
      setShowNodeDetails(true);
      setIsAddingNode(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Nodes Map</h1>
          <p className="text-gray-500">View and manage node locations</p>
        </div>
        <div className="space-x-4">
          <Button
            variant={isAddingNode ? "secondary" : "outline"}
            onClick={() => setIsAddingNode(!isAddingNode)}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isAddingNode ? "Cancel" : "Add Node"}
          </Button>
          <Button>Save Changes</Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Interactive Map */}
        <Card className="col-span-8">
          <CardHeader>
            <CardTitle>Campus Map</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full h-[600px] border rounded-lg overflow-hidden">
              <svg
                width={mapWidth}
                height={mapHeight}
                className="bg-gray-50"
                onClick={handleMapClick}
              >
                {/* Campus paths */}
                <path
                  d="M 100 100 L 300 100 L 300 300 L 500 300"
                  stroke="#00205C"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.2"
                />
                
                {/* Nodes */}
                {nodes.map((node) => (
                  <g
                    key={node.id}
                    transform={`translate(${node.coordinates.x}, ${node.coordinates.y})`}
                    onClick={() => handleNodeClick(node)}
                    className="cursor-pointer"
                  >
                    <circle
                      r="10"
                      fill={node.isCheckpoint ? "#00205C" : "#fff"}
                      stroke="#00205C"
                      strokeWidth="2"
                    />
                    {node.teamsPresent.length > 0 && (
                      <circle
                        r="6"
                        cy="-15"
                        fill="#22c55e"
                      />
                    )}
                    <text
                      y="25"
                      textAnchor="middle"
                      className="text-xs font-medium"
                      fill="#00205C"
                    >
                      {node.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Node List and Details */}
        <div className="col-span-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Node List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nodes.map((node) => (
                <div 
                  key={node.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleNodeClick(node)}
                >
                  <div>
                    <p className="font-medium">{node.name}</p>
                    <p className="text-sm text-gray-500">{node.description}</p>
                  </div>
                  {node.teamsPresent.length > 0 && (
                    <Badge variant="outline" className="bg-green-50">
                      <Users className="w-3 h-3 mr-1" />
                      {node.teamsPresent.length}
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Node Details Dialog */}
      <Dialog open={showNodeDetails} onOpenChange={setShowNodeDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedNode?.name || 'New Node'}</DialogTitle>
            <DialogDescription>
              {selectedNode?.id ? 'Edit node details' : 'Add a new node'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Node Name</Label>
              <Input 
                placeholder="e.g., Fondren Library"
                defaultValue={selectedNode?.name}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input 
                placeholder="Node description"
                defaultValue={selectedNode?.description}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isCheckpoint"
                defaultChecked={selectedNode?.isCheckpoint}
              />
              <Label htmlFor="isCheckpoint">Checkpoint Node</Label>
            </div>
            {selectedNode?.teamsPresent?.length > 0 && (
              <div>
                <Label>Teams at this node</Label>
                <div className="mt-2 space-y-2">
                  {selectedNode.teamsPresent.map((team) => (
                    <Badge key={team} variant="outline" className="mr-2">
                      {team}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              {selectedNode?.id && (
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              )}
              <Button onClick={() => setShowNodeDetails(false)}>
                {selectedNode?.id ? 'Save Changes' : 'Add Node'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}