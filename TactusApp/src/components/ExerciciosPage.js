
import React from 'react';
import { View, Text } from 'react-native';
import TopBar from './TopBar';
import ButtonPage from './ButtonPage';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';

const exerciseSets = [
  { label: 'Exercícios de Escalas 1', route: 'Exercicio1' },
  { label: 'Exercícios de Escalas 2', route: 'Exercicio2' },
  { label: 'Exercício 3', route: 'Exercicio3' },
  { label: 'Exercício 4', route: 'Exercicio4' },
  { label: 'Exercício 5', route: 'Exercicio5' },
  { label: 'Exercício 6', route: 'Exercicio6' },
];

const ExerciciosPage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.pageContainer}>
      <TopBar title="Exercícios" onBack={() => navigation.goBack()} />
      <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 20, paddingTop: 40 }}>
        <Text style={[styles.pageText, { marginBottom: 20 }]}>Escolha um exercício:</Text>
        {exerciseSets.map(ex => (
          <ButtonPage
            key={ex.route}
            label={ex.label}
            onPress={() => navigation.navigate(ex.route)}
          />
        ))}
      </View>
    </View>
  );
};

export default ExerciciosPage;