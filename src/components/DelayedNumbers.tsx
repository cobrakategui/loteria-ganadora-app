
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DelayedNumbersProps {
  numbers: string;
}

export function DelayedNumbers({ numbers }: DelayedNumbersProps) {
  const { t } = useLanguage();
  
  const delayedNumbers = numbers.split('-').filter(num => num.trim() !== '');

  return (
    <div className="lottery-card mb-4">
      <h3 className="text-sm font-semibold text-center mb-3 text-muted-foreground">
        {t('results.delayed-numbers')}
      </h3>
      <div className="flex flex-wrap justify-center gap-2">
        {delayedNumbers.map((number, index) => (
          <div key={index} className="lottery-number text-xs">
            {number.padStart(2, '0')}
          </div>
        ))}
      </div>
    </div>
  );
}
