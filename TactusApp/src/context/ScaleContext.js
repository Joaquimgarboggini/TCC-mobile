import React, { createContext, useState, useEffect } from 'react';
import useAudioEngine from '../hooks/useAudioEngine';

export const ScaleContext = createContext();

// Teclas QWERTYUIOP para as 10 primeiras notas da escala
export const qwertyKeys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];

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

// Função para transpor uma nota uma oitava acima
const transposeOctaveUp = (note) => {
  if (!note || typeof note !== 'string') return note;
  
  // Extrair a parte da nota e a oitava
  const noteMatch = note.match(/^([A-G]#?)(\d+)$/);
  if (!noteMatch) return note;
  
  const [, noteName, octave] = noteMatch;
  const newOctave = parseInt(octave) + 1;
  
  // Verificar se a nova nota existe no nosso range (C5-B6)
  const newNote = `${noteName}${newOctave}`;
  if (newOctave <= 6) {
    return newNote;
  }
  
  return note; // Retornar a nota original se estiver fora do range
};

// Função para gerar escala maior
const generateMajorScale = (tonic) => {
  // Fórmula: Tom-Tom-semitom-Tom-Tom-Tom-semitom
  const intervals = [2, 2, 1, 2, 2, 2, 1, 2, 2]; // em semitons
  const normalizedTonic = normalizeNote(tonic);
  const startIndex = getNoteIndex(normalizedTonic);
  
  if (startIndex === -1) return [];
  
  const scale = [normalizedTonic];
  let currentIndex = startIndex;
  
  for (let i = 0; i < 9; i++) {
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
  const intervals = [2, 1, 2, 2, 1, 2, 2, 2, 1]; // em semitons
  const normalizedTonic = normalizeNote(tonic);
  const startIndex = getNoteIndex(normalizedTonic);
  
  if (startIndex === -1) return [];
  
  const scale = [normalizedTonic];
  let currentIndex = startIndex;
  
  for (let i = 0; i < 9; i++) {
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
  // Escalas Maiores (ordem cromática)
  'Dó Maior',
  'Dó# Maior',
  'Ré Maior',
  'Ré# Maior',
  'Mi Maior',
  'Fá Maior',
  'Fá# Maior',
  'Sol Maior',
  'Sol# Maior',
  'Lá Maior',
  'Lá# Maior',
  'Si Maior',

  // Escalas Menores (ordem cromática)
  'Dó Menor',
  'Dó# Menor',
  'Ré Menor',
  'Ré# Menor',
  'Mi Menor',
  'Fá Menor',
  'Fá# Menor',
  'Sol Menor',
  'Sol# Menor',
  'Lá Menor',
  'Lá# Menor',
  'Si Menor',
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
  'Si Maior': generateMajorScale('B5'),
  'Solb / Fá# Maior': generateMajorScale('F#5'),
  'Fá# Maior': generateMajorScale('F#5'),
  'Réb / Dó# Maior': generateMajorScale('C#5'),
  'Dó# Maior': generateMajorScale('C#5'),
  'Láb Maior': generateMajorScale('G#5'),
  'Sol# Maior': generateMajorScale('G#5'),
  'Mib Maior': generateMajorScale('D#5'),
  'Ré# Maior': generateMajorScale('D#5'),
  'Sib Maior': generateMajorScale('A#5'),
  'Lá# Maior': generateMajorScale('A#5'),
  'Fá Maior': generateMajorScale('F5'),
  
  // Escalas Menores
  'Lá Menor': generateMinorScale('A5'),
  'Mi Menor': generateMinorScale('E5'),
  'Si Menor': generateMinorScale('B5'),
  'Fá# Menor': generateMinorScale('F#5'),
  'Dó# Menor': generateMinorScale('C#5'),
  'Sol# Menor': generateMinorScale('G#5'),
  'Ré# Menor': generateMinorScale('D#5'),
  'Lá# Menor': generateMinorScale('A#5'),
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

  // Estado para instrumento selecionado
  const [selectedInstrument, setSelectedInstrument] = useState('Piano1');

  // Hook de áudio para tocar sons
  const { isReady: audioReady, playNote, stopNote, stopAllSounds } = useAudioEngine();

  // Função para definir escala temporária (para músicas)
  const setTemporaryScaleForMusic = (scaleName) => {
    if (scales[scaleName]) {
      setPreviousScale(selectedScale); // Salva a escala atual
      setTemporaryScale(scaleName); // Define a escala temporária
      console.log(`Escala temporária definida: ${String(scaleName)} (anterior: ${String(selectedScale)})`);
    }
  };

  // Função para restaurar escala anterior
  const restorePreviousScale = () => {
    if (previousScale) {
      setTemporaryScale(null);
      console.log(`Escala restaurada: ${String(previousScale)}`);
      setPreviousScale(null);
    }
  };

  // Função para obter a nota correspondente a uma tecla pressionada
  const getNoteFromKey = (key) => {
    if (!key || typeof key !== 'string') return null;
    const upperKey = key.toUpperCase();
    return keyMapping[upperKey] || null;
  };

  // Funções para gerenciar teclas sendo seguradas
  const startSustainedNote = async (key) => {
    if (!key || typeof key !== 'string') return null;
    const upperKey = key.toUpperCase();
    const note = keyMapping[upperKey];
    if (note) {
      // SEMPRE adicionar, mesmo se já estiver pressionada
      setPressedKeys(prev => new Set(prev).add(upperKey));
      setSustainedNotes(prev => new Set(prev).add(note));
      
      // Tocar o som da nota se o áudio estiver pronto
      if (audioReady) {
        try {
          await playNote(note, selectedInstrument);
          console.log(`🎵 ScaleContext: Som tocado para ${note} com ${selectedInstrument}`);
        } catch (error) {
          console.log(`❌ ScaleContext: Erro ao tocar som para ${note}:`, error.message);
        }
      }
      
      console.log(`🎵 ScaleContext: Iniciou sustain: ${String(upperKey)} → ${String(note)}`);
      console.log(`🎯 ScaleContext: sustainedNotes agora tem:`, Array.from(sustainedNotes).concat([note]));
      return note;
    } else {
      console.log(`❌ ScaleContext: Tecla ${upperKey} não encontrada no keyMapping`);
    }
    return null;
  };

  const stopSustainedNote = (key) => {
    if (!key || typeof key !== 'string') return null;
    const upperKey = key.toUpperCase();
    const note = keyMapping[upperKey];
    if (note) {
      // SEMPRE remover, mesmo se não estiver pressionada
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
      
      // NÃO para mais o som - deixa tocar até o final
      console.log(`🎵 ScaleContext: Parou sustain (som continua): ${String(upperKey)} → ${String(note)}`);
      return note;
    }
    return null;
  };

  // Função para verificar se uma tecla está pressionada
  const isKeyPressed = (key) => {
    if (!key || typeof key !== 'string') return false;
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
      // Mapear QWERTYUIOP para as 10 primeiras notas da escala selecionada (incluindo sustenidas)
      qwertyKeys.forEach((key, idx) => {
        if (idx < notes.length) {
          mapping[key] = notes[idx];
        }
      });
      // Mapear todas as outras teclas para suas notas fixas do piano
      const allKeyboardKeys = [
        { key: 'Q', note: 'C5' }, { key: 'W', note: 'C#5' }, { key: 'E', note: 'D5' }, 
        { key: 'R', note: 'D#5' }, { key: 'T', note: 'E5' }, { key: 'Y', note: 'F5' }, 
        { key: 'U', note: 'F#5' }, { key: 'I', note: 'G5' }, { key: 'O', note: 'G#5' }, 
        { key: 'P', note: 'A5' }, { key: 'A', note: 'A#5' }, { key: 'S', note: 'B5' },
        { key: 'D', note: 'C6' }, { key: 'F', note: 'C#6' }, { key: 'G', note: 'D6' }, 
        { key: 'H', note: 'D#6' }, { key: 'J', note: 'E6' }, { key: 'K', note: 'F6' }, 
        { key: 'L', note: 'F#6' }, { key: 'Z', note: 'G6' }, { key: 'X', note: 'G#6' }, 
        { key: 'C', note: 'A6' }, { key: 'V', note: 'A#6' }, { key: 'B', note: 'B6' }
      ];
      allKeyboardKeys.forEach(keyData => {
        if (!qwertyKeys.includes(keyData.key)) {
          mapping[keyData.key] = keyData.note;
        }
      });
      setKeyMapping(mapping);
      setScaleNotes(notes);
      // Log the notes and their corresponding keys
      console.log('Current Scale:', currentScale);
      console.log('Scale Notes (first 10):', notes.slice(0, 10));
      console.log('Key Mapping QWERTYUIOP:', mapping);
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
      sustainedNotes,
      // Funções de áudio
      audioReady,
      playNote,
      stopNote,
      stopAllSounds,
      // Seleção de instrumento
      selectedInstrument,
      setSelectedInstrument
    }}>
      {children}
    </ScaleContext.Provider>
  );
};
