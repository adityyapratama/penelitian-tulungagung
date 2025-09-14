"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "Puzzle", total: Math.floor(Math.random() * 100) + 20 },
  { name: "Kuis", total: Math.floor(Math.random() * 100) + 20 },
  { name: "Cerita", total: Math.floor(Math.random() * 100) + 20 },
  { name: "Artikel", total: Math.floor(Math.random() * 100) + 20 },
];

export function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          cursor={{ fill: 'hsl(var(--muted))' }}
          contentStyle={{ 
            background: 'hsl(var(--background))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)'
          }}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}