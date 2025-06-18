"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"
import Image from "next/image"

interface Message {
  id: string
  content: string
  sender: "user" | "admin"
  timestamp: number
  read: boolean
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [userId, setUserId] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize user ID and load messages
  useEffect(() => {
    // Generate a unique ID for this user if not exists
    const storedUserId = localStorage.getItem("chat_user_id")
    const newUserId = storedUserId || `user_${Math.random().toString(36).substring(2, 9)}`

    if (!storedUserId) {
      localStorage.setItem("chat_user_id", newUserId)
    }

    setUserId(newUserId)

    // Load existing messages for this user
    const storedMessages = localStorage.getItem(`chat_messages_${newUserId}`)
    if (storedMessages) {
      const parsedMessages = JSON.parse(storedMessages) as Message[]
      setMessages(parsedMessages)

      // Count unread admin messages
      const unread = parsedMessages.filter((m) => m.sender === "admin" && !m.read).length
      setUnreadCount(unread)
    }

    // Add welcome message if no messages exist
    if (!storedMessages || JSON.parse(storedMessages).length === 0) {
      const welcomeMessage: Message = {
        id: `msg_${Date.now()}`,
        content: "Welcome to MXTM Investment Platform! How can we help you today?",
        sender: "admin",
        timestamp: Date.now(),
        read: false,
      }

      setMessages([welcomeMessage])
      localStorage.setItem(`chat_messages_${newUserId}`, JSON.stringify([welcomeMessage]))
      setUnreadCount(1)
    }

    // Check for new messages every 5 seconds
    const interval = setInterval(() => {
      const currentMessages = localStorage.getItem(`chat_messages_${newUserId}`)
      if (currentMessages) {
        const parsedMessages = JSON.parse(currentMessages) as Message[]

        // If there are new messages from admin
        if (parsedMessages.length > messages.length) {
          setMessages(parsedMessages)

          // Count unread admin messages
          const unread = parsedMessages.filter((m) => m.sender === "admin" && !m.read).length
          setUnreadCount(unread)
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      const updatedMessages = messages.map((msg) => ({
        ...msg,
        read: msg.sender === "admin" ? true : msg.read,
      }))

      setMessages(updatedMessages)
      localStorage.setItem(`chat_messages_${userId}`, JSON.stringify(updatedMessages))
      setUnreadCount(0)
    }
  }, [isOpen, unreadCount, messages, userId])

  const handleSendMessage = () => {
    if (!message.trim()) return

    setIsLoading(true)

    // Create new message
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      content: message,
      sender: "user",
      timestamp: Date.now(),
      read: true,
    }

    // Add to messages
    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)

    // Save to localStorage
    localStorage.setItem(`chat_messages_${userId}`, JSON.stringify(updatedMessages))

    // Also save to admin's view of all messages
    const allChats = JSON.parse(localStorage.getItem("admin_chats") || "{}")
    allChats[userId] = {
      lastMessage: message,
      timestamp: Date.now(),
      unread: true,
      userName: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}").email : "Guest User",
    }
    localStorage.setItem("admin_chats", JSON.stringify(allChats))

    // Clear input
    setMessage("")

    // Simulate admin typing for demo
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#0066ff] text-white rounded-full p-4 shadow-lg hover:bg-[#0066ff]/90 transition-all z-50"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-[#0a1735] border border-[#253256] rounded-lg shadow-xl flex flex-col z-50 animate-fade-in">
          {/* Header */}
          <div className="p-4 border-b border-[#253256] flex items-center justify-between bg-[#162040] rounded-t-lg">
            <div className="flex items-center">
              <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                <Image src="/logo.png" alt="MXTM Support" fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-medium text-white">MXTM Support</h3>
                <p className="text-xs text-gray-400">We typically reply in a few minutes</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === "user"
                      ? "bg-[#0066ff] text-white rounded-tr-none"
                      : "bg-[#162040] text-white rounded-tl-none"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-right mt-1 opacity-70">{formatTime(msg.timestamp)}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-[#162040] text-white rounded-tl-none">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm">Support is typing...</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[#253256] bg-[#0a1735] rounded-b-lg">
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
                size="icon"
                disabled={!message.trim() || isLoading}
                className="bg-[#0066ff] hover:bg-[#0066ff]/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
