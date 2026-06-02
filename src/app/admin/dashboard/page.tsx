import React from 'react';
import Link from 'next/link';
import { getDashboardStats } from '@/lib/queries/responses';
import { AdminHeader } from '@/components/admin/admin-header';
import { MetricCard } from '@/components/admin/metric-card';
import { ResponsesChart } from '@/components/admin/responses-chart';
import { ActivitiesChart } from '@/components/admin/activities-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Download, 
  ListCollapse, 
  LogOut,
  GraduationCap
} from 'lucide-react';
import { logout } from '@/lib/actions/logout';

export const revalidate = 0; // Disable server component caching

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const responsesChartData = [
    { subject: 'Seminario de Finanzas', count: stats.subjectCounts['Seminario de Finanzas'] },
    { subject: 'Mercado de Valores', count: stats.subjectCounts['Mercado de Valores'] },
    { subject: 'Finanzas Internacionales', count: stats.subjectCounts['Finanzas Internacionales'] },
  ];

  const activitiesChartData = Object.entries(stats.activityCounts).map(([activity, count]) => ({
    activity,
    count,
  }));

  const hasResponses = stats.totalResponses > 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AdminHeader />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Dashboard Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
            Panel de respuestas
          </h1>
          <p className="text-slate-500 text-sm">
            Consulta las recomendaciones anónimas recibidas para mejorar los próximos cursos.
          </p>
        </div>

        {/* Quick Actions Panel */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
            Acciones rápidas:
          </span>
          <Link href="/admin/respuestas" passHref legacyBehavior>
            <Button size="sm" className="flex items-center gap-1.5 cursor-pointer">
              <ListCollapse className="w-4 h-4" />
              Ver respuestas
            </Button>
          </Link>
          <a href="/api/admin/export/csv" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-slate-700 cursor-pointer">
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
          </a>
          <form action={logout} className="inline">
            <Button variant="outline" size="sm" type="submit" className="flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer">
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </Button>
          </form>
        </div>

        {!hasResponses ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
            <GraduationCap className="w-16 h-16 text-slate-300" />
            <h2 className="text-xl font-bold text-slate-800">Aún no se han recibido respuestas.</h2>
            <p className="text-sm text-slate-500 max-w-sm text-center">
              Comparte el enlace de la encuesta con tus estudiantes para empezar a recopilar recomendaciones de mejora del curso.
            </p>
          </div>
        ) : (
          <>
            {/* Metric Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <MetricCard
                title="Total de respuestas"
                value={stats.totalResponses}
                icon={<Users className="w-5 h-5 text-blue-900" />}
              />
              <MetricCard
                title="Seminario de Finanzas"
                value={stats.subjectCounts['Seminario de Finanzas']}
                icon={<BookOpen className="w-5 h-5 text-blue-900" />}
              />
              <MetricCard
                title="Mercado de Valores"
                value={stats.subjectCounts['Mercado de Valores']}
                icon={<BookOpen className="w-5 h-5 text-blue-900" />}
              />
              <MetricCard
                title="Finanzas Internacionales"
                value={stats.subjectCounts['Finanzas Internacionales']}
                icon={<BookOpen className="w-5 h-5 text-blue-900" />}
              />
              <MetricCard
                title="Respuesta más reciente"
                value={stats.latestResponseDate ? formatDate(stats.latestResponseDate).split(' ')[0] : 'N/A'}
                icon={<Calendar className="w-5 h-5 text-blue-900" />}
                description={stats.latestResponseDate ? formatDate(stats.latestResponseDate).split(' ')[1] : undefined}
              />
            </div>

            {/* Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Subject Distribution */}
              <Card className="lg:col-span-1 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base font-bold uppercase tracking-wider text-slate-700">
                    Respuestas por materia
                  </CardTitle>
                  <CardDescription>
                    Distribución de estudiantes encuestados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsesChart data={responsesChartData} />
                </CardContent>
              </Card>

              {/* Helpful Activities */}
              <Card className="lg:col-span-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base font-bold uppercase tracking-wider text-slate-700">
                    Actividades que más ayudaron a aprender
                  </CardTitle>
                  <CardDescription>
                    Frecuencia de selección de opciones de aprendizaje
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivitiesChart data={activitiesChartData} />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
