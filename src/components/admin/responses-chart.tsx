'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResponsesChartProps {
  data: {
    subject: string;
    count: number;
  }[];
}

export function ResponsesChart({ data }: ResponsesChartProps) {
  const colors = ['#8E4D5E', '#C98F8F', '#D8B56D'];

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 12, right: 8, left: -24, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9B9B6" />
          <XAxis 
            dataKey="subject" 
            stroke="#B98E86" 
            fontSize={11}
            fontWeight={600}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#B98E86" 
            fontSize={11}
            fontWeight={600}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
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
          <Bar dataKey="count" radius={[16, 16, 4, 4]} maxBarSize={64}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
