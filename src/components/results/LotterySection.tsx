
import React from 'react';
import { LotteryResult } from '@/types/lottery';
import { LotteryCard } from '@/components/LotteryCard';

interface LotterySectionProps {
  category: string;
  lotteries: LotteryResult[];
  viewMode: 'grid' | 'list';
  favorites: number[];
  onLotteryClick: (lottery: LotteryResult) => void;
  onToggleFavorite: (lottery: LotteryResult) => void;
}

export function LotterySection({
  category,
  lotteries,
  viewMode,
  favorites,
  onLotteryClick,
  onToggleFavorite
}: LotterySectionProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 text-lottery-blue">
        {category} ({lotteries.length})
      </h2>
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
        : "space-y-2"
      }>
        {lotteries.map((lottery) => (
          <LotteryCard
            key={lottery.id}
            lottery={lottery}
            onClick={() => onLotteryClick(lottery)}
            viewMode={viewMode}
            isFavorite={favorites.includes(lottery.id)}
            onToggleFavorite={() => onToggleFavorite(lottery)}
          />
        ))}
      </div>
    </div>
  );
}
