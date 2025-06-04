
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResultsHeaderProps {
  selectedDate: string;
}

export function ResultsHeader({ selectedDate }: ResultsHeaderProps) {
  const { t } = useLanguage();

  const formatDate = (dateString: string) => {
    if (!dateString) return t('common.today');
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <h1 className="text-2xl font-bold gradient-text">
      Resultados de Hoy - {formatDate(selectedDate)}
    </h1>
  );
}
