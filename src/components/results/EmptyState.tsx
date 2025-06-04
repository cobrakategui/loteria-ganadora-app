
import React from 'react';

interface EmptyStateProps {
  searchTerm: string;
}

export function EmptyState({ searchTerm }: EmptyStateProps) {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">
        {searchTerm ? 'No se encontraron resultados para la búsqueda' : 'No se encontraron resultados para la fecha seleccionada'}
      </p>
    </div>
  );
}
