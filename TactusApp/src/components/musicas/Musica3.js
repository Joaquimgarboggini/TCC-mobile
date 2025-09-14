import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import TopBar from '../TopBar';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';

const scaleNotes = ['C5', 'D5', 'D#5', 'F5', 'G5', 'G#5', 'A#5', 'C6'];
const scaleName = 'C menor';
const keyToNote = {
  'A': 'A#5', 'B': 'B5', 'C': 'C5', 'D': 'D5', 'E': 'D#5', 'F': 'F5', 'G': 'G5', 'H': 'G#5',
};

const Musica3 = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (e) => {
        const pressedKey = e.key.toUpperCase();
        const note = keyToNote[pressedKey];
        if (note && scaleNotes.includes(note)) {
          setMessage(`Você pressionou a nota ${note} da escala!`);
          setTimeout(() => setMessage(''), 1200);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  const handleTestNote = () => {
    setMessage(`Você pressionou uma nota da escala!`);
    setTimeout(() => setMessage(''), 1200);
  };

  const handleKeyPress = (e) => {
    const pressedKey = e.nativeEvent.key.toUpperCase();
    const note = keyToNote[pressedKey];
    if (note && scaleNotes.includes(note)) {
      setMessage(`Você pressionou a nota ${note} da escala!`);
      setTimeout(() => setMessage(''), 1200);
    }
  };

  return (
    <View style={styles.pageContainer}>
      <TopBar title="Música 3" onBack={() => navigation.goBack()} />
      <View style={styles.pageContent}>
        <Image source={require('../../../assets/icon.png')} style={{ width: 180, height: 180 }} />
        <Text style={{ marginTop: 24, fontSize: 16, fontWeight: 'bold' }}>Escala: {scaleName}</Text>
        <Text style={{ marginTop: 8, fontSize: 15 }}>Notas: {scaleNotes.join(', ')}</Text>
        {Platform.OS !== 'web' && (
          <TextInput
            ref={inputRef}
            style={{ height: 0, width: 0, opacity: 0 }}
            autoFocus
            onKeyPress={handleKeyPress}
            blurOnSubmit={false}
          />
        )}
        <TouchableOpacity style={[styles.button, { marginTop: 16 }]} onPress={handleTestNote}>
          <Text style={styles.buttonText}>Testar nota</Text>
        </TouchableOpacity>
        {message !== '' && (
          <Text style={{ marginTop: 16, color: '#34C759', fontSize: 16 }}>{message}</Text>
        )}
      </View>
    </View>
  );
};

export default Musica3;
