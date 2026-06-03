'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SUBJECT_OPTIONS } from '@/lib/validations/survey-schema';
import { Download, Filter, Printer, RefreshCw, Search } from 'lucide-react';

export function ResponseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [subject, setSubject] = useState(searchParams.get('subject') || 'all');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const activeFilterCount = [subject !== 'all', Boolean(startDate), Boolean(endDate), Boolean(search.trim())]
    .filter(Boolean).length;

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
    <div className="rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(247,250,252,0.9)_100%)] p-5 shadow-[0_30px_90px_-56px_rgba(16,32,51,0.45)] backdrop-blur print:hidden sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e6ebf1] pb-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf3f8] text-[#102033] shadow-sm">
            <Filter className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#102033]">
              Filtros y salida
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
              Construye cortes limpios por materia, fecha o palabra clave y después expórtalos o llévalos a un PDF con mejor presentación.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[#d8e1ec] bg-white/80 px-3 py-1 text-xs font-semibold text-[#183250]">
            {activeFilterCount === 0
              ? 'Sin filtros activos'
              : `${activeFilterCount} filtro${activeFilterCount > 1 ? 's' : ''} activo${activeFilterCount > 1 ? 's' : ''}`}
          </span>
          <span className="rounded-full border border-[#e2d4c0] bg-[#fbf8f2] px-3 py-1 text-xs font-semibold text-[#7b622f]">
            Salida lista para CSV o PDF
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="filter-subject">Materia</Label>
          <select
            id="filter-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex h-12 w-full rounded-2xl border border-[#d8e1ec] bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[#6d8195] focus:ring-2 focus:ring-[#d8e6f2]"
          >
            <option value="all">Todas las materias</option>
            {SUBJECT_OPTIONS.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-start-date">Fecha inicial</Label>
          <Input
            id="filter-start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-12 rounded-2xl border-[#d8e1ec] bg-white shadow-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-end-date">Fecha final</Label>
          <Input
            id="filter-end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-12 rounded-2xl border-[#d8e1ec] bg-white shadow-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-search">Buscar en comentarios</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              id="filter-search"
              placeholder="Tema, frase o palabra clave"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 rounded-2xl border-[#d8e1ec] bg-white pl-9 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#e6ebf1] pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleApply} className="h-11 rounded-full bg-[#102033] px-5 hover:bg-[#183250]">
            Aplicar filtros
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            className="h-11 rounded-full border-[#d8e1ec] bg-white px-5 text-slate-700"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Limpiar filtros
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            className="h-11 rounded-full border-[#e2d4c0] bg-[#fbf8f2] px-5 text-[#5c4925] hover:bg-[#f6efe4]"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
            className="h-11 rounded-full border-[#d8e1ec] bg-white px-5 text-[#102033] hover:bg-[#edf3f8]"
          >
            <Printer className="h-4 w-4" />
            Guardar o imprimir
          </Button>
        </div>
      </div>
    </div>
  );
}
