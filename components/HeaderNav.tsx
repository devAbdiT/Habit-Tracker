"use client"

import React, { useState, useEffect } from "react"
import { Plus, User, Sparkles, Sun, Moon } from "lucide-react"

interface HeaderNavProps {
  onAddHabitClick: () => void
  activeView: string
  onViewChange: (view: string) => void
}

export function HeaderNav({
  onAddHabitClick,
  activeView,
  onViewChange,
}: HeaderNavProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const views = ["Today", "Week", "Month", "Year"]

  useEffect(() => {
    // Detect dark mode from html class or localStorage
    const isDark = document.documentElement.classList.contains("dark") ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
    
    if (isDark) {
      document.documentElement.classList.add("dark")
      setIsDarkMode(true)
    }
  }, [])

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setIsDarkMode(true)
    }
  }

  return (
    <header className="w-full border-b border-[var(--border)] bg-[var(--card)] px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Brand / Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="font-bold text-lg tracking-tight text-[var(--foreground)]">
          Serene Habit
        </span>
      </div>

      {/* Nav View Filter Links */}
      <nav className="hidden md:flex items-center gap-6">
        {views.map((v) => {
          const isActive = activeView.toLowerCase() === v.toLowerCase()
          return (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`text-sm font-medium transition-colors ${
                isActive
                  ? "text-[var(--foreground)] font-semibold border-b-2 border-[var(--primary)] pb-0.5"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {v}
            </button>
          )
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        {/* Light/Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        <button
          onClick={onAddHabitClick}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Habit</span>
        </button>

        <div className="w-8 h-8 rounded-full bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer transition-colors">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  )
}
