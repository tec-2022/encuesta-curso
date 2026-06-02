import React from 'react';
import Link from 'next/link';
import { getResponses } from '@/lib/queries/responses';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { PrintButton } from './print-button';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    subject?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }>;
}

export default async function ImprimirRespuestasPage(props: PageProps) {
  const searchParams = await props.searchParams;

  const filters = {
    subject: searchParams.subject,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    search: searchParams.search,
  };

  const responses = await getResponses(filters);
  const printDate = formatDate(new Date().toISOString());

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 sm:p-10 space-y-6">
      
      {/* Back and Print Actions Panel */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
        <Link href="/admin/respuestas" passHref legacyBehavior>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Volver a respuestas
          </Button>
        </Link>
        
        <PrintButton />
      </div>

      {/* Report Header */}
      <div className="space-y-4 border-b-2 border-slate-950 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Reporte de recomendaciones para mejorar el curso
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div>
            <span className="font-bold text-slate-700">Fecha de generación:</span> {printDate}
          </div>
          <div>
            <span className="font-bold text-slate-700">Total de respuestas:</span> {responses.length}
          </div>
        </div>

        {/* Applied Filters Metadata */}
        {(filters.subject || filters.startDate || filters.endDate || filters.search) && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
            <p className="font-bold text-slate-700 uppercase tracking-wider mb-1">Filtros aplicados:</p>
            {filters.subject && filters.subject !== 'all' && (
              <p><span className="font-semibold text-slate-500">Materia:</span> {filters.subject}</p>
            )}
            {(filters.startDate || filters.endDate) && (
              <p>
                <span className="font-semibold text-slate-500">Rango de fechas:</span>{' '}
                {filters.startDate || 'Inicio'} al {filters.endDate || 'Presente'}
              </p>
            )}
            {filters.search && (
              <p><span className="font-semibold text-slate-500">Palabra clave:</span> &quot;{filters.search}&quot;</p>
            )}
          </div>
        )}
      </div>

      {/* Filtered responses list */}
      {responses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
          <AlertCircle className="w-10 h-10 text-slate-400" />
          <p className="text-sm font-bold text-slate-600">No se encontraron respuestas con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="space-y-8 divide-y divide-slate-200">
          {responses.map((res, index) => (
            <div key={res.id} className={`pt-6 ${index === 0 ? 'pt-0' : ''} space-y-4 break-inside-avoid`}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide">
                  Respuesta #{responses.length - index} — {res.subject}
                </h3>
                <span className="text-xs font-medium text-slate-400">
                  {formatDate(res.created_at)}
                </span>
              </div>

              {/* Helpful activities */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Actividades de ayuda:
                </span>
                <p className="text-sm text-slate-700">
                  {res.helpful_activities.map((act) => 
                    act === 'Otra' && res.other_activity ? `Otra (${res.other_activity})` : act
                  ).join(', ')}
                </p>
              </div>

              {/* Open feedback sections */}
              <div className="grid grid-cols-1 gap-3.5 pl-3 border-l-2 border-slate-100">
                {res.unclear_topic && (
                  <div className="text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Tema no claro:</span>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{res.unclear_topic}</p>
                  </div>
                )}
                {res.more_practical_topic && (
                  <div className="text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Tema práctico:</span>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{res.more_practical_topic}</p>
                  </div>
                )}
                {res.final_project_feedback && (
                  <div className="text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Sugerencia trabajo final:</span>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{res.final_project_feedback}</p>
                  </div>
                )}
                {res.keep_next_semester && (
                  <div className="text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Actividades para mantener:</span>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{res.keep_next_semester}</p>
                  </div>
                )}
                {res.improve_next_semester && (
                  <div className="text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Mejoras sugeridas para clases:</span>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{res.improve_next_semester}</p>
                  </div>
                )}
                {res.additional_comment && (
                  <div className="text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Comentario adicional:</span>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{res.additional_comment}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
