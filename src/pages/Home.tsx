
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { LotteryAPI } from '@/services/lotteryApi';
import { LotteryResult } from '@/types/lottery';
import { LotteryCard } from '@/components/LotteryCard';
import { LotteryDetailModal } from '@/components/LotteryDetailModal';
import { DelayedNumbers } from '@/components/DelayedNumbers';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function Home() {
  const { t } = useLanguage();
  const [lotteries, setLotteries] = useState<LotteryResult[]>([]);
  const [filteredLotteries, setFilteredLotteries] = useState<LotteryResult[]>([]);
  const [delayedNumbers, setDelayedNumbers] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLottery, setSelectedLottery] = useState<LotteryResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [favorites, setFavorites] = useLocalStorage<number[]>('favorite-lotteries', []);

  useEffect(() => {
    loadData();
  }, [selectedDate, selectedCategory]);

  useEffect(() => {
    filterLotteries();
  }, [lotteries, searchTerm, favorites]);

  const loadData = async () => {
    try {
      setLoading(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const today = format(new Date(), 'yyyy-MM-dd');
      
      console.log('Loading data for date:', dateStr, 'category:', selectedCategory);
      
      let response;
      
      if (selectedCategory === 'todas' && dateStr === today) {
        // Load all lotteries for today without date parameter
        response = await LotteryAPI.getLotteryResults();
      } else {
        // Load with specific date and category
        const companyId = getCategoryCompanyId(selectedCategory);
        response = await LotteryAPI.getLotteryResults(dateStr, companyId);
      }
      
      console.log('API Response:', response);
      
      const allLotteries = [...(response.loteria || []), ...(response.loto || [])];
      
      // Correct Loto Leidsa title
      const correctedLotteries = allLotteries.map(lottery => {
        if (lottery.id === 9) {
          return {
            ...lottery,
            titulo: "LOTO LEIDSA (MIÉRCOLES & SÁBADOS - 8:55 PM)"
          };
        }
        return lottery;
      });
      
      setLotteries(correctedLotteries);
      setDelayedNumbers(response.atrasados || '');
    } catch (error) {
      console.error('Error loading lottery results:', error);
      toast.error('Error al cargar los resultados');
      setLotteries([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryCompanyId = (category: string): number => {
    const categoryMap: Record<string, number> = {
      'todas': 0,
      'dominicanas': 1000,
      'nacional': 1,
      'leidsa': 2,
      'loteka': 3,
      'primera': 4,
      'lotedom': 5,
      'real': 6,
      'suerte': 8
    };
    return categoryMap[category] || 0;
  };

  const filterLotteries = () => {
    let filtered = [...lotteries];

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(lottery => 
        lottery.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lottery.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort favorites first
    filtered.sort((a, b) => {
      const aIsFavorite = favorites.includes(a.id);
      const bIsFavorite = favorites.includes(b.id);
      
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      return 0;
    });

    setFilteredLotteries(filtered);
  };

  const handleCategoryChange = (value: string) => {
    console.log('Category changed to:', value);
    setSelectedCategory(value);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      console.log('Date selected:', date);
      setSelectedDate(date);
    }
  };

  const handleLotteryClick = (lottery: LotteryResult) => {
    setSelectedLottery(lottery);
    setShowModal(true);
  };

  const toggleFavorite = (lottery: LotteryResult) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(lottery.id);
      if (isFavorite) {
        toast.success(`${lottery.titulo} eliminado de favoritos`);
        return prev.filter(id => id !== lottery.id);
      } else {
        toast.success(`${lottery.titulo} agregado a favoritos`);
        return [...prev, lottery.id];
      }
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    
    if (isToday) {
      return 'Hoy';
    }
    
    return date.toLocaleDateString('es-DO', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const categoryOptions = [
    { value: 'todas', label: 'Todas las loterías' },
    { value: 'dominicanas', label: 'Loterías Dominicanas' },
    { value: 'nacional', label: 'Lotería Nacional' },
    { value: 'leidsa', label: 'Leidsa' },
    { value: 'loteka', label: 'Loteka' },
    { value: 'primera', label: 'La Primera' },
    { value: 'lotedom', label: 'LoteDom' },
    { value: 'real', label: 'Loto Real' },
    { value: 'suerte', label: 'La Suerte' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3">
        <h1 className="text-2xl font-bold gradient-text">
          Resultados de {formatDate(selectedDate)}
        </h1>
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "dd/MM/yyyy") : <span>Seleccionar fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date > new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          {/* Category Selector */}
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona categoría" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {delayedNumbers && <DelayedNumbers numbers={delayedNumbers} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLotteries.map((lottery) => (
            <LotteryCard
              key={lottery.id}
              lottery={lottery}
              onClick={() => handleLotteryClick(lottery)}
              viewMode="grid"
              isFavorite={favorites.includes(lottery.id)}
              onToggleFavorite={() => toggleFavorite(lottery)}
            />
          ))}
        </div>
      )}

      {!loading && filteredLotteries.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchTerm ? 'No se encontraron resultados para la búsqueda' : 'No se encontraron resultados para la fecha seleccionada'}
          </p>
        </div>
      )}

      <LotteryDetailModal
        lottery={selectedLottery}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onToggleFavorite={toggleFavorite}
        isFavorite={selectedLottery ? favorites.includes(selectedLottery.id) : false}
      />
    </div>
  );
}
