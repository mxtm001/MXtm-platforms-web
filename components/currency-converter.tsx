"use client"

import { useState, useEffect } from "react"
import { currencies } from "./currency-selector"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"

// Extended exchange rates for all currencies (in a real app, these would come from an API)
const exchangeRates = {
  // North America
  USD: 1,
  CAD: 1.36,
  MXN: 16.73,

  // South America
  BRL: 5.08,
  ARS: 880.5,
  CLP: 932.45,
  COP: 3950.25,
  PEN: 3.7,
  UYU: 39.15,
  VES: 36.55,

  // Europe
  EUR: 0.93,
  GBP: 0.79,
  CHF: 0.91,
  NOK: 10.75,
  SEK: 10.55,
  DKK: 6.92,
  PLN: 3.95,
  CZK: 23.15,
  HUF: 356.8,
  RON: 4.62,
  BGN: 1.82,
  HRK: 7.02,
  RSD: 109.25,
  ISK: 138.5,
  UAH: 39.85,
  RUB: 92.5,
  TRY: 32.15,

  // Asia
  JPY: 154.72,
  CNY: 7.23,
  HKD: 7.82,
  KRW: 1350.45,
  INR: 83.47,
  IDR: 15750.25,
  MYR: 4.65,
  PHP: 56.85,
  SGD: 1.35,
  THB: 35.75,
  VND: 25150.5,
  PKR: 278.35,
  BDT: 110.25,
  NPR: 133.5,
  LKR: 315.75,
  ILS: 3.68,
  AED: 3.67,
  SAR: 3.75,
  QAR: 3.64,
  KWD: 0.31,
  BHD: 0.38,
  OMR: 0.38,

  // Oceania
  AUD: 1.52,
  NZD: 1.65,
  FJD: 2.25,
  PGK: 3.75,
  SBD: 8.45,
  TOP: 2.35,
  VUV: 119.5,
  WST: 2.75,

  // Africa
  ZAR: 18.62,
  EGP: 47.85,
  NGN: 1450.25,
  GHS: 14.75,
  KES: 129.5,
  MAD: 9.95,
  TND: 3.12,
  DZD: 134.75,
  UGX: 3750.25,
  TZS: 2650.5,
  ETB: 56.75,
  ZMW: 25.85,
  XOF: 610.25,
  XAF: 610.25,
}

interface CurrencyConverterProps {
  amount: number
  readOnly?: boolean
}

export function CurrencyConverter({ amount, readOnly = false }: CurrencyConverterProps) {
  const [userCurrency, setUserCurrency] = useState("USD")
  const [convertedAmount, setConvertedAmount] = useState("0.00")

  useEffect(() => {
    // Auto-detect user's currency based on locale
    const locale = navigator.language || "en-US"
    const region = locale.split("-")[1] || "US"

    // Map common regions to currencies
    const regionToCurrency: { [key: string]: string } = {
      US: "USD",
      CA: "CAD",
      GB: "GBP",
      EU: "EUR",
      DE: "EUR",
      FR: "EUR",
      IT: "EUR",
      ES: "EUR",
      JP: "JPY",
      CN: "CNY",
      IN: "INR",
      AU: "AUD",
      BR: "BRL",
      MX: "MXN",
      RU: "RUB",
      KR: "KRW",
      ZA: "ZAR",
      NG: "NGN",
      EG: "EGP",
      // Add more mappings as needed
    }

    const detectedCurrency = regionToCurrency[region] || "USD"
    setUserCurrency(detectedCurrency)
  }, [])

  useEffect(() => {
    if (!amount || isNaN(Number(amount))) {
      setConvertedAmount("0.00")
      return
    }

    // Get the exchange rates
    const fromRate = exchangeRates["USD"] || 1 // Always from USD
    const toRate = exchangeRates[userCurrency as keyof typeof exchangeRates] || 1

    // Calculate the converted amount
    const amountInUSD = Number(amount) / fromRate
    const convertedValue = amountInUSD * toRate

    // Format the result
    setConvertedAmount(convertedValue.toFixed(2))
  }, [amount, userCurrency])

  // Find currency symbols
  const fromSymbol = "$" // Always USD
  const toSymbol = currencies.find((c) => c.code === userCurrency)?.symbol || "$"

  if (userCurrency === "USD") {
    // Don't show converter if already in USD
    return null
  }

  return (
    <div className="bg-[#162040] p-3 rounded-md mt-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Label className="text-xs text-gray-400">USD</Label>
          <div className="text-sm font-medium">
            {fromSymbol} {amount?.toLocaleString() || "0.00"}
          </div>
        </div>
        <ArrowRight className="mx-2 text-gray-400 h-3 w-3" />
        <div className="flex-1">
          <Label className="text-xs text-gray-400">{userCurrency}</Label>
          <div className="text-sm font-medium">
            {toSymbol} {Number(convertedAmount).toLocaleString()}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">Auto-detected: {userCurrency} (Your local currency)</p>
    </div>
  )
}
