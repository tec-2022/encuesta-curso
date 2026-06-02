import React from 'react';
import { ShieldAlert } from 'lucide-react';

export function PrivacyNotice() {
  return (
    <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 max-w-md mx-auto my-6 shadow-sm">
      <ShieldAlert className="w-5 h-5 flex-shrink-0 text-blue-700" />
      <span className="text-sm font-medium">
        No se solicita nombre, matrícula, correo ni grupo.
      </span>
    </div>
  );
}
