
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';

interface ResultsViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function ResultsViewToggle({ viewMode, onViewModeChange }: ResultsViewToggleProps) {
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>Buscar por nombre...</span>
      <div className="flex gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
          className={viewMode === 'grid' ? 'bg-lottery-gradient' : ''}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('list')}
          className={viewMode === 'list' ? 'bg-lottery-gradient' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
