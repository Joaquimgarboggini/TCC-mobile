import { useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import { ScaleContext } from '../context/ScaleContext';

export const useESP32 = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [devices, setDevices] = useState([]);
  const [bluetoothAvailable, setBluetoothAvailable] = useState(true);

  // Usar o contexto de escala para tocar notas
  const { startSustainedNote, stopSustainedNote } = useContext(ScaleContext);

  useEffect(() => {
    console.log('🔗 ESP32 Hook inicializado (modo simplificado)');
    
    if (Platform.OS === 'android') {
      // Modo simplificado - apenas mostrar dispositivos padrão
      setBluetoothAvailable(true);
      setDevices([
        { name: 'TactusGlove_Lft', address: 'TactusGlove_Lft', id: 'tactus-left' },
        { name: 'TactusGlove_Rht', address: 'TactusGlove_Rht', id: 'tactus-right' },
        { name: 'ESP32-DevKitC', address: 'esp32-manual', id: 'esp32-manual' }
      ]);
    }
  }, []);

  const connectToESP32 = (device) => {
    console.log('🔗 ESP32 Conectando ao dispositivo (simulado):', device.name);
    
    // Simular conexão bem-sucedida
    setIsConnected(true);
    setConnectedDevice(device);
    console.log('🔗 ESP32 Conectado com sucesso (simulado)');
  };

  const disconnect = () => {
    console.log('🔗 ESP32 Desconectando...');
    setIsConnected(false);
    setConnectedDevice(null);
  };

  // Função para processar dados do ESP32 (simulada)
  const handleESP32Data = (data) => {
    console.log('🔗 ESP32 Dados recebidos:', data);
    
    try {
      if (data.includes('KEY_DOWN:')) {
        const keyIndex = parseInt(data.split(':')[1]);
        const keys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
        if (keyIndex >= 0 && keyIndex < keys.length) {
          startSustainedNote(keys[keyIndex]);
        }
      } else if (data.includes('KEY_UP:')) {
        const keyIndex = parseInt(data.split(':')[1]);
        const keys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
        if (keyIndex >= 0 && keyIndex < keys.length) {
          stopSustainedNote(keys[keyIndex]);
        }
      }
    } catch (error) {
      console.error('🔗 ESP32 Erro ao processar dados:', error);
    }
  };

  return {
    isConnected,
    connectedDevice,
    devices,
    bluetoothAvailable,
    connectToESP32,
    disconnect,
    handleESP32Data
  };
};