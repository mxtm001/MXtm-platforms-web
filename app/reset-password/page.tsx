"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, CheckCircle, Lock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [formData, setFormData] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Get email and code from URL parameters
    const email = searchParams?.get("email") || ""
    const code = searchParams?.get("code") || ""

    setFormData((prev) => ({
      ...prev,
      email,
      code,
    }))
  }, [searchParams])

  useEffect(() => {
    // Countdown timer for redirect after successful password reset
    if (success && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (success && countdown === 0) {
      router.push("/login")
    }
  }, [success, countdown, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Password strength validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      setLoading(false)
      return
    }

    // Check if password contains at least one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      )
      setLoading(false)
      return
    }

    try {
      // In a real app, you would make an API call to verify the code and reset the password
      // For demo purposes, we'll just simulate a successful password reset
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success message and start countdown for redirect
      setSuccess(true)
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
            <Link href="/forgot-password" className="flex items-center text-gray-400 hover:text-white mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forgot Password
            </Link>

            <h2 className="text-2xl font-bold text-white mb-6 text-center">Reset Password</h2>

            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500 text-red-500">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success ? (
              <div className="space-y-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </div>

                <Alert className="mb-6 bg-green-500/10 border-green-500 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Password Reset Successful</AlertTitle>
                  <AlertDescription>
                    Your password has been reset successfully. You can now log in with your new password.
                  </AlertDescription>
                </Alert>

                <p className="text-gray-300">
                  Redirecting to login page in <span className="text-white font-bold">{countdown}</span> seconds...
                </p>

                <Button onClick={() => router.push("/login")} className="bg-[#0066ff] hover:bg-[#0066ff]/90">
                  Login Now
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-[#162040] flex items-center justify-center">
                    <Lock className="h-8 w-8 text-[#0066ff]" />
                  </div>
                </div>

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
                    readOnly
                    className="bg-[#162040] border-[#253256] text-white opacity-70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code" className="text-white">
                    Verification Code
                  </Label>
                  <Input
                    id="code"
                    name="code"
                    type="text"
                    placeholder="Enter verification code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    className="bg-[#162040] border-[#253256] text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    New Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a new password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-[#162040] border-[#253256] text-white"
                  />
                  <p className="text-xs text-gray-400">
                    Password must be at least 8 characters and include uppercase, lowercase, number, and special
                    character
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="bg-[#162040] border-[#253256] text-white"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#0066ff] hover:bg-[#0066ff]/90 text-white font-medium py-2"
                  disabled={loading}
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
