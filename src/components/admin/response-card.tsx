import React from 'react';
import Link from 'next/link';
import { type SurveyResponse } from '@/types/survey';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Activity, BookOpen, Calendar, ChevronRight, MessageSquareText } from 'lucide-react';

interface ResponseCardProps {
  response: SurveyResponse;
}

export function ResponseCard({ response }: ResponseCardProps) {
  const comments = [
    response.unclear_topic,
    response.more_practical_topic,
    response.final_project_feedback,
    response.keep_next_semester,
    response.improve_next_semester,
    response.additional_comment,
  ];
  const firstComment = comments.find((comment) => comment && comment.trim() !== '');
  const commentsCount = comments.filter((comment) => comment && comment.trim() !== '').length;
  const activitiesLabel = `${response.helpful_activities.length} actividad${response.helpful_activities.length === 1 ? '' : 'es'}`;

  const getExcerpt = (text?: string | null) => {
    if (!text) return 'Sin comentarios escritos en esta respuesta.';
    if (text.length > 150) {
      return `"${text.substring(0, 150)}..."`;
    }
    return `"${text}"`;
  };

  return (
    <Card className="group overflow-hidden rounded-[30px] border-[#E9B9B6] bg-[linear-gradient(180deg,rgba(255,247,241,0.94)_0%,rgba(255,247,241,0.92)_100%)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_34px_84px_-54px_rgba(142,77,94,0.55)]">
      <div className="h-1.5 bg-gradient-to-r from-[#8E4D5E] via-[#C98F8F] to-[#D8B56D]" />
      <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-[#E9B9B6] p-5 sm:p-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E9B9B6] bg-white px-3 py-1.5 text-sm font-semibold text-[#8E4D5E]">
            <BookOpen className="h-4 w-4 text-[#D8B56D]" />
            <span>{response.subject}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(response.created_at)}</span>
          </div>
        </div>
        <div className="rounded-[22px] border border-[#D8B56D] bg-[#FFF7F1] px-3 py-2 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A65A]">Densidad</p>
          <p className="mt-1 font-display text-3xl font-semibold tracking-[-0.04em] text-[#8E4D5E]">
            {commentsCount}
          </p>
          <p className="text-xs text-slate-500">bloques con texto</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-[#E9B9B6] bg-white px-3 py-1 text-xs font-medium text-slate-700">
            {activitiesLabel}
          </span>
          {response.helpful_activities.slice(0, 3).map((activity) => (
            <span
              key={activity}
              className="inline-flex items-center rounded-full border border-[#E9B9B6] bg-[rgba(255,247,241,0.85)] px-3 py-1 text-xs font-medium text-slate-700"
            >
              {activity === 'Otra' && response.other_activity ? `Otra: ${response.other_activity}` : activity}
            </span>
          ))}
          {response.helpful_activities.length > 3 && (
            <span className="inline-flex items-center rounded-full border border-[#E9B9B6] bg-white px-3 py-1 text-xs font-medium text-slate-500">
              +{response.helpful_activities.length - 3} más
            </span>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[24px] border border-[#E9B9B6] bg-white/92 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              <Activity className="h-3.5 w-3.5 text-[#C98F8F]" />
              <span>Lectura rápida</span>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {commentsCount > 0
                ? `${commentsCount} de 6 bloques contienen texto abierto, por lo que esta respuesta sí aporta contexto para análisis cualitativo.`
                : 'La respuesta se concentra en actividades seleccionadas y no incluye comentarios abiertos.'}
            </p>
          </div>

          <div className="rounded-[24px] border border-[#D8B56D] bg-[#FFF7F1] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#C9A65A]">
              <MessageSquareText className="h-3.5 w-3.5" />
              <span>Extracto</span>
            </div>
            <p
              className={`mt-3 text-sm leading-7 ${
                firstComment ? 'text-slate-700 italic' : 'font-medium text-slate-400'
              }`}
            >
              {getExcerpt(firstComment)}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end p-5 pt-0 sm:p-6 sm:pt-0">
        <Link
          href={`/admin/respuestas/${response.id}`}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-[#E9B9B6] bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:border-[#D9A5A0] hover:bg-[#FFF7F1] hover:text-[#8E4D5E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8E4D5E] focus-visible:ring-offset-2"
        >
          Ver respuesta completa
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
