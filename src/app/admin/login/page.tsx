'use client';

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Lock, Mail, ShieldCheck } from 'lucide-react';
import { login } from '@/lib/actions/login';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function AdminLoginPage(props: PageProps) {
  const searchParams = use(props.searchParams);
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const errorParam = searchParams.error;
  const errorMsg = submitError || (errorParam === 'unauthorized'
    ? 'Esta cuenta no tiene acceso al panel administrativo.'
    : null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await login(formData);
      if (result.success) {
        router.push('/admin/dashboard');
      } else {
        setSubmitError(result.error || 'El correo o la contraseña no son correctos.');
      }
    } catch {
      setSubmitError('Ocurrió un error inesperado al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-5rem] top-24 h-56 w-56 rounded-full bg-[#E9B9B6]/26 blur-3xl" />
        <div className="absolute right-[-3rem] top-20 h-64 w-64 rounded-full bg-[#D8B56D]/18 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-[#E9B9B6] bg-[linear-gradient(180deg,rgba(255,247,241,0.96)_0%,rgba(255,247,241,0.88)_100%)] shadow-[0_36px_90px_-56px_rgba(142,77,94,0.4)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#D8B56D] via-[#FFF7F1] to-[#D8B56D]" />
        <CardHeader className="space-y-3 pb-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#E9B9B6] bg-white/90 text-[#8E4D5E] shadow-[0_18px_36px_-28px_rgba(142,77,94,0.35)]">
            <Lock className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E9B9B6] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B98E86]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#D8B56D]" />
              Acceso docente
            </span>
            <CardTitle className="font-display text-4xl font-semibold tracking-[-0.05em] text-[#8E4D5E]">
              Panel administrativo
            </CardTitle>
            <CardDescription className="text-slate-600">
              Inicia sesión para revisar métricas, respuestas y reportes del curso.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-[#B98E86]" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  required
                  className="pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-[#B98E86]" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="pl-11"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2 rounded-[22px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <Button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full shadow-[0_24px_50px_-34px_rgba(142,77,94,0.55)]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="mr-3 h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
