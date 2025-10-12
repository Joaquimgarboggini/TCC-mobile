import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { ScaleContext } from '../context/ScaleContext';

const { width: screenWidth } = Dimensions.get('window');

// Função para converter notas inglesas para português
const convertNoteToPortuguese = (note) => {
  if (!note || typeof note !== 'string') {
    return 'N/A';
  }
  
  const noteMap = {
    'C': 'Dó',
    'C#': 'Dó#',
    'D': 'Ré',
    'D#': 'Ré#',
    'E': 'Mi',
    'F': 'Fá',
    'F#': 'Fá#',
    'G': 'Sol',
    'G#': 'Sol#',
    'A': 'Lá',
    'A#': 'Lá#',
    'B': 'Si'
  };
  
  const noteBase = note.replace(/\d+$/, '');
  return noteMap[noteBase] || note;
};

const VirtualKeyboard = ({ 
  showLabels = true, 
  compact = false,
  fullWidth = false,
  onKeyPress = null  // Nova prop para capturar eventos de tecla
}) => {
  // Importar scaleNotes, funções de som e estado das notas pressionadas
  const { 
    scaleNotes, 
    startSustainedNote, 
    stopSustainedNote, 
    sustainedNotes,
    audioReady,
    keyMapping,  // Mapeamento do ScaleContext
    playNote,    // Função para tocar qualquer nota
    selectedInstrument  // ADICIONAR instrumento selecionado
  } = useContext(ScaleContext);
  
  // Estado local para feedback visual das teclas (independente do ScaleContext)
  const [visualFeedback, setVisualFeedback] = useState(new Set());

  // Log do status do áudio
  useEffect(() => {
    console.log('🎹 VirtualKeyboard: AudioReady =', audioReady);
    if (audioReady) {
      console.log('🎵 Sistema de áudio pronto! Teste pressionando uma tecla.');
    }
  }, [audioReady]);

  // Listener para teclas físicas do computador
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();
      const scaleKeys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
      
      if (scaleKeys.includes(key)) {
        event.preventDefault();
        
        // Tocar a nota no contexto
        if (startSustainedNote) {
          const playedNote = startSustainedNote(key);
          
          // Se há um callback onKeyPress, chamar com a nota tocada
          if (onKeyPress && playedNote) {
            onKeyPress(playedNote);
          }
        }
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toUpperCase();
      const scaleKeys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
      
      if (scaleKeys.includes(key)) {
        event.preventDefault();
        if (stopSustainedNote) {
          stopSustainedNote(key);
        }
      }
    };

    // Adicionar listeners apenas no web (verificar se addEventListener existe)
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      if (typeof window !== 'undefined' && window.removeEventListener) {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      }
    };
  }, [startSustainedNote, stopSustainedNote, onKeyPress]);

  // Função para verificar se uma tecla deve ser destacada como "na escala"
  const isKeyInScale = (keyData) => {
    if (!scaleNotes || scaleNotes.length === 0) return false;
    
    // Verificar se a nota original da tecla do piano está na escala
    const noteBase = String(keyData.note).replace(/\d+$/, '');
    return scaleNotes.some(scaleNote => {
      const scaleNoteBase = String(scaleNote).replace(/\d+$/, '');
      return scaleNoteBase === noteBase;
    });
  };

  // Função para verificar se uma nota está sendo tocada visualmente
  const isNotePlaying = (keyData) => {
    // Usar tanto o feedback visual local quanto o ScaleContext
    const visualActive = visualFeedback.has(keyData.note);
    const sustainedActive = sustainedNotes && sustainedNotes.has(keyData.note);
    return visualActive || sustainedActive;
  };

  // Função para obter a nota que deve ser exibida visualmente na tecla
  const getDisplayNote = (keyData) => {
    // SEMPRE mostrar a nota original do piano - C5, C#5, D5, etc.
    return keyData.note;
  };

  // Gerar mapeamento das teclas baseado no piano completo C5-B6
  // SEMPRE mostrar todas as notas de C5 até B6, independente da escala
  const keyboardKeys = React.useMemo(() => {
    // Definir todas as notas de C5 até B6 com suas teclas correspondentes
    const allPianoKeys = [
      // Oitava 5: C5 até B5
      { key: 'Q', note: 'C5', type: 'white', octave: 5 },
      { key: 'W', note: 'C#5', type: 'black', octave: 5 },
      { key: 'E', note: 'D5', type: 'white', octave: 5 },
      { key: 'R', note: 'D#5', type: 'black', octave: 5 },
      { key: 'T', note: 'E5', type: 'white', octave: 5 },
      { key: 'Y', note: 'F5', type: 'white', octave: 5 },
      { key: 'U', note: 'F#5', type: 'black', octave: 5 },
      { key: 'I', note: 'G5', type: 'white', octave: 5 },
      { key: 'O', note: 'G#5', type: 'black', octave: 5 },
      { key: 'P', note: 'A5', type: 'white', octave: 5 },
      { key: 'A', note: 'A#5', type: 'black', octave: 5 },
      { key: 'S', note: 'B5', type: 'white', octave: 5 },
      
      // Oitava 6: C6 até B6
      { key: 'D', note: 'C6', type: 'white', octave: 6 },
      { key: 'F', note: 'C#6', type: 'black', octave: 6 },
      { key: 'G', note: 'D6', type: 'white', octave: 6 },
      { key: 'H', note: 'D#6', type: 'black', octave: 6 },
      { key: 'J', note: 'E6', type: 'white', octave: 6 },
      { key: 'K', note: 'F6', type: 'white', octave: 6 },
      { key: 'L', note: 'F#6', type: 'black', octave: 6 },
      { key: 'Z', note: 'G6', type: 'white', octave: 6 },
      { key: 'X', note: 'G#6', type: 'black', octave: 6 },
      { key: 'C', note: 'A6', type: 'white', octave: 6 },
      { key: 'V', note: 'A#6', type: 'black', octave: 6 },
      { key: 'B', note: 'B6', type: 'white', octave: 6 },
    ];
    
    return allPianoKeys;
  }, []); // Sem dependências - sempre o mesmo resultado

  // Calcular tamanho das teclas baseado no tamanho da tela
  // Piano completo C5-B6: 14 teclas brancas (7 por oitava x 2 oitavas)
  const whiteKeysCount = keyboardKeys.filter(k => k.type === 'white').length; // 14 teclas
  const leftMargin = fullWidth ? 0 : 20; // Sem margem no modo fullWidth
  const rightMargin = fullWidth ? 0 : 20; // Sem margem no modo fullWidth
  const availableWidth = screenWidth - (leftMargin + rightMargin); // Descontar margens laterais
  
  // Calcular largura das teclas brancas para ocupar toda a largura disponível
  const keyWidth = whiteKeysCount > 0 ? availableWidth / whiteKeysCount : 0;
  
  // Altura das teclas otimizada para piano completo
  const whiteKeyHeight = compact ? 80 : 150; // Ajustado para 14 teclas
  const blackKeyHeight = compact ? 50 : 100;  // Ajustado para 14 teclas
  const pianoWidth = whiteKeysCount * keyWidth;

  const handleKeyPress = (keyData) => {
    if (keyData.note) {
      // Adicionar feedback visual imediato
      setVisualFeedback(prev => new Set(prev).add(keyData.note));
      
      // Remover feedback visual após um tempo curto para voltar ao estado normal
      setTimeout(() => {
        setVisualFeedback(prev => {
          const newSet = new Set(prev);
          newSet.delete(keyData.note);
          return newSet;
        });
      }, 300);
      
      // Tocar nota com o instrumento selecionado
      if (playNote) {
        playNote(keyData.note, selectedInstrument);
      }
      
      // Se há um callback onKeyPress, chamar também
      if (onKeyPress) {
        onKeyPress(keyData.note);
      }
    }
  };

  const handleKeyRelease = (keyData) => {
    // Lógica para soltar tecla se necessário no futuro
  };

  const renderWhiteKeys = () => {
    return keyboardKeys
      .filter(k => k.type === 'white')
      .map((keyData, index) => {
        const displayNote = getDisplayNote(keyData);
        const inScale = isKeyInScale(keyData);
        const isPlaying = isNotePlaying(keyData);
        
        return (
          <TouchableOpacity
            key={`white-${keyData.key}-${index}`}
            style={[
              styles.whiteKey,
              isPlaying && styles.whiteKeyPressed, // Adicionar estilo quando pressionada
              {
                width: keyWidth,
                height: whiteKeyHeight,
              }
            ]}
            onPress={() => handleKeyPress(keyData)}
            activeOpacity={0.7}
          >
            <View style={styles.keyContent}>
              <Text style={[
                inScale ? styles.noteLabelInScale : styles.noteLabel, 
                isPlaying && styles.noteLabelPressed, // Adicionar estilo do texto quando pressionada
                { fontSize: compact ? 12 : 18, fontWeight: 'bold' } // Fonte maior para teclas maiores
              ]}>
                {convertNoteToPortuguese(displayNote)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      });
  };

  const renderBlackKeys = () => {
    // Posicionamento fixo das teclas pretas no piano completo C5-B6
    const blackKeyPositions = [
      // Oitava 5: C#5, D#5, F#5, G#5, A#5
      { key: 'W', left: keyWidth * 0.7 },   // C#5 - entre C5(Q) e D5(E)
      { key: 'R', left: keyWidth * 1.7 },   // D#5 - entre D5(E) e E5(T)
      { key: 'U', left: keyWidth * 3.7 },   // F#5 - entre F5(Y) e G5(I)
      { key: 'O', left: keyWidth * 4.7 },   // G#5 - entre G5(I) e A5(P)
      { key: 'A', left: keyWidth * 5.7 },   // A#5 - entre A5(P) e B5(S)
      
      // Oitava 6: C#6, D#6, F#6, G#6, A#6
      { key: 'F', left: keyWidth * 7.7 },   // C#6 - entre C6(D) e D6(G)
      { key: 'H', left: keyWidth * 8.7 },   // D#6 - entre D6(G) e E6(J)
      { key: 'L', left: keyWidth * 10.7 },  // F#6 - entre F6(K) e G6(Z)
      { key: 'X', left: keyWidth * 11.7 },  // G#6 - entre G6(Z) e A6(C)
      { key: 'V', left: keyWidth * 12.7 },  // A#6 - entre A6(C) e B6(B)
    ];

    return blackKeyPositions.map((pos) => {
      const keyData = keyboardKeys.find(k => k.key === pos.key);
      if (!keyData || !keyData.note) return null;

      const displayNote = getDisplayNote(keyData);
      const inScale = isKeyInScale(keyData);
      const isPlaying = isNotePlaying(keyData);

      return (
        <TouchableOpacity
          key={`black-${keyData.key}`}
          style={[
            styles.blackKey,
            isPlaying && styles.blackKeyPressed, // Adicionar estilo quando pressionada
            {
              width: keyWidth * 0.6, // Tecla preta um pouco mais estreita
              height: blackKeyHeight,
              left: pos.left,
            }
          ]}
          onPress={() => handleKeyPress(keyData)}
          activeOpacity={0.7}
        >
          <View style={styles.keyContent}>
            <Text style={[
              inScale ? styles.blackNoteLabelInScale : styles.blackNoteLabel, 
              isPlaying && styles.blackNoteLabelPressed, // Adicionar estilo do texto quando pressionada
              { fontSize: compact ? 10 : 14, fontWeight: 'bold' } // Fonte maior para teclas maiores
            ]}>
              {convertNoteToPortuguese(displayNote)}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }).filter(Boolean);
  };

  // Se não há keyMapping, as teclas podem não destacar corretamente, mas ainda funcionam
  // O teclado sempre mostra C5-B6 independente da escala

  return (
    <View style={[
      styles.keyboardContainer, 
      compact && { padding: 8, margin: 5 },
      fullWidth && { 
        marginLeft: leftMargin, 
        marginRight: rightMargin,
        paddingHorizontal: 0 
      }
    ]}>
      
      <View style={[styles.pianoContainer, { 
        height: whiteKeyHeight + (compact ? 15 : 30),
        width: availableWidth,
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center'
      }]}>
        {/* Teclas brancas */}
        <View style={styles.whiteKeysRow}>
          {renderWhiteKeys()}
        </View>
        
        {/* Teclas pretas */}
        <View style={styles.blackKeysRow}>
          {renderBlackKeys()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    margin: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    minHeight: 120, // Garantir altura mínima
  },
  
  keyboardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  
  pianoContainer: {
    position: 'relative',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    marginHorizontal: 'auto',
  },
  
  whiteKeysRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-start',
  },
  
  blackKeysRow: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  
  whiteKey: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3, // Aumentado de 1 para 3
    },
    shadowOpacity: 0.3, // Aumentado de 0.22 para 0.3
    shadowRadius: 4, // Aumentado de 2.22 para 4
    elevation: 6, // Aumentado de 3 para 6
  },
  
  blackKey: {
    backgroundColor: '#2c2c2c',
    position: 'absolute',
    borderRadius: 0,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4, // Aumentado de 2 para 4
    },
    shadowOpacity: 0.4, // Aumentado de 0.25 para 0.4
    shadowRadius: 5, // Aumentado de 3.84 para 5
    elevation: 8, // Aumentado de 5 para 8
    zIndex: 10,
  },
  
  pressedWhiteKey: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    borderWidth: 2,
  },
  
  pressedBlackKey: {
    backgroundColor: '#424242',
  },
  
  keyContent: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    paddingBottom: 4,
  },
  
  keyLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  
  noteLabel: {
    fontSize: 10,
    color: '#666',
  },
  
  keyLabel: {
    fontSize: 8,
    color: '#888',
    marginTop: 2,
  },
  
  noteLabelInScale: {
    fontSize: 10,
    color: '#4CAF50', // Verde para notas da escala
    fontWeight: 'bold',
  },
  
  octaveLabel: {
    fontSize: 8,
    color: '#999',
    fontWeight: '400',
  },
  
  blackKeyLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  
  blackNoteLabel: {
    fontSize: 8,
    color: '#ccc',
  },
  
  blackNoteLabelInScale: {
    fontSize: 8,
    color: '#81C784', // Verde mais claro para teclas pretas
    fontWeight: 'bold',
  },
  
  pressedKeyLabel: {
    color: '#2196f3',
  },
  
  pressedKeyLabel: {
    color: '#2196f3',
  },
  
  pressedNoteLabel: {
    color: '#2196f3',
  },
  
  pressedBlackKeyLabel: {
    color: '#64b5f6',
  },
  
  pressedBlackNoteLabel: {
    color: '#64b5f6',
  },
  
  instructionText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },

  // Estilos para teclas pressionadas
  whiteKeyPressed: {
    backgroundColor: '#FFD700', // Dourado para tecla branca pressionada
    borderColor: '#FFA000',
    shadowColor: '#FFA000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
  },

  blackKeyPressed: {
    backgroundColor: '#FF6B35', // Laranja para tecla preta pressionada
    borderColor: '#E65100',
    shadowColor: '#E65100',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 8,
  },

  noteLabelPressed: {
    color: '#B8860B', // Cor escura do dourado para texto da tecla branca pressionada
    fontWeight: 'bold',
    textShadowColor: '#FFA000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  blackNoteLabelPressed: {
    color: '#FFFFFF', // Branco para texto da tecla preta pressionada
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
});

export default VirtualKeyboard;