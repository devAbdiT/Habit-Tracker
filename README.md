# 🌿 Serene Habit Tracker

A modern, full-stack habit tracking application built with **Next.js 16**, **Prisma**, and **PostgreSQL**. Track your daily rhythms across multiple time views, visualize consistency patterns, and build lasting habits — with a clean matrix-style dashboard.

---

## ✨ Features

- **Habit Matrix Dashboard** — A high-density spreadsheet-style grid showing habit completion across Day, Week, Month, or Year views
- **Recurrence Engine** — Supports daily, weekly, monthly, and yearly habit schedules with lazy occurrence generation
- **Streak Tracking** — Calculates current and best streaks per habit, with today's pending status preserving active runs
- **Analytics Panel**
  - Monthly completion bar chart
  - Consistency score card with week-over-week delta
  - Category distribution donut chart
- **Status Cycling** — Each cell cycles through `PENDING → DONE → MISSED → SKIPPED` with optimistic UI updates
- **Category Tags** — Organize habits under `Health`, `Work`, `Learning`, or `Personal`
- **Email Reminders** — Optional per-habit email reminders via [Resend](https://resend.com), powered by a cron endpoint
- **Auth** — Credentials-based authentication using NextAuth v5 with a Prisma adapter and bcrypt password hashing
- **Onboarding Flow** — First-visit modal guides new users to create their first habit
- **Settings Page** — Manage email and push notification preferences
- **Dark Mode** — Full dark/light theme via CSS variables

---

## 🗂️ Project Structure

```
├── app/
│   ├── (auth)/               # Sign-in / register pages
│   ├── api/
│   │   ├── analytics/        # GET  – consistency score, time series, category distribution
│   │   ├── auth/             # NextAuth handler
│   │   ├── cron/             # POST – email reminder job (call from a cron service)
│   │   ├── occurrences/      # PATCH – update occurrence status / notes
│   │   ├── register/         # POST – create a new user account
│   │   ├── tasks/            # GET, POST, PATCH, DELETE – habit CRUD
│   │   └── user/             # GET, PATCH – user profile & settings
│   ├── settings/             # Settings page
│   ├── globals.css           # Design tokens & Tailwind base styles
│   ├── layout.tsx            # Root layout with Toaster
│   └── page.tsx              # Main dashboard (Habit Matrix)
├── components/
│   ├── AddEditTaskModal.tsx   # Create / edit habit modal
│   ├── CategoryDistributionChart.tsx
│   ├── ConsistencyScoreCard.tsx
│   ├── DashboardSkeleton.tsx
│   ├── EmptyState.tsx
│   ├── GranularityTabs.tsx   # Day / Week / Month / Year switcher
│   ├── HabitMatrixTable.tsx  # Core spreadsheet grid
│   ├── HeaderNav.tsx
│   ├── MonthlyCompletionChart.tsx
│   ├── OnboardingModal.tsx
│   ├── SettingsForm.tsx
│   ├── SparklineChart.tsx
│   ├── StreakHeatmap.tsx
│   └── TaskDetailModal.tsx
├── lib/
│   ├── email-template.ts     # HTML email template for reminders
│   ├── prisma.ts             # Singleton Prisma client
│   ├── recurrence.ts         # Recurrence logic & lazy occurrence generation
│   ├── streaks.ts            # Current / best streak calculation
│   ├── streaks.test.ts       # Vitest unit tests for streak logic
│   ├── types.ts              # Shared enums (Status, Category, Recurrence)
│   └── utils.ts              # cn() helper
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Demo seed data
├── auth.ts                   # NextAuth configuration (Edge-safe + full)
├── vitest.config.ts
└── .env.example
```

---

## 🧱 Data Model

| Model | Description |
|---|---|
| `User` | Account with hashed password, notification preferences |
| `Task` | A habit definition — title, category, recurrence, start/end date |
| `Occurrence` | One instance of a habit on a specific date — status, notes, reminder timestamp |
| `Account` / `Session` | NextAuth OAuth tables |
| `VerificationToken` | Email verification |

**Occurrence statuses:** `PENDING` · `DONE` · `MISSED` · `SKIPPED`

**Recurrence types:** `DAILY` · `WEEKLY` · `MONTHLY` · `YEARLY`

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20
- A PostgreSQL database (local, [Neon](https://neon.tech), or [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres))

### 1. Clone & Install

```bash
git clone https://github.com/your-username/habit-tracker.git
cd habit-tracker
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

```env
# PostgreSQL connection string
# Local:  postgresql://postgres:postgres@localhost:5432/habittracker
# Neon:   postgresql://username:password@ep-xxxxx.aws.neon.tech/neondb?sslmode=require
DATABASE_URL="postgresql://..."

# NextAuth secret — generate with:
# node -e "require('crypto').randomBytes(32).toString('hex')"
AUTH_SECRET="your-secret-here"

# Required in production (your Vercel deployment URL)
NEXTAUTH_URL="https://your-app.vercel.app"

# (Optional) Resend API key for email reminders
RESEND_API_KEY="re_..."
```

### 3. Set Up the Database

```bash
# Push schema to your database
npm run db:push

# (Optional) Seed with demo habits
npm run db:seed
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Generate Prisma client and build for production |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Sync Prisma schema to the database |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:seed` | Seed the database with demo data |

---

## 🧪 Testing

Unit tests for streak calculation logic are written with [Vitest](https://vitest.dev):

```bash
npx vitest run
```

---

## ☁️ Deployment (Vercel)

1. Push the repo to GitHub and import it on [Vercel](https://vercel.com).
2. Set the environment variables (`DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`) in the Vercel dashboard.
3. Deploy — Vercel runs `prisma generate && next build` automatically on each push.

### Email Reminders (Cron)

The `/api/cron` endpoint sends email reminders for habits with `emailReminderEnabled: true`. Point a cron service (e.g., Vercel Cron, GitHub Actions, or a standalone scheduler) to `POST /api/cron` on your desired schedule.

Set a `RESEND_API_KEY` environment variable to enable email delivery via [Resend](https://resend.com).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| Database | PostgreSQL via [Prisma ORM](https://prisma.io) |
| Auth | [NextAuth v5](https://authjs.dev) (Credentials + JWT) |
| Styling | Tailwind CSS v4 |
| Charts | [Recharts](https://recharts.org) |
| Email | [Resend](https://resend.com) |
| Toasts | [Sonner](https://sonner.emilkowal.ski) |
| Icons | [Lucide React](https://lucide.dev) |
| Testing | [Vitest](https://vitest.dev) |

---

## 📄 License

MIT

