"use client"

import React, { useState, useEffect } from "react"
import { Category, Recurrence } from "@prisma/client"
import { X, Calendar, Clock, Tag, RefreshCw } from "lucide-react"

export interface TaskFormData {
  id?: string
  title: string
  category: Category | ""
  recurrence: Recurrence
  scheduledTime: string
  startDate: string
}

interface AddEditTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TaskFormData) => Promise<void>
  initialData?: TaskFormData | null
}

export function AddEditTaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddEditTaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    category: Category.PERSONAL,
    recurrence: Recurrence.DAILY,
    scheduledTime: "08:00 AM",
    startDate: new Date().toISOString().split("T")[0],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        title: "",
        category: Category.PERSONAL,
        recurrence: Recurrence.DAILY,
        scheduledTime: "08:00 AM",
        startDate: new Date().toISOString().split("T")[0],
      })
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error("Error submitting task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-[var(--card)] text-[var(--card-foreground)] rounded-xl shadow-xl border border-[var(--border)] max-w-md w-full p-6 space-y-5">
        <div className="flex items-center justify-between border-b pb-3 border-[var(--border)]">
          <h2 className="text-lg font-semibold tracking-tight">
            {initialData ? "Edit Habit" : "Add New Habit"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
              Habit Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Morning Meditation, Read 20 Pages"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as Category })
                }
                className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value={Category.HEALTH}>Health</option>
                <option value={Category.WORK}>Work</option>
                <option value={Category.LEARNING}>Learning</option>
                <option value={Category.PERSONAL}>Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1 flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Frequency
              </label>
              <select
                value={formData.recurrence}
                onChange={(e) =>
                  setFormData({ ...formData, recurrence: e.target.value as Recurrence })
                }
                className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value={Recurrence.DAILY}>Daily</option>
                <option value={Recurrence.WEEKLY}>Weekly</option>
                <option value={Recurrence.MONTHLY}>Monthly</option>
                <option value={Recurrence.YEARLY}>Yearly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Time
              </label>
              <input
                type="text"
                placeholder="e.g. 07:00 AM"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Start Date
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-md border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : initialData ? "Update Habit" : "Create Habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
