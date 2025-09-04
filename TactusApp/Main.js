import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import App from './App';
import ExerciciosPage from './src/components/ExerciciosPage';
import MusicasPage from './src/components/MusicasPage';
import AjudaPage from './src/components/AjudaPage';
import TecladoPage from './src/components/TecladoPage';
import Exercicio1 from './src/components/exercicios/Exercicio1';
import Exercicio2 from './src/components/exercicios/Exercicio2';
import Exercicio3 from './src/components/exercicios/Exercicio3';
// Importe Exercicio4, Exercicio5, Exercicio6 se existirem

const Stack = createStackNavigator();

export default function Main() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={App} options={{ headerShown: false }} />
        <Stack.Screen
          name="Exercicios"
          component={ExerciciosPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Musicas" component={MusicasPage} options={{ headerShown: false }} />
        <Stack.Screen name="Ajuda" component={AjudaPage} options={{ headerShown: false }} />
        <Stack.Screen name="Teclado" component={TecladoPage} options={{ headerShown: false }} />
        <Stack.Screen name="Exercicio1" component={Exercicio1} options={{ headerShown: false }} />
        <Stack.Screen name="Exercicio2" component={Exercicio2} options={{ headerShown: false }} />
        <Stack.Screen name="Exercicio3" component={Exercicio3} options={{ headerShown: false }} />
        {/* Adicione Exercicio4, Exercicio5, Exercicio6 aqui */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}