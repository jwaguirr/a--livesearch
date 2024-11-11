// app/admin/dashboard/teams/components/command-search.tsx
'use client';

import * as React from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DialogContent, DialogTitle } from '@radix-ui/react-dialog';

interface Team {
  id: number;
  name: string;
  members: { id: number; name: string; email: string; role: string; }[];
  status: string;
  currentNode: string;
  timeElapsed: string;
  progress: number;
  totalNodes: number;
}

interface CommandSearchProps {
  teams: Team[];
}

export function CommandSearch({ teams }: CommandSearchProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelectTeam = (teamId: number) => {
    setOpen(false);
    // You can either navigate to a team detail page or trigger the team details modal
    console.log('Selected team:', teamId);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogTitle></DialogTitle>
        <CommandInput placeholder="Search all teams..." />
        <CommandList>
          <CommandEmpty>No teams found.</CommandEmpty>
          <CommandGroup heading="Teams">
            {teams.map((team) => (
              <CommandItem
                key={team.id}
                onSelect={() => handleSelectTeam(team.id)}
                className="flex items-center justify-between p-2"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <div>
                    <p>{team.name}</p>
                    <p className="text-sm text-gray-500">
                      {team.members.length} members
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
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
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-3 h-3" />
                    {team.currentNode}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-3 h-3" />
                    {team.timeElapsed}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </DialogContent>
    </CommandDialog>
  );
}