"use client"

import { useState } from "react"
import { ArrowLeft, Moon, Sun, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [reminderTime, setReminderTime] = useState("09:00")
  const [user, setUser] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
  })

  return (
    <div className="min-h-screen bg-noise">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-cyan-700 hover:text-cyan-900 hover:bg-gray-100">
                  <ArrowLeft className="size-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </Link>
              <h1 className="text-lg font-semibold text-cyan-950">Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-cyan-950">Profile</CardTitle>
              <CardDescription className="text-cyan-700">Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-cyan-900">
                  Name
                </Label>
                <Input
                  id="name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cyan-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="border-gray-200"
                />
              </div>
              <Button className="mt-2 bg-cyan-700 hover:bg-cyan-800 text-white">Save Changes</Button>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-cyan-950">Notifications</CardTitle>
              <CardDescription className="text-cyan-700">Configure how you want to be reminded</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-cyan-900">Email Notifications</Label>
                  <p className="text-sm text-cyan-700">Receive reminders via email</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  className="data-[state=checked]:bg-cyan-700"
                />
              </div>
              <Separator className="my-2 bg-gray-200" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-cyan-900">Push Notifications</Label>
                  <p className="text-sm text-cyan-700">Receive reminders on your device</p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                  className="data-[state=checked]:bg-cyan-700"
                />
              </div>
              <Separator className="my-2 bg-gray-200" />
              <div className="space-y-2">
                <Label htmlFor="reminder-time" className="text-cyan-900">
                  Default Reminder Time
                </Label>
                <Input
                  id="reminder-time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="border-gray-200 w-40"
                />
                <p className="text-sm text-cyan-700">Set the default time for daily reminders</p>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-cyan-950">Appearance</CardTitle>
              <CardDescription className="text-cyan-700">Customize how Pebblr looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {darkMode ? <Moon className="h-5 w-5 text-cyan-700" /> : <Sun className="h-5 w-5 text-cyan-700" />}
                  <div className="space-y-0.5">
                    <Label className="text-cyan-900">Dark Mode</Label>
                    <p className="text-sm text-cyan-700">Switch between light and dark themes</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} className="data-[state=checked]:bg-cyan-700" />
              </div>
            </CardContent>
          </Card>

          {/* Account Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-cyan-950">Account</CardTitle>
              <CardDescription className="text-cyan-700">Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start border-gray-200 text-cyan-700 hover:text-cyan-900 hover:bg-gray-50"
              >
                <User className="mr-2 h-4 w-4" />
                Change Password
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-gray-200 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-gray-500 pt-4">
            <p>Pebblr v1.0.0</p>
            <p className="mt-1">© 2023 Pebblr. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

