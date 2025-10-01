// Exercício 5 - Escalas: Subida
// Apresenta as notas da escala na ordem crescente para o usuário tocar subindo 2 vezes
import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import HeaderMinimal from '../HeaderMinimal';
import ButtonPage from '../ButtonPage';
import ExercObject from '../ExercObject';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import { ScaleContext } from '../../context/ScaleContext';

// Função para montar os valores dos dedos (dedos 5 e 10 = polegares, ficam vazios)
function getFingersNotes(scaleNotes) {
  // Usa só os 8 graus: 1 a 7 + oitava acima
  const fingers = Array(10).fill('');
  for (let i = 0; i < 8; i++) {
    // dedos: 0,1,2,3,5,6,7,8 (índices JS)
    const fingerIndex = i < 4 ? i : i + 1;
    fingers[fingerIndex] = scaleNotes[i];
  }
  return fingers;
}

const Exercicio5 = () => {
  const navigation = useNavigation();
  const { scaleNotes, setActiveFingersNotes } = useContext(ScaleContext);
  
  // Estado principal: fila de notas a serem tocadas
  const [queue, setQueue] = useState([]);
  
  useEffect(() => {
    // Verificar se scaleNotes está disponível
    if (scaleNotes && scaleNotes.length > 0) {
      // Duplicar para que suba 2 vezes seguidas
      const exerciseNotes = [...scaleNotes, ...scaleNotes];
      
      setQueue(exerciseNotes);
      
      // Configurar os dedos no contexto para esta escala
      const fingersData = getFingersNotes(scaleNotes);
      setActiveFingersNotes && setActiveFingersNotes(fingersData);
    }
  }, [scaleNotes, setActiveFingersNotes]);

  return (
    <View style={styles.container}>
      <HeaderMinimal title="Subida" showBackButton={true} />
      
      <View style={styles.content}>
        <View style={styles.contentTop}>
          <Text style={styles.pageText}>
            Toque a escala subindo {"\n"}duas vezes seguidas
          </Text>
          <Text style={[styles.pageText, { fontSize: 14, color: '#666', marginTop: 10 }]}>
            Use as teclas do piano para tocar cada nota na sequência correta
          </Text>
        </View>
        
        <View style={styles.contentBottom}>
          {queue.length > 0 ? (
            <View style={styles.exerciseContainer}>
              <ExercObject notes={queue} exerciseName="Exercicio5" />
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.pageText}>Carregando exercício...</Text>
            </View>
          )}
        </View>
      </View>
      
      <ButtonPage 
        title="Voltar" 
        onPress={() => navigation.goBack()} 
        style={styles.backButton}
      />
    </View>
  );
};

export default Exercicio5;