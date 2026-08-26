import { PrismaClient } from "@prisma/client"
import { Category, Recurrence, Status } from "../lib/types"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding Habit Tracker initial database data...")

  // Clear existing data
  await prisma.occurrence.deleteMany()
  await prisma.task.deleteMany()

  // Create Tasks based on reference UI
  const task1 = await prisma.task.create({
    data: {
      userId: "default-user",
      title: "Morning Meditation",
      category: Category.HEALTH,
      recurrence: Recurrence.DAILY,
      scheduledTime: "07:00 AM",
    },
  })

  const task2 = await prisma.task.create({
    data: {
      userId: "default-user",
      title: "Deep Work Block",
      category: Category.WORK,
      recurrence: Recurrence.DAILY,
      scheduledTime: "09:00 AM",
    },
  })

  const task3 = await prisma.task.create({
    data: {
      userId: "default-user",
      title: "Read 20 Pages",
      category: Category.LEARNING,
      recurrence: Recurrence.DAILY,
      scheduledTime: "08:00 PM",
    },
  })

  const task4 = await prisma.task.create({
    data: {
      userId: "default-user",
      title: "Evening Yoga & Mobility",
      category: Category.PERSONAL,
      recurrence: Recurrence.DAILY,
      scheduledTime: "09:30 PM",
    },
  })

  // Generate date strings for current week (Mon to Sun)
  const today = new Date()
  const currentDayOfWeek = today.getDay() // 0 = Sun, 1 = Mon, ...
  const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek
  
  const dates: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + mondayOffset + i)
    dates.push(d.toISOString().split("T")[0])
  }

  // Seed sample occurrences according to reference UI patterns
  const occurrencesData = [
    // Task 1: Morning Meditation (high completion rate: ~85%)
    { taskId: task1.id, date: dates[0], status: Status.DONE, completedAt: new Date() },
    { taskId: task1.id, date: dates[1], status: Status.DONE, completedAt: new Date() },
    { taskId: task1.id, date: dates[2], status: Status.MISSED, completedAt: null },
    { taskId: task1.id, date: dates[3], status: Status.DONE, completedAt: new Date() },
    { taskId: task1.id, date: dates[4], status: Status.DONE, completedAt: new Date() },
    { taskId: task1.id, date: dates[5], status: Status.PENDING, completedAt: null },

    // Task 2: Deep Work Block (high completion rate: ~92%)
    { taskId: task2.id, date: dates[0], status: Status.DONE, completedAt: new Date() },
    { taskId: task2.id, date: dates[1], status: Status.DONE, completedAt: new Date() },
    { taskId: task2.id, date: dates[2], status: Status.DONE, completedAt: new Date() },
    { taskId: task2.id, date: dates[3], status: Status.DONE, completedAt: new Date() },
    { taskId: task2.id, date: dates[4], status: Status.DONE, completedAt: new Date() },
    { taskId: task2.id, date: dates[5], status: Status.DONE, completedAt: new Date() },

    // Task 3: Read 20 Pages (moderate completion rate: ~45%)
    { taskId: task3.id, date: dates[0], status: Status.DONE, completedAt: new Date() },
    { taskId: task3.id, date: dates[1], status: Status.MISSED, completedAt: null },
    { taskId: task3.id, date: dates[2], status: Status.MISSED, completedAt: null },
    { taskId: task3.id, date: dates[3], status: Status.DONE, completedAt: new Date() },
    { taskId: task3.id, date: dates[4], status: Status.DONE, completedAt: new Date() },
    { taskId: task3.id, date: dates[5], status: Status.PENDING, completedAt: null },

    // Task 4: Evening Yoga
    { taskId: task4.id, date: dates[0], status: Status.DONE, completedAt: new Date() },
    { taskId: task4.id, date: dates[1], status: Status.SKIPPED, completedAt: null },
    { taskId: task4.id, date: dates[2], status: Status.DONE, completedAt: new Date() },
    { taskId: task4.id, date: dates[3], status: Status.DONE, completedAt: new Date() },
    { taskId: task4.id, date: dates[4], status: Status.DONE, completedAt: new Date() },
    { taskId: task4.id, date: dates[5], status: Status.PENDING, completedAt: null },
  ]

  for (const occ of occurrencesData) {
    await prisma.occurrence.create({ data: occ })
  }

  console.log("Seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
