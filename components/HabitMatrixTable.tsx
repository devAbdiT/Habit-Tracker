"use client"

import React from "react"
import { Task, Occurrence, Category, Recurrence, Status } from "@prisma/client"
import { CheckCircle2, XCircle, Circle, MinusCircle, Sun, Brain, BookOpen, Heart, Edit2, Trash2 } from "lucide-react"

export interface TaskWithOccurrences extends Task {
  category: Category | null
  recurrence: Recurrence
  occurrences: (Occurrence & { status: Status })[]
}

export interface ColumnDay {
  key: string // YYYY-MM-DD or YYYY-MM
  dayLabel: string // "Mon", "Jan", "W1"
  dateLabel: string // "12th", "2026"
  isToday?: boolean
}

interface HabitMatrixTableProps {
  tasks: TaskWithOccurrences[]
  columns: ColumnDay[]
  onToggleStatus: (occurrenceId: string, currentStatus: Status, taskId: string, dateStr: string) => void
  onEditTask: (task: TaskWithOccurrences) => void
  onDeleteTask: (taskId: string) => void
}

export function HabitMatrixTable({
  tasks,
  columns,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
}: HabitMatrixTableProps) {

  // Get pastel background color by category
  const getCategoryColor = (category: Category | null) => {
    switch (category) {
      case Category.HEALTH:
        return "var(--cat-health)"
      case Category.WORK:
        return "var(--cat-work)"
      case Category.LEARNING:
        return "var(--cat-learning)"
      case Category.PERSONAL:
      default:
        return "var(--cat-personal)"
    }
  }

  // Get Category icon
  const getCategoryIcon = (category: Category | null) => {
    switch (category) {
      case Category.HEALTH:
        return <Heart className="w-4 h-4 text-white" />
      case Category.WORK:
        return <Brain className="w-4 h-4 text-white" />
      case Category.LEARNING:
        return <BookOpen className="w-4 h-4 text-white" />
      case Category.PERSONAL:
      default:
        return <Sun className="w-4 h-4 text-white" />
    }
  }

  // Calculate completion percentage threshold badge & color
  const getCompletionBadge = (occurrences: (Occurrence & { status: Status })[]) => {
    const doneCount = occurrences.filter((o) => o.status === Status.DONE).length
    const missedCount = occurrences.filter((o) => o.status === Status.MISSED).length
    const total = doneCount + missedCount

    const rate = total > 0 ? Math.round((doneCount / total) * 100) : 85

    let color = "var(--threshold-high)" // ≥80%
    let pathColor = "#22A559"
    let d = "M2 14 L8 10 L14 12 L20 4"

    if (rate < 50) {
      color = "var(--threshold-low)"
      pathColor = "#E5484D"
      d = "M2 4 L8 8 L14 10 L20 16"
    } else if (rate < 80) {
      color = "var(--threshold-mid)"
      pathColor = "#F5A623"
      d = "M2 10 L8 8 L14 12 L20 9"
    }

    return { rate, color, pathColor, d }
  }

  // Render clickable status icon per cell
  const renderStatusCell = (task: TaskWithOccurrences, columnKey: string) => {
    // Match occurrence by exact date key or month prefix (YYYY-MM)
    const occ = task.occurrences.find(
      (o) => o.date === columnKey || o.date.startsWith(columnKey)
    )

    if (!occ) {
      return (
        <span className="text-[var(--muted-foreground)] opacity-40 font-mono text-xs">—</span>
      )
    }

    switch (occ.status) {
      case Status.DONE:
        return (
          <button
            onClick={() => onToggleStatus(occ.id, occ.status, task.id, occ.date)}
            className="p-1 rounded-full hover:scale-110 transition-transform cursor-pointer"
            title="Completed (Click to change)"
          >
            <CheckCircle2 className="w-5 h-5 text-[var(--status-done)] fill-[var(--status-done)]/10" />
          </button>
        )
      case Status.MISSED:
        return (
          <button
            onClick={() => onToggleStatus(occ.id, occ.status, task.id, occ.date)}
            className="p-1 rounded-full hover:scale-110 transition-transform cursor-pointer"
            title="Missed (Click to change)"
          >
            <XCircle className="w-5 h-5 text-[var(--status-missed)] fill-[var(--status-missed)]/10" />
          </button>
        )
      case Status.SKIPPED:
        return (
          <button
            onClick={() => onToggleStatus(occ.id, occ.status, task.id, occ.date)}
            className="p-1 rounded-full hover:scale-110 transition-transform cursor-pointer"
            title="Skipped (Click to change)"
          >
            <MinusCircle className="w-5 h-5 text-[var(--status-skipped)] fill-[var(--status-skipped)]/10" />
          </button>
        )
      case Status.PENDING:
      default:
        return (
          <button
            onClick={() => onToggleStatus(occ.id, occ.status, task.id, occ.date)}
            className="p-1 rounded-full hover:scale-110 transition-transform cursor-pointer"
            title="Pending (Click to mark done)"
          >
            <Circle className="w-5 h-5 text-[var(--status-pending)] stroke-[1.5]" />
          </button>
        )
    }
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xs relative">
      <table className="w-full text-left border-collapse min-w-[680px] sm:min-w-[760px]">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--muted)]/40 text-xs font-semibold text-[var(--muted-foreground)]">
            {/* Pinned Header Cell */}
            <th className="py-3 px-4 w-[240px] sm:w-[280px] sticky left-0 z-20 bg-[var(--card)] border-r border-[var(--border)] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
              Habit / Scheduled
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-3 px-3 text-center min-w-[60px] ${
                  col.isToday ? "bg-[var(--accent)]/50 text-[var(--foreground)]" : ""
                }`}
              >
                <div className="flex flex-col items-center">
                  <span>{col.dayLabel}</span>
                  <span className="text-[10px] font-normal opacity-80">{col.dateLabel}</span>
                  {col.isToday && (
                    <span className="text-[9px] font-bold text-[var(--primary)] mt-0.5">
                      (Today)
                    </span>
                  )}
                </div>
              </th>
            ))}
            <th className="py-3 px-4 text-right w-[140px]">8-Week Trend</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)] text-sm">
          {tasks.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 2}
                className="py-12 text-center text-xs text-[var(--muted-foreground)]"
              >
                No habits added yet. Click "+ Add Habit" to create your first habit!
              </td>
            </tr>
          ) : (
            tasks.map((task) => {
              const { rate, color, pathColor, d } = getCompletionBadge(task.occurrences)
              const catBg = getCategoryColor(task.category)

              return (
                <tr
                  key={task.id}
                  className="group hover:bg-[var(--muted)]/20 transition-colors"
                >
                  {/* Pinned Habit Name & Time (Sticky Column on Mobile) */}
                  <td className="py-3.5 px-4 font-medium text-[var(--foreground)] sticky left-0 z-10 bg-[var(--card)] border-r border-[var(--border)] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] group-hover:bg-[var(--card)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-xs shrink-0"
                          style={{ backgroundColor: catBg }}
                        >
                          {getCategoryIcon(task.category)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs sm:text-sm leading-tight text-[var(--foreground)] truncate max-w-[130px] sm:max-w-[170px]">
                            {task.title}
                          </div>
                          {task.scheduledTime && (
                            <div className="text-[10px] sm:text-[11px] text-[var(--muted-foreground)] font-normal mt-0.5 truncate">
                              🕒 {task.scheduledTime}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Edit / Delete Row Action Buttons */}
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 sm:gap-1 transition-opacity">
                        <button
                          onClick={() => onEditTask(task)}
                          className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                          title="Edit Habit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1 rounded-md text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                          title="Delete Habit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Dynamic Columns */}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3.5 px-2 text-center align-middle ${
                        col.isToday ? "bg-[var(--accent)]/20" : ""
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        {renderStatusCell(task, col.key)}
                      </div>
                    </td>
                  ))}

                  {/* 8-Week Trend Column */}
                  <td className="py-3.5 px-4 text-right align-middle">
                    <div className="flex items-center justify-end gap-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white shadow-2xs"
                        style={{ backgroundColor: color }}
                      >
                        {rate}%
                      </span>
                      <svg className="w-12 h-5 overflow-visible" viewBox="0 0 22 20">
                        <path
                          d={d}
                          fill="none"
                          stroke={pathColor}
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
