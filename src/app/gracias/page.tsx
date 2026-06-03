import React from 'react';
import Link from 'next/link';
import { Check, Home, ShieldCheck, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function GraciasPage() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#FFF7F1_0%,#FFF7F1_55%,#fff2ef_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-5rem] top-16 h-56 w-56 rounded-full bg-[#E9B9B6]/30 blur-3xl" />
        <div className="absolute right-[-4rem] top-24 h-64 w-64 rounded-full bg-[#D8B56D]/20 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-[#D9A5A0]/20 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-2xl overflow-hidden rounded-[34px] border border-[#D9A5A0] bg-[linear-gradient(180deg,rgba(233,185,182,0.94)_0%,rgba(217,165,160,0.78)_100%)] shadow-[0_36px_90px_-54px_rgba(142,77,94,0.45)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#D8B56D] via-[#FFF7F1] to-[#D8B56D]" />
        <div className="absolute inset-0 border-[10px] border-white/12" />
        <div className="absolute left-6 top-6 h-16 w-16 rounded-full border border-white/25" />
        <div className="absolute bottom-6 right-6 h-20 w-20 rounded-full border border-white/18" />

        <CardContent className="relative p-7 sm:p-10">
          <div className="mx-auto max-w-xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/22 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#FFF7F1]">
              <Sparkles className="h-3.5 w-3.5 text-[#D8B56D]" />
              Respuesta recibida
            </div>

            <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-[rgba(255,247,241,0.92)] shadow-[0_18px_36px_-24px_rgba(142,77,94,0.4)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF7F1] text-[#8E4D5E] ring-1 ring-[#D8B56D]/60">
                <Check className="h-7 w-7" />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] text-[#FFF7F1] sm:text-5xl">
                Gracias por compartir tu experiencia
              </h1>
              <p className="mx-auto max-w-lg text-base leading-8 text-[#fff8f5]">
                Tus recomendaciones ya quedaron registradas y van a servir para mejorar el curso en los próximos semestres.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-white/28 bg-white/20 px-4 py-4 text-left backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FFF7F1]">
                  <ShieldCheck className="h-4 w-4 text-[#D8B56D]" />
                  <span>Privacidad</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#fff8f5]">
                  Tu respuesta fue registrada de manera anónima.
                </p>
              </div>

              <div className="rounded-[22px] border border-white/28 bg-white/20 px-4 py-4 text-left backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FFF7F1]">
                  <Sparkles className="h-4 w-4 text-[#D8B56D]" />
                  <span>Siguiente paso</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#fff8f5]">
                  Ya puedes cerrar esta página o regresar al inicio.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full bg-[#8E4D5E] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_-28px_rgba(142,77,94,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#7b4251] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#C98F8F]"
              >
                <Home className="h-4 w-4" />
                Volver al inicio
              </Link>
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.24em] text-[#fff1ea]">
              Mejora continua del curso
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
