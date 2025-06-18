"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Download,
  Filter,
  Plus,
} from "lucide-react"
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { firebaseConfig } from "@/lib/firebase-config"

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// User data
const mockUsers = [
  { id: 1, email: "user1@example.com", name: "John Doe", balance: 1250.75, status: "active", joined: "2024-05-01" },
  { id: 2, email: "user2@example.com", name: "Jane Smith", balance: 3420.5, status: "active", joined: "2024-04-15" },
  {
    id: 3,
    email: "user3@example.com",
    name: "Robert Johnson",
    balance: 750.25,
    status: "pending",
    joined: "2024-05-10",
  },
  { id: 4, email: "user4@example.com", name: "Emily Davis", balance: 0, status: "blocked", joined: "2024-03-22" },
  {
    id: 5,
    email: "user5@example.com",
    name: "Michael Wilson",
    balance: 5200.8,
    status: "active",
    joined: "2024-02-18",
  },
  { id: 6, email: "user6@example.com", name: "Sarah Brown", balance: 1800.25, status: "active", joined: "2024-03-05" },
  { id: 7, email: "user7@example.com", name: "David Miller", balance: 950.6, status: "pending", joined: "2024-05-08" },
  {
    id: 8,
    email: "user8@example.com",
    name: "Jennifer Taylor",
    balance: 3100.4,
    status: "active",
    joined: "2024-01-20",
  },
  { id: 9, email: "user9@example.com", name: "Thomas Anderson", balance: 0, status: "blocked", joined: "2024-02-10" },
  {
    id: 10,
    email: "user10@example.com",
    name: "Lisa Martinez",
    balance: 2750.9,
    status: "active",
    joined: "2024-04-02",
  },
]

export default function AdminUsers() {
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)
  const router = useRouter()

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
    } catch (error) {
      localStorage.removeItem("admin_user")
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    // Filter users based on search term and status filter
    let filtered = mockUsers

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }, [searchTerm, statusFilter])

  const handleLogout = () => {
    localStorage.removeItem("admin_user")
    router.push("/admin/login")
  }

  // Calculate statistics
  const totalUsers = mockUsers.length
  const activeUsers = mockUsers.filter((user) => user.status === "active").length
  const pendingUsers = mockUsers.filter((user) => user.status === "pending").length
  const blockedUsers = mockUsers.filter((user) => user.status === "blocked").length

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
      <aside className="w-64 bg-[#0a1735] text-white hidden md:block">
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
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <header className="bg-[#0a1735] p-4 flex justify-between items-center md:hidden">
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

        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <p className="text-gray-400">Manage platform users and their accounts</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-gray-400">All registered users</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <CheckCircle className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeUsers}</div>
                <p className="text-xs text-gray-400">{((activeUsers / totalUsers) * 100).toFixed(1)}% of total users</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Users</CardTitle>
                <AlertCircle className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingUsers}</div>
                <p className="text-xs text-gray-400">Awaiting verification</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
                <XCircle className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blockedUsers}</div>
                <p className="text-xs text-gray-400">Access restricted</p>
              </CardContent>
            </Card>
          </div>

          {/* User Management */}
          <Card className="bg-[#0a1735] border-[#253256] text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="h-8">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" className="h-8 bg-[#0066ff] hover:bg-[#0066ff]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="search" className="sr-only">
                    Search
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="search"
                      placeholder="Search users by name or email..."
                      className="pl-9 bg-[#162040] border-[#253256] text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Label htmlFor="status-filter" className="sr-only">
                    Filter by Status
                  </Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status-filter" className="bg-[#162040] border-[#253256] text-white">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a1735] border-[#253256] text-white">
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">More filters</span>
                </Button>
              </div>

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
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-[#253256] hover:bg-[#162040]">
                            <td className="py-3 px-4">{user.name}</td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4">${user.balance.toLocaleString()}</td>
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
                                {user.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">{user.joined}</td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" className="h-8 px-2 py-0">
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 px-2 py-0">
                                  View
                                </Button>
                                {user.status !== "blocked" ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2 py-0 bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20"
                                  >
                                    Block
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2 py-0 bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/20"
                                  >
                                    Unblock
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-400">
                            No users found matching your search criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-400">
                  Showing <span className="font-medium">{filteredUsers.length}</span> of{" "}
                  <span className="font-medium">{totalUsers}</span> users
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-[#162040]">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
