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

import Musica1 from './src/components/musicas/Musica1';
import Musica2 from './src/components/musicas/Musica2';
import Musica3 from './src/components/musicas/Musica3';
import Musica4 from './src/components/musicas/Musica4';
import Musica5 from './src/components/musicas/Musica5';

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
        <Stack.Screen name="Musica1" component={Musica1} options={{ headerShown: false }} />
        <Stack.Screen name="Musica2" component={Musica2} options={{ headerShown: false }} />
        <Stack.Screen name="Musica3" component={Musica3} options={{ headerShown: false }} />
        <Stack.Screen name="Musica4" component={Musica4} options={{ headerShown: false }} />
        <Stack.Screen name="Musica5" component={Musica5} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}