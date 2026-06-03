import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  accent?: 'slate' | 'brass' | 'steel';
}

const accentStyles = {
  slate: {
    card: 'border-[#d9e2eb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,249,252,0.96)_100%)] shadow-[0_28px_60px_-42px_rgba(16,32,51,0.35)]',
    orb: 'bg-[#d9e6f2]',
    icon: 'bg-[#eef4f9] text-[#102033]',
    value: 'text-[#102033]',
    line: 'from-[#102033] via-[#183250] to-[#33557a]',
  },
  brass: {
    card: 'border-[#e2d4c0] bg-[linear-gradient(180deg,rgba(252,248,242,0.98)_0%,rgba(247,241,231,0.98)_100%)] shadow-[0_28px_60px_-42px_rgba(108,82,31,0.32)]',
    orb: 'bg-[#ebe0cc]',
    icon: 'bg-[#f4ecde] text-[#7b622f]',
    value: 'text-[#5c4925]',
    line: 'from-[#af8d52] via-[#c4a56a] to-[#ddc699]',
  },
  steel: {
    card: 'border-[#d8e1ec] bg-[linear-gradient(180deg,rgba(244,248,251,0.98)_0%,rgba(236,242,247,0.98)_100%)] shadow-[0_28px_60px_-42px_rgba(42,72,104,0.28)]',
    orb: 'bg-[#d5e1ec]',
    icon: 'bg-[#edf3f8] text-[#274464]',
    value: 'text-[#183250]',
    line: 'from-[#36597f] via-[#5e81a4] to-[#8ea8c1]',
  },
};

export function MetricCard({
  title,
  value,
  icon,
  description,
  accent = 'slate',
}: MetricCardProps) {
  const styles = accentStyles[accent];

  return (
    <Card className={`relative overflow-hidden rounded-[28px] ${styles.card}`}>
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${styles.line}`} />
      <div className={`absolute -right-8 top-4 h-24 w-24 rounded-full blur-3xl ${styles.orb}`} />
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              KPI
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {title}
            </p>
          </div>
          {icon && (
            <div className={`rounded-2xl border border-white/70 p-2.5 shadow-sm ${styles.icon}`}>
              {icon}
            </div>
          )}
        </div>
        <div className="mt-8">
          <h3 className={`font-display text-4xl font-semibold tracking-[-0.04em] ${styles.value}`}>
            {value}
          </h3>
          {description && (
            <p className="mt-3 max-w-[20rem] text-sm leading-6 text-slate-500">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
