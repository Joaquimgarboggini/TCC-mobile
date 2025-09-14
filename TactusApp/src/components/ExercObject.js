
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from './styles';
import { noteToKey, keyToNote } from '../KeyboardPlay';


const ExercObject = ({ notes = Object.keys(noteToKey) }) => {
  const [queue, setQueue] = useState(notes);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeNote, setActiveNote] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    setQueue(notes);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setFinished(false);
    setLastMessage("");
  }, [notes]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (finished) return;
      const pressedKey = e.key.toUpperCase();
      const note = keyToNote[pressedKey];
      if (!note) return;
      if (queue[currentIndex] === note) {
        setActiveNote(note);
        setScore(prev => prev + 5 + (streak + 1));
        setStreak(prev => prev + 1);
        setLastMessage("Acertou! +" + (5 + (streak + 1)) + " pontos");
        setTimeout(() => {
          setActiveNote(null);
          if (currentIndex < queue.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            setFinished(true);
          }
        }, 150);
      } else {
        setScore(prev => prev - 2);
        setStreak(0);
        setLastMessage("Errou! -2 pontos");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [queue, currentIndex, streak, finished, keyToNote]);

  if (finished || currentIndex >= queue.length) {
    return (
      <View style={{ alignItems: 'center', margin: 16 }}>
        <Text style={styles.pageText}>Exercicio Concluido!</Text>
        <Text style={styles.pageText}>Pontuação final: {score}</Text>
      </View>
    );
  }

  const note = queue[currentIndex];

  return (
    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
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
          onPress={() => {
            if (finished) return;
            if (note === queue[currentIndex]) {
              setActiveNote(note);
              setScore(prev => prev + 5 + (streak + 1));
              setStreak(prev => prev + 1);
              setLastMessage("Acertou! +" + (5 + (streak + 1)) + " pontos");
              setTimeout(() => {
                setActiveNote(null);
                if (currentIndex < queue.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                } else {
                  setFinished(true);
                }
              }, 150);
            }
          }}
        >
          <Text style={styles.buttonText}>
            {note} ({noteToKey[note]})
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={{ marginTop: 16, fontSize: 16 }}>Pontuação: {score}</Text>
      <Text style={{ marginTop: 4, fontSize: 14 }}>{lastMessage}</Text>
    </View>
  );
};

export default ExercObject;