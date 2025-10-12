// MÉTODO 4: Usar react-native-keyevent (Biblioteca pronta)
// 
// Instalação:
// npm install react-native-keyevent
// 
// Para React Native 0.60+:
// cd android && ./gradlew clean
// cd .. && npx react-native run-android

import { useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import { ScaleContext } from '../context/ScaleContext';

// Importar react-native-keyevent
let KeyEvent = null;
try {
  KeyEvent = require('react-native-keyevent');
} catch (e) {
  console.log('react-native-keyevent não instalado');
}

export const useKeyEvent = () => {
  const [logs, setLogs] = useState([]);
  const { startSustainedNote, stopSustainedNote } = useContext(ScaleContext);
  
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = `[${timestamp}] ${message}`;
    console.log('🎹 KeyEvent:', newLog);
    setLogs(prev => [...prev.slice(-10), newLog]);
  };

  useEffect(() => {
    if (!KeyEvent || Platform.OS !== 'android') {
      addLog('KeyEvent não disponível ou não é Android');
      return;
    }

    addLog('Iniciando KeyEvent listener...');

    // Configurar listeners
    KeyEvent.onKeyDownListener((keyEvent) => {
      addLog(`Tecla DOWN: ${keyEvent.keyCode} - ${keyEvent.action}`);
      handleKeyEvent(keyEvent, true);
    });

    KeyEvent.onKeyUpListener((keyEvent) => {
      addLog(`Tecla UP: ${keyEvent.keyCode} - ${keyEvent.action}`);
      handleKeyEvent(keyEvent, false);
    });

    // Cleanup
    return () => {
      KeyEvent.removeKeyDownListener();
      KeyEvent.removeKeyUpListener();
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
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('Logs limpos');
  };

  return {
    logs,
    clearLogs,
    available: !!KeyEvent
  };
};