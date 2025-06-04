
export interface DreamSymbol {
  keyword: string;
  numbers: number[];
  category: 'animals' | 'emotions' | 'elements' | 'death' | 'objects' | 'places' | 'actions';
}

export const dreamSymbols: DreamSymbol[] = [
  // Animales
  { keyword: 'perro', numbers: [12, 45, 78], category: 'animals' },
  { keyword: 'gato', numbers: [23, 56, 89], category: 'animals' },
  { keyword: 'caballo', numbers: [34, 67, 90], category: 'animals' },
  { keyword: 'serpiente', numbers: [1, 11, 21], category: 'animals' },
  { keyword: 'león', numbers: [7, 17, 77], category: 'animals' },
  { keyword: 'águila', numbers: [3, 33, 73], category: 'animals' },
  { keyword: 'pescado', numbers: [5, 15, 25], category: 'animals' },
  { keyword: 'mariposa', numbers: [9, 19, 29], category: 'animals' },
  { keyword: 'araña', numbers: [13, 31, 83], category: 'animals' },
  { keyword: 'elefante', numbers: [8, 18, 88], category: 'animals' },

  // Emociones
  { keyword: 'miedo', numbers: [4, 14, 44], category: 'emotions' },
  { keyword: 'alegría', numbers: [6, 16, 66], category: 'emotions' },
  { keyword: 'tristeza', numbers: [2, 22, 72], category: 'emotions' },
  { keyword: 'amor', numbers: [69, 96, 36], category: 'emotions' },
  { keyword: 'ira', numbers: [87, 97, 47], category: 'emotions' },
  { keyword: 'paz', numbers: [50, 60, 70], category: 'emotions' },
  { keyword: 'ansiedad', numbers: [24, 42, 84], category: 'emotions' },
  { keyword: 'felicidad', numbers: [37, 63, 93], category: 'emotions' },

  // Elementos
  { keyword: 'agua', numbers: [26, 62, 92], category: 'elements' },
  { keyword: 'fuego', numbers: [48, 74, 94], category: 'elements' },
  { keyword: 'tierra', numbers: [38, 58, 68], category: 'elements' },
  { keyword: 'aire', numbers: [27, 52, 82], category: 'elements' },
  { keyword: 'mar', numbers: [35, 53, 85], category: 'elements' },
  { keyword: 'río', numbers: [41, 51, 61], category: 'elements' },
  { keyword: 'montaña', numbers: [76, 86, 96], category: 'elements' },
  { keyword: 'bosque', numbers: [39, 49, 79], category: 'elements' },
  { keyword: 'lluvia', numbers: [32, 54, 64], category: 'elements' },
  { keyword: 'sol', numbers: [99, 0, 11], category: 'elements' },
  { keyword: 'luna', numbers: [28, 46, 74], category: 'elements' },

  // Muerte
  { keyword: 'muerte', numbers: [0, 10, 20], category: 'death' },
  { keyword: 'ahogamiento', numbers: [43, 65, 87], category: 'death' },
  { keyword: 'caída', numbers: [75, 57, 95], category: 'death' },
  { keyword: 'enfermedad', numbers: [80, 81, 91], category: 'death' },
  { keyword: 'accidente', numbers: [55, 65, 75], category: 'death' },

  // Objetos
  { keyword: 'casa', numbers: [40, 71, 81], category: 'objects' },
  { keyword: 'carro', numbers: [59, 95, 85], category: 'objects' },
  { keyword: 'dinero', numbers: [77, 88, 99], category: 'objects' },
  { keyword: 'libro', numbers: [30, 3, 33], category: 'objects' },
  { keyword: 'espejo', numbers: [44, 84, 48], category: 'objects' },
  { keyword: 'teléfono', numbers: [56, 65, 76], category: 'objects' },

  // Lugares
  { keyword: 'iglesia', numbers: [21, 12, 31], category: 'places' },
  { keyword: 'escuela', numbers: [45, 54, 64], category: 'places' },
  { keyword: 'hospital', numbers: [67, 76, 86], category: 'places' },
  { keyword: 'playa', numbers: [89, 98, 8], category: 'places' },

  // Acciones
  { keyword: 'volar', numbers: [90, 9, 19], category: 'actions' },
  { keyword: 'correr', numbers: [91, 19, 29], category: 'actions' },
  { keyword: 'bailar', numbers: [92, 29, 39], category: 'actions' },
  { keyword: 'cantar', numbers: [93, 39, 49], category: 'actions' },
  { keyword: 'llorar', numbers: [94, 49, 59], category: 'actions' }
];

export const emotions = [
  'feliz', 'triste', 'asustado', 'emocionado', 'confundido', 'ansioso', 
  'relajado', 'enojado', 'esperanzado', 'nostálgico', 'curioso', 'preocupado'
];

export function analyzeDream(description: string, selectedEmotions: string[], selectedAnimals: string[]): number[] {
  const foundSymbols: DreamSymbol[] = [];
  const lowerDescription = description.toLowerCase();

  // Buscar palabras clave en la descripción
  dreamSymbols.forEach(symbol => {
    if (lowerDescription.includes(symbol.keyword)) {
      foundSymbols.push(symbol);
    }
  });

  // Añadir símbolos basados en emociones seleccionadas
  selectedEmotions.forEach(emotion => {
    const emotionSymbol = dreamSymbols.find(s => s.keyword === emotion);
    if (emotionSymbol) foundSymbols.push(emotionSymbol);
  });

  // Añadir símbolos basados en animales seleccionados
  selectedAnimals.forEach(animal => {
    const animalSymbol = dreamSymbols.find(s => s.keyword === animal);
    if (animalSymbol) foundSymbols.push(animalSymbol);
  });

  // Si no se encuentran símbolos, generar números aleatorios
  if (foundSymbols.length === 0) {
    return Array.from({length: 3}, () => Math.floor(Math.random() * 100));
  }

  // Obtener números de los símbolos encontrados
  const allNumbers: number[] = [];
  foundSymbols.forEach(symbol => {
    allNumbers.push(...symbol.numbers);
  });

  // Seleccionar números únicos
  const uniqueNumbers = [...new Set(allNumbers)];
  const shuffled = uniqueNumbers.sort(() => 0.5 - Math.random());
  
  return shuffled.slice(0, 3).map(num => num);
}
