// app/admin/dashboard/settings/page.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black">Settings</h1>
        <p className="text-gray-500">Manage your application preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Activity Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Settings</CardTitle>
            <CardDescription>Configure A* search activity parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Time Limit (minutes)</Label>
                <Input type="number" placeholder="60" />
              </div>
              <div>
                <Label>Maximum Team Size</Label>
                <Input type="number" placeholder="3" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Late Submissions</Label>
                  <p className="text-sm text-gray-500">Teams can continue after time limit</p>
                </div>
                <Switch />
              </div>
            </div>
            <Button>Save Settings</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Team Progress Alerts</Label>
                  <p className="text-sm text-gray-500">Get notified of team completions</p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}