import { useState, useEffect, useContext } from 'react';
import { Platform, DeviceEventEmitter, NativeEventEmitter } from 'react-native';
import { ScaleContext } from '../context/ScaleContext';

export const useKeyboardEvents = () => {
  const [logs, setLogs] = useState([]);
  const { startSustainedNote, stopSustainedNote } = useContext(ScaleContext);
  
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = `[${timestamp}] ${message}`;
    console.log('⌨️ Keyboard:', newLog);
    setLogs(prev => [...prev.slice(-10), newLog]);
  };

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    addLog('Iniciando interceptação de teclado...');

    // Método 1: Event Listener para KeyEvents
    const keyDownListener = DeviceEventEmitter.addListener('keyDown', (event) => {
      addLog(`Tecla pressionada: ${event.key || event.keyCode}`);
      handleKeyEvent(event, true);
    });

    const keyUpListener = DeviceEventEmitter.addListener('keyUp', (event) => {
      addLog(`Tecla solta: ${event.key || event.keyCode}`);
      handleKeyEvent(event, false);
    });

    // Método 2: Focus em input invisível para capturar teclas
    const setupInvisibleInput = () => {
      // Este método será implementado no componente React
      addLog('Input invisível configurado para capturar teclas');
    };

    setupInvisibleInput();

    return () => {
      keyDownListener.remove();
      keyUpListener.remove();
    };
  }, []);

  const handleKeyEvent = (event, isPressed) => {
    const keyMap = {
      'q': 0, 'w': 1, 'e': 2, 'r': 3, 't': 4,
      'y': 5, 'u': 6, 'i': 7, 'o': 8, 'p': 9
    };

    const key = event.key?.toLowerCase();
    if (keyMap.hasOwnProperty(key)) {
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
    addLog
  };
};