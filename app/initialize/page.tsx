"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Loader2, AlertTriangle } from 'lucide-react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const TeamRegistrationForm = () => {
  const [teammates, setTeammates] = useState([
    { netid: "", section: "" },
    { netid: "", section: "" }
  ]);
  const [fingerprint, setFingerprint] = useState('');
  const [formData, setFormData] = useState({
    user: { netid: "", section: "" },
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [groupColor, setGroupColor] = useState<number | null>(null);

  const sections = ["9:25am", "10:50am", "1pm", "2:30pm", "7pm"];

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getFingerprint() {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setFingerprint(result.visitorId);
    }
    getFingerprint();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(fingerprint)
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          netID: formData.user.netid,
          section: formData.user.section,
          groupMembers: teammates.map(teammate => teammate.netid).filter(netid => netid !== ""),
          sections: teammates.map(teammate => teammate.section).filter(section => section !== ""),
          fingerPrint: fingerprint,
          idealRoute: ["A", "B", "C", "D", "E"],
          progress: [{"initial" : new Date().toISOString()}],
          goodProgress: []
        })
      });

      const data = await response.json();
      if (response.ok) {
        setIsSubmitted(true);
        setGroupColor(data.groupColorCounter);
      } else {
        setError(data.error || 'An error occurred during submission');
      }
    } catch (error) {
      setError('Failed to submit form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-2xl font-bold text-center text-red-600">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Registration Failed
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-lg">{error}</p>
            {error.includes('already registered') ? (
              <p className="text-sm">You have already registered a team. Please proceed with the activity.</p>
            ) : (
              <p className="text-sm">Please try submitting your registration again.</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          {!error.includes('already registered') && (
            <Button className="w-full" onClick={() => setError(null)}>
              Try Again
            </Button>
          )}
          <Button className="w-full" variant="outline" onClick={() => window.close()}>
            Close Window
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const handleUserInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      user: { ...prev.user, [field]: value }
    }));
  };

  const handleTeammateChange = (index: number, field: string, value: string) => {
    const newTeammates = [...teammates];
    newTeammates[index] = { ...newTeammates[index], [field]: value };
    setTeammates(newTeammates);
  };

  const addTeammate = () => {
    setTeammates([...teammates, { netid: "", section: "" }]);
  };

  const removeTeammate = (index: number) => {
    setTeammates(teammates.filter((_, i) => i !== index));
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-2xl font-bold text-center text-green-600">
          Registration Successful!
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-lg">Your team has been registered successfully.</p>
            <p className="font-bold">Your Route Color Number: {groupColor}</p>
            <p className="text-sm">Please remember this number as it represents your route color.</p>
            <p>You can now begin the activity!</p>
            <p className="text-sm text-gray-600">You may safely close this page.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => window.close()}>Close Window</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-2xl font-bold text-center">Team Registration</CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userNetId">Your NetID</Label>
              <Input
                id="userNetId"
                value={formData.user.netid}
                onChange={(e) => handleUserInputChange('netid', e.target.value)}
                placeholder="Enter your netid"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userSection">Your Section</Label>
              <Select
                value={formData.user.section}
                onValueChange={(value) => handleUserInputChange('section', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map(section => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {teammates.map((teammate, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Teammate {index + 1}</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeTeammate(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  value={teammate.netid}
                  onChange={(e) => handleTeammateChange(index, 'netid', e.target.value)}
                  placeholder={`Enter teammate ${index + 1}'s netid`}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Section</Label>
                <Select
                  value={teammate.section}
                  onValueChange={(value) => handleTeammateChange(index, 'section', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map(section => (
                      <SelectItem key={section} value={section}>
                        {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}

          <Button
            type="button"
            onClick={addTeammate}
            className="w-full"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Teammate
          </Button>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Team'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TeamRegistrationForm;