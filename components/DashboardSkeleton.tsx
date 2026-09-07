"use client"

export function DashboardSkeleton() {
  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8 animate-pulse">
      {/* Title row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-lg bg-[var(--muted)]" />
          <div className="h-4 w-80 rounded-md bg-[var(--muted)]" />
        </div>
        <div className="h-9 w-56 rounded-lg bg-[var(--muted)]" />
      </div>

      {/* Analytics row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 h-44 rounded-xl bg-[var(--muted)]" />
        <div className="lg:col-span-1 h-44 rounded-xl bg-[var(--muted)]" />
        <div className="lg:col-span-1 h-44 rounded-xl bg-[var(--muted)]" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        {/* Table header */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-[var(--border)]">
          <div className="h-5 w-40 rounded bg-[var(--muted)]" />
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 h-5 rounded bg-[var(--muted)]" />
          ))}
          <div className="h-5 w-24 rounded bg-[var(--muted)]" />
        </div>
        {/* Table rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-4 border-b border-[var(--border)] last:border-0"
          >
            <div className="flex items-center gap-3 w-40 shrink-0">
              <div className="w-8 h-8 rounded-full bg-[var(--muted)]" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-24 rounded bg-[var(--muted)]" />
                <div className="h-2.5 w-16 rounded bg-[var(--muted)]" />
              </div>
            </div>
            {Array.from({ length: 7 }).map((_, j) => (
              <div key={j} className="flex-1 flex justify-center">
                <div className="w-7 h-7 rounded-full bg-[var(--muted)]" />
              </div>
            ))}
            <div className="w-24 h-7 rounded-full bg-[var(--muted)]" />
          </div>
        ))}
      </div>
    </div>
  )
}
