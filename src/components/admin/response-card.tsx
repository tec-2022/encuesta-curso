import React from 'react';
import Link from 'next/link';
import { type SurveyResponse } from '@/types/survey';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, ChevronRight, Activity } from 'lucide-react';

interface ResponseCardProps {
  response: SurveyResponse;
}

export function ResponseCard({ response }: ResponseCardProps) {
  // Find first non-empty comment excerpt
  const comments = [
    response.unclear_topic,
    response.more_practical_topic,
    response.final_project_feedback,
    response.keep_next_semester,
    response.improve_next_semester,
    response.additional_comment,
  ];
  const firstComment = comments.find((c) => c && c.trim() !== '');

  const getExcerpt = (text?: string | null) => {
    if (!text) return 'Sin comentarios escritos.';
    if (text.length > 120) {
      return `"${text.substring(0, 120)}..."`;
    }
    return `"${text}"`;
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-slate-200 bg-white">
      <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-blue-900 font-semibold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>{response.subject}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(response.created_at)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Helpful Activities badges */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-blue-900" />
            <span>Actividades de ayuda</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {response.helpful_activities.map((act) => (
              <span
                key={act}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
              >
                {act === 'Otra' && response.other_activity ? `Otra: ${response.other_activity}` : act}
              </span>
            ))}
          </div>
        </div>

        {/* Written Comment Excerpt */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Extracto de comentarios
          </div>
          <p className={`text-sm leading-relaxed ${firstComment ? 'text-slate-600 italic' : 'text-slate-400 font-medium'}`}>
            {getExcerpt(firstComment)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 sm:p-5 pt-0 flex justify-end">
        <Link href={`/admin/respuestas/${response.id}`} passHref legacyBehavior>
          <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs cursor-pointer">
            Ver respuesta completa
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
