"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
  LogOut,
  HelpCircle,
  MessageCircle,
  Search,
  Send,
  User,
  Loader2,
} from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "admin"
  timestamp: number
  read: boolean
}

interface ChatPreview {
  lastMessage: string
  timestamp: number
  unread: boolean
  userName: string
}

export default function AdminChat() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [chats, setChats] = useState<Record<string, ChatPreview>>({})
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      // Only allow admin@mxtminvestment.com to access this page
      if (parsedUser.email !== "admin@mxtminvestment.com") {
        router.push("/dashboard")
        return
      }
      setUser(parsedUser)
    } catch (error) {
      localStorage.removeItem("user")
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  // Load chats
  useEffect(() => {
    const storedChats = localStorage.getItem("admin_chats")
    if (storedChats) {
      setChats(JSON.parse(storedChats))
    }

    // Check for new messages every 3 seconds
    const interval = setInterval(() => {
      const currentChats = localStorage.getItem("admin_chats")
      if (currentChats) {
        setChats(JSON.parse(currentChats))
      }

      // If a chat is selected, check for new messages
      if (selectedChat) {
        const chatMessages = localStorage.getItem(`chat_messages_${selectedChat}`)
        if (chatMessages) {
          setMessages(JSON.parse(chatMessages))
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [selectedChat])

  // Load messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      const chatMessages = localStorage.getItem(`chat_messages_${selectedChat}`)
      if (chatMessages) {
        setMessages(JSON.parse(chatMessages))
      } else {
        setMessages([])
      }

      // Mark chat as read
      if (chats[selectedChat]?.unread) {
        const updatedChats = { ...chats }
        updatedChats[selectedChat].unread = false
        setChats(updatedChats)
        localStorage.setItem("admin_chats", JSON.stringify(updatedChats))
      }
    }
  }, [selectedChat, chats])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return

    setIsTyping(true)

    // Create new message
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      content: message,
      sender: "admin",
      timestamp: Date.now(),
      read: false,
    }

    // Add to messages
    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)

    // Save to localStorage
    localStorage.setItem(`chat_messages_${selectedChat}`, JSON.stringify(updatedMessages))

    // Update chat preview
    const updatedChats = { ...chats }
    updatedChats[selectedChat] = {
      ...updatedChats[selectedChat],
      lastMessage: message,
      timestamp: Date.now(),
    }
    setChats(updatedChats)
    localStorage.setItem("admin_chats", JSON.stringify(updatedChats))

    // Clear input
    setMessage("")
    setIsTyping(false)
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === now.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  // Filter chats based on search term
  const filteredChats = Object.entries(chats).filter(([_, chat]) => {
    return (
      chat.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Sort chats by timestamp (newest first)
  const sortedChats = filteredChats.sort((a, b) => b[1].timestamp - a[1].timestamp)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050e24] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1735] text-white hidden md:block">
        <div className="p-4 border-b border-[#253256]">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
            <span className="ml-2 font-medium text-sm">MXTM INVESTMENT</span>
          </Link>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <BarChart2 className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/deposit"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <ArrowUpRight className="mr-2 h-5 w-5" />
                Deposit
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/withdraw"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <ArrowDownRight className="mr-2 h-5 w-5" />
                Withdraw
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/investments"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <DollarSign className="mr-2 h-5 w-5" />
                Investments
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/history"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <Clock className="mr-2 h-5 w-5" />
                History
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/support"
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
              >
                <HelpCircle className="mr-2 h-5 w-5" />
                Support
              </Link>
            </li>
            <li>
              <Link href="/admin/chat" className="flex items-center p-2 rounded-md bg-[#162040] text-white">
                <MessageCircle className="mr-2 h-5 w-5" />
                Live Chat
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white w-full text-left"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-[#0a1735] p-4 flex justify-between items-center md:hidden">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
          </Link>
          <Button variant="outline" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </header>

        <div className="h-[calc(100vh-64px)] md:h-screen flex">
          {/* Chat List */}
          <div className="w-full md:w-80 bg-[#0a1735] border-r border-[#253256] flex flex-col">
            <div className="p-4 border-b border-[#253256]">
              <h2 className="text-xl font-bold text-white mb-4">Customer Chats</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9 bg-[#162040] border-[#253256] text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {sortedChats.length > 0 ? (
                sortedChats.map(([userId, chat]) => (
                  <button
                    key={userId}
                    className={`w-full text-left p-4 border-b border-[#253256] hover:bg-[#162040] transition-colors ${
                      selectedChat === userId ? "bg-[#162040]" : ""
                    }`}
                    onClick={() => setSelectedChat(userId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-[#253256] h-10 w-10 rounded-full flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white flex items-center">
                            {chat.userName}
                            {chat.unread && <span className="ml-2 bg-red-500 rounded-full h-2 w-2"></span>}
                          </h3>
                          <p className="text-xs text-gray-400 truncate max-w-[180px]">{chat.lastMessage}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{formatTime(chat.timestamp)}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400">No conversations yet</div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="hidden md:flex flex-1 flex-col bg-[#050e24]">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-[#253256] bg-[#0a1735] flex items-center">
                  <div className="bg-[#253256] h-10 w-10 rounded-full flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{chats[selectedChat]?.userName || "Customer"}</h3>
                    <p className="text-xs text-gray-400">User ID: {selectedChat}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length > 0 ? (
                    messages.map((msg, index) => {
                      // Check if we need to show a date separator
                      const showDateSeparator =
                        index === 0 || formatDate(msg.timestamp) !== formatDate(messages[index - 1].timestamp)

                      return (
                        <div key={msg.id}>
                          {showDateSeparator && (
                            <div className="flex justify-center my-4">
                              <div className="bg-[#162040] text-gray-400 text-xs px-3 py-1 rounded-full">
                                {formatDate(msg.timestamp)}
                              </div>
                            </div>
                          )}
                          <div className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                msg.sender === "admin"
                                  ? "bg-[#0066ff] text-white rounded-tr-none"
                                  : "bg-[#162040] text-white rounded-tl-none"
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <p className="text-xs text-right mt-1 opacity-70">{formatTime(msg.timestamp)}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center text-gray-400">No messages yet</div>
                  )}
                  {isTyping && (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-lg p-3 bg-[#0066ff]/50 text-white rounded-tr-none">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <p className="text-sm">Sending...</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-[#253256] bg-[#0a1735]">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSendMessage()
                    }}
                    className="flex items-center space-x-2"
                  >
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-[#162040] border-[#253256] text-white"
                    />
                    <Button
                      type="submit"
                      disabled={!message.trim() || isTyping}
                      className="bg-[#0066ff] hover:bg-[#0066ff]/90"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Select a conversation</h3>
                  <p className="text-gray-400 max-w-md">
                    Choose a conversation from the list to start chatting with your customers.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
