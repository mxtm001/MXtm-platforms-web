"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // In a real app, you would make an API call to send the message
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

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
        <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-semibold mb-6">Get in Touch</h2>
            <p className="text-gray-300 mb-8">
              Have questions about our investment plans or need assistance with your account? Our team is here to help.
              Fill out the form and we'll get back to you as soon as possible.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-[#f9a826] mr-4 mt-1" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-300">mxtmcontaverificacaocentro@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-[#f9a826] mr-4 mt-1" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-gray-300">+49 1521 1026452</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-[#f9a826] mr-4 mt-1" />
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-gray-300">
                    123 Investment Avenue
                    <br />
                    Financial District
                    <br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            {success ? (
              <div className="bg-green-500/10 border border-green-500 rounded-lg p-6 text-center">
                <h3 className="text-xl font-medium text-green-500 mb-2">Message Sent!</h3>
                <p className="text-gray-300">Thank you for contacting us. We'll get back to you as soon as possible.</p>
                <Button className="mt-4 bg-[#0066ff] hover:bg-[#0066ff]/90" onClick={() => setSuccess(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 bg-[#0a1735] p-6 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-[#162040] border-[#253256] text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-[#162040] border-[#253256] text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-[#162040] border-[#253256] text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="min-h-[150px] bg-[#162040] border-[#253256] text-white"
                  />
                </div>

                <Button type="submit" className="w-full bg-[#0066ff] hover:bg-[#0066ff]/90" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>
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
