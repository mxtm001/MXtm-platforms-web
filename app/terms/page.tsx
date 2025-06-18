import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the MXTM INVESTMENT PLATFORM website and services, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Description of Services</h2>
            <p>
              MXTM INVESTMENT PLATFORM provides investment services in Forex, Stocks, Cryptocurrencies, and Binary
              Options. Our platform allows users to invest in various plans with different returns and durations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Account Registration</h2>
            <p>
              To use our services, you must create an account by providing accurate and complete information. You are
              responsible for maintaining the confidentiality of your account credentials and for all activities that
              occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Investment Risks</h2>
            <p>
              All investments involve risk, and the past performance of a security, industry, sector, market, or
              financial product does not guarantee future results or returns. You understand that investments can result
              in the loss of principal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Deposits and Withdrawals</h2>
            <p>
              Deposits and withdrawals are processed according to our platform's policies. Withdrawal requests are
              typically processed within 24 hours, but may take longer depending on various factors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Prohibited Activities</h2>
            <p>
              You agree not to engage in any activities that may harm the platform or other users, including but not
              limited to fraud, misrepresentation, or unauthorized access to other accounts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account at our discretion, without notice, for conduct
              that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for
              any other reason.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Changes to Terms</h2>
            <p>
              We may modify these Terms of Service at any time. We will notify you of any changes by posting the new
              Terms of Service on this page. Your continued use of the platform after any such changes constitutes your
              acceptance of the new Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at support@mxtminvestment.com.
            </p>
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
