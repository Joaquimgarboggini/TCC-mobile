import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Image, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import TopBar from '../TopBar';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import { ScaleContext } from '../../context/ScaleContext';

// Escala específica desta música
const MUSICA_SCALE = 'C Maior';

const Musica1 = () => {
  const navigation = useNavigation();
  const { 
    selectedScale, 
    scaleNotes, 
    keyMapping, 
    getNoteFromKey,
    setTemporaryScaleForMusic, 
    restorePreviousScale,
    startSustainedNote,
    stopSustainedNote,
    isNoteSustained
  } = useContext(ScaleContext);
  
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  // Define escala temporária ao entrar na música
  useEffect(() => {
    setTemporaryScaleForMusic(MUSICA_SCALE);
    
    // Cleanup: restaura escala anterior ao sair
    return () => {
      restorePreviousScale();
    };
  }, [setTemporaryScaleForMusic, restorePreviousScale]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (e) => {
        if (e.repeat) return; // Ignora repetições automáticas
        const note = startSustainedNote(e.key);
        if (note) {
          setMessage(`🎵 Sustentando: ${e.key.toUpperCase()} → ${note}`);
        }
      };

      const handleKeyUp = (e) => {
        const note = stopSustainedNote(e.key);
        if (note) {
          setMessage(`🎵 Parou: ${e.key.toUpperCase()} → ${note}`);
          setTimeout(() => setMessage(''), 1000);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [startSustainedNote, stopSustainedNote]);

  const handleTestNote = () => {
    // Simula sustain de uma tecla Q por um tempo
    const note = startSustainedNote('Q');
    if (note) {
      setMessage(`🎵 Testando: Q → ${note}`);
      setTimeout(() => {
        stopSustainedNote('Q');
        setMessage('');
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    // Para mobile - simula sustain rápido
    const pressedKey = e.nativeEvent.key.toUpperCase();
    const note = startSustainedNote(pressedKey);
    if (note) {
      setMessage(`🎵 Tocou: ${pressedKey} → ${note}`);
      setTimeout(() => {
        stopSustainedNote(pressedKey);
        setMessage('');
      }, 300);
    }
  };

  return (
    <View style={styles.pageContainer}>
      <TopBar title="Música 1" onBack={() => navigation.goBack()} />
      <View style={styles.pageContent}>
        <Image source={require('../../../assets/icon.png')} style={{ width: 160, height: 160 }} />
        <Text style={{ marginTop: 20, fontSize: 16, fontWeight: 'bold' }}>Escala: {MUSICA_SCALE}</Text>
        <Text style={{ marginTop: 8, fontSize: 14 }}>Notas: {scaleNotes.join(', ')}</Text>
        
        {/* Teclado Virtual para Mobile */}
        {Platform.OS !== 'web' && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
              🎹 Teclado Virtual
            </Text>
            <View style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              justifyContent: 'center',
              paddingHorizontal: 10
            }}>
              {['Q', 'W', 'E', 'R', 'Y', 'U', 'I', 'O'].map((key) => {
                const note = getNoteFromKey(key);
                const isPressed = isNoteSustained(key);
                return (
                  <TouchableOpacity
                    key={key}
                    style={{
                      backgroundColor: isPressed ? '#FF5722' : '#007AFF',
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      margin: 4,
                      borderRadius: 8,
                      minWidth: 50,
                      alignItems: 'center',
                      elevation: isPressed ? 6 : 3,
                      shadowColor: isPressed ? '#FF5722' : '#000',
                      shadowOpacity: isPressed ? 0.8 : 0.3,
                      shadowRadius: isPressed ? 6 : 3,
                      transform: [{ scale: isPressed ? 1.1 : 1.0 }]
                    }}
                    onPressIn={() => {
                      const note = startSustainedNote(key);
                      if (note) {
                        setMessage(`🎵 Sustentando: ${key} → ${note}`);
                      }
                    }}
                    onPressOut={() => {
                      const note = stopSustainedNote(key);
                      if (note) {
                        setMessage(`🎵 Parou: ${key} → ${note}`);
                        setTimeout(() => setMessage(''), 1000);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                      {key}
                    </Text>
                    <Text style={{ color: 'white', fontSize: 10 }}>
                      {note || '?'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
        
        {/* Input invisível para web */}
        {Platform.OS !== 'web' && (
          <TextInput
            ref={inputRef}
            style={{ height: 0, width: 0, opacity: 0 }}
            autoFocus
            onKeyPress={handleKeyPress}
            blurOnSubmit={false}
          />
        )}
        
        {/* Mensagem de feedback */}
        {message !== '' && (
          <Text style={{ marginTop: 16, color: '#34C759', fontSize: 16, textAlign: 'center' }}>
            {message}
          </Text>
        )}
        
        {/* Instruções */}
        <Text style={{ 
          marginTop: 16, 
          fontSize: 12, 
          color: '#666', 
          textAlign: 'center',
          paddingHorizontal: 20
        }}>
          {Platform.OS === 'web' 
            ? 'Use as teclas QWER YUIO para tocar as notas'
            : 'Toque e segure os botões para tocar as notas'
          }
        </Text>
      </View>
    </View>
  );
};

export default Musica1;
