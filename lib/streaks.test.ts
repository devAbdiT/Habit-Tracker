import { describe, it, expect, vi, beforeAll, afterAll } from "vitest"
import { calculateStreaks } from "./streaks"
import { Recurrence, Status } from "./types"
import { formatDateKey } from "./recurrence"

// Mock Date to control "today" in tests
const MOCK_TODAY = new Date("2024-01-15T12:00:00Z")

describe("calculateStreaks", () => {
  beforeAll(() => {
    vi.useFakeTimers()
    vi.setSystemTime(MOCK_TODAY)
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  const baseTask = {
    startDate: new Date("2024-01-10T00:00:00Z"),
    endDate: null,
    recurrence: Recurrence.DAILY,
  }

  it("calculates an unbroken streak", () => {
    const occurrences = [
      { date: "2024-01-10", status: Status.DONE },
      { date: "2024-01-11", status: Status.DONE },
      { date: "2024-01-12", status: Status.DONE },
      { date: "2024-01-13", status: Status.DONE },
      { date: "2024-01-14", status: Status.DONE },
      { date: "2024-01-15", status: Status.DONE }, // Today
    ]

    const result = calculateStreaks(occurrences, baseTask)
    expect(result.currentStreak).toBe(6)
    expect(result.bestStreak).toBe(6)
  })

  it("breaks streak on MISSED day", () => {
    const occurrences = [
      { date: "2024-01-10", status: Status.DONE },
      { date: "2024-01-11", status: Status.DONE },
      { date: "2024-01-12", status: Status.MISSED }, // Breaks streak
      { date: "2024-01-13", status: Status.DONE },
      { date: "2024-01-14", status: Status.DONE },
      { date: "2024-01-15", status: Status.DONE }, // Today
    ]

    const result = calculateStreaks(occurrences, baseTask)
    expect(result.currentStreak).toBe(3)
    expect(result.bestStreak).toBe(3) // current streak is 3, previous was 2
  })

  it("breaks streak on past PENDING day", () => {
    const occurrences = [
      { date: "2024-01-10", status: Status.DONE },
      { date: "2024-01-11", status: Status.DONE },
      { date: "2024-01-12", status: Status.DONE },
      { date: "2024-01-13", status: Status.PENDING }, // Breaks streak
      { date: "2024-01-14", status: Status.DONE },
      { date: "2024-01-15", status: Status.DONE }, // Today
    ]

    const result = calculateStreaks(occurrences, baseTask)
    expect(result.currentStreak).toBe(2)
    expect(result.bestStreak).toBe(3)
  })

  it("does not break streak for today's PENDING day", () => {
    const occurrences = [
      { date: "2024-01-10", status: Status.DONE },
      { date: "2024-01-11", status: Status.DONE },
      { date: "2024-01-12", status: Status.DONE },
      { date: "2024-01-13", status: Status.DONE },
      { date: "2024-01-14", status: Status.DONE },
      { date: "2024-01-15", status: Status.PENDING }, // Today
    ]

    const result = calculateStreaks(occurrences, baseTask)
    expect(result.currentStreak).toBe(5)
    expect(result.bestStreak).toBe(5)
  })

  it("breaks streak for missing record on expected date", () => {
    const occurrences = [
      { date: "2024-01-10", status: Status.DONE },
      { date: "2024-01-11", status: Status.DONE },
      // 2024-01-12 is missing
      { date: "2024-01-13", status: Status.DONE },
      { date: "2024-01-14", status: Status.DONE },
      { date: "2024-01-15", status: Status.DONE }, // Today
    ]

    const result = calculateStreaks(occurrences, baseTask)
    expect(result.currentStreak).toBe(3)
    expect(result.bestStreak).toBe(3)
  })
})
