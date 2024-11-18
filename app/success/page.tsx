"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const SuccessNode = () => {

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardContent className="p-6 text-center space-y-6">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="mx-auto bg-green-100 rounded-full p-4 w-24 h-24 flex items-center justify-center"
            >
              <Check className="w-12 h-12 text-green-600" />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-2xl font-bold text-green-700">
                Node Found Successfully!
              </h1>
              
              <p className="text-gray-600">
                Great job! You've discovered the correct location.
              </p>
              
              <div className="bg-green-50 p-4 rounded-lg flex items-center gap-2">
                <ArrowRight className="text-green-600" />
                <p className="text-sm text-green-700">
                  Continue to your next destination in the treasure hunt!
                </p>
              </div>
            </motion.div>

            <Button 
              onClick={() => window.close()}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Close Window
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SuccessNode;