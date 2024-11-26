'use client';

import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from 'lucide-react';

interface UserProgress {
  completedRoutes: number;
  totalRoutes: number;
  remainingRoutes: string[];
  groupNumber: number;
  groupColor: {name: string, hex: string};
  currentProgress: string;
  recentAttempts: {
    node: string;
    timestamp: string;
    gCost: number;
    isCorrect: boolean;
  }[];
}

export default function HelpPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    async function getUserInfo() {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        
        const response = await fetch('/api/user-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fingerprint: result.visitorId
          })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch user info');
        }

        const progressData = await response.json();
        setUserProgress(progressData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    getUserInfo();
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardContent className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="w-full max-w-2xl mx-auto mt-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!userProgress) {
    return (
      <Alert className="w-full max-w-2xl mx-auto mt-8">
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>No user data found. Please scan a QR code first.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-2xl font-bold text-center">
          Your Progress
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Overview */}
          {/* <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress: {userProgress.currentProgress}%</span>
              <span>{userProgress.completedRoutes} of {userProgress.totalRoutes} routes completed</span>
            </div>
            <Progress value={Number(userProgress.currentProgress)} />
          </div> */}

          {/* Group Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Group Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Group Number</p>
                <p className="text-lg font-medium">{userProgress.groupNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Group Color</p>
                <p style={{backgroundColor: userProgress?.groupColor.hex}} className={`text-lg font-medium p-2 rounded-lg  text-center`}>{userProgress.groupColor.name}</p>
              </div>
            </div>
          </div>

          {/* Recent Attempts */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Recent Attempts</h3>
            <div className="space-y-2">
              {userProgress.recentAttempts.map((attempt, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    attempt.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex justify-between text-sm">
                    <span>Node {attempt.node}</span>
                    <span>G-Cost: {attempt.gCost}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(attempt.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}