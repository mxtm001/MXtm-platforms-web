"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownLeft, Wallet, Bell, User, LogOut } from "lucide-react"
import { CurrencyConverter } from "@/components/currency-converter"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const userData = JSON.parse(storedUser)

      // Get registered users to find the current user's full data
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const currentUserData = registeredUsers.find((u: any) => u.email === userData.email)

      if (currentUserData) {
        // Ensure balance is set to $2,000,000
        if (currentUserData.balance !== 2000000) {
          currentUserData.balance = 2000000

          // Update in localStorage
          const updatedUsers = registeredUsers.map((u: any) => (u.email === userData.email ? currentUserData : u))
          localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))

          // Update current user session
          userData.balance = 2000000
          localStorage.setItem("user", JSON.stringify(userData))
        }

        setUser({
          ...userData,
          balance: currentUserData.balance || 2000000,
          name: currentUserData.fullName || currentUserData.name || userData.name || userData.email,
          isVerified: currentUserData.isVerified || false,
          transactions: currentUserData.transactions || [],
          investments: currentUserData.investments || [],
        })

        // Load recent transactions
        setTransactions((currentUserData.transactions || []).slice(-5))
      } else {
        setUser({
          ...userData,
          balance: 2000000,
          name: userData.name || userData.email,
          isVerified: false,
          transactions: [],
          investments: [],
        })
      }
    } catch (error) {
      console.error("Error loading user data:", error)
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#050e24] text-white">
      {/* Header */}
      <header className="border-b border-[#253256] bg-[#0a1735]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">MXTM Investment</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
          <p className="text-gray-400">Here's your investment overview</p>
        </div>

        {/* Balance Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#0a1735] border-[#253256] md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-[#f9a826]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-2">{formatCurrency(user.balance)}</div>
              <CurrencyConverter amount={user.balance} />
              <div className="flex items-center space-x-2 mt-4">
                <Badge variant={user.isVerified ? "default" : "secondary"} className="bg-green-600">
                  {user.isVerified ? "Verified" : "Unverified"}
                </Badge>
                <Badge variant="outline" className="border-[#f9a826] text-[#f9a826]">
                  Premium Account
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0a1735] border-[#253256]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">+$45,230</div>
              <p className="text-xs text-gray-400">+12.5% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/dashboard/deposit">
            <Card className="bg-[#0a1735] border-[#253256] hover:border-[#f9a826] transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <ArrowDownLeft className="h-8 w-8 text-[#f9a826] mb-2" />
                <span className="text-sm font-medium">Deposit</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/withdraw">
            <Card className="bg-[#0a1735] border-[#253256] hover:border-[#f9a826] transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <ArrowUpRight className="h-8 w-8 text-[#f9a826] mb-2" />
                <span className="text-sm font-medium">Withdraw</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/investments">
            <Card className="bg-[#0a1735] border-[#253256] hover:border-[#f9a826] transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <TrendingUp className="h-8 w-8 text-[#f9a826] mb-2" />
                <span className="text-sm font-medium">Invest</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/verification">
            <Card className="bg-[#0a1735] border-[#253256] hover:border-[#f9a826] transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <User className="h-8 w-8 text-[#f9a826] mb-2" />
                <span className="text-sm font-medium">Verify</span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-[#0a1735] border-[#253256] mb-8">
          <CardHeader>
            <CardTitle className="text-white">Recent Transactions</CardTitle>
            <CardDescription className="text-gray-400">Your latest account activity</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-[#253256] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "deposit" ? "bg-green-500/20" : "bg-red-500/20"
                        }`}
                      >
                        {transaction.type === "deposit" ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white capitalize">{transaction.type}</p>
                        <p className="text-sm text-gray-400">{transaction.method}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${transaction.type === "deposit" ? "text-green-500" : "text-red-500"}`}
                      >
                        {transaction.type === "deposit" ? "+" : "-"}${transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-400">{transaction.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No transactions yet</p>
                <p className="text-sm text-gray-500">Your transaction history will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Investment Plans */}
        <Card className="bg-[#0a1735] border-[#253256]">
          <CardHeader>
            <CardTitle className="text-white">Investment Plans</CardTitle>
            <CardDescription className="text-gray-400">Choose a plan that suits your goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-[#253256] rounded-lg">
                <h3 className="font-semibold text-white mb-2">Starter Plan</h3>
                <p className="text-2xl font-bold text-[#f9a826] mb-2">5%</p>
                <p className="text-sm text-gray-400 mb-4">Daily returns</p>
                <p className="text-xs text-gray-500">Min: $100 - Max: $1,000</p>
              </div>
              <div className="p-4 border border-[#f9a826] rounded-lg bg-[#f9a826]/5">
                <h3 className="font-semibold text-white mb-2">Premium Plan</h3>
                <p className="text-2xl font-bold text-[#f9a826] mb-2">8%</p>
                <p className="text-sm text-gray-400 mb-4">Daily returns</p>
                <p className="text-xs text-gray-500">Min: $1,000 - Max: $10,000</p>
              </div>
              <div className="p-4 border border-[#253256] rounded-lg">
                <h3 className="font-semibold text-white mb-2">VIP Plan</h3>
                <p className="text-2xl font-bold text-[#f9a826] mb-2">12%</p>
                <p className="text-sm text-gray-400 mb-4">Daily returns</p>
                <p className="text-xs text-gray-500">Min: $10,000+</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
