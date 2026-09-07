"use client"

import React, { useState } from "react"
import { X, Sparkles, ArrowRight, Check } from "lucide-react"
import { TaskFormData } from "@/components/AddEditTaskModal"
import { Category, Recurrence } from "@/lib/types"

interface OnboardingModalProps {
  onComplete: (data: TaskFormData) => Promise<void>
  onDismiss: () => void
}

export function OnboardingModal({ onComplete, onDismiss }: OnboardingModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    category: Category.PERSONAL,
    recurrence: Recurrence.DAILY,
    scheduledTime: "08:00 AM",
    startDate: new Date().toISOString().split("T")[0],
    emailReminderEnabled: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    setIsSubmitting(true)
    try {
      await onComplete(formData)
      onDismiss()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--card)] text-[var(--card-foreground)] rounded-2xl shadow-2xl border border-[var(--border)] max-w-md w-full overflow-hidden">

        {/* Progress dots */}
        <div className="flex items-center gap-2 px-6 pt-5">
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 1 ? "bg-[var(--primary)]" : "bg-[var(--muted)]"}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 2 ? "bg-[var(--primary)]" : "bg-[var(--muted)]"}`} />
        </div>

        {/* Step 1 — Welcome */}
        {step === 1 && (
          <div className="p-8 text-center space-y-5">
            <button
              onClick={onDismiss}
              className="absolute top-4 right-4 p-1 rounded-md text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--accent)] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[var(--primary)]" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight">Welcome to Serene Habit</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-2 leading-relaxed">
                Build habits that stick. Your Habit Matrix gives you a high-density
                view of your daily rhythms — streaks, patterns, and momentum at a glance.
              </p>
            </div>

            <div className="space-y-2 text-left">
              {[
                "Track habits daily, weekly, or monthly",
                "Visualize streaks with a GitHub-style heatmap",
                "Get email reminders so you never miss a day",
              ].map((tip) => (
                <div key={tip} className="flex items-start gap-2.5 text-sm text-[var(--foreground)]">
                  <Check className="w-4 h-4 text-[var(--primary)] mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Get started <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onDismiss}
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* Step 2 — Create first habit */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Create your first habit</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                What's one habit you want to build? Start small.
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5">
                Habit name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                autoFocus
                required
                placeholder="e.g. Morning meditation, Read 20 pages…"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
              />
            </div>

            {/* Category + Time row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value={Category.HEALTH}>🏃 Health</option>
                  <option value={Category.WORK}>💼 Work</option>
                  <option value={Category.LEARNING}>📚 Learning</option>
                  <option value={Category.PERSONAL}>✨ Personal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1.5">Reminder time</label>
                <input
                  type="text"
                  placeholder="08:00 AM"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-2">How often?</label>
              <div className="grid grid-cols-4 gap-2">
                {(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"] as Recurrence[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({ ...formData, recurrence: r })}
                    className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                      formData.recurrence === r
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                        : "bg-[var(--background)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.title.trim()}
                className="flex-1 py-2.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isSubmitting ? "Creating…" : "Create habit 🌱"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
