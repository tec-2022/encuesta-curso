'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActivitiesChartProps {
  data: {
    activity: string;
    count: number;
  }[];
}

export function ActivitiesChart({ data }: ActivitiesChartProps) {
  // Sort activities by frequency descending
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="h-[400px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={sortedData}
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis 
            type="number" 
            stroke="#64748b" 
            fontSize={11}
            fontWeight={600}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis 
            type="category" 
            dataKey="activity" 
            stroke="#64748b" 
            fontSize={11}
            fontWeight={500}
            tickLine={false}
            axisLine={false}
            width={160}
            tickFormatter={(value) => {
              if (value.length > 25) {
                return `${value.substring(0, 22)}...`;
              }
              return value;
            }}
          />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px' }}
          />
          <Bar dataKey="count" fill="#1e3a8a" radius={[0, 4, 4, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
