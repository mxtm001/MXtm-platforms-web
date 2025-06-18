"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"

const currency = "USD"
const currencySymbol = "$"

export default function DepositPage() {
  const { user } = useUser()
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [proofUploaded, setProofUploaded] = useState(false)

  const [processing, setProcessing] = useState(false)
  const [depositSuccess, setDepositSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate deposit amount
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid amount")
      return
    }

    // Check minimum deposit
    if (Number(amount) < 50) {
      alert("Minimum deposit amount is $50")
      return
    }

    // Validate payment method
    if (!paymentMethod) {
      alert("Please select a payment method")
      return
    }

    setProcessing(true)

    // Create transaction record
    const newTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userEmail: user?.email || "",
      userName: user?.name || user?.email || "",
      type: "deposit" as const,
      amount: Number(amount),
      currency: currency,
      status: "pending" as const,
      date: new Date().toISOString().split("T")[0],
      method: paymentMethod,
    }

    // Save to global transactions
    const allTransactions = JSON.parse(localStorage.getItem("allTransactions") || "[]")
    allTransactions.push(newTransaction)
    localStorage.setItem("allTransactions", JSON.stringify(allTransactions))

    // Simulate processing time
    setTimeout(() => {
      setProcessing(false)
      setDepositSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setDepositSuccess(false)
        setAmount("")
        setPaymentMethod("")
        setProofUploaded(false)
      }, 3000)
    }, 1500)
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Deposit Funds</CardTitle>
          <CardDescription>Securely deposit funds into your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount ({currency})</Label>
              <Input
                type="number"
                id="amount"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select onValueChange={setPaymentMethod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {paymentMethod === "bank_transfer" && (
              <div className="grid gap-2">
                <Label htmlFor="proofOfPayment">Proof of Payment</Label>
                <Input type="file" id="proofOfPayment" onChange={() => setProofUploaded(true)} />
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-[#0066ff] hover:bg-[#0066ff]/90"
              disabled={!amount || !paymentMethod || processing}
            >
              {processing ? (
                <div className="flex items-center">
                  <span className="animate-spin mr-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </span>
                  Processing...
                </div>
              ) : (
                "Confirm Deposit"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      {depositSuccess && (
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
              <h2 className="text-2xl font-bold text-white mb-4">Deposit Request Received!</h2>
              <p className="text-gray-300 mb-6">
                Your deposit request for {currencySymbol}
                {amount} {currency} has been successfully submitted. We will process your request within 24 hours.
              </p>
              <Button className="bg-[#0066ff] hover:bg-[#0066ff]/90" onClick={() => setDepositSuccess(false)}>
                Return to Deposits
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
