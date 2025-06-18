"use client"

import { useState, useEffect } from "react"

export function useTimezone() {
  const [timezone, setTimezone] = useState("")
  const [localTime, setLocalTime] = useState("")

  useEffect(() => {
    // Get user's timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setTimezone(userTimezone)

    // Update local time every second
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleString("en-US", {
        timeZone: userTimezone,
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      setLocalTime(timeString)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return { timezone, localTime }
}

export function TimezoneDisplay() {
  const { timezone, localTime } = useTimezone()

  return (
    <div className="text-xs text-gray-400">
      <p>Your timezone: {timezone}</p>
      <p>Local time: {localTime}</p>
    </div>
  )
}
