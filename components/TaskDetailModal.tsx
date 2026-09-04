"use client"

import React from "react"
import { TaskWithOccurrences } from "@/components/HabitMatrixTable"
import { X, CheckCircle2, XCircle, Flame, Trophy } from "lucide-react"
import { calculateStreaks } from "@/lib/streaks"
import { StreakHeatmap } from "@/components/StreakHeatmap"

interface TaskDetailModalProps {
  task: TaskWithOccurrences | null
  isOpen: boolean
  onClose: () => void
}

export function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  if (!isOpen || !task) return null

  const occurrences = task.occurrences || []
  const doneCount   = occurrences.filter((o) => o.status === "DONE").length
  const missedCount = occurrences.filter((o) => o.status === "MISSED").length
  const totalEvaluated = doneCount + missedCount
  const completionRate =
    totalEvaluated > 0 ? Math.round((doneCount / totalEvaluated) * 100) : 0

  const { currentStreak, bestStreak } = calculateStreaks(occurrences, task as any)

  const rateColor =
    completionRate >= 80 ? "#22A559" : completionRate >= 50 ? "#F5A623" : "#E5484D"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-[var(--card)] text-[var(--card-foreground)] rounded-xl shadow-xl border border-[var(--border)] max-w-3xl w-full p-6 space-y-6">

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b pb-4 border-[var(--border)]">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold tracking-tight">{task.title}</h2>
              {task.category && (
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--primary)]">
                  {task.category}
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Scheduled {task.scheduledTime ? `@ ${task.scheduledTime}` : task.recurrence.toLowerCase()} •{" "}
              Started {new Date(task.startDate).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Stats Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase font-semibold">Rate</div>
            <div className="text-xl font-bold mt-1" style={{ color: rateColor }}>
              {completionRate}%
            </div>
          </div>

          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[var(--status-done)]" /> Done
            </div>
            <div className="text-xl font-bold text-[var(--foreground)] mt-1">{doneCount}</div>
          </div>

          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] hidden sm:block">
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase font-semibold flex items-center gap-1">
              <XCircle className="w-3 h-3 text-[var(--status-missed)]" /> Missed
            </div>
            <div className="text-xl font-bold text-[var(--foreground)] mt-1">{missedCount}</div>
          </div>

          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase font-semibold flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" /> Current
            </div>
            <div className="text-xl font-bold text-[var(--foreground)] mt-1">{currentStreak}</div>
          </div>

          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase font-semibold flex items-center gap-1">
              <Trophy className="w-3 h-3 text-yellow-500" /> Best
            </div>
            <div className="text-xl font-bold text-[var(--foreground)] mt-1">{bestStreak}</div>
          </div>
        </div>

        {/* ── Heatmap ───────────────────────────────────────────────── */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
            Activity History (last 26 weeks)
          </h3>
          <StreakHeatmap
            occurrences={occurrences as any}
            weeks={26}
            currentStreak={currentStreak}
            bestStreak={bestStreak}
          />
        </div>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
