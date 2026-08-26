"use client"

import React from "react"
import { LineChart, Line, ResponsiveContainer } from "recharts"

interface SparklinePoint {
  date: string
  value: number
}

interface SparklineChartProps {
  data: SparklinePoint[]
  color: string
}

export function SparklineChart({ data, color }: SparklineChartProps) {
  // If data is empty or single point, fallback to sample trend line
  const chartPoints =
    data && data.length > 1
      ? data
      : [
          { date: "1", value: 0.2 },
          { date: "2", value: 0.5 },
          { date: "3", value: 0.7 },
          { date: "4", value: 0.6 },
          { date: "5", value: 0.9 },
          { date: "6", value: 0.85 },
        ]

  return (
    <div className="w-14 h-6 inline-block align-middle cursor-pointer">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartPoints} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
