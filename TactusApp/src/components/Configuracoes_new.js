import React, { useContext, useState } from 'react';
import { View, Text, Picker, TouchableOpacity } from 'react-native';
import TopBar from './TopBar';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { ScaleContext } from '../context/ScaleContext';

const Configuracoes = () => {
  const navigation = useNavigation();
  const { selectedScale, setSelectedScale, availableScales } = useContext(ScaleContext);
  const [localScale, setLocalScale] = useState(selectedScale);

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
      <View style={styles.pageContent}>
        <Text style={styles.pageText}>Selecione uma escala musical:</Text>
        <Picker
          selectedValue={localScale}
          style={styles.picker}
          onValueChange={(itemValue) => handleScaleSelection(itemValue)}
        >
          {availableScales.map((scale) => (
            <Picker.Item key={scale} label={scale} value={scale} />
          ))}
        </Picker>
        <Text style={styles.pageText}>
          Escala selecionada: {localScale}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleConclude}>
            <Text style={styles.buttonText}>Concluir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Configuracoes;