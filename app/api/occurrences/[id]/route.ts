import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Status } from "@prisma/client"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, notes } = body

    if (!status || !Object.values(Status).includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${Object.values(Status).join(", ")}` },
        { status: 400 }
      )
    }

    const existingOccurrence = await prisma.occurrence.findUnique({
      where: { id },
    })

    if (!existingOccurrence) {
      return NextResponse.json({ error: "Occurrence not found" }, { status: 404 })
    }

    const updatedOccurrence = await prisma.occurrence.update({
      where: { id },
      data: {
        status: status as Status,
        ...(notes !== undefined && { notes }),
        completedAt: status === Status.DONE ? new Date() : null,
      },
    })

    return NextResponse.json(updatedOccurrence)
  } catch (error) {
    console.error("PATCH /api/occurrences/[id] error:", error)
    return NextResponse.json({ error: "Failed to update occurrence" }, { status: 500 })
  }
}
