
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para almacenar nuestro valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Obtener del localStorage local
      const item = window.localStorage.getItem(key);
      // Parsear JSON almacenado o si no existe, retornar initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay error, también retornar initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Retornar una versión envuelta de la función setter de useState que ...
  // ... persiste el nuevo valor al localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que value sea una función para tener la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Guardar estado
      setStoredValue(valueToStore);
      // Guardar al localStorage local
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Un implementación más avanzada manejaría el caso de error
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}
