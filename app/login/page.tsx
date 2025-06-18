"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [savedLogin, setSavedLogin] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Check for saved login
    const saved = localStorage.getItem("savedLogin")
    if (saved) {
      try {
        const loginData = JSON.parse(saved)
        setSavedLogin(loginData)
        setFormData((prev) => ({ ...prev, email: loginData.email }))
      } catch (error) {
        console.error("Error parsing saved login:", error)
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    setError("")
  }

  const handleAutoLogin = async () => {
    if (!savedLogin) return

    setLoading(true)
    try {
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const user = users.find((u: any) => u.email === savedLogin.email)

      if (user && !user.isBlocked) {
        // Set user session
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: user.email,
            name: user.fullName || user.name,
            balance: user.balance || 2000000,
          }),
        )

        // Force redirect to dashboard
        window.location.href = "/dashboard"
      } else {
        localStorage.removeItem("savedLogin")
        setSavedLogin(null)
        setError("Account not found or blocked")
      }
    } catch (error) {
      setError("Auto-login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Get registered users
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

      console.log("Attempting login for:", formData.email)
      console.log(
        "Available users:",
        users.map((u: any) => ({ email: u.email, hasPassword: !!u.password })),
      )

      // Find user by email and password
      const user = users.find((u: any) => {
        const emailMatch = u.email?.toLowerCase() === formData.email.toLowerCase()
        const passwordMatch = u.password === formData.password
        return emailMatch && passwordMatch
      })

      if (!user) {
        // Check if email exists but password is wrong
        const emailExists = users.find((u: any) => u.email?.toLowerCase() === formData.email.toLowerCase())
        if (emailExists) {
          throw new Error("Incorrect password")
        } else {
          throw new Error("No account found with this email. Please register first.")
        }
      }

      if (user.isBlocked) {
        throw new Error("Your account has been blocked. Please contact support.")
      }

      // Ensure user has $2M balance
      if (user.balance !== 2000000) {
        user.balance = 2000000
        const updatedUsers = users.map((u: any) => (u.email === user.email ? user : u))
        localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
      }

      // Save login if remember me is checked
      if (formData.rememberMe) {
        localStorage.setItem(
          "savedLogin",
          JSON.stringify({
            email: formData.email,
            timestamp: Date.now(),
          }),
        )
      }

      // Set user session
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          name: user.fullName || user.name,
          balance: user.balance,
        }),
      )

      console.log("Login successful, redirecting to dashboard")

      // Force redirect to dashboard
      window.location.href = "/dashboard"
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const clearSavedLogin = () => {
    localStorage.removeItem("savedLogin")
    setSavedLogin(null)
    setFormData({ email: "", password: "", rememberMe: false })
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#050e24] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center mb-4">
            <Image src="/logo.png" alt="MXTM Investment" width={48} height={48} />
            <span className="ml-2 text-white font-medium">MXTM INVESTMENT</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your investment account</p>
        </div>

        <Card className="bg-[#0a1735] border-[#253256]">
          <CardHeader>
            <CardTitle className="text-white">Sign In</CardTitle>
            <CardDescription className="text-gray-300">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {savedLogin && (
              <Alert className="mb-4 border-green-500 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-500">
                  Welcome back! We found your saved login.
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleAutoLogin}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {loading ? "Signing in..." : "Continue as " + savedLogin.email}
                    </Button>
                    <Button size="sm" variant="outline" onClick={clearSavedLogin}>
                      Use different account?
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="mb-4 border-red-500 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-500">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-[#162040] border-[#253256] text-white"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-[#162040] border-[#253256] text-white pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, rememberMe: checked as boolean }))}
                />
                <Label htmlFor="rememberMe" className="text-sm text-gray-300">
                  Remember me for next time
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#f9a826] hover:bg-[#f9a826]/90 text-black font-medium"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link href="/forgot-password" className="text-[#f9a826] hover:underline text-sm">
                Forgot your password?
              </Link>
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link href="/register" className="text-[#f9a826] hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
