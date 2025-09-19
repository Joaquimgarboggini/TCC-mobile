
import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from './styles';
import { ScaleContext } from '../context/ScaleContext';


const ExercObject = ({ notes = [] }) => {
  const { 
    getNoteFromKey, 
    keyMapping, 
    startSustainedNote, 
    stopSustainedNote, 
    isKeyPressed 
  } = useContext(ScaleContext);
  
  const [queue, setQueue] = useState(notes);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeNote, setActiveNote] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const [isHoldingCorrectNote, setIsHoldingCorrectNote] = useState(false);

  // Função helper para obter a tecla de uma nota
  const getKeyFromNote = (note) => {
    for (const [key, mappedNote] of Object.entries(keyMapping)) {
      if (mappedNote === note) {
        return key;
      }
    }
    return '?';
  };

  useEffect(() => {
    setQueue(notes);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setFinished(false);
    setLastMessage("");
    setIsHoldingCorrectNote(false);
  }, [notes]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (finished || e.repeat) return; // Ignora repetições automáticas
      
      const pressedKey = e.key.toUpperCase();
      const note = getNoteFromKey(pressedKey);
      if (!note) return;

      const expectedNote = queue[currentIndex];
      
      if (expectedNote === note) {
        // Nota correta pressionada
        if (!isHoldingCorrectNote) {
          setActiveNote(note);
          setScore(prev => prev + 5 + (streak + 1));
          setStreak(prev => prev + 1);
          setLastMessage("Acertou! +" + (5 + (streak + 1)) + " pontos - Segure a nota!");
          setIsHoldingCorrectNote(true);
          startSustainedNote(pressedKey);
          console.log(`✅ Nota correta pressionada: ${pressedKey} → ${note}`);
        }
      } else {
        // Nota incorreta
        setScore(prev => prev - 2);
        setStreak(0);
        setLastMessage("Errou! -2 pontos. Nota esperada: " + expectedNote);
        console.log(`❌ Nota incorreta: esperado ${expectedNote}, pressionado ${note}`);
      }
    };

    const handleKeyUp = (e) => {
      if (finished) return;
      
      const releasedKey = e.key.toUpperCase();
      const note = getNoteFromKey(releasedKey);
      if (!note) return;

      const expectedNote = queue[currentIndex];
      
      if (expectedNote === note && isHoldingCorrectNote) {
        // Nota correta foi solta - avança para próxima
        setActiveNote(null);
        setIsHoldingCorrectNote(false);
        stopSustainedNote(releasedKey);
        setLastMessage("Nota liberada! Próxima...");
        
        setTimeout(() => {
          if (currentIndex < queue.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setLastMessage("");
          } else {
            setFinished(true);
            setLastMessage("Exercício concluído!");
          }
        }, 300);
        
        console.log(`🎵 Nota solta: ${releasedKey} → ${note}, avançando...`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [queue, currentIndex, streak, finished, isHoldingCorrectNote, getNoteFromKey, startSustainedNote, stopSustainedNote]);

  if (finished || currentIndex >= queue.length) {
    return (
      <View style={{ alignItems: 'center', margin: 16 }}>
        <Text style={styles.pageText}>Exercicio Concluido!</Text>
        <Text style={styles.pageText}>Pontuação final: {score}</Text>
      </View>
    );
  }

  const note = queue[currentIndex];
  const expectedKey = getKeyFromNote(note);
  const isCurrentlyPressed = isKeyPressed(expectedKey);

  return (
    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
        <TouchableOpacity
          key={note}
          style={[
            styles.button,
            {
              backgroundColor: isHoldingCorrectNote && isCurrentlyPressed ? '#FF5722' : 
                               activeNote === note ? '#34C759' : '#007AFF',
              margin: 4,
              minWidth: 80,
              transform: [{ scale: isHoldingCorrectNote && isCurrentlyPressed ? 1.1 : 1.0 }],
              shadowColor: isHoldingCorrectNote && isCurrentlyPressed ? '#FF5722' : '#000',
              shadowOpacity: isHoldingCorrectNote && isCurrentlyPressed ? 0.8 : 0.3,
              shadowRadius: isHoldingCorrectNote && isCurrentlyPressed ? 8 : 4,
              elevation: isHoldingCorrectNote && isCurrentlyPressed ? 8 : 4
            }
          ]}
          onPress={() => {
            if (finished) return;
            // Para mobile - simula sustain rápido
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
              }, 500);
            }
          }}
        >
          <Text style={[styles.buttonText, {
            textShadowColor: isHoldingCorrectNote && isCurrentlyPressed ? '#000' : 'transparent',
            textShadowRadius: 2
          }]}>
            {note} ({expectedKey})
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={{ marginTop: 16, alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          Pontuação: {score} | Sequência: {streak}
        </Text>
        <Text style={{ 
          fontSize: 14, 
          marginTop: 8, 
          textAlign: 'center',
          color: lastMessage.includes('Errou') ? '#FF0000' : 
                 lastMessage.includes('Acertou') ? '#34C759' : '#000'
        }}>
          {lastMessage}
        </Text>
        <Text style={{ fontSize: 12, marginTop: 8, color: '#666', textAlign: 'center' }}>
          Progresso: {currentIndex + 1} / {queue.length}
        </Text>
      </View>
    </View>
  );
};

export default ExercObject;