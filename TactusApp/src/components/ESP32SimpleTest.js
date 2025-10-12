import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ScaleContext } from '../context/ScaleContext';

const ESP32SimpleTest = ({ compact = false }) => {
  const [status, setStatus] = useState('Testando...');
  const { startSustainedNote, stopSustainedNote } = useContext(ScaleContext);

  const testNote = () => {
    setStatus('Testando nota C...');
    startSustainedNote('q');
    setTimeout(() => {
      stopSustainedNote('q');
      setStatus('Teste concluído');
    }, 500);
  };

  return (
    <View style={{ 
      padding: compact ? 8 : 16, 
      backgroundColor: compact ? 'rgba(248, 249, 250, 0.9)' : '#F8F9FA', 
      borderRadius: 8, 
      margin: compact ? 4 : 16
    }}>
      <Text style={{ 
        fontSize: compact ? 12 : 16, 
        fontWeight: 'bold', 
        marginBottom: compact ? 5 : 10 
      }}>
        🧪 {compact ? 'ESP32 Test' : 'ESP32 Teste Simples'}
      </Text>

      <Text style={{ marginBottom: 10, color: '#666', fontSize: 12 }}>
        Status: {status}
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: '#007AFF',
          padding: 10,
          borderRadius: 5,
          marginBottom: 10
        }}
        onPress={testNote}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          🎹 Testar Nota
        </Text>
      </TouchableOpacity>

      <Text style={{ 
        fontSize: 10, 
        color: '#666', 
        textAlign: 'center', 
        fontStyle: 'italic' 
      }}>
        Componente de teste - sem KeyEvent
      </Text>
    </View>
  );
};

export default ESP32SimpleTest;