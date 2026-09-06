import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"
import { getReminderEmailTemplate } from "@/lib/email-template"
import { Status } from "@prisma/client"

// Note: Email works reliably across all devices/browsers with no permission prompt needed, 
// making it a good default for users who skip or deny push permission.

const resend = new Resend(process.env.RESEND_API_KEY)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export async function GET(request: Request) {
  try {
    // Verify a cron secret if configured (for security)
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const today = new Date().toISOString().split("T")[0]
    
    // Find all occurrences for today that are pending and haven't had a reminder sent yet
    const pendingOccurrences = await prisma.occurrence.findMany({
      where: {
        date: today,
        status: Status.PENDING,
        lastReminderSentAt: null,
      },
      include: {
        task: {
          include: {
            user: true
          }
        }
      }
    })

    const emailsToSend = []
    const occurrencesToUpdate = []

    const now = new Date()

    for (const occurrence of pendingOccurrences) {
      const task = occurrence.task
      const user = task.user

      if (!user.email || !user.emailRemindersEnabled || !task.emailReminderEnabled || !task.scheduledTime) {
        continue
      }

      // Parse the scheduled time (e.g. "07:00 AM")
      const [time, modifier] = task.scheduledTime.split(" ")
      if (!time || !modifier) continue
      
      let [hours, minutes] = time.split(":").map(Number)
      if (hours === 12) hours = 0
      if (modifier.toUpperCase() === "PM") hours += 12

      // Create a Date object for today at the scheduled time
      const scheduledDate = new Date()
      scheduledDate.setHours(hours, minutes, 0, 0)

      // Only send if the current time is past the scheduled time
      if (now >= scheduledDate) {
        emailsToSend.push({
          from: "Habit Tracker <reminders@resend.dev>", // Replace with your verified domain
          to: user.email,
          subject: `Reminder: ${task.title}`,
          html: getReminderEmailTemplate(task.title, task.scheduledTime, APP_URL)
        })
        
        occurrencesToUpdate.push(occurrence.id)
      }
    }

    if (emailsToSend.length > 0) {
      // Send emails using Resend batch API (or map over individual sends)
      await resend.batch.send(emailsToSend)

      // Update occurrences to mark reminder as sent
      await prisma.occurrence.updateMany({
        where: { id: { in: occurrencesToUpdate } },
        data: { lastReminderSentAt: now }
      })
    }

    return NextResponse.json({ 
      success: true, 
      processed: emailsToSend.length,
      message: `Sent ${emailsToSend.length} email reminders.` 
    })
    
  } catch (error) {
    console.error("Error in check-reminders cron:", error)
    return NextResponse.json({ error: "Failed to process reminders" }, { status: 500 })
  }
}
