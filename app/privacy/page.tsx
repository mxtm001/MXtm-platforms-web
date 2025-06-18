import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050e24] text-white">
      <header className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="relative w-12 h-12">
            <Image src="/logo.png" alt="MXTM Investment" fill className="object-contain" />
          </div>
          <span className="ml-2 text-white font-medium">MXTM INVESTMENT PLATFORM</span>
        </Link>
        <div className="flex gap-4">
          <Link href="/register">
            <Button className="bg-[#f9a826] hover:bg-[#f9a826]/90 text-black font-medium">Register</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-[#1a2747] hover:bg-[#1a2747]/90 text-white font-medium">Login</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p>
              We collect personal information that you provide to us, such as your name, email address, and payment
              information when you register for an account or make a transaction on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
            <p>
              We use your information to provide and improve our services, process transactions, communicate with you,
              and comply with legal obligations. We may also use your information for marketing purposes, but you can
              opt out at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your information
              with service providers who help us operate our platform, but they are bound by confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access,
              alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic
              storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our platform and hold certain
              information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being
              sent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, such as the
              right to access, correct, or delete your data. To exercise these rights, please contact us using the
              information provided below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@mxtminvestment.com.</p>
          </section>
        </div>
      </main>

      <footer className="bg-[#030917] py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">© 2024 MXTM INVESTMENT PLATFORM. All rights reserved.</p>
            </div>
            <div className="flex gap-4">
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
