
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ResultsFiltersProps {
  selectedDate: string;
  selectedCategory: string;
  searchTerm: string;
  today: string;
  categoryOptions: string[];
  onDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export function ResultsFilters({
  selectedDate,
  selectedCategory,
  searchTerm,
  today,
  categoryOptions,
  onDateChange,
  onCategoryChange,
  onSearchChange
}: ResultsFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          type="date"
          value={selectedDate}
          onChange={onDateChange}
          max={today}
          className="w-full date-picker-input cursor-pointer pl-4"
        />
      </div>
      
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="cursor-pointer">
          <SelectValue placeholder="Todas las loterías" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          {categoryOptions.map((category) => (
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
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-white/90 border-0"
        />
      </div>
    </div>
  );
}
