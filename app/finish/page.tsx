"use client";

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, PartyPopper, Coffee } from "lucide-react";
import confetti from 'canvas-confetti';

const CompletionPage = () => {
  useEffect(() => {
    // Fire confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#FCD34D', '#EF4444', '#10B981', '#3B82F6']; // Yellow, Red, Green, Blue

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="max-w-2xl w-full shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-center mb-2">
            Congratulations!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 text-center">
          <div className="animate-bounce flex justify-center">
            <PartyPopper className="h-12 w-12 text-purple-500" />
          </div>
          
          <div className="space-y-4">
            <p className="text-xl text-gray-700">
              You've successfully completed the treasure hunt!
            </p>
            
            <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-100">
              <div className="flex items-center justify-center mb-2">
                <Coffee className="h-6 w-6 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold text-yellow-800">Time for a Reward!</h3>
              </div>
              <p className="text-gray-700">
                Please help yourself to some donuts and refreshments.
              </p>
            </div>

            <div className="mt-6 py-4">
              <p className="text-gray-600 text-sm">
                Thank you for participating! Have a great rest of your day!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletionPage;