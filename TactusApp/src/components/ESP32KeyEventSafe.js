import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { ScaleContext } from '../context/ScaleContext';

// Importar react-native-keyevent de forma segura
let KeyEvent = null;
try {
  KeyEvent = require('react-native-keyevent');
} catch (e) {
  console.log('react-native-keyevent não disponível:', e.message);
}

const ESP32KeyEventSafe = ({ compact = false }) => {
  const [logs, setLogs] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [keyEventAvailable, setKeyEventAvailable] = useState(false);
  const { startSustainedNote, stopSustainedNote } = useContext(ScaleContext);
  
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = `[${timestamp}] ${message}`;
    console.log('🎹 ESP32Safe:', newLog);
    setLogs(prev => [...prev.slice(-10), newLog]);
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('Logs limpos');
  };

  useEffect(() => {
    if (!KeyEvent || Platform.OS !== 'android') {
      addLog('KeyEvent não disponível ou não é Android');
      setIsActive(false);
      setKeyEventAvailable(false);
      return;
    }

    addLog('Iniciando ESP32 KeyEvent listener...');
    setIsActive(true);
    setKeyEventAvailable(true);

    // Configurar listeners do react-native-keyevent
    const keyDownListener = KeyEvent.onKeyDownListener((keyEvent) => {
      addLog(`⬇️ Tecla DOWN: código ${keyEvent.keyCode} action ${keyEvent.action}`);
      handleKeyEvent(keyEvent, true);
    });

    const keyUpListener = KeyEvent.onKeyUpListener((keyEvent) => {
      addLog(`⬆️ Tecla UP: código ${keyEvent.keyCode} action ${keyEvent.action}`);
      handleKeyEvent(keyEvent, false);
    });

    // Cleanup
    return () => {
      addLog('Parando ESP32 KeyEvent listener...');
      setIsActive(false);
      try {
        if (KeyEvent.removeKeyDownListener) {
          KeyEvent.removeKeyDownListener();
        }
        if (KeyEvent.removeKeyUpListener) {
          KeyEvent.removeKeyUpListener();
        }
      } catch (e) {
        addLog('Erro ao remover listeners: ' + e.message);
      }
    };
  }, []);

  const handleKeyEvent = (keyEvent, isPressed) => {
    // Mapear códigos de tecla para QWERTYUIOP
    const keyCodeMap = {
      45: 'q', // KEYCODE_Q
      51: 'w', // KEYCODE_W
      33: 'e', // KEYCODE_E
      46: 'r', // KEYCODE_R
      48: 't', // KEYCODE_T
      53: 'y', // KEYCODE_Y
      49: 'u', // KEYCODE_U
      37: 'i', // KEYCODE_I
      43: 'o', // KEYCODE_O
      44: 'p'  // KEYCODE_P
    };

    const key = keyCodeMap[keyEvent.keyCode];
    if (key) {
      const action = isPressed ? 'pressionada' : 'solta';
      addLog(`🎹 ESP32 - Tecla ${action}: ${key.toUpperCase()}`);
      
      if (isPressed) {
        startSustainedNote(key);
      } else {
        stopSustainedNote(key);
      }
    } else {
      addLog(`❓ Código desconhecido: ${keyEvent.keyCode}`);
    }
  };

  const clearAllNotes = () => {
    // Parar todas as notas que possam estar presas
    const keyMap = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
    keyMap.forEach(key => {
      stopSustainedNote(key);
    });
    addLog('🔄 Todas as notas paradas');
  };

  // Função para simular tecla (para teste)
  const simulateKey = (key) => {
    addLog(`🎹 Simulando tecla: ${key.toUpperCase()}`);
    startSustainedNote(key);
    setTimeout(() => {
      stopSustainedNote(key);
      addLog(`🎶 Parando tecla: ${key.toUpperCase()}`);
    }, 500);
  };

  return (
    <View style={{ 
      padding: compact ? 8 : 16, 
      backgroundColor: compact ? 'rgba(248, 249, 250, 0.9)' : '#F8F9FA', 
      borderRadius: 8, 
      margin: compact ? 4 : 16,
      ...(compact && { maxHeight: 120, overflow: 'hidden' })
    }}>
      <Text style={{ 
        fontSize: compact ? 12 : 16, 
        fontWeight: 'bold', 
        marginBottom: compact ? 5 : 10 
      }}>
        ⌨️ {compact ? 'ESP32 (Seguro)' : 'ESP32 Bluetooth - Modo Seguro'}
      </Text>

      {/* Status */}
      {!compact && (
        <View style={{ marginBottom: 15, padding: 10, backgroundColor: '#FFF', borderRadius: 5 }}>
          <Text style={{ marginBottom: 5, color: '#666', fontSize: 14 }}>
            Status: {isActive ? '✅ Ativo (ouvindo teclas)' : '❌ Inativo'}
          </Text>
          <Text style={{ color: '#666', fontSize: 12 }}>
            Plataforma: {Platform.OS} | KeyEvent: {keyEventAvailable ? '✅ Disponível' : '❌ Indisponível'}
          </Text>
        </View>
      )}

      {compact && (
        <Text style={{ marginBottom: 8, color: '#666', fontSize: 10 }}>
          {isActive ? '✅ Ativo' : '❌ Inativo'} | KeyEvent: {keyEventAvailable ? 'OK' : 'N/A'}
        </Text>
      )}

      {/* Botões de teste - apenas no modo completo */}
      {!compact && (
        <Text style={{ marginBottom: 8, color: '#666', fontSize: 10 }}>
          {isActive ? '✅ Ativo (Seguro)' : '❌ Inativo'} | No crash
        </Text>
      )}

      {/* Botões de controle */}
      <View style={{ 
        flexDirection: 'row', 
        marginBottom: compact ? 5 : 15 
      }}>
        {!compact && (
          <TouchableOpacity
            style={{
              backgroundColor: '#28A745',
              padding: 6,
              borderRadius: 5,
              flex: 1,
              marginRight: 5
            }}
            onPress={() => simulateKey('q')}
          >
            <Text style={{ 
              color: 'white', 
              textAlign: 'center', 
              fontWeight: 'bold', 
              fontSize: 10 
            }}>
              🎵 Teste Q
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={{
            backgroundColor: '#FF6B6B',
            padding: compact ? 6 : 10,
            borderRadius: 5,
            flex: 1,
            marginLeft: compact ? 0 : 5
          }}
          onPress={clearAllNotes}
        >
          <Text style={{ 
            color: 'white', 
            textAlign: 'center', 
            fontWeight: 'bold', 
            fontSize: compact ? 10 : 12 
          }}>
            🎹 {compact ? 'Parar' : 'Parar Todas'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logs - apenas no modo completo */}
      {!compact && (
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>
              📋 Logs:
            </Text>
            <TouchableOpacity
              style={{ backgroundColor: '#6C757D', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}
              onPress={clearLogs}
            >
              <Text style={{ color: 'white', fontSize: 10 }}>Limpar</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={{ 
              backgroundColor: '#000', 
              borderRadius: 5, 
              padding: 8, 
              maxHeight: 100 
            }}
          >
            {logs.length === 0 ? (
              <Text style={{ color: '#888', fontStyle: 'italic', fontSize: 11 }}>
                Aguardando implementação KeyEvent...
              </Text>
            ) : (
              logs.map((log, index) => (
                <Text key={index} style={{ color: '#00FF00', fontSize: 10, marginBottom: 2 }}>
                  {log}
                </Text>
              ))
            )}
          </ScrollView>
        </View>
      )}

      <Text style={{ 
        fontSize: compact ? 8 : 10, 
        color: '#666', 
        marginTop: compact ? 5 : 10, 
        textAlign: 'center', 
        fontStyle: 'italic' 
      }}>
        {compact ? 'Modo seguro ativo' : 'Versão segura - sem crash (KeyEvent em desenvolvimento)'}
      </Text>
    </View>
  );
};

export default ESP32KeyEventSafe;