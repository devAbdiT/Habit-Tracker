"use client"

import React, { useState, useEffect } from "react"
import { HeaderNav } from "@/components/HeaderNav"
import { GranularityTabs, Granularity } from "@/components/GranularityTabs"
import { HabitMatrixTable, TaskWithOccurrences } from "@/components/HabitMatrixTable"
import { MonthlyCompletionChart } from "@/components/MonthlyCompletionChart"
import { ConsistencyScoreCard } from "@/components/ConsistencyScoreCard"
import { AddEditTaskModal, TaskFormData } from "@/components/AddEditTaskModal"
import { TaskDetailModal } from "@/components/TaskDetailModal"
import { Status, Category, Recurrence } from "@prisma/client"

export default function DashboardPage() {
  const [tasks, setTasks] = useState<TaskWithOccurrences[]>([])
  const [granularity, setGranularity] = useState<Granularity>("WEEK")
  const [activeViewNav, setActiveViewNav] = useState("Week")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskFormData | null>(null)
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<TaskWithOccurrences | null>(null)
  const [analyticsData, setAnalyticsData] = useState({
    consistencyScore: 82,
    scoreChange: "+5% this week",
    timeSeries: [
      { period: "W1", done: 12, missed: 3 },
      { period: "W2", done: 14, missed: 2 },
      { period: "W3", done: 10, missed: 5 },
      { period: "W4", done: 15, missed: 1 },
    ],
  })

  // Generate date columns for current week (Mon–Sun)
  const generateWeekColumns = () => {
    const today = new Date()
    const currentDay = today.getDay() // 0 = Sun, 1 = Mon...
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay

    const days = []
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    for (let i = 0; i < 7; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + mondayOffset + i)

      const key = d.toISOString().split("T")[0]
      const dateNum = d.getDate()
      
      // Ordinal suffix (12th, 13th...)
      const suffix =
        dateNum % 10 === 1 && dateNum !== 11
          ? "st"
          : dateNum % 10 === 2 && dateNum !== 12
          ? "nd"
          : dateNum % 10 === 3 && dateNum !== 13
          ? "rd"
          : "th"

      const isToday = key === today.toISOString().split("T")[0]

      days.push({
        key,
        dayLabel: dayNames[i],
        dateLabel: `${dateNum}${suffix}`,
        isToday,
      })
    }
    return days
  }

  const columns = generateWeekColumns()

  // Fetch tasks and analytics from API
  const fetchTasks = async () => {
    try {
      const start = columns[0].key
      const end = columns[columns.length - 1].key

      const res = await fetch(`/api/tasks?start=${start}&end=${end}`)
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      }
    } catch (err) {
      console.error("Error fetching tasks:", err)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics")
      if (res.ok) {
        const data = await res.json()
        setAnalyticsData({
          consistencyScore: data.consistencyScore,
          scoreChange: data.scoreChange,
          timeSeries: data.timeSeries,
        })
      }
    } catch (err) {
      console.error("Error fetching analytics:", err)
    }
  }

  useEffect(() => {
    fetchTasks()
    fetchAnalytics()
  }, [])

  // Toggle cell occurrence status
  const handleToggleStatus = async (
    occurrenceId: string,
    currentStatus: Status,
    taskId: string,
    dateStr: string
  ) => {
    const statusCycle: Record<Status, Status> = {
      [Status.PENDING]: Status.DONE,
      [Status.DONE]: Status.MISSED,
      [Status.MISSED]: Status.SKIPPED,
      [Status.SKIPPED]: Status.PENDING,
    }
    const nextStatus = statusCycle[currentStatus] || Status.DONE

    // Optimistic UI update
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id !== taskId) return t
        return {
          ...t,
          occurrences: t.occurrences.map((o) =>
            o.id === occurrenceId ? { ...o, status: nextStatus } : o
          ),
        }
      })
    )

    try {
      await fetch(`/api/occurrences/${occurrenceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
      fetchAnalytics()
    } catch (err) {
      console.error("Error updating occurrence:", err)
      fetchTasks()
    }
  }

  // Create or Update task
  const handleSaveTask = async (data: TaskFormData) => {
    if (editingTask && editingTask.id) {
      // Update
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        fetchTasks()
        fetchAnalytics()
      }
    } else {
      // Create
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        fetchTasks()
        fetchAnalytics()
      }
    }
    setEditingTask(null)
  }

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this habit?")) return

    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    try {
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" })
      fetchAnalytics()
    } catch (err) {
      console.error("Error deleting task:", err)
      fetchTasks()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans antialiased">
      {/* Header Bar */}
      <HeaderNav
        onAddHabitClick={() => {
          setEditingTask(null)
          setIsAddModalOpen(true)
        }}
        activeView={activeViewNav}
        onViewChange={(v) => {
          setActiveViewNav(v)
          if (v === "Today") setGranularity("DAY")
          else if (v === "Week") setGranularity("WEEK")
          else if (v === "Month") setGranularity("MONTH")
          else if (v === "Year") setGranularity("YEAR")
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Title Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
              Habit Matrix
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl mt-1 leading-relaxed">
              A high-density overview of your daily rhythms. Track consistency, identify patterns, and adjust your schedules for mindful growth.
            </p>
          </div>

          <GranularityTabs
            activeTab={granularity}
            onTabChange={(g) => setGranularity(g)}
          />
        </div>

        {/* Core Spreadsheet Habit Matrix Table */}
        <HabitMatrixTable
          tasks={tasks}
          columns={columns}
          onToggleStatus={handleToggleStatus}
          onEditTask={(task) => {
            setEditingTask({
              id: task.id,
              title: task.title,
              category: task.category || Category.PERSONAL,
              recurrence: task.recurrence || Recurrence.DAILY,
              scheduledTime: task.scheduledTime || "08:00 AM",
              startDate: new Date(task.startDate).toISOString().split("T")[0],
            })
            setIsAddModalOpen(true)
          }}
          onDeleteTask={handleDeleteTask}
        />

        {/* Analytics Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MonthlyCompletionChart data={analyticsData.timeSeries} />
          </div>
          <div>
            <ConsistencyScoreCard
              score={analyticsData.consistencyScore}
              scoreChange={analyticsData.scoreChange}
              onViewInsights={() => {
                if (tasks.length > 0) setSelectedTaskForDetail(tasks[0])
              }}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddEditTaskModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingTask(null)
        }}
        onSubmit={handleSaveTask}
        initialData={editingTask}
      />

      <TaskDetailModal
        task={selectedTaskForDetail}
        isOpen={Boolean(selectedTaskForDetail)}
        onClose={() => setSelectedTaskForDetail(null)}
      />

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--card)] py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--muted-foreground)] gap-4">
          <div>© 2024 Serene Habit. Stay Mindful.</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">
              Settings
            </a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
