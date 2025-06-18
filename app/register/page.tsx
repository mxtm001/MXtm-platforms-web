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
import { Eye, EyeOff, CheckCircle, AlertCircle, Globe } from "lucide-react"
import { CountrySelector } from "@/components/country-selector"
import { PhoneInput } from "@/components/phone-input"
import { TimezoneDisplay } from "@/components/timezone-detector"

export default function RegisterPage() {
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    countryCode: "",
    phone: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Auto-detect user's country based on timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const locale = navigator.language || "en-US"
    console.log("Detected timezone:", timezone, "Locale:", locale)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleCountryChange = (country: any) => {
    setFormData((prev) => ({
      ...prev,
      country: country.name,
      countryCode: country.code,
    }))
  }

  const handlePhoneChange = (phone: string) => {
    setFormData((prev) => ({ ...prev, phone }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      if (!formData.country) {
        throw new Error("Please select your country")
      }

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      if (existingUsers.some((user: any) => user.email === formData.email)) {
        throw new Error("User with this email already exists")
      }

      // Get user's timezone and locale info
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const locale = navigator.language || "en-US"

      // Create new user with $2,000,000 starting balance
      const newUser = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        country: formData.country,
        countryCode: formData.countryCode,
        phone: formData.phone,
        balance: 2000000, // $2,000,000 starting balance
        timezone: timezone,
        locale: locale,
        isVerified: false,
        isBlocked: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        transactions: [],
        investments: [],
      }

      // Save user
      existingUsers.push(newUser)
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers))

      // Auto-login: Set user session immediately
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: newUser.email,
          name: newUser.fullName,
          balance: newUser.balance,
          country: newUser.country,
          timezone: newUser.timezone,
        }),
      )

      setSuccess(true)

      // Redirect directly to dashboard after 1.5 seconds
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
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
          <div className="flex items-center justify-center mb-2">
            <Globe className="h-5 w-5 text-[#f9a826] mr-2" />
            <h1 className="text-2xl font-bold">Join Global Investors</h1>
          </div>
          <p className="text-gray-400">Available worldwide - Start your investment journey</p>
          <div className="mt-2">
            <TimezoneDisplay />
          </div>
        </div>

        {success ? (
          <Card className="bg-[#0a1735] border-[#253256]">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Welcome to MXTM Investment!</h3>
                <p className="text-gray-300 mb-4">Your account has been created successfully</p>
                <p className="text-sm text-gray-400">Logging you in automatically...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#0a1735] border-[#253256]">
            <CardHeader>
              <CardTitle className="text-white">Create Your Global Account</CardTitle>
              <CardDescription className="text-gray-300">
                Join investors from {formData.country || "around the world"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4 border-red-500 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-500">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="bg-[#162040] border-[#253256] text-white"
                    placeholder="Enter your full name"
                  />
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
                    className="bg-[#162040] border-[#253256] text-white"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Country</Label>
                  <CountrySelector value={formData.country} onChange={handleCountryChange} />
                </div>

                <PhoneInput
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  countryCode={formData.countryCode}
                  placeholder="Your phone number"
                />

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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="bg-[#162040] border-[#253256] text-white pr-10"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#f9a826] hover:bg-[#f9a826]/90 text-black font-medium"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account & Login"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#f9a826] hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
