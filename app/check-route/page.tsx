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

    if (isNaN(gCostValue)) {
      setError('Please enter a valid number');
      setIsLoading(false);
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
        router.push('/success');
      } else {
        // Both wrong g-cost and wrong route will now be recorded in the database
        router.push(`/failure?node=${routeData?.letter}`);
      }
    } catch (error) {
      console.error('Error:', error);
      router.push(`/failure?node=${routeData?.letter}`);
    } finally {
      setIsLoading(false);
    }
  };

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