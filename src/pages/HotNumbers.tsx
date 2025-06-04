
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LotteryAPI } from '@/services/lotteryApi';
import { HotNumber, LotteryCategory } from '@/types/lottery';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export function HotNumbers() {
  const { t } = useLanguage();
  const [hotNumbers, setHotNumbers] = useState<HotNumber[]>([]);
  const [categories, setCategories] = useState<LotteryCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await LotteryAPI.getLotteryCategories();
      setCategories(response);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Error al cargar las categorías');
    }
  };

  const loadHotNumbers = async () => {
    if (!selectedCategory) {
      toast.error('Por favor selecciona una lotería');
      return;
    }

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const response = await LotteryAPI.getHotNumbers(parseInt(selectedCategory), today);
      setHotNumbers(response);
    } catch (error) {
      console.error('Error loading hot numbers:', error);
      toast.error('Error al cargar los números calientes');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3">
        <h1 className="text-2xl font-bold gradient-text">
          {t('hot-numbers.title')}
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar lotería" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={loadHotNumbers} className="bg-lottery-gradient hover:opacity-90">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : hotNumbers.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotNumbers.slice(0, 10).map((hotNumber, index) => (
              <Card key={index} className="lottery-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="lottery-number">
                      {hotNumber.numero.padStart(2, '0')}
                    </div>
                    <div className="flex items-center text-lottery-pink">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">#{index + 1}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Última vez:</span>
                      <span className="font-medium">{formatDate(hotNumber.ultimaFecha)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Días transcurridos:</span>
                      <span className="font-bold text-lottery-pink">{hotNumber.diasTranscurridos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Retraso máximo:</span>
                      <span className="font-medium">{hotNumber.retrasoMax}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-lottery-gradient flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <p className="text-muted-foreground">
            Selecciona una lotería para ver los números más calientes
          </p>
        </div>
      )}
    </div>
  );
}
