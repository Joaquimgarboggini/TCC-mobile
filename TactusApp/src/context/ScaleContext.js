import React, { createContext, useState, useEffect } from 'react';

export const ScaleContext = createContext();

// Teclas QWER YUIO
export const qwertyKeys = ['Q', 'W', 'E', 'R', 'Y', 'U', 'I', 'O'];

// Definição completa das escalas maiores e menores
export const scales = {
  // Escalas Maiores
  'C Maior': ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'],
  'D Maior': ['D5', 'E5', 'F#5', 'G5', 'A5', 'B5', 'C#6', 'D6'],
  'E Maior': ['E5', 'F#5', 'G#5', 'A5', 'B5', 'C#6', 'D#6', 'E6'],
  'F Maior': ['F5', 'G5', 'A5', 'A#5', 'C6', 'D6', 'E6', 'F6'],
  'G Maior': ['G5', 'A5', 'B5', 'C6', 'D6', 'E6', 'F#6', 'G6'],
  'A Maior': ['A5', 'B5', 'C#6', 'D6', 'E6', 'F#6', 'G#6', 'A6'],
  'B Maior': ['B5', 'C#6', 'D#6', 'E6', 'F#6', 'G#6', 'A#6', 'B6'],
  
  // Escalas Menores (Natural)
  'C Menor': ['C5', 'D5', 'D#5', 'F5', 'G5', 'G#5', 'A#5', 'C6'],
  'D Menor': ['D5', 'E5', 'F5', 'G5', 'A5', 'A#5', 'C6', 'D6'],
  'E Menor': ['E5', 'F#5', 'G5', 'A5', 'B5', 'C6', 'D6', 'E6'],
  'F Menor': ['F5', 'G5', 'G#5', 'A#5', 'C6', 'C#6', 'D#6', 'F6'],
  'G Menor': ['G5', 'A5', 'A#5', 'C6', 'D6', 'D#6', 'F6', 'G6'],
  'A Menor': ['A5', 'B5', 'C6', 'D6', 'E6', 'F6', 'G6', 'A6'],
  'B Menor': ['B5', 'C#6', 'D6', 'E6', 'F#6', 'G6', 'A6', 'B6'],
};

export const ScaleProvider = ({ children }) => {
  const [selectedScale, setSelectedScale] = useState('C Maior');
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
      availableScales: Object.keys(scales),
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
