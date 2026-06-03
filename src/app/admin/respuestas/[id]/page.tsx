import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, Calendar, MessageSquareText } from 'lucide-react';
import { AdminHeader } from '@/components/admin/admin-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getResponseById } from '@/lib/queries/responses';
import { formatDate } from '@/lib/utils';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DetalleRespuestaPage(props: PageProps) {
  const { id } = await props.params;
  const response = await getResponseById(id);

  if (!response) {
    notFound();
  }

  const renderField = (title: string, value: string | null) => (
    <div className="space-y-2 border-b border-[#E9B9B6] pb-5">
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B98E86]">
        {title}
      </h4>
      <p className={`text-sm leading-7 ${value ? 'whitespace-pre-wrap text-slate-700' : 'italic text-slate-400'}`}>
        {value || 'Sin comentario'}
      </p>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#FFF7F1_0%,#FFF7F1_40%,#fff3ef_100%)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-4rem] top-24 h-56 w-56 rounded-full bg-[#E9B9B6]/24 blur-3xl" />
        <div className="absolute right-[-4rem] top-16 h-64 w-64 rounded-full bg-[#D8B56D]/16 blur-3xl" />
      </div>
      <AdminHeader />

      <main className="mx-auto flex-grow max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <Link
            href="/admin/respuestas"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-[#E9B9B6] bg-white/85 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-[#FFF7F1] hover:text-[#8E4D5E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8E4D5E] focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a respuestas
          </Link>
        </div>

        <Card className="overflow-hidden rounded-[32px] border-[#E9B9B6] bg-[linear-gradient(180deg,rgba(255,247,241,0.94)_0%,rgba(255,247,241,0.88)_100%)] shadow-[0_34px_90px_-56px_rgba(142,77,94,0.42)]">
          <div className="h-1 bg-gradient-to-r from-[#D8B56D] via-[#C98F8F] to-[#8E4D5E]" />
          <CardHeader className="flex flex-col gap-4 border-b border-[#E9B9B6] p-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E9B9B6] bg-white/90 px-3 py-1.5 text-sm font-semibold text-[#8E4D5E]">
                <MessageSquareText className="h-4 w-4 text-[#D8B56D]" />
                Detalle de respuesta
              </div>
              <CardTitle className="font-display text-3xl font-semibold tracking-[-0.04em] text-[#8E4D5E]">
                Vista completa del comentario recibido
              </CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#B98E86]">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-[#C98F8F]" />
                  <span className="font-semibold text-slate-700">{response.subject}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#C98F8F]" />
                  <span>{formatDate(response.created_at)}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {renderField('Materia cursada', response.subject)}
            {renderField('Fecha de envío', formatDate(response.created_at))}

            <div className="space-y-3 border-b border-[#E9B9B6] pb-5">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B98E86]">
                Actividades que ayudaron a aprender
              </h4>
              <div className="flex flex-wrap gap-2">
                {response.helpful_activities.map((act) => (
                  <span
                    key={act}
                    className="inline-flex items-center rounded-full border border-[#E9B9B6] bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>

            {response.helpful_activities.includes('Otra') &&
              renderField('Otra actividad mencionada', response.other_activity)}
            {renderField('Tema que no quedó completamente claro', response.unclear_topic)}
            {renderField('Tema que le hubiera gustado trabajar más', response.more_practical_topic)}
            {renderField('Recomendación sobre el trabajo final', response.final_project_feedback)}
            {renderField('Actividad o dinámica que recomienda mantener', response.keep_next_semester)}
            {renderField('Recomendación para mejorar las clases', response.improve_next_semester)}
            {renderField('Comentario adicional', response.additional_comment)}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
