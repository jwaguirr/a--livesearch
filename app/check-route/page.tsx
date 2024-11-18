'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

export default function CheckRoute() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkRoute() {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const urlParams = new URLSearchParams(window.location.search);
        const number = urlParams.get('num');
        const letter = urlParams.get('qr');

        const response = await fetch('/api/verify-route', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fingerprint: result.visitorId,
            number: number,
            letter: letter
          })
        });

        if (response.ok) {
          router.push('/success');
        } else {
          const data = await response.json();
          setError(data.error);
          setTimeout(() => router.push('/failure'), 2000);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('An unexpected error occurred');
        setTimeout(() => router.push('/failure'), 2000);
      } finally {
        setIsLoading(false);
      }
    }

    checkRoute();
  }, [router]);

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader className="text-xl font-semibold text-center text-red-600">
          Error
        </CardHeader>
        <CardContent className="text-center">
          <p>{error}</p>
          <p className="text-sm text-gray-600 mt-2">Redirecting...</p>
        </CardContent>
      </Card>
    );
  }

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