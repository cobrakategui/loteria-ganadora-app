
import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-lottery-blue" />
        <p className="text-sm text-muted-foreground">Cargando resultados...</p>
      </div>
    </div>
  );
}
