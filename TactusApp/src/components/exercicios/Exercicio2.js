import React, { useState } from 'react';
import { View, Text } from 'react-native';
import TopBar from '../TopBar';
import ButtonPage from '../ButtonPage';
import ExercObject from '../ExercObject';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';

// Escalas menores de C5 a B5 (menor natural)
const minorScales = {
  'C': ['C5', 'D5', 'D#5', 'F5', 'G5', 'G#5', 'A#5', 'C6'],
  'D': ['D5', 'E5', 'F5', 'G5', 'A5', 'A#5', 'C6', 'D6'],
  'E': ['E5', 'F#5', 'G5', 'A5', 'B5', 'C6', 'D6', 'E6'],
  'F': ['F5', 'G5', 'G#5', 'A#5', 'C6', 'C#6', 'D#6', 'F6'],
  'G': ['G5', 'A5', 'A#5', 'C6', 'D6', 'D#6', 'F6', 'G6'],
  'A': ['A5', 'B5', 'C6', 'D6', 'E6', 'F6', 'G6', 'A6'],
  'B': ['B5', 'C#6', 'D6', 'E6', 'F#6', 'G6', 'A6', 'B6'],
};

const scaleOptions = Object.keys(minorScales);

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

const Exercicio2 = () => {
  const navigation = useNavigation();
  const [selectedScale, setSelectedScale] = useState(null);

  // Variáveis para cada dedo
  let dedo1 = '', dedo2 = '', dedo3 = '', dedo4 = '', dedo5 = '', dedo6 = '', dedo7 = '', dedo8 = '', dedo9 = '', dedo10 = '';
  let fingers = [];

  if (selectedScale) {
    fingers = getFingersNotes(minorScales[selectedScale]);
    [dedo1, dedo2, dedo3, dedo4, dedo5, dedo6, dedo7, dedo8, dedo9, dedo10] = fingers;
  }

  return (
    <View style={styles.pageContainer}>
      <TopBar title="Escalas Menores" onBack={() => navigation.goBack()} />
      <View style={styles.pageContent}>
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.pageText}>
            As Escalas Menores Naturais são compostas por sete notas com uma estrutura específica de tons e semitons: Tom – Semitom – Tom – Tom – Semitom – Tom – Tom (T-sT-T-T-sT-T-T)
          </Text>
        </View>
        {!selectedScale ? (
          <>
            <Text style={styles.pageText}>Escolha uma escala menor:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 }}>
              {scaleOptions.map(scale => (
                <ButtonPage
                  key={scale}
                  label={`Escala de ${scale} menor`}
                  onPress={() => setSelectedScale(scale)}
                />
              ))}
            </View>
          </>
        ) : (
          <>
            <ButtonPage
              label="Voltar"
              onPress={() => setSelectedScale(null)}
              style={{ backgroundColor: '#007AFF', marginBottom: 16 }}
            />
            <Text style={styles.pageText}>Notas da escala de {selectedScale} menor:</Text>
            <ExercObject notes={minorScales[selectedScale]} />
            <View style={{ marginTop: 16 }}>
              <Text style={styles.pageText}>Notas atribuídas aos dedos da luva:</Text>
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
          </>
        )}
      </View>
    </View>
  );
};

export default Exercicio2;