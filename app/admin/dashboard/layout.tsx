// app/admin/dashboard/layout.tsx
'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  LayoutDashboard,
  Users,
  Map,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} className="border-r" />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function Sidebar({ isCollapsed, setIsCollapsed, className }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Teams',
      href: '/admin/dashboard/teams',
      icon: Users,
    },
  ];

  return (
    <div
      className={cn(
        "relative flex flex-col bg-[#00205C] text-white",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-blue-800">
        {!isCollapsed && (
          <span className="font-semibold">A* Search Admin</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-blue-800"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Menu /> : <ChevronLeft />}
        </Button>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2 py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === item.href 
                  ? "bg-blue-800 text-white" 
                  : "text-blue-100 hover:bg-blue-800/50",
                isCollapsed && "justify-center"
              )}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t border-blue-800 p-2">
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "default"}
          className={cn(
            "w-full justify-start gap-3 text-white hover:bg-blue-800",
            isCollapsed && "justify-center"
          )}
          onClick={() => console.log('logout')}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}