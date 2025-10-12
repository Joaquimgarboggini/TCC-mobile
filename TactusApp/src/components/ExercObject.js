
import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import styles from './styles';
import { ScaleContext } from '../context/ScaleContext';
import VirtualKeyboard from './VirtualKeyboard';
import { saveExerciseScore } from './ExerciciosPage';


const ExercObject = ({ notes = [], exerciseName = 'Exercicio1' }) => {
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
  const [currentChord, setCurrentChord] = useState([]);
  const [pressedKeys, setPressedKeys] = useState(new Set());

  // Função helper para obter a tecla de uma nota
  const getKeyFromNote = (note) => {
    for (const [key, mappedNote] of Object.entries(keyMapping)) {
      if (mappedNote === note) {
        return key;
      }
    }
    return '?';
  };

  // Função para detectar se a posição atual é um acorde (múltiplas notas consecutivas iguais ou repetidas)
  const getCurrentChordNotes = (index) => {
    if (index >= queue.length) return [];
    
    // Para exercícios de acordes (7 e 8), detectar padrões específicos
    if (exerciseName === 'Exercicio7' || exerciseName === 'Exercicio8') {
      const chordSize = exerciseName === 'Exercicio7' ? 3 : 4; // 3 notas (Exercicio7) ou 4 notas (Exercicio8)
      
      // Para Exercicio7: sequência é [nota1, nota2, nota3, acorde(nota1+nota2+nota3), repetir]
      // Para Exercicio8: sequência é [nota1, nota2, nota3, nota4, acorde(nota1+nota2+nota3+nota4), repetir]
      
      // As posições de acordes são: chordSize, chordSize*3, chordSize*5, etc.
      // Exercicio7: posições 3, 9, 15, ... (cada 6 posições, começando na 3)
      // Exercicio8: posições 4, 12, 20, ... (cada 8 posições, começando na 4) 
      
      const sequenceLength = chordSize * 2; // notas individuais + acorde
      const positionInSequence = index % sequenceLength;
      
      // Verifica se estamos numa posição de acorde (segunda metade da sequência)
      if (positionInSequence >= chordSize) {
        // Estamos na parte do acorde - coletar todas as notas do acorde
        const chordStartIndex = index - (positionInSequence - chordSize);
        const chordNotes = [];
        
        for (let i = 0; i < chordSize && (chordStartIndex + i) < queue.length; i++) {
          chordNotes.push(queue[chordStartIndex + i]);
        }
        
        console.log(`🎵 Detectado acorde na posição ${index} (início em ${chordStartIndex}):`, chordNotes);
        return chordNotes;
      }
    }
    
    // Para outros exercícios ou notas individuais, manter comportamento original
    const currentNote = queue[index];
    console.log(`🎵 Detectada nota individual na posição ${index}:`, [currentNote]);
    return [currentNote];
  };

  useEffect(() => {
    setQueue(notes);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setFinished(false);
    setLastMessage("");
    setIsHoldingCorrectNote(false);
    setPressedKeys(new Set());
    
    // Calcular o acorde atual para o início
    const initialChord = getCurrentChordNotes(0);
    setCurrentChord(initialChord);
  }, [notes]);

  // Atualizar acorde atual quando o índice mudar
  useEffect(() => {
    const chordNotes = getCurrentChordNotes(currentIndex);
    setCurrentChord(chordNotes);
    setPressedKeys(new Set());
    setIsHoldingCorrectNote(false);
  }, [currentIndex, queue]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (finished || e.repeat) return; // Ignora repetições automáticas
      
      const pressedKey = e.key.toUpperCase();
      const note = getNoteFromKey(pressedKey);
      if (!note) return;

      // Verificar se é um acorde ou nota única
      const isChord = currentChord.length > 1;
      
      if (isChord) {
        // Lógica para acordes
        if (currentChord.includes(note)) {
          // Nota correta do acorde pressionada
          const newPressedKeys = new Set(pressedKeys);
          newPressedKeys.add(pressedKey);
          setPressedKeys(newPressedKeys);
          startSustainedNote(pressedKey);
          
          // Verificar se todas as notas do acorde estão pressionadas
          const requiredKeys = currentChord.map(n => getKeyFromNote(n));
          const allPressed = requiredKeys.every(key => newPressedKeys.has(key));
          
          if (allPressed && !isHoldingCorrectNote) {
            setIsHoldingCorrectNote(true);
            setScore(prev => prev + 5 + (streak + 1));
            setStreak(prev => prev + 1);
            setLastMessage(`Acorde completo! +${5 + (streak + 1)} pontos - Segure todas as notas!`);
            console.log(`✅ Acorde completo pressionado: ${currentChord.join(', ')}`);
          }
        } else {
          // Nota incorreta para o acorde
          setScore(prev => prev - 2);
          setStreak(0);
          setLastMessage(`Errou! -2 pontos. Acorde esperado: ${String((currentChord || []).join(', '))}`);
          console.log(`❌ Nota incorreta no acorde: esperado ${currentChord.join(', ')}, pressionado ${note}`);
        }
      } else {
        // Lógica original para nota única
        const expectedNote = currentChord[0];
        
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
      }
    };

    const handleKeyUp = (e) => {
      if (finished) return;
      
      const releasedKey = e.key.toUpperCase();
      const note = getNoteFromKey(releasedKey);
      if (!note) return;

      const isChord = currentChord.length > 1;
      
      if (isChord) {
        // Lógica para acordes
        if (currentChord.includes(note)) {
          const newPressedKeys = new Set(pressedKeys);
          newPressedKeys.delete(releasedKey);
          setPressedKeys(newPressedKeys);
          stopSustainedNote(releasedKey);
          
          // Se todas as notas estavam corretas e pelo menos uma foi solta
          if (isHoldingCorrectNote && newPressedKeys.size === 0) {
            // Todas as notas foram soltas - acorde completo!
            setActiveNote(null);
            setIsHoldingCorrectNote(false);
            setLastMessage("Acorde liberado! Próximo...");
            
            setTimeout(() => {
              const nextIndex = currentIndex + currentChord.length;
              if (nextIndex < queue.length) {
                setCurrentIndex(nextIndex);
                setLastMessage("");
              } else {
                setFinished(true);
                setLastMessage("Exercício concluído!");
              }
            }, 300);
            
            console.log(`🎵 Acorde completo solto: ${currentChord.join(', ')}, avançando...`);
          }
        }
      } else {
        // Lógica original para nota única
        const expectedNote = currentChord[0];
        
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
      }
    };

    // Verificar se está em ambiente web antes de usar window
    if (typeof window !== 'undefined' && window.addEventListener && Platform.OS === 'web') {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }

    // No mobile (Android/iOS), a funcionalidade de teclado será via ESP32Controller
    return () => {};
  }, [queue, currentIndex, streak, finished, isHoldingCorrectNote, getNoteFromKey, startSustainedNote, stopSustainedNote]);

  // Salvar pontuação quando o exercício terminar
  useEffect(() => {
    if (finished && exerciseName) {
      saveExerciseScore(exerciseName, score, true);
    }
  }, [finished, exerciseName, score]);

  if (finished || currentIndex >= queue.length) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 16 }}>
        <Text style={styles.pageText}>Exercicio Concluido!</Text>
        <Text style={styles.pageText}>Pontuação final: {String(score || 0)}</Text>
      </View>
    );
  }

  const isChord = currentChord.length > 1;

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 16
    }}>
      {/* Título explicativo */}
      {isChord && (
        <Text style={[styles.pageText, { fontSize: 16, color: '#FF6B35', marginBottom: 10, textAlign: 'center' }]}>
          🎵 Toque todas as notas SIMULTANEAMENTE:
        </Text>
      )}
      
      {/* Notas atuais do exercício */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 15 }}>
        {currentChord.map((note, index) => {
          const expectedKey = getKeyFromNote(note);
          const isCurrentlyPressed = isKeyPressed(expectedKey);
          const isNotePressed = pressedKeys.has(expectedKey);
          
          return (
            <TouchableOpacity
              key={`${String(note || 'note')}-${String(index || 0)}`}
              style={[
                styles.button,
                {
                  backgroundColor: isChord 
                    ? (isNotePressed ? '#4CAF50' : (isHoldingCorrectNote ? '#FF9800' : '#2196F3'))
                    : (isHoldingCorrectNote && isCurrentlyPressed ? '#FF5722' : 
                       activeNote === note ? '#34C759' : '#007AFF'),
                  margin: 4,
                  minWidth: isChord ? 80 : 100,
                  transform: [{ scale: (isNotePressed || (isHoldingCorrectNote && isCurrentlyPressed)) ? 1.1 : 1.0 }],
                  shadowColor: (isNotePressed || (isHoldingCorrectNote && isCurrentlyPressed)) ? '#FF5722' : '#000',
                  shadowOpacity: (isNotePressed || (isHoldingCorrectNote && isCurrentlyPressed)) ? 0.8 : 0.3,
                  shadowRadius: (isNotePressed || (isHoldingCorrectNote && isCurrentlyPressed)) ? 8 : 4,
                  elevation: (isNotePressed || (isHoldingCorrectNote && isCurrentlyPressed)) ? 8 : 4,
                  borderWidth: isChord ? 2 : 0,
                  borderColor: isNotePressed ? '#4CAF50' : '#FFF'
                }
              ]}
              onPress={() => {
                if (finished) return;
                
                if (isChord) {
                  // Para acordes no mobile - simular pressão de todas as notas
                  if (currentChord.includes(note)) {
                    const allKeys = currentChord.map(n => getKeyFromNote(n));
                    const newPressedKeys = new Set(allKeys);
                    setPressedKeys(newPressedKeys);
                    
                    // Iniciar todas as notas
                    allKeys.forEach(key => startSustainedNote(key));
                    
                    setScore(prev => prev + 5 + (streak + 1));
                    setStreak(prev => prev + 1);
                    setLastMessage(`Acorde completo! +${5 + (streak + 1)} pontos`);
                    setIsHoldingCorrectNote(true);
                    
                    setTimeout(() => {
                      // Parar todas as notas
                      allKeys.forEach(key => stopSustainedNote(key));
                      setActiveNote(null);
                      setIsHoldingCorrectNote(false);
                      setPressedKeys(new Set());
                      
                      const nextIndex = currentIndex + currentChord.length;
                      if (nextIndex < queue.length) {
                        setCurrentIndex(nextIndex);
                      } else {
                        setFinished(true);
                      }
                    }, 1000);
                  }
                } else {
                  // Lógica original para nota única
                  if (note === currentChord[0]) {
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
                }
              }}
            >
              <Text style={[styles.buttonText, {
                textShadowColor: (isNotePressed || (isHoldingCorrectNote && isCurrentlyPressed)) ? '#000' : 'transparent',
                textShadowRadius: 2,
                fontSize: isChord ? 12 : 14
              }]}>
                {String(note || 'N/A')} ({String(expectedKey || 'N/A')})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Teclado Virtual para Mobile */}
      {Platform.OS !== 'web' && (
        <View style={{ marginTop: 10 }}>
          <VirtualKeyboard
            showLabels={true}
            compact={true}
          />
        </View>
      )}
      
      <View style={{ marginTop: 12, alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          Pontuação: {String(score || 0)} | Sequência: {String(streak || 0)}
        </Text>
        <Text style={{ 
          fontSize: 14, 
          marginTop: 6, 
          textAlign: 'center',
          color: lastMessage.includes('Errou') ? '#FF0000' : 
                 lastMessage.includes('Acertou') || lastMessage.includes('completo') ? '#34C759' : '#000'
        }}>
          {String(lastMessage || 'Aguardando...')}
        </Text>
        <Text style={{ fontSize: 12, marginTop: 6, color: '#666', textAlign: 'center' }}>
          Progresso: {String((currentIndex || 0) + 1)} / {String(queue?.length || 0)}
          {isChord ? ` (Acorde de ${String(currentChord?.length || 0)} notas)` : ''}
        </Text>
        {isChord && (
          <Text style={{ fontSize: 10, marginTop: 4, color: '#999', textAlign: 'center' }}>
            Pressione: {currentChord && currentChord.length > 0 ? 
              String(currentChord.map(note => `${String(note || 'N/A')}(${String(getKeyFromNote(note) || 'N/A')})`).join(' + ')) : 
              'Carregando...'
            }
          </Text>
        )}
      </View>
    </View>
  );
};

export default ExercObject;