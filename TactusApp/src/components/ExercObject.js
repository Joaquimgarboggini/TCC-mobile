import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from './styles';
import { noteToKey, keyToNote } from '../KeyboardPlay';

const ExercObject = ({ notes = Object.keys(noteToKey) }) => {
  const [activeNote, setActiveNote] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const pressedKey = e.key.toUpperCase();
      const note = keyToNote[pressedKey];
      if (note && notes.includes(note)) {
        setActiveNote(note);
      }
    };
    const handleKeyUp = (e) => {
      const pressedKey = e.key.toUpperCase();
      const note = keyToNote[pressedKey];
      if (note && notes.includes(note)) {
        setActiveNote(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [notes]);

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
      {notes.map(note => (
        <TouchableOpacity
          key={note}
          style={[
            styles.button,
            { 
              backgroundColor: activeNote === note ? '#34C759' : '#007AFF',
              margin: 4,
              minWidth: 60
            }
          ]}
          onPress={() => setActiveNote(note)}
          onPressOut={() => setActiveNote(null)}
        >
          <Text style={styles.buttonText}>
            {note} ({noteToKey[note]})
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ExercObject;