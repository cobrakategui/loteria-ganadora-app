
import React from 'react';
import { LotteryResult } from '@/types/lottery';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Copy, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LotteryCardProps {
  lottery: LotteryResult;
  onClick: () => void;
  viewMode: 'grid' | 'list';
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function LotteryCard({ lottery, onClick, viewMode, isFavorite, onToggleFavorite }: LotteryCardProps) {
  const formatTime = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-DO', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };

  const copyToClipboard = async () => {
    if (!lottery.ultimo_sorteo?.premios) {
      toast.error('No hay resultados para copiar');
      return;
    }
    
    const numbers = lottery.ultimo_sorteo.premios.split('-').filter(n => n.trim());
    const numbersText = numbers.join(' - ');
    
    try {
      await navigator.clipboard.writeText(`${lottery.titulo}: ${numbersText}`);
      toast.success('Números copiados al portapapeles');
    } catch (error) {
      toast.error('Error al copiar');
    }
  };

  const shareResult = async () => {
    if (!lottery.ultimo_sorteo?.premios) {
      toast.error('No hay resultados para compartir');
      return;
    }
    
    const numbers = lottery.ultimo_sorteo.premios.split('-').filter(n => n.trim());
    const numbersText = numbers.join(' - ');
    const shareText = `🎲 ¡Resultados de ${lottery.titulo}! 🍀\n\n🔢 Números ganadores: ${numbersText}\n📅 Fecha: ${formatTime(lottery.ultimo_sorteo.fecha_sorteo)}\n\n🎯 ¡Descarga nuestra app para más resultados!\n🌐 vilug.com`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Resultados de ${lottery.titulo}`,
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        toast.success('Resultado copiado para compartir');
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success('Resultado copiado para compartir');
    }
  };

  const renderNumbers = () => {
    if (!lottery.ultimo_sorteo?.premios) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">Sin resultados</p>
        </div>
      );
    }

    const numbers = lottery.ultimo_sorteo.premios.split('-').filter(n => n.trim());
    const positions = ['1ro', '2do', '3ro', '4to', '5to', '6to', '7mo', '8vo', '9no', '10mo'];
    
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap justify-center gap-3">
          {numbers.map((number, index) => (
            <div key={index} className="flex flex-col items-center space-y-1">
              <div className="lottery-number number-reveal">
                {number.trim().padStart(2, '0')}
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {positions[index] || `${index + 1}°`}
              </span>
            </div>
          ))}
          
          {/* Loto Leidsa additional numbers */}
          {lottery.id === 9 && lottery.ultimo_sorteo?.loto1 !== null && lottery.ultimo_sorteo?.loto1 !== undefined && (
            <div className="flex flex-col items-center space-y-1">
              <div className="lottery-number-loto1 number-reveal">
                {lottery.ultimo_sorteo.loto1.toString().padStart(2, '0')}
              </div>
              <span className="text-xs text-blue-400 font-medium">Más</span>
            </div>
          )}
          
          {lottery.id === 9 && lottery.ultimo_sorteo?.loto2 !== null && lottery.ultimo_sorteo?.loto2 !== undefined && (
            <div className="flex flex-col items-center space-y-1">
              <div className="lottery-number-loto2 number-reveal">
                {lottery.ultimo_sorteo.loto2.toString().padStart(2, '0')}
              </div>
              <span className="text-xs text-red-400 font-medium">Super</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="lottery-card p-4 cursor-pointer" onClick={onClick}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img 
            src={lottery.image} 
            alt={lottery.titulo}
            className="w-10 h-10 rounded-lg object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div>
            <h3 className="font-bold text-sm text-center gradient-text">Sorteo Ganador</h3>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-muted-foreground">{lottery.hora}</div>
          <div className="text-xs text-muted-foreground">
            {lottery.ultimo_sorteo?.fecha_sorteo && formatTime(lottery.ultimo_sorteo.fecha_sorteo)}
          </div>
        </div>
      </div>

      {/* Lottery Title */}
      <h2 className="text-center font-semibold text-lg mb-4 text-foreground">
        {lottery.titulo}
      </h2>

      {/* Numbers */}
      {renderNumbers()}

      {/* Website */}
      <div className="text-center mt-4 mb-4">
        <span className="text-xs font-medium gradient-text">vilug.com</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            // Ver anterior functionality
          }}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          <Eye className="h-3 w-3 mr-1" />
          Ver anterior
        </Button>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              shareResult();
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard();
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <Copy className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={cn("", isFavorite ? 'text-red-500' : 'text-muted-foreground')}
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
          </Button>
        </div>
      </div>
    </div>
  );
}
