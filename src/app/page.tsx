import React from 'react';
import { SurveyForm } from '@/components/survey/survey-form';
import { PrivacyNotice } from '@/components/survey/privacy-notice';
import { Award } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="text-center space-y-3 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          {/* Subtle top bar accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-900" />
          
          <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mb-2">
            <Award className="w-6 h-6" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight">
            Encuesta de recomendaciones para mejorar el curso
          </h1>
          
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Esta encuesta es anónima. El objetivo es conocer qué actividades, temas y trabajos podrían mantenerse o mejorarse en próximos semestres. Tus comentarios no influyen en tu calificación y serán utilizados únicamente para mejorar el curso.
          </p>
        </div>

        {/* Privacy Card */}
        <PrivacyNotice />

        {/* Form Container */}
        <div className="mt-8">
          <SurveyForm />
        </div>

        {/* Academic subtle footer */}
        <div className="text-center pt-8 text-xs text-slate-400 border-t border-slate-200">
          <p>Uso académico exclusivo para la mejora continua del curso.</p>
        </div>
      </div>
    </main>
  );
}
