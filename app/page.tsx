export default function HomePage() {
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Serene Habit
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Phase 1 setup complete: Next.js App Router, Tailwind, TypeScript, Prisma & shadcn/ui.
          </p>
        </div>
      </div>
    </main>
  );
}
