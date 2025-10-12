import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, TextInput, AppState } from 'react-native';
import { ScaleContext } from '../context/ScaleContext';

const ESP32Stable = ({ compact = false }) => {
  const [logs, setLogs] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const { startSustainedNote, stopSustainedNote } = useContext(ScaleContext);
  
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = `[${timestamp}] ${message}`;
    console.log('🎹 ESP32Stable:', newLog);
    setLogs(prev => [...prev.slice(-10), newLog]);
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('Logs limpos');
  };

  useEffect(() => {
    addLog('ESP32 Stable inicializado');
    setIsActive(true);

    // Foco automático no input - delay reduzido
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        addLog('Input focado automaticamente');
      }
    }, 500); // Delay reduzido

    return () => {
      clearTimeout(timer);
      addLog('ESP32 Stable desativado');
      setIsActive(false);
    };
  }, []);

  // Refocus automático quando o app volta ao primeiro plano
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active' && inputRef.current) {
        setTimeout(() => {
          inputRef.current.focus();
          addLog('Refocus automático (app ativo)');
        }, 500);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  const handleTextChange = (text) => {
    // Capturar mudanças no texto (teclas do ESP32)
    if (text.length > inputValue.length) {
      // Nova tecla pressionada
      const newChar = text[text.length - 1].toLowerCase();
      addLog(`📝 Texto recebido: "${newChar}"`);
      
      // Processar tecla
      const keyMap = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
      if (keyMap.includes(newChar)) {
        addLog(`🎹 Tocando nota: ${newChar.toUpperCase()}`);
        
        // ESP32 sempre faz toque simples - parar qualquer nota anterior primeiro
        stopSustainedNote(newChar);
        
        // Pequeno delay para garantir limpeza
        setTimeout(() => {
          // Iniciar nota brevemente
          startSustainedNote(newChar);
          
          // ESP32 sempre para automaticamente (não sustenta)
          setTimeout(() => {
            stopSustainedNote(newChar);
            addLog(`🎶 ESP32 auto-stop: ${newChar.toUpperCase()}`);
          }, 300); // Aumentado para 300ms para melhor visibilidade
        }, 10);
      }
    }
    
    setInputValue(text);
    
    // Limpar texto mais frequentemente
    if (text.length > 3) {
      setInputValue('');
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

  const refocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      addLog('Input refocado para receber ESP32');
    }
  };

  // Função para simular tecla (para teste)
  const simulateKey = (key) => {
    addLog(`🎹 Simulando tecla: ${key.toUpperCase()}`);
    
    // SEMPRE limpar estado anterior primeiro
    stopSustainedNote(key);
    
    // Aguardar um pouco para garantir que limpou
    setTimeout(() => {
      // Iniciar nova nota
      startSustainedNote(key);
      
      // Para automaticamente após um tempo curto
      setTimeout(() => {
        stopSustainedNote(key);
        addLog(`🎶 Parando simulação: ${key.toUpperCase()}`);
      }, 150);
    }, 10);
  };

  return (
    <View style={{ 
      padding: compact ? 8 : 16, 
      backgroundColor: compact ? 'rgba(248, 249, 250, 0.9)' : '#F8F9FA', 
      borderRadius: 8, 
      margin: compact ? 4 : 16,
      ...(compact && { maxHeight: 100, overflow: 'hidden' })
    }}>
      <Text style={{ 
        fontSize: compact ? 12 : 16, 
        fontWeight: 'bold', 
        marginBottom: compact ? 5 : 10 
      }}>
        ⌨️ {compact ? 'ESP32 Estável' : 'ESP32 Bluetooth - Versão Estável'}
      </Text>

      {/* Input invisível para capturar teclas */}
      <TextInput
        ref={inputRef}
        value={inputValue}
        onChangeText={handleTextChange}
        style={{
          position: 'absolute',
          left: -1000,
          top: -1000,
          width: 1,
          height: 1,
          opacity: 0
        }}
        autoFocus={false}
        multiline={false}
        placeholder=""
        showSoftInputOnFocus={false}
        keyboardType="none"
        caretHidden={true}
        autoCorrect={false}
        autoCapitalize="none"
        autoComplete="off"
        contextMenuHidden={true}
      />

      {/* Status */}
      {!compact && (
        <View style={{ marginBottom: 15, padding: 10, backgroundColor: '#FFF', borderRadius: 5 }}>
          <Text style={{ marginBottom: 5, color: '#666', fontSize: 14 }}>
            Status: {isActive ? '✅ Ativo (versão estável)' : '❌ Inativo'}
          </Text>
          <Text style={{ color: '#666', fontSize: 12 }}>
            Plataforma: {Platform.OS} | Entrada: "{inputValue}"
          </Text>
        </View>
      )}

      {compact && (
        <Text style={{ marginBottom: 8, color: '#666', fontSize: 10 }}>
          {isActive ? '✅ Ativo' : '❌ Inativo'} | Entrada: "{inputValue}"
        </Text>
      )}

      {/* Botões de controle */}
      <View style={{ 
        flexDirection: 'row', 
        marginBottom: compact ? 5 : 15 
      }}>        
        <TouchableOpacity
          style={{
            backgroundColor: '#FF6B6B',
            padding: compact ? 4 : 8,
            borderRadius: 5,
            flex: 1
          }}
          onPress={clearAllNotes}
        >
          <Text style={{ 
            color: 'white', 
            textAlign: 'center', 
            fontWeight: 'bold', 
            fontSize: compact ? 8 : 10 
          }}>
            🎹 {compact ? 'Parar Todas' : 'Parar Todas as Notas'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botões de teste - apenas no modo completo */}
      {!compact && (
        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, color: '#333' }}>
            🧪 Teste de Teclas:
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
            {['q', 'w', 'e', 'r', 't'].map(key => (
              <TouchableOpacity
                key={key}
                style={{
                  backgroundColor: '#28A745',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 3,
                  minWidth: 30
                }}
                onPress={() => simulateKey(key)}
              >
                <Text style={{ color: 'white', fontSize: 10, textAlign: 'center', fontWeight: 'bold' }}>
                  {key.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 5 }}>
            {['y', 'u', 'i', 'o', 'p'].map(key => (
              <TouchableOpacity
                key={key}
                style={{
                  backgroundColor: '#28A745',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 3,
                  minWidth: 30
                }}
                onPress={() => simulateKey(key)}
              >
                <Text style={{ color: 'white', fontSize: 10, textAlign: 'center', fontWeight: 'bold' }}>
                  {key.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

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
              maxHeight: 120 
            }}
          >
            {logs.length === 0 ? (
              <Text style={{ color: '#888', fontStyle: 'italic', fontSize: 11 }}>
                Pressione uma tecla no ESP32 ou use os botões de teste...
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
        {compact ? 'ESP32 auto-focus ativo' : 'Foco automático ativo - ESP32 detectado automaticamente'}
      </Text>
    </View>
  );
};

export default ESP32Stable;