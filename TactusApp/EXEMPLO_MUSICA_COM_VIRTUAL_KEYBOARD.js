// Exemplo de como usar o VirtualKeyboard em outras páginas de música
// Aplicar este padrão em Musica2.js, Musica3.js, Musica4.js, Musica5.js

import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Image, Text, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import TopBar from '../TopBar';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import { ScaleContext } from '../../context/ScaleContext';
import VirtualKeyboard from '../VirtualKeyboard';

// Escala específica desta música
const MUSICA_SCALE = 'C Maior'; // Alterar conforme a música

const MusicaX = () => {
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
    return () => {
      restorePreviousScale();
    };
  }, [setTemporaryScaleForMusic, restorePreviousScale]);

  // Configuração de listeners de teclado para web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (e) => {
        if (e.repeat) return;
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

      // Verificar se está em ambiente web antes de usar window
      if (typeof window !== 'undefined') {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
        };
      }
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
      <TopBar title="Música X" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.pageContent, { flexGrow: 1, paddingBottom: 20 }]}>
        <Image source={require('../../../assets/icon.png')} style={{ width: 160, height: 160 }} />
        <Text style={{ marginTop: 20, fontSize: 16, fontWeight: 'bold' }}>Escala: {String(MUSICA_SCALE || 'N/A')}</Text>
        <Text style={{ marginTop: 8, fontSize: 14 }}>Notas: {scaleNotes && scaleNotes.length > 0 ? String(scaleNotes.join(', ')) : 'Nenhuma nota disponível'}</Text>
        
        {/* Teclado Virtual para Mobile */}
        {Platform.OS !== 'web' && (
          <VirtualKeyboard
            onKeyPress={(key) => {
              const note = startSustainedNote(key);
              if (note) {
                setMessage(`🎵 Sustentando: ${key} → ${note}`);
              }
            }}
            onKeyRelease={(key) => {
              const note = stopSustainedNote(key);
              if (note) {
                setMessage(`🎵 Parou: ${key} → ${note}`);
                setTimeout(() => setMessage(''), 1000);
              }
            }}
            showLabels={true}
            compact={false}
          />
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
            : 'Toque nas teclas do piano virtual para tocar as notas'
          }
        </Text>
      </ScrollView>
    </View>
  );
};

export default MusicaX;