import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import TopBar from './TopBar';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { ScaleContext } from '../context/ScaleContext';
import ESP32Controller from './ESP32Controller';
import ESP32DebugConsole from './ESP32DebugConsole';

const Configuracoes = () => {
  const navigation = useNavigation();
  const { selectedScale, setSelectedScale, availableScales } = useContext(ScaleContext);
  const [localScale, setLocalScale] = useState(selectedScale || 'Dó Maior');

  // Verificação de segurança para availableScales
  const safeAvailableScales = availableScales || ['C Maior', 'D Maior', 'E Maior', 'F Maior', 'G Maior', 'A Maior', 'B Maior'];

  const handleScaleSelection = (scale) => {
    setLocalScale(scale);
  };

  const handleConclude = () => {
    setSelectedScale(localScale);
    navigation.goBack();
  };

  const handleCancel = () => {
    setLocalScale(selectedScale);
    navigation.goBack();
  };

  const handleBack = () => {
    if (localScale !== selectedScale) {
      handleCancel();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.pageContainer}>
      <TopBar title="Configurações" onBack={handleBack} />
      <ScrollView style={styles.pageContent}>
        
        {/* Seção de Escalas */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.pageText, { fontSize: 18, fontWeight: 'bold', marginBottom: 10 }]}>
            🎵 Configuração Musical
          </Text>
          <Text style={styles.pageText}>Selecione uma escala musical:</Text>
          <Picker
            selectedValue={String(localScale || '')}
            style={styles.picker}
            onValueChange={(itemValue) => handleScaleSelection(itemValue)}
          >
            {availableScales.map((scale) => (
              <Picker.Item key={String(scale || 'unknown')} label={String(scale || 'unknown')} value={String(scale || 'unknown')} />
            ))}
          </Picker>
          <Text style={styles.pageText}>
            Escala selecionada: {String(localScale || 'Nenhuma')}
          </Text>
        </View>

        {/* Seção ESP32 */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.pageText, { fontSize: 18, fontWeight: 'bold', marginBottom: 10 }]}>
            🎹 Teclado Físico ESP32
          </Text>
          <ESP32Controller />
        </View>

        {/* Botões de ação */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleConclude}>
            <Text style={styles.buttonText}>Salvar Configurações</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </View>
  );
};

export default Configuracoes;