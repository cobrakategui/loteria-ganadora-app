
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { LotteryAPI } from '@/services/lotteryApi';
import { LotteryResult, LotteryCategory } from '@/types/lottery';
import { LotteryCard } from '@/components/LotteryCard';
import { LotteryDetailModal } from '@/components/LotteryDetailModal';
import { DelayedNumbers } from '@/components/DelayedNumbers';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, Grid, List, Heart } from 'lucide-react';
import { toast } from 'sonner';

export function Results() {
  const { t } = useLanguage();
  const [lotteries, setLotteries] = useState<LotteryResult[]>([]);
  const [filteredLotteries, setFilteredLotteries] = useState<LotteryResult[]>([]);
  const [categories, setCategories] = useState<LotteryCategory[]>([]);
  const [delayedNumbers, setDelayedNumbers] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedLottery, setSelectedLottery] = useState<LotteryResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [favorites, setFavorites] = useLocalStorage<number[]>('favorite-lotteries', []);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterLotteries();
  }, [lotteries, searchTerm, selectedCategory, favorites]);

  const loadData = async (date?: string, categoryId?: number) => {
    try {
      setLoading(true);
      const response = await LotteryAPI.getLotteryResults(date, categoryId);
      console.log('Lottery results:', response);
      
      const allLotteries = [...(response.loteria || []), ...(response.loto || [])];
      
      // Corregir el título del Loto Leidsa
      const correctedLotteries = allLotteries.map(lottery => {
        if (lottery.id === 9) { // Loto Leidsa
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
    } finally {
      setLoading(false);
    }
  };

  const filterLotteries = () => {
    let filtered = [...lotteries];

    // Filter by category
    if (selectedCategory !== 'Todas') {
      filtered = LotteryAPI.filterLotteriesByCategory(filtered, selectedCategory);
    }

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

  const handleSearch = () => {
    const currentDate = selectedDate || today;
    loadData(currentDate);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    loadData(newDate || today);
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

  const formatDate = (dateString: string) => {
    if (!dateString) return t('common.today');
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Group lotteries by category
  const groupedLotteries = filteredLotteries.reduce((acc, lottery) => {
    const category = LotteryAPI.getCategoryByName(lottery.nombre) || LotteryAPI.getCategoryByCompanyId(lottery.company_id);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(lottery);
    return acc;
  }, {} as Record<string, LotteryResult[]>);

  const favoriteLotteries = filteredLotteries.filter(lottery => favorites.includes(lottery.id));

  const categories = ['Todas', 'Nacional', 'Leidsa', 'Real', 'Loteka', 'Americanas', 'Primera', 'La Suerte', 'LoteDom', 'King Lottery', 'Anguila'];

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3">
        <h1 className="text-2xl font-bold gradient-text">
          Resultados de Hoy - {formatDate(selectedDate)}
        </h1>
        
        <div className="space-y-3">
          <div className="relative">
            <Input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              max={today}
              className="w-full date-picker-input cursor-pointer pl-4"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="cursor-pointer">
              <SelectValue placeholder="Todas las loterías" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'Todas' ? 'Todas las loterías' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="bg-lottery-gradient p-4 rounded-lg">
            <Input
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/90 border-0"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Buscar por nombre...</span>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-lottery-gradient' : ''}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-lottery-gradient' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {delayedNumbers && <DelayedNumbers numbers={delayedNumbers} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedLotteries).map(([category, categoryLotteries]) => (
            <div key={category}>
              <h2 className="text-lg font-semibold mb-3 text-lottery-blue">
                {category} ({categoryLotteries.length})
              </h2>
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                : "space-y-2"
              }>
                {categoryLotteries.map((lottery) => (
                  <LotteryCard
                    key={lottery.id}
                    lottery={lottery}
                    onClick={() => handleLotteryClick(lottery)}
                    viewMode={viewMode}
                    isFavorite={favorites.includes(lottery.id)}
                    onToggleFavorite={() => toggleFavorite(lottery)}
                  />
                ))}
              </div>
            </div>
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

      {/* Modal de detalles */}
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
