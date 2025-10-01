// Exercício 7 - Acordes: Tônica
// Ensina formação de acorde básico: 1ª (tônica) → 3ª → 5ª → acorde completo (1ª+3ª+5ª)
import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import HeaderMinimal from '../HeaderMinimal';
import ButtonPage from '../ButtonPage';
import ExercObject from '../ExercObject';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import { ScaleContext } from '../../context/ScaleContext';

const Exercicio7 = () => {
  const navigation = useNavigation();
  const { scaleNotes, selectedScale } = useContext(ScaleContext);
  
  // Estado principal: fila de notas a serem tocadas
  const [queue, setQueue] = useState([]);
  const [chordInfo, setChordInfo] = useState({ tonic: '', third: '', fifth: '', chordName: '' });
  
  useEffect(() => {
    // Verificar se scaleNotes está disponível
    if (scaleNotes && scaleNotes.length >= 5) {
      // Extrair graus da escala
      const tonic = scaleNotes[0];   // 1º grau (tônica)
      const third = scaleNotes[2];   // 3º grau (terça)
      const fifth = scaleNotes[4];   // 5º grau (quinta)
      
      // Determinar tipo de acorde baseado na escala
      const isMinor = selectedScale && selectedScale.includes('Menor');
      const chordName = isMinor ? `${tonic.replace(/\d+/, '')} menor` : `${tonic.replace(/\d+/, '')} maior`;
      
      // Sequência do exercício: 1ª → 3ª → 5ª → acorde completo (2x)
      const exerciseSequence = [
        tonic,          // 1º grau
        third,          // 3º grau  
        fifth,          // 5º grau
        tonic, third, fifth, // Acorde completo (simultâneo será tratado pelo ExercObject)
        // Segunda repetição
        tonic,          // 1º grau
        third,          // 3º grau
        fifth,          // 5º grau
        tonic, third, fifth  // Acorde completo novamente
      ];
      
      setQueue(exerciseSequence);
      setChordInfo({ tonic, third, fifth, chordName });
      
      console.log(`Exercício 7 - Escala: ${selectedScale}`);
      console.log(`Acorde: ${chordName} (${tonic} + ${third} + ${fifth})`);
      console.log('Sequência:', exerciseSequence);
    }
  }, [scaleNotes, selectedScale]);

  return (
    <View style={styles.container}>
      <HeaderMinimal title="Tônica" showBackButton={true} />
      
      <View style={styles.content}>
        <View style={styles.contentTop}>
          <Text style={styles.pageText}>
            Aprenda o acorde {chordInfo.chordName}
          </Text>
          <Text style={[styles.pageText, { fontSize: 14, color: '#666', marginTop: 10 }]}>
            Toque: 1ª → 3ª → 5ª → acorde completo
          </Text>
          
          {chordInfo.tonic && (
            <View style={{ marginTop: 15, padding: 15, backgroundColor: '#F0F8FF', borderRadius: 10 }}>
              <Text style={[styles.pageText, { fontSize: 16, fontWeight: 'bold', color: '#1976D2' }]}>
                {chordInfo.chordName}
              </Text>
              <Text style={[styles.pageText, { fontSize: 14, color: '#666' }]}>
                1ª: {chordInfo.tonic} | 3ª: {chordInfo.third} | 5ª: {chordInfo.fifth}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.contentBottom}>
          {queue.length > 0 ? (
            <View style={styles.exerciseContainer}>
              <ExercObject notes={queue} exerciseName="Exercicio7" />
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

export default Exercicio7;