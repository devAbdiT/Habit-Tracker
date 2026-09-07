"use client"

import React from "react"

interface EmptyStateProps {
  onAddTask: () => void
}

export function EmptyState({ onAddTask }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* SVG Illustration — seedling growing from soil */}
      <div className="mb-8 opacity-80">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Ground */}
          <ellipse cx="60" cy="98" rx="38" ry="8" fill="var(--accent)" />
          {/* Stem */}
          <path
            d="M60 96 C60 80 60 64 60 50"
            stroke="var(--primary)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Left leaf */}
          <path
            d="M60 68 C48 60 36 62 34 72 C44 78 56 72 60 68Z"
            fill="var(--primary)"
            opacity="0.7"
          />
          {/* Right leaf */}
          <path
            d="M60 58 C72 48 86 50 86 60 C76 68 62 62 60 58Z"
            fill="var(--primary)"
          />
          {/* Small top sprout */}
          <path
            d="M60 50 C60 44 56 38 52 36"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Sparkle dots */}
          <circle cx="88" cy="36" r="3" fill="var(--status-skipped)" opacity="0.8" />
          <circle cx="30" cy="44" r="2" fill="var(--primary)" opacity="0.5" />
          <circle cx="95" cy="55" r="2" fill="var(--status-done)" opacity="0.6" />
          <circle cx="24" cy="62" r="3" fill="var(--status-skipped)" opacity="0.4" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)] mb-3">
        No habits yet — let&apos;s build one!
      </h2>
      <p className="text-sm text-[var(--muted-foreground)] max-w-xs leading-relaxed mb-8">
        Habits are the compound interest of self-improvement. Start small, stay
        consistent, and watch the streak grow.
      </p>

      <button
        onClick={onAddTask}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold text-sm shadow-md hover:opacity-90 active:scale-[0.98] transition-all duration-150"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add your first habit
      </button>
    </div>
  )
}
