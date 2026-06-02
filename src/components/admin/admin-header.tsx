'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/lib/actions/logout';
import { Button } from '@/components/ui/button';
import { Award, LogOut, BarChart3, MessageSquare } from 'lucide-react';

export function AdminHeader() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800 text-sm sm:text-base hidden sm:inline">
              Recomendaciones Docente
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-1 sm:space-x-4">
            <Link
              href="/admin/dashboard"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/admin/dashboard')
                  ? 'bg-blue-50 text-blue-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Panel</span>
            </Link>
            <Link
              href="/admin/respuestas"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/admin/respuestas')
                  ? 'bg-blue-50 text-blue-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Respuestas</span>
            </Link>
          </nav>

          {/* Logout Action */}
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
