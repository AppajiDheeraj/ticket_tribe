"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { session } from "@/db/schema";
// ---------- Lightweight MVP Components ---------- //

const ProfileSection = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg -mt-2 -mb-8 font-semibold">Profile</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 pt-0">

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-xl flex items-center justify-center font-semibold">
            {user?.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <div className="text-sm text-neutral-600">
            Your auto-generated avatar
          </div>
        </div>

        {/* Name */}
        <div>
          <Label>Name</Label>
          <Input value={user?.name} className="mt-1" />
        </div>

        {/* Email */}
        <div>
          <Label>Email</Label>
          <Input value={user?.email} className="mt-1 bg-neutral-100" disabled />
        </div>

        <Button className="w-full">Update Profile</Button>
      </CardContent>
    </Card>
  );
};

const AchievementSection = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg -mt-2 -mb-8 font-semibold">Achievements</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 space-y-3 text-sm">

        <div className="flex justify-between border rounded-md p-3">
          <span>Predictions Made</span>
          <span className="font-semibold">34</span>
        </div>

        <div className="flex justify-between border rounded-md p-3">
          <span>Win Rate</span>
          <span className="font-semibold">62%</span>
        </div>

      </CardContent>
    </Card>
  );
};

const SettingsSection = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notify, setNotify] = useState(true);
  const [sound, setSound] = useState(true);
  const [compact, setCompact] = useState(false);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [privacy, setPrivacy] = useState(true);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg -mt-2 -mb-8 font-semibold">Settings</CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4 space-y-7">

        {/* ------------------------ */}
        {/* Appearance Section       */}
        {/* ------------------------ */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-700">Appearance</h3>

          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium mb-1">Dark Mode</Label>
              <p className="text-xs text-neutral-500">Switch between light and dark theme</p>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

        </div>

        <Separator />

        {/* ------------------------ */}
        {/* Notifications Section    */}
        {/* ------------------------ */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-700">Notifications</h3>

          {/* Alerts */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium mb-1">Notifications</Label>
              <p className="text-xs text-neutral-500 ">Receive activity updates</p>
            </div>
            <Switch checked={notify} onCheckedChange={setNotify} />
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium mb-1">Sound</Label>
              <p className="text-xs text-neutral-500">Play sound for messages</p>
            </div>
            <Switch checked={sound} onCheckedChange={setSound} />
          </div>
        </div>

        <Separator />

        {/* ------------------------ */}
        {/* Preferences Section       */}
        {/* ------------------------ */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-700">Preferences</h3>

          {/* Language */}
          <div className="space-y-2">
            <Label className="font-medium mb-2">Language</Label>
            <select
              className="border rounded-md px-3 py-2 text-sm w-full bg-white"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
            </select>
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <Label className="font-medium">Timezone</Label>
            <select
              className="border rounded-md px-3 py-2 text-sm w-full bg-white"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="Asia/Dubai">Asia/Dubai</option>
              <option value="Europe/London">Europe/London</option>
              <option value="America/New_York">America/New York</option>
            </select>
          </div>

        </div>

        <Separator />

        {/* Save Button */}
        <Button className="w-full py-2.5 text-sm font-medium">Save Settings</Button>

      </CardContent>
    </Card>
  );
};


// ---------- Main Settings Page ---------- //

export default function SettingsPage() {
  const user = {
    name: "John Doe",
    email: "john@example.com",
  };

  return (
    <div className="flex-1 py-6 px-6 lg:px-10 flex flex-col gap-y-3">

      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-neutral-500">Manage your account settings and preferences.</p>

      <Separator className="my-2" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT SIDE — Profile + Achievements */}
        <div className="col-span-1 space-y-6">
          <ProfileSection />
          <AchievementSection />
        </div>

        {/* RIGHT SIDE — Settings */}
        <div className="col-span-1 md:col-span-2">
          <SettingsSection />
        </div>

      </div>
    </div>
  );
}
