import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { emailRemindersEnabled, pushNotificationsEnabled } = data

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        emailRemindersEnabled: emailRemindersEnabled ?? true,
        pushNotificationsEnabled: pushNotificationsEnabled ?? true,
      }
    })

    return NextResponse.json({ 
      success: true, 
      user: {
        emailRemindersEnabled: user.emailRemindersEnabled,
        pushNotificationsEnabled: user.pushNotificationsEnabled
      }
    })
  } catch (error) {
    console.error("Error updating user settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
