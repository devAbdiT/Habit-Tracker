"use client"

import React, { useState, useRef, useCallback } from "react"
import { Flame, Trophy } from "lucide-react"

type OccurrenceStatus = "DONE" | "MISSED" | "PENDING" | "SKIPPED"

interface OccurrenceData {
  date: string // YYYY-MM-DD
  status: OccurrenceStatus
}

interface StreakHeatmapProps {
  occurrences: OccurrenceData[]
  weeks?: number          // default 26 (≈6 months)
  compact?: boolean       // smaller squares, no labels/legend/footer
  currentStreak?: number
  bestStreak?: number
}

// ─── Colour helpers ──────────────────────────────────────────────────────────
const STATUS_COLOR: Record<OccurrenceStatus | "NONE", string> = {
  DONE:    "#22c55e",
  MISSED:  "#ef4444",
  SKIPPED: "#f59e0b",
  PENDING: "#e5e7eb",
  NONE:    "#e5e7eb",
}

const STATUS_COLOR_DARK: Record<OccurrenceStatus | "NONE", string> = {
  DONE:    "#16a34a",
  MISSED:  "#dc2626",
  SKIPPED: "#d97706",
  PENDING: "#374151",
  NONE:    "#374151",
}

// Day-of-week names (0 = Sun, 1 = Mon … 6 = Sat)
const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTH_ABBR  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

function formatDateFriendly(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  return `${DOW_LABELS[d.getDay()]}, ${MONTH_ABBR[d.getMonth()]} ${d.getDate()}`
}

// ─── Build the week grid ──────────────────────────────────────────────────────
// Returns an array of weeks; each week is an array of 7 dates (Sun–Sat, some may be null for out-of-range padding)
function buildWeekGrid(weeks: number): (Date | null)[][] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Align end to Saturday (day 6)
  const end = new Date(today)
  end.setDate(end.getDate() + (6 - end.getDay()))

  // Go back `weeks` weeks from end
  const start = new Date(end)
  start.setDate(start.getDate() - weeks * 7 + 1)

  // Pad start back to Sunday
  const startDow = start.getDay()
  start.setDate(start.getDate() - startDow)

  const grid: (Date | null)[][] = []
  const cursor = new Date(start)

  while (cursor <= end) {
    const week: (Date | null)[] = []
    for (let d = 0; d < 7; d++) {
      const day = new Date(cursor)
      const isFuture = day > today
      week.push(isFuture ? null : new Date(day))
      cursor.setDate(cursor.getDate() + 1)
    }
    grid.push(week)
  }

  return grid
}

function toDateKey(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${dd}`
}

// ─── Component ────────────────────────────────────────────────────────────────
export function StreakHeatmap({
  occurrences,
  weeks = 26,
  compact = false,
  currentStreak,
  bestStreak,
}: StreakHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const occMap = new Map<string, OccurrenceStatus>()
  for (const o of occurrences) {
    occMap.set(o.date, o.status as OccurrenceStatus)
  }

  const grid = buildWeekGrid(weeks)

  const CELL   = compact ? 10 : 14
  const GAP    = compact ? 2  : 3
  const STEP   = CELL + GAP

  const handleMouseEnter = useCallback((e: React.MouseEvent<SVGRectElement>, label: string) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      label,
    })
  }, [])

  const handleMouseLeave = useCallback(() => setTooltip(null), [])

  // Detect dark mode via CSS variable (simple heuristic)
  const isDark = typeof window !== "undefined"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : false

  const colors = isDark ? STATUS_COLOR_DARK : STATUS_COLOR

  // ── Month labels ──────────────────────────────────────────────────────
  type MonthLabel = { colIdx: number; label: string }
  const monthLabels: MonthLabel[] = []
  if (!compact) {
    let lastMonth = -1
    grid.forEach((week, colIdx) => {
      const firstDay = week.find(d => d !== null)
      if (firstDay) {
        const m = firstDay.getMonth()
        if (m !== lastMonth) {
          monthLabels.push({ colIdx, label: MONTH_ABBR[m] })
          lastMonth = m
        }
      }
    })
  }

  const LABEL_W   = compact ? 0 : 28   // left gutter for day-of-week labels
  const MONTH_H   = compact ? 0 : 18   // top gutter for month labels
  const svgWidth  = LABEL_W + grid.length * STEP
  const svgHeight = MONTH_H + 7 * STEP

  // Rows to show day labels for (Mon=1, Wed=3, Fri=5)
  const dayLabelRows = compact ? [] : [1, 3, 5]

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* ── Scrollable grid ─────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative overflow-x-auto pb-1 select-none"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{ display: "block", overflow: "visible" }}
        >
          {/* Month labels */}
          {monthLabels.map(({ colIdx, label }) => (
            <text
              key={`m-${colIdx}`}
              x={LABEL_W + colIdx * STEP}
              y={MONTH_H - 4}
              fontSize={10}
              fill="var(--muted-foreground, #6b7280)"
              fontFamily="inherit"
            >
              {label}
            </text>
          ))}

          {/* Day-of-week labels (left axis) */}
          {dayLabelRows.map(row => (
            <text
              key={`dow-${row}`}
              x={LABEL_W - 4}
              y={MONTH_H + row * STEP + CELL - 2}
              fontSize={9}
              textAnchor="end"
              fill="var(--muted-foreground, #6b7280)"
              fontFamily="inherit"
            >
              {DOW_LABELS[row]}
            </text>
          ))}

          {/* Grid cells */}
          {grid.map((week, colIdx) =>
            week.map((day, rowIdx) => {
              if (!day) return null
              const key   = toDateKey(day)
              const status = occMap.get(key) ?? "NONE"
              const color  = colors[status]
              const friendlyDate = formatDateFriendly(key)
              const statusLabel  = status === "NONE" ? "No data" : status.charAt(0) + status.slice(1).toLowerCase()
              const label = `${friendlyDate} · ${statusLabel}`

              return (
                <rect
                  key={key}
                  x={LABEL_W + colIdx * STEP}
                  y={MONTH_H + rowIdx * STEP}
                  width={CELL}
                  height={CELL}
                  rx={compact ? 2 : 3}
                  fill={color}
                  style={{ cursor: "pointer", transition: "opacity 0.1s" }}
                  onMouseEnter={e => handleMouseEnter(e, label)}
                  onMouseLeave={handleMouseLeave}
                />
              )
            })
          )}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="pointer-events-none absolute z-50 px-2.5 py-1.5 rounded-lg text-[11px] font-medium shadow-lg border"
            style={{
              left: tooltip.x + 12,
              top:  tooltip.y - 30,
              backgroundColor: "var(--card)",
              borderColor:     "var(--border)",
              color:           "var(--foreground)",
              whiteSpace:      "nowrap",
            }}
          >
            {tooltip.label}
          </div>
        )}
      </div>

      {/* ── Legend ─────────────────────────────────────────────────── */}
      {!compact && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: colors.NONE }} />
              No data
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: colors.PENDING }} />
              Pending
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: colors.MISSED }} />
              Missed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: colors.SKIPPED }} />
              Skipped
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: colors.DONE }} />
              Done
            </span>
          </div>

          {/* Streak footer */}
          {(currentStreak !== undefined || bestStreak !== undefined) && (
            <div className="flex items-center gap-3 text-[11px] font-semibold text-[var(--muted-foreground)]">
              {currentStreak !== undefined && (
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  Current: <span className="text-[var(--foreground)]">{currentStreak}</span>
                </span>
              )}
              {bestStreak !== undefined && (
                <span className="flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                  Best: <span className="text-[var(--foreground)]">{bestStreak}</span>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
