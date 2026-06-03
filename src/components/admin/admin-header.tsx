'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/lib/actions/logout';
import { Button } from '@/components/ui/button';
import { Award, BarChart3, LogOut, MessageSquare, ShieldCheck } from 'lucide-react';

export function AdminHeader() {
  const pathname = usePathname();
  const navItems = [
    {
      href: '/admin/dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      active: pathname === '/admin/dashboard',
    },
    {
      href: '/admin/respuestas',
      label: 'Reportes',
      icon: MessageSquare,
      active: pathname.startsWith('/admin/respuestas'),
    },
  ];
  const currentSection = pathname.startsWith('/admin/respuestas') ? 'Reportes y respuestas' : 'Dashboard ejecutivo';

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-[rgba(255,247,241,0.82)] backdrop-blur-xl print:hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D8B56D] to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[20px] border border-white/70 bg-[rgba(255,255,255,0.8)] text-[#8E4D5E] shadow-[0_20px_36px_-28px_rgba(142,77,94,0.5)]">
              <Award className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B98E86]">
                Panel académico
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-xl font-semibold tracking-[-0.04em] text-[#8E4D5E]">
                  Recomendaciones Docente
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#E9B9B6] bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[#C98F8F]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#D8B56D]" />
                  {currentSection}
                </span>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2 rounded-full border border-white/70 bg-white/80 p-1.5 shadow-[0_16px_28px_-24px_rgba(142,77,94,0.45)] backdrop-blur">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    item.active
                      ? 'bg-[#8E4D5E] text-white shadow-[0_18px_28px_-20px_rgba(142,77,94,0.7)]'
                      : 'text-slate-600 hover:bg-[#FFF7F1] hover:text-[#8E4D5E]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <form action={logout}>
            <Button
              variant="ghost"
              size="sm"
              type="submit"
              className="rounded-full border border-transparent px-4 text-slate-600 hover:border-[#D9A5A0] hover:bg-white hover:text-[#8E4D5E]"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
