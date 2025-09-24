import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import TopBar from '../TopBar';
import ButtonPage from '../ButtonPage';
import ExercObject from '../ExercObject';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import { ScaleContext } from '../../context/ScaleContext';

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

// Função para mapear as teclas QWER YUIO para as notas da escala selecionada
function mapKeysToNotes(scaleNotes) {
  const keyMapping = {
    Q: scaleNotes[0],
    W: scaleNotes[1],
    E: scaleNotes[2],
    R: scaleNotes[3],
    Y: scaleNotes[4],
    U: scaleNotes[5],
    I: scaleNotes[6],
    O: scaleNotes[7],
  };
  return keyMapping;
}

const Exercicio3 = () => {
  const navigation = useNavigation();
  const { selectedScale } = useContext(ScaleContext); // Obtém a escala globalmente
  const [notes, setNotes] = useState(defaultNotes);
  const [fingers, setFingers] = useState(Array(10).fill(''));
  const [keyMapping, setKeyMapping] = useState({}); // Mapeamento de teclas para notas

  // Ao abrir, seta as variáveis da luva para escala de C maior
  useEffect(() => {
    setFingers(getFingersCmajor());
  }, []);

  useEffect(() => {
    if (selectedScale && majorScales[selectedScale]) {
      const notes = majorScales[selectedScale];
      setKeyMapping(mapKeysToNotes(notes)); // Atualiza o mapeamento de teclas
    }
  }, [selectedScale]);

  // Variáveis para cada dedo
  const [
    dedo1, dedo2, dedo3, dedo4, dedo5,
    dedo6, dedo7, dedo8, dedo9, dedo10
  ] = fingers;

  return (
    <View style={styles.pageContainer}>
      <TopBar title="Exercício 3" onBack={() => navigation.goBack()} />
      <View style={[styles.pageContent, { justifyContent: 'flex-start' }]}>
        <Text style={styles.selectedScaleText}>
          Escala selecionada: {selectedScale || 'Nenhuma'}
        </Text>
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.pageText}>
            As teclas QWER YUIO correspondem às notas da escala selecionada:
          </Text>
          {Object.entries(keyMapping).map(([key, note]) => (
            <Text key={key} style={styles.pageText}>
              Tecla {key}: {note}
            </Text>
          ))}
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.pageText}>
            Ex 3
          </Text>
        </View>
        <View style={{ 
          flex: 1, 
          width: '100%', 
          alignItems: 'center', 
          justifyContent: 'flex-start',
          paddingTop: 20
        }}>
          <ExercObject notes={notes} />
        </View>
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