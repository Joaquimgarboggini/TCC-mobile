// Exercício 7 - Escala Ascendente (Memorização)
// Mostra a escala selecionada em ordem ascendente, repetindo 2 vezes (16 notas total)
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderMinimal from '../HeaderMinimal';
import VirtualKeyboard from '../VirtualKeyboard';
import ESP32Invisible from '../ESP32Invisible';
import FingerMappingMessage from '../FingerMappingMessage';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import { ScaleContext } from '../../context/ScaleContext';
import { saveExerciseScore } from '../ExerciciosPage';

const Exercicio7 = () => {

  const navigation = useNavigation();
  const { 
    scaleNotes, 
    currentScale,
    getNoteFromKey, 
    keyMapping, 
    startSustainedNote, 
    stopSustainedNote,
    sustainedNotes,
    playNote,
    selectedInstrument
  } = useContext(ScaleContext);

  // Estados do exercício
  const [currentRound, setCurrentRound] = useState(1);
  const [targetNote, setTargetNote] = useState(null);
  const [showingNote, setShowingNote] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [lastResult, setLastResult] = useState(null);
  
  // Contadores
  const [pontuacao, setPontuacao] = useState(0);
  const [sequenciaAcertos, setSequenciaAcertos] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Escutar mudanças no ScaleContext para detectar ESP32 e teclas virtuais
  // Para exercícios contínuos (5+), não precisa esperar - aceita qualquer input
  useEffect(() => {
    console.log('🔍 Exercicio7: useEffect triggered - sustainedNotes:', sustainedNotes, 'finished:', finished);
    
    if (sustainedNotes && sustainedNotes.size > 0 && !finished) {
      console.log('🎯 Exercicio7: Verificando notas sustentadas...', Array.from(sustainedNotes));
      
      // Para exercícios contínuos, processar imediatamente qualquer nota
      for (const note of sustainedNotes) {
        console.log('🎹 Exercicio7: Processando nota:', note, 'Target:', targetNote);
        handleKeyPress(note);
        break; // Processar apenas uma nota por vez
      }
    }
  }, [sustainedNotes, finished]); // Removido waitingForInput - aceita sempre

  const totalRounds = 16; // 2 repetições da escala (8 notas x 2)

  // Gerar sequência ascendente da escala (2 repetições)
  const generateAscendingSequence = () => {
    if (!scaleNotes || scaleNotes.length === 0) return [];
    
    // Ordenar as notas da escala em ordem ascendente por frequência
    const sortedNotes = [...scaleNotes].sort((a, b) => {
      const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const octaveA = parseInt(a.slice(-1));
      const octaveB = parseInt(b.slice(-1));
      const noteA = a.slice(0, -1);
      const noteB = b.slice(0, -1);
      
      if (octaveA !== octaveB) return octaveA - octaveB;
      return noteOrder.indexOf(noteA) - noteOrder.indexOf(noteB);
    });

    // Repetir a sequência 2 vezes
    return [...sortedNotes, ...sortedNotes];
  };

  const [scaleSequence, setScaleSequence] = useState([]);

  // Função para converter nota para português com oitava
  const getNoteInPortuguese = (note) => {
    const noteMap = {
      'C': 'Dó',
      'D': 'Ré', 
      'E': 'Mi',
      'F': 'Fá',
      'G': 'Sol',
      'A': 'Lá',
      'B': 'Si'
    };
    
    if (!note || typeof note !== 'string') return '';
    
    const noteName = note.slice(0, -1);
    const octave = note.slice(-1);
    
    if (!noteName) return '';
    
    const baseNoteName = noteName.replace('#', '');
    const portugueseName = noteMap[baseNoteName] || baseNoteName;
    const sharpSymbol = noteName.includes('#') ? '♯' : '';
    
    return `${portugueseName}${sharpSymbol} ${octave}`;
  };

  // Inicializar sequência quando a escala estiver disponível
  useEffect(() => {
    if (scaleNotes && scaleNotes.length > 0) {
      const sequence = generateAscendingSequence();
      setScaleSequence(sequence);
      console.log('Sequência ascendente gerada:', sequence);
    }
  }, [scaleNotes]);

  // Iniciar nova rodada
  const startNewRound = () => {
    if (currentRound > totalRounds) {
      finishExercise();
      return;
    }

    if (scaleSequence.length === 0) {
      console.log('Sequência ainda não foi gerada');
      return;
    }

    const noteIndex = (currentRound - 1) % scaleSequence.length;
    const newNote = scaleSequence[noteIndex];
    
    setTargetNote(newNote);
    setShowingNote(true);
    setWaitingForInput(true);
    setFeedback(getNoteInPortuguese(newNote));

    // Tocar a nota por 1.5 segundos (sustain e playNote para garantir)
    if (playNote && typeof playNote === 'function') {
      playNote(newNote, selectedInstrument || 'Piano1');
    }
    startSustainedNote(newNote);
    setTimeout(() => {
      stopSustainedNote();
      setShowingNote(false);
      setFeedback(getNoteInPortuguese(newNote));
    }, 1500);

    console.log(`Rodada ${currentRound}: Nota alvo = ${newNote}`);
  };

  // Processar resposta do usuário
  const handleKeyPress = (pressedNote) => {
    if (finished) return; // Só bloqueia se terminou

    console.log('🎯 Exercicio7: Tecla pressionada:', pressedNote, 'Nota alvo:', targetNote);

    if (pressedNote === targetNote) {
      // Resposta correta
      const points = 5 + sequenciaAcertos;
      setPontuacao(prevScore => prevScore + points);
      setSequenciaAcertos(prevStreak => prevStreak + 1);
      setAcertos(prevAcertos => prevAcertos + 1);
      setLastResult('correct');
      setFeedback(`✅ Correto! +${points} pontos`);
      console.log('✅ Exercicio7: Resposta correta! Pontos:', points, 'Sequência:', sequenciaAcertos + 1);
    } else {
      // Resposta incorreta
      setPontuacao(prevScore => Math.max(0, prevScore - 2));
      setSequenciaAcertos(0);
      setErros(prevErros => prevErros + 1);
      setLastResult('wrong');
      setFeedback(`❌ Incorreto! A nota era ${getNoteInPortuguese(targetNote) || 'desconhecida'}. -2 pontos`);
      console.log('❌ Exercicio7: Resposta incorreta! Pontuação:', pontuacao - 2);
    }

    setWaitingForInput(false);
    
    // Próxima rodada após 1.5 segundos
    setTimeout(() => {
      setLastResult(null);
      setCurrentRound(prev => prev + 1);
    }, 1500);
  };

  // Finalizar exercício
  const finishExercise = async () => {
    setFinished(true);
    setFeedback(`Exercício concluído! Pontuação final: ${pontuacao}`);
    
    // Salvar pontuação
    await saveExerciseScore('Exercicio7', pontuacao, true);
    
    // Mostrar modal de conclusão
    setShowCompletionModal(true);
  };

  // Inicializar o exercício quando a sequência estiver disponível
  useEffect(() => {
    if (scaleSequence.length > 0 && currentRound === 1) {
      startNewRound();
    }
  }, [scaleSequence]);

  // Gerenciar mudanças de rodada
  useEffect(() => {
    if (currentRound > 1 && currentRound <= totalRounds) {
      startNewRound();
    } else if (currentRound > totalRounds) {
      finishExercise();
    }
  }, [currentRound]);

  return (
    <View style={styles.container}>
      <HeaderMinimal 
        title="Escala Ascendente" 
        iconType="memoria" 
        onBack={() => navigation.goBack()}
        showHelpButton={true}
        onHelpPress={() => setShowHelpModal(true)}
      />
      
      <View style={{ flex: 1, paddingHorizontal: 15, paddingTop: 100 }}>
        {/* CONTADOR ROBUSTO - IDÊNTICO AOS EXERCÍCIOS DE MEMÓRIA */}
        <View style={{
          backgroundColor: '#FFFFFF',
          paddingVertical: 15,
          paddingHorizontal: 10,
          marginBottom: 30,
          borderRadius: 15,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 80,
          elevation: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        }}>
          {/* Container dos 4 quadrados */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            gap: 8,
          }}>
            {/* Quadrado ACERTOS - Verde */}
            <View style={{
              flex: 1,
              backgroundColor: '#E8F5E8',
              borderWidth: 2,
              borderColor: '#4CAF50',
              borderRadius: 8,
              paddingVertical: 8,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 50,
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '900',
                color: '#2E7D32',
                textAlign: 'center',
              }}>
                {String(acertos || 0)}
              </Text>
              <Text style={{
                fontSize: 10,
                fontWeight: '700',
                color: '#2E7D32',
                textAlign: 'center',
                marginTop: 2,
              }}>
                ACERTOS
              </Text>
            </View>

            {/* Quadrado ERROS - Vermelho */}
            <View style={{
              flex: 1,
              backgroundColor: '#FFEBEE',
              borderWidth: 2,
              borderColor: '#F44336',
              borderRadius: 8,
              paddingVertical: 8,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 50,
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '900',
                color: '#C62828',
                textAlign: 'center',
              }}>
                {String(erros || 0)}
              </Text>
              <Text style={{
                fontSize: 10,
                fontWeight: '700',
                color: '#C62828',
                textAlign: 'center',
                marginTop: 2,
              }}>
                ERROS
              </Text>
            </View>

            {/* Quadrado PONTOS - Azul */}
            <View style={{
              flex: 1,
              backgroundColor: '#E3F2FD',
              borderWidth: 2,
              borderColor: '#2196F3',
              borderRadius: 8,
              paddingVertical: 8,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 50,
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '900',
                color: '#1565C0',
                textAlign: 'center',
              }}>
                {String(pontuacao || 0)}
              </Text>
              <Text style={{
                fontSize: 10,
                fontWeight: '700',
                color: '#1565C0',
                textAlign: 'center',
                marginTop: 2,
              }}>
                PONTOS
              </Text>
            </View>

            {/* Quadrado SEQUÊNCIA - Laranja */}
            <View style={{
              flex: 1,
              backgroundColor: '#FFF3E0',
              borderWidth: 2,
              borderColor: '#FF9800',
              borderRadius: 8,
              paddingVertical: 8,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 50,
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '900',
                color: '#E65100',
                textAlign: 'center',
              }}>
                {String(sequenciaAcertos || 0)}
              </Text>
              <Text style={{
                fontSize: 10,
                fontWeight: '700',
                color: '#E65100',
                textAlign: 'center',
                marginTop: 2,
              }}>
                SEQUÊNCIA
              </Text>
            </View>
          </View>
        </View>

        {/* Área de feedback */}
        <View style={{
          backgroundColor: lastResult === 'correct' ? '#E8F5E8' : 
                          lastResult === 'wrong' ? '#FFEBEE' : 
                          showingNote ? '#E3F2FD' : '#F5F5F5',
          paddingVertical: 20,
          paddingHorizontal: 20,
          marginBottom: 30,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: lastResult === 'correct' ? '#4CAF50' : 
                       lastResult === 'wrong' ? '#F44336' : 
                       showingNote ? '#2196F3' : '#E0E0E0',
          minHeight: 80,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={[styles.pageText, { 
            fontSize: 18,
            fontWeight: '600',
            color: lastResult === 'correct' ? '#2E7D32' : 
                   lastResult === 'wrong' ? '#C62828' : 
                   showingNote ? '#1565C0' : '#333',
            textAlign: 'center'
          }]}>
            {feedback || ' '}
          </Text>
          
          {currentScale && (
            <Text style={{
              fontSize: 14,
              color: '#666',
              marginTop: 8,
              textAlign: 'center',
              fontWeight: '500'
            }}>
              Escala: {String(currentScale || 'Nenhuma')}
            </Text>
          )}
        </View>

       <View style={{ 
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 50,
          marginBottom: 60,
        }}>
          <VirtualKeyboard
            showLabels={true}
            compact={true}
            onKeyPress={handleKeyPress}
          />
          
        </View>

        <View style={{ 
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 50,
        }}>
          <FingerMappingMessage keyMapping={keyMapping} />
        </View>

        {/* Completion Modal */}
        <Modal
          visible={showCompletionModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCompletionModal(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
            <View style={{
              backgroundColor: 'rgba(20, 20, 20, 0.9)',
              borderRadius: 15,
              padding: 25,
              width: '90%',
              maxWidth: 400,
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: 20,
                textAlign: 'center',
              }}>
                🎉 Exercício Concluído!
              </Text>
              
              <Text style={{
                fontSize: 20,
                color: '#fff',
                marginBottom: 10,
                textAlign: 'center',
              }}>
                Pontuação Final: {String(pontuacao || 0)}/200
              </Text>
              
              <Text style={{
                fontSize: 16,
                color: '#aaa',
                marginBottom: 20,
                textAlign: 'center',
              }}>
                Rodadas: {String((currentRound || 1) - 1)}/{String(totalRounds || 0)}
              </Text>
              
              <Text style={{
                fontSize: 18,
                color: '#fff',
                marginBottom: 30,
                textAlign: 'center',
              }}>
                {pontuacao >= 160 ? '🏆 Excelente!' : 
                 pontuacao >= 100 ? '👍 Bom trabalho!' : 
                 '💪 Continue praticando!'}
              </Text>
              
              <TouchableOpacity
                style={{
                  backgroundColor: '#4CAF50',
                  paddingHorizontal: 30,
                  paddingVertical: 12,
                  borderRadius: 8,
                }}
                onPress={() => {
                  setShowCompletionModal(false);
                  navigation.navigate('Exercicios');
                }}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#fff',
                }}>
                  Voltar aos Exercícios
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Help Modal */}
        <Modal
          visible={showHelpModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowHelpModal(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
            <View style={{
              backgroundColor: 'rgba(20, 20, 20, 0.6)',
              borderRadius: 15,
              padding: 25,
              width: '90%',
              maxWidth: 400,
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#fff',
                }}>
                  Como Jogar?
                </Text>
                <TouchableOpacity onPress={() => setShowHelpModal(false)}>
                  <Icon name="times" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={{
                fontSize: 16,
                color: '#fff',
                lineHeight: 24,
              }}>
                Escala Ascendente 16{'\n\n'}
                Você ouvirá cada nota da escala selecionada em ordem ascendente (do grave ao agudo). A sequência se repete 2 vezes, totalizando 16 notas.{'\n\n'}
                Memorize cada nota e toque-a no teclado virtual quando solicitado.{'\n\n'}
                Pontuação:{'\n'}
                • Acerto: +5 + sequência{'\n'}
                • Erro: -2
              </Text>
            </View>
          </View>
        </Modal>
        
        {/* ESP32 Invisible - permite input via ESP32 sem interface */}
        <ESP32Invisible />
      </View>
    </View>
  );
};

export default Exercicio7;
