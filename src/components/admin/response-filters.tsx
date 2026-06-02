'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SUBJECT_OPTIONS } from '@/lib/validations/survey-schema';
import { Search, Filter, RefreshCw, Download, Printer } from 'lucide-react';

export function ResponseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [subject, setSubject] = useState(searchParams.get('subject') || 'all');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const handleApply = () => {
    const params = new URLSearchParams();
    if (subject && subject !== 'all') params.set('subject', subject);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (search.trim()) params.set('search', search.trim());

    router.push(`/admin/respuestas?${params.toString()}`);
  };

  const handleClear = () => {
    setSubject('all');
    setStartDate('');
    setEndDate('');
    setSearch('');
    router.push('/admin/respuestas');
  };

  const getFilteredQueryString = () => {
    const params = new URLSearchParams();
    if (subject && subject !== 'all') params.set('subject', subject);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (search.trim()) params.set('search', search.trim());
    return params.toString();
  };

  const handleExport = () => {
    const query = getFilteredQueryString();
    window.open(`/api/admin/export/csv${query ? `?${query}` : ''}`, '_blank');
  };

  const handlePrint = () => {
    const query = getFilteredQueryString();
    router.push(`/admin/respuestas/imprimir${query ? `?${query}` : ''}`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 print:hidden">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Filter className="w-4 h-4 text-blue-900" />
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
          Filtros de búsqueda
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Subject Filter */}
        <div className="space-y-1.5">
          <Label htmlFor="filter-subject">Materia</Label>
          <select
            id="filter-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900"
          >
            <option value="all">Todas las materias</option>
            {SUBJECT_OPTIONS.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="space-y-1.5">
          <Label htmlFor="filter-start-date">Fecha inicial</Label>
          <Input
            id="filter-start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* End Date */}
        <div className="space-y-1.5">
          <Label htmlFor="filter-end-date">Fecha final</Label>
          <Input
            id="filter-end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Comment Search */}
        <div className="space-y-1.5">
          <Label htmlFor="filter-search">Buscar en comentarios</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="filter-search"
              placeholder="Escribe una palabra clave"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Button onClick={handleApply} className="flex items-center gap-1.5 cursor-pointer">
            Aplicar filtros
          </Button>
          <Button variant="outline" onClick={handleClear} className="flex items-center gap-1.5 cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
            Limpiar filtros
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport} className="flex items-center gap-1.5 text-slate-700 cursor-pointer">
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-1.5 text-slate-700 cursor-pointer">
            <Printer className="w-4 h-4" />
            Imprimir / Guardar como PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
