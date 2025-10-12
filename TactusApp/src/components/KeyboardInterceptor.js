import React, { useRef, useEffect, useState, useContext } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ScaleContext } from '../context/ScaleContext';

const KeyboardInterceptor = ({ compact = false }) => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [logs, setLogs] = useState([]);
  const { startSustainedNote, stopSustainedNote } = useContext(ScaleContext);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = `[${timestamp}] ${message}`;
    console.log('⌨️ ESP32:', newLog);
    setLogs(prev => [...prev.slice(-10), newLog]);
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('Logs limpos');
  };

  useEffect(() => {
    // Focar automaticamente no input invisível apenas quando explicitamente solicitado
    // Não usar foco automático para evitar aparecer o teclado
    addLog('Componente inicializado - clique em "Reativar" para focar');
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
        
        // Iniciar nota
        startSustainedNote(newChar);
        
        // Para garantir que a nota seja devidamente parada, vamos limpar qualquer sustain anterior
        setTimeout(() => {
          stopSustainedNote(newChar);
          addLog(`🎶 Parando nota: ${newChar.toUpperCase()}`);
        }, 300); // Duração da nota um pouco maior
      }
    }
    
    setInputValue(text);
    
    // Limpar texto periodicamente para não ficar muito longo
    if (text.length > 5) {
      setInputValue('');
    }
  };

  const refocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      addLog('Input refocado manualmente');
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
        ⌨️ {compact ? 'ESP32' : 'Interceptador de Teclado ESP32'}
      </Text>

      {/* Input invisível para capturar teclas */}
      <TextInput
        ref={inputRef}
        value={inputValue}
        onChangeText={handleTextChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          position: 'absolute',
          left: -1000, // Esconder o input
          top: -1000,  // Esconder verticalmente também
          width: 1,
          height: 1,
          opacity: 0
        }}
        autoFocus={false}              // Evitar foco automático que pode abrir teclado
        multiline={false}
        placeholder=""
        showSoftInputOnFocus={false}   // NÃO mostrar teclado do celular
        keyboardType="none"            // Sem teclado
        caretHidden={true}             // Esconder cursor
        autoCorrect={false}            // Sem autocorreção
        autoCapitalize="none"          // Sem capitalização automática
        autoComplete="off"             // Sem autocompletar
        inputMode="none"               // Modo de entrada: nenhum
        enterKeyHint="done"            // Hint da tecla enter
        blurOnSubmit={false}           // Não desfocar ao submeter
        editable={true}                // Ainda editável para capturar texto
        contextMenuHidden={true}       // Esconder menu de contexto
      />

      {/* Status */}
      {!compact && (
        <View style={{ marginBottom: 15, padding: 10, backgroundColor: '#FFF', borderRadius: 5 }}>
          <Text style={{ marginBottom: 5, color: '#666', fontSize: 14 }}>
            Status: {isFocused ? '✅ Ativo (recebendo teclas)' : '❌ Inativo'}
          </Text>
          <Text style={{ color: '#666', fontSize: 12 }}>
            Texto atual: "{inputValue}"
          </Text>
        </View>
      )}

      {compact && (
        <Text style={{ marginBottom: 8, color: '#666', fontSize: 10 }}>
          {isFocused ? '✅ Ativo' : '❌ Inativo'} | Texto: "{inputValue}"
        </Text>
      )}

      {/* Botões de controle */}
      <View style={{ 
        flexDirection: 'row', 
        marginBottom: compact ? 5 : 15 
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#007AFF',
            padding: compact ? 6 : 10,
            borderRadius: 5,
            flex: 1,
            marginRight: 5
          }}
          onPress={refocus}
        >
          <Text style={{ 
            color: 'white', 
            textAlign: 'center', 
            fontWeight: 'bold', 
            fontSize: compact ? 10 : 12 
          }}>
            🔄 {compact ? 'Ativar' : 'Reativar'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{
            backgroundColor: '#FF6B6B',
            padding: compact ? 6 : 10,
            borderRadius: 5,
            flex: 1,
            marginLeft: 5
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
        {compact ? 'ESP32 ativo para teclado' : 'Mantenha este componente ativo para receber teclas do ESP32'}
      </Text>
    </View>
  );
};

export default KeyboardInterceptor;