"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
  LogOut,
  HelpCircle,
  Mail,
  Phone,
} from "lucide-react"

export default function Support() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")
  const [messageSent, setMessageSent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const userData = JSON.parse(storedUser)
      setUser(userData)

      // Get registered users to find the current user's full data
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const currentUserData = registeredUsers.find((u: any) => u.email === userData.email)

      if (currentUserData) {
        // Update user with additional data if available
        setUser((prev) => ({
          ...prev,
          balance: currentUserData.balance || 0,
          name: currentUserData.name || userData.email,
        }))
      }
    } catch (error) {
      localStorage.removeItem("user")
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send the message to the server
    setMessageSent(true)
    setMessage("")
    setSubject("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050e24] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1735] text-white hidden md:block">
        <div className="p-4 border-b border-[#253256]">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
            <span className="ml-2 font-medium text-sm">MXTM INVESTMENT</span>
          </Link>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <BarChart2 className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/deposit"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <ArrowUpRight className="mr-2 h-5 w-5" />
                Deposit
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/withdraw"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <ArrowDownRight className="mr-2 h-5 w-5" />
                Withdraw
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/investments"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <DollarSign className="mr-2 h-5 w-5" />
                Investments
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/history"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <Clock className="mr-2 h-5 w-5" />
                History
              </Link>
            </li>
            <li>
              <Link href="/dashboard/support" className="flex items-center p-2 rounded-md bg-[#162040] text-white">
                <HelpCircle className="mr-2 h-5 w-5" />
                Support
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white w-full text-left"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <header className="bg-[#0a1735] p-4 flex justify-between items-center md:hidden">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
          </Link>
          <Button variant="outline" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Support Center</h1>
            <p className="text-gray-400">Get help from our support team</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader>
                <CardTitle>Contact Support Team</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-[#f9a826] mr-4" />
                  <div>
                    <h3 className="font-medium">Phone Support</h3>
                    <p className="text-gray-300">+49 1521 1026452</p>
                    <p className="text-xs text-gray-400 mt-1">Available 24/7 for urgent inquiries</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-[#f9a826] mr-4" />
                  <div>
                    <h3 className="font-medium">Email Support</h3>
                    <p className="text-gray-300">mxtmcontaverificacaocentro@gmail.com</p>
                    <p className="text-xs text-gray-400 mt-1">Response within 24 hours</p>
                  </div>
                </div>

                <div className="bg-[#162040] p-4 rounded-md">
                  <h3 className="font-medium mb-2">Support Hours</h3>
                  <p className="text-sm text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM (CET)</p>
                  <p className="text-sm text-gray-300">Saturday: 10:00 AM - 2:00 PM (CET)</p>
                  <p className="text-sm text-gray-300">Sunday: Closed (Email support only)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {messageSent ? (
                  <div className="bg-green-500/10 border border-green-500 rounded-lg p-6 text-center">
                    <h3 className="text-xl font-medium text-green-500 mb-2">Message Sent!</h3>
                    <p className="text-gray-300">
                      Thank you for contacting us. We'll get back to you as soon as possible.
                    </p>
                    <Button className="mt-4 bg-[#0066ff] hover:bg-[#0066ff]/90" onClick={() => setMessageSent(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="What is your inquiry about?"
                        className="bg-[#162040] border-[#253256] text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your issue or question in detail"
                        className="min-h-[150px] bg-[#162040] border-[#253256] text-white"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-[#0066ff] hover:bg-[#0066ff]/90">
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#0a1735] border-[#253256] text-white md:col-span-2">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">How long does it take to process withdrawals?</h3>
                  <p className="text-sm text-gray-300">
                    Withdrawals are typically processed within 24 hours after request submission. However, depending on
                    the payment method and network congestion, it may take up to 48 hours.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">What is the minimum deposit amount?</h3>
                  <p className="text-sm text-gray-300">
                    The minimum deposit amount varies by investment plan. Our starter plans begin at $50 for Binary
                    options, $100 for Forex, and $200 for Crypto investments.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">How do I verify my account?</h3>
                  <p className="text-sm text-gray-300">
                    To verify your account, please submit a copy of your government-issued ID and a recent utility bill
                    or bank statement showing your address. Send these documents to our support email.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Is my investment secure?</h3>
                  <p className="text-sm text-gray-300">
                    Yes, we implement industry-standard security measures to protect your investments. We use advanced
                    encryption technology and follow strict security protocols to ensure the safety of your funds.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
