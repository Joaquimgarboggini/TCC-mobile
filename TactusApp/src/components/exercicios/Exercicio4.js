// Exercício 4 - Memória de Leitura (1 segundo)
// Mostra uma partitura por 1 segundo, depois desaparece e o usuário deve pressionar a tecla correspondente
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, Image, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderMinimal from '../HeaderMinimal';
import ButtonPage from '../ButtonPage';
import VirtualKeyboard from '../VirtualKeyboard';
import ESP32Invisible from '../ESP32Invisible';
import FingerMappingMessage from '../FingerMappingMessage';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import { ScaleContext } from '../../context/ScaleContext';
import { saveExerciseScore } from '../ExerciciosPage';

const Exercicio4 = () => {
  const navigation = useNavigation();
  const { 
    scaleNotes, 
    getNoteFromKey, 
    keyMapping, 
    startSustainedNote, 
    stopSustainedNote,
    sustainedNotes
  } = useContext(ScaleContext);

  const { 
    playNote,
    selectedInstrument
  } = useContext(ScaleContext);
  // Estados do exercício - DIRETO E SIMPLES
  const [currentRound, setCurrentRound] = useState(1);
  const [targetNote, setTargetNote] = useState(null);
  const [showingNote, setShowingNote] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [lastResult, setLastResult] = useState(null);
  const [processedNotes, setProcessedNotes] = useState(new Set());
  
  // CONTADORES SIMPLES QUE VÃO FUNCIONAR
  const [pontuacao, setPontuacao] = useState(0);

  const [sequenciaAcertos, setSequenciaAcertos] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Escutar mudanças no ScaleContext para detectar ESP32 e teclas virtuais
  useEffect(() => {
    console.log('🔍 Exercicio4: useEffect triggered - sustainedNotes:', sustainedNotes, 'waitingForInput:', waitingForInput, 'finished:', finished);
    
    if (sustainedNotes && sustainedNotes.size > 0 && waitingForInput && !finished) {
      console.log('🎯 Exercicio4: Verificando notas sustentadas...', Array.from(sustainedNotes));
      
      // Verificar se há novas notas tocadas
      for (const note of sustainedNotes) {
        if (!processedNotes.has(note)) {
          console.log('🎹 Exercicio4: Nova nota detectada:', note, 'Target:', targetNote);
          setProcessedNotes(prev => new Set(prev).add(note));
          handleKeyPress(note);
          break; // Processar apenas uma nota por vez
        }
      }
    } else {
      console.log('🚫 Exercicio4: Condições não atendidas para processar notas');
    }
  }, [sustainedNotes, waitingForInput, finished]);

  // Limpar notas processadas quando necessário
  useEffect(() => {
    if (!waitingForInput) {
      setProcessedNotes(new Set());
    }
  }, [waitingForInput]);

  // Debug - log dos estados
  useEffect(() => {
    console.log('Exercicio4 - Estados atuais:', {
      currentRound,
      pontuacao,
      sequenciaAcertos,
      scaleNotes: scaleNotes?.length || 0,
      keyMapping: keyMapping ? Object.keys(keyMapping).length : 0
    });
  }, [currentRound, pontuacao, sequenciaAcertos, scaleNotes, keyMapping]);

  const totalRounds = 15;
  const noteDisplayTime = 1000; // 1 segundo

  // Teclas disponíveis (QWER YUIO)
  const availableKeys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']; // Todas as teclas da escala

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
    
    if (!note) return '';
    
    const noteName = note.charAt(0);
    const octave = note.slice(1);
    const portugueseName = noteMap[noteName] || noteName;
    
    return `${portugueseName} ${octave}`;
  };

  // Função para obter o arquivo de imagem da partitura
  const getNoteImagePath = (note) => {
    if (!note) return null;
    
    // Converter nota para nome do arquivo (C# vira Csharp)
    let fileName = note.replace('#', 'sharp');
    
    const imageMap = {
      'C5': require('../../../assets/reading/C5.png'),
      'Csharp5': require('../../../assets/reading/Csharp5.png'),
      'D5': require('../../../assets/reading/D5.png'),
      'Dsharp5': require('../../../assets/reading/Dsharp5.png'),
      'E5': require('../../../assets/reading/E5.png'),
      'F5': require('../../../assets/reading/F5.png'),
      'Fsharp5': require('../../../assets/reading/Fsharp5.png'),
      'G5': require('../../../assets/reading/G5.png'),
      'Gsharp5': require('../../../assets/reading/Gsharp5.png'),
      'A5': require('../../../assets/reading/A5.png'),
      'Asharp5': require('../../../assets/reading/Asharp5.png'),
      'B5': require('../../../assets/reading/B5.png'),
      'C6': require('../../../assets/reading/C6.png'),
      'Csharp6': require('../../../assets/reading/Csharp6.png'),
      'D6': require('../../../assets/reading/D6.png'),
      'Dsharp6': require('../../../assets/reading/Dsharp6.png'),
      'E6': require('../../../assets/reading/E6.png'),
      'F6': require('../../../assets/reading/F6.png'),
      'Fsharp6': require('../../../assets/reading/Fsharp6.png'),
      'G6': require('../../../assets/reading/G6.png'),
      'Gsharp6': require('../../../assets/reading/Gsharp6.png'),
      'A6': require('../../../assets/reading/A6.png'),
      'Asharp6': require('../../../assets/reading/Asharp6.png'),
      'B6': require('../../../assets/reading/B6.png'),
    };
    
    return imageMap[fileName] || null;
  };

  // Gerar nota aleatória disponível
  const getRandomNote = () => {
    if (!scaleNotes || scaleNotes.length === 0) {
      return 'C5'; // Fallback;
    }
    const notesToChoose = scaleNotes.slice(0, 10);
    if (notesToChoose.length > 0) {
      const randomIndex = Math.floor(Math.random() * notesToChoose.length);
      return notesToChoose[randomIndex];
    }
    return 'C5'; // Fallback
  };

  // Iniciar nova rodada
  const startNewRound = () => {
    if (currentRound > totalRounds) {
      finishExercise();
      return;
    }

    const newNote = getRandomNote();
    setTargetNote(newNote);
    setShowingNote(true);
    setWaitingForInput(false);
    setFeedback(`Rodada ${String(currentRound || 0)}/${String(totalRounds || 0)} - Memorize a partitura!`);

    // Toca o som da nota sorteada
    if (playNote && typeof playNote === 'function') {
      playNote(newNote, selectedInstrument || 'Piano1');
    }

    // Mostrar nota por 1 segundo
    setTimeout(() => {
      setShowingNote(false);
      setWaitingForInput(true);
      setFeedback('Qual nota estava na partitura?');
    }, noteDisplayTime);
  };

  // Processar resposta do usuário
  const handleKeyPress = (pressedNote) => {
    if (!waitingForInput || finished) return;

    console.log('Tecla pressionada:', pressedNote, 'Nota alvo:', targetNote);

    if (pressedNote === targetNote) {
      // Resposta correta
      const points = 5 + sequenciaAcertos;
      setPontuacao(prevScore => prevScore + points);
      setSequenciaAcertos(prevStreak => prevStreak + 1);
      setAcertos(prevAcertos => prevAcertos + 1);
      setLastResult('correct');
      setFeedback(`✅ Correto! +${String(points || 0)} pontos`);
      console.log('Resposta correta! Pontos:', points, 'Sequência:', sequenciaAcertos + 1);
    } else {
      // Resposta incorreta
      setPontuacao(prevScore => Math.max(0, prevScore - 2));
      setSequenciaAcertos(0);
      setErros(prevErros => prevErros + 1);
      setLastResult('wrong');
      setFeedback(`❌ Incorreto! A nota era ${getNoteInPortuguese(targetNote)}. -2 pontos`);
      console.log('Resposta incorreta! Pontuação:', pontuacao - 2);
    }

    setWaitingForInput(false);
    
    // Próxima rodada após 1 segundo
    setTimeout(() => {
      setLastResult(null);
      setCurrentRound(prev => prev + 1);
    }, 1000);
  };

  // Finalizar exercício
  const finishExercise = async () => {
    setFinished(true);
    setFeedback(`Exercício concluído! Pontuação final: ${pontuacao}`);
    
    // Salvar pontuação
    await saveExerciseScore('Exercicio4', pontuacao, true);
    
    // Mostrar modal de conclusão
    setShowCompletionModal(true);
  };

  // Iniciar exercício
  useEffect(() => {
    if (scaleNotes && scaleNotes.length > 0 && currentRound === 1) {
      startNewRound();
    }
  }, [scaleNotes]); // Só inicia na primeira vez

  // Gerenciar mudanças de rodada
  useEffect(() => {
    if (currentRound > 1 && currentRound <= totalRounds) {
      startNewRound();
    } else if (currentRound > totalRounds) {
      finishExercise();
    }
  }, [currentRound]);

  // Se ainda não carregou as notas
  if (!scaleNotes || scaleNotes.length === 0) {
    return (
      <View style={styles.container}>
        <HeaderMinimal title="Memória de Leitura 1s" iconType="memoria" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.pageText}>Carregando notas musicais...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderMinimal 
        title="Memória de Leitura 1s" 
        iconType="memoria" 
        onBack={() => navigation.goBack()}
        showHelpButton={true}
        onHelpPress={() => setShowHelpModal(true)}
      />
      
      <View style={{ flex: 1, paddingHorizontal: 15, paddingTop: 100 }}>
        {/* CONTADOR ROBUSTO - FUNCIONA NO CELULAR */}
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

        {/* Área de exibição da nota */}
        <View style={{
          backgroundColor: lastResult === 'correct' ? '#E8F5E8' : lastResult === 'wrong' ? '#FFEBEE' : showingNote ? '#E3F2FD' : '#F5F5F5',
          padding: 30,
          borderRadius: 12,
          marginBottom: 20,
          alignItems: 'center',
          minHeight: 120,
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: lastResult === 'correct' ? '#4CAF50' : lastResult === 'wrong' ? '#F44336' : showingNote ? '#2196F3' : '#E0E0E0'
        }}>
          {showingNote ? (
            <Image 
              source={getNoteImagePath(targetNote) || require('../../../assets/reading/Reading.png')}
              style={{
                width: 150,
                height: 100,
                resizeMode: 'contain'
              }}
            />
          ) : lastResult === 'correct' ? (
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#4CAF50',
              textAlign: 'center'
            }}>
              ✅ Correto!
            </Text>
          ) : lastResult === 'wrong' ? (
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#F44336',
              textAlign: 'center'
            }}>
              ❌ Incorreto!
            </Text>
          ) : waitingForInput ? (
            <Text style={{
              fontSize: 12,
              color: '#666',
              textAlign: 'center'
            }}>
              Qual nota estava na partitura?
            </Text>
          ) : (
            <Text style={{
              fontSize: 11,
              color: '#999',
              textAlign: 'center'
            }}>
              Prepare-se...
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
                Pontuação Final: {String(pontuacao || 0)}/180
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
                {pontuacao >= 140 ? '🏆 Excelente!' : 
                 pontuacao >= 90 ? '👍 Bom trabalho!' : 
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
                Memória de Leitura 1s{'\n\n'}
                Partituras aleatórias irão aparecer na tela por 1 segundo. Você deverá identificar a nota mostrada na partitura e pressionar a tecla correspondente no menor tempo possível.{'\n\n'}
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

export default Exercicio4;
