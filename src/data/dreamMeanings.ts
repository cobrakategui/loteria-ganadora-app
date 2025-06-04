
interface DreamSymbol {
  keyword: string;
  numbers: number[];
  category: 'animals' | 'objects' | 'emotions' | 'actions' | 'places';
}

export const dreamSymbols: DreamSymbol[] = [
  // Animales
  { keyword: 'perro', numbers: [12, 24, 36], category: 'animals' },
  { keyword: 'gato', numbers: [8, 16, 32], category: 'animals' },
  { keyword: 'caballo', numbers: [7, 14, 28], category: 'animals' },
  { keyword: 'pájaro', numbers: [3, 6, 9], category: 'animals' },
  { keyword: 'pez', numbers: [4, 8, 12], category: 'animals' },
  { keyword: 'serpiente', numbers: [1, 11, 21], category: 'animals' },
  { keyword: 'león', numbers: [5, 15, 25], category: 'animals' },
  { keyword: 'elefante', numbers: [9, 18, 27], category: 'animals' },
  
  // Objetos
  { keyword: 'casa', numbers: [13, 26, 39], category: 'objects' },
  { keyword: 'carro', numbers: [17, 34, 51], category: 'objects' },
  { keyword: 'dinero', numbers: [19, 38, 57], category: 'objects' },
  { keyword: 'agua', numbers: [2, 4, 6], category: 'objects' },
  { keyword: 'fuego', numbers: [10, 20, 30], category: 'objects' },
  
  // Emociones
  { keyword: 'miedo', numbers: [13, 31, 66], category: 'emotions' },
  { keyword: 'alegría', numbers: [7, 77, 87], category: 'emotions' },
  { keyword: 'amor', numbers: [14, 41, 74], category: 'emotions' },
  { keyword: 'tristeza', numbers: [22, 44, 88], category: 'emotions' },
];

export const emotions = [
  'alegría', 'miedo', 'tristeza', 'amor', 'ansiedad', 'paz', 'confusión', 'esperanza'
];

export function analyzeDream(description: string, emotions: string[], animals: string[]): number[] {
  const foundNumbers: number[] = [];
  
  // Analizar descripción por palabras clave
  dreamSymbols.forEach(symbol => {
    if (description.toLowerCase().includes(symbol.keyword)) {
      foundNumbers.push(...symbol.numbers);
    }
  });
  
  // Analizar emociones seleccionadas
  emotions.forEach(emotion => {
    const emotionSymbol = dreamSymbols.find(s => s.keyword === emotion);
    if (emotionSymbol) {
      foundNumbers.push(...emotionSymbol.numbers);
    }
  });
  
  // Analizar animales seleccionados
  animals.forEach(animal => {
    const animalSymbol = dreamSymbols.find(s => s.keyword === animal);
    if (animalSymbol) {
      foundNumbers.push(...animalSymbol.numbers);
    }
  });
  
  // Remover duplicados y limitar a rango válido
  const uniqueNumbers = [...new Set(foundNumbers)].filter(num => num >= 1 && num <= 99);
  
  return uniqueNumbers.length > 0 ? uniqueNumbers : [
    Math.floor(Math.random() * 99) + 1,
    Math.floor(Math.random() * 99) + 1,
    Math.floor(Math.random() * 99) + 1
  ];
}
