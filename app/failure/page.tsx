"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, User2Icon } from "lucide-react";
import { motion } from "framer-motion";

const FailureNode = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardContent className="p-6 text-center space-y-6">
            <motion.div
              animate={{ 
                x: [-10, 10, -10],
                rotate: [-5, 5, -5]
              }}
              transition={{ 
                duration: 0.5,
                repeat: 3
              }}
              className="mx-auto bg-red-100 rounded-full p-4 w-24 h-24 flex items-center justify-center"
            >
              <XCircle className="w-12 h-12 text-red-600" />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-2xl font-bold text-red-700">
                That's Not Right!
              </h1>
              
              <p className="text-gray-600">
                There's been a mistake somewhere.
              </p>
              
              <div className="bg-red-50 p-4 rounded-lg flex items-center gap-2">
                <User2Icon className="text-red-600" />
                <p className="text-sm text-red-700">
                  Please go see a TA for further guidance and help.
                </p>
              </div>
            </motion.div>

            <Button 
              onClick={() => window.close()}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Close Window & Talk to a TA
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FailureNode;