"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminSettings() {
  const [admins, setAdmins] = useState<Array<{ email: string; password: string }>>([])
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [newAdminPassword, setNewAdminPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in as admin
    const storedUser = localStorage.getItem("admin_user")
    if (!storedUser) {
      router.push("/admin/login")
      return
    }

    // Load admin credentials
    try {
      const adminCredentials = JSON.parse(localStorage.getItem("admin_credentials") || "[]")
      setAdmins(adminCredentials)
    } catch (error) {
      console.error("Error loading admin credentials:", error)
      setError("Failed to load admin credentials")
    }
  }, [router])

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Check if admin already exists
      if (admins.some((admin) => admin.email.toLowerCase() === newAdminEmail.toLowerCase())) {
        setError("Admin with this email already exists")
        setLoading(false)
        return
      }

      // Add new admin
      const updatedAdmins = [...admins, { email: newAdminEmail, password: newAdminPassword }]
      localStorage.setItem("admin_credentials", JSON.stringify(updatedAdmins))
      setAdmins(updatedAdmins)
      setNewAdminEmail("")
      setNewAdminPassword("")
      setSuccess("Admin added successfully")
    } catch (error) {
      console.error("Error adding admin:", error)
      setError("Failed to add admin")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveAdmin = (email: string) => {
    try {
      // Check if this is the only admin
      if (admins.length <= 1) {
        setError("Cannot remove the only admin")
        return
      }

      // Remove admin
      const updatedAdmins = admins.filter((admin) => admin.email !== email)
      localStorage.setItem("admin_credentials", JSON.stringify(updatedAdmins))
      setAdmins(updatedAdmins)
      setSuccess("Admin removed successfully")
    } catch (error) {
      console.error("Error removing admin:", error)
      setError("Failed to remove admin")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      <Tabs defaultValue="admins" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="admins">Admin Management</TabsTrigger>
          <TabsTrigger value="firebase">Firebase Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="admins">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Add New Admin</CardTitle>
                <CardDescription>Add a new administrator to manage the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mb-4 bg-green-500/10 border-green-500 text-green-500">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleAddAdmin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Admin Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter admin email"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Adding..." : "Add Admin"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Admins</CardTitle>
                <CardDescription>Manage existing administrators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {admins.length === 0 ? (
                    <p className="text-sm text-gray-500">No admins found. Add your first admin.</p>
                  ) : (
                    admins.map((admin, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{admin.email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAdmin(admin.email)}
                          disabled={admins.length <= 1}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="firebase">
          <Card>
            <CardHeader>
              <CardTitle>Firebase Configuration</CardTitle>
              <CardDescription>Configure your Firebase settings for authentication and database</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Firebase integration is currently configured with the default settings. To update your Firebase
                configuration, please edit the firebase-config.ts file.
              </p>

              <div className="bg-gray-100 p-4 rounded-md">
                <pre className="text-xs overflow-auto">
                  {`// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDYrJJjkLs_AYpEjkRWC4UjvQbAjnV-Cj0",
  authDomain: "mxtm-investment.firebaseapp.com",
  projectId: "mxtm-investment",
  storageBucket: "mxtm-investment.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef",
  measurementId: "G-ABCDEFGHIJ",
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
