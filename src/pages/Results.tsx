
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { LotteryAPI } from '@/services/lotteryApi';
import { LotteryResult } from '@/types/lottery';
import { LotteryDetailModal } from '@/components/LotteryDetailModal';
import { DelayedNumbers } from '@/components/DelayedNumbers';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ResultsHeader } from '@/components/results/ResultsHeader';
import { ResultsFilters } from '@/components/results/ResultsFilters';
import { ResultsViewToggle } from '@/components/results/ResultsViewToggle';
import { LotterySection } from '@/components/results/LotterySection';
import { EmptyState } from '@/components/results/EmptyState';
import { toast } from 'sonner';

export function Results() {
  const [lotteries, setLotteries] = useState<LotteryResult[]>([]);
  const [filteredLotteries, setFilteredLotteries] = useState<LotteryResult[]>([]);
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

  // Group lotteries by category
  const groupedLotteries = filteredLotteries.reduce((acc, lottery) => {
    const category = LotteryAPI.getCategoryByName(lottery.nombre) || LotteryAPI.getCategoryByCompanyId(lottery.company_id);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(lottery);
    return acc;
  }, {} as Record<string, LotteryResult[]>);

  const categoryOptions = ['Todas', 'Nacional', 'Leidsa', 'Real', 'Loteka', 'Americanas', 'Primera', 'La Suerte', 'LoteDom', 'King Lottery', 'Anguila'];

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3">
        <ResultsHeader selectedDate={selectedDate} />
        
        <ResultsFilters
          selectedDate={selectedDate}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          today={today}
          categoryOptions={categoryOptions}
          onDateChange={handleDateChange}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchTerm}
        />

        <ResultsViewToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {delayedNumbers && <DelayedNumbers numbers={delayedNumbers} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedLotteries).map(([category, categoryLotteries]) => (
            <LotterySection
              key={category}
              category={category}
              lotteries={categoryLotteries}
              viewMode={viewMode}
              favorites={favorites}
              onLotteryClick={handleLotteryClick}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

      {!loading && filteredLotteries.length === 0 && (
        <EmptyState searchTerm={searchTerm} />
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
