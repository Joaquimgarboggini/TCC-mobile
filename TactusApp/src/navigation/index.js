import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home';
import Exercicios from '../pages/Exercicios';
import Musicas from '../pages/Musicas';
import Teclado from '../pages/Teclado';
import Ajuda from '../pages/Ajuda';
import Configuracoes from '../components/Configuracoes';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Exercicios" component={Exercicios} />
      <Stack.Screen name="Musicas" component={Musicas} />
      <Stack.Screen name="Teclado" component={Teclado} />
      <Stack.Screen name="Ajuda" component={Ajuda} />
      <Stack.Screen name="Configuracoes" component={Configuracoes} />
    </Stack.Navigator>
  );
};

export default AppNavigator;