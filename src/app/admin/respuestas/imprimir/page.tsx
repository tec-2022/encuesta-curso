import React from 'react';
import Link from 'next/link';
import { getResponses } from '@/lib/queries/responses';
import { formatDate } from '@/lib/utils';
import { SUBJECT_OPTIONS } from '@/lib/validations/survey-schema';
import { AlertCircle, ArrowLeft, Calendar, FileText, Filter, Sparkles } from 'lucide-react';
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

const feedbackFields = [
  { key: 'unclear_topic', label: 'Tema no claro' },
  { key: 'more_practical_topic', label: 'Tema para trabajar más en práctica' },
  { key: 'final_project_feedback', label: 'Sugerencia para el trabajo final' },
  { key: 'keep_next_semester', label: 'Actividad o dinámica para mantener' },
  { key: 'improve_next_semester', label: 'Mejoras sugeridas para las clases' },
  { key: 'additional_comment', label: 'Comentario adicional' },
] as const;

type FeedbackFieldKey = (typeof feedbackFields)[number]['key'];

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

  const subjectEntries = SUBJECT_OPTIONS.map((subject) => {
    const count = responses.filter((response) => response.subject === subject).length;
    const share = responses.length > 0 ? Math.round((count / responses.length) * 100) : 0;
    return { subject, count, share };
  }).filter((entry) => entry.count > 0);

  const activityCounts = responses.reduce<Record<string, number>>((acc, response) => {
    response.helpful_activities.forEach((activity) => {
      const label = activity === 'Otra' && response.other_activity ? `Otra: ${response.other_activity}` : activity;
      acc[label] = (acc[label] || 0) + 1;
    });
    return acc;
  }, {});

  const topActivities = Object.entries(activityCounts)
    .map(([activity, count]) => ({ activity, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const textResponsesCount = responses.filter((response) =>
    feedbackFields.some((field) => {
      const value = response[field.key as FeedbackFieldKey];
      return typeof value === 'string' && value.trim() !== '';
    })
  ).length;
  const averageActivitiesSelected =
    responses.length > 0
      ? (
          responses.reduce((sum, response) => sum + response.helpful_activities.length, 0) /
          responses.length
        ).toFixed(1)
      : '0.0';
  const latestResponse = responses[0]?.created_at ? formatDate(responses[0].created_at) : 'Sin registros';

  const filterTags = [
    filters.subject && filters.subject !== 'all' ? `Materia: ${filters.subject}` : null,
    filters.startDate || filters.endDate
      ? `Periodo: ${filters.startDate || 'Inicio'} al ${filters.endDate || 'Presente'}`
      : null,
    filters.search ? `Busqueda: "${filters.search}"` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F1_0%,#FFF7F1_100%)] px-4 py-6 text-slate-900 sm:px-6 sm:py-8">
      <div className="print-report-shell mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-3 rounded-[28px] border border-white/80 bg-white/88 px-5 py-4 shadow-[0_20px_60px_-44px_rgba(142,77,94,0.45)] print:hidden">
          <Link
            href="/admin/respuestas"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-[#E9B9B6] bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-[#FFF7F1] hover:text-[#8E4D5E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8E4D5E] focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a respuestas
          </Link>

          <PrintButton />
        </div>

        <section className="print-report-section overflow-hidden rounded-[36px] border border-[#E9B9B6] bg-[linear-gradient(135deg,rgba(142,77,94,0.98)_0%,rgba(142,77,94,0.96)_58%,rgba(201,143,143,0.92)_100%)] p-6 text-white shadow-[0_40px_120px_-56px_rgba(142,77,94,0.72)] sm:p-8">
          <div className="grid gap-8 xl:grid-cols-[1.18fr_0.82fr]">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#E9B9B6]">
                <FileText className="h-3.5 w-3.5 text-[#D8B56D]" />
                Reporte imprimible
              </span>
              <div className="space-y-3">
                <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                  Reporte de recomendaciones para mejorar el curso
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[#E9B9B6] sm:text-base">
                  Documento preparado para revisión, archivo y guardado en PDF con resumen ejecutivo, filtros del corte y detalle completo por respuesta.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-[#E9B9B6]">
                <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2">
                  Fecha de generación: <span className="font-semibold text-white">{printDate}</span>
                </div>
                <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2">
                  Total de respuestas: <span className="font-semibold text-white">{responses.length}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/12 bg-white/8 p-5 backdrop-blur">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#D9A5A0]">
                <Sparkles className="h-3.5 w-3.5 text-[#D8B56D]" />
                Corte actual
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[22px] border border-white/10 bg-black/10 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#D9A5A0]">Comentarios</p>
                  <p className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] text-white">
                    {responses.length > 0 ? Math.round((textResponsesCount / responses.length) * 100) : 0}%
                  </p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-black/10 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#D9A5A0]">Prom. actividades</p>
                  <p className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] text-white">
                    {averageActivitiesSelected}
                  </p>
                </div>
              </div>
              <div className="mt-3 rounded-[22px] border border-white/10 bg-black/10 p-4">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D9A5A0]">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Ultimo registro visible</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-white">{latestResponse}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="print-report-section grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[30px] border border-[#E9B9B6] bg-white/92 p-6 shadow-[0_26px_80px_-54px_rgba(142,77,94,0.45)]">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              <Filter className="h-3.5 w-3.5" />
              <span>Metadatos del corte</span>
            </div>
            <div className="mt-4 space-y-3">
              {filterTags.length > 0 ? (
                filterTags.map((tag) => (
                  <div
                    key={tag}
                    className="rounded-[20px] border border-[#E9B9B6] bg-[rgba(255,247,241,0.88)] px-4 py-3 text-sm text-slate-700"
                  >
                    {tag}
                  </div>
                ))
              ) : (
                <div className="rounded-[20px] border border-[#E9B9B6] bg-[rgba(255,247,241,0.88)] px-4 py-3 text-sm text-slate-700">
                  Sin filtros aplicados. El documento incluye el universo completo de respuestas visibles para administración.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[30px] border border-[#E9B9B6] bg-white/92 p-6 shadow-[0_26px_80px_-54px_rgba(142,77,94,0.45)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Resumen ejecutivo
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-[#E9B9B6] bg-[rgba(255,247,241,0.9)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Materias cubiertas</p>
                <p className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] text-[#8E4D5E]">
                  {subjectEntries.length}
                </p>
              </div>
              <div className="rounded-[24px] border border-[#D8B56D] bg-[#FFF7F1] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C9A65A]">Respuestas con texto</p>
                <p className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] text-[#8E4D5E]">
                  {textResponsesCount}
                </p>
              </div>
              <div className="rounded-[24px] border border-[#E9B9B6] bg-[rgba(255,247,241,0.9)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Top actividad</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#8E4D5E]">
                  {topActivities[0]?.activity ?? 'Sin datos aun'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {responses.length === 0 ? (
          <div className="print-report-section rounded-[30px] border border-[#E9B9B6] bg-white/92 p-12 text-center shadow-[0_26px_80px_-54px_rgba(142,77,94,0.45)]">
            <AlertCircle className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em] text-[#8E4D5E]">
              No se encontraron respuestas con los filtros seleccionados
            </p>
          </div>
        ) : (
          <>
            <section className="print-report-section grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
              <div className="rounded-[30px] border border-[#E9B9B6] bg-white/92 p-6 shadow-[0_26px_80px_-54px_rgba(142,77,94,0.45)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Distribución por materia
                </p>
                <div className="mt-5 space-y-4">
                  {subjectEntries.map((entry) => (
                    <div key={entry.subject} className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-[#8E4D5E]">{entry.subject}</span>
                        <span className="text-sm text-slate-500">
                          {entry.count} respuestas · {entry.share}%
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-[#E9B9B6]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#8E4D5E] via-[#C98F8F] to-[#D8B56D]"
                          style={{ width: `${entry.share}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-[#E9B9B6] bg-white/92 p-6 shadow-[0_26px_80px_-54px_rgba(142,77,94,0.45)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Actividades más mencionadas
                </p>
                <div className="mt-5 space-y-3">
                  {topActivities.map((activity, index) => (
                    <div
                      key={activity.activity}
                      className="flex items-center justify-between gap-3 rounded-[22px] border border-[#E9B9B6] bg-[rgba(255,247,241,0.88)] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF7F1] text-xs font-semibold text-[#C98F8F]">
                          0{index + 1}
                        </span>
                        <span className="text-sm text-slate-700">{activity.activity}</span>
                      </div>
                      <span className="text-sm font-semibold text-[#8E4D5E]">{activity.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="print-report-section rounded-[30px] border border-[#E9B9B6] bg-white/92 p-6 shadow-[0_26px_80px_-54px_rgba(142,77,94,0.45)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Detalle completo de respuestas
              </p>
              <div className="mt-6 space-y-5">
                {responses.map((response, index) => {
                  const visibleFields = feedbackFields.filter((field) => {
                    const value = response[field.key as FeedbackFieldKey];
                    return typeof value === 'string' && value.trim() !== '';
                  });

                  return (
                    <article
                      key={response.id}
                      className="print-avoid-break rounded-[28px] border border-[#E9B9B6] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,247,241,0.92)_100%)] p-5"
                    >
                      <div className="flex flex-col gap-4 border-b border-[#E9B9B6] pb-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[#8E4D5E] px-3 text-xs font-semibold text-white">
                              #{responses.length - index}
                            </span>
                            <span className="inline-flex items-center rounded-full border border-[#E9B9B6] bg-white px-3 py-1 text-sm font-semibold text-[#8E4D5E]">
                              {response.subject}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">{formatDate(response.created_at)}</p>
                        </div>
                        <div className="rounded-[20px] border border-[#D8B56D] bg-[#FFF7F1] px-4 py-3 text-sm text-slate-700">
                          <span className="font-semibold text-[#8E4D5E]">Actividades de ayuda:</span>{' '}
                          {response.helpful_activities
                            .map((activity) =>
                              activity === 'Otra' && response.other_activity
                                ? `Otra (${response.other_activity})`
                                : activity
                            )
                            .join(', ')}
                        </div>
                      </div>

                      {visibleFields.length === 0 ? (
                        <div className="pt-4 text-sm text-slate-500">
                          Esta respuesta no incluye comentarios abiertos adicionales.
                        </div>
                      ) : (
                        <div className="mt-4 grid gap-4 xl:grid-cols-2">
                          {visibleFields.map((field) => (
                            <div
                              key={field.key}
                              className="rounded-[22px] border border-[#E9B9B6] bg-white px-4 py-4"
                            >
                              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                                {field.label}
                              </p>
                              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                {response[field.key as FeedbackFieldKey]}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          </>
        )}

        <div className="rounded-[24px] border border-[#E9B9B6] bg-white/88 px-5 py-4 text-sm leading-6 text-slate-500 print:hidden">
          Para un PDF más limpio, usa la opción de guardar como PDF del navegador con fondo habilitado y márgenes predeterminados.
        </div>
      </div>
    </div>
  );
}
