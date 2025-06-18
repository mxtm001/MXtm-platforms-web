"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, Wallet, History, LifeBuoy, LogOut, Menu, FileCheck } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      // Only redirect if not already on login page
      if (pathname !== "/login") {
        router.push("/login")
      }
      setLoading(false)
      return
    }

    try {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setLoading(false)
    } catch (error) {
      console.error("Error checking user:", error)
      localStorage.removeItem("user")
      if (pathname !== "/login") {
        router.push("/login")
      }
      setLoading(false)
    }
  }, [router, pathname])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-[#050e24] flex">
      {/* Sidebar for desktop */}
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
                  className={`flex items-center p-2 rounded-md ${
                    pathname === "/dashboard"
                      ? "bg-[#162040] text-white"
                      : "hover:bg-[#162040] text-gray-300 hover:text-white"
                  }`}
                >
                  <Home className="mr-3 h-5 w-5" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/deposit"
                  className={`flex items-center p-2 rounded-md ${
                    pathname === "/dashboard/deposit"
                      ? "bg-[#162040] text-white"
                      : "hover:bg-[#162040] text-gray-300 hover:text-white"
                  }`}
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  Deposit
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/withdraw"
                  className={`flex items-center p-2 rounded-md ${
                    pathname === "/dashboard/withdraw"
                      ? "bg-[#162040] text-white"
                      : "hover:bg-[#162040] text-gray-300 hover:text-white"
                  }`}
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  Withdraw
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/investments"
                  className={`flex items-center p-2 rounded-md ${
                    pathname === "/dashboard/investments"
                      ? "bg-[#162040] text-white"
                      : "hover:bg-[#162040] text-gray-300 hover:text-white"
                  }`}
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  Investments
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/history"
                  className={`flex items-center p-2 rounded-md ${
                    pathname === "/dashboard/history"
                      ? "bg-[#162040] text-white"
                      : "hover:bg-[#162040] text-gray-300 hover:text-white"
                  }`}
                >
                  <History className="mr-3 h-5 w-5" />
                  History
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/verification"
                  className={`flex items-center p-2 rounded-md ${
                    pathname === "/dashboard/verification"
                      ? "bg-[#162040] text-white"
                      : "hover:bg-[#162040] text-gray-300 hover:text-white"
                  }`}
                >
                  <FileCheck className="mr-3 h-5 w-5" />
                  Verification
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/support"
                  className={`flex items-center p-2 rounded-md ${
                    pathname === "/dashboard/support"
                      ? "bg-[#162040] text-white"
                      : "hover:bg-[#162040] text-gray-300 hover:text-white"
                  }`}
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
      <header className="fixed top-0 left-0 right-0 bg-[#0a1735] p-4 flex justify-between items-center md:hidden z-20">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-[#0a1735] text-white border-[#253256] p-0 w-64">
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
                  <span className="text-[#0066ff] font-bold">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </span>
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
                      className={`flex items-center p-2 rounded-md ${
                        pathname === "/dashboard"
                          ? "bg-[#162040] text-white"
                          : "hover:bg-[#162040] text-gray-300 hover:text-white"
                      }`}
                    >
                      <Home className="mr-3 h-5 w-5" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/deposit"
                      className={`flex items-center p-2 rounded-md ${
                        pathname === "/dashboard/deposit"
                          ? "bg-[#162040] text-white"
                          : "hover:bg-[#162040] text-gray-300 hover:text-white"
                      }`}
                    >
                      <Wallet className="mr-3 h-5 w-5" />
                      Deposit
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/withdraw"
                      className={`flex items-center p-2 rounded-md ${
                        pathname === "/dashboard/withdraw"
                          ? "bg-[#162040] text-white"
                          : "hover:bg-[#162040] text-gray-300 hover:text-white"
                      }`}
                    >
                      <Wallet className="mr-3 h-5 w-5" />
                      Withdraw
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/investments"
                      className={`flex items-center p-2 rounded-md ${
                        pathname === "/dashboard/investments"
                          ? "bg-[#162040] text-white"
                          : "hover:bg-[#162040] text-gray-300 hover:text-white"
                      }`}
                    >
                      <Wallet className="mr-3 h-5 w-5" />
                      Investments
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/history"
                      className={`flex items-center p-2 rounded-md ${
                        pathname === "/dashboard/history"
                          ? "bg-[#162040] text-white"
                          : "hover:bg-[#162040] text-gray-300 hover:text-white"
                      }`}
                    >
                      <History className="mr-3 h-5 w-5" />
                      History
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/verification"
                      className={`flex items-center p-2 rounded-md ${
                        pathname === "/dashboard/verification"
                          ? "bg-[#162040] text-white"
                          : "hover:bg-[#162040] text-gray-300 hover:text-white"
                      }`}
                    >
                      <FileCheck className="mr-3 h-5 w-5" />
                      Verification
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/support"
                      className={`flex items-center p-2 rounded-md ${
                        pathname === "/dashboard/support"
                          ? "bg-[#162040] text-white"
                          : "hover:bg-[#162040] text-gray-300 hover:text-white"
                      }`}
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
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
          </div>
          <span className="ml-2 font-medium text-white">MXTM</span>
        </Link>

        <Button variant="outline" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">{children}</main>
    </div>
  )
}
