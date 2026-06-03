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
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="h-[380px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={sortedData}
          margin={{ top: 8, right: 18, left: 12, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E9B9B6" />
          <XAxis 
            type="number" 
            stroke="#B98E86" 
            fontSize={11}
            fontWeight={600}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis 
            type="category" 
            dataKey="activity" 
            stroke="#B98E86" 
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
            cursor={{ fill: 'rgba(16, 32, 51, 0.08)' }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              border: '1px solid rgba(184, 202, 222, 0.9)',
              borderRadius: '16px',
              boxShadow: '0 18px 40px -28px rgba(16, 32, 51, 0.45)',
            }}
          />
          <Bar dataKey="count" fill="#8E4D5E" radius={[0, 14, 14, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
