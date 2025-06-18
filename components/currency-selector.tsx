"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Comprehensive list of world currencies with symbols and codes
export const currencies = [
  // North America
  { code: "USD", name: "US Dollar", symbol: "$", region: "North America" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", region: "North America" },
  { code: "MXN", name: "Mexican Peso", symbol: "Mex$", region: "North America" },

  // South America
  { code: "BRL", name: "Brazilian Real", symbol: "R$", region: "South America" },
  { code: "ARS", name: "Argentine Peso", symbol: "$", region: "South America" },
  { code: "CLP", name: "Chilean Peso", symbol: "$", region: "South America" },
  { code: "COP", name: "Colombian Peso", symbol: "$", region: "South America" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/", region: "South America" },
  { code: "UYU", name: "Uruguayan Peso", symbol: "$U", region: "South America" },
  { code: "VES", name: "Venezuelan Bolívar", symbol: "Bs.", region: "South America" },

  // Europe
  { code: "EUR", name: "Euro", symbol: "€", region: "Europe" },
  { code: "GBP", name: "British Pound", symbol: "£", region: "Europe" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", region: "Europe" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", region: "Europe" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", region: "Europe" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", region: "Europe" },
  { code: "PLN", name: "Polish Złoty", symbol: "zł", region: "Europe" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", region: "Europe" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", region: "Europe" },
  { code: "RON", name: "Romanian Leu", symbol: "lei", region: "Europe" },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв", region: "Europe" },
  { code: "HRK", name: "Croatian Kuna", symbol: "kn", region: "Europe" },
  { code: "RSD", name: "Serbian Dinar", symbol: "дин.", region: "Europe" },
  { code: "ISK", name: "Icelandic Króna", symbol: "kr", region: "Europe" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", region: "Europe" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", region: "Europe" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", region: "Europe" },

  // Asia
  { code: "JPY", name: "Japanese Yen", symbol: "¥", region: "Asia" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", region: "Asia" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", region: "Asia" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", region: "Asia" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", region: "Asia" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", region: "Asia" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", region: "Asia" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", region: "Asia" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", region: "Asia" },
  { code: "THB", name: "Thai Baht", symbol: "฿", region: "Asia" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", region: "Asia" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", region: "Asia" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", region: "Asia" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "₨", region: "Asia" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "₨", region: "Asia" },
  { code: "ILS", name: "Israeli New Shekel", symbol: "₪", region: "Asia" },
  { code: "AED", name: "United Arab Emirates Dirham", symbol: "د.إ", region: "Asia" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", region: "Asia" },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼", region: "Asia" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", region: "Asia" },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب", region: "Asia" },
  { code: "OMR", name: "Omani Rial", symbol: "﷼", region: "Asia" },

  // Oceania
  { code: "AUD", name: "Australian Dollar", symbol: "A$", region: "Oceania" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", region: "Oceania" },
  { code: "FJD", name: "Fijian Dollar", symbol: "FJ$", region: "Oceania" },
  { code: "PGK", name: "Papua New Guinean Kina", symbol: "K", region: "Oceania" },
  { code: "SBD", name: "Solomon Islands Dollar", symbol: "SI$", region: "Oceania" },
  { code: "TOP", name: "Tongan Paʻanga", symbol: "T$", region: "Oceania" },
  { code: "VUV", name: "Vanuatu Vatu", symbol: "VT", region: "Oceania" },
  { code: "WST", name: "Samoan Tala", symbol: "WS$", region: "Oceania" },

  // Africa
  { code: "ZAR", name: "South African Rand", symbol: "R", region: "Africa" },
  { code: "EGP", name: "Egyptian Pound", symbol: "£", region: "Africa" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", region: "Africa" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", region: "Africa" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", region: "Africa" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "د.م.", region: "Africa" },
  { code: "TND", name: "Tunisian Dinar", symbol: "د.ت", region: "Africa" },
  { code: "DZD", name: "Algerian Dinar", symbol: "د.ج", region: "Africa" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh", region: "Africa" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", region: "Africa" },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br", region: "Africa" },
  { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK", region: "Africa" },
  { code: "XOF", name: "West African CFA Franc", symbol: "CFA", region: "Africa" },
  { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA", region: "Africa" },
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
            <CommandGroup heading="North America" className="max-h-[300px] overflow-auto">
              {currencies
                .filter((currency) => currency.region === "North America")
                .map((currency) => (
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
            <CommandGroup heading="South America" className="max-h-[300px] overflow-auto">
              {currencies
                .filter((currency) => currency.region === "South America")
                .map((currency) => (
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
            <CommandGroup heading="Europe" className="max-h-[300px] overflow-auto">
              {currencies
                .filter((currency) => currency.region === "Europe")
                .map((currency) => (
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
            <CommandGroup heading="Asia" className="max-h-[300px] overflow-auto">
              {currencies
                .filter((currency) => currency.region === "Asia")
                .map((currency) => (
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
            <CommandGroup heading="Oceania" className="max-h-[300px] overflow-auto">
              {currencies
                .filter((currency) => currency.region === "Oceania")
                .map((currency) => (
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
            <CommandGroup heading="Africa" className="max-h-[300px] overflow-auto">
              {currencies
                .filter((currency) => currency.region === "Africa")
                .map((currency) => (
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
