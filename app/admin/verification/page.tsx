"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
  FileCheck,
  Menu,
} from "lucide-react"
import { getUserVerifications, updateVerificationStatus } from "@/lib/user-service"

export default function AdminVerification() {
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [verifications, setVerifications] = useState<any[]>([])
  const [filteredVerifications, setFilteredVerifications] = useState<any[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

      // Load verification data
      const allVerifications = getUserVerifications()
      setVerifications(allVerifications)
      setFilteredVerifications(allVerifications)
    } catch (error) {
      console.error("Error loading verification data:", error)
      localStorage.removeItem("admin_user")
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  // Filter verifications based on search term
  useEffect(() => {
    if (searchTerm && verifications.length > 0) {
      const filtered = verifications.filter(
        (verification) =>
          verification.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          verification.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          verification.documentType?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredVerifications(filtered)
    } else {
      setFilteredVerifications(verifications)
    }
  }, [searchTerm, verifications])

  const handleLogout = () => {
    localStorage.removeItem("admin_user")
    router.push("/admin/login")
  }

  const handleApproveVerification = (id: string) => {
    try {
      updateVerificationStatus(id, "approved")

      // Refresh verifications
      const updatedVerifications = getUserVerifications()
      setVerifications(updatedVerifications)
      setFilteredVerifications(updatedVerifications)

      setSuccess("Verification approved successfully")

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error("Error approving verification:", error)
      setError("Failed to approve verification")

      // Clear error message after 3 seconds
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleRejectVerification = (id: string) => {
    try {
      updateVerificationStatus(id, "rejected")

      // Refresh verifications
      const updatedVerifications = getUserVerifications()
      setVerifications(updatedVerifications)
      setFilteredVerifications(updatedVerifications)

      setSuccess("Verification rejected successfully")

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error("Error rejecting verification:", error)
      setError("Failed to reject verification")

      // Clear error message after 3 seconds
      setTimeout(() => setError(""), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading verification panel...</div>
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
              <Link
                href="/admin/users"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <Users className="mr-2 h-5 w-5" />
                Users
              </Link>
            </li>
            <li>
              <Link href="/admin/verification" className="flex items-center p-2 rounded-md bg-[#162040] text-white">
                <FileCheck className="mr-2 h-5 w-5" />
                Verification
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
            <h1 className="text-2xl font-bold text-white">User Verification Panel</h1>
            <p className="text-gray-400">Verify user identity documents and KYC submissions</p>
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
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Verification Panel */}
          <Card className="bg-[#0a1735] border-[#253256] text-white">
            <CardHeader>
              <CardTitle>Verification Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending">
                <TabsList className="bg-[#162040] border-[#253256]">
                  <TabsTrigger value="pending" className="data-[state=active]:bg-[#0a1735]">
                    Pending
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="data-[state=active]:bg-[#0a1735]">
                    Approved
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="data-[state=active]:bg-[#0a1735]">
                    Rejected
                  </TabsTrigger>
                  <TabsTrigger value="all" className="data-[state=active]:bg-[#0a1735]">
                    All
                  </TabsTrigger>
                </TabsList>

                <div className="mt-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name, email or document type..."
                      className="pl-9 bg-[#162040] border-[#253256] text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <TabsContent value="pending" className="mt-0">
                  <div className="rounded-md border border-[#253256]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#162040] border-b border-[#253256]">
                            <th className="py-3 px-4 text-left">User</th>
                            <th className="py-3 px-4 text-left">Document Type</th>
                            <th className="py-3 px-4 text-left">Submitted</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredVerifications.filter((v) => v.status === "pending").length > 0 ? (
                            filteredVerifications
                              .filter((v) => v.status === "pending")
                              .map((verification, index) => (
                                <tr key={index} className="border-b border-[#253256] hover:bg-[#162040]">
                                  <td className="py-3 px-4">
                                    <div>
                                      <div className="font-medium">{verification.userName}</div>
                                      <div className="text-xs text-gray-400">{verification.userEmail}</div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">{verification.documentType}</td>
                                  <td className="py-3 px-4">{verification.submittedDate}</td>
                                  <td className="py-3 px-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-500">
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                      Pending
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-2 py-0"
                                        onClick={() => router.push(`/admin/verification/view?id=${verification.id}`)}
                                      >
                                        View
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-2 py-0 bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/20"
                                        onClick={() => handleApproveVerification(verification.id)}
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-2 py-0 bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20"
                                        onClick={() => handleRejectVerification(verification.id)}
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-gray-400">
                                No pending verification requests found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="approved" className="mt-0">
                  <div className="rounded-md border border-[#253256]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#162040] border-b border-[#253256]">
                            <th className="py-3 px-4 text-left">User</th>
                            <th className="py-3 px-4 text-left">Document Type</th>
                            <th className="py-3 px-4 text-left">Submitted</th>
                            <th className="py-3 px-4 text-left">Approved Date</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredVerifications.filter((v) => v.status === "approved").length > 0 ? (
                            filteredVerifications
                              .filter((v) => v.status === "approved")
                              .map((verification, index) => (
                                <tr key={index} className="border-b border-[#253256] hover:bg-[#162040]">
                                  <td className="py-3 px-4">
                                    <div>
                                      <div className="font-medium">{verification.userName}</div>
                                      <div className="text-xs text-gray-400">{verification.userEmail}</div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">{verification.documentType}</td>
                                  <td className="py-3 px-4">{verification.submittedDate}</td>
                                  <td className="py-3 px-4">{verification.approvedDate || "N/A"}</td>
                                  <td className="py-3 px-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Approved
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-2 py-0"
                                      onClick={() => router.push(`/admin/verification/view?id=${verification.id}`)}
                                    >
                                      View
                                    </Button>
                                  </td>
                                </tr>
                              ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-gray-400">
                                No approved verification requests found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="rejected" className="mt-0">
                  <div className="rounded-md border border-[#253256]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#162040] border-b border-[#253256]">
                            <th className="py-3 px-4 text-left">User</th>
                            <th className="py-3 px-4 text-left">Document Type</th>
                            <th className="py-3 px-4 text-left">Submitted</th>
                            <th className="py-3 px-4 text-left">Rejected Date</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredVerifications.filter((v) => v.status === "rejected").length > 0 ? (
                            filteredVerifications
                              .filter((v) => v.status === "rejected")
                              .map((verification, index) => (
                                <tr key={index} className="border-b border-[#253256] hover:bg-[#162040]">
                                  <td className="py-3 px-4">
                                    <div>
                                      <div className="font-medium">{verification.userName}</div>
                                      <div className="text-xs text-gray-400">{verification.userEmail}</div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">{verification.documentType}</td>
                                  <td className="py-3 px-4">{verification.submittedDate}</td>
                                  <td className="py-3 px-4">{verification.rejectedDate || "N/A"}</td>
                                  <td className="py-3 px-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-500">
                                      <XCircle className="h-3 w-3 mr-1" />
                                      Rejected
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-2 py-0"
                                        onClick={() => router.push(`/admin/verification/view?id=${verification.id}`)}
                                      >
                                        View
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-2 py-0 bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/20"
                                        onClick={() => handleApproveVerification(verification.id)}
                                      >
                                        Approve
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-gray-400">
                                No rejected verification requests found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="all" className="mt-0">
                  <div className="rounded-md border border-[#253256]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#162040] border-b border-[#253256]">
                            <th className="py-3 px-4 text-left">User</th>
                            <th className="py-3 px-4 text-left">Document Type</th>
                            <th className="py-3 px-4 text-left">Submitted</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredVerifications.length > 0 ? (
                            filteredVerifications.map((verification, index) => (
                              <tr key={index} className="border-b border-[#253256] hover:bg-[#162040]">
                                <td className="py-3 px-4">
                                  <div>
                                    <div className="font-medium">{verification.userName}</div>
                                    <div className="text-xs text-gray-400">{verification.userEmail}</div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">{verification.documentType}</td>
                                <td className="py-3 px-4">{verification.submittedDate}</td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                      verification.status === "approved"
                                        ? "bg-green-500/20 text-green-500"
                                        : verification.status === "pending"
                                          ? "bg-yellow-500/20 text-yellow-500"
                                          : "bg-red-500/20 text-red-500"
                                    }`}
                                  >
                                    {verification.status === "approved" ? (
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                    ) : verification.status === "pending" ? (
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                    ) : (
                                      <XCircle className="h-3 w-3 mr-1" />
                                    )}
                                    {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-2 py-0"
                                      onClick={() => router.push(`/admin/verification/view?id=${verification.id}`)}
                                    >
                                      View
                                    </Button>
                                    {verification.status === "pending" && (
                                      <>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 px-2 py-0 bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/20"
                                          onClick={() => handleApproveVerification(verification.id)}
                                        >
                                          Approve
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 px-2 py-0 bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20"
                                          onClick={() => handleRejectVerification(verification.id)}
                                        >
                                          Reject
                                        </Button>
                                      </>
                                    )}
                                    {verification.status === "rejected" && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-2 py-0 bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/20"
                                        onClick={() => handleApproveVerification(verification.id)}
                                      >
                                        Approve
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-gray-400">
                                No verification requests found
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
