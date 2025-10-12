import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ScaleContext } from '../context/ScaleContext';
import styles from './styles';

const ESP32Simulator = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [pressedKeys, setPressedKeys] = useState(new Set());
  
  const { startSustainedNote, stopSustainedNote } = useContext(ScaleContext);

  const qwertyKeys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];

  const simulateKeyPress = (key) => {
    if (pressedKeys.has(key)) {
      // Soltar tecla
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
      
      if (stopSustainedNote) {
        const stoppedNote = stopSustainedNote(key);
        console.log(`🎮 Simulador parou: ${key} → ${stoppedNote}`);
      }
    } else {
      // Pressionar tecla
      setPressedKeys(prev => new Set(prev).add(key));
      
      if (startSustainedNote) {
        const playedNote = startSustainedNote(key);
        console.log(`🎮 Simulador tocou: ${key} → ${playedNote}`);
      }
    }
  };

  const clearAllKeys = () => {
    pressedKeys.forEach(key => {
      if (stopSustainedNote) {
        stopSustainedNote(key);
      }
    });
    setPressedKeys(new Set());
  };

  return (
    <View style={{ padding: 16, backgroundColor: '#F0F8FF', borderRadius: 8, margin: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
        🎮 ESP32 Simulator (Desenvolvimento)
      </Text>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <TouchableOpacity
          style={[styles.button, { 
            backgroundColor: isSimulating ? '#DC3545' : '#28A745',
            flex: 1,
            marginRight: 10
          }]}
          onPress={() => {
            setIsSimulating(!isSimulating);
            if (isSimulating) clearAllKeys();
          }}
        >
          <Text style={styles.buttonText}>
            {isSimulating ? 'Parar Simulação' : 'Iniciar Simulação'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FFC107' }]}
          onPress={clearAllKeys}
        >
          <Text style={[styles.buttonText, { color: '#000' }]}>Limpar</Text>
        </TouchableOpacity>
      </View>

      {isSimulating && (
        <View>
          <Text style={{ marginBottom: 10, color: '#666' }}>
            Toque nos botões para simular as luvas ESP32:
          </Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
            {qwertyKeys.map((key, index) => (
              <TouchableOpacity
                key={key}
                style={{
                  backgroundColor: pressedKeys.has(key) ? '#FF6B35' : '#007AFF',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  minWidth: 50,
                  alignItems: 'center',
                  marginBottom: 5
                }}
                onPress={() => simulateKeyPress(key)}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  {key}
                </Text>
                <Text style={{ color: 'white', fontSize: 10 }}>
                  Dedo {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={{ fontSize: 12, color: '#666', marginTop: 10, textAlign: 'center' }}>
            Laranja = Pressionado | Azul = Liberado
          </Text>
        </View>
      )}
      
      <Text style={{ fontSize: 12, color: '#666', marginTop: 10, textAlign: 'center' }}>
        Para desenvolvimento e testes sem hardware ESP32
      </Text>
    </View>
  );
};

export default ESP32Simulator;