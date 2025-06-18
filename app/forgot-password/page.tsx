"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, ArrowLeft, CheckCircle, Mail } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// In a real app, this would be handled by a secure backend
// This is just for demo purposes - Make sure this matches the login page
const DEMO_USERS = [
  { email: "admin@mxtminvestment.com", password: "Admin123!" },
  { email: "demo@mxtminvestment.com", password: "Demo123!" },
  { email: "test@example.com", password: "Test123!" },
]

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Check if email exists in our demo users (case-insensitive)
      const userExists = DEMO_USERS.some((user) => user.email.toLowerCase() === email.toLowerCase().trim())

      if (!userExists) {
        throw new Error("No account found with this email address")
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a random 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      setVerificationCode(code)

      // In a real app, you would send this code to the user's email
      // For demo purposes, we'll just display it on the screen
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
            <Link href="/login" className="flex items-center text-gray-400 hover:text-white mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>

            <h2 className="text-2xl font-bold text-white mb-6 text-center">Forgot Password</h2>

            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500 text-red-500">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success ? (
              <div className="space-y-6">
                <Alert className="mb-6 bg-green-500/10 border-green-500 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Verification Code Sent</AlertTitle>
                  <AlertDescription>
                    A verification code has been sent to your email address. Please check your inbox and use the code to
                    reset your password.
                  </AlertDescription>
                </Alert>

                <div className="p-4 bg-[#162040] rounded-md text-center">
                  <p className="text-sm text-gray-400 mb-2">Your verification code is:</p>
                  <p className="text-2xl font-bold tracking-widest text-white">{verificationCode}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    (In a real application, this would be sent to your email)
                  </p>
                </div>

                <div className="flex justify-center">
                  <Link href={`/reset-password?email=${encodeURIComponent(email)}&code=${verificationCode}`}>
                    <Button className="bg-[#0066ff] hover:bg-[#0066ff]/90">Continue to Reset Password</Button>
                  </Link>
                </div>

                <p className="text-sm text-gray-400 text-center mt-4">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="text-[#0066ff] hover:underline"
                    disabled={loading}
                  >
                    Resend Code
                  </button>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-[#162040] flex items-center justify-center">
                    <Mail className="h-8 w-8 text-[#0066ff]" />
                  </div>
                </div>

                <p className="text-gray-300 text-center mb-6">
                  Enter your email address and we'll send you a verification code to reset your password.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#162040] border-[#253256] text-white"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#0066ff] hover:bg-[#0066ff]/90 text-white font-medium py-2"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Verification Code"}
                </Button>

                <div className="text-center">
                  <Link href="/login" className="text-sm text-[#0066ff] hover:underline">
                    Remember your password? Login
                  </Link>
                </div>
              </form>
            )}

            {/* Demo credentials - Remove this in production */}
            <div className="mt-8 p-3 border border-dashed border-gray-600 rounded-md">
              <p className="text-sm text-gray-400 mb-2">Demo Accounts (for testing only):</p>
              <p className="text-xs text-gray-500">admin@mxtminvestment.com</p>
              <p className="text-xs text-gray-500">demo@mxtminvestment.com</p>
              <p className="text-xs text-gray-500">test@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
