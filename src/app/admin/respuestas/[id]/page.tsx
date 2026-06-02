import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getResponseById } from '@/lib/queries/responses';
import { AdminHeader } from '@/components/admin/admin-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, BookOpen, Calendar, MessageSquareText } from 'lucide-react';

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
    <div className="space-y-1.5 border-b border-slate-100 pb-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {title}
      </h4>
      <p className={`text-sm leading-relaxed ${value ? 'text-slate-700 whitespace-pre-wrap' : 'text-slate-400 italic'}`}>
        {value || 'Sin comentario'}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AdminHeader />

      <main className="flex-grow max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Action */}
        <div>
          <Link href="/admin/respuestas" passHref legacyBehavior>
            <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Volver a respuestas
            </Button>
          </Link>
        </div>

        {/* Detailed Response Card */}
        <Card className="border-t-4 border-t-blue-900 shadow-lg bg-white">
          <CardHeader className="border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6">
            <div className="space-y-1.5">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <MessageSquareText className="w-5 h-5 text-blue-900" />
                Detalle de respuesta
              </CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600 font-semibold">{response.subject}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>{formatDate(response.created_at)}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Subject */}
            {renderField('Materia cursada', response.subject)}

            {/* Submission Date */}
            {renderField('Fecha de envío', formatDate(response.created_at))}

            {/* Helpful Activities */}
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Actividades que ayudaron a aprender
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {response.helpful_activities.map((act) => (
                  <span
                    key={act}
                    className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>

            {/* Other Activity Mentioned */}
            {response.helpful_activities.includes('Otra') && 
              renderField('Otra actividad mencionada', response.other_activity)}

            {/* Unclear Topic */}
            {renderField('Tema que no quedó completamente claro', response.unclear_topic)}

            {/* More Practical Topic */}
            {renderField('Tema que le hubiera gustado trabajar más', response.more_practical_topic)}

            {/* Final Project Feedback */}
            {renderField('Recomendación sobre el trabajo final', response.final_project_feedback)}

            {/* Keep Next Semester */}
            {renderField('Actividad o dinámica que recomienda mantener', response.keep_next_semester)}

            {/* Improve Next Semester */}
            {renderField('Recomendación para mejorar las clases', response.improve_next_semester)}

            {/* Additional Comment */}
            {renderField('Comentario adicional', response.additional_comment)}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
