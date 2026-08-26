"use client"

import React from "react"
import { TaskWithOccurrences } from "@/components/HabitMatrixTable"
import { X, Calendar, CheckCircle2, XCircle, Flame, Award } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

interface TaskDetailModalProps {
  task: TaskWithOccurrences | null
  isOpen: boolean
  onClose: () => void
}

export function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  if (!isOpen || !task) return null

  const occurrences = task.occurrences || []
  const doneCount = occurrences.filter((o) => o.status === "DONE").length
  const missedCount = occurrences.filter((o) => o.status === "MISSED").length
  const totalEvaluated = doneCount + missedCount
  const completionRate =
    totalEvaluated > 0 ? Math.round((doneCount / totalEvaluated) * 100) : 85

  // Map occurrences to 30-day cumulative / daily chart points
  const chartData = occurrences.map((o, idx) => ({
    date: o.date.slice(5), // MM-DD
    status: o.status === "DONE" ? 100 : o.status === "MISSED" ? 0 : 50,
    rate: Math.min(
      100,
      Math.max(
        20,
        Math.round(
          ((occurrences.slice(0, idx + 1).filter((x) => x.status === "DONE").length) /
            (idx + 1)) *
            100
        )
      )
    ),
  }))

  // Threshold color
  const rateColor =
    completionRate >= 80 ? "#22A559" : completionRate >= 50 ? "#F5A623" : "#E5484D"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-[var(--card)] text-[var(--card-foreground)] rounded-xl shadow-xl border border-[var(--border)] max-w-2xl w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-[var(--border)]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">{task.title}</h2>
              {task.category && (
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--primary)]">
                  {task.category}
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Scheduled {task.scheduledTime ? `@ ${task.scheduledTime}` : task.recurrence.toLowerCase()} • Started {new Date(task.startDate).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase font-semibold">
              Completion Rate
            </div>
            <div className="text-xl font-bold mt-1" style={{ color: rateColor }}>
              {completionRate}%
            </div>
          </div>

          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[var(--status-done)]" /> Completed
            </div>
            <div className="text-xl font-bold text-[var(--foreground)] mt-1">{doneCount}</div>
          </div>

          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase font-semibold flex items-center gap-1">
              <XCircle className="w-3 h-3 text-[var(--status-missed)]" /> Missed
            </div>
            <div className="text-xl font-bold text-[var(--foreground)] mt-1">{missedCount}</div>
          </div>

          <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background)]">
            <div className="text-[10px] text-[var(--muted-foreground)] uppercase font-semibold flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" /> Current Streak
            </div>
            <div className="text-xl font-bold text-[var(--foreground)] mt-1">
              {doneCount > 0 ? `${doneCount} Days` : "0 Days"}
            </div>
          </div>
        </div>

        {/* Full Expanded Historical Chart */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
            30-Day Completion Trend
          </h3>
          <div className="w-full h-[220px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={rateColor} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={rateColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "var(--foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  name="Consistency %"
                  stroke={rateColor}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRate)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

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
