import { prisma } from "@/lib/prisma"
import { Task } from "@prisma/client"
import { Recurrence, Status } from "@/lib/types"

/**
 * Format a Date object to YYYY-MM-DD string
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * Parse YYYY-MM-DD string to a Date object at midnight local time
 */
export function parseDateKey(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Check if a date matches the recurrence rule of a task
 */
export function isTaskScheduledOnDate(task: Task, date: Date): boolean {
  const taskStartDate = new Date(task.startDate)
  // Normalize both dates to midnight YYYY-MM-DD for clean comparison
  const dateKey = formatDateKey(date)
  const taskStartKey = formatDateKey(taskStartDate)

  if (dateKey < taskStartKey) {
    return false
  }

  if (task.endDate) {
    const taskEndKey = formatDateKey(new Date(task.endDate))
    if (dateKey > taskEndKey) {
      return false
    }
  }

  switch (task.recurrence) {
    case Recurrence.DAILY:
      return true

    case Recurrence.WEEKLY:
      // Matches the same day of week as task's startDate (0 = Sun, 1 = Mon, ...)
      return date.getDay() === taskStartDate.getDay()

    case Recurrence.MONTHLY:
      // Matches the same day of month as task's startDate
      return date.getDate() === taskStartDate.getDate()

    case Recurrence.YEARLY:
      // Matches the same month and day as task's startDate
      return (
        date.getMonth() === taskStartDate.getMonth() &&
        date.getDate() === taskStartDate.getDate()
      )

    default:
      return false
  }
}

/**
 * Lazily generate missing Occurrence rows for a single task within a date range [rangeStart, rangeEnd]
 */
export async function generateOccurrences(
  task: Task,
  rangeStart: Date | string,
  rangeEnd: Date | string
) {
  const start = typeof rangeStart === "string" ? parseDateKey(rangeStart) : new Date(rangeStart)
  const end = typeof rangeEnd === "string" ? parseDateKey(rangeEnd) : new Date(rangeEnd)

  // Standardize start and end to midnight
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)

  if (start > end) {
    return []
  }

  // 1. Determine all target date keys in range where task is scheduled
  const targetDateKeys: string[] = []
  const current = new Date(start)

  while (current <= end) {
    if (isTaskScheduledOnDate(task, current)) {
      targetDateKeys.push(formatDateKey(current))
    }
    current.setDate(current.getDate() + 1)
  }

  if (targetDateKeys.length === 0) {
    return []
  }

  // 2. Fetch existing occurrence dates for this task in the target date keys
  const existingOccurrences = await prisma.occurrence.findMany({
    where: {
      taskId: task.id,
      date: { in: targetDateKeys },
    },
    select: { date: true },
  })

  const existingDateSet = new Set(existingOccurrences.map((o) => o.date))
  const missingDateKeys = targetDateKeys.filter((dateKey) => !existingDateSet.has(dateKey))

  if (missingDateKeys.length === 0) {
    return []
  }

  // 3. Create missing Occurrence records with PENDING status
  const newOccurrencesData = missingDateKeys.map((dateKey) => ({
    taskId: task.id,
    date: dateKey,
    status: Status.PENDING,
  }))

  await prisma.occurrence.createMany({
    data: newOccurrencesData,
  })

  // 4. Return created occurrences
  return prisma.occurrence.findMany({
    where: {
      taskId: task.id,
      date: { in: missingDateKeys },
    },
  })
}

/**
 * Lazily ensure occurrences exist for all tasks in a given date range
 */
export async function ensureOccurrencesForRange(
  rangeStart: Date | string,
  rangeEnd: Date | string,
  userId: string = "default-user"
) {
  const tasks = await prisma.task.findMany({
    where: {
      userId,
    },
  })

  for (const task of tasks) {
    await generateOccurrences(task, rangeStart, rangeEnd)
  }
}
