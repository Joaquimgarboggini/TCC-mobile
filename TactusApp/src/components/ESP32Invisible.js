import React, { useState, useEffect, useContext, useRef } from 'react';
import { TextInput, AppState } from 'react-native';
import { ScaleContext } from '../context/ScaleContext';

const ESP32Invisible = () => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const { startSustainedNote, stopSustainedNote } = useContext(ScaleContext);
  
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`🎹 ESP32Invisible: [${timestamp}] ${message}`);
  };

  useEffect(() => {
    addLog('ESP32 Invisible inicializado');

    // Foco automático no input - reduzido para 500ms
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        addLog('Input invisível focado automaticamente');
      }
    }, 500); // Delay reduzido

    return () => {
      clearTimeout(timer);
      addLog('ESP32 Invisible desativado');
    };
  }, []);

  // Refocus automático quando o app volta ao primeiro plano
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active' && inputRef.current) {
        setTimeout(() => {
          inputRef.current.focus();
          addLog('Refocus automático invisível (app ativo)');
        }, 200); // Delay reduzido
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
      addLog(`Texto recebido: "${newChar}"`);
      
      // Processar tecla
      const keyMap = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
      if (keyMap.includes(newChar)) {
        addLog(`Tocando nota: ${newChar.toUpperCase()}`);
        
        // ESP32 sempre faz toque simples - parar qualquer nota anterior primeiro
        stopSustainedNote(newChar);
        
        // Pequeno delay para garantir limpeza
        setTimeout(() => {
          // Iniciar nota brevemente
          startSustainedNote(newChar);
          
          // ESP32 sempre para automaticamente (não sustenta)
          setTimeout(() => {
            stopSustainedNote(newChar);
            addLog(`ESP32 auto-stop: ${newChar.toUpperCase()}`);
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

  return (
    <TextInput
      ref={inputRef}
      value={inputValue}
      onChangeText={handleTextChange}
      style={{
        position: 'absolute',
        left: -2000,   // Muito longe da tela
        top: -2000,    // Muito longe da tela  
        width: 1,
        height: 1,
        opacity: 0,    // Completamente invisível
        zIndex: -1000  // Atrás de tudo
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
      editable={true}
      pointerEvents="none"  // Não interfere com outros toques
      blurOnSubmit={false}
      onFocus={() => {
        // Garantir que o foco não cause mudanças de orientação
        addLog('Input focado - mantendo orientação');
      }}
      onBlur={() => {
        // Re-focar imediatamente se perder foco
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 50);
      }}
    />
  );
};

export default ESP32Invisible;