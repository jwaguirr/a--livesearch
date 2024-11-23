'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserSearch } from 'lucide-react';

export default function UserNotFound() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [netId, setNetId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const originalNumber = searchParams.get('number');
  const originalNode = searchParams.get('node');
  const originalFingerprint = searchParams.get('fingerprint');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/update-fingerprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          netId,
          newFingerprint: originalFingerprint
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect back to check-route with original parameters
        router.push(`/check-route?number=${originalNumber}&node=${originalNode}`);
      } else {
        setError(data.error || 'Failed to verify NetID');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="text-xl font-semibold text-center">
        <div className="flex items-center justify-center gap-2">
          <UserSearch className="h-6 w-6 text-blue-500" />
          Verify Your NetID
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="netId">Enter your NetID</Label>
            <Input
              id="netId"
              value={netId}
              onChange={(e) => setNetId(e.target.value)}
              placeholder="e.g., abc123"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
          <p className="text-sm text-gray-600 text-center">
            Please enter your NetID to verify your identity
          </p>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify NetID'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}