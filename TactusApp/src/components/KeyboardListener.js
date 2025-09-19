import React, { useContext, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { ScaleContext } from '../context/ScaleContext';

// Componente exemplo que demonstra como usar o sistema de escalas e teclas
const KeyboardListener = () => {
  const { selectedScale, scaleNotes, getNoteFromKey, keyMapping } = useContext(ScaleContext);

  // Função para simular o pressionamento de tecla
  const handleKeyPress = (key) => {
    const note = getNoteFromKey(key);
    if (note) {
      Alert.alert('Tecla Pressionada', `Tecla ${key} = Nota ${note}`);
      console.log(`Tecla ${key} pressionada = Nota ${note}`);
    } else {
      Alert.alert('Tecla Inválida', `Tecla ${key} não está mapeada`);
    }
  };

  // Log das informações quando a escala muda
  useEffect(() => {
    console.log('=== INFORMAÇÕES DA ESCALA ===');
    console.log('Escala selecionada:', selectedScale);
    console.log('Notas da escala:', scaleNotes);
    console.log('Mapeamento de teclas:', keyMapping);
    console.log('==========================');
  }, [selectedScale, scaleNotes, keyMapping]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Sistema de Escalas - Exemplo
      </Text>
      <Text style={{ marginBottom: 5 }}>
        Escala atual: {selectedScale}
      </Text>
      <Text style={{ marginBottom: 5 }}>
        Notas: {scaleNotes.join(', ')}
      </Text>
      <Text style={{ marginBottom: 15 }}>
        Mapeamento de Teclas:
      </Text>
      {Object.entries(keyMapping).map(([key, note]) => (
        <Text key={key} style={{ marginBottom: 5 }}>
          {key} → {note}
        </Text>
      ))}
    </View>
  );
};

export default KeyboardListener;