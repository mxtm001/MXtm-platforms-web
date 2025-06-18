"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
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
  CheckCircle,
  XCircle,
  ChevronLeft,
  FileCheck,
  Menu,
} from "lucide-react"
import { getVerificationById, updateVerificationStatus, updateVerificationNotes } from "@/lib/user-service"

export default function ViewVerification() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [verification, setVerification] = useState<any>(null)
  const [notes, setNotes] = useState("")
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

      // Load verification data
      if (id) {
        const verificationData = getVerificationById(id)
        if (verificationData) {
          setVerification(verificationData)
          setNotes(verificationData.adminNotes || "")
        } else {
          setError("Verification request not found")
        }
      } else {
        setError("No verification ID provided")
      }
    } catch (error) {
      console.error("Error loading verification data:", error)
      setError("Failed to load verification data")
    } finally {
      setLoading(false)
    }
  }, [router, id])

  const handleLogout = () => {
    localStorage.removeItem("admin_user")
    router.push("/admin/login")
  }

  const handleApprove = () => {
    if (!id) return

    try {
      updateVerificationStatus(id, "approved")
      updateVerificationNotes(id, notes)

      // Refresh verification data
      const updatedVerification = getVerificationById(id)
      setVerification(updatedVerification)

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

  const handleReject = () => {
    if (!id) return

    try {
      updateVerificationStatus(id, "rejected")
      updateVerificationNotes(id, notes)

      // Refresh verification data
      const updatedVerification = getVerificationById(id)
      setVerification(updatedVerification)

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

  const handleSaveNotes = () => {
    if (!id) return

    try {
      updateVerificationNotes(id, notes)
      setSuccess("Notes saved successfully")

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error("Error saving notes:", error)
      setError("Failed to save notes")

      // Clear error message after 3 seconds
      setTimeout(() => setError(""), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading verification details...</div>
      </div>
    )
  }

  if (error && !verification) {
    return (
      <div className="min-h-screen bg-[#050e24] p-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/admin/verification")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Verification Panel
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
            <Button variant="outline" size="sm" className="mr-4" onClick={() => router.push("/admin/verification")}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Verification Details</h1>
              <p className="text-gray-400">Review user verification documents</p>
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
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Verification Status */}
          <Card className="bg-[#0a1735] border-[#253256] text-white mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Verification Status</CardTitle>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    verification?.status === "approved"
                      ? "bg-green-500/20 text-green-500"
                      : verification?.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {verification?.status === "approved" ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : verification?.status === "pending" ? (
                    <AlertCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  {verification?.status.charAt(0).toUpperCase() + verification?.status.slice(1)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">User Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Name</p>
                      <p className="font-medium">{verification?.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="font-medium">{verification?.userEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Submitted Date</p>
                      <p className="font-medium">{verification?.submittedDate}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Document Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Document Type</p>
                      <p className="font-medium">{verification?.documentType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Document Number</p>
                      <p className="font-medium">{verification?.documentNumber || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Country of Issue</p>
                      <p className="font-medium">{verification?.country || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Images */}
          <Card className="bg-[#0a1735] border-[#253256] text-white mb-6">
            <CardHeader>
              <CardTitle>Document Images</CardTitle>
              <CardDescription className="text-gray-400">Review the uploaded verification documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Front Side</h3>
                  <div className="border border-[#253256] rounded-md overflow-hidden">
                    {verification?.frontImage ? (
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={verification.frontImage || "/placeholder.svg"}
                          alt="Document Front"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] w-full flex items-center justify-center bg-[#162040]">
                        <p className="text-gray-400">No front image provided</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Back Side</h3>
                  <div className="border border-[#253256] rounded-md overflow-hidden">
                    {verification?.backImage ? (
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={verification.backImage || "/placeholder.svg"}
                          alt="Document Back"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] w-full flex items-center justify-center bg-[#162040]">
                        <p className="text-gray-400">No back image provided</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {verification?.selfieImage && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Selfie with Document</h3>
                  <div className="border border-[#253256] rounded-md overflow-hidden max-w-md mx-auto">
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={verification.selfieImage || "/placeholder.svg"}
                        alt="Selfie with Document"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Notes */}
          <Card className="bg-[#0a1735] border-[#253256] text-white mb-6">
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
              <CardDescription className="text-gray-400">Add notes about this verification request</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add notes about this verification request..."
                className="bg-[#162040] border-[#253256] text-white min-h-[120px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button className="mt-4" onClick={handleSaveNotes}>
                Save Notes
              </Button>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              size="lg"
              onClick={handleApprove}
              disabled={verification?.status === "approved"}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Approve Verification
            </Button>
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500/10"
              size="lg"
              onClick={handleReject}
              disabled={verification?.status === "rejected"}
            >
              <XCircle className="h-5 w-5 mr-2" />
              Reject Verification
            </Button>
            <Button variant="outline" className="ml-auto" onClick={() => router.push("/admin/verification")}>
              Back to Verification Panel
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
