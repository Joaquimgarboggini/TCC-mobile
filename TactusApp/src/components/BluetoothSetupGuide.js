import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import styles from './styles';

const BluetoothSetupGuide = () => {
  const openNpmPackage = () => {
    Linking.openURL('https://www.npmjs.com/package/react-native-bluetooth-classic');
  };

  const showInstallInstructions = () => {
    Alert.alert(
      'Configuração ESP32 Bluetooth',
      'O módulo já está instalado, mas precisa de build nativo:\n\n' +
      '1. npx expo run:android\n' +
      '   (NÃO use Expo Go)\n\n' +
      '2. Pareie seu ESP32 no Android\n' +
      '3. Permita localização e Bluetooth\n\n' +
      'Para desenvolvimento: Use o ESP32 Simulator abaixo.',
      [
        { text: 'Entendi', style: 'default' },
        { text: 'Ver Documentação', onPress: openNpmPackage }
      ]
    );
  };

  return (
    <View style={{ padding: 16, backgroundColor: '#E7F3FF', borderRadius: 8, margin: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#0066CC' }}>
        📘 Configuração Bluetooth ESP32
      </Text>
      
      <Text style={{ color: '#0066CC', marginBottom: 15, lineHeight: 20 }}>
        O módulo Bluetooth já está instalado, mas você está rodando no Expo Go ou sem build nativo. 
        Para usar as luvas ESP32, é necessário fazer build nativo do Android.
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#0066CC', marginBottom: 10 }]}
        onPress={showInstallInstructions}
      >
        <Text style={styles.buttonText}>Como Configurar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#28A745' }]}
        onPress={openNpmPackage}
      >
        <Text style={styles.buttonText}>Documentação</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 12, color: '#666', marginTop: 10, textAlign: 'center' }}>
        Use o ESP32 Simulator abaixo para desenvolvimento
      </Text>
    </View>
  );
};

export default BluetoothSetupGuide;