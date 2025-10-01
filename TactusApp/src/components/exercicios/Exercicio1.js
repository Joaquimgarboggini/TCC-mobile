// Exercício 1 - Memória Visual (2 segundos)
// Mostra uma nota aleatória por 2 segundos, depois desaparece e o usuário deve pressionar a tecla correspondente
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import HeaderMinimal from '../HeaderMinimal';
import ButtonPage from '../ButtonPage';
import VirtualKeyboard from '../VirtualKeyboard';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import { ScaleContext } from '../../context/ScaleContext';
import { saveExerciseScore } from '../ExerciciosPage';

const Exercicio1 = () => {
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

  const totalRounds = 10;
  const noteDisplayTime = 2000; // 2 segundos

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
    setFeedback(`Rodada ${currentRound}/${totalRounds} - Memorize a nota:`);

    // Esconder a nota após 2 segundos
    setTimeout(() => {
      setShowingNote(false);
      setWaitingForInput(true);
      setFeedback('Agora pressione a tecla da nota que você viu!');
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
    
    // Próxima rodada após 1.5 segundos
    setTimeout(() => {
      setCurrentRound(prev => prev + 1);
    }, 1500);
  };

  // Finalizar exercício
  const finishExercise = async () => {
    setFinished(true);
    setFeedback(`Exercício concluído! Pontuação final: ${score}`);
    
    // Salvar pontuação
    await saveExerciseScore('Exercicio1', score, true);
    
    // Mostrar resultado
    Alert.alert(
      'Exercício Concluído!',
      `Sua pontuação: ${score}/185 pontos`,
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
        <HeaderMinimal title="Memória Visual 2s" showBackButton={true} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Text style={[styles.pageText, { fontSize: 24, marginBottom: 20 }]}>
            🎉 Exercício Concluído!
          </Text>
          <Text style={[styles.pageText, { fontSize: 18, marginBottom: 10 }]}>
            Pontuação Final: {score}/185
          </Text>
          <Text style={[styles.pageText, { fontSize: 14, color: '#666' }]}>
            {score >= 150 ? '🏆 Excelente!' : score >= 100 ? '👍 Bom trabalho!' : '💪 Continue praticando!'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderMinimal title="Memória Visual 2s" showBackButton={true} />
      
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
          backgroundColor: showingNote ? '#E3F2FD' : '#F5F5F5',
          padding: 40,
          borderRadius: 15,
          marginBottom: 30,
          alignItems: 'center',
          minHeight: 120,
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: showingNote ? '#2196F3' : '#E0E0E0'
        }}>
          {showingNote ? (
            <Text style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: '#1976D2'
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

export default Exercicio1;