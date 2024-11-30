// app/admin/dashboard/layout.tsx
'use client';

import React, { useEffect } from 'react';
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
import { usePathname, useRouter } from 'next/navigation';
import { UserButton, useUser, useAuth, ClerkProvider } from '@clerk/nextjs';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/admin/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} className="border-r" />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <DashboardContent>{children}</DashboardContent>
    </ClerkProvider>
  );
}

function Sidebar({ isCollapsed, setIsCollapsed, className }: SidebarProps) {
  const { user } = useUser();
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
      <div className="flex items-center space-x-3 border-t border-blue-800 p-2 pl-4">
        <UserButton afterSignOutUrl="/admin/sign-in" />
        <p>{user?.emailAddresses[0].emailAddress}</p>
      </div>
    </div>
  );
}