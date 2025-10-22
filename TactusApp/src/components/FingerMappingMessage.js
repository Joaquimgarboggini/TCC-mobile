import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Ordem dos dedos: 1 (polegar) a 5 (mindinho) para cada mão
const fingerNames = ['Polegar', 'Indicador', 'Médio', 'Anelar', 'Mindinho'];
const keyOrder = ['Q','W','E','R','T','Y','U','I','O','P'];
const handLabels = ['(Esq)', '(Esq)', '(Esq)', '(Esq)', '(Esq)', '(Dir)', '(Dir)', '(Dir)', '(Dir)', '(Dir)'];

// Função para converter nota internacional para português
function noteToPortuguese(note) {
  if (!note) return '';
  const map = {
    'C': 'Dó', 'C#': 'Dó#', 'D': 'Ré', 'D#': 'Ré#', 'E': 'Mi',
    'F': 'Fá', 'F#': 'Fá#', 'G': 'Sol', 'G#': 'Sol#', 'A': 'Lá', 'A#': 'Lá#', 'B': 'Si'
  };
  const match = note.match(/^([A-G]#?)/);
  const base = match ? match[1] : note;
  return map[base] || note;
}

export default function FingerMappingMessage({ keyMapping }) {
  if (!keyMapping) return null;
  // Monta array de pares dedo-nota
  const pairs = keyOrder.map((key, idx) => {
    const note = keyMapping[key];
    if (!note) return null;
    // Dedo 1-5 = mão esquerda, 6-10 = mão direita
    const finger = fingerNames[idx % 5];
    const hand = handLabels[idx];
    return `${finger} ${hand}: ${noteToPortuguese(note)}`;
  }).filter(Boolean);

  if (pairs.length === 0) return null;

  return (
    <View style={{ flexDirection: 'column', justifyContent: 'center', marginBottom: 10, backgroundColor: '#f5f5f5', height: 70, alignItems: 'center',  width: '100%', borderRadius: 8 }}>
      <Text style={styles.title}>Notas por dedo:</Text>
      
      <Text style={styles.mapping}>{pairs.join('   |   ')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#333',
    marginBottom: 2,
  },
  mapping: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
  },
});
