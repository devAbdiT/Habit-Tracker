"use client"

import React from "react"
import { TrendingUp, ArrowUpRight, Award } from "lucide-react"

interface ConsistencyScoreCardProps {
  score: number
  scoreChange?: string
  onViewInsights?: () => void
}

export function ConsistencyScoreCard({
  score = 82,
  scoreChange = "+5% this week",
  onViewInsights,
}: ConsistencyScoreCardProps) {
  return (
    <div className="bg-[var(--card)] text-[var(--card-foreground)] rounded-xl p-6 border border-[var(--border)] shadow-xs flex flex-col justify-between h-[320px]">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base tracking-tight">Consistency Score</h3>
          <div className="p-1.5 rounded-lg bg-[var(--accent)] text-[var(--primary)]">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
          You are maintaining a strong rhythm. Focus on evening reading to improve your overall matrix.
        </p>
      </div>

      <div className="my-4 flex items-baseline gap-3">
        <span className="text-5xl font-extrabold tracking-tight text-[var(--foreground)]">
          {score}
        </span>
        <span className="flex items-center text-xs font-semibold text-[var(--status-done)] gap-0.5">
          <TrendingUp className="w-3.5 h-3.5" />
          {scoreChange}
        </span>
      </div>

      <div>
        <button
          onClick={onViewInsights}
          className="w-full py-2.5 px-4 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] text-xs font-semibold text-[var(--foreground)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>View Detailed Insights</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
        </button>
      </div>
    </div>
  )
}
