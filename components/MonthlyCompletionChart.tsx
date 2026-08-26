"use client"

import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts"

interface ChartDataPoint {
  period: string
  done: number
  missed: number
}

interface MonthlyCompletionChartProps {
  data: ChartDataPoint[]
}

export function MonthlyCompletionChart({ data }: MonthlyCompletionChartProps) {
  return (
    <div className="bg-[var(--card)] text-[var(--card-foreground)] rounded-xl p-5 border border-[var(--border)] shadow-xs flex flex-col justify-between h-[320px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base tracking-tight">Monthly Completion Rate</h3>
          <p className="text-xs text-[var(--muted-foreground)]">
            Distribution of completed vs missed habit occurrences per week
          </p>
        </div>
      </div>

      <div className="w-full flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--foreground)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
            />
            <Bar
              dataKey="done"
              name="Done"
              fill="var(--status-done)"
              stackId="a"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="missed"
              name="Missed"
              fill="var(--status-missed)"
              stackId="a"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
