import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { SettingsForm } from "@/components/SettingsForm"
import { HeaderNav } from "@/components/HeaderNav"

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/signin")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      emailRemindersEnabled: true,
      pushNotificationsEnabled: true
    }
  })

  if (!user) {
    redirect("/signin")
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <HeaderNav />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>
        
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-xs">
          <h2 className="text-xl font-semibold mb-6">Notifications</h2>
          <SettingsForm initialData={user} />
        </div>
      </main>
    </div>
  )
}
