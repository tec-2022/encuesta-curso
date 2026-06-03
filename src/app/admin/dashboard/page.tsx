import React from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/admin-header';
import { MetricCard } from '@/components/admin/metric-card';
import { ResponsesChart } from '@/components/admin/responses-chart';
import { ActivitiesChart } from '@/components/admin/activities-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getResponses } from '@/lib/queries/responses';
import { SUBJECT_OPTIONS } from '@/lib/validations/survey-schema';
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Download,
  ListCollapse,
  LogOut,
  MessageSquareText,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { logout } from '@/lib/actions/logout';

export const revalidate = 0;

const feedbackBlocks = [
  { key: 'unclear_topic', label: 'Temas poco claros', note: 'Necesitan aclaración adicional.' },
  { key: 'more_practical_topic', label: 'Solicitud práctica', note: 'Piden más ejercicios o aplicación.' },
  { key: 'final_project_feedback', label: 'Trabajo final', note: 'Observaciones sobre cierre del curso.' },
  { key: 'keep_next_semester', label: 'Valor a conservar', note: 'Lo que conviene mantener el próximo semestre.' },
  { key: 'improve_next_semester', label: 'Mejoras de clase', note: 'Sugerencias operativas y pedagógicas.' },
  { key: 'additional_comment', label: 'Comentarios extra', note: 'Feedback libre que amplía el contexto.' },
] as const;

type FeedbackKey = (typeof feedbackBlocks)[number]['key'];

export default async function DashboardPage() {
  const responses = await getResponses();

  const totalResponses = responses.length;
  const latestResponseDate = responses[0]?.created_at ?? null;
  const latestDate = latestResponseDate ? new Date(latestResponseDate) : null;
  const latestDateLabel = latestDate
    ? latestDate.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Sin registros';
  const latestTimeLabel = latestDate
    ? latestDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    : 'Aun no hay respuestas';

  const subjectEntries = SUBJECT_OPTIONS.map((subject) => {
    const count = responses.filter((response) => response.subject === subject).length;
    const share = totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;

    return { subject, count, share };
  });

  const responsesChartData = subjectEntries.map(({ subject, count }) => ({ subject, count }));

  const activityCounts = responses.reduce<Record<string, number>>((acc, response) => {
    response.helpful_activities.forEach((activity) => {
      const activityLabel =
        activity === 'Otra' && response.other_activity
          ? `Otra: ${response.other_activity}`
          : activity;
      acc[activityLabel] = (acc[activityLabel] || 0) + 1;
    });
    return acc;
  }, {});

  const activitiesChartData = Object.entries(activityCounts).map(([activity, count]) => ({
    activity,
    count,
  }));

  const totalActivitiesMarked = activitiesChartData.reduce((sum, item) => sum + item.count, 0);
  const averageActivitiesPerResponse =
    totalResponses > 0 ? (totalActivitiesMarked / totalResponses).toFixed(1) : '0.0';

  const textFeedbackCount = responses.filter((response) =>
    [
      response.unclear_topic,
      response.more_practical_topic,
      response.final_project_feedback,
      response.keep_next_semester,
      response.improve_next_semester,
      response.additional_comment,
    ].some((field) => field && field.trim() !== '')
  ).length;

  const feedbackRate = totalResponses > 0 ? Math.round((textFeedbackCount / totalResponses) * 100) : 0;

  const subjectRanking = [...subjectEntries].sort((a, b) => b.count - a.count);
  const topSubject = subjectRanking[0];
  const secondSubject = subjectRanking[1];
  const subjectLead = topSubject && secondSubject ? topSubject.count - secondSubject.count : 0;

  const topActivity = [...activitiesChartData].sort((a, b) => b.count - a.count)[0];
  const topActivities = [...activitiesChartData].sort((a, b) => b.count - a.count).slice(0, 4);

  const feedbackSignals = feedbackBlocks.map((block) => {
    const count = responses.filter((response) => {
      const value = response[block.key as FeedbackKey];
      return typeof value === 'string' && value.trim() !== '';
    }).length;

    return {
      ...block,
      count,
      share: totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0,
    };
  });

  const topSignal = [...feedbackSignals].sort((a, b) => b.count - a.count)[0];
  const hasResponses = totalResponses > 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#FFF7F1_0%,#FFF7F1_35%,#FFF7F1_100%)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-6rem] top-[-3rem] h-72 w-72 rounded-full bg-[#E9B9B6]/70 blur-3xl" />
        <div className="absolute right-[-4rem] top-40 h-72 w-72 rounded-full bg-[#D8B56D]/70 blur-3xl" />
        <div className="absolute bottom-8 left-1/3 h-60 w-60 rounded-full bg-white/50 blur-3xl" />
      </div>
      <AdminHeader />

      <main className="mx-auto flex-grow max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,rgba(142,77,94,0.98)_0%,rgba(142,77,94,0.96)_55%,rgba(201,143,143,0.92)_100%)] p-6 text-white shadow-[0_40px_120px_-52px_rgba(142,77,94,0.78)] sm:p-8">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(175,141,82,0.34),transparent_48%)]" />
          <div className="absolute -right-10 top-8 h-40 w-40 rounded-full border border-white/10 bg-white/5" />
          <div className="relative grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#E9B9B6]">
                <Sparkles className="h-3.5 w-3.5 text-[#D8B56D]" />
                Resumen ejecutivo
              </span>
              <div className="space-y-4">
                <h1 className="font-display max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                  Un tablero más premium, enfocado en decisión, lectura rápida y seguimiento docente.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[#E9B9B6] sm:text-base">
                  Este corte concentra participación, señales de mejora y actividades mejor evaluadas para convertir respuestas dispersas en prioridades accionables.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-[#E9B9B6]">
                <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2">
                  <span className="font-semibold text-white">{totalResponses}</span> respuestas acumuladas
                </div>
                <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2">
                  Feedback escrito en <span className="font-semibold text-white">{feedbackRate}%</span> de los casos
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 print:hidden">
                <Link
                  href="/admin/respuestas"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#FFF7F1] px-5 text-sm font-semibold text-[#8E4D5E] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#8E4D5E]"
                >
                  <ListCollapse className="h-4 w-4" />
                  Ver respuestas
                </Link>
                <a
                  href="/api/admin/export/csv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 text-sm font-medium text-white transition-colors hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#8E4D5E]"
                >
                  <Download className="h-4 w-4" />
                  Exportar CSV
                </a>
                <form action={logout} className="inline">
                  <Button
                    variant="ghost"
                    type="submit"
                    className="rounded-full border border-white/10 bg-white/5 px-4 text-white hover:bg-white/10 hover:text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesion
                  </Button>
                </form>
              </div>
            </div>

            <Card className="rounded-[32px] border-white/10 bg-white/8 text-white shadow-none backdrop-blur">
              <CardHeader className="space-y-3">
                <CardDescription className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#D9A5A0]">
                  Corte actual
                </CardDescription>
                <CardTitle className="font-display text-3xl font-semibold tracking-[-0.04em] text-white">
                  Panorama del curso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[26px] border border-white/10 bg-black/10 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D9A5A0]">
                    Materia con mayor tracción
                  </p>
                  <p className="mt-3 text-xl font-semibold text-white">
                    {topSubject?.subject ?? 'Sin datos'}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#E9B9B6]">
                    {topSubject
                      ? `${topSubject.count} respuestas, ${topSubject.share}% del total y una ventaja de ${subjectLead} frente al siguiente grupo.`
                      : 'Comparte la encuesta para comenzar a generar cortes comparables.'}
                  </p>
                </div>
                <div className="rounded-[26px] border border-white/10 bg-black/10 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D9A5A0]">
                    Señal docente dominante
                  </p>
                  <p className="mt-3 text-xl font-semibold text-white">
                    {topSignal?.label ?? 'Sin datos'}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#E9B9B6]">
                    {topSignal
                      ? `Aparece en ${topSignal.count} respuestas (${topSignal.share}%), lo que la convierte en la línea de análisis más visible del corte actual.`
                      : 'Todavía no hay suficiente evidencia para definir una prioridad.'}
                  </p>
                </div>
                <div className="flex items-center gap-3 rounded-[26px] border border-white/10 bg-black/10 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/8 text-[#D8B56D]">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D9A5A0]">
                      Ultima actualización
                    </p>
                    <p className="text-sm font-semibold text-white">{latestDateLabel}</p>
                    <p className="text-sm text-[#E9B9B6]">{latestTimeLabel}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {!hasResponses ? (
          <div className="rounded-[32px] border border-white/70 bg-white/78 p-12 text-center shadow-[0_32px_90px_-56px_rgba(142,77,94,0.45)]">
            <MessageSquareText className="mx-auto h-14 w-14 text-[#B98E86]" />
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.04em] text-[#8E4D5E]">
              Aun no hay respuestas para analizar
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              En cuanto lleguen respuestas, este panel va a resumir participación, señales pedagógicas y temas de seguimiento con lectura ejecutiva.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <MetricCard
                title="Participación total"
                value={totalResponses}
                icon={<Users className="h-5 w-5" />}
                description="Base total del corte consultado para el panel actual."
                accent="slate"
              />
              <MetricCard
                title="Feedback escrito"
                value={`${feedbackRate}%`}
                icon={<MessageSquareText className="h-5 w-5" />}
                description={`${textFeedbackCount} respuestas dejaron comentario abierto en al menos un bloque.`}
                accent="steel"
              />
              <MetricCard
                title="Promedio de actividades"
                value={averageActivitiesPerResponse}
                icon={<Activity className="h-5 w-5" />}
                description="Selecciones promedio por estudiante dentro del apartado de apoyos."
                accent="brass"
              />
              <MetricCard
                title="Materia líder"
                value={`${topSubject?.share ?? 0}%`}
                icon={<TrendingUp className="h-5 w-5" />}
                description={topSubject ? `${topSubject.subject} concentra la mayor proporción del total.` : 'Sin datos suficientes.'}
                accent="slate"
              />
              <MetricCard
                title="Ultimo registro"
                value={latestDateLabel}
                icon={<Calendar className="h-5 w-5" />}
                description={latestTimeLabel}
                accent="steel"
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
              <Card className="rounded-[32px] border-[#E9B9B6] bg-[rgba(255,247,241,0.9)] shadow-[0_30px_90px_-58px_rgba(142,77,94,0.5)]">
                <CardHeader>
                  <CardDescription className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Actividades con mayor recordación
                  </CardDescription>
                  <CardTitle className="font-display text-3xl font-semibold tracking-[-0.04em] text-[#8E4D5E]">
                    Qué prácticas sostienen mejor el aprendizaje
                  </CardTitle>
                  <CardDescription className="text-slate-500">
                    Priorización de dinámicas según frecuencia de mención por parte del alumnado.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivitiesChart data={activitiesChartData} />
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="rounded-[32px] border-[#E9B9B6] bg-[rgba(255,247,241,0.9)] shadow-[0_30px_90px_-58px_rgba(142,77,94,0.5)]">
                  <CardHeader>
                    <CardDescription className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Balance de muestra
                    </CardDescription>
                    <CardTitle className="font-display text-3xl font-semibold tracking-[-0.04em] text-[#8E4D5E]">
                      Distribución por materia
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsesChart data={responsesChartData} />
                  </CardContent>
                </Card>

                <Card className="rounded-[32px] border-[#E9B9B6] bg-[linear-gradient(180deg,rgba(255,247,241,0.94)_0%,rgba(255,247,241,0.92)_100%)] shadow-[0_30px_90px_-58px_rgba(142,77,94,0.5)]">
                  <CardHeader>
                    <CardDescription className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Lectura estratégica
                    </CardDescription>
                    <CardTitle className="font-display text-3xl font-semibold tracking-[-0.04em] text-[#8E4D5E]">
                      Hallazgos prioritarios
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="rounded-[24px] border border-[#D8B56D] bg-[#FFF7F1] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[#8E4D5E]">Actividad más fuerte</p>
                        <ArrowUpRight className="h-4 w-4 text-[#D8B56D]" />
                      </div>
                      <p className="mt-2 text-lg font-semibold text-[#8E4D5E]">
                        {topActivity?.activity ?? 'Sin datos aun'}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {topActivity
                          ? `${topActivity.count} menciones dentro de ${totalActivitiesMarked} selecciones registradas.`
                          : 'Aun no hay actividad con volumen suficiente para comparar.'}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {subjectRanking.map((entry) => (
                        <div key={entry.subject} className="space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                              <BookOpen className="h-4 w-4 text-[#C98F8F]" />
                              <span>{entry.subject}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-[#8E4D5E]">{entry.count}</p>
                              <p className="text-xs text-slate-400">{entry.share}%</p>
                            </div>
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
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <Card className="rounded-[32px] border-[#E9B9B6] bg-[rgba(255,247,241,0.9)] shadow-[0_30px_90px_-58px_rgba(142,77,94,0.5)]">
                <CardHeader>
                  <CardDescription className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Radar de seguimiento
                  </CardDescription>
                  <CardTitle className="font-display text-3xl font-semibold tracking-[-0.04em] text-[#8E4D5E]">
                    Dónde sí hubo narrativa útil
                  </CardTitle>
                  <CardDescription className="text-slate-500">
                    Mide qué bloques de respuesta abierta ya generan suficiente señal para análisis cualitativo.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {feedbackSignals.map((signal) => (
                    <div
                      key={signal.key}
                      className="rounded-[24px] border border-[#E9B9B6] bg-[rgba(255,247,241,0.85)] p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#8E4D5E]">{signal.label}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-500">{signal.note}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-3xl font-semibold tracking-[-0.04em] text-[#8E4D5E]">
                            {signal.count}
                          </p>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{signal.share}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[32px] border-[#E9B9B6] bg-[linear-gradient(180deg,rgba(255,247,241,0.92)_0%,rgba(251,248,242,0.92)_100%)] shadow-[0_30px_90px_-58px_rgba(142,77,94,0.5)]">
                <CardHeader>
                  <CardDescription className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Brief ejecutivo
                  </CardDescription>
                  <CardTitle className="font-display text-3xl font-semibold tracking-[-0.04em] text-[#8E4D5E]">
                    Lo más importante del corte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-[24px] border border-[#D8B56D] bg-[#FFF7F1] p-5">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFF7F1] text-[#D8B56D]">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#8E4D5E]">Participación utilizable</p>
                        <p className="mt-1 text-sm leading-7 text-slate-600">
                          {feedbackRate}% de las respuestas ya incluye texto abierto, suficiente para combinar lectura cuantitativa y revisión cualitativa.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-[#E9B9B6] bg-[rgba(255,247,241,0.92)] p-5">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFF7F1] text-[#C98F8F]">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#8E4D5E]">Concentración de muestra</p>
                        <p className="mt-1 text-sm leading-7 text-slate-600">
                          {topSubject
                            ? `${topSubject.subject} lidera con ${topSubject.share}% del volumen; conviene revisar si el resto de grupos necesita más difusión para equilibrar la muestra.`
                            : 'Todavía no hay datos suficientes para comparar grupos.'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-[#E9B9B6] bg-white p-5">
                    <p className="text-sm font-semibold text-[#8E4D5E]">Top actividades mencionadas</p>
                    <div className="mt-4 space-y-3">
                      {topActivities.map((activity, index) => (
                        <div key={activity.activity} className="flex items-center justify-between gap-3">
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
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-[32px] border-[#E9B9B6] bg-[linear-gradient(135deg,rgba(142,77,94,0.98)_0%,rgba(201,143,143,0.95)_100%)] text-white shadow-[0_30px_100px_-60px_rgba(142,77,94,0.72)]">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardDescription className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D9A5A0]">
                    Siguiente paso
                  </CardDescription>
                  <CardTitle className="font-display text-3xl font-semibold tracking-[-0.04em] text-white">
                    Baja al nivel de comentario y prepara tu PDF
                  </CardTitle>
                  <CardDescription className="max-w-2xl text-[#E9B9B6]">
                    Entra al listado completo para encontrar patrones repetidos, aplicar filtros y generar un reporte limpio para guardar o imprimir.
                  </CardDescription>
                </div>
                <Link
                  href="/admin/respuestas"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#FFF7F1] px-5 text-sm font-semibold text-[#8E4D5E] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#8E4D5E]"
                >
                  <ListCollapse className="h-4 w-4" />
                  Ir al listado completo
                </Link>
              </CardHeader>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
