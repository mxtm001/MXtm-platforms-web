"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart2,
  Users,
  DollarSign,
  Clock,
  LogOut,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Shield,
  AlertCircle,
  ChevronLeft,
  Menu,
} from "lucide-react"
import {
  getUserByEmail,
  updateUserStatus,
  addProfitToUser,
  deductFromUserBalance,
  getUserTransactions,
  getUserInvestments,
} from "@/lib/user-service"

export default function EditUser() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [investments, setInvestments] = useState<any[]>([])
  const [profitAmount, setProfitAmount] = useState("")
  const [deductAmount, setDeductAmount] = useState("")
  const [statusValue, setStatusValue] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check if admin is logged in
    const storedAdmin = localStorage.getItem("admin_user")
    if (!storedAdmin) {
      router.push("/admin/login")
      return
    }

    try {
      const admin = JSON.parse(storedAdmin)
      if (admin.role !== "admin") {
        router.push("/admin/login")
        return
      }
      setAdminUser(admin)

      // Load user data
      if (email) {
        const userData = getUserByEmail(email)
        if (userData) {
          setUser(userData)
          setStatusValue(userData.status || "pending")

          // Load user transactions and investments
          setTransactions(getUserTransactions(email))
          setInvestments(getUserInvestments(email))
        } else {
          setError("User not found")
        }
      } else {
        setError("No user email provided")
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      setError("Failed to load user data")
    } finally {
      setLoading(false)
    }
  }, [router, email])

  const handleLogout = () => {
    localStorage.removeItem("admin_user")
    router.push("/admin/login")
  }

  const handleAddProfit = () => {
    if (!email) return

    const amount = Number.parseFloat(profitAmount)
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid profit amount")
      return
    }

    try {
      addProfitToUser(email, amount)

      // Refresh user data
      const updatedUser = getUserByEmail(email)
      setUser(updatedUser)
      setTransactions(getUserTransactions(email))

      setSuccess(`Successfully added $${amount.toFixed(2)} profit to user account`)
      setProfitAmount("")
    } catch (error) {
      console.error("Error adding profit:", error)
      setError("Failed to add profit")
    }
  }

  const handleDeductBalance = () => {
    if (!email) return

    const amount = Number.parseFloat(deductAmount)
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid deduction amount")
      return
    }

    try {
      deductFromUserBalance(email, amount)

      // Refresh user data
      const updatedUser = getUserByEmail(email)
      setUser(updatedUser)
      setTransactions(getUserTransactions(email))

      setSuccess(`Successfully deducted $${amount.toFixed(2)} from user account`)
      setDeductAmount("")
    } catch (error) {
      console.error("Error deducting balance:", error)
      setError("Failed to deduct balance")
    }
  }

  const handleUpdateStatus = () => {
    if (!email || !statusValue) return

    try {
      updateUserStatus(email, statusValue)

      // Refresh user data
      const updatedUser = getUserByEmail(email)
      setUser(updatedUser)

      setSuccess(`Successfully updated user status to ${statusValue}`)
    } catch (error) {
      console.error("Error updating status:", error)
      setError("Failed to update status")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading user data...</div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-[#050e24] p-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/admin/users")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050e24] flex">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-[#0a1735] text-white fixed h-full z-30 transition-transform duration-300 transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-4 border-b border-[#253256]">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
            <span className="ml-2 font-medium text-sm">ADMIN PANEL</span>
          </Link>
        </div>

        <div className="p-4 border-b border-[#253256]">
          <div className="flex items-center">
            <div className="bg-[#162040] h-8 w-8 rounded-full flex items-center justify-center mr-2">
              <Shield className="h-4 w-4 text-[#0066ff]" />
            </div>
            <div>
              <p className="text-sm font-medium">{adminUser?.email}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin/dashboard"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <BarChart2 className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="flex items-center p-2 rounded-md bg-[#162040] text-white">
                <Users className="mr-2 h-5 w-5" />
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/admin/deposits"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <ArrowUpRight className="mr-2 h-5 w-5" />
                Deposits
              </Link>
            </li>
            <li>
              <Link
                href="/admin/withdrawals"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <ArrowDownRight className="mr-2 h-5 w-5" />
                Withdrawals
              </Link>
            </li>
            <li>
              <Link
                href="/admin/investments"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <DollarSign className="mr-2 h-5 w-5" />
                Investments
              </Link>
            </li>
            <li>
              <Link
                href="/admin/chat"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <Clock className="mr-2 h-5 w-5" />
                Support Chat
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
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
      <main className="flex-1 md:ml-64">
        {/* Mobile Header */}
        <header className="bg-[#0a1735] p-4 flex justify-between items-center md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
          </Link>
          <div className="flex items-center">
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Overlay for mobile menu */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className="p-6">
          <div className="flex items-center mb-6">
            <Button variant="outline" size="sm" className="mr-4" onClick={() => router.push("/admin/users")}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Edit User</h1>
              <p className="text-gray-400">Manage user account and transactions</p>
            </div>
          </div>

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

          {/* User Overview */}
          <Card className="bg-[#0a1735] border-[#253256] text-white mb-6">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription className="text-gray-400">Basic user details and account status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <div className="text-lg font-medium">{user.name}</div>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <div className="text-lg font-medium">{user.email}</div>
                    </div>
                    <div>
                      <Label>Account Balance</Label>
                      <div className="text-lg font-medium text-green-500">
                        ${user.balance?.toLocaleString() || "0.00"}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-4">
                    <div>
                      <Label>Status</Label>
                      <div className="flex items-center mt-1">
                        <Select value={statusValue} onValueChange={setStatusValue}>
                          <SelectTrigger className="bg-[#162040] border-[#253256] text-white w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0a1735] border-[#253256] text-white">
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="blocked">Blocked</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button className="ml-2 bg-[#0066ff] hover:bg-[#0066ff]/90" onClick={handleUpdateStatus}>
                          Update
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Joined Date</Label>
                      <div className="text-lg font-medium">{user.joined || "N/A"}</div>
                    </div>
                    <div>
                      <Label>Last Login</Label>
                      <div className="text-lg font-medium">N/A</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manage Balance */}
          <Card className="bg-[#0a1735] border-[#253256] text-white mb-6">
            <CardHeader>
              <CardTitle>Manage Balance</CardTitle>
              <CardDescription className="text-gray-400">Add profit or deduct from user balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Add Profit</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="profit-amount">Profit Amount ($)</Label>
                      <div className="flex mt-1">
                        <Input
                          id="profit-amount"
                          type="number"
                          placeholder="Enter amount"
                          className="bg-[#162040] border-[#253256] text-white"
                          value={profitAmount}
                          onChange={(e) => setProfitAmount(e.target.value)}
                        />
                        <Button className="ml-2 bg-green-600 hover:bg-green-700" onClick={handleAddProfit}>
                          Add Profit
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        This will add profit to the user's balance and create a transaction record
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Deduct Balance</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="deduct-amount">Deduction Amount ($)</Label>
                      <div className="flex mt-1">
                        <Input
                          id="deduct-amount"
                          type="number"
                          placeholder="Enter amount"
                          className="bg-[#162040] border-[#253256] text-white"
                          value={deductAmount}
                          onChange={(e) => setDeductAmount(e.target.value)}
                        />
                        <Button className="ml-2 bg-red-600 hover:bg-red-700" onClick={handleDeductBalance}>
                          Deduct
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        This will deduct from the user's balance and create a transaction record
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Activity */}
          <Card className="bg-[#0a1735] border-[#253256] text-white">
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="transactions">
                <TabsList className="bg-[#162040] border-[#253256]">
                  <TabsTrigger value="transactions" className="data-[state=active]:bg-[#0a1735]">
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger value="investments" className="data-[state=active]:bg-[#0a1735]">
                    Investments
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="transactions" className="mt-4">
                  <div className="rounded-md border border-[#253256]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#162040] border-b border-[#253256]">
                            <th className="py-3 px-4 text-left">Type</th>
                            <th className="py-3 px-4 text-left">Amount</th>
                            <th className="py-3 px-4 text-left">Method</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.length > 0 ? (
                            transactions.map((transaction, index) => (
                              <tr key={index} className="border-b border-[#253256] hover:bg-[#162040]">
                                <td className="py-3 px-4">
                                  <span className={transaction.type === "deposit" ? "text-green-500" : "text-red-500"}>
                                    {transaction.type === "deposit" ? "Deposit" : "Withdrawal"}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  ${transaction.amount?.toLocaleString() || "0.00"} {transaction.currency}
                                </td>
                                <td className="py-3 px-4">{transaction.method}</td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                      transaction.status === "completed"
                                        ? "bg-green-500/20 text-green-500"
                                        : transaction.status === "pending"
                                          ? "bg-yellow-500/20 text-yellow-500"
                                          : "bg-red-500/20 text-red-500"
                                    }`}
                                  >
                                    {transaction.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4">{transaction.date}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-gray-400">
                                No transactions found for this user
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="investments" className="mt-4">
                  <div className="rounded-md border border-[#253256]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#162040] border-b border-[#253256]">
                            <th className="py-3 px-4 text-left">Plan</th>
                            <th className="py-3 px-4 text-left">Amount</th>
                            <th className="py-3 px-4 text-left">Profit</th>
                            <th className="py-3 px-4 text-left">Duration</th>
                            <th className="py-3 px-4 text-left">Start Date</th>
                            <th className="py-3 px-4 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {investments.length > 0 ? (
                            investments.map((investment, index) => (
                              <tr key={index} className="border-b border-[#253256] hover:bg-[#162040]">
                                <td className="py-3 px-4">{investment.plan}</td>
                                <td className="py-3 px-4">${investment.amount?.toLocaleString() || "0.00"}</td>
                                <td className="py-3 px-4">${investment.profit?.toLocaleString() || "0.00"}</td>
                                <td className="py-3 px-4">{investment.duration}</td>
                                <td className="py-3 px-4">{investment.startDate}</td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                      investment.status === "active"
                                        ? "bg-green-500/20 text-green-500"
                                        : "bg-blue-500/20 text-blue-500"
                                    }`}
                                  >
                                    {investment.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-gray-400">
                                No investments found for this user
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
