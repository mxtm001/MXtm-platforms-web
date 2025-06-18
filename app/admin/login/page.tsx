"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if admin is already logged in
    const storedUser = localStorage.getItem("admin_user")
    if (storedUser) {
      router.push("/admin/dashboard")
    }

    // Check if admin credentials are already set
    if (!localStorage.getItem("admin_credentials")) {
      // If not set, initialize with empty array
      localStorage.setItem("admin_credentials", JSON.stringify([]))
    }
  }, [router])

  // Function to check if the email is already registered as admin
  const isAdminRegistered = (adminEmail: string) => {
    try {
      const admins = JSON.parse(localStorage.getItem("admin_credentials") || "[]")
      return admins.some((admin: { email: string }) => admin.email.toLowerCase() === adminEmail.toLowerCase())
    } catch (error) {
      console.error("Error checking admin:", error)
      return false
    }
  }

  // Function to register a new admin
  const registerAdmin = (adminEmail: string, adminPassword: string) => {
    try {
      const admins = JSON.parse(localStorage.getItem("admin_credentials") || "[]")
      admins.push({ email: adminEmail, password: adminPassword })
      localStorage.setItem("admin_credentials", JSON.stringify(admins))
      return true
    } catch (error) {
      console.error("Error registering admin:", error)
      return false
    }
  }

  // Function to verify admin credentials
  const verifyAdmin = (adminEmail: string, adminPassword: string) => {
    try {
      const admins = JSON.parse(localStorage.getItem("admin_credentials") || "[]")
      return admins.some(
        (admin: { email: string; password: string }) =>
          admin.email.toLowerCase() === adminEmail.toLowerCase() && admin.password === adminPassword,
      )
    } catch (error) {
      console.error("Error verifying admin:", error)
      return false
    }
  }

  // Update the handleSubmit function to handle admin login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if this is the default admin (for backward compatibility)
      const isDefaultAdmin = email === "admin@mxtminvestment.com" && password === "Admin123!"

      // Check if admin is registered or if it's the default admin
      if (isDefaultAdmin || verifyAdmin(email, password)) {
        // Store admin info in localStorage
        localStorage.setItem("admin_user", JSON.stringify({ email: email, role: "admin" }))
        localStorage.setItem("user", JSON.stringify({ email: email, role: "admin" }))

        // Redirect to admin dashboard
        router.push("/admin/dashboard")
      }
      // If admin is not registered, register the first admin
      else if (!isAdminRegistered(email) && localStorage.getItem("admin_credentials") === "[]") {
        // Register the first admin
        if (registerAdmin(email, password)) {
          // Store admin info in localStorage
          localStorage.setItem("admin_user", JSON.stringify({ email: email, role: "admin" }))
          localStorage.setItem("user", JSON.stringify({ email: email, role: "admin" }))

          // Redirect to admin dashboard
          router.push("/admin/dashboard")
        } else {
          throw new Error("Failed to register admin")
        }
      } else {
        throw new Error("Invalid admin credentials")
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050e24] flex flex-col">
      <header className="container mx-auto py-4 px-4">
        <Link href="/" className="flex items-center">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
          </div>
          <span className="ml-2 text-white font-medium">MXTM INVESTMENT PLATFORM</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-[#0a1735] rounded-lg shadow-lg p-8">
            <Link href="/" className="flex items-center text-gray-400 hover:text-white mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>

            <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>

            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500 text-red-500">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Admin Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#162040] border-[#253256] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#162040] border-[#253256] text-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0066ff] hover:bg-[#0066ff]/90 text-white font-medium py-2"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login to Admin Panel"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Not an administrator?{" "}
                <Link href="/login" className="text-[#0066ff] hover:underline">
                  Regular Login
                </Link>
              </p>
            </div>

            {/* Demo credentials */}
            <div className="mt-8 p-3 border border-dashed border-gray-600 rounded-md">
              <p className="text-sm text-gray-400 mb-2">Default Admin Access:</p>
              <p className="text-xs text-gray-500">Email: admin@mxtminvestment.com</p>
              <p className="text-xs text-gray-500">Password: Admin123!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
