import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Calendar, Coffee, Moon, Shuffle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { dreamSymbols, emotions, analyzeDream } from '@/data/dreamMeanings';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface LotteryConfig {
  name: string;
  count: number;
}

const lotteryConfigs: { [key: string]: LotteryConfig } = {
  'loto-leidsa': { name: 'Loto Leidsa', count: 6 },
  'mega-chance': { name: 'Mega Chance', count: 5 },
  'super-kino-tv': { name: 'Super Kino TV', count: 20 },
  'loto-pool-real': { name: 'Loto Pool Real', count: 5 },
  'quiniela-pale': { name: 'Quiniela Pale', count: 2 },
};

export function Generator() {
  const { t } = useLanguage();
  const [selectedLottery, setSelectedLottery] = useState<string>('');
  const [numberCount, setNumberCount] = useState(6);
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const [lotoMas, setLotoMas] = useState<number | null>(null);
  const [lotoSuper, setLotoSuper] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [birthDate, setBirthDate] = useState('');
  
  const [dreamDescription, setDreamDescription] = useState('');
  const [dreamEmotions, setDreamEmotions] = useState<string[]>([]);
  const [dreamAnimals, setDreamAnimals] = useState<string[]>([]);
  
  const [coffeeReading, setCoffeeReading] = useState('');
  const [coffeeFeeling, setCoffeeFeeling] = useState('');
  
  const [history, setHistory] = useLocalStorage<number[][]>('generated-numbers-history', []);

  const generateRandomNumbers = () => {
    const numbers = Array.from({ length: numberCount }, () => Math.floor(Math.random() * 99) + 1);
    setGeneratedNumbers(numbers);
    setLotoMas(null);
    setLotoSuper(null);
    setShowConfetti(true);
    setHistory(prev => [...prev, numbers]);
  };

  const generateHotNumbers = () => {
    const numbers = Array.from({ length: numberCount }, () => Math.floor(Math.random() * 99) + 1);
    setGeneratedNumbers(numbers);
    setLotoMas(null);
    setLotoSuper(null);
    setShowConfetti(true);
    setHistory(prev => [...prev, numbers]);
  };

  const generateBirthdayNumbers = () => {
    if (!birthDate) return;

    const date = new Date(birthDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    let numbers = [day, month, year % 100].sort(() => Math.random() - 0.5);
    while (numbers.length < numberCount) {
      numbers.push(Math.floor(Math.random() * 99) + 1);
    }
    numbers = numbers.slice(0, numberCount);

    setGeneratedNumbers(numbers);
    setLotoMas(null);
    setLotoSuper(null);
    setShowConfetti(true);
    setHistory(prev => [...prev, numbers]);
  };

  const generateDreamNumbers = async () => {
    if (!dreamDescription.trim() && dreamEmotions.length === 0 && dreamAnimals.length === 0) {
      toast.error('Por favor, describe tu sueño o selecciona elementos.');
      return;
    }

    const analyzedNumbers = analyzeDream(dreamDescription, dreamEmotions, dreamAnimals);
    let numbers = analyzedNumbers.sort(() => Math.random() - 0.5);
    while (numbers.length < numberCount) {
      numbers.push(Math.floor(Math.random() * 99) + 1);
    }
    numbers = numbers.slice(0, numberCount);

    setGeneratedNumbers(numbers);
    setLotoMas(null);
    setLotoSuper(null);
    setShowConfetti(true);
    setHistory(prev => [...prev, numbers]);
  };

  const generateCoffeeNumbers = () => {
    if (!coffeeReading.trim()) {
      toast.error('Por favor, describe lo que ves en tu taza de café.');
      return;
    }

    let numbers = [];
    for (let i = 0; i < numberCount; i++) {
      numbers.push(Math.floor(Math.random() * 99) + 1);
    }

    setGeneratedNumbers(numbers);
    setLotoMas(null);
    setLotoSuper(null);
    setShowConfetti(true);
    setHistory(prev => [...prev, numbers]);
  };

  const clearAll = () => {
    setGeneratedNumbers([]);
    setLotoMas(null);
    setLotoSuper(null);
    setShowConfetti(false);
  };

  const renderGeneratedNumbers = () => {
    if (generatedNumbers.length === 0 && !lotoMas && !lotoSuper) return null;

    return (
      <Card className="mt-6 bg-lottery-gradient/10 border-2 border-lottery-blue/20">
        <CardHeader className="text-center">
          <CardTitle className="gradient-text flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5" />
            Números Generados
          </CardTitle>
          <Button 
            onClick={clearAll}
            variant="outline" 
            size="sm"
            className="mx-auto mt-2"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Generar Otros
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generatedNumbers.length > 0 && (
              <div>
                <p className="text-sm text-center mb-2 text-muted-foreground">Números Principales</p>
                <div className="numbers-scroll">
                  <div className="numbers-container">
                    {generatedNumbers.map((num, index) => (
                      <div key={index} className="lottery-number animate-bounce-in">
                        {num.toString().padStart(2, '0')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {selectedLottery === 'loto-leidsa' && (lotoMas || lotoSuper) && (
              <div className="space-y-3">
                {lotoMas && (
                  <div>
                    <p className="text-sm text-center mb-2 text-blue-400">Loto Más (1-12)</p>
                    <div className="flex justify-center">
                      <div className="lottery-number-mas animate-bounce-in">
                        {lotoMas.toString().padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                )}
                
                {lotoSuper && (
                  <div>
                    <p className="text-sm text-center mb-2 text-red-400">Super Más (1-15)</p>
                    <div className="flex justify-center">
                      <div className="lottery-number-super animate-bounce-in">
                        {lotoSuper.toString().padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          {t('generator.title')}
        </h1>
        <p className="text-muted-foreground">
          Genera números de la suerte usando diferentes métodos
        </p>
      </div>

      {/* Configuración general */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Configuración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Seleccionar Sorteo (Opcional):</label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setSelectedLottery('');
                setNumberCount(6);
              }}
            >
              Limpiar
            </Button>
          </div>
          
          <Select value={selectedLottery} onValueChange={(value) => {
            setSelectedLottery(value);
            const config = lotteryConfigs[value as keyof typeof lotteryConfigs];
            if (config) {
              setNumberCount(config.count);
            }
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un sorteo específico" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(lotteryConfigs).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.name} - {config.count} números
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {!selectedLottery && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Cantidad de números a generar:
              </label>
              <Input
                type="number"
                min="1"
                max="20"
                value={numberCount}
                onChange={(e) => setNumberCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 6)))}
                className="w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {renderGeneratedNumbers()}

      <Tabs defaultValue="random" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="random" className="text-xs">Aleatorio</TabsTrigger>
          <TabsTrigger value="dreams" className="text-xs">Sueños</TabsTrigger>
          <TabsTrigger value="birthday" className="text-xs">Cumpleaños</TabsTrigger>
          <TabsTrigger value="coffee" className="text-xs">Café</TabsTrigger>
        </TabsList>

        <TabsContent value="random" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shuffle className="h-5 w-5" />
                Generador Aleatorio
              </CardTitle>
              <CardDescription>
                Genera números completamente al azar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={generateRandomNumbers} 
                className="w-full bg-lottery-gradient"
                size="lg"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generar Números Aleatorios
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Números Calientes
              </CardTitle>
              <CardDescription>
                Números basados en las tendencias más actuales de las loterías
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={generateHotNumbers} 
                className="w-full bg-lottery-gradient"
                size="lg"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Generar Números Calientes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dreams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                Generador por Sueños
              </CardTitle>
              <CardDescription>
                Describe tu sueño y selecciona elementos para generar números
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Describe tu sueño:
                </label>
                <Textarea
                  placeholder="Describe lo que soñaste..."
                  value={dreamDescription}
                  onChange={(e) => setDreamDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  ¿Cómo te hizo sentir el sueño?
                </label>
                <div className="flex flex-wrap gap-2">
                  {emotions.map((emotion) => (
                    <Badge
                      key={emotion}
                      variant={dreamEmotions.includes(emotion) ? "default" : "outline"}
                      className={`cursor-pointer ${dreamEmotions.includes(emotion) ? 'bg-lottery-gradient' : ''}`}
                      onClick={() => {
                        setDreamEmotions(prev =>
                          prev.includes(emotion)
                            ? prev.filter(e => e !== emotion)
                            : [...prev, emotion]
                        );
                      }}
                    >
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  ¿Con qué animales soñaste?
                </label>
                <div className="flex flex-wrap gap-2">
                  {dreamSymbols.filter(s => s.category === 'animals').map((symbol) => (
                    <Badge
                      key={symbol.keyword}
                      variant={dreamAnimals.includes(symbol.keyword) ? "default" : "outline"}
                      className={`cursor-pointer ${dreamAnimals.includes(symbol.keyword) ? 'bg-lottery-gradient' : ''}`}
                      onClick={() => {
                        setDreamAnimals(prev =>
                          prev.includes(symbol.keyword)
                            ? prev.filter(a => a !== symbol.keyword)
                            : [...prev, symbol.keyword]
                        );
                      }}
                    >
                      {symbol.keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                onClick={generateDreamNumbers} 
                className="w-full bg-lottery-gradient"
                size="lg"
                disabled={!dreamDescription.trim() && dreamEmotions.length === 0 && dreamAnimals.length === 0}
              >
                <Moon className="h-4 w-4 mr-2" />
                Generar Números del Sueño
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="birthday" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Generador por Fecha de Nacimiento
              </CardTitle>
              <CardDescription>
                Usa tu fecha de nacimiento para generar números especiales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Fecha de nacimiento:
                </label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full"
                />
              </div>

              <Button 
                onClick={generateBirthdayNumbers} 
                className="w-full bg-lottery-gradient"
                size="lg"
                disabled={!birthDate}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Generar Números de Cumpleaños
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coffee" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5" />
                Lectura de Café
              </CardTitle>
              <CardDescription>
                Describe lo que ves en tu taza de café para generar números
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  ¿Qué formas o patrones ves en el café?
                </label>
                <Textarea
                  placeholder="Describe las formas, manchas o patrones que ves en el café..."
                  value={coffeeReading}
                  onChange={(e) => setCoffeeReading(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  ¿Cómo te hace sentir lo que ves?
                </label>
                <Select value={coffeeFeeling} onValueChange={setCoffeeFeeling}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un sentimiento" />
                  </SelectTrigger>
                  <SelectContent>
                    {emotions.map((emotion) => (
                      <SelectItem key={emotion} value={emotion}>
                        {emotion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={generateCoffeeNumbers} 
                className="w-full bg-lottery-gradient"
                size="lg"
                disabled={!coffeeReading.trim()}
              >
                <Coffee className="h-4 w-4 mr-2" />
                Generar Números del Café
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {history.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Historial ({history.length})
            </CardTitle>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setHistory([])}
            >
              Limpiar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.slice(-5).reverse().map((nums, index) => (
                <div key={index} className="numbers-scroll">
                  <div className="numbers-container">
                    {nums.map((num, i) => (
                      <div key={i} className="lottery-number text-xs">
                        {num.toString().padStart(2, '0')}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              {['🎰', '🎲', '🍀', '⭐', '💫'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
