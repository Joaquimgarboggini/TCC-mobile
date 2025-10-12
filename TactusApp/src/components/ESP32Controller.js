import React from 'react';
import { View, Text, TouchableOpacity, Platform, ScrollView } from 'react-native';
import styles from './styles';
import { useESP32 } from '../hooks/useESP32_real';

const ESP32Controller = () => {
  const {
    isConnected,
    connectedDevice,
    devices,
    bluetoothAvailable,
    logs,
    connectToESP32,
    disconnect,
    clearLogs,
    requestAllPermissions
  } = useESP32();

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
        🎹 Teclado Físico ESP32
      </Text>
      
      {/* Status de Conexão */}
      <View style={{ marginBottom: 15, padding: 10, backgroundColor: '#FFF', borderRadius: 5 }}>
        <Text style={{ marginBottom: 5, color: '#666', fontSize: 14 }}>
          Status: {isConnected ? '✅ Conectado' : '❌ Desconectado'}
        </Text>
        
        {isConnected && connectedDevice && (
          <View style={{ padding: 8, backgroundColor: '#D4F6D4', borderRadius: 5 }}>
            <Text style={{ color: '#28A745', fontSize: 14, fontWeight: 'bold' }}>
              📱 Conectado ao: {connectedDevice.name || connectedDevice.id}
            </Text>
            <Text style={{ color: '#666', fontSize: 12, marginTop: 2 }}>
              Endereço: {connectedDevice.address || 'N/A'}
            </Text>
          </View>
        )}
      </View>
      
      {/* Lista de Dispositivos */}
      {!isConnected ? (
        <View style={{ marginBottom: 15 }}>
          <Text style={{ marginBottom: 8, color: '#666', fontSize: 14, fontWeight: 'bold' }}>
            Dispositivos Disponíveis:
          </Text>
          {devices && devices.length > 0 ? (
            devices.map((device, index) => (
              <TouchableOpacity
                key={String(index || 0)}
                style={[styles.button, { marginVertical: 3, backgroundColor: '#007AFF', paddingVertical: 10 }]}
                onPress={() => connectToESP32(device)}
              >
                <Text style={[styles.buttonText, { fontSize: 13 }]}>
                  📱 {String((device.name || device.id) || 'Dispositivo')}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ color: '#999', fontStyle: 'italic', fontSize: 12 }}>
              Nenhum dispositivo encontrado. Pareie seu ESP32 primeiro.
            </Text>
          )}
          
          <TouchableOpacity
            style={[styles.button, { marginTop: 10, backgroundColor: '#FFC107', paddingVertical: 8 }]}
            onPress={requestAllPermissions}
          >
            <Text style={[styles.buttonText, { fontSize: 12, color: '#000' }]}>
              🔄 Atualizar Lista
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#DC3545', paddingVertical: 10, marginBottom: 15 }]}
          onPress={disconnect}
        >
          <Text style={[styles.buttonText, { fontSize: 13 }]}>🔌 Desconectar</Text>
        </TouchableOpacity>
      )}
      
      {/* Logs do ESP32 */}
      <View style={{ marginTop: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>
            📋 Logs ESP32:
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#6C757D', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}
            onPress={clearLogs}
          >
            <Text style={{ color: 'white', fontSize: 10 }}>Limpar</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={{ 
            backgroundColor: '#000', 
            borderRadius: 5, 
            padding: 8, 
            maxHeight: 150 
          }}
          showsVerticalScrollIndicator={true}
        >
          {logs.length === 0 ? (
            <Text style={{ color: '#888', fontStyle: 'italic', fontSize: 11 }}>
              Aguardando atividade do ESP32...
            </Text>
          ) : (
            logs.map((log, index) => (
              <Text key={index} style={{ color: '#00FF00', fontSize: 10, marginBottom: 2 }}>
                {log}
              </Text>
            ))
          )}
        </ScrollView>
      </View>
      
       <Text style={{ fontSize: 10, color: '#666', marginTop: 10, textAlign: 'center', fontStyle: 'italic' }}>
        {isConnected 
          ? 'Use as luvas ESP32 para tocar. Mapeamento: Q W E R T Y U I O P' 
          : 'Conecte seu ESP32 para usar o teclado físico'
        }
      </Text>
    </View>
  );
};

export default ESP32Controller;