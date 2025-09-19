import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import TopBar from './src/components/TopBar';
import ButtonPage from './src/components/ButtonPage';
import styles from './src/components/styles';
import { useNavigation } from '@react-navigation/native';
import { ScaleContext } from './src/context/ScaleContext';

const App = () => {
  const navigation = useNavigation();
  const { selectedScale, keyMapping } = useContext(ScaleContext); // Access keyMapping from context
  const [displayMapping, setDisplayMapping] = useState({});

  // Update the displayed mapping whenever the keyMapping changes
  useEffect(() => {
    setDisplayMapping(keyMapping);
  }, [keyMapping]);

  return (
    <View style={styles.appContainer}>
      <TopBar title="Home" />
      <ButtonPage
        label="Exercícios"
        onPress={() => navigation.navigate('Exercicios')}
      />
      <ButtonPage label="Músicas" onPress={() => navigation.navigate('Musicas')} />
      <ButtonPage label="Teclado" onPress={() => navigation.navigate('Teclado')} />
      <ButtonPage
        label="Configurações"
        onPress={() => navigation.navigate('Configuracoes')}
      />
      <ButtonPage
        label="Ajuda"
        onPress={() => navigation.navigate('Ajuda')}
      />
      <Text style={styles.selectedScaleText}>
        Escala selecionada: {selectedScale || 'Nenhuma'}
      </Text>
    </View>
  );
};

export default App;