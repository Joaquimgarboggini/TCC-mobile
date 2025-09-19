import React, { useEffect, useContext, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, Platform } from 'react-native';
import TopBar from './TopBar';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ScaleContext } from '../context/ScaleContext';

// Piano com oitavas 5 e 6 lado a lado
const PIANO_LAYOUT = [
  // Oitava 5 (com mapeamento QWER YUIO)
  { note: 'C5', isBlack: false, key: 'Q' },
  { note: 'C#5', isBlack: true, key: null },
  { note: 'D5', isBlack: false, key: 'W' },
  { note: 'D#5', isBlack: true, key: null },
  { note: 'E5', isBlack: false, key: 'E' },
  { note: 'F5', isBlack: false, key: 'R' },
  { note: 'F#5', isBlack: true, key: null },
  { note: 'G5', isBlack: false, key: 'Y' },
  { note: 'G#5', isBlack: true, key: null },
  { note: 'A5', isBlack: false, key: 'U' },
  { note: 'A#5', isBlack: true, key: null },
  { note: 'B5', isBlack: false, key: 'I' },
  
  // Oitava 6
  { note: 'C6', isBlack: false, key: 'O' },
  { note: 'C#6', isBlack: true, key: null },
  { note: 'D6', isBlack: false, key: null },
  { note: 'D#6', isBlack: true, key: null },
  { note: 'E6', isBlack: false, key: null },
  { note: 'F6', isBlack: false, key: null },
  { note: 'F#6', isBlack: true, key: null },
  { note: 'G6', isBlack: false, key: null },
  { note: 'G#6', isBlack: true, key: null },
  { note: 'A6', isBlack: false, key: null },
  { note: 'A#6', isBlack: true, key: null },
  { note: 'B6', isBlack: false, key: null },
];

const TecladoPage = () => {
  const navigation = useNavigation();
  const { 
    selectedScale, 
    scaleNotes, 
    getNoteFromKey, 
    keyMapping,
    startSustainedNote,
    stopSustainedNote,
    isKeyPressed,
    isNoteSustained
  } = useContext(ScaleContext);

  const [sustainMessage, setSustainMessage] = useState('');

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    // Adicionar listeners de teclado para web
    if (Platform.OS === 'web') {
      const handleKeyDown = (e) => {
        if (e.repeat) return; // Ignora repetições automáticas
        const note = startSustainedNote(e.key);
        if (note) {
          setSustainMessage(`🎵 Sustentando: ${e.key.toUpperCase()} → ${note}`);
        }
      };

      const handleKeyUp = (e) => {
        const note = stopSustainedNote(e.key);
        if (note) {
          setSustainMessage(`🎵 Parou: ${e.key.toUpperCase()} → ${note}`);
          setTimeout(() => setSustainMessage(''), 1000);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      };
    }

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, [startSustainedNote, stopSustainedNote]);

  // Função para simular o pressionamento de qualquer nota do piano
  const handleNotePress = (noteData) => {
    const { note, key } = noteData;
    
    if (key) {
      // Se a nota tem uma tecla mapeada, usa o sistema de sustain
      const mappedNote = getNoteFromKey(key);
      if (mappedNote) {
        startSustainedNote(key);
        setSustainMessage(`🎵 Tocou: ${key} → ${note}`);
        setTimeout(() => {
          stopSustainedNote(key);
          setSustainMessage('');
        }, 300);
      }
    } else {
      // Para notas sem mapeamento, apenas feedback visual
      setSustainMessage(`🎵 Tocou: ${note}`);
      setTimeout(() => setSustainMessage(''), 300);
    }
    
    console.log(`Nota ${note} pressionada`);
  };

  // Função para verificar se uma nota faz parte da escala atual
  const isNoteInCurrentScale = (note) => {
    return scaleNotes.includes(note);
  };

  // Função para obter a cor do texto baseado na escala
  const getNoteTextColor = (note) => {
    return isNoteInCurrentScale(note) ? '#FF0000' : '#000000'; // Vermelho para notas da escala
  };

  // Renderiza uma tecla do piano
  const renderPianoKey = (noteData, index) => {
    const { note, isBlack, key } = noteData;
    const isPressed = key ? isKeyPressed(key) : false;
    const isInScale = isNoteInCurrentScale(note);
    
    return (
      <TouchableOpacity
        key={index}
        style={{
          backgroundColor: isPressed ? '#FF5722' : (isBlack ? '#1A1A1A' : '#FFFFFF'),
          borderColor: isBlack ? '#000000' : '#CCCCCC',
          borderWidth: 1,
          margin: 1,
          borderRadius: 4,
          alignItems: 'center',
          justifyContent: 'space-between',
          elevation: isBlack ? 4 : 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: isBlack ? 4 : 2 },
          shadowOpacity: isBlack ? 0.4 : 0.15,
          shadowRadius: isBlack ? 4 : 2,
          // Layout realista do piano
          width: isBlack ? 28 : 42,
          height: isBlack ? 75 : 110,
          zIndex: isBlack ? 2 : 1,
          // Teclas pretas sobrepostas
          marginLeft: isBlack ? -14 : 0,
          marginRight: isBlack ? -14 : 0,
        }}
        onPress={() => handleNotePress(noteData)}
        activeOpacity={0.8}
      >
        {/* Nome da nota */}
        <Text style={{
          color: isBlack ? (isInScale ? '#FF0000' : '#FFFFFF') : getNoteTextColor(note),
          fontSize: isBlack ? 8 : 10,
          fontWeight: isInScale ? 'bold' : 'normal',
          textAlign: 'center',
          marginTop: 5
        }}>
          {note}
        </Text>
        
        {/* Tecla mapeada (se houver) */}
        {key && (
          <Text style={{
            color: isBlack ? '#BBBBBB' : '#666666',
            fontSize: 7,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 5
          }}>
            {key}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.pageContainer}>
      <TopBar title="Piano Completo" onBack={() => navigation.goBack()} />
      <View style={styles.pageContent}>
        <Text style={styles.pageText}>Piano Virtual - Escala: {selectedScale}</Text>
        
        <View style={{ marginBottom: 10 }}>
          <Text style={[styles.pageText, { fontSize: 14 }]}>
            Notas da escala atual: {scaleNotes.join(' - ')}
          </Text>
        </View>
        
        {/* Mensagem de sustain */}
        
        {/* Legenda */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center', 
          marginBottom: 15,
          flexWrap: 'wrap'
        }}>
          
        </View>
        
        {/* Piano layout - Oitavas 5 e 6 lado a lado */}
        <View style={{ 
          flexDirection: 'column', 
          alignItems: 'center',
          backgroundColor: '#F5F5F5',
          padding: 15,
          borderRadius: 8,
          marginHorizontal: 10
        }}>
          
          {/* Título do Piano */}
          
          {/* Layout do piano como piano real */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'center',
            alignItems: 'flex-start',
            backgroundColor: '#000',
            padding: 8,
            borderRadius: 6,
            flexWrap: 'wrap'
          }}>
            {PIANO_LAYOUT.map((noteData, index) => renderPianoKey(noteData, index))}
          </View>
          
          {/* Indicador das oitavas */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-around', 
            width: '100%',
            marginTop: 8
          }}>
          </View>
        </View>
        
        {/* Informações adicionais */}
      </View>
    </View>
  );
};

export default TecladoPage;