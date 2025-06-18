"use client"

import { AlertDescription } from "@/components/ui/alert"

import { AlertTitle } from "@/components/ui/alert"

import { Alert } from "@/components/ui/alert"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  BarChart2,
  Users,
  DollarSign,
  Clock,
  LogOut,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Shield,
  Wallet,
  LineChart,
  BarChart,
  PieChart,
  Menu,
} from "lucide-react"
import {
  getAllUsers,
  getAllTransactions,
  getAllInvestments,
  updateTransactionStatus,
  updateUserStatus,
  migrateLocalStorageToFirebase,
} from "@/lib/database-service"

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [investments, setInvestments] = useState<any[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null)
  const router = useRouter()

  // Load data
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

      // Load data from Firebase
      const loadData = async () => {
        try {
          const allUsers = await getAllUsers()
          const allTransactions = await getAllTransactions()
          const allInvestments = await getAllInvestments()

          setUsers(allUsers)
          setFilteredUsers(allUsers)
          setTransactions(allTransactions)
          setInvestments(allInvestments)
        } catch (error) {
          console.error("Error loading data:", error)
        } finally {
          setLoading(false)
        }
      }

      loadData()
    } catch (error) {
      console.error("Error loading admin data:", error)
      localStorage.removeItem("admin_user")
      router.push("/admin/login")
    }
  }, [router])

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm && users.length > 0) {
      const filtered = users.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  const handleLogout = () => {
    localStorage.removeItem("admin_user")
    router.push("/admin/login")
  }

  const handleApproveTransaction = async (id: string) => {
    try {
      await updateTransactionStatus(id, "completed")

      // Refresh transactions
      const updatedTransactions = await getAllTransactions()
      setTransactions(updatedTransactions)

      // Refresh users data
      const updatedUsers = await getAllUsers()
      setUsers(updatedUsers)
      setFilteredUsers(updatedUsers)
    } catch (error) {
      console.error("Error approving transaction:", error)
    }
  }

  const handleRejectTransaction = async (id: string) => {
    try {
      await updateTransactionStatus(id, "rejected")

      // Refresh transactions
      const updatedTransactions = await getAllTransactions()
      setTransactions(updatedTransactions)
    } catch (error) {
      console.error("Error rejecting transaction:", error)
    }
  }

  const handleBlockUser = async (email: string) => {
    try {
      await updateUserStatus(email, "blocked")

      // Refresh users data
      const updatedUsers = await getAllUsers()
      setUsers(updatedUsers)
      setFilteredUsers(updatedUsers)
    } catch (error) {
      console.error("Error blocking user:", error)
    }
  }

  const handleActivateUser = async (email: string) => {
    try {
      await updateUserStatus(email, "active")

      // Refresh users data
      const updatedUsers = await getAllUsers()
      setUsers(updatedUsers)
      setFilteredUsers(updatedUsers)
    } catch (error) {
      console.error("Error activating user:", error)
    }
  }

  const handleMigrateData = async () => {
    setMigrationStatus("Migrating data from localStorage to Firebase...")
    try {
      await migrateLocalStorageToFirebase()

      // Refresh data
      const allUsers = await getAllUsers()
      const allTransactions = await getAllTransactions()
      const allInvestments = await getAllInvestments()

      setUsers(allUsers)
      setFilteredUsers(allUsers)
      setTransactions(allTransactions)
      setInvestments(allInvestments)

      setMigrationStatus("Migration completed successfully!")
    } catch (error) {
      console.error("Error during migration:", error)
      setMigrationStatus("Error during migration. Please try again.")
    }
  }

  // Calculate statistics
  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.status === "active").length
  const totalDeposits = transactions
    .filter((t) => t.type === "deposit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalWithdrawals = transactions
    .filter((t) => t.type === "withdrawal" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)
  const pendingWithdrawals = transactions.filter((t) => t.type === "withdrawal" && t.status === "pending").length
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalProfit = investments.reduce((sum, inv) => sum + (inv.profit || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading admin dashboard...</div>
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
              <Link href="/admin/dashboard" className="flex items-center p-2 rounded-md bg-[#162040] text-white">
                <BarChart2 className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
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
                href="/admin/verification"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <Shield className="mr-2 h-5 w-5" />
                Verification
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
            <Button variant="outline" size="icon" className="mr-2">
              <Settings className="h-5 w-5" />
            </Button>
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back, Administrator</p>
          </div>

          {/* Migration Alert */}
          {users.length === 0 && (
            <Alert className="mb-6 bg-yellow-500/10 border-yellow-500 text-yellow-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Users Found</AlertTitle>
              <AlertDescription className="flex flex-col gap-2">
                <p>
                  No users found in the database. If you have existing users in localStorage, you can migrate them to
                  Firebase.
                </p>
                <Button onClick={handleMigrateData} className="bg-yellow-500 hover:bg-yellow-600 text-black w-fit">
                  Migrate Data from localStorage
                </Button>
                {migrationStatus && <p className="text-sm">{migrationStatus}</p>}
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-gray-400">{activeUsers} active users</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalDeposits.toLocaleString()}</div>
                <p className="text-xs text-gray-400">
                  {transactions.filter((t) => t.type === "deposit").length} transactions
                </p>
              </CardContent>
            </Card>
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalWithdrawals.toLocaleString()}</div>
                <p className="text-xs text-gray-400">{pendingWithdrawals} pending requests</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
                <Wallet className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalInvestments.toLocaleString()}</div>
                <p className="text-xs text-gray-400">${totalProfit.toLocaleString()} profit generated</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Platform Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <BarChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Activity data will be displayed here</p>
                  <p className="text-sm">Connect to analytics for real-time data</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Investment Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Investment distribution will be displayed here</p>
                  <p className="text-sm">Connect to analytics for real-time data</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="users">
                  <TabsList className="bg-[#162040] border-[#253256]">
                    <TabsTrigger value="users" className="data-[state=active]:bg-[#0a1735]">
                      Users
                    </TabsTrigger>
                    <TabsTrigger value="deposits" className="data-[state=active]:bg-[#0a1735]">
                      Deposits
                    </TabsTrigger>
                    <TabsTrigger value="withdrawals" className="data-[state=active]:bg-[#0a1735]">
                      Withdrawals
                    </TabsTrigger>
                    <TabsTrigger value="investments" className="data-[state=active]:bg-[#0a1735]">
                      Investments
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-4 mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search..."
                        className="pl-9 bg-[#162040] border-[#253256] text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <TabsContent value="users" className="mt-0">
                    <div className="rounded-md border border-[#253256]">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-[#162040] border-b border-[#253256]">
                              <th className="py-3 px-4 text-left">Name</th>
                              <th className="py-3 px-4 text-left">Email</th>
                              <th className="py-3 px-4 text-left">Balance</th>
                              <th className="py-3 px-4 text-left">Status</th>
                              <th className="py-3 px-4 text-left">Joined</th>
                              <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredUsers.length > 0 ? (
                              filteredUsers.map((user, index) => (
                                <tr key={index} className="border-b border-[#253256] hover:bg-[#162040]">
                                  <td className="py-3 px-4">{user.name}</td>
                                  <td className="py-3 px-4">{user.email}</td>
                                  <td className="py-3 px-4">${user.balance?.toLocaleString() || "0.00"}</td>
                                  <td className="py-3 px-4">
                                    <span
                                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                        user.status === "active"
                                          ? "bg-green-500/20 text-green-500"
                                          : user.status === "pending"
                                            ? "bg-yellow-500/20 text-yellow-500"
                                            : "bg-red-500/20 text-red-500"
                                      }`}
                                    >
                                      {user.status === "active" ? (
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                      ) : user.status === "pending" ? (
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                      ) : (
                                        <XCircle className="h-3 w-3 mr-1" />
                                      )}
                                      {user.status || "pending"}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">{user.joined || "N/A"}</td>
                                  <td className="py-3 px-4">
                                    <div className="flex space-x-2">
                                      <Link href={`/admin/users/edit?email=${user.email}`}>
                                        <Button variant="outline" size="sm" className="h-8 px-2 py-0">
                                          Edit
                                        </Button>
                                      </Link>
                                      {user.status !== "blocked" ? (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 px-2 py-0 bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20"
                                          onClick={() => handleBlockUser(user.email)}
                                        >
                                          Block
                                        </Button>
                                      ) : (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 px-2 py-0 bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/20"
                                          onClick={() => handleActivateUser(user.email)}
                                        >
                                          Activate
                                        </Button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="py-8 text-center text-gray-400">
                                  No users found. New users will appear here when they register.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="deposits" className="mt-0">
                    <div className="rounded-md border border-[#253256]">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-[#162040] border-b border-[#253256]">
                              <th className="py-3 px-4 text-left">User</th>
                              <th className="py-3 px-4 text-left">Amount</th>
                              <th className="py-3 px-4 text-left">Method</th>
                              <th className="py-3 px-4 text-left">Status</th>
                              <th className="py-3 px-4 text-left">Date</th>
                              <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.filter((t) => t.type === "deposit").length > 0 ? (
                              transactions
                                .filter((t) => t.type === "deposit")
                                .map((deposit, index) => (
                                  <tr key={index} className="border-b border-[#253256] hover:bg-[#162040]">
                                    <td className="py-3 px-4">{deposit.userName || deposit.userEmail || "Unknown"}</td>
                                    <td className="py-3 px-4">
                                      ${deposit.amount?.toLocaleString() || "0.00"} {deposit.currency}
                                    </td>
                                    <td className="py-3 px-4">{deposit.method}</td>
                                    <td className="py-3 px-4">
                                      <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                          deposit.status === "completed"
                                            ? "bg-green-500/20 text-green-500"
                                            : deposit.status === "pending"
                                              ? "bg-yellow-500/20 text-yellow-500"
                                              : "bg-red-500/20 text-red-500"
                                        }`}
                                      >
                                        {deposit.status === "completed" ? (
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                        ) : deposit.status === "pending" ? (
                                          <AlertCircle className="h-3 w-3 mr-1" />
                                        ) : (
                                          <XCircle className="h-3 w-3 mr-1" />
                                        )}
                                        {deposit.status}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4">{deposit.date}</td>
                                    <td className="py-3 px-4">
                                      {deposit.status === "pending" && (
                                        <div className="flex space-x-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-2 py-0 bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/20"
                                            onClick={() => handleApproveTransaction(deposit.id)}
                                          >
                                            Approve
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-2 py-0 bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20"
                                            onClick={() => handleRejectTransaction(deposit.id)}
                                          >
                                            Reject
                                          </Button>
                                        </div>
                                      )}
                                      {deposit.status !== "pending" && (
                                        <Button variant="outline" size="sm" className="h-8 px-2 py-0">
                                          View
                                        </Button>
                                      )}
                                    </td>
                                  </tr>
                                ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="py-8 text-center text-gray-400">
                                  No deposits found. New deposits will appear here.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="withdrawals" className="mt-0">
                    <div className="rounded-md border border-[#253256]">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-[#162040] border-b border-[#253256]">
                              <th className="py-3 px-4 text-left">User</th>
                              <th className="py-3 px-4 text-left">Amount</th>
                              <th className="py-3 px-4 text-left">Method</th>
                              <th className="py-3 px-4 text-left">Status</th>
                              <th className="py-3 px-4 text-left">Date</th>
                              <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.filter((t) => t.type === "withdrawal").length > 0 ? (
                              transactions
                                .filter((t) => t.type === "withdrawal")
                                .map((withdrawal, index) => (
                                  <tr key={index} className="border-b border-[#253256] hover:bg-[#162040]">
                                    <td className="py-3 px-4">
                                      {withdrawal.userName || withdrawal.userEmail || "Unknown"}
                                    </td>
                                    <td className="py-3 px-4">
                                      ${withdrawal.amount?.toLocaleString() || "0.00"} {withdrawal.currency}
                                    </td>
                                    <td className="py-3 px-4">{withdrawal.method}</td>
                                    <td className="py-3 px-4">
                                      <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                          withdrawal.status === "completed"
                                            ? "bg-green-500/20 text-green-500"
                                            : withdrawal.status === "pending"
                                              ? "bg-yellow-500/20 text-yellow-500"
                                              : "bg-red-500/20 text-red-500"
                                        }`}
                                      >
                                        {withdrawal.status === "completed" ? (
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                        ) : withdrawal.status === "pending" ? (
                                          <AlertCircle className="h-3 w-3 mr-1" />
                                        ) : (
                                          <XCircle className="h-3 w-3 mr-1" />
                                        )}
                                        {withdrawal.status}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4">{withdrawal.date}</td>
                                    <td className="py-3 px-4">
                                      {withdrawal.status === "pending" && (
                                        <div className="flex space-x-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-2 py-0 bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/20"
                                            onClick={() => handleApproveTransaction(withdrawal.id)}
                                          >
                                            Approve
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-2 py-0 bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20"
                                            onClick={() => handleRejectTransaction(withdrawal.id)}
                                          >
                                            Reject
                                          </Button>
                                        </div>
                                      )}
                                      {withdrawal.status !== "pending" && (
                                        <Button variant="outline" size="sm" className="h-8 px-2 py-0">
                                          View
                                        </Button>
                                      )}
                                    </td>
                                  </tr>
                                ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="py-8 text-center text-gray-400">
                                  No withdrawals found. New withdrawal requests will appear here.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="investments" className="mt-0">
                    <div className="rounded-md border border-[#253256]">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-[#162040] border-b border-[#253256]">
                              <th className="py-3 px-4 text-left">User</th>
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
                                  <td className="py-3 px-4">
                                    {investment.userName || investment.userEmail || "Unknown"}
                                  </td>
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
                                      {investment.status === "active" ? (
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                      ) : (
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                      )}
                                      {investment.status}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={7} className="py-8 text-center text-gray-400">
                                  No investments found. New investments will appear here.
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

          {/* System Settings */}
          <div className="grid grid-cols-1 gap-6 mt-8">
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader>
                <CardTitle>Quick Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenance-mode" className="text-base">
                        Maintenance Mode
                      </Label>
                      <p className="text-sm text-gray-400">
                        Enable maintenance mode to temporarily disable user access to the platform
                      </p>
                    </div>
                    <Switch id="maintenance-mode" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="new-registrations" className="text-base">
                        Allow New Registrations
                      </Label>
                      <p className="text-sm text-gray-400">Enable or disable new user registrations</p>
                    </div>
                    <Switch id="new-registrations" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-approve" className="text-base">
                        Auto-Approve Withdrawals
                      </Label>
                      <p className="text-sm text-gray-400">
                        Automatically approve withdrawal requests without manual review
                      </p>
                    </div>
                    <Switch id="auto-approve" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="text-base">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-gray-400">
                        Send email notifications for important platform activities
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
