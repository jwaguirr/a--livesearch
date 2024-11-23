'use client';

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';

export default function WrongGroup() {
    const [yourGroupColor, setYourGroupColor] = useState<{ name: string; hex: string }>({ name: 'N/A', hex: '#FFFFFF' });
    const [scannedGroupColor, setScannedGroupColor] = useState<{ name: string; hex: string }>({ name: 'N/A', hex: '#FFFFFF' });

    const getRouteColor = (colorNumber: number | null): { name: string; hex: string } => {
        switch (colorNumber) {
          case 1:
            return { name: 'Yellow', hex: '#FCD34D' };
          case 2:
            return { name: 'Red', hex: '#EF4444' };
          case 3:
            return { name: 'Green', hex: '#10B981' };
          case 4:
            return { name: 'Blue', hex: '#3B82F6' };
          default:
            return { name: 'Unknown', hex: '#6B7280' };
        }
      };

      useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const scannedGroup = urlParams.get('scannedGroup') as string | null;
        const actaulGroupNum = urlParams.get('groupNum') as string | null;
    
        if (scannedGroup) {
            setYourGroupColor(getRouteColor(parseInt(actaulGroupNum)));
        } else {
            console.error('scannedGroup is null or undefined.');
        }
        if (actaulGroupNum) {
            setScannedGroupColor(getRouteColor(parseInt(scannedGroup)));
        } else {
            console.error('scannedGroup is null or undefined.');
        }
    }, []);



  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="text-xl font-semibold text-center text-red-600">
        <div className="flex items-center justify-center gap-2">
          <AlertCircle className="h-8 w-8" />
          Wrong QR Code
        </div>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-lg font-medium">
          You are in Group <span  style={{backgroundColor: yourGroupColor.hex && yourGroupColor.hex}} className={`p-2 rounded-lg bg-[${scannedGroupColor.hex}]`}>{yourGroupColor.name}!</span>
        </p>
        <p>
            But you scanned <span style={{backgroundColor: scannedGroupColor.hex && scannedGroupColor.hex}} className={`p-2 rounded-lg ${scannedGroupColor.hex}`}>{scannedGroupColor.name}</span>
        </p>
        <p className="text-gray-600">
          Please only scan QR codes marked with your assigned group color.
        </p>
      </CardContent>
      <CardFooter className="justify-center">
        <Button 
          onClick={() => window.close()} 
          className="w-full"
        >
          Close Window
        </Button>
      </CardFooter>
    </Card>
  );
}