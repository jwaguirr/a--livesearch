export const mockTeams = [
    {
      id: 1,
      name: "Team Alpha",
      members: [
        { id: 1, name: "John Doe", email: "john@rice.edu", role: "Leader" },
        { id: 2, name: "Jane Smith", email: "jane@rice.edu", role: "Member" }
      ],
      progress: 5,
      totalNodes: 12,
      status: "active",
      currentNode: "Fondren Library",
      startTime: "2024-03-09T10:00:00",
      completedNodes: [
        { id: 1, name: "Start Point", timestamp: "2024-03-09T10:05:00" },
        { id: 2, name: "Student Center", timestamp: "2024-03-09T10:15:00" },
      ],
      timeElapsed: "00:45:30",
      averageNodeTime: "8.5 minutes",
      estimatedCompletion: "45 minutes"
    },
    {
      id: 2,
      name: "Team Beta",
      members: [
        { id: 3, name: "Alice Johnson", email: "alice@rice.edu", role: "Leader" },
        { id: 4, name: "Bob Wilson", email: "bob@rice.edu", role: "Member" }
      ],
      progress: 8,
      totalNodes: 12,
      status: "active",
      currentNode: "Rice Memorial Center",
      startTime: "2024-03-09T09:30:00",
      completedNodes: [
        { id: 1, name: "Start Point", timestamp: "2024-03-09T09:35:00" },
        { id: 2, name: "Brochstein Pavilion", timestamp: "2024-03-09T09:50:00" },
      ],
      timeElapsed: "01:15:30",
      averageNodeTime: "9.2 minutes",
      estimatedCompletion: "35 minutes"
    },
    {
      id: 3,
      name: "Team Gamma",
      members: [
        { id: 5, name: "Carol Brown", email: "carol@rice.edu", role: "Leader" },
      ],
      progress: 12,
      totalNodes: 12,
      status: "completed",
      currentNode: "Finish Point",
      startTime: "2024-03-09T09:00:00",
      completedNodes: [
        { id: 1, name: "Start Point", timestamp: "2024-03-09T09:05:00" },
        { id: 2, name: "Lovett Hall", timestamp: "2024-03-09T09:20:00" },
      ],
      timeElapsed: "01:30:00",
      averageNodeTime: "7.5 minutes",
      estimatedCompletion: "0 minutes"
    },
    {
      id: 4,
      name: "Team Delta",
      members: [
        { id: 6, name: "David Lee", email: "david@rice.edu", role: "Leader" },
        { id: 7, name: "Emma Davis", email: "emma@rice.edu", role: "Member" }
      ],
      progress: 3,
      totalNodes: 12,
      status: "paused",
      currentNode: "Tudor Fieldhouse",
      startTime: "2024-03-09T10:15:00",
      completedNodes: [
        { id: 1, name: "Start Point", timestamp: "2024-03-09T10:20:00" },
      ],
      timeElapsed: "00:30:00",
      averageNodeTime: "10 minutes",
      estimatedCompletion: "90 minutes"
    }
  ];