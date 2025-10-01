import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { ScaleContext } from '../context/ScaleContext';

const { width: screenWidth } = Dimensions.get('window');

// Função para converter notas inglesas para português
const convertNoteToPortuguese = (note) => {
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
  
  // Extrair a nota base (sem o número da oitava)
  const noteBase = note.replace(/\d+$/, '');
  const octave = note.match(/\d+$/)?.[0] || '';
  
  return noteMap[noteBase] || note;
};

const VirtualKeyboard = ({ 
  onKeyPress, 
  onKeyRelease, 
  showLabels = true, 
  compact = false 
}) => {
  const { keyMapping, isKeyPressed, pressedKeys } = useContext(ScaleContext);

  // Mapeamento fixo das teclas QWERTY para piano completo C5 até B6
  const keyboardKeys = [
    // Oitava 5: C5, C#5, D5, D#5, E5, F5, F#5, G5, G#5, A5, A#5, B5
    { key: 'Q', note: 'C5', type: 'white', octave: 5 },
    { key: 'W', note: 'C#5', type: 'black', octave: 5 },
    { key: 'E', note: 'D5', type: 'white', octave: 5 },
    { key: 'R', note: 'D#5', type: 'black', octave: 5 },
    { key: 'Y', note: 'E5', type: 'white', octave: 5 },
    { key: 'U', note: 'F5', type: 'white', octave: 5 },
    { key: 'I', note: 'F#5', type: 'black', octave: 5 },
    { key: 'O', note: 'G5', type: 'white', octave: 5 },
    { key: 'P', note: 'G#5', type: 'black', octave: 5 },
    { key: 'A', note: 'A5', type: 'white', octave: 5 },
    { key: 'S', note: 'A#5', type: 'black', octave: 5 },
    { key: 'D', note: 'B5', type: 'white', octave: 5 },
    // Oitava 6: C6, C#6, D6, D#6, E6, F6, F#6, G6, G#6, A6, A#6, B6
    { key: 'F', note: 'C6', type: 'white', octave: 6 },
    { key: 'G', note: 'C#6', type: 'black', octave: 6 },
    { key: 'H', note: 'D6', type: 'white', octave: 6 },
    { key: 'J', note: 'D#6', type: 'black', octave: 6 },
    { key: 'K', note: 'E6', type: 'white', octave: 6 },
    { key: 'L', note: 'F6', type: 'white', octave: 6 },
    { key: 'Z', note: 'F#6', type: 'black', octave: 6 },
    { key: 'X', note: 'G6', type: 'white', octave: 6 },
    { key: 'C', note: 'G#6', type: 'black', octave: 6 },
    { key: 'V', note: 'A6', type: 'white', octave: 6 },
    { key: 'B', note: 'A#6', type: 'black', octave: 6 },
    { key: 'N', note: 'B6', type: 'white', octave: 6 },
  ];

  // Calcular tamanho das teclas baseado no tamanho da tela
  const whiteKeysCount = keyboardKeys.filter(k => k.type === 'white').length;
  const margin = 20; // Margem igual nas laterais
  const availableWidth = screenWidth - (margin * 2); // Descontar margens laterais
  const keyWidth = availableWidth / whiteKeysCount;
  const whiteKeyHeight = compact ? 80 : 170; // Aumentado de 140 para 170
  const blackKeyHeight = compact ? 50 : 110;  // Aumentado de 90 para 110
  const pianoWidth = whiteKeysCount * keyWidth;

  const handleKeyPress = (key) => {
    if (onKeyPress) {
      onKeyPress(key);
    }
  };

  const handleKeyRelease = (key) => {
    if (onKeyRelease) {
      onKeyRelease(key);
    }
  };

  const renderWhiteKeys = () => {
    return keyboardKeys
      .filter(k => k.type === 'white')
      .map((keyData, index) => {
        const isPressed = isKeyPressed && isKeyPressed(keyData.key);
        
        return (
          <TouchableOpacity
            key={`white-${keyData.key}`}
            style={[
              styles.whiteKey,
              {
                width: keyWidth,
                height: whiteKeyHeight,
              },
              isPressed && styles.pressedWhiteKey
            ]}
            onPressIn={() => handleKeyPress(keyData.key)}
            onPressOut={() => handleKeyRelease(keyData.key)}
            activeOpacity={0.7}
          >
            <View style={styles.keyContent}>
              {showLabels && (
                <>
                  <Text style={[styles.keyLabel, isPressed && styles.pressedKeyLabel, compact && { fontSize: 10 }]}>
                    {keyData.key}
                  </Text>
                  {keyData.note && (
                    <Text style={[styles.noteLabel, isPressed && styles.pressedNoteLabel, compact && { fontSize: 8 }]}>
                      {keyData.note}
                    </Text>
                  )}
                  {!compact && (
                    <Text style={styles.octaveLabel}>
                      Oitava {keyData.octave}
                    </Text>
                  )}
                </>
              )}
              {/* Sempre mostrar a nota, mesmo quando showLabels=false */}
              {!showLabels && keyData.note && (
                <Text style={[styles.noteLabel, isPressed && styles.pressedNoteLabel, { fontSize: 14, fontWeight: 'bold' }]}>
                  {convertNoteToPortuguese(keyData.note)}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      });
  };

  const renderBlackKeys = () => {
    // Posicionamento correto das teclas pretas baseado na sequência C5 até B6
    const blackKeyPositions = [
      // Oitava 5: C#5, D#5, F#5, G#5, A#5
      { key: 'W', left: keyWidth * 0.72 }, // Movido um pouco para direita
      { key: 'R', left: keyWidth * 1.72 }, // Movido um pouco para direita  
      { key: 'I', left: keyWidth * 3.72 }, // Movido um pouco para direita
      { key: 'P', left: keyWidth * 4.72 }, // Movido um pouco para direita
      { key: 'S', left: keyWidth * 5.72 }, // Movido um pouco para direita
      
      // Oitava 6: C#6, D#6, F#6, G#6, A#6
      { key: 'G', left: keyWidth * 7.72 }, // Movido um pouco para direita
      { key: 'J', left: keyWidth * 8.72 }, // Movido um pouco para direita
      { key: 'Z', left: keyWidth * 10.72 }, // Movido um pouco para direita
      { key: 'C', left: keyWidth * 11.72 }, // Movido um pouco para direita
      { key: 'B', left: keyWidth * 12.72 }, // Movido um pouco para direita
    ];

    return blackKeyPositions.map((pos) => {
      const keyData = keyboardKeys.find(k => k.key === pos.key);
      if (!keyData || !keyData.note) return null;

      const isPressed = isKeyPressed && isKeyPressed(keyData.key);

      return (
        <TouchableOpacity
          key={`black-${keyData.key}`}
          style={[
            styles.blackKey,
            {
              width: keyWidth * 0.65, // Aumentado de 0.6 para 0.65
              height: blackKeyHeight,
              left: pos.left,
            },
            isPressed && styles.pressedBlackKey
          ]}
          onPressIn={() => handleKeyPress(keyData.key)}
          onPressOut={() => handleKeyRelease(keyData.key)}
          activeOpacity={0.7}
        >
          <View style={styles.keyContent}>
            {showLabels && (
              <>
                <Text style={[styles.blackKeyLabel, isPressed && styles.pressedBlackKeyLabel, compact && { fontSize: 8 }]}>
                  {keyData.key}
                </Text>
                {keyData.note && (
                  <Text style={[styles.blackNoteLabel, isPressed && styles.pressedBlackNoteLabel, compact && { fontSize: 7 }]}>
                    {keyData.note}
                  </Text>
                )}
              </>
            )}
            {/* Sempre mostrar a nota, mesmo quando showLabels=false */}
            {!showLabels && keyData.note && (
              <Text style={[styles.blackNoteLabel, isPressed && styles.pressedBlackNoteLabel, { fontSize: 12, fontWeight: 'bold', color: 'white' }]}>
                {convertNoteToPortuguese(keyData.note)}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={[styles.keyboardContainer, compact && { padding: 8, margin: 5 }]}>
      
      <View style={[styles.pianoContainer, { 
        height: whiteKeyHeight + (compact ? 15 : 30), // Altura baseada nas teclas
        width: availableWidth, // Usar largura calculada com margens
        alignSelf: 'center', // Centralizar o piano
        justifyContent: 'center', // Centralizar verticalmente
        alignItems: 'center' // Centralizar horizontalmente
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
    padding: 0, // Sem padding para ocupar tela toda
    borderRadius: 0, // Sem bordas arredondadas
    margin: 0, // Sem margem
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    alignSelf: 'center', // Centralizar o container
    width: '100%', // Usar 100% da largura
    paddingHorizontal: 20, // Margem lateral de 20px igual em ambos os lados
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
});

export default VirtualKeyboard;