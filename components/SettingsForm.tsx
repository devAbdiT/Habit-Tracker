"use client"

import React, { useState } from "react"
import { Bell, Mail } from "lucide-react"

interface SettingsFormProps {
  initialData: {
    emailRemindersEnabled: boolean
    pushNotificationsEnabled: boolean
  }
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [emailEnabled, setEmailEnabled] = useState(initialData.emailRemindersEnabled)
  const [pushEnabled, setPushEnabled] = useState(initialData.pushNotificationsEnabled)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage("")

    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailRemindersEnabled: emailEnabled,
          pushNotificationsEnabled: pushEnabled,
        })
      })

      if (!res.ok) throw new Error("Failed to update settings")
      
      setMessage("Settings saved successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error(error)
      setMessage("Error saving settings.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg bg-[var(--background)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--muted)] rounded-md">
            <Mail className="w-5 h-5 text-[var(--foreground)]" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Email Reminders</h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Receive a daily email reminder when it's time to complete a habit. 
              <br/>This works reliably across all devices with no permission prompt needed.
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={emailEnabled}
            onChange={(e) => setEmailEnabled(e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--primary)]"></div>
        </label>
      </div>

      <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg bg-[var(--background)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--muted)] rounded-md">
            <Bell className="w-5 h-5 text-[var(--foreground)]" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Push Notifications</h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Receive browser push notifications when a habit is due.
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={pushEnabled}
            onChange={(e) => setPushEnabled(e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--primary)]"></div>
        </label>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)]">
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isSaving ? "Saving..." : "Save Preferences"}
        </button>
        {message && (
          <span className="text-sm text-[var(--muted-foreground)] animate-in fade-in">
            {message}
          </span>
        )}
      </div>
    </form>
  )
}
