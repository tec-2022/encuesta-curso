import React from 'react';
import { getResponses } from '@/lib/queries/responses';
import { AdminHeader } from '@/components/admin/admin-header';
import { ResponseFilters } from '@/components/admin/response-filters';
import { ResponseCard } from '@/components/admin/response-card';
import { AlertCircle, Calendar, FileText, MessageSquareText, SearchCheck } from 'lucide-react';

export const revalidate = 0;

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
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const textResponsesCount = responses.filter((response) =>
    [
      response.unclear_topic,
      response.more_practical_topic,
      response.final_project_feedback,
      response.keep_next_semester,
      response.improve_next_semester,
      response.additional_comment,
    ].some((field) => field && field.trim() !== '')
  ).length;
  const textResponsesRate =
    responses.length > 0 ? Math.round((textResponsesCount / responses.length) * 100) : 0;
  const averageActivitiesSelected =
    responses.length > 0
      ? (
          responses.reduce((sum, response) => sum + response.helpful_activities.length, 0) /
          responses.length
        ).toFixed(1)
      : '0.0';
  const latestResponseDate = responses[0]?.created_at
    ? new Date(responses[0].created_at).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Sin registros';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#FFF7F1_0%,#FFF7F1_36%,#FFF7F1_100%)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-5rem] top-24 h-56 w-56 rounded-full bg-[#E9B9B6]/65 blur-3xl" />
        <div className="absolute right-[-3rem] top-52 h-52 w-52 rounded-full bg-[#D9A5A0] blur-3xl" />
      </div>
      <AdminHeader />

      <main className="mx-auto flex-grow max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,247,241,0.88)_0%,rgba(255,247,241,0.92)_100%)] p-6 shadow-[0_34px_90px_-56px_rgba(142,77,94,0.45)] sm:p-8">
          <div className="absolute -right-14 top-0 h-44 w-44 rounded-full bg-[#E9B9B6]/70 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-[#D8B56D]/70 blur-3xl" />
          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E9B9B6] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C98F8F]">
                <MessageSquareText className="h-3.5 w-3.5 text-[#D8B56D]" />
                Centro de reportes
              </span>
              <div className="space-y-2">
                <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] text-[#8E4D5E] sm:text-5xl">
                  Reportes y respuestas con mejor lectura analítica
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Filtra comentarios, prepara cortes listos para PDF y detecta patrones sin perder tiempo recorriendo tarjetas genéricas.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[22rem]">
              <div className="rounded-[24px] border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Resultados visibles
                </p>
                <p className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] text-[#8E4D5E]">
                  {responses.length}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Filtros activos</span>
                </div>
                <p className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] text-[#8E4D5E]">
                  {activeFiltersCount}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-[#E9B9B6] bg-white/82 p-5 shadow-[0_24px_70px_-52px_rgba(142,77,94,0.45)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF7F1] text-[#8E4D5E]">
                <SearchCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#8E4D5E]">Comentarios utilizables</p>
                <p className="text-sm text-slate-500">{textResponsesRate}% del corte actual</p>
              </div>
            </div>
          </div>
          <div className="rounded-[28px] border border-[#D8B56D] bg-[#FFF7F1] p-5 shadow-[0_24px_70px_-52px_rgba(201,166,90,0.32)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF7F1] text-[#C9A65A]">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#8E4D5E]">Promedio de actividades</p>
                <p className="text-sm text-slate-500">{averageActivitiesSelected} marcadas por respuesta</p>
              </div>
            </div>
          </div>
          <div className="rounded-[28px] border border-[#E9B9B6] bg-white/82 p-5 shadow-[0_24px_70px_-52px_rgba(142,77,94,0.45)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF7F1] text-[#8E4D5E]">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#8E4D5E]">Ultimo registro visible</p>
                <p className="text-sm text-slate-500">{latestResponseDate}</p>
              </div>
            </div>
          </div>
        </section>

        <ResponseFilters key={JSON.stringify(filters)} />

        {responses.length === 0 ? (
          <div className="rounded-[28px] border border-white/80 bg-white/78 p-12 text-center shadow-[0_28px_70px_-44px_rgba(142,77,94,0.45)]">
            <AlertCircle className="mx-auto h-12 w-12 text-slate-300" />
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-[-0.04em] text-[#8E4D5E]">
              No se encontraron respuestas con los filtros seleccionados
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Intenta abrir el rango de fechas, cambiar la materia o limpiar la búsqueda para recuperar un corte más amplio.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {responses.map((response) => (
              <ResponseCard key={response.id} response={response} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
