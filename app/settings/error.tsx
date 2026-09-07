"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function SettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-6">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Couldn&apos;t load settings</h1>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            Your settings couldn&apos;t be loaded right now. Please try again.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <a href="/" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            ← Back to dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
