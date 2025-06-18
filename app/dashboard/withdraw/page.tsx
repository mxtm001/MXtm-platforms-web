"use client"

import type React from "react"

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
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
  LogOut,
  Wallet,
  HelpCircle,
  Info,
} from "lucide-react"
import { CurrencySelector, currencies } from "@/components/currency-selector"
import { CurrencyConverter } from "@/components/currency-converter"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Withdraw() {
  const [user, setUser] = useState<{ email: string; balance?: number; name?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [walletAddress, setWalletAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const [accountName, setAccountName] = useState("")
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [swiftCode, setSwiftCode] = useState("")
  const [routingNumber, setRoutingNumber] = useState("")
  const [bankCountry, setBankCountry] = useState("")

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

  // Update the handleSubmit function to process withdrawals
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate withdrawal amount
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid amount")
      return
    }

    // Check minimum withdrawal
    if (Number(amount) < 50) {
      alert("Minimum withdrawal amount is $50")
      return
    }

    // Check if user has sufficient balance
    const withdrawalAmount = Number.parseFloat(amount)
    if ((user?.balance || 0) < withdrawalAmount) {
      alert("Insufficient balance for this withdrawal")
      return
    }

    // Validate bank transfer fields if selected
    if (paymentMethod === "bank_transfer") {
      if (!accountName || !bankName || !accountNumber || !bankCountry) {
        alert("Please fill in all required bank details")
        return
      }
    } else if (!walletAddress) {
      alert("Please enter your wallet address")
      return
    }

    setLoading(true)

    // Create transaction record with additional details for bank transfers
    const newTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userEmail: user?.email || "",
      userName: user?.name || user?.email || "",
      type: "withdrawal" as const,
      amount: withdrawalAmount,
      currency: currency,
      status: "pending" as const,
      date: new Date().toISOString().split("T")[0],
      method: paymentMethod,
      // Add bank details if bank transfer
      ...(paymentMethod === "bank_transfer" && {
        bankDetails: {
          accountName,
          bankName,
          accountNumber,
          swiftCode,
          routingNumber,
          bankCountry,
        },
      }),
      // Add wallet address if crypto
      ...(paymentMethod !== "bank_transfer" && {
        walletAddress,
      }),
    }

    // Save to global transactions
    const allTransactions = JSON.parse(localStorage.getItem("allTransactions") || "[]")
    allTransactions.push(newTransaction)
    localStorage.setItem("allTransactions", JSON.stringify(allTransactions))

    // Update user balance (deduct immediately for withdrawal request)
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const userIndex = registeredUsers.findIndex((u: any) => u.email === user?.email)

    if (userIndex >= 0) {
      registeredUsers[userIndex].balance = (registeredUsers[userIndex].balance || 0) - withdrawalAmount
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))

      // Update current user session
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
      currentUser.balance = registeredUsers[userIndex].balance
      localStorage.setItem("user", JSON.stringify(currentUser))

      // Update local state
      setUser((prev) => ({
        ...prev,
        balance: registeredUsers[userIndex].balance,
      }))
    }

    // Simulate processing time
    setTimeout(() => {
      setLoading(false)
      setShowSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setShowSuccess(false)
        setAmount("")
        setWalletAddress("")
        setPaymentMethod("")
        setAccountName("")
        setBankName("")
        setAccountNumber("")
        setSwiftCode("")
        setRoutingNumber("")
        setBankCountry("")
      }, 3000)
    }, 1500)
  }

  // Get currency symbol for the input field
  const currencySymbol = currencies.find((c) => c.code === currency)?.symbol || "$"

  // Group currencies by region for display
  const groupedCurrencies = {
    northAmerica: currencies.filter((c) => c.region === "North America"),
    southAmerica: currencies.filter((c) => c.region === "South America"),
    europe: currencies.filter((c) => c.region === "Europe"),
    asia: currencies.filter((c) => c.region === "Asia"),
    oceania: currencies.filter((c) => c.region === "Oceania"),
    africa: currencies.filter((c) => c.region === "Africa"),
  }

  if (loading && !showSuccess) {
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
            <div className="relative w-10 h-10">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-contain" />
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
              <Link href="/dashboard/withdraw" className="flex items-center p-2 rounded-md bg-[#162040] text-white">
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
              <Link
                href="/dashboard/support"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
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
            <div className="relative w-10 h-10">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-contain" />
            </div>
          </Link>
          <Button variant="outline" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </header>

        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Withdraw Funds</h1>
            <p className="text-gray-400">Withdraw your funds to your wallet</p>
          </div>

          {showSuccess ? (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#0a1735] border border-[#253256] rounded-lg p-8 max-w-md w-full mx-4 animate-fade-in">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 animate-pulse">
                      <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                        <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Withdrawal Request Accepted!</h2>
                  <p className="text-gray-300 mb-6">
                    Your withdrawal request for {currencySymbol}
                    {amount} {currency} via {paymentMethod === "bank_transfer" ? "Bank Transfer" : paymentMethod} has
                    been successfully submitted. We will process your request within 24 hours.
                  </p>
                  <Button className="bg-[#0066ff] hover:bg-[#0066ff]/90" onClick={() => setShowSuccess(false)}>
                    Return to Withdrawals
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Available Balance</CardTitle>
                <Wallet className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${user?.balance?.toFixed(2) || "0.00"}</div>
                <p className="text-sm text-gray-400 mt-1">
                  {user?.balance > 0 ? "Available for withdrawal" : "Make a deposit to start investing"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0a1735] border-[#253256] text-white md:row-span-2">
              <CardHeader>
                <CardTitle>Withdrawal Form</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <CurrencySelector value={currency} onChange={setCurrency} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-[#162040] border-[#253256] text-white pl-10"
                        required
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        {currencySymbol}
                      </div>
                    </div>
                  </div>

                  {amount && currency !== "USD" && (
                    <div className="space-y-2">
                      <Label className="flex items-center">
                        <span>Conversion to USD</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-[#0a1735] border-[#253256] text-white">
                              <p>All withdrawals are processed in USD</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <CurrencyConverter fromCurrency={currency} toCurrency="USD" amount={amount} />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="method">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="bg-[#162040] border-[#253256] text-white">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a1735] border-[#253256] text-white">
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="bitcoin">Bitcoin</SelectItem>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="usdt">USDT (TRC20)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentMethod === "bank_transfer" && (
                    <div className="space-y-4 border border-[#253256] rounded-md p-4 bg-[#0c1c3d]">
                      <h3 className="font-medium text-white">Bank Transfer Details</h3>

                      <div className="space-y-2">
                        <Label htmlFor="accountName">Account Holder Name</Label>
                        <Input
                          id="accountName"
                          type="text"
                          placeholder="Enter account holder name"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                          className="bg-[#162040] border-[#253256] text-white"
                          required={paymentMethod === "bank_transfer"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bankCountry">Bank Country</Label>
                        <Select value={bankCountry} onValueChange={setBankCountry}>
                          <SelectTrigger className="bg-[#162040] border-[#253256] text-white">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0a1735] border-[#253256] text-white max-h-[200px]">
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="gb">United Kingdom</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                            <SelectItem value="de">Germany</SelectItem>
                            <SelectItem value="fr">France</SelectItem>
                            <SelectItem value="es">Spain</SelectItem>
                            <SelectItem value="it">Italy</SelectItem>
                            <SelectItem value="jp">Japan</SelectItem>
                            <SelectItem value="cn">China</SelectItem>
                            <SelectItem value="in">India</SelectItem>
                            <SelectItem value="br">Brazil</SelectItem>
                            <SelectItem value="za">South Africa</SelectItem>
                            <SelectItem value="ng">Nigeria</SelectItem>
                            <SelectItem value="ke">Kenya</SelectItem>
                            <SelectItem value="gh">Ghana</SelectItem>
                            <SelectItem value="ae">UAE</SelectItem>
                            <SelectItem value="sg">Singapore</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          type="text"
                          placeholder="Enter bank name"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="bg-[#162040] border-[#253256] text-white"
                          required={paymentMethod === "bank_transfer"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">
                          {bankCountry === "gb"
                            ? "Account Number/Sort Code"
                            : bankCountry === "eu"
                              ? "IBAN"
                              : "Account Number"}
                        </Label>
                        <Input
                          id="accountNumber"
                          type="text"
                          placeholder={bankCountry === "eu" ? "Enter IBAN" : "Enter account number"}
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="bg-[#162040] border-[#253256] text-white"
                          required={paymentMethod === "bank_transfer"}
                        />
                      </div>

                      {(bankCountry === "us" || bankCountry === "ca" || bankCountry === "au") && (
                        <div className="space-y-2">
                          <Label htmlFor="routingNumber">
                            {bankCountry === "us"
                              ? "Routing Number"
                              : bankCountry === "ca"
                                ? "Transit Number"
                                : "BSB Number"}
                          </Label>
                          <Input
                            id="routingNumber"
                            type="text"
                            placeholder={`Enter ${bankCountry === "us" ? "routing" : bankCountry === "ca" ? "transit" : "BSB"} number`}
                            value={routingNumber}
                            onChange={(e) => setRoutingNumber(e.target.value)}
                            className="bg-[#162040] border-[#253256] text-white"
                            required={paymentMethod === "bank_transfer"}
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="swiftCode">SWIFT/BIC Code (International Transfers)</Label>
                        <Input
                          id="swiftCode"
                          type="text"
                          placeholder="Enter SWIFT/BIC code"
                          value={swiftCode}
                          onChange={(e) => setSwiftCode(e.target.value)}
                          className="bg-[#162040] border-[#253256] text-white"
                        />
                        <p className="text-xs text-gray-400">Optional for domestic transfers</p>
                      </div>
                    </div>
                  )}

                  {paymentMethod !== "bank_transfer" && (
                    <div className="space-y-2">
                      <Label htmlFor="wallet">Wallet Address</Label>
                      <Input
                        id="wallet"
                        type="text"
                        placeholder="Enter your wallet address"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="bg-[#162040] border-[#253256] text-white"
                        required={paymentMethod !== "bank_transfer"}
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-[#0066ff] hover:bg-[#0066ff]/90"
                    disabled={
                      !amount ||
                      (!walletAddress && paymentMethod !== "bank_transfer") ||
                      (!accountName && paymentMethod === "bank_transfer") ||
                      !paymentMethod ||
                      loading
                    }
                  >
                    {loading ? "Processing..." : "Request Withdrawal"}
                  </Button>

                  <div className="text-xs text-gray-400 mt-4">
                    <p>Note: Withdrawals are processed within 24 hours.</p>
                    <p>Minimum withdrawal amount: $50</p>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader>
                <CardTitle>Withdrawal History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-400">No withdrawals found</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#0a1735] border-[#253256] text-white mt-8">
            <CardHeader>
              <CardTitle>Supported Withdrawal Currencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Popular Currencies</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[
                      { symbol: "$", code: "USD" },
                      { symbol: "€", code: "EUR" },
                      { symbol: "R$", code: "BRL" },
                      { symbol: "£", code: "GBP" },
                      { symbol: "¥", code: "JPY" },
                      { symbol: "C$", code: "CAD" },
                      { symbol: "A$", code: "AUD" },
                      { symbol: "₹", code: "INR" },
                      { symbol: "CHF", code: "CHF" },
                      { symbol: "¥", code: "CNY" },
                    ].map((curr, idx) => (
                      <div key={idx} className="p-3 bg-[#162040] rounded-md text-center">
                        <div className="text-lg font-bold">{curr.symbol}</div>
                        <div className="text-sm">{curr.code}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">North & South America</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {[...groupedCurrencies.northAmerica, ...groupedCurrencies.southAmerica].map((curr, idx) => (
                        <div key={idx} className="flex justify-between p-2 bg-[#162040] rounded-md">
                          <span>{curr.code}</span>
                          <span className="text-gray-400">{curr.symbol}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Europe</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {groupedCurrencies.europe.map((curr, idx) => (
                        <div key={idx} className="flex justify-between p-2 bg-[#162040] rounded-md">
                          <span>{curr.code}</span>
                          <span className="text-gray-400">{curr.symbol}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Asia & Oceania</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {[...groupedCurrencies.asia, ...groupedCurrencies.oceania].map((curr, idx) => (
                        <div key={idx} className="flex justify-between p-2 bg-[#162040] rounded-md">
                          <span>{curr.code}</span>
                          <span className="text-gray-400">{curr.symbol}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Africa</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {groupedCurrencies.africa.map((curr, idx) => (
                        <div key={idx} className="flex justify-between p-2 bg-[#162040] rounded-md">
                          <span>{curr.code}</span>
                          <span className="text-gray-400">{curr.symbol}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-400 mt-6">
                We support withdrawals in multiple currencies for your convenience. All withdrawals are processed in USD
                and then converted to your preferred currency. Exchange rates are updated in real-time.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0a1735] border-[#253256] text-white mt-8">
            <CardHeader>
              <CardTitle>Bank Transfer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  We support bank transfers to accounts worldwide. Processing times may vary depending on your location:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#162040] p-4 rounded-md">
                    <h4 className="font-medium mb-2">Domestic Transfers</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                      <li>USA: 1-3 business days</li>
                      <li>UK: 1-2 business days</li>
                      <li>EU: 1-2 business days</li>
                      <li>Canada: 1-3 business days</li>
                      <li>Australia: 1-2 business days</li>
                    </ul>
                  </div>

                  <div className="bg-[#162040] p-4 rounded-md">
                    <h4 className="font-medium mb-2">International Transfers</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                      <li>North America: 2-4 business days</li>
                      <li>Europe: 2-4 business days</li>
                      <li>Asia: 3-5 business days</li>
                      <li>Africa: 3-7 business days</li>
                      <li>South America: 3-7 business days</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-[#0c1c3d] p-4 rounded-md border border-[#253256] mt-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-blue-400" />
                    Important Information
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                    <li>Ensure all bank details are entered correctly to avoid delays</li>
                    <li>International transfers may incur additional fees from intermediary banks</li>
                    <li>Some countries may require additional documentation for large transfers</li>
                    <li>Minimum withdrawal amount for bank transfers: $100</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
