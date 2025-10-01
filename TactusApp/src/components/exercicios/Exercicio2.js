// Exercício 2 - Memória Visual (1 segundo)
// Mostra uma nota aleatória por 1 segundo, depois desaparece e o usuário deve pressionar a tecla correspondente
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import HeaderMinimal from '../HeaderMinimal';
import ButtonPage from '../ButtonPage';
import VirtualKeyboard from '../VirtualKeyboard';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import { ScaleContext } from '../../context/ScaleContext';
import { saveExerciseScore } from '../ExerciciosPage';

const Exercicio2 = () => {
  const navigation = useNavigation();
  const { 
    scaleNotes, 
    getNoteFromKey, 
    keyMapping, 
    startSustainedNote, 
    stopSustainedNote 
  } = useContext(ScaleContext);

  // Estados do exercício
  const [currentRound, setCurrentRound] = useState(1);
  const [targetNote, setTargetNote] = useState(null);
  const [showingNote, setShowingNote] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState('');

  const totalRounds = 15;
  const noteDisplayTime = 1000; // 1 segundo

  // Função para obter nota aleatória da escala
  const getRandomNote = () => {
    if (scaleNotes && scaleNotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * scaleNotes.length);
      return scaleNotes[randomIndex];
    }
    return 'C5'; // Fallback
  };

  // Iniciar nova rodada
  const startNewRound = () => {
    if (currentRound > totalRounds) {
      finishExercise();
      return;
    }

    const note = getRandomNote();
    setTargetNote(note);
    setShowingNote(true);
    setWaitingForInput(false);
    setFeedback(`Rodada ${currentRound}/${totalRounds} - Memorize rapidamente:`);

    // Esconder a nota após 1 segundo
    setTimeout(() => {
      setShowingNote(false);
      setWaitingForInput(true);
      setFeedback('Rápido! Qual nota você viu?');
    }, noteDisplayTime);
  };

  // Processar resposta do usuário
  const handleKeyPress = (pressedNote) => {
    if (!waitingForInput || finished) return;

    if (pressedNote === targetNote) {
      // Resposta correta
      const points = 5 + streak;
      setScore(prevScore => prevScore + points);
      setStreak(prevStreak => prevStreak + 1);
      setFeedback(`✅ Correto! +${points} pontos`);
    } else {
      // Resposta incorreta
      setScore(prevScore => Math.max(0, prevScore - 2));
      setStreak(0);
      setFeedback(`❌ Incorreto! A nota era ${targetNote}. -2 pontos`);
    }

    setWaitingForInput(false);
    
    // Próxima rodada após 1 segundo (mais rápido que o exercício 1)
    setTimeout(() => {
      setCurrentRound(prev => prev + 1);
    }, 1000);
  };

  // Finalizar exercício
  const finishExercise = async () => {
    setFinished(true);
    setFeedback(`Exercício concluído! Pontuação final: ${score}`);
    
    // Salvar pontuação
    await saveExerciseScore('Exercicio2', score, true);
    
    // Mostrar resultado
    Alert.alert(
      'Exercício Concluído!',
      `Sua pontuação: ${score}/320 pontos`,
      [
        { text: 'Voltar', onPress: () => navigation.goBack() }
      ]
    );
  };

  // Iniciar exercício
  useEffect(() => {
    if (scaleNotes && scaleNotes.length > 0) {
      startNewRound();
    }
  }, [currentRound, scaleNotes]);

  if (finished) {
    return (
      <View style={styles.container}>
        <HeaderMinimal title="Memória Visual 1s" showBackButton={true} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Text style={[styles.pageText, { fontSize: 24, marginBottom: 20 }]}>
            🎉 Exercício Concluído!
          </Text>
          <Text style={[styles.pageText, { fontSize: 18, marginBottom: 10 }]}>
            Pontuação Final: {score}/320
          </Text>
          <Text style={[styles.pageText, { fontSize: 14, color: '#666' }]}>
            {score >= 250 ? '🏆 Excelente reflexo!' : score >= 180 ? '👍 Boa memória!' : '💪 Continue treinando!'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderMinimal title="Memória Visual 1s" showBackButton={true} />
      
      <View style={{ flex: 1, padding: 20 }}>
        {/* Informações do exercício */}
        <View style={{ marginBottom: 20, alignItems: 'center' }}>
          <Text style={[styles.pageText, { fontSize: 16, marginBottom: 10 }]}>
            {feedback}
          </Text>
          <Text style={[styles.pageText, { fontSize: 14, color: '#666' }]}>
            Pontuação: {score} | Sequência: {streak}
          </Text>
        </View>

        {/* Área de exibição da nota */}
        <View style={{
          backgroundColor: showingNote ? '#FFEBEE' : '#F5F5F5',
          padding: 40,
          borderRadius: 15,
          marginBottom: 30,
          alignItems: 'center',
          minHeight: 120,
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: showingNote ? '#F44336' : '#E0E0E0'
        }}>
          {showingNote ? (
            <Text style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: '#D32F2F'
            }}>
              {targetNote}
            </Text>
          ) : waitingForInput ? (
            <Text style={{
              fontSize: 18,
              color: '#666',
              textAlign: 'center'
            }}>
              Qual nota você viu?
            </Text>
          ) : (
            <Text style={{
              fontSize: 16,
              color: '#999',
              textAlign: 'center'
            }}>
              Prepare-se...
            </Text>
          )}
        </View>

        {/* Teclado virtual */}
        <View style={{ flex: 1 }}>
          <VirtualKeyboard
            onKeyPress={handleKeyPress}
            showLabels={true}
            highlightedNote={null}
            disabled={!waitingForInput}
          />
        </View>
      </View>
    </View>
  );
};

export default Exercicio2;