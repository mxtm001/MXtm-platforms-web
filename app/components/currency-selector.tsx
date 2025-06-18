"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Currency data with symbols and codes
export const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "MXN", name: "Mexican Peso", symbol: "Mex$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
]

interface CurrencySelectorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function CurrencySelector({ value, onChange, className }: CurrencySelectorProps) {
  const [open, setOpen] = useState(false)

  // Find the selected currency object
  const selectedCurrency = currencies.find((currency) => currency.code === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between bg-[#162040] border-[#253256] text-white", className)}
        >
          {selectedCurrency ? `${selectedCurrency.symbol} ${selectedCurrency.code}` : "Select currency..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-[#0a1735] border-[#253256] text-white">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search currency..." className="text-white" />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {currencies.map((currency) => (
                <CommandItem
                  key={currency.code}
                  value={currency.code}
                  onSelect={(currentValue) => {
                    onChange(currentValue)
                    setOpen(false)
                  }}
                  className="text-white hover:bg-[#162040] aria-selected:bg-[#162040]"
                >
                  <Check className={cn("mr-2 h-4 w-4", value === currency.code ? "opacity-100" : "opacity-0")} />
                  {currency.symbol} {currency.code} - {currency.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
