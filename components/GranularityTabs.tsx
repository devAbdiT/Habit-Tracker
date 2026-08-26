"use client"

import React from "react"

export type Granularity = "DAY" | "WEEK" | "MONTH" | "YEAR"

interface GranularityTabsProps {
  activeTab: Granularity
  onTabChange: (tab: Granularity) => void
}

export function GranularityTabs({ activeTab, onTabChange }: GranularityTabsProps) {
  const tabs: Granularity[] = ["DAY", "WEEK", "MONTH", "YEAR"]

  return (
    <div className="inline-flex items-center p-1 bg-[var(--muted)] rounded-lg border border-[var(--border)]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              isActive
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
