import { useState, useEffect, useContext } from 'react';
import { ScaleContext } from '../context/ScaleContext';

export const useESP32WiFi = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [esp32IP, setEsp32IP] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  
  // Usar o contexto de escala para tocar notas
  const { startSustainedNote, stopSustainedNote } = useContext(ScaleContext);

  // Conectar ao ESP32 via WiFi
  const connectToESP32WiFi = async (ipAddress) => {
    try {
      // Testar conexão com ESP32
      const response = await fetch(`http://${ipAddress}/ping`, {
        method: 'GET',
        timeout: 5000,
      });
      
      if (response.ok) {
        setEsp32IP(ipAddress);
        setIsConnected(true);
        console.log('🌐 ESP32 conectado via WiFi:', ipAddress);
        startPolling(ipAddress);
        return true;
      }
    } catch (error) {
      console.error('Erro ao conectar ESP32 via WiFi:', error);
      return false;
    }
  };

  // Polling para verificar estado das teclas
  const startPolling = (ipAddress) => {
    setIsPolling(true);
    
    const poll = async () => {
      try {
        const response = await fetch(`http://${ipAddress}/keys`, {
          method: 'GET',
          timeout: 1000,
        });
        
        if (response.ok) {
          const data = await response.json();
          processKeyData(data);
        }
      } catch (error) {
        console.error('Erro no polling:', error);
        // Se falhar 3 vezes seguidas, desconectar
        disconnect();
      }
    };

    // Polling a cada 100ms
    const interval = setInterval(poll, 100);
    
    return () => clearInterval(interval);
  };

  const processKeyData = (keyData) => {
    // Formato esperado: { pressedKeys: ['Q', 'W'], releasedKeys: ['E'] }
    if (keyData.pressedKeys) {
      keyData.pressedKeys.forEach(key => {
        console.log('🎵 WiFi - Tecla pressionada:', key);
        if (startSustainedNote) {
          const playedNote = startSustainedNote(key.toUpperCase());
          if (playedNote) {
            console.log(`🎶 WiFi tocou nota: ${key} → ${playedNote}`);
          }
        }
      });
    }

    if (keyData.releasedKeys) {
      keyData.releasedKeys.forEach(key => {
        console.log('🎵 WiFi - Tecla liberada:', key);
        if (stopSustainedNote) {
          const stoppedNote = stopSustainedNote(key.toUpperCase());
          if (stoppedNote) {
            console.log(`🎶 WiFi parou nota: ${key} → ${stoppedNote}`);
          }
        }
      });
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setEsp32IP('');
    setIsPolling(false);
    console.log('🌐 ESP32 WiFi desconectado');
  };

  return {
    isConnected,
    esp32IP,
    isPolling,
    connectToESP32WiFi,
    disconnect
  };
};