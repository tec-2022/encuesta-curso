import React from 'react';
import { getResponses } from '@/lib/queries/responses';
import { AdminHeader } from '@/components/admin/admin-header';
import { ResponseFilters } from '@/components/admin/response-filters';
import { ResponseCard } from '@/components/admin/response-card';
import { AlertCircle } from 'lucide-react';

export const revalidate = 0; // Disable caching for active updates

interface PageProps {
  searchParams: Promise<{
    subject?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }>;
}

export default async function RespuestasPage(props: PageProps) {
  const searchParams = await props.searchParams;
  
  const filters = {
    subject: searchParams.subject,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    search: searchParams.search,
  };

  const responses = await getResponses(filters);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AdminHeader />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Page Title */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
            Respuestas recibidas
          </h1>
          <p className="text-slate-500 text-sm">
            Listado completo de las respuestas de los estudiantes organizadas por fecha de envío.
          </p>
        </div>

        {/* Filters Panel */}
        <ResponseFilters key={JSON.stringify(filters)} />

        {/* Responses Container */}
        {responses.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300" />
            <h2 className="text-lg font-bold text-slate-700">
              No se encontraron respuestas con los filtros seleccionados.
            </h2>
            <p className="text-sm text-slate-400 max-w-sm">
              Intenta cambiar los parámetros de búsqueda o limpiar los filtros activos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {responses.map((response) => (
              <ResponseCard key={response.id} response={response} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
