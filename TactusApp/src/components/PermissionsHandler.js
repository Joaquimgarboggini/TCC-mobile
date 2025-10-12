import React, { useEffect, useState } from 'react';
import { View, Text, Platform, PermissionsAndroid } from 'react-native';

const PermissionsHandler = ({ children }) => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestAllPermissions();
    } else {
      setPermissionsGranted(true);
    }
  }, []);

  const requestAllPermissions = async () => {
    try {
      console.log('📱 Solicitando todas as permissões necessárias...');
      
      const permissions = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ];

      // Para Android 12+ (API 31+)
      if (Platform.Version >= 31) {
        console.log('📱 Android 12+: Adicionando permissões Bluetooth modernas...');
        if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN) {
          permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
        }
        if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
          permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
        }
        if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE) {
          permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE);
        }
      }
      
      // Para Android 13+ (API 33+) - Dispositivos próximos
      if (Platform.Version >= 33) {
        console.log('📱 Android 13+: Adicionando permissão de dispositivos próximos...');
        if (PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES) {
          permissions.push(PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES);
        }
      }

      const granted = await PermissionsAndroid.requestMultiple(permissions);
      
      console.log('📱 Permissões solicitadas:', Object.keys(granted).length);
      console.log('📱 Resultados:', granted);
      
      // Consideramos sucesso mesmo se algumas forem negadas
      setPermissionsGranted(true);
      
    } catch (error) {
      console.error('📱 Erro ao solicitar permissões:', error);
      setPermissionsGranted(true); // Continuar mesmo com erro
    }
  };

  if (!permissionsGranted && Platform.OS === 'android') {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#F8F9FA',
        padding: 20
      }}>
        <Text style={{ 
          fontSize: 18, 
          fontWeight: 'bold', 
          marginBottom: 10,
          textAlign: 'center' 
        }}>
          🎵 TactusApp
        </Text>
        <Text style={{ 
          fontSize: 14, 
          color: '#666', 
          textAlign: 'center',
          marginBottom: 20
        }}>
          Solicitando permissões de Bluetooth e dispositivos próximos...
        </Text>
        <Text style={{ 
          fontSize: 12, 
          color: '#999', 
          textAlign: 'center' 
        }}>
          Necessário para conectar com luvas ESP32 via Bluetooth
        </Text>
      </View>
    );
  }

  return children;
};

export default PermissionsHandler;