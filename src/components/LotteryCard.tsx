
import React from 'react';
import { LotteryResult } from '@/types/lottery';
import { Clock, MapPin, Heart, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LotteryCardProps {
  lottery: LotteryResult;
  onClick: () => void;
  viewMode: 'grid' | 'list';
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function LotteryCard({ lottery, onClick, viewMode, isFavorite, onToggleFavorite }: LotteryCardProps) {
  const parseNumbers = (premios: string): string[] => {
    return premios.split('-').filter(num => num.trim() !== '');
  };

  const formatTime = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-DO', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const numbers = lottery.ultimo_sorteo ? parseNumbers(lottery.ultimo_sorteo.premios) : [];
  const hasResults = numbers.length > 0;
  const hasMany = numbers.length > 10;

  const renderNumbers = () => {
    if (!hasResults) {
      return (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">Sin resultados</p>
        </div>
      );
    }

    const containerClass = hasMany && viewMode === 'list' ? 'numbers-container-horizontal' : 'numbers-container';

    return (
      <div className="numbers-scroll">
        <div className={containerClass}>
          {numbers.map((number, index) => (
            <div key={index} className="lottery-number text-xs flex-shrink-0">
              {number.padStart(2, '0')}
            </div>
          ))}
          {lottery.id === 9 && lottery.ultimo_sorteo?.loto1 !== null && lottery.ultimo_sorteo?.loto1 !== undefined && (
            <div className="lottery-number-mas text-xs flex-shrink-0">
              {lottery.ultimo_sorteo.loto1.toString().padStart(2, '0')}
            </div>
          )}
          {lottery.id === 9 && lottery.ultimo_sorteo?.loto2 !== null && lottery.ultimo_sorteo?.loto2 !== undefined && (
            <div className="lottery-number-super text-xs flex-shrink-0">
              {lottery.ultimo_sorteo.loto2.toString().padStart(2, '0')}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (viewMode === 'list') {
    return (
      <div className="lottery-card cursor-pointer hover:shadow-lg transition-all duration-200"
           onClick={onClick}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-4 flex-1 min-w-0">
            <img 
              src={lottery.image} 
              alt={lottery.nombre}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">{lottery.titulo}</h3>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{lottery.hora}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{lottery.pais}</span>
                </div>
                {hasResults && (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatTime(lottery.ultimo_sorteo!.fecha_sorteo)}</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                {renderNumbers()}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`flex-shrink-0 ${isFavorite ? 'text-red-500' : 'text-muted-foreground'}`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="lottery-card cursor-pointer hover:shadow-lg transition-all duration-200 animate-slide-up"
         onClick={onClick}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <img 
            src={lottery.image} 
            alt={lottery.nombre}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{lottery.titulo}</h3>
            <p className="text-xs text-muted-foreground">{lottery.pais}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`flex-shrink-0 ${isFavorite ? 'text-red-500' : 'text-muted-foreground'}`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {renderNumbers()}
      
      {lottery.id === 9 && hasResults && (
        <div className="mt-2 text-xs text-muted-foreground text-center">
          <span className="text-blue-400">■</span> Más | <span className="text-red-400">■</span> Super Más
        </div>
      )}

      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>{lottery.hora}</span>
        </div>
        {hasResults && (
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatTime(lottery.ultimo_sorteo!.fecha_sorteo)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
