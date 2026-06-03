'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

export function PrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      className="h-11 rounded-full bg-[#102033] px-5 text-white hover:bg-[#183250]"
    >
      <Printer className="h-4 w-4" />
      Guardar o imprimir reporte
    </Button>
  );
}
