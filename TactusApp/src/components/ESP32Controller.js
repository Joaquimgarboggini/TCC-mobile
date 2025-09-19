import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import BluetoothSerial from 'react-native-bluetooth-serial';
import styles from './styles';

const ESP32Controller = ({ onKeyPress, onKeyRelease }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      initializeBluetooth();
    }
  }, []);

  const initializeBluetooth = async () => {
    try {
      // Verificar se Bluetooth está habilitado
      const isEnabled = await BluetoothSerial.isEnabled();
      if (!isEnabled) {
        await BluetoothSerial.enable();
      }

      // Listar dispositivos pareados
      const pairedDevices = await BluetoothSerial.list();
      setDevices(pairedDevices);

      // Configurar listener para dados recebidos
      BluetoothSerial.on('read', (data) => {
        handleESP32Data(data.data);
      });

      BluetoothSerial.on('connectionLost', () => {
        setIsConnected(false);
        setConnectedDevice(null);
        Alert.alert('Conexão Perdida', 'Conexão com ESP32 foi perdida');
      });

    } catch (error) {
      console.error('Erro ao inicializar Bluetooth:', error);
      Alert.alert('Erro', 'Não foi possível inicializar o Bluetooth');
    }
  };

  const connectToESP32 = async (device) => {
    try {
      await BluetoothSerial.connect(device.id);
      setIsConnected(true);
      setConnectedDevice(device);
      Alert.alert('Conectado', `Conectado ao ${device.name}`);
    } catch (error) {
      console.error('Erro ao conectar:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao ESP32');
    }
  };

  const disconnect = async () => {
    try {
      await BluetoothSerial.disconnect();
      setIsConnected(false);
      setConnectedDevice(null);
    } catch (error) {
      console.error('Erro ao desconectar:', error);
    }
  };

  const handleESP32Data = (data) => {
    try {
      // Protocolo de comunicação com ESP32
      // Formato esperado: "KEY_DOWN:Q" ou "KEY_UP:Q"
      const message = data.trim();
      
      if (message.startsWith('KEY_DOWN:')) {
        const key = message.replace('KEY_DOWN:', '');
        onKeyPress(key.toUpperCase());
      } else if (message.startsWith('KEY_UP:')) {
        const key = message.replace('KEY_UP:', '');
        onKeyRelease(key.toUpperCase());
      }
    } catch (error) {
      console.error('Erro ao processar dados do ESP32:', error);
    }
  };

  const sendCommand = async (command) => {
    if (isConnected) {
      try {
        await BluetoothSerial.write(command);
      } catch (error) {
        console.error('Erro ao enviar comando:', error);
      }
    }
  };

  if (Platform.OS !== 'android') {
    return (
      <View style={{ padding: 16, backgroundColor: '#FFF3CD', borderRadius: 8, margin: 16 }}>
        <Text style={{ color: '#856404', textAlign: 'center' }}>
          ESP32 Bluetooth só funciona no Android
        </Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 16, backgroundColor: '#F8F9FA', borderRadius: 8, margin: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
        🎹 ESP32 Teclado Bluetooth
      </Text>
      
      {!isConnected ? (
        <View>
          <Text style={{ marginBottom: 10, color: '#666' }}>
            Dispositivos Bluetooth Pareados:
          </Text>
          {devices.map((device, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.button, { marginVertical: 5, backgroundColor: '#007AFF' }]}
              onPress={() => connectToESP32(device)}
            >
              <Text style={styles.buttonText}>{device.name || device.id}</Text>
            </TouchableOpacity>
          ))}
          {devices.length === 0 && (
            <Text style={{ color: '#999', fontStyle: 'italic' }}>
              Nenhum dispositivo encontrado. Pareie seu ESP32 primeiro.
            </Text>
          )}
        </View>
      ) : (
        <View>
          <Text style={{ color: '#28A745', marginBottom: 10 }}>
            ✅ Conectado: {connectedDevice?.name || 'ESP32'}
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#DC3545' }]}
            onPress={disconnect}
          >
            <Text style={styles.buttonText}>Desconectar</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Text style={{ fontSize: 12, color: '#666', marginTop: 10, textAlign: 'center' }}>
        {isConnected 
          ? 'Toque as teclas físicas do ESP32 para tocar' 
          : 'Conecte seu ESP32 para usar o teclado físico'
        }
      </Text>
    </View>
  );
};

export default ESP32Controller;