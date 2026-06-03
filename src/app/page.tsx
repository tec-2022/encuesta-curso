import React from 'react';
import { Award, Sparkles } from 'lucide-react';
import { SurveyForm } from '@/components/survey/survey-form';
import { PrivacyNotice } from '@/components/survey/privacy-notice';

export default function Home() {
  return (
    <main className="relative flex-grow overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6rem] top-12 h-64 w-64 rounded-full bg-[#E9B9B6]/25 blur-3xl" />
        <div className="absolute right-[-5rem] top-20 h-72 w-72 rounded-full bg-[#D8B56D]/18 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#D9A5A0]/18 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl space-y-6">
        <section className="overflow-hidden rounded-[34px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,247,241,0.96)_0%,rgba(255,247,241,0.86)_100%)] p-6 shadow-[0_36px_90px_-56px_rgba(142,77,94,0.36)] sm:p-8">
          <div className="absolute" />
          <div className="space-y-5 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E9B9B6] bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8E4D5E]">
              <Sparkles className="h-3.5 w-3.5 text-[#D8B56D]" />
              Encuesta anónima
            </span>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#E9B9B6] bg-white/90 text-[#8E4D5E] shadow-[0_18px_36px_-26px_rgba(142,77,94,0.35)]">
              <Award className="h-7 w-7" />
            </div>

            <div className="space-y-3">
              <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] text-[#8E4D5E] sm:text-5xl">
                Encuesta de recomendaciones para mejorar el curso
              </h1>
              <p className="mx-auto max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                Este espacio recoge sugerencias concretas sobre actividades, temas y dinámicas del curso.
                Tus respuestas son anónimas, no afectan tu calificación y se utilizarán únicamente para mejorar próximos semestres.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-600">
              <div className="rounded-full border border-[#E9B9B6] bg-white/85 px-4 py-2">
                Respuesta anónima
              </div>
              <div className="rounded-full border border-[#D8B56D] bg-[#FFF7F1] px-4 py-2 text-[#8E4D5E]">
                Enfoque de mejora continua
              </div>
            </div>
          </div>
        </section>

        <PrivacyNotice />

        <SurveyForm />

        <div className="border-t border-[#E9B9B6] pt-8 text-center text-xs uppercase tracking-[0.24em] text-[#B98E86]">
          Uso académico exclusivo para la mejora continua de las materias evaluadas
        </div>
      </div>
    </main>
  );
}
