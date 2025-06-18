"use client"

import { useState, useEffect } from "react"
import { currencies } from "./currency-selector"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"

// Mock exchange rates (in a real app, these would come from an API)
const exchangeRates = {
  USD: 1,
  EUR: 0.93,
  BRL: 5.08,
  GBP: 0.79,
  JPY: 154.72,
  CAD: 1.36,
  AUD: 1.52,
  CHF: 0.91,
  CNY: 7.23,
  INR: 83.47,
  MXN: 16.73,
  SGD: 1.35,
  ZAR: 18.62,
  RUB: 92.5,
  TRY: 32.15,
}

interface CurrencyConverterProps {
  fromCurrency: string
  toCurrency: string
  amount: string
  readOnly?: boolean
}

export function CurrencyConverter({ fromCurrency, toCurrency, amount, readOnly = false }: CurrencyConverterProps) {
  const [convertedAmount, setConvertedAmount] = useState("0.00")

  useEffect(() => {
    if (!amount || isNaN(Number(amount))) {
      setConvertedAmount("0.00")
      return
    }

    // Get the exchange rates
    const fromRate = exchangeRates[fromCurrency as keyof typeof exchangeRates] || 1
    const toRate = exchangeRates[toCurrency as keyof typeof exchangeRates] || 1

    // Calculate the converted amount
    const amountInUSD = Number(amount) / fromRate
    const convertedValue = amountInUSD * toRate

    // Format the result
    setConvertedAmount(convertedValue.toFixed(2))
  }, [amount, fromCurrency, toCurrency])

  // Find currency symbols
  const fromSymbol = currencies.find((c) => c.code === fromCurrency)?.symbol || "$"
  const toSymbol = currencies.find((c) => c.code === toCurrency)?.symbol || "$"

  return (
    <div className="bg-[#162040] p-4 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <Label htmlFor="fromAmount" className="text-sm text-gray-400">
            {fromCurrency}
          </Label>
          <div className="text-lg font-medium">
            {fromSymbol} {amount || "0.00"}
          </div>
        </div>
        <ArrowRight className="mx-4 text-gray-400" />
        <div className="flex-1">
          <Label htmlFor="toAmount" className="text-sm text-gray-400">
            {toCurrency}
          </Label>
          <div className="text-lg font-medium">
            {toSymbol} {convertedAmount}
          </div>
        </div>
      </div>
      {!readOnly && (
        <p className="text-xs text-gray-400">
          Exchange rate: 1 {fromCurrency} ={" "}
          {(
            exchangeRates[toCurrency as keyof typeof exchangeRates] /
            exchangeRates[fromCurrency as keyof typeof exchangeRates]
          ).toFixed(4)}{" "}
          {toCurrency}
        </p>
      )}
    </div>
  )
}
