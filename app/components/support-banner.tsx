import Link from "next/link"
import { Mail, Phone } from "lucide-react"

export function SupportBanner() {
  return (
    <div className="bg-[#0a1735] border border-[#253256] rounded-lg p-4 mt-6">
      <h3 className="text-lg font-medium text-white mb-3">Need Help?</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <Phone className="h-4 w-4 text-[#f9a826] mr-2" />
          <span className="text-sm text-gray-300">+49 1521 1026452</span>
        </div>
        <div className="flex items-center">
          <Mail className="h-4 w-4 text-[#f9a826] mr-2" />
          <span className="text-sm text-gray-300 break-all">mxtmcontaverificacaocentro@gmail.com</span>
        </div>
      </div>
      <div className="mt-3">
        <Link href="/dashboard/support" className="text-[#0066ff] text-sm hover:underline">
          Contact Support Team →
        </Link>
      </div>
    </div>
  )
}
