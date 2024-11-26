'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import CryptoJS, { enc } from 'crypto-js';

interface RouteData {
  fingerprint: string;
  number: string | null;
  letter: string | null;
}

function decryptParams(encryptedData: string): { number: string | null; node: string | null } | null {
  try {    
    const key = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);
    const standardBase64 = encryptedData.replace(/-/g, '+').replace(/_/g, '/');
    const encryptedBytes = CryptoJS.enc.Base64.parse(standardBase64);
    const iv = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_ENCRYPTION_IV!);
    const actualData = CryptoJS.enc.Hex.parse(encryptedBytes.toString().slice(32));
    const decrypted = CryptoJS.AES.decrypt(
      {
        ciphertext: actualData
      },
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    const paramsString = decrypted.toString(CryptoJS.enc.Utf8).replace('AND', '&');    
    
    if (!paramsString) {
      throw new Error('Decryption resulted in empty string');
    }
    const urlParams = new URLSearchParams(paramsString);
    
    return {
      number: urlParams.get('number'),
      node: urlParams.get('node')
    };
  } catch (error) {
    console.error('Decryption error details:', error);
    return null;
  }
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
        
        // Get and decrypt the encrypted data from URL
        const urlParams = new URLSearchParams(window.location.search);
        const encryptedData = urlParams.get('data');
        
        if (!encryptedData) {
          throw new Error('No encrypted data found');
        }
        
        const decryptedParams = decryptParams(encryptedData);
        if (!decryptedParams) {
          throw new Error('Failed to decrypt parameters');
        }
        
        const newRouteData = {
          fingerprint: result.visitorId,
          number: decryptedParams.number,
          letter: decryptedParams.node
        };
        
        setRouteData(newRouteData);
        
        const nodeResponse = await fetch('/api/verify-node', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newRouteData)
        });
        
        const data = await nodeResponse.json();
        
        if (nodeResponse.status === 404 && data.needsVerification) {
          router.push(`/user-not-found?number=${newRouteData.number}&node=${newRouteData.letter}&fingerprint=${result.visitorId}`);
          return;
        } else if (nodeResponse.status === 403) {
          router.push(`/wrong-group?groupNum=${data.groupCount}&scannedGroup=${newRouteData.number}`);
          return;
        } else if (!nodeResponse.ok) {
          router.push(`/failure?node=${newRouteData.letter}`);
          return;
        }
        setShowGCostInput(true);
        setIsLoading(false);

      } catch (error) {
        console.error('Error:', error);
        router.push('/failure');
      }
    }

    initializeRoute();
  }, [router]);

  // Rest of your component remains the same
  const handleGCostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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

      if (response.status === 200) {
        router.push('/success');
      } 
      else if (response.status === 202) {
        router.push("/finish")
      }
      else {
        router.push(`/failure?node=${routeData?.letter}`);
      }
    } catch (error) {
      console.error('Error:', error);
      router.push(`/failure?node=${routeData?.letter}`);
    }
  };

  if (isLoading && !showGCostInput) {
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