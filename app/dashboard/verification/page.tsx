"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  Wallet,
  History,
  LifeBuoy,
  LogOut,
  Upload,
  FileCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Shield,
} from "lucide-react"
import { submitVerification } from "@/lib/user-service"

export default function VerificationPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [documentType, setDocumentType] = useState("")
  const [documentNumber, setDocumentNumber] = useState("")
  const [country, setCountry] = useState("")
  const [frontImage, setFrontImage] = useState<string | null>(null)
  const [backImage, setBackImage] = useState<string | null>(null)
  const [selfieImage, setSelfieImage] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [verifications, setVerifications] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("submit")

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

      // Get user verifications
      const allVerifications = JSON.parse(localStorage.getItem("userVerifications") || "[]")
      const userVerifications = allVerifications.filter(
        (v: any) => v.userEmail.toLowerCase() === userData.email.toLowerCase(),
      )
      setVerifications(userVerifications)

      // If user has pending or approved verification, switch to status tab
      if (userVerifications.length > 0) {
        setActiveTab("status")
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setImageFunc: (value: string | null) => void) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImageFunc(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!documentType) {
      setError("Please select a document type")
      return
    }

    if (!frontImage) {
      setError("Please upload the front side of your document")
      return
    }

    if (!selfieImage) {
      setError("Please upload a selfie with your document")
      return
    }

    try {
      // Submit verification request
      await submitVerification(user.email, user.name || "User", {
        documentType,
        documentNumber,
        country,
        frontImage,
        backImage,
        selfieImage,
      })

      // Get updated verifications
      const allVerifications = JSON.parse(localStorage.getItem("userVerifications") || "[]")
      const userVerifications = allVerifications.filter(
        (v: any) => v.userEmail.toLowerCase() === user.email.toLowerCase(),
      )
      setVerifications(userVerifications)

      setSuccess("Verification request submitted successfully")
      setActiveTab("status")

      // Reset form
      setDocumentType("")
      setDocumentNumber("")
      setCountry("")
      setFrontImage(null)
      setBackImage(null)
      setSelfieImage(null)
    } catch (error) {
      console.error("Error submitting verification:", error)
      setError("Failed to submit verification request")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading verification page...</div>
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
            <span className="ml-2 font-medium">MXTM INVESTMENT</span>
          </Link>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-8">
            <div className="bg-[#162040] h-10 w-10 rounded-full flex items-center justify-center mr-3">
              <span className="text-[#0066ff] font-bold">{user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}</span>
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>

          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <Home className="mr-3 h-5 w-5" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/deposit"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  Deposit
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/withdraw"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  Withdraw
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/investments"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  Investments
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/history"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <History className="mr-3 h-5 w-5" />
                  History
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/verification"
                  className="flex items-center p-2 rounded-md bg-[#162040] text-white"
                >
                  <FileCheck className="mr-3 h-5 w-5" />
                  Verification
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/support"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <LifeBuoy className="mr-3 h-5 w-5" />
                  Support
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white w-full text-left"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#0a1735] z-10 border-b border-[#253256]">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
            <span className="ml-2 font-medium text-white text-sm">MXTM</span>
          </Link>
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-4">
              <Home className="h-5 w-5 text-white" />
            </Link>
            <button onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/dashboard" className="mr-4 text-gray-400 hover:text-white">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Account Verification</h1>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-500/10 border-green-500 text-green-500">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Card className="bg-[#0a1735] border-[#253256] text-white">
            <CardHeader>
              <CardTitle>Identity Verification</CardTitle>
              <CardDescription className="text-gray-400">
                Verify your identity to unlock higher withdrawal limits and additional features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-[#162040] border-[#253256]">
                  <TabsTrigger value="submit" className="data-[state=active]:bg-[#0a1735]">
                    Submit Verification
                  </TabsTrigger>
                  <TabsTrigger value="status" className="data-[state=active]:bg-[#0a1735]">
                    Verification Status
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="submit" className="mt-6">
                  {user?.isVerified ? (
                    <div className="bg-green-500/10 border border-green-500 rounded-md p-4 mb-6">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <p className="text-green-500 font-medium">Your account is already verified</p>
                      </div>
                    </div>
                  ) : verifications.some((v) => v.status === "pending") ? (
                    <div className="bg-yellow-500/10 border border-yellow-500 rounded-md p-4 mb-6">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                        <p className="text-yellow-500 font-medium">
                          You have a pending verification request. Please check the Verification Status tab.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="document-type">Document Type</Label>
                            <Select value={documentType} onValueChange={setDocumentType}>
                              <SelectTrigger id="document-type" className="bg-[#162040] border-[#253256] text-white">
                                <SelectValue placeholder="Select document type" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#0a1735] border-[#253256] text-white">
                                <SelectItem value="passport">Passport</SelectItem>
                                <SelectItem value="national_id">National ID Card</SelectItem>
                                <SelectItem value="drivers_license">Driver's License</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="document-number">Document Number (Optional)</Label>
                            <Input
                              id="document-number"
                              placeholder="Enter document number"
                              className="bg-[#162040] border-[#253256] text-white"
                              value={documentNumber}
                              onChange={(e) => setDocumentNumber(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country">Country of Issue (Optional)</Label>
                          <Input
                            id="country"
                            placeholder="Enter country of issue"
                            className="bg-[#162040] border-[#253256] text-white"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="front-image">Front Side of Document</Label>
                            <div className="border-2 border-dashed border-[#253256] rounded-md p-4 text-center">
                              {frontImage ? (
                                <div className="relative h-40 w-full">
                                  <Image
                                    src={frontImage || "/placeholder.svg"}
                                    alt="Front of document"
                                    fill
                                    className="object-contain"
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="absolute top-2 right-2 h-8 w-8 p-0"
                                    onClick={() => setFrontImage(null)}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div>
                                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-400 mb-2">Click to upload or drag and drop</p>
                                  <p className="text-xs text-gray-500">PNG, JPG or JPEG (max. 5MB)</p>
                                  <Input
                                    id="front-image"
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e, setFrontImage)}
                                  />
                                  <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => document.getElementById("front-image")?.click()}
                                  >
                                    Select File
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="back-image">Back Side of Document (Optional)</Label>
                            <div className="border-2 border-dashed border-[#253256] rounded-md p-4 text-center">
                              {backImage ? (
                                <div className="relative h-40 w-full">
                                  <Image
                                    src={backImage || "/placeholder.svg"}
                                    alt="Back of document"
                                    fill
                                    className="object-contain"
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="absolute top-2 right-2 h-8 w-8 p-0"
                                    onClick={() => setBackImage(null)}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div>
                                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-400 mb-2">Click to upload or drag and drop</p>
                                  <p className="text-xs text-gray-500">PNG, JPG or JPEG (max. 5MB)</p>
                                  <Input
                                    id="back-image"
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e, setBackImage)}
                                  />
                                  <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => document.getElementById("back-image")?.click()}
                                  >
                                    Select File
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="selfie-image">Selfie with Document</Label>
                          <div className="border-2 border-dashed border-[#253256] rounded-md p-4 text-center">
                            {selfieImage ? (
                              <div className="relative h-40 w-full">
                                <Image
                                  src={selfieImage || "/placeholder.svg"}
                                  alt="Selfie with document"
                                  fill
                                  className="object-contain"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="absolute top-2 right-2 h-8 w-8 p-0"
                                  onClick={() => setSelfieImage(null)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div>
                                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-400 mb-2">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500">PNG, JPG or JPEG (max. 5MB)</p>
                                <Input
                                  id="selfie-image"
                                  type="file"
                                  accept="image/png, image/jpeg, image/jpg"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(e, setSelfieImage)}
                                />
                                <Button
                                  variant="outline"
                                  className="mt-4"
                                  onClick={() => document.getElementById("selfie-image")?.click()}
                                >
                                  Select File
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button type="submit" className="w-full bg-[#0066ff] hover:bg-[#0066ff]/90">
                            Submit Verification
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}
                </TabsContent>

                <TabsContent value="status" className="mt-6">
                  {verifications.length > 0 ? (
                    <div className="space-y-6">
                      {verifications.map((verification, index) => (
                        <Card key={index} className="bg-[#162040] border-[#253256]">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base">
                                {verification.documentType
                                  .replace("_", " ")
                                  .replace(/\b\w/g, (l: string) => l.toUpperCase())}{" "}
                                Verification
                              </CardTitle>
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
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-400">Submitted Date</p>
                                <p>{verification.submittedDate}</p>
                              </div>
                              {verification.status === "approved" && (
                                <div>
                                  <p className="text-gray-400">Approved Date</p>
                                  <p>{verification.approvedDate}</p>
                                </div>
                              )}
                              {verification.status === "rejected" && (
                                <div>
                                  <p className="text-gray-400">Rejected Date</p>
                                  <p>{verification.rejectedDate}</p>
                                </div>
                              )}
                            </div>

                            {verification.status === "approved" && (
                              <div className="mt-4 bg-green-500/10 border border-green-500 rounded-md p-3">
                                <p className="text-green-500 text-sm">
                                  Your identity has been verified. You now have access to all platform features.
                                </p>
                              </div>
                            )}

                            {verification.status === "pending" && (
                              <div className="mt-4 bg-yellow-500/10 border border-yellow-500 rounded-md p-3">
                                <p className="text-yellow-500 text-sm">
                                  Your verification is being reviewed by our team. This process typically takes 1-2
                                  business days.
                                </p>
                              </div>
                            )}

                            {verification.status === "rejected" && (
                              <div className="mt-4 bg-red-500/10 border border-red-500 rounded-md p-3">
                                <p className="text-red-500 text-sm">
                                  Your verification was rejected. Please submit a new verification request with clearer
                                  documents.
                                </p>
                                {verification.adminNotes && (
                                  <p className="text-red-500 text-sm mt-2">
                                    <span className="font-medium">Reason:</span> {verification.adminNotes}
                                  </p>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No Verification Requests</h3>
                      <p className="text-gray-400 mb-6">You haven't submitted any verification requests yet</p>
                      <Button onClick={() => setActiveTab("submit")}>Submit Verification</Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="mt-8">
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader>
                <CardTitle>Verification Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center p-4 bg-[#162040] rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-[#0066ff]/10 flex items-center justify-center mb-4">
                      <Wallet className="h-6 w-6 text-[#0066ff]" />
                    </div>
                    <h3 className="font-medium mb-2">Higher Withdrawal Limits</h3>
                    <p className="text-sm text-gray-400">Increase your daily and monthly withdrawal limits</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-[#162040] rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-[#0066ff]/10 flex items-center justify-center mb-4">
                      <CheckCircle className="h-6 w-6 text-[#0066ff]" />
                    </div>
                    <h3 className="font-medium mb-2">Faster Approvals</h3>
                    <p className="text-sm text-gray-400">Get faster approval on withdrawals and deposits</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-[#162040] rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-[#0066ff]/10 flex items-center justify-center mb-4">
                      <Shield className="h-6 w-6 text-[#0066ff]" />
                    </div>
                    <h3 className="font-medium mb-2">Enhanced Security</h3>
                    <p className="text-sm text-gray-400">Additional account security and protection</p>
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
