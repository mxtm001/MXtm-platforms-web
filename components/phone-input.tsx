"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { countries } from "./country-selector"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  countryCode?: string
  className?: string
  placeholder?: string
}

export function PhoneInput({ value, onChange, countryCode, className, placeholder }: PhoneInputProps) {
  const [phoneCode, setPhoneCode] = useState("+1")

  useEffect(() => {
    if (countryCode) {
      const country = countries.find((c) => c.code === countryCode)
      if (country) {
        setPhoneCode(country.phone)
      }
    }
  }, [countryCode])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value
    // Remove any non-digit characters except + and spaces
    const cleanedNumber = phoneNumber.replace(/[^\d\s+]/g, "")
    onChange(cleanedNumber)
  }

  const formatPhoneNumber = (phone: string) => {
    // Basic phone number formatting
    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.length >= 10) {
      // Format as: (XXX) XXX-XXXX for US/CA or similar for others
      if (phoneCode === "+1") {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
      } else {
        // Generic international format
        return cleaned.replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3")
      }
    }
    return phone
  }

  return (
    <div className="space-y-2">
      <Label className="text-white">Phone Number</Label>
      <div className="flex">
        <div className="flex items-center px-3 bg-[#162040] border border-[#253256] border-r-0 rounded-l-md text-white text-sm">
          {phoneCode}
        </div>
        <Input
          type="tel"
          value={value}
          onChange={handlePhoneChange}
          className={`bg-[#162040] border-[#253256] text-white rounded-l-none ${className}`}
          placeholder={placeholder || "Enter your phone number"}
        />
      </div>
      <p className="text-xs text-gray-400">Format: {phoneCode === "+1" ? "(123) 456-7890" : "123 456 7890"}</p>
    </div>
  )
}
