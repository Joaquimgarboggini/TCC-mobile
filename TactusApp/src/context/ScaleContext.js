import React, { createContext, useState, useEffect } from 'react';

export const ScaleContext = createContext();

// Teclas QWER YUIO expandidas para C5-B6
export const qwertyKeys = ['Q', 'W', 'E', 'R', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N'];

// Todas as notas disponíveis em ordem cromática
const allNotes = [
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
  'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6'
];

// Função para encontrar o índice de uma nota
const getNoteIndex = (note) => {
  return allNotes.indexOf(note);
};

// Função para obter nota por índice
const getNoteByIndex = (index) => {
  if (index >= 0 && index < allNotes.length) {
    return allNotes[index];
  }
  return null;
};

// Função para converter notas bemóis para equivalentes sustenidos
const normalizeNote = (note) => {
  const enharmonics = {
    'Cb': 'B',
    'Db': 'C#',
    'Eb': 'D#',
    'Fb': 'E',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#'
  };
  
  for (const [flat, sharp] of Object.entries(enharmonics)) {
    if (note.includes(flat)) {
      return note.replace(flat, sharp);
    }
  }
  return note;
};

// Função para gerar escala maior
const generateMajorScale = (tonic) => {
  // Fórmula: Tom-Tom-semitom-Tom-Tom-Tom-semitom
  const intervals = [2, 2, 1, 2, 2, 2, 1]; // em semitons
  const normalizedTonic = normalizeNote(tonic);
  const startIndex = getNoteIndex(normalizedTonic);
  
  if (startIndex === -1) return [];
  
  const scale = [normalizedTonic];
  let currentIndex = startIndex;
  
  for (let i = 0; i < 7; i++) {
    currentIndex += intervals[i];
    const note = getNoteByIndex(currentIndex);
    if (note) {
      scale.push(note);
    }
  }
  
  return scale;
};

// Função para gerar escala menor natural
const generateMinorScale = (tonic) => {
  // Fórmula: Tom-semitom-Tom-Tom-semitom-Tom-Tom
  const intervals = [2, 1, 2, 2, 1, 2, 2]; // em semitons
  const normalizedTonic = normalizeNote(tonic);
  const startIndex = getNoteIndex(normalizedTonic);
  
  if (startIndex === -1) return [];
  
  const scale = [normalizedTonic];
  let currentIndex = startIndex;
  
  for (let i = 0; i < 7; i++) {
    currentIndex += intervals[i];
    const note = getNoteByIndex(currentIndex);
    if (note) {
      scale.push(note);
    }
  }
  
  return scale;
};

// Lista ordenada das escalas (na ordem especificada)
export const orderedScales = [
  // Escalas Maiores
  'Dó Maior',
  'Sol Maior', 
  'Ré Maior',
  'Lá Maior',
  'Mi Maior',
  'Si / Dób Maior',
  'Solb / Fá# Maior',
  'Réb / Dó# Maior',
  'Láb Maior',
  'Mib Maior',
  'Sib Maior',
  'Fá Maior',
  
  // Escalas Menores
  'Lá Menor',
  'Mi Menor',
  'Si Menor',
  'Fá# Menor',
  'Dó# Menor',
  'Láb / Sol# Menor',
  'Mib / Ré# Menor',
  'Sib / Lá# Menor',
  'Fá Menor',
  'Dó Menor',
  'Sol Menor',
  'Ré Menor'
];

// Definição completa das escalas na ordem especificada
export const scales = {
  // Escalas Maiores
  'Dó Maior': generateMajorScale('C5'),
  'Sol Maior': generateMajorScale('G5'),
  'Ré Maior': generateMajorScale('D5'),
  'Lá Maior': generateMajorScale('A5'),
  'Mi Maior': generateMajorScale('E5'),
  'Si / Dób Maior': generateMajorScale('B5'),
  'Solb / Fá# Maior': generateMajorScale('F#5'),
  'Réb / Dó# Maior': generateMajorScale('C#5'),
  'Láb Maior': generateMajorScale('G#5'),
  'Mib Maior': generateMajorScale('D#5'),
  'Sib Maior': generateMajorScale('A#5'),
  'Fá Maior': generateMajorScale('F5'),
  
  // Escalas Menores
  'Lá Menor': generateMinorScale('A5'),
  'Mi Menor': generateMinorScale('E5'),
  'Si Menor': generateMinorScale('B5'),
  'Fá# Menor': generateMinorScale('F#5'),
  'Dó# Menor': generateMinorScale('C#5'),
  'Láb / Sol# Menor': generateMinorScale('G#5'),
  'Mib / Ré# Menor': generateMinorScale('D#5'),
  'Sib / Lá# Menor': generateMinorScale('A#5'),
  'Fá Menor': generateMinorScale('F5'),
  'Dó Menor': generateMinorScale('C5'),
  'Sol Menor': generateMinorScale('G5'),
  'Ré Menor': generateMinorScale('D5'),
};

export const ScaleProvider = ({ children }) => {
  const [selectedScale, setSelectedScale] = useState('Dó Maior');
  const [keyMapping, setKeyMapping] = useState({});
  const [scaleNotes, setScaleNotes] = useState([]);
  
  // Estados para escala temporária (para músicas)
  const [temporaryScale, setTemporaryScale] = useState(null);
  const [previousScale, setPreviousScale] = useState(null);

  // Estados para teclas sendo seguradas
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [sustainedNotes, setSustainedNotes] = useState(new Set());

  // Função para definir escala temporária (para músicas)
  const setTemporaryScaleForMusic = (scaleName) => {
    if (scales[scaleName]) {
      setPreviousScale(selectedScale); // Salva a escala atual
      setTemporaryScale(scaleName); // Define a escala temporária
      console.log(`Escala temporária definida: ${scaleName} (anterior: ${selectedScale})`);
    }
  };

  // Função para restaurar escala anterior
  const restorePreviousScale = () => {
    if (previousScale) {
      setTemporaryScale(null);
      console.log(`Escala restaurada: ${previousScale}`);
      setPreviousScale(null);
    }
  };

  // Função para obter a nota correspondente a uma tecla pressionada
  const getNoteFromKey = (key) => {
    const upperKey = key.toUpperCase();
    return keyMapping[upperKey] || null;
  };

  // Funções para gerenciar teclas sendo seguradas
  const startSustainedNote = (key) => {
    const upperKey = key.toUpperCase();
    const note = keyMapping[upperKey];
    if (note && !pressedKeys.has(upperKey)) {
      setPressedKeys(prev => new Set(prev).add(upperKey));
      setSustainedNotes(prev => new Set(prev).add(note));
      console.log(`🎵 Iniciou sustain: ${upperKey} → ${note}`);
      return note;
    }
    return null;
  };

  const stopSustainedNote = (key) => {
    const upperKey = key.toUpperCase();
    const note = keyMapping[upperKey];
    if (note && pressedKeys.has(upperKey)) {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(upperKey);
        return newSet;
      });
      setSustainedNotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
      console.log(`🎵 Parou sustain: ${upperKey} → ${note}`);
      return note;
    }
    return null;
  };

  // Função para verificar se uma tecla está pressionada
  const isKeyPressed = (key) => {
    return pressedKeys.has(key.toUpperCase());
  };

  // Função para verificar se uma nota está sendo sustentada
  const isNoteSustained = (note) => {
    return sustainedNotes.has(note);
  };

  // Determina qual escala usar (temporária ou selecionada)
  const currentScale = temporaryScale || selectedScale;

  // Update the key-to-note mapping whenever the current scale changes
  useEffect(() => {
    if (currentScale && scales[currentScale]) {
      const notes = scales[currentScale];
      const mapping = {};
      
      qwertyKeys.forEach((key, idx) => {
        if (idx < notes.length) {
          mapping[key] = notes[idx];
        }
      });
      
      setKeyMapping(mapping);
      setScaleNotes(notes);

      // Log the notes and their corresponding keys
      console.log('Current Scale:', currentScale);
      console.log('Scale Notes:', notes);
      console.log('Key Mapping:', mapping);
    }
  }, [currentScale]);

  return (
    <ScaleContext.Provider value={{ 
      selectedScale: currentScale, // Retorna escala atual (temporária ou selecionada)
      setSelectedScale, 
      keyMapping, 
      scaleNotes,
      getNoteFromKey,
      availableScales: orderedScales,
      // Novas funções para escalas temporárias
      setTemporaryScaleForMusic,
      restorePreviousScale,
      isTemporaryScale: !!temporaryScale,
      originalSelectedScale: temporaryScale ? previousScale : selectedScale,
      // Novas funções para sustain de teclas
      startSustainedNote,
      stopSustainedNote,
      isKeyPressed,
      isNoteSustained,
      pressedKeys,
      sustainedNotes
    }}>
      {children}
    </ScaleContext.Provider>
  );
};
