import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Status } from "@prisma/client"

export async function GET(request: Request) {
  try {
    // Verify a cron secret if configured (for security)
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0]
    
    // Find and update all pending occurrences for today or earlier
    const result = await prisma.occurrence.updateMany({
      where: {
        status: Status.PENDING,
        date: {
          lte: today // Less than or equal to today's date string
        }
      },
      data: {
        status: Status.MISSED
      }
    })

    return NextResponse.json({ 
      success: true, 
      processed: result.count,
      message: `Automatically marked ${result.count} pending habits as missed.` 
    })
    
  } catch (error) {
    console.error("Error in auto-fail cron:", error)
    return NextResponse.json({ error: "Failed to process auto-fail" }, { status: 500 })
  }
}
