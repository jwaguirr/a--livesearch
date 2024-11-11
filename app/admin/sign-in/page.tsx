// app/admin/sign-in/page.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Mail } from 'lucide-react';
import AuthLayout from '@/components/auth-layout';

export default function AdminSignIn() {
  return (
    <AuthLayout showAdminButton={false}>
      <Card className="border-0 bg-white">
        <CardHeader>
          <CardTitle>Faculty Portal</CardTitle>
          <CardDescription>Sign in to access the admin dashboard</CardDescription>
        </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Alert>
                <AlertDescription>
                  This portal is restricted to faculty members only.
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="email">Faculty Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="faculty.email@rice.edu" 
                    className="pl-8" 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    className="pl-8" 
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Faculty Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </AuthLayout>
  );
}