import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { ScaleContext } from '../context/ScaleContext';

const ESP32KeyEvent = ({ compact = false }) => {
  const [logs, setLogs] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [keyEventAvailable, setKeyEventAvailable] = useState(false);
  const { startSustainedNote, stopSustainedNote } = useContext(ScaleContext);
  
  // Importar react-native-keyevent de forma segura
  const [KeyEvent, setKeyEvent] = useState(null);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = `[${timestamp}] ${message}`;
    console.log('🎹 ESP32KeyEvent:', newLog);
    setLogs(prev => [...prev.slice(-10), newLog]);
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('Logs limpos');
  };

  useEffect(() => {
    // Tentar importar react-native-keyevent de forma segura
    const initializeKeyEvent = async () => {
      try {
        if (Platform.OS !== 'android') {
          addLog('Plataforma não é Android - KeyEvent não suportado');
          setIsActive(false);
          setKeyEventAvailable(false);
          return;
        }

        // Tentar importar o módulo
        const keyEventModule = require('react-native-keyevent');
        
        if (!keyEventModule) {
          throw new Error('Módulo não encontrado');
        }

        setKeyEvent(keyEventModule);
        setKeyEventAvailable(true);
        addLog('react-native-keyevent carregado com sucesso');
        
        // Configurar listeners apenas se o módulo foi carregado
        setupListeners(keyEventModule);
        
      } catch (error) {
        addLog(`Erro ao carregar react-native-keyevent: ${error.message}`);
        setKeyEventAvailable(false);
        setIsActive(false);
        console.warn('react-native-keyevent não está disponível:', error);
      }
    };

    initializeKeyEvent();

    return () => {
      // Cleanup será feito pela função setupListeners
    };
  }, []);

  const setupListeners = (keyEventModule) => {
    try {
      addLog('Configurando listeners do ESP32 KeyEvent...');
      setIsActive(true);

      // Configurar listeners
      if (keyEventModule.onKeyDownListener) {
        keyEventModule.onKeyDownListener((keyEvent) => {
          addLog(`⬇️ Tecla DOWN: ${keyEvent.keyCode}`);
          handleKeyEvent(keyEvent, true);
        });
      }

      if (keyEventModule.onKeyUpListener) {
        keyEventModule.onKeyUpListener((keyEvent) => {
          addLog(`⬆️ Tecla UP: ${keyEvent.keyCode}`);
          handleKeyEvent(keyEvent, false);
        });
      }

      addLog('Listeners configurados com sucesso');

    } catch (error) {
      addLog(`Erro ao configurar listeners: ${error.message}`);
      setIsActive(false);
    }
  };

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

  return (
    <View style={{ 
      padding: compact ? 8 : 16, 
      backgroundColor: compact ? 'rgba(248, 249, 250, 0.9)' : '#F8F9FA', 
      borderRadius: 8, 
      margin: compact ? 4 : 16,
      ...(compact && { maxHeight: 80, overflow: 'hidden' })
    }}>
      <Text style={{ 
        fontSize: compact ? 12 : 16, 
        fontWeight: 'bold', 
        marginBottom: compact ? 5 : 10 
      }}>
        ⌨️ {compact ? 'ESP32 KeyEvent' : 'ESP32 Bluetooth - KeyEvent'}
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

      {/* Botão de controle */}
      <View style={{ 
        flexDirection: 'row', 
        marginBottom: compact ? 5 : 15 
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#FF6B6B',
            padding: compact ? 6 : 10,
            borderRadius: 5,
            flex: 1
          }}
          onPress={clearAllNotes}
        >
          <Text style={{ 
            color: 'white', 
            textAlign: 'center', 
            fontWeight: 'bold', 
            fontSize: compact ? 10 : 12 
          }}>
            🎹 {compact ? 'Parar Notas' : 'Parar Todas as Notas'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logs - apenas no modo completo */}
      {!compact && (
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>
              📋 Logs de Teclas:
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
              maxHeight: 150 
            }}
          >
            {logs.length === 0 ? (
              <Text style={{ color: '#888', fontStyle: 'italic', fontSize: 11 }}>
                Pressione uma tecla no ESP32...
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
        {compact ? 'ESP32 via KeyEvent' : 'Detecta automaticamente teclas do ESP32 via KeyEvent'}
      </Text>
    </View>
  );
};

export default ESP32KeyEvent;