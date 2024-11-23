'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle } from 'lucide-react';

interface RouteData {
  fingerprint: string;
  number: string | null;
  letter: string | null;
}

export default function CheckRoute() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGCostInput, setShowGCostInput] = useState(false);
  const [gCost, setGCost] = useState('');
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    async function initializeRoute() {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const urlParams = new URLSearchParams(window.location.search);
        const number = urlParams.get('number');
        const letter = urlParams.get('node');
        
        setRouteData({
          fingerprint: result.visitorId,
          number,
          letter
        });
        setShowGCostInput(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to initialize route verification');
        setTimeout(() => router.push('/failure'), 2000);
      }
    }

    initializeRoute();
  }, [router]);

  const handleGCostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const gCostValue = parseInt(gCost);

    if (isNaN(gCostValue) || gCostValue !== 100) {
      setAttempts(prev => prev + 1);
      setIsLoading(false);
      setError('Incorrect g-cost value. Please try again.');
      setGCost('');
      
      if (attempts >= 2) {
        setTimeout(() => router.push('/failure'), 2000);
        return;
      }
      return;
    }

    try {
      const response = await fetch('/api/verify-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...routeData,
          gCost: gCostValue
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.nextNode) {
          router.push('/success');
        } else {
          // Handle completion of all nodes
          router.push('/complete');
        }
      } else {
        setError(data.error);
        if (response.status === 400) {
          setTimeout(() => router.push('/failure'), 2000);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred');
      setTimeout(() => router.push('/failure'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    router.push(`/failure?node=${routeData?.letter}`);
    // return (
    //   <Card className="w-full max-w-md mx-auto mt-8">
    //     <CardHeader className="text-xl font-semibold text-center text-red-600">
    //       <div className="flex items-center justify-center gap-2">
    //         <AlertTriangle className="h-6 w-6" />
    //         Error
    //       </div>
    //     </CardHeader>
    //     <CardContent className="text-center">
    //       <p>{error}</p>
    //       <p className="text-sm text-gray-600 mt-2">
    //         {attempts >= 3 ? 'Maximum attempts reached. Redirecting...' : attempts > 0 ? `Attempts remaining: ${3 - attempts}` : ''}
    //       </p>
    //     </CardContent>
    //   </Card>
    // );
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader className="text-xl font-semibold text-center">
          Verifying Route...
        </CardHeader>
        <CardContent className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (showGCostInput) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader className="text-xl font-semibold text-center">
          Enter G-Cost
        </CardHeader>
        <form onSubmit={handleGCostSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gCost">G-Cost Value</Label>
              <Input
                id="gCost"
                type="number"
                value={gCost}
                onChange={(e) => setGCost(e.target.value)}
                placeholder="Enter g-cost value"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }

  return null;
}