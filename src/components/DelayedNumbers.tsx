
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface DelayedNumbersProps {
  numbers: string;
}

export function DelayedNumbers({ numbers }: DelayedNumbersProps) {
  if (!numbers || numbers.trim() === '') return null;

  const numberList = numbers.split(',').filter(num => num.trim() !== '');

  return (
    <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-red-200 dark:border-red-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5" />
          Números Atrasados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {numberList.map((number, index) => (
            <div
              key={index}
              className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm font-medium"
            >
              {number.trim().padStart(2, '0')}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Números que han tardado más tiempo en salir en los sorteos
        </p>
      </CardContent>
    </Card>
  );
}
