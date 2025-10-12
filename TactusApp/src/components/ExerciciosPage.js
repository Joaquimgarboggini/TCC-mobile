
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
    for (let i = 0; i < numNotes; i++) {
      total += (5 + i);
    }
    return total;
  };
  
  const maxScores = {
    // Exercícios de Memória - Fórmula: Σ(5 + i) para i = 0 até n-1
    'Exercicio1': 95,   // 10 notas: 5+6+7+8+9+10+11+12+13+14 = 95 pontos
    'Exercicio2': 185,  // 15 notas: 5+6+7+8+9+10+11+12+13+14+15+16+17+18+19 = 185 pontos
    'Exercicio3': 95,   // 10 notas: 5+6+7+8+9+10+11+12+13+14 = 95 pontos
    'Exercicio4': 185,  // 15 notas: 5+6+7+8+9+10+11+12+13+14+15+16+17+18+19 = 185 pontos
    
    // Exercícios de Leitura
    'Exercicio5': 95,   // 10 notas: 5+6+7+8+9+10+11+12+13+14 = 95 pontos
    'Exercicio6': 290,  // 20 notas: 5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20+21+22+23+24 = 290 pontos
    
    // Exercícios de Escalas - 16 notas cada
    'Exercicio7': 200,  // 16 notas: 5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20 = 200 pontos
    'Exercicio8': 200,  // 16 notas: 5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20 = 200 pontos
    'Exercicio9': 200,  // 16 notas: 5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20 = 200 pontos
    'Exercicio10': 200, // 16 notas: 5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20 = 200 pontos
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
      { label: 'Visual 1', route: 'Exercicio1' },
      { label: 'Visual 2', route: 'Exercicio2' },
      { label: 'Leitura 1', route: 'Exercicio3' },
      { label: 'Leitura 2', route: 'Exercicio4' },
    ]
  },
  {
    id: 'leitura',
    title: 'Leitura',
    color: '#EA7CE3',
    icon: require('../../assets/icons/exercicios/LeituraIcon.png'),
    exercises: [
      { label: 'Partitura 1', route: 'Exercicio5' },
      { label: 'Partitura 2', route: 'Exercicio6' },
    ]
  },
  {
    id: 'escalas',
    title: 'Escalas',
    color: '#EAE17C',
    icon: require('../../assets/icons/exercicios/EscalasIcon.png'),
    exercises: [
      { label: 'Subida 1', route: 'Exercicio7' },
      { label: 'Descida 1', route: 'Exercicio8' },
      { label: 'Subida 2', route: 'Exercicio9' },
      { label: 'Descida 2', route: 'Exercicio10' },
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
      const exercises = ['Exercicio1', 'Exercicio2', 'Exercicio3', 'Exercicio4', 'Exercicio5', 'Exercicio6', 'Exercicio7', 'Exercicio8', 'Exercicio9', 'Exercicio10'];
      
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
      <View key={String(topic.id || 'topic')} style={{ marginBottom: 15, width: '100%' }}>
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
                source={topic.icon || require('../../assets/icon.png')}
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
                  key={String(index || 0)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 8,
                    marginBottom: index < topic.exercises.length - 1 ? 8 : 0,
                    borderLeftWidth: 4,
                    borderLeftColor: topic.color,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    overflow: 'hidden',
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
                      borderTopLeftRadius: 4, // Radius que combina com o borderRadius do container
                      borderBottomLeftRadius: 4,
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
          Selecione um exercício
        </Text>
        
        {exerciseTopics.map(renderTopic)}
      </View>
    </View>
  );
};

export default ExerciciosPage;