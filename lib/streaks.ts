import { Recurrence, Status } from "@/lib/types"
import { isTaskScheduledOnDate, formatDateKey } from "@/lib/recurrence"

interface OccurrenceData {
  date: string // YYYY-MM-DD
  status: Status
}

export interface StreakResult {
  currentStreak: number
  bestStreak: number
}

export function calculateStreaks(
  occurrences: OccurrenceData[],
  task: { startDate: Date; endDate: Date | null; recurrence: Recurrence }
): StreakResult {
  // We need to evaluate the streak from task.startDate up to today (or task.endDate, whichever is earlier)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDate = new Date(task.startDate)
  startDate.setHours(0, 0, 0, 0)

  let endLimit = today
  if (task.endDate) {
    const endDate = new Date(task.endDate)
    endDate.setHours(0, 0, 0, 0)
    if (endDate < endLimit) {
      endLimit = endDate
    }
  }

  // Create a map of existing occurrences for O(1) lookup
  const occurrenceMap = new Map<string, Status>()
  for (const occ of occurrences) {
    occurrenceMap.set(occ.date, occ.status)
  }

  let currentStreak = 0
  let bestStreak = 0
  let currentRun = 0

  const todayKey = formatDateKey(today)

  const current = new Date(startDate)
  while (current <= endLimit) {
    if (isTaskScheduledOnDate({ ...task, startDate: task.startDate, endDate: task.endDate, recurrence: task.recurrence } as any, current)) {
      const dateKey = formatDateKey(current)
      const status = occurrenceMap.get(dateKey)

      if (status === Status.DONE) {
        currentRun++
        if (currentRun > bestStreak) {
          bestStreak = currentRun
        }
      } else if (dateKey === todayKey && status === Status.PENDING) {
        // Today's PENDING doesn't break an active streak
        // (but doesn't add to it either)
      } else {
        // MISSED, SKIPPED, or unaddressed PENDING (including completely missing records) breaks the streak
        currentRun = 0
      }
    }
    current.setDate(current.getDate() + 1)
  }

  // If the last evaluated run is the current streak
  currentStreak = currentRun

  return { currentStreak, bestStreak }
}
