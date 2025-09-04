import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import TopBar from '../TopBar';
import ButtonPage from '../ButtonPage';
import ExercObject from '../ExercObject';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';

// Notas aleatórias para o exercício (modificável)
const defaultNotes = [
  'C5', 'E5', 'G5', 'B5', 'D6', 'F6', 'A6', 'C6'
];

// Função para atribuir notas da luva na escala de C maior
function getFingersCmajor() {
  // C maior: C5, D5, E5, F5, G5, A5, B5, C6
  const cMajor = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'];
  const fingers = Array(10).fill('');
  for (let i = 0; i < 8; i++) {
    const fingerIndex = i < 4 ? i : i + 1;
    fingers[fingerIndex] = cMajor[i];
  }
  return fingers;
}

const Exercicio3 = () => {
  const navigation = useNavigation();
  const [notes, setNotes] = useState(defaultNotes);
  const [fingers, setFingers] = useState(Array(10).fill(''));

  // Ao abrir, seta as variáveis da luva para escala de C maior
  useEffect(() => {
    setFingers(getFingersCmajor());
  }, []);

  // Variáveis para cada dedo
  const [
    dedo1, dedo2, dedo3, dedo4, dedo5,
    dedo6, dedo7, dedo8, dedo9, dedo10
  ] = fingers;

  return (
    <View style={styles.pageContainer}>
      <TopBar title="Exercício 3" onBack={() => navigation.goBack()} />
      <View style={styles.pageContent}>
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.pageText}>
            Ex 3
          </Text>
        </View>
        <ExercObject notes={notes} />
        <View style={{ marginTop: 16 }}>
          <Text style={styles.pageText}>Notas atribuídas aos dedos da luva (C maior):</Text>
          <Text>Dedo 1: {dedo1}</Text>
          <Text>Dedo 2: {dedo2}</Text>
          <Text>Dedo 3: {dedo3}</Text>
          <Text>Dedo 4: {dedo4}</Text>
          <Text>Dedo 5 (polegar): {dedo5}</Text>
          <Text>Dedo 6: {dedo6}</Text>
          <Text>Dedo 7: {dedo7}</Text>
          <Text>Dedo 8: {dedo8}</Text>
          <Text>Dedo 9: {dedo9}</Text>
          <Text>Dedo 10 (polegar): {dedo10}</Text>
        </View>
      </View>
    </View>
  );
};

export default Exercicio3;