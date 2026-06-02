'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

export function PrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      className="flex items-center gap-1.5 cursor-pointer"
    >
      <Printer className="w-4 h-4" />
      Imprimir / Guardar como PDF
    </Button>
  );
}
