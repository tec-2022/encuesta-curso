import React from 'react';
import { ShieldAlert } from 'lucide-react';

export function PrivacyNotice() {
  return (
    <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-[24px] border border-[#E9B9B6] bg-white/80 px-5 py-4 text-[#8E4D5E] shadow-[0_24px_70px_-54px_rgba(142,77,94,0.3)]">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#FFF7F1] text-[#D8B56D]">
        <ShieldAlert className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B98E86]">
          Privacidad
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          No se solicita nombre, matrícula, correo ni grupo. Solo se analiza el contenido de tus respuestas.
        </p>
      </div>
    </div>
  );
}
