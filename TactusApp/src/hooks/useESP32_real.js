import { useState, useEffect, useContext } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { ScaleContext } from '../context/ScaleContext';

// Importação condicional do Bluetooth
let BluetoothSerial = null;
try {
  if (Platform.OS === 'android') {
    BluetoothSerial = require('react-native-bluetooth-classic');
    console.log('🔗 ESP32 BluetoothSerial carregado');
  }
} catch (error) {
  console.log('🔗 ESP32 BluetoothSerial não disponível:', error.message);
}

export const useESP32 = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [devices, setDevices] = useState([]);
  const [bluetoothAvailable, setBluetoothAvailable] = useState(false);
  const [connection, setConnection] = useState(null);
  const [logs, setLogs] = useState([]);

  // Usar o contexto de escala para tocar notas
  const { startSustainedNote, stopSustainedNote } = useContext(ScaleContext);

  // Função para adicionar logs
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = `[${timestamp}] ${message}`;
    console.log('🔗 ESP32', newLog);
    setLogs(prev => [...prev.slice(-10), newLog]); // Manter últimos 10 logs
  };

  useEffect(() => {
    addLog('Hook inicializado');
    
    if (Platform.OS === 'android') {
      requestAllPermissions();
    }
  }, []);

  // Solicitar todas as permissões necessárias
  const requestAllPermissions = async () => {
    try {
      addLog('Solicitando permissões...');
      
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
        if (PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES) {
          permissions.push(PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES);
        }
      }

      const granted = await PermissionsAndroid.requestMultiple(permissions);
      
      const allGranted = Object.values(granted).every(
        permission => permission === PermissionsAndroid.RESULTS.GRANTED
      );

      if (allGranted) {
        addLog('✅ Todas as permissões concedidas');
        initializeBluetooth();
      } else {
        addLog('⚠️ Algumas permissões foram negadas');
        setBluetoothAvailable(true); // Ainda assim, tentar funcionar
        initializeBluetooth();
      }
    } catch (error) {
      addLog(`❌ Erro ao solicitar permissões: ${error.message}`);
    }
  };

  const initializeBluetooth = async () => {
    try {
      addLog('Inicializando Bluetooth...');
      
      if (!BluetoothSerial) {
        addLog('❌ Módulo Bluetooth não disponível - instale react-native-bluetooth-classic');
        setBluetoothAvailable(false);
        return;
      }

      setBluetoothAvailable(true);

      // Verificar se as funções existem antes de usá-las
      if (typeof BluetoothSerial.isBluetoothEnabled !== 'function') {
        addLog('❌ Função isBluetoothEnabled não encontrada');
        setDevices([]);
        return;
      }

      // Verificar se Bluetooth está habilitado
      const isEnabled = await BluetoothSerial.isBluetoothEnabled();
      addLog(`Bluetooth habilitado: ${isEnabled}`);
      
      if (!isEnabled) {
        if (typeof BluetoothSerial.requestBluetoothEnabled === 'function') {
          addLog('Solicitando habilitação do Bluetooth...');
          try {
            await BluetoothSerial.requestBluetoothEnabled();
            addLog('✅ Bluetooth habilitado');
          } catch (enableError) {
            addLog(`❌ Erro ao habilitar: ${enableError.message}`);
            return;
          }
        } else {
          addLog('❌ Não é possível habilitar Bluetooth automaticamente');
          return;
        }
      }

      // Buscar dispositivos pareados
      if (typeof BluetoothSerial.getBondedDevices !== 'function') {
        addLog('❌ Função getBondedDevices não encontrada');
        setDevices([]);
        return;
      }

      addLog('Buscando dispositivos pareados...');
      const pairedDevices = await BluetoothSerial.getBondedDevices();
      addLog(`📱 Total de dispositivos pareados: ${pairedDevices.length}`);
      
      // Log de todos os dispositivos para debugging
      pairedDevices.forEach((device, index) => {
        addLog(`${index + 1}. Nome: "${device.name || 'Sem nome'}" | Endereço: ${device.address || 'N/A'}`);
      });
      
      // Procurar dispositivos ESP32/TactusGlove (busca mais ampla)
      const esp32Devices = pairedDevices.filter(device => {
        const name = (device.name || '').toLowerCase();
        return (
          name.includes('tactusglove') ||
          name.includes('tactus') ||
          name.includes('esp32') ||
          name.includes('glove') ||
          device.address // Incluir todos os dispositivos com endereço válido para teste
        );
      });

      if (esp32Devices.length > 0) {
        addLog(`✅ Dispositivos compatíveis encontrados: ${esp32Devices.length}`);
        esp32Devices.forEach(device => {
          addLog(`🎹 Disponível: ${device.name || 'Dispositivo sem nome'}`);
        });
        setDevices(esp32Devices);
      } else {
        addLog('⚠️ Nenhum dispositivo ESP32/TactusGlove encontrado na lista');
        addLog('💡 Mostrando todos os dispositivos pareados para teste:');
        setDevices(pairedDevices); // Mostrar todos para você encontrar o TactusGlove
      }

    } catch (error) {
      addLog(`❌ Erro na inicialização: ${error.message}`);
      addLog(`📋 Stack trace: ${error.stack || 'N/A'}`);
      setBluetoothAvailable(false);
      setDevices([]);
    }
  };

  const connectToESP32 = async (device) => {
    try {
      addLog(`🔗 Tentando conectar ao: ${device.name}`);
      addLog(`📍 Endereço MAC: ${device.address}`);
      
      if (!BluetoothSerial) {
        addLog('❌ Módulo Bluetooth não disponível');
        return;
      }

      if (!device.address || typeof BluetoothSerial.connectToDevice !== 'function') {
        addLog('❌ Função connectToDevice não disponível ou endereço inválido');
        return;
      }

      // Tentar conectar ao dispositivo real
      addLog('🔄 Estabelecendo conexão Bluetooth...');
      const newConnection = await BluetoothSerial.connectToDevice(device.address);
      
      if (!newConnection) {
        addLog('❌ Falha na conexão - dispositivo não respondeu');
        return;
      }

      setConnection(newConnection);
      setIsConnected(true);
      setConnectedDevice(device);
      
      addLog(`✅ CONECTADO com sucesso ao ${device.name}!`);
      addLog(`📡 Aguardando dados do ESP32...`);
      
      // Configurar listener para dados recebidos
      if (newConnection && typeof newConnection.onDataReceived === 'function') {
        addLog('👂 Listener de dados configurado');
        newConnection.onDataReceived((data) => {
          handleESP32Data(data.data);
        });
      } else {
        addLog('⚠️ Não foi possível configurar listener de dados');
      }

      // Configurar listener para desconexão
      if (newConnection && typeof newConnection.onDisconnected === 'function') {
        addLog('🔌 Listener de desconexão configurado');
        newConnection.onDisconnected(() => {
          setIsConnected(false);
          setConnectedDevice(null);
          setConnection(null);
          addLog('❌ ESP32 desconectado');
        });
      }
      
    } catch (error) {
      addLog(`❌ ERRO na conexão: ${error.message}`);
      addLog(`🔍 Detalhes: ${error.stack || 'Sem stack trace'}`);
      
      // Reset do estado em caso de erro
      setIsConnected(false);
      setConnectedDevice(null);
      setConnection(null);
    }
  };

  const disconnect = async () => {
    try {
      if (connection && BluetoothSerial) {
        await BluetoothSerial.disconnect(connectedDevice.address);
      }
      setIsConnected(false);
      setConnectedDevice(null);
      setConnection(null);
      addLog('🔌 Desconectado');
    } catch (error) {
      addLog(`❌ Erro ao desconectar: ${error.message}`);
    }
  };

  // Processar dados recebidos do ESP32
  const handleESP32Data = (data) => {
    try {
      const cleanData = String(data).trim();
      addLog(`📡 Dados brutos: "${cleanData}" (${cleanData.length} chars)`);
      
      // Mapear teclas QWERTYUIOP para índices
      const keyMap = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
      const reverseKeyMap = {
        'q': 0, 'w': 1, 'e': 2, 'r': 3, 't': 4,
        'y': 5, 'u': 6, 'i': 7, 'o': 8, 'p': 9
      };
      
      // Formato 1: KEY_DOWN:0 ou KEY_UP:0
      if (cleanData.includes('KEY_DOWN:') || cleanData.includes('KEY_UP:')) {
        const isKeyDown = cleanData.includes('KEY_DOWN:');
        const keyIndex = parseInt(cleanData.split(':')[1]);
        
        if (keyIndex >= 0 && keyIndex < keyMap.length) {
          const key = keyMap[keyIndex];
          const action = isKeyDown ? 'pressionada' : 'solta';
          addLog(`� Tecla ${action}: ${key.toUpperCase()} (índice ${keyIndex})`);
          
          if (isKeyDown) {
            startSustainedNote(key);
          } else {
            stopSustainedNote(key);
          }
        } else {
          addLog(`⚠️ Índice de tecla inválido: ${keyIndex}`);
        }
      }
      // Formato 2: Caractere direto (q, w, e, etc.)
      else if (cleanData.length === 1 && reverseKeyMap.hasOwnProperty(cleanData.toLowerCase())) {
        const key = cleanData.toLowerCase();
        const keyIndex = reverseKeyMap[key];
        addLog(`🎹 Tecla detectada: ${key.toUpperCase()} (índice ${keyIndex})`);
        startSustainedNote(key);
        
        // Auto-soltar após 200ms se não receber KEY_UP
        setTimeout(() => {
          stopSustainedNote(key);
          addLog(`🎶 Auto-soltar: ${key.toUpperCase()}`);
        }, 200);
      }
      // Formato 3: Outros formatos possíveis
      else {
        addLog(`🔍 Formato não reconhecido - dados: "${cleanData}"`);
        
        // Tentar extrair caracteres conhecidos
        for (let i = 0; i < cleanData.length; i++) {
          const char = cleanData[i].toLowerCase();
          if (reverseKeyMap.hasOwnProperty(char)) {
            addLog(`� Caractere encontrado: ${char.toUpperCase()}`);
            startSustainedNote(char);
            setTimeout(() => stopSustainedNote(char), 150);
          }
        }
      }
    } catch (error) {
      addLog(`❌ Erro ao processar dados: ${error.message}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('Logs limpos');
  };

  return {
    isConnected,
    connectedDevice,
    devices,
    bluetoothAvailable,
    logs,
    connectToESP32,
    disconnect,
    clearLogs,
    requestAllPermissions,
    addLog
  };
};