import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
}

export function MetricCard({ title, value, icon, description }: MetricCardProps) {
  return (
    <Card className="shadow-sm border border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          {icon && <div className="text-blue-900 bg-blue-50 p-2 rounded-lg">{icon}</div>}
        </div>
        <div className="mt-2.5">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
          {description && (
            <p className="mt-1 text-xs text-slate-400 font-medium leading-none">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
