import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { ScaleContext } from '../context/ScaleContext';

const { width: screenWidth } = Dimensions.get('window');

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
  const availableWidth = Math.min(screenWidth * 0.9, 380); // Largura máxima
  const keyWidth = availableWidth / whiteKeysCount;
  const whiteKeyHeight = compact ? 60 : 120; // Reduzido de 80 para 60
  const blackKeyHeight = compact ? 35 : 75;  // Reduzido de 50 para 35
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
            </View>
          </TouchableOpacity>
        );
      });
  };

  const renderBlackKeys = () => {
    // Posicionamento correto das teclas pretas baseado na sequência C5 até B6
    const blackKeyPositions = [
      // Oitava 5: C#5, D#5, F#5, G#5, A#5
      { key: 'W', left: keyWidth * 0.65 }, // C#5 entre C5(Q) e D5(E)
      { key: 'R', left: keyWidth * 1.65 }, // D#5 entre D5(E) e E5(Y)  
      { key: 'I', left: keyWidth * 3.65 }, // F#5 entre F5(U) e G5(O)
      { key: 'P', left: keyWidth * 4.65 }, // G#5 entre G5(O) e A5(A)
      { key: 'S', left: keyWidth * 5.65 }, // A#5 entre A5(A) e B5(D)
      
      // Oitava 6: C#6, D#6, F#6, G#6, A#6
      { key: 'G', left: keyWidth * 7.65 }, // C#6 entre C6(F) e D6(H)
      { key: 'J', left: keyWidth * 8.65 }, // D#6 entre D6(H) e E6(K)
      { key: 'Z', left: keyWidth * 10.65 }, // F#6 entre F6(L) e G6(X)
      { key: 'C', left: keyWidth * 11.65 }, // G#6 entre G6(X) e A6(V)
      { key: 'B', left: keyWidth * 12.65 }, // A#6 entre A6(V) e B6(N)
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
              width: keyWidth * 0.6,
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
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={[styles.keyboardContainer, compact && { padding: 8, margin: 5 }]}>
      
      <View style={[styles.pianoContainer, { 
        height: whiteKeyHeight + (compact ? 10 : 20), 
        width: pianoWidth,
        alignSelf: 'center' 
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
    margin: 10,
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
    width: '95%',
    maxWidth: 400,
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
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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