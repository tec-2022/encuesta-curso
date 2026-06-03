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
    card: 'border-[#E9B9B6] bg-[linear-gradient(180deg,rgba(255,247,241,0.96)_0%,rgba(255,247,241,0.96)_100%)] shadow-[0_28px_60px_-42px_rgba(142,77,94,0.35)]',
    orb: 'bg-[#E9B9B6]',
    icon: 'bg-[#FFF7F1] text-[#8E4D5E]',
    value: 'text-[#8E4D5E]',
    line: 'from-[#8E4D5E] via-[#C98F8F] to-[#D9A5A0]',
  },
  brass: {
    card: 'border-[#D8B56D] bg-[linear-gradient(180deg,rgba(255,247,241,0.98)_0%,rgba(255,247,241,0.9)_100%)] shadow-[0_28px_60px_-42px_rgba(201,166,90,0.32)]',
    orb: 'bg-[#FFF7F1]',
    icon: 'bg-[#FFF7F1] text-[#C9A65A]',
    value: 'text-[#8E4D5E]',
    line: 'from-[#D8B56D] via-[#C9A65A] to-[#D8B56D]',
  },
  steel: {
    card: 'border-[#E9B9B6] bg-[linear-gradient(180deg,rgba(255,247,241,0.98)_0%,rgba(255,247,241,0.92)_100%)] shadow-[0_28px_60px_-42px_rgba(201,143,143,0.28)]',
    orb: 'bg-[#E9B9B6]',
    icon: 'bg-[#FFF7F1] text-[#C98F8F]',
    value: 'text-[#C98F8F]',
    line: 'from-[#8E4D5E] via-[#D9A5A0] to-[#E9B9B6]',
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
