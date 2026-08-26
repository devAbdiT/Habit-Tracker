import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ensureOccurrencesForRange } from "@/lib/recurrence"
import { Category, Recurrence } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const start = searchParams.get("start")
    const end = searchParams.get("end")
    const userId = searchParams.get("userId") || "default-user"

    // If a date range is requested, ensure occurrence records exist lazily
    if (start && end) {
      await ensureOccurrencesForRange(start, end, userId)
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        archived: false,
      },
      include: {
        occurrences: start && end ? {
          where: {
            date: {
              gte: start,
              lte: end,
            },
          },
          orderBy: { date: "asc" },
        } : {
          orderBy: { date: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("GET /api/tasks error:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, category, recurrence, scheduledTime, startDate, endDate, userId } = body

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const newTask = await prisma.task.create({
      data: {
        userId: userId || "default-user",
        title: title.trim(),
        category: category && Object.values(Category).includes(category) ? category : null,
        recurrence: recurrence && Object.values(Recurrence).includes(recurrence) ? recurrence : Recurrence.DAILY,
        scheduledTime: scheduledTime || null,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
      },
    })

    // Pre-generate occurrences for the immediate 14-day window around creation
    const today = new Date()
    const twoWeeksLater = new Date(today)
    twoWeeksLater.setDate(today.getDate() + 14)
    
    const startStr = today.toISOString().split("T")[0]
    const endStr = twoWeeksLater.toISOString().split("T")[0]

    await ensureOccurrencesForRange(startStr, endStr, newTask.userId || "default-user")

    const taskWithOccurrences = await prisma.task.findUnique({
      where: { id: newTask.id },
      include: { occurrences: true },
    })

    return NextResponse.json(taskWithOccurrences, { status: 201 })
  } catch (error) {
    console.error("POST /api/tasks error:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
