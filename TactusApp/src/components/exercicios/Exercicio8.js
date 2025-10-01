// Exercício 8 - Acordes: Com 7ª
// Ensina formação de acorde com 7ª: 1ª (tônica) → 3ª → 5ª → 7ª → acorde completo (1ª+3ª+5ª+7ª)
import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import HeaderMinimal from '../HeaderMinimal';
import ButtonPage from '../ButtonPage';
import ExercObject from '../ExercObject';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import { ScaleContext } from '../../context/ScaleContext';

const Exercicio8 = () => {
  const navigation = useNavigation();
  const { scaleNotes, selectedScale } = useContext(ScaleContext);
  
  // Estado principal: fila de notas a serem tocadas
  const [queue, setQueue] = useState([]);
  const [chordInfo, setChordInfo] = useState({ tonic: '', third: '', fifth: '', seventh: '', chordName: '' });
  
  useEffect(() => {
    // Verificar se scaleNotes está disponível
    if (scaleNotes && scaleNotes.length >= 7) {
      // Extrair graus da escala
      const tonic = scaleNotes[0];   // 1º grau (tônica)
      const third = scaleNotes[2];   // 3º grau (terça)
      const fifth = scaleNotes[4];   // 5º grau (quinta)
      const seventh = scaleNotes[6]; // 7º grau (sétima)
      
      // Determinar tipo de acorde baseado na escala
      const isMinor = selectedScale && selectedScale.includes('Menor');
      const chordName = isMinor ? `${tonic.replace(/\d+/, '')} menor com 7ª` : `${tonic.replace(/\d+/, '')} maior com 7ª`;
      
      // Sequência do exercício: 1ª → 3ª → 5ª → 7ª → acorde completo com 7ª (2x)
      const exerciseSequence = [
        tonic,              // 1º grau
        third,              // 3º grau  
        fifth,              // 5º grau
        seventh,            // 7º grau
        tonic, third, fifth, seventh, // Acorde completo com 7ª (simultâneo)
        // Segunda repetição
        tonic,              // 1º grau
        third,              // 3º grau
        fifth,              // 5º grau
        seventh,            // 7º grau
        tonic, third, fifth, seventh  // Acorde completo com 7ª novamente
      ];
      
      setQueue(exerciseSequence);
      setChordInfo({ tonic, third, fifth, seventh, chordName });
      
      console.log(`Exercício 8 - Escala: ${selectedScale}`);
      console.log(`Acorde: ${chordName} (${tonic} + ${third} + ${fifth} + ${seventh})`);
      console.log('Sequência:', exerciseSequence);
    }
  }, [scaleNotes, selectedScale]);

  return (
    <View style={styles.container}>
      <HeaderMinimal title="Com 7ª" showBackButton={true} />
      
      <View style={styles.content}>
        <View style={styles.contentTop}>
          <Text style={styles.pageText}>
            Aprenda o acorde {chordInfo.chordName}
          </Text>
          <Text style={[styles.pageText, { fontSize: 14, color: '#666', marginTop: 10 }]}>
            Toque: 1ª → 3ª → 5ª → 7ª → acorde completo
          </Text>
          
          {chordInfo.tonic && (
            <View style={{ marginTop: 15, padding: 15, backgroundColor: '#F0FFF0', borderRadius: 10 }}>
              <Text style={[styles.pageText, { fontSize: 16, fontWeight: 'bold', color: '#2E7D32' }]}>
                {chordInfo.chordName}
              </Text>
              <Text style={[styles.pageText, { fontSize: 14, color: '#666' }]}>
                1ª: {chordInfo.tonic} | 3ª: {chordInfo.third}
              </Text>
              <Text style={[styles.pageText, { fontSize: 14, color: '#666' }]}>
                5ª: {chordInfo.fifth} | 7ª: {chordInfo.seventh}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.contentBottom}>
          {queue.length > 0 ? (
            <View style={styles.exerciseContainer}>
              <ExercObject notes={queue} exerciseName="Exercicio8" />
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

export default Exercicio8;