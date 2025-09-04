import React from 'react';
import { View } from 'react-native';
import TopBar from './src/components/TopBar';
import ButtonPage from './src/components/ButtonPage';
import styles from './src/components/styles';
import { useNavigation } from '@react-navigation/native';

const App = () => {
  const navigation = useNavigation();

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
        label="Ajuda"
        onPress={() => navigation.navigate('Ajuda')}
      />
      {/* Outros componentes da sua tela */}
    </View>
  );
};

export default App;