
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderMinimal from './HeaderMinimal';
import ButtonPage from './ButtonPage';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Função para obter pontuação máxima do exercício
const getMaxScore = (exerciseRoute) => {
  // Cálculo baseado na lógica real dos exercícios:
  // Acerto: 5 pontos + sequência (1, 2, 3, etc.)
  // Fórmula correta: Σ(5 + i) para i = 1 até n = 5n + n(n+1)/2
  
  const calculateMaxScore = (numNotes) => {
    let total = 0;
    for (let i = 1; i <= numNotes; i++) {
      total += (5 + i);
    }
    return total;
  };
  
  const maxScores = {
    // Exercícios de Memória
    'Exercicio1': calculateMaxScore(10), // = 185 pontos (10 notas de memória, 2s cada)
    'Exercicio2': calculateMaxScore(15), // = 320 pontos (15 notas de memória, 1s cada)
    
    // Exercícios de Escalas (8 notas da escala x 2 repetições = 16 notas)
    'Exercicio5': calculateMaxScore(16), // = 216 pontos (escala subindo 2x)
    'Exercicio6': calculateMaxScore(16), // = 216 pontos (escala descendo 2x)
    
    // Exercícios de Acordes
    'Exercicio7': calculateMaxScore(12), // = 143 pontos (1ª+3ª+5ª+acorde x 2 = 12 notas)
    'Exercicio8': calculateMaxScore(16), // = 216 pontos (1ª+3ª+5ª+7ª+acorde x 2 = 16 notas)
    
    // Exercícios antigos (outros tópicos)
    'Exercicio3': calculateMaxScore(8), // = 76 pontos
    'Exercicio4': calculateMaxScore(16), // = 216 pontos
  };
  
  return maxScores[exerciseRoute] || 50; // Padrão para exercícios não definidos
};

// Função para salvar pontuação do exercício
export const saveExerciseScore = async (exerciseRoute, score, completed = true) => {
  try {
    const data = { completed, score };
    await AsyncStorage.setItem(`exercise_${exerciseRoute}`, JSON.stringify(data));
    console.log(`Pontuação salva para ${exerciseRoute}: ${score} pontos`);
  } catch (error) {
    console.log('Erro ao salvar pontuação:', error);
  }
};

// Função para verificar status e pontuação do exercício
const getExerciseStatus = async (exerciseRoute) => {
  try {
    // Tenta carregar dados salvos do exercício
    const savedData = await AsyncStorage.getItem(`exercise_${exerciseRoute}`);
    const data = savedData ? JSON.parse(savedData) : { completed: false, score: 0 };
    const maxScore = getMaxScore(exerciseRoute);
    
    return {
      completed: data.completed,
      score: data.score,
      maxScore: maxScore,
      isPerfect: data.completed && data.score === maxScore
    };
  } catch (error) {
    console.log('Erro ao carregar dados do exercício:', error);
    const maxScore = getMaxScore(exerciseRoute);
    return {
      completed: false,
      score: 0,
      maxScore: maxScore,
      isPerfect: false
    };
  }
};

// Função para obter cor do indicador de conclusão
const getCompletionColor = (status) => {
  if (!status.completed) return '#FF4444'; // Vermelho - não feito
  if (!status.isPerfect) return '#FFB444'; // Amarelo - não máxima
  return '#44FF44'; // Verde - pontuação máxima
};

const exerciseTopics = [
  {
    id: 'memoria',
    title: 'Memória',
    color: '#7C85EA',
    icon: require('../../assets/icons/exercicios/MemoriaIcon.png'),
    exercises: [
      { label: 'Memória Visual 2s', route: 'Exercicio1' },
      { label: 'Memória Visual 1s', route: 'Exercicio2' },
    ]
  },
  {
    id: 'leitura',
    title: 'Leitura',
    color: '#EA7CE3',
    icon: require('../../assets/icons/exercicios/LeituraIcon.png'),
    exercises: [
      { label: 'Exercício de Leitura 1', route: 'Exercicio6' },
      { label: 'Exercício de Leitura 2', route: 'Exercicio7' },
    ]
  },
  {
    id: 'escalas',
    title: 'Escalas',
    color: '#EAE17C',
    icon: require('../../assets/icons/exercicios/EscalasIcon.png'),
    exercises: [
      { label: 'Subida', route: 'Exercicio5' },
      { label: 'Descida', route: 'Exercicio6' },
    ]
  },
  {
    id: 'acordes',
    title: 'Acordes',
    color: '#7CEABA',
    icon: require('../../assets/icons/exercicios/IntervalosIcon.png'), // Reutilizando o ícone
    exercises: [
      { label: 'Tônica', route: 'Exercicio7' },
      { label: 'Com 7ª', route: 'Exercicio8' },
    ]
  }
];

const ExerciciosPage = () => {
  const navigation = useNavigation();
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [exerciseStatuses, setExerciseStatuses] = useState({});

  // Carregar dados dos exercícios quando a página for aberta
  useEffect(() => {
    const loadExerciseData = async () => {
      const statuses = {};
      const exercises = ['Exercicio1', 'Exercicio2', 'Exercicio3', 'Exercicio4', 'Exercicio5', 'Exercicio6', 'Exercicio7', 'Exercicio8'];
      
      for (const exercise of exercises) {
        statuses[exercise] = await getExerciseStatus(exercise);
      }
      
      setExerciseStatuses(statuses);
    };

    loadExerciseData();
    
    // Adicionar listener para recarregar quando voltar para a página
    const unsubscribe = navigation.addListener('focus', () => {
      loadExerciseData();
    });

    return unsubscribe;
  }, [navigation]);

  const toggleTopic = (topicId) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  const renderTopic = (topic) => {
    const isExpanded = expandedTopic === topic.id;
    
    return (
      <View key={topic.id} style={{ marginBottom: 15, width: '100%' }}>
        {/* Cabeçalho do tópico */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 10,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            backgroundColor: '#D9D9D9', // Cor de fundo base
          }}
          onPress={() => toggleTopic(topic.id)}
          activeOpacity={0.8}
        >
          {/* Área com degradê simulado - título e ícone */}
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 15,
            paddingLeft: 20,
            paddingRight: 10,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Textura de fundo na área cinza */}
            <ImageBackground
              source={require('../../assets/buttons/textureExercicios.png')}
              style={{
                position: 'absolute',
                left: '66%', // Começa após o degradê
                top: 0,
                bottom: 0,
                right: 0,
              }}
              resizeMode="repeat"
            >
              <View style={{
                flex: 1,
                backgroundColor: 'rgba(217, 217, 217, 0.1)', // Ainda mais transparente para máximo contraste da textura
              }} />
            </ImageBackground>

            {/* Cor base sólida para título e ícone */}
            <View style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '55%', // Área sólida para título + ícone
              backgroundColor: topic.color,
            }} />
            
            {/* Degradê bem curto e quase imperceptível */}
            <View style={{
              position: 'absolute',
              left: '55%',
              top: 0,
              bottom: 0,
              width: '8%', // Muito curto
              backgroundColor: topic.color,
              opacity: 0.4,
            }} />
            <View style={{
              position: 'absolute',
              left: '60%',
              top: 0,
              bottom: 0,
              width: '5%',
              backgroundColor: topic.color,
              opacity: 0.2,
            }} />
            <View style={{
              position: 'absolute',
              left: '63%',
              top: 0,
              bottom: 0,
              width: '3%',
              backgroundColor: topic.color,
              opacity: 0.1,
            }} />
            
            {/* Conteúdo sobre o degradê */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              zIndex: 1,
            }}>
              <Text style={{
                color: 'black',
                fontSize: 18,
                fontWeight: 'bold',
                marginRight: 12
              }}>
                {topic.title}
              </Text>
              <Image 
                source={topic.icon}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: 'black'
                }}
                resizeMode="contain"
              />
            </View>
          </View>
          
          {/* Quadrado cinza para a seta */}
          <View style={{
            backgroundColor: '#BEBEBE',
            paddingVertical: 15,
            paddingHorizontal: 15,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
          }}>
            <Icon 
              name={isExpanded ? 'chevron-up' : 'chevron-down'} 
              size={16} 
              color="black" 
            />
          </View>
        </TouchableOpacity>

        {/* Dropdown com exercícios */}
        {isExpanded && (
          <View style={{
            backgroundColor: '#f8f9fa',
            borderRadius: 10,
            marginTop: 5,
            paddingVertical: 10,
            paddingHorizontal: 15,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 2,
            elevation: 2,
          }}>
            {topic.exercises.map((exercise, index) => {
              const status = exerciseStatuses[exercise.route] || { completed: false, score: 0, maxScore: 50, isPerfect: false };
              const completionColor = getCompletionColor(status);
              
              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 8,
                    marginBottom: index < topic.exercises.length - 1 ? 8 : 0,
                    borderLeftWidth: 4,
                    borderLeftColor: topic.color,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 1,
                    elevation: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    overflow: 'visible',
                    position: 'relative',
                  }}
                  onPress={() => navigation.navigate(exercise.route)}
                  activeOpacity={0.7}
                >
                  {/* Container para título e quadrado */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                    {/* Área do título com fundo cinza */}
                    <View style={{
                      backgroundColor: '#E0E0E0',
                      paddingHorizontal: 15,
                      paddingVertical: 12,
                      marginLeft: -4, // Compensa a borda esquerda
                      marginVertical: -12, // Compensa o padding vertical do container
                    }}>
                      <Text style={{
                        fontSize: 16,
                        color: '#333',
                        fontWeight: '500',
                      }}>
                        {exercise.label}
                      </Text>
                    </View>

                    {/* Indicador visual (quadrado) - posicionado após a área cinza */}
                    <View style={{
                      width: 12,
                      height: 12,
                      backgroundColor: completionColor,
                      marginLeft: -6, // Metade dentro da área cinza
                      zIndex: 2,
                    }} />
                  </View>

                  {/* Status - próximo ao quadrado */}
                  <Text style={{
                    fontSize: 12,
                    color: status.completed ? '#4CAF50' : '#757575',
                    fontWeight: '500',
                    marginLeft: 8,
                  }}>
                    {status.completed ? 'Concluído' : 'Pendente'}
                  </Text>

                  {/* Espaço flexível */}
                  <View style={{ flex: 1 }} />
                  
                  {/* Pontuação total */}
                  <Text style={{
                    fontSize: 14,
                    color: '#666',
                    fontWeight: 'bold',
                    marginRight: 15,
                  }}>
                    {status.score}/{status.maxScore}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.pageContainer}>
      <HeaderMinimal title="Exercícios" iconType="exercicios" onBack={() => navigation.goBack()} />
      <View style={{ 
        flex: 1, 
        paddingHorizontal: 20, 
        paddingTop: 20 
      }}>
        <Text style={[styles.pageText, { 
          marginBottom: 25, 
          textAlign: 'center',
          fontSize: 16,
          color: '#666'
        }]}>
          Selecione um tópico para ver os exercícios disponíveis:
        </Text>
        
        {exerciseTopics.map(renderTopic)}
      </View>
    </View>
  );
};

export default ExerciciosPage;