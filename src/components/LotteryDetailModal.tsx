
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LotteryResult, LotteryHistory } from '@/types/lottery';
import { LotteryAPI } from '@/services/lotteryApi';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Share, Copy, Heart, Calendar, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface LotteryDetailModalProps {
  lottery: LotteryResult | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (lottery: LotteryResult) => void;
  isFavorite: boolean;
}

export function LotteryDetailModal({ 
  lottery, 
  isOpen, 
  onClose, 
  onToggleFavorite, 
  isFavorite 
}: LotteryDetailModalProps) {
  const [history, setHistory] = useState<LotteryHistory[]>([]);
  const [predictions, setPredictions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lottery && isOpen) {
      loadLotteryData();
    }
  }, [lottery, isOpen]);

  const loadLotteryData = async () => {
    if (!lottery) return;
    
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      // Cargar historial
      const historyResponse = await LotteryAPI.getLotteryHistory(lottery.id, today);
      setHistory(historyResponse.historial.slice(0, 10));
      
      // Generar predicciones basadas en números repetidos
      if (historyResponse.numerosRepetidos.length > 0) {
        const predictedNumbers = historyResponse.numerosRepetidos
          .slice(0, lottery.cantidad_premios)
          .map(num => Number(num));
        setPredictions(predictedNumbers);
      } else {
        // Generar números aleatorios si no hay datos
        const randomNumbers = Array.from({length: lottery.cantidad_premios}, () => 
          Math.floor(Math.random() * lottery.numero_total) + 1
        );
        setPredictions(randomNumbers);
      }
    } catch (error) {
      console.error('Error loading lottery data:', error);
      // Generar números aleatorios como fallback
      const randomNumbers = Array.from({length: lottery.cantidad_premios}, () => 
        Math.floor(Math.random() * lottery.numero_total) + 1
      );
      setPredictions(randomNumbers);
    } finally {
      setLoading(false);
    }
  };

  const parseNumbers = (premios: string): string[] => {
    return premios.split('-').filter(num => num.trim() !== '');
  };

  const formatTime = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-DO', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const renderLotteryNumbers = (numbers: string[], loto1?: number | null, loto2?: number | null) => {
    const hasMany = numbers.length > 10;
    
    return (
      <div className="numbers-scroll">
        <div className={hasMany ? 'numbers-container-horizontal' : 'numbers-container'}>
          {numbers.map((number, index) => (
            <div key={index} className="lottery-number flex-shrink-0">
              {number.padStart(2, '0')}
            </div>
          ))}
          {lottery?.id === 9 && loto1 !== null && loto1 !== undefined && (
            <div className="lottery-number-mas flex-shrink-0">
              {loto1.toString().padStart(2, '0')}
            </div>
          )}
          {lottery?.id === 9 && loto2 !== null && loto2 !== undefined && (
            <div className="lottery-number-super flex-shrink-0">
              {loto2.toString().padStart(2, '0')}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderHistoryNumbers = (premios: string, loto1?: number | null, loto2?: number | null) => {
    const historyNumbers = parseNumbers(premios);
    const hasMany = historyNumbers.length > 10;
    
    return (
      <div className="numbers-scroll">
        <div className={hasMany ? 'numbers-container-horizontal' : 'flex gap-1 flex-wrap'}>
          {historyNumbers.map((num, i) => (
            <span key={i} className="text-xs font-medium px-2 py-1 bg-lottery-gradient text-white rounded flex-shrink-0">
              {num.padStart(2, '0')}
            </span>
          ))}
          {lottery?.id === 9 && loto1 !== null && loto1 !== undefined && (
            <span className="text-xs font-medium px-2 py-1 text-white rounded flex-shrink-0" style={{ background: '#60a5fa' }}>
              {loto1.toString().padStart(2, '0')}
            </span>
          )}
          {lottery?.id === 9 && loto2 !== null && loto2 !== undefined && (
            <span className="text-xs font-medium px-2 py-1 text-white rounded flex-shrink-0" style={{ background: '#ef4444' }}>
              {loto2.toString().padStart(2, '0')}
            </span>
          )}
        </div>
      </div>
    );
  };

  const handleShare = () => {
    if (!lottery) return;
    
    const numbers = lottery.ultimo_sorteo ? parseNumbers(lottery.ultimo_sorteo.premios) : [];
    const masNumber = lottery.ultimo_sorteo?.loto1 ? ` Más: ${lottery.ultimo_sorteo.loto1}` : '';
    const superNumber = lottery.ultimo_sorteo?.loto2 ? ` Super: ${lottery.ultimo_sorteo.loto2}` : '';
    const text = `🎰 ${lottery.titulo}\n📅 ${lottery.ultimo_sorteo ? formatTime(lottery.ultimo_sorteo.fecha_sorteo) : 'Sin resultados'}\n🎯 Números: ${numbers.join('-')}${masNumber}${superNumber}\n⏰ Hora: ${lottery.hora}\n\n¡Descarga Loterías Dominicanas Today!`;
    
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Resultado copiado al portapapeles');
    }
  };

  const handleCopy = () => {
    if (!lottery) return;
    
    const numbers = lottery.ultimo_sorteo ? parseNumbers(lottery.ultimo_sorteo.premios) : [];
    const masNumber = lottery.ultimo_sorteo?.loto1 ? ` Más: ${lottery.ultimo_sorteo.loto1}` : '';
    const superNumber = lottery.ultimo_sorteo?.loto2 ? ` Super: ${lottery.ultimo_sorteo.loto2}` : '';
    const text = `${lottery.titulo} - ${numbers.join('-')}${masNumber}${superNumber} - ${lottery.hora}`;
    
    navigator.clipboard.writeText(text);
    toast.success('Números copiados al portapapeles');
  };

  if (!lottery) return null;

  const numbers = lottery.ultimo_sorteo ? parseNumbers(lottery.ultimo_sorteo.premios) : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="gradient-text">{lottery.titulo}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(lottery)}
              className={isFavorite ? 'text-red-500' : 'text-muted-foreground'}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica */}
          <div className="lottery-card">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={lottery.image} 
                alt={lottery.nombre}
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div>
                <h3 className="font-semibold text-lg">{lottery.titulo}</h3>
                <p className="text-sm text-muted-foreground">{lottery.pais}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-lottery-blue" />
                <span>{lottery.hora}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-lottery-blue" />
                <span>{lottery.ultimo_sorteo ? formatTime(lottery.ultimo_sorteo.fecha_sorteo) : 'Sin resultados'}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-3">{lottery.descripcion}</p>
          </div>

          {/* Último sorteo */}
          {numbers.length > 0 && (
            <div className="lottery-card">
              <h4 className="font-semibold mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-lottery-blue" />
                Último Sorteo
              </h4>
              {renderLotteryNumbers(numbers, lottery.ultimo_sorteo?.loto1, lottery.ultimo_sorteo?.loto2)}
              {lottery.id === 9 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <span className="text-blue-400">■</span> Más (1-12) | <span className="text-red-400">■</span> Super Más (1-15)
                </div>
              )}
            </div>
          )}

          {/* Predicciones */}
          {predictions.length > 0 && (
            <div className="lottery-card">
              <h4 className="font-semibold mb-3 text-lottery-blue">
                Pronóstico para el Próximo Sorteo
              </h4>
              <div className="numbers-scroll">
                <div className="numbers-container">
                  {predictions.map((number, index) => (
                    <div key={index} className="lottery-number text-xs animate-slide-up flex-shrink-0">
                      {number.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                * Basado en análisis de sorteos anteriores
              </p>
            </div>
          )}

          {/* Historial reciente */}
          {loading ? (
            <LoadingSpinner />
          ) : history.length > 0 && (
            <div className="lottery-card">
              <h4 className="font-semibold mb-3">Historial Reciente</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {history.slice(0, 5).map((item, index) => (
                  <div key={item.id} className="flex items-start justify-between p-2 bg-muted/30 rounded gap-2">
                    <div className="flex-1 min-w-0">
                      {renderHistoryNumbers(item.premios, item.loto1, item.loto2)}
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0 mt-1">
                      {formatTime(item.fecha_sorteo)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-2">
            <Button onClick={handleShare} className="flex-1 bg-lottery-gradient">
              <Share className="h-4 w-4 mr-2" />
              Compartir
            </Button>
            <Button onClick={handleCopy} variant="outline" className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
