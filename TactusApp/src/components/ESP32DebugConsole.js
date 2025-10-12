import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styles from './styles';

const ESP32DebugConsole = () => {
  const [logs, setLogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Interceptar console.log para capturar logs do ESP32
    const originalLog = console.log;
    
    console.log = (...args) => {
      // Chamar o console.log original
      originalLog.apply(console, args);
      
      // Capturar logs relacionados ao ESP32
      const message = args.join(' ');
      if (message.includes('ESP32') || message.includes('🔗') || message.includes('📡') || message.includes('🎵') || message.includes('🎶')) {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev.slice(-20), { // Manter apenas últimos 20 logs
          id: Date.now(),
          timestamp,
          message
        }]);
      }
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  const clearLogs = () => {
    setLogs([]);
  };

  if (!isVisible) {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 100,
          left: 20,
          backgroundColor: '#007AFF',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 20,
          zIndex: 1000
        }}
        onPress={() => setIsVisible(true)}
      >
        <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
          🔍 Debug ESP32
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{
      position: 'absolute',
      top: 80,
      left: 10,
      right: 10,
      bottom: 200,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderRadius: 10,
      padding: 10,
      zIndex: 1000
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
          🔍 ESP32 Debug Console
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ backgroundColor: '#FFC107', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, marginRight: 5 }}
            onPress={clearLogs}
          >
            <Text style={{ color: 'black', fontSize: 12 }}>Limpar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: '#DC3545', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 }}
            onPress={() => setIsVisible(false)}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {logs.length === 0 ? (
          <Text style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 20 }}>
            Aguardando logs do ESP32...{'\n'}
            Conecte seu ESP32 e use as luvas para ver os logs aqui.
          </Text>
        ) : (
          logs.map(log => (
            <View key={log.id} style={{ marginBottom: 5, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#333' }}>
              <Text style={{ color: '#00FF00', fontSize: 10 }}>
                [{log.timestamp}]
              </Text>
              <Text style={{ color: 'white', fontSize: 12 }}>
                {log.message}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <Text style={{ color: '#888', fontSize: 10, textAlign: 'center', marginTop: 5 }}>
        Este console mostra toda comunicação com ESP32
      </Text>
    </View>
  );
};

export default ESP32DebugConsole;