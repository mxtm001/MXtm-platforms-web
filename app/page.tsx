"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, TrendingUp, Users, CheckCircle } from "lucide-react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#050e24] text-white">
      {/* Header */}
      <header className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="relative w-12 h-12">
            <Image src="/placeholder.svg?height=48&width=48" alt="MXTM Investment" fill className="object-contain" />
          </div>
          <span className="ml-2 text-white font-medium">MXTM INVESTMENT PLATFORM</span>
        </Link>
        <div className="flex gap-4">
          <Link href="/register">
            <Button className="bg-[#f9a826] hover:bg-[#f9a826]/90 text-black font-medium">Register</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-[#1a2747] hover:bg-[#1a2747]/90 text-white font-medium">Login</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Professional Investment Platform</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Join thousands of investors who trust MXTM for cryptocurrency and forex trading. Start your investment journey
          with our secure and profitable platform.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="bg-[#f9a826] hover:bg-[#f9a826]/90 text-black font-medium">
              Start Investing <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              Login to Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Investment Plans */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Investment Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-[#0a1735] border-[#253256]">
            <CardHeader>
              <CardTitle className="text-white">Starter Plan</CardTitle>
              <CardDescription className="text-gray-300">Perfect for beginners</CardDescription>
            </CardHeader>
            <CardContent className="text-white">
              <div className="text-2xl font-bold mb-4">$100 - $999</div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  5% Daily ROI
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  30 Days Duration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  24/7 Support
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[#0a1735] border-[#253256] border-[#f9a826]">
            <CardHeader>
              <Badge className="w-fit bg-[#f9a826] text-black mb-2">Most Popular</Badge>
              <CardTitle className="text-white">Professional Plan</CardTitle>
              <CardDescription className="text-gray-300">For serious investors</CardDescription>
            </CardHeader>
            <CardContent className="text-white">
              <div className="text-2xl font-bold mb-4">$1,000 - $4,999</div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  8% Daily ROI
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  45 Days Duration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Priority Support
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[#0a1735] border-[#253256]">
            <CardHeader>
              <CardTitle className="text-white">VIP Plan</CardTitle>
              <CardDescription className="text-gray-300">Maximum returns</CardDescription>
            </CardHeader>
            <CardContent className="text-white">
              <div className="text-2xl font-bold mb-4">$5,000+</div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  12% Daily ROI
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  60 Days Duration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  VIP Support
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose MXTM?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-[#f9a826] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
            <p className="text-gray-300">Bank-level security with SSL encryption and cold storage</p>
          </div>
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-[#f9a826] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">High Returns</h3>
            <p className="text-gray-300">Consistent daily returns with professional trading strategies</p>
          </div>
          <div className="text-center">
            <Users className="h-12 w-12 text-[#f9a826] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
            <p className="text-gray-300">Professional traders with years of market experience</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#030917] py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">© 2024 MXTM INVESTMENT PLATFORM. All rights reserved.</p>
            </div>
            <div className="flex gap-4">
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
