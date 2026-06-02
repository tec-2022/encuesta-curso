import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function GraciasPage() {
  return (
    <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full border-t-4 border-t-green-600 shadow-xl">
        <CardContent className="pt-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              ¡Gracias por tus comentarios!
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tus recomendaciones serán tomadas en cuenta para mejorar el curso en próximos semestres.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg inline-block border border-slate-100">
            <p className="text-xs font-semibold text-slate-500">
              Tu respuesta fue registrada de manera anónima.
            </p>
          </div>

          <div className="pt-4">
            <Link href="/" passHref legacyBehavior>
              <Button className="w-full sm:w-auto flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Volver al inicio
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
