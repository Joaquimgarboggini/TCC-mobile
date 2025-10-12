import { useState, useEffect, useContext } from 'react';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import { ScaleContext } from '../context/ScaleContext';

// Importação condicional do Bluetooth com múltiplas tentativas
let BluetoothSerial = null;
let BluetoothManager = null;

try {
  if (Platform.OS === 'android') {
    // Tentativa 1: react-native-bluetooth-classic
    try {
      BluetoothSerial = require('react-native-bluetooth-classic');
      console.log('🔗 ESP32 BluetoothSerial carregado via react-native-bluetooth-classic');
    } catch (e) {
      console.log('🔗 ESP32 react-native-bluetooth-classic não disponível:', e.message);
    }

    // Tentativa 2: react-native-bluetooth-manager (alternativa)
    try {
      BluetoothManager = require('react-native-bluetooth-manager');
      console.log('🔗 ESP32 BluetoothManager carregado via react-native-bluetooth-manager');
    } catch (e) {
      console.log('🔗 ESP32 react-native-bluetooth-manager não disponível:', e.message);
    }

    // Verificar se pelo menos um módulo foi carregado
    if (BluetoothSerial || BluetoothManager) {
      console.log('🔗 ESP32 Módulo Bluetooth carregado com sucesso');
      console.log('🔗 ESP32 BluetoothSerial:', !!BluetoothSerial);
      console.log('🔗 ESP32 BluetoothManager:', !!BluetoothManager);
      
      if (BluetoothSerial) {
        console.log('🔗 ESP32 Métodos BluetoothSerial:', Object.keys(BluetoothSerial || {}));
      }
    } else {
      console.log('🔗 ESP32 Nenhum módulo Bluetooth disponível');
    }
  }
} catch (error) {
  console.warn('🔗 ESP32 Erro geral ao carregar Bluetooth:', error.message);
}

export const useESP32 = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [devices, setDevices] = useState([]);
  const [bluetoothAvailable, setBluetoothAvailable] = useState(false);
  const [connection, setConnection] = useState(null);

  // Usar o contexto de escala para tocar notas
  const { startSustainedNote, stopSustainedNote } = useContext(ScaleContext);

  useEffect(() => {
    console.log('🔗 ESP32 Hook inicializado');
    console.log('🔗 ESP32 Platform.OS:', Platform.OS);
    
    if (Platform.OS === 'android' && BluetoothSerial) {
      console.log('🔗 ESP32 Android detectado, inicializando Bluetooth');
      console.log('🔗 ESP32 BluetoothSerial object:', typeof BluetoothSerial);
      console.log('🔗 ESP32 isBluetoothEnabled type:', typeof BluetoothSerial.isBluetoothEnabled);
      
      setBluetoothAvailable(true);
      
      // Usar timeout para evitar inicialização múltipla
      const timeoutId = setTimeout(() => {
        initializeBluetooth();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    } else {
      console.log('🔗 ESP32 Plataforma não suportada ou BluetoothSerial não disponível');
      console.log('🔗 ESP32 BluetoothSerial:', !!BluetoothSerial);
    }
  }, []);

  // Função para solicitar permissões
  const requestBluetoothPermissions = async () => {
    try {
      console.log('🔗 ESP32 Solicitando permissões Bluetooth...');
      
      if (Platform.OS !== 'android') {
        console.log('🔗 ESP32 Permissões não necessárias (não é Android)');
        return true;
      }

      const permissions = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ];

      // Para Android 12+ (API 31+)
      if (Platform.Version >= 31) {
        if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN) {
          permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
        }
        if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
          permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
        }
      }

      const granted = await PermissionsAndroid.requestMultiple(permissions);
      
      console.log('🔗 ESP32 Permissões concedidas:', JSON.stringify(granted, null, 2));
      
      const allGranted = Object.values(granted).every(
        permission => permission === PermissionsAndroid.RESULTS.GRANTED
      );

      if (allGranted) {
        console.log('🔗 ESP32 Todas as permissões Bluetooth concedidas');
        return true;
      } else {
        console.log('🔗 ESP32 Algumas permissões foram negadas');
        return false; // Não mostrar alert para evitar loops
      }
    } catch (error) {
      console.error('🔗 ESP32 Erro ao solicitar permissões:', error);
      return false;
    }
  };

  const initializeBluetooth = async () => {
    console.log('🔗 ESP32 Iniciando configuração do Bluetooth...');
    
    try {
      // Verificar se já está inicializando para evitar calls múltiplas
      if (bluetoothAvailable && devices.length > 0) {
        console.log('🔗 ESP32 Bluetooth já inicializado');
        return;
      }
      
      // Primeiro, solicitar permissões
      const permissionsGranted = await requestBluetoothPermissions();
      if (!permissionsGranted) {
        console.log('🔗 ESP32 Permissões negadas, mas continuando...');
      }

      // Sempre definir como disponível para mostrar a interface
      setBluetoothAvailable(true);

      if (!BluetoothSerial) {
        console.log('🔗 ESP32 BluetoothSerial não disponível - usando modo básico');
        
        // Criar lista de dispositivos de exemplo
        setDevices([
          { name: 'TactusGlove_Lft (Manual)', address: 'TactusGlove_Lft', id: 'tactus-left' },
          { name: 'TactusGlove_Rht (Manual)', address: 'TactusGlove_Rht', id: 'tactus-right' },
          { name: 'ESP32-DevKitC', address: '24:0A:C4:XX:XX:XX', id: 'esp32-example-1' }
        ]);
        return;
      }

      // Verificar funções disponíveis de forma segura
      const hasIsEnabled = typeof BluetoothSerial.isBluetoothEnabled === 'function';
      const hasGetDevices = typeof BluetoothSerial.getBondedDevices === 'function';

      if (!hasIsEnabled) {
        console.log('🔗 ESP32 Funções básicas não disponíveis - usando dispositivos padrão');
        setDevices([
          { name: 'TactusGlove_Lft (Padrão)', address: 'TactusGlove_Lft', id: 'tactus-left' },
          { name: 'TactusGlove_Rht (Padrão)', address: 'TactusGlove_Rht', id: 'tactus-right' }
        ]);
        return;
      }

      console.log('🔗 ESP32 Verificando se Bluetooth está habilitado...');
      
      // Envolver em try-catch para evitar crashes
      let isEnabled = false;
      try {
        isEnabled = await BluetoothSerial.isBluetoothEnabled();
        console.log('🔗 ESP32 Bluetooth habilitado:', isEnabled);
      } catch (enableCheckError) {
        console.log('🔗 ESP32 Erro ao verificar Bluetooth:', enableCheckError.message);
      }
      
      if (!isEnabled && typeof BluetoothSerial.requestBluetoothEnabled === 'function') {
        console.log('🔗 ESP32 Solicitando habilitação do Bluetooth...');
        try {
          await BluetoothSerial.requestBluetoothEnabled();
        } catch (enableError) {
          console.log('🔗 ESP32 Erro ao habilitar Bluetooth:', enableError.message);
        }
      }

      // Buscar dispositivos pareados
      if (hasGetDevices) {
        console.log('🔗 ESP32 Buscando dispositivos pareados...');
        
        let pairedDevices = [];
        try {
          pairedDevices = await BluetoothSerial.getBondedDevices();
          console.log('🔗 ESP32 Dispositivos encontrados:', pairedDevices.length);
          console.log('🔗 ESP32 Lista completa:', pairedDevices.map(d => d.name || d.id));
        } catch (devicesError) {
          console.log('🔗 ESP32 Erro ao buscar dispositivos:', devicesError.message);
          pairedDevices = [];
        }
        
        // Procurar especificamente por TactusGlove
        const tactusDevices = pairedDevices.filter(device => 
          (device.name && device.name.includes('TactusGlove')) ||
          (device.name && device.name.includes('Tactus')) ||
          (device.name && device.name.includes('ESP32'))
        );

        if (tactusDevices.length > 0) {
          console.log('🔗 ESP32 TactusGlove encontrado:', tactusDevices.map(d => d.name));
          setDevices(tactusDevices);
        } else if (pairedDevices.length > 0) {
          console.log('🔗 ESP32 Usando todos os dispositivos pareados');
          setDevices(pairedDevices);
        } else {
          setDevices([
            { name: 'TactusGlove_Lft (Pareie primeiro)', address: 'pair-needed', id: 'pair-help' },
            { name: 'Nenhum dispositivo pareado', address: 'none', id: 'none' }
          ]);
        }
      }

    } catch (error) {
      console.error('🔗 ESP32 Erro na inicialização:', error);
      
      // Mesmo com erro, manter interface disponível
      setBluetoothAvailable(true);
      setDevices([
        { name: 'TactusGlove_Lft (Erro)', address: 'TactusGlove_Lft', id: 'tactus-error' },
        { name: 'Verifique o console de debug', address: 'debug', id: 'debug' }
      ]);
    }
  };

  const connectToESP32 = async (device) => {
    try {
      console.log('🔗 ESP32 Tentando conectar ao dispositivo:', device.name, device.address);
      
      if (!BluetoothSerial || typeof BluetoothSerial.connectToDevice !== 'function') {
        console.log('🔗 ESP32 BluetoothSerial.connectToDevice não disponível');
        
        // Se for TactusGlove, simular conexão bem-sucedida
        if (device.name && device.name.includes('TactusGlove')) {
          setIsConnected(true);
          setConnectedDevice(device);
          console.log('🔗 ESP32 Simulando conexão com TactusGlove:', device.name);
          return;
        }
        
        console.log('🔗 ESP32 Dispositivo selecionado:', device.name);
        return;
      }

      // Se for um dispositivo de ajuda, apenas mostrar informação
      if (device.address === 'pair-needed' || device.address === 'none') {
        console.log('🔗 ESP32 Instruções:', device.name);
        return;
      }

      const newConnection = await BluetoothSerial.connectToDevice(device.address);
      setConnection(newConnection);
      setIsConnected(true);
      setConnectedDevice(device);
      
      console.log('🔗 ESP32 Conectado com sucesso ao:', device.name);
      
      // Configurar listener para dados recebidos
      if (newConnection && typeof newConnection.onDataReceived === 'function') {
        newConnection.onDataReceived((data) => {
          handleESP32Data(data.data);
        });
      }

      if (newConnection && typeof newConnection.onDisconnected === 'function') {
        newConnection.onDisconnected(() => {
          setIsConnected(false);
          setConnectedDevice(null);
          setConnection(null);
          console.log('🔗 ESP32 Dispositivo desconectado');
        });
      }
      
    } catch (error) {
      console.error('🔗 ESP32 Erro ao conectar:', error);
      console.log('🔗 ESP32 Erro detalhado:', error.message);
    }
  };

  const disconnect = async () => {
    try {
      if (connection && connectedDevice && BluetoothSerial && typeof BluetoothSerial.disconnect === 'function') {
        await BluetoothSerial.disconnect(connectedDevice.address);
        setIsConnected(false);
        setConnectedDevice(null);
        setConnection(null);
        console.log('🔌 ESP32 desconectado');
      }
    } catch (error) {
      console.error('Erro ao desconectar:', error);
    }
  };

  const handleESP32Data = (data) => {
    try {
      // Protocolo de comunicação com ESP32
      // Formato esperado: "KEY_DOWN:Q" ou "KEY_UP:Q"
      const message = data.trim();
      console.log('📡 Dados recebidos do ESP32:', message);
      
      if (message.startsWith('KEY_DOWN:')) {
        const key = message.replace('KEY_DOWN:', '').toUpperCase();
        console.log('🎵 ESP32 - Tecla pressionada:', key);
        
        // Usar ScaleContext para tocar a nota
        if (startSustainedNote) {
          const playedNote = startSustainedNote(key);
          if (playedNote) {
            console.log(`🎶 ESP32 tocou nota: ${key} → ${playedNote}`);
          }
        }
      } else if (message.startsWith('KEY_UP:')) {
        const key = message.replace('KEY_UP:', '').toUpperCase();
        console.log('🎵 ESP32 - Tecla liberada:', key);
        
        // Usar ScaleContext para parar a nota
        if (stopSustainedNote) {
          const stoppedNote = stopSustainedNote(key);
          if (stoppedNote) {
            console.log(`🎶 ESP32 parou nota: ${key} → ${stoppedNote}`);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao processar dados do ESP32:', error);
    }
  };

  const sendCommand = async (command) => {
    if (isConnected && connection && BluetoothSerial && typeof BluetoothSerial.write === 'function') {
      try {
        await BluetoothSerial.write(command);
        console.log('📤 Comando enviado para ESP32:', command);
      } catch (error) {
        console.error('Erro ao enviar comando:', error);
      }
    }
  };

  return {
    // Estados
    isConnected,
    connectedDevice,
    devices,
    bluetoothAvailable,
    
    // Funções
    connectToESP32,
    disconnect,
    sendCommand,
    initializeBluetooth
  };
};