import { Platform } from 'react-native';

/**
 * Adiciona listeners de teclado de forma segura
 * Funciona apenas em ambiente web, ignora em mobile
 */
export const addKeyboardListeners = (handleKeyDown, handleKeyUp) => {
  if (typeof window !== 'undefined' && window.addEventListener && Platform.OS === 'web') {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      if (window.removeEventListener) {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      }
    };
  }
  
  // Retorna função vazia se não estiver em ambiente web
  return () => {};
};

/**
 * Remove listeners de teclado de forma segura
 */
export const removeKeyboardListeners = (handleKeyDown, handleKeyUp) => {
  if (typeof window !== 'undefined' && window.removeEventListener && Platform.OS === 'web') {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  }
};

export const mapKeyToAnswer = (key) => {
  const keyMap = {
    'Q': 0, 'W': 1, 'E': 2, 'R': 3, 'T': 4,
    'Y': 5, 'U': 6, 'I': 7, 'O': 8, 'P': 9,
    'A': 10, 'S': 11, 'D': 12, 'F': 13, 'G': 14,
    'H': 15, 'J': 16, 'K': 17, 'L': 18,
    'Z': 19, 'X': 20, 'C': 21, 'V': 22, 'B': 23,
    'N': 24, 'M': 25
  };
  
  if (!key || typeof key !== 'string') return undefined;
  return keyMap[key.toUpperCase()];
};