// Types file (app/admin/dashboard/teams/types.ts)
export interface Member {
    id: number;
    name: string;
    email: string;
    role: string;
  }
  
  export interface CompletedNode {
    id: number;
    name: string;
    timestamp: string;
  }
  
  export interface Team {
    id: number;
    name: string;
    members: Member[];
    progress: number;
    totalNodes: number;
    status: 'active' | 'paused' | 'completed';
    currentNode: string;
    startTime: string;
    completedNodes: CompletedNode[];
    timeElapsed: string;
    averageNodeTime: string;
    estimatedCompletion: string;
  }
  
  // Utils file (app/admin/dashboard/teams/utils.ts)
  export const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  export const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };