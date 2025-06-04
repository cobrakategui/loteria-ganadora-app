
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LotteryAPI } from '@/services/lotteryApi';
import { LotteryCategory } from '@/types/lottery';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

export function Categories() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<LotteryCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<LotteryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await LotteryAPI.getLotteryCategories();
      setCategories(response);
      setFilteredCategories(response);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: LotteryCategory) => {
    console.log('Category clicked:', category);
    toast.info(`Ver sorteos de ${category.nombre}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3">
        <h1 className="text-2xl font-bold gradient-text">
          {t('categories.title')}
        </h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <Card 
              key={category.id} 
              className="lottery-card hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {category.nombre}
                    </h3>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Números: {category.numero_total}</span>
                      <span>Premios: {category.cantidad_premios}</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    category.isLoto 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {category.isLoto ? 'Loto' : 'Quiniela'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredCategories.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchTerm ? 'No se encontraron categorías que coincidan con la búsqueda' : 'No hay categorías disponibles'}
          </p>
        </div>
      )}
    </div>
  );
}
