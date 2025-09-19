import { useContext } from 'react';
import { ScaleContext, qwertyKeys, scales } from './context/ScaleContext';

// Export das escalas e teclas para compatibilidade
export { qwertyKeys, scales };

// Notas disponíveis para escalas (mantido para compatibilidade)
export const notes = [
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
  'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6'
];

// Hook para obter o mapeamento de teclas baseado na escala selecionada
export const useKeyToNoteMapping = () => {
  const { keyMapping, getNoteFromKey, selectedScale, scaleNotes } = useContext(ScaleContext);

  return {
    keyMapping,
    getNoteFromKey,
    selectedScale,
    scaleNotes
  };
};