import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Category, Recurrence } from "@prisma/client"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, category, recurrence, scheduledTime, startDate, endDate, archived } = body

    const existingTask = await prisma.task.findUnique({
      where: { id },
    })

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(category !== undefined && {
          category: category && Object.values(Category).includes(category) ? category : null,
        }),
        ...(recurrence !== undefined && {
          recurrence: Object.values(Recurrence).includes(recurrence) ? recurrence : existingTask.recurrence,
        }),
        ...(scheduledTime !== undefined && { scheduledTime }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(archived !== undefined && { archived: Boolean(archived) }),
      },
      include: {
        occurrences: true,
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error("PATCH /api/tasks/[id] error:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingTask = await prisma.task.findUnique({
      where: { id },
    })

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    await prisma.task.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: "Task deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
