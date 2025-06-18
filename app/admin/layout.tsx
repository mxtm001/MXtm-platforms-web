"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
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
  Menu,
  FileCheck,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if admin is logged in
    const storedAdmin = localStorage.getItem("admin_user")
    if (!storedAdmin) {
      // Only redirect if not already on login page
      if (pathname !== "/admin/login") {
        router.push("/admin/login")
      }
      setLoading(false)
      return
    }

    try {
      const admin = JSON.parse(storedAdmin)
      if (admin.role !== "admin") {
        if (pathname !== "/admin/login") {
          router.push("/admin/login")
        }
        setLoading(false)
        return
      }
      setAdminUser(admin)
      setLoading(false)
    } catch (error) {
      console.error("Error checking admin:", error)
      localStorage.removeItem("admin_user")
      if (pathname !== "/admin/login") {
        router.push("/admin/login")
      }
      setLoading(false)
    }
  }, [router, pathname])

  const handleLogout = () => {
    localStorage.removeItem("admin_user")
    router.push("/admin/login")
  }

  // If on login page, just render children
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading admin panel...</div>
      </div>
    )
  }

  if (!adminUser) {
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
                className={`flex items-center p-2 rounded-md ${
                  pathname === "/admin/dashboard"
                    ? "bg-[#162040] text-white"
                    : "hover:bg-[#162040] text-gray-300 hover:text-white"
                }`}
              >
                <BarChart2 className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className={`flex items-center p-2 rounded-md ${
                  pathname.startsWith("/admin/users")
                    ? "bg-[#162040] text-white"
                    : "hover:bg-[#162040] text-gray-300 hover:text-white"
                }`}
              >
                <Users className="mr-2 h-5 w-5" />
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/admin/verification"
                className={`flex items-center p-2 rounded-md ${
                  pathname.startsWith("/admin/verification")
                    ? "bg-[#162040] text-white"
                    : "hover:bg-[#162040] text-gray-300 hover:text-white"
                }`}
              >
                <FileCheck className="mr-2 h-5 w-5" />
                Verification
              </Link>
            </li>
            <li>
              <Link
                href="/admin/deposits"
                className={`flex items-center p-2 rounded-md ${
                  pathname === "/admin/deposits"
                    ? "bg-[#162040] text-white"
                    : "hover:bg-[#162040] text-gray-300 hover:text-white"
                }`}
              >
                <ArrowUpRight className="mr-2 h-5 w-5" />
                Deposits
              </Link>
            </li>
            <li>
              <Link
                href="/admin/withdrawals"
                className={`flex items-center p-2 rounded-md ${
                  pathname === "/admin/withdrawals"
                    ? "bg-[#162040] text-white"
                    : "hover:bg-[#162040] text-gray-300 hover:text-white"
                }`}
              >
                <ArrowDownRight className="mr-2 h-5 w-5" />
                Withdrawals
              </Link>
            </li>
            <li>
              <Link
                href="/admin/investments"
                className={`flex items-center p-2 rounded-md ${
                  pathname === "/admin/investments"
                    ? "bg-[#162040] text-white"
                    : "hover:bg-[#162040] text-gray-300 hover:text-white"
                }`}
              >
                <DollarSign className="mr-2 h-5 w-5" />
                Investments
              </Link>
            </li>
            <li>
              <Link
                href="/admin/chat"
                className={`flex items-center p-2 rounded-md ${
                  pathname === "/admin/chat"
                    ? "bg-[#162040] text-white"
                    : "hover:bg-[#162040] text-gray-300 hover:text-white"
                }`}
              >
                <Clock className="mr-2 h-5 w-5" />
                Support Chat
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className={`flex items-center p-2 rounded-md ${
                  pathname === "/admin/settings"
                    ? "bg-[#162040] text-white"
                    : "hover:bg-[#162040] text-gray-300 hover:text-white"
                }`}
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
                    className={`flex items-center p-2 rounded-md ${
                      pathname === "/admin/dashboard"
                        ? "bg-[#162040] text-white"
                        : "hover:bg-[#162040] text-gray-300 hover:text-white"
                    }`}
                  >
                    <BarChart2 className="mr-2 h-5 w-5" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/users"
                    className={`flex items-center p-2 rounded-md ${
                      pathname.startsWith("/admin/users")
                        ? "bg-[#162040] text-white"
                        : "hover:bg-[#162040] text-gray-300 hover:text-white"
                    }`}
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Users
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/verification"
                    className={`flex items-center p-2 rounded-md ${
                      pathname.startsWith("/admin/verification")
                        ? "bg-[#162040] text-white"
                        : "hover:bg-[#162040] text-gray-300 hover:text-white"
                    }`}
                  >
                    <FileCheck className="mr-2 h-5 w-5" />
                    Verification
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/deposits"
                    className={`flex items-center p-2 rounded-md ${
                      pathname === "/admin/deposits"
                        ? "bg-[#162040] text-white"
                        : "hover:bg-[#162040] text-gray-300 hover:text-white"
                    }`}
                  >
                    <ArrowUpRight className="mr-2 h-5 w-5" />
                    Deposits
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/withdrawals"
                    className={`flex items-center p-2 rounded-md ${
                      pathname === "/admin/withdrawals"
                        ? "bg-[#162040] text-white"
                        : "hover:bg-[#162040] text-gray-300 hover:text-white"
                    }`}
                  >
                    <ArrowDownRight className="mr-2 h-5 w-5" />
                    Withdrawals
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/investments"
                    className={`flex items-center p-2 rounded-md ${
                      pathname === "/admin/investments"
                        ? "bg-[#162040] text-white"
                        : "hover:bg-[#162040] text-gray-300 hover:text-white"
                    }`}
                  >
                    <DollarSign className="mr-2 h-5 w-5" />
                    Investments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/chat"
                    className={`flex items-center p-2 rounded-md ${
                      pathname === "/admin/chat"
                        ? "bg-[#162040] text-white"
                        : "hover:bg-[#162040] text-gray-300 hover:text-white"
                    }`}
                  >
                    <Clock className="mr-2 h-5 w-5" />
                    Support Chat
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/settings"
                    className={`flex items-center p-2 rounded-md ${
                      pathname === "/admin/settings"
                        ? "bg-[#162040] text-white"
                        : "hover:bg-[#162040] text-gray-300 hover:text-white"
                    }`}
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
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
          </div>
          <span className="ml-2 font-medium text-white">ADMIN</span>
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
