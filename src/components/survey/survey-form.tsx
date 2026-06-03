'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { BookOpen, CheckSquare, Square, AlertCircle, Send } from 'lucide-react';
import { surveySchema, SurveyFormValues, SUBJECT_OPTIONS, HELPFUL_ACTIVITIES_OPTIONS } from '@/lib/validations/survey-schema';
import { submitSurvey } from '@/lib/actions/submit-survey';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

export function SurveyForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      subject: undefined,
      helpful_activities: [],
      other_activity: '',
      unclear_topic: '',
      more_practical_topic: '',
      final_project_feedback: '',
      keep_next_semester: '',
      improve_next_semester: '',
      additional_comment: '',
      honeypot: '',
    },
  });

  const selectedActivities = watch('helpful_activities') || [];
  const showOtherActivity = selectedActivities.includes('Otra');
  const questionCardClass =
    'rounded-[30px] border border-[#E9B9B6] bg-[linear-gradient(180deg,rgba(255,247,241,0.94)_0%,rgba(255,247,241,0.86)_100%)] shadow-[0_28px_80px_-58px_rgba(142,77,94,0.32)]';

  const handleCheckboxChange = (value: string) => {
    const current = [...selectedActivities];
    const index = current.indexOf(value);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(value);
    }
    setValue('helpful_activities', current, { shouldValidate: true });
  };

  const onSubmit = async (data: SurveyFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await submitSurvey(data);
      if (response.success) {
        toast.success('¡Encuesta enviada con éxito!');
        router.push('/gracias');
      } else {
        toast.error(response.error || 'No fue posible enviar tu respuesta. Inténtalo nuevamente.');
      }
    } catch {
      toast.error('No fue posible enviar tu respuesta. Inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-8 pb-12">
      {/* Honeypot field for basic anti-spam protection */}
      <div className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="honeypot">No completar este campo</label>
        <input
          id="honeypot"
          type="text"
          tabIndex={-1}
          {...register('honeypot')}
          autoComplete="off"
        />
      </div>

      {/* Question 1: Materia */}
      <Card className={questionCardClass}>
        <CardContent className="pt-6 sm:pt-7">
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 font-display text-2xl font-semibold tracking-[-0.03em] text-[#8E4D5E]">
              <BookOpen className="w-5 h-5 text-[#D8B56D]" />
              1. Selecciona la materia que cursaste <span className="text-red-500">*</span>
            </legend>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {SUBJECT_OPTIONS.map((subj) => {
                const isSelected = watch('subject') === subj;
                return (
                  <label
                    key={subj}
                    className={`flex min-h-28 flex-col items-center justify-center rounded-[24px] border p-4 text-center transition-all duration-200 ${
                      isSelected
                        ? 'border-[#C98F8F] bg-white text-[#8E4D5E] shadow-[0_20px_40px_-30px_rgba(142,77,94,0.35)]'
                        : 'border-[#E9B9B6] bg-white/88 text-slate-600 hover:border-[#D9A5A0] hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      value={subj}
                      className="sr-only"
                      {...register('subject')}
                    />
                    <span className="text-sm font-semibold leading-6">{subj}</span>
                  </label>
                );
              })}
            </div>
            {errors.subject && (
              <p className="text-sm text-red-600 flex items-center gap-1.5 mt-2" role="alert">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.subject.message}
              </p>
            )}
          </fieldset>
        </CardContent>
      </Card>

      {/* Question 2: Actividades que ayudaron */}
      <Card className={questionCardClass}>
        <CardContent className="pt-6">
          <fieldset className="space-y-4">
            <legend className="flex flex-col font-display text-2xl font-semibold tracking-[-0.03em] text-[#8E4D5E]">
              <span>2. ¿Qué actividad o forma de trabajo te ayudó más a aprender durante el curso? <span className="text-red-500">*</span></span>
              <span className="mt-1 font-sans text-xs font-medium uppercase tracking-[0.18em] text-[#B98E86]">Puedes seleccionar más de una opción.</span>
            </legend>
            
            <div className="grid grid-cols-1 gap-2.5">
              {HELPFUL_ACTIVITIES_OPTIONS.map((activity) => {
                const isChecked = selectedActivities.includes(activity);
                return (
                  <button
                    key={activity}
                    type="button"
                    onClick={() => handleCheckboxChange(activity)}
                    className={`flex w-full items-start rounded-[22px] border p-4 text-left transition-all duration-200 ${
                      isChecked
                        ? 'border-[#C98F8F] bg-white text-[#8E4D5E] shadow-[0_20px_36px_-30px_rgba(142,77,94,0.3)]'
                        : 'border-[#E9B9B6] bg-white/88 text-slate-700 hover:border-[#D9A5A0] hover:bg-white'
                    }`}
                  >
                    <div className="mr-3 mt-0.5 flex-shrink-0 text-[#C98F8F]">
                      {isChecked ? (
                        <CheckSquare className="h-5 w-5 fill-[#C98F8F] text-white" />
                      ) : (
                        <Square className="h-5 w-5 text-[#D9A5A0]" />
                      )}
                    </div>
                    <span className="text-sm font-medium leading-tight">{activity}</span>
                  </button>
                );
              })}
            </div>

            {showOtherActivity && (
              <div className="mt-4 space-y-2">
                <label htmlFor="other_activity" className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#B98E86]">
                  Por favor detalla la otra actividad:
                </label>
                <Input
                  id="other_activity"
                  placeholder="Escribe qué otra actividad te ayudó"
                  {...register('other_activity')}
                  className={errors.other_activity ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.other_activity && (
                  <p className="text-sm text-red-600 flex items-center gap-1.5 mt-1" role="alert">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errors.other_activity.message}
                  </p>
                )}
              </div>
            )}

            {errors.helpful_activities && (
              <p className="text-sm text-red-600 flex items-center gap-1.5 mt-2" role="alert">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.helpful_activities.message}
              </p>
            )}
          </fieldset>
        </CardContent>
      </Card>

      {/* Question 3: Tema no claro */}
      <Card className={questionCardClass}>
        <CardContent className="pt-6 space-y-3">
          <label htmlFor="unclear_topic" className="flex flex-col font-display text-2xl font-semibold tracking-[-0.03em] text-[#8E4D5E]">
            <span>3. ¿Hubo algún tema que al finalizar el curso no te quedara completamente claro?</span>
            <span className="mt-1 font-sans text-xs font-medium uppercase tracking-[0.16em] text-[#B98E86]">
              Puedes mencionar el tema y qué habría ayudado a comprenderlo mejor: más ejemplos, ejercicios, una explicación más detallada, una actividad práctica o material de apoyo.
            </span>
          </label>
          <Textarea
            id="unclear_topic"
            placeholder="Escribe tu respuesta aquí (opcional)"
            rows={4}
            {...register('unclear_topic')}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Question 4: Tema práctico */}
      <Card className={questionCardClass}>
        <CardContent className="pt-6 space-y-3">
          <label htmlFor="more_practical_topic" className="font-display text-2xl font-semibold tracking-[-0.03em] text-[#8E4D5E]">
            4. ¿Qué tema te hubiera gustado trabajar más o ver de una forma más práctica?
          </label>
          <Textarea
            id="more_practical_topic"
            placeholder="Escribe tu respuesta aquí (opcional)"
            rows={4}
            {...register('more_practical_topic')}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Question 5: Trabajo Final */}
      <Card className={questionCardClass}>
        <CardContent className="pt-6 space-y-3">
          <label htmlFor="final_project_feedback" className="flex flex-col font-display text-2xl font-semibold tracking-[-0.03em] text-[#8E4D5E]">
            <span>5. Pensando en el trabajo final, ¿qué aspecto podría explicarse, organizarse o plantearse mejor para próximos grupos?</span>
            <span className="mt-1 font-sans text-xs font-medium uppercase tracking-[0.16em] text-[#B98E86]">
              Puedes comentar sobre las instrucciones, el formato solicitado, las entregas parciales, la exposición, el tiempo disponible, la bitácora, el uso de noticias, el simulador, el trabajo en equipo u otro aspecto.
            </span>
          </label>
          <Textarea
            id="final_project_feedback"
            placeholder="Escribe tu respuesta aquí (opcional)"
            rows={4}
            {...register('final_project_feedback')}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Question 6: Mantener */}
      <Card className={questionCardClass}>
        <CardContent className="pt-6 space-y-3">
          <label htmlFor="keep_next_semester" className="font-display text-2xl font-semibold tracking-[-0.03em] text-[#8E4D5E]">
            6. Pensando en las clases, ¿qué actividad, dinámica o forma de explicación recomendarías mantener el próximo semestre?
          </label>
          <Textarea
            id="keep_next_semester"
            placeholder="Escribe tu respuesta aquí (opcional)"
            rows={4}
            {...register('keep_next_semester')}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Question 7: Cambiar */}
      <Card className={questionCardClass}>
        <CardContent className="pt-6 space-y-3">
          <label htmlFor="improve_next_semester" className="flex flex-col font-display text-2xl font-semibold tracking-[-0.03em] text-[#8E4D5E]">
            <span>7. ¿Qué recomendarías cambiar o mejorar en las clases del próximo semestre?</span>
            <span className="mt-1 font-sans text-xs font-medium uppercase tracking-[0.16em] text-[#B98E86]">
              Puede ser sobre temas, ejemplos, ritmo de explicación, actividades, tareas, materiales, trabajo final o cualquier aspecto que consideres importante.
            </span>
          </label>
          <Textarea
            id="improve_next_semester"
            placeholder="Escribe tu respuesta aquí (opcional)"
            rows={4}
            {...register('improve_next_semester')}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Additional Comment */}
      <Card className={questionCardClass}>
        <CardContent className="pt-6 space-y-3">
          <div className="mb-3 border-b border-[#E9B9B6] pb-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#B98E86]">Comentario adicional opcional</h3>
          </div>
          <label htmlFor="additional_comment" className="font-display text-2xl font-semibold tracking-[-0.03em] text-[#8E4D5E]">
            ¿Hay algo más que quieras compartir sobre tu experiencia en el curso?
          </label>
          <Textarea
            id="additional_comment"
            placeholder="Escribe tu respuesta aquí (opcional)"
            rows={4}
            {...register('additional_comment')}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="flex w-full items-center justify-center gap-2 rounded-full shadow-[0_24px_50px_-34px_rgba(142,77,94,0.55)] md:w-auto md:min-w-[260px]"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Enviando recomendaciones...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Enviar recomendaciones
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
