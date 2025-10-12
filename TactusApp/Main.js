import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import App from './App';
import ExerciciosPage from './src/components/ExerciciosPage';
import MusicasPage from './src/components/MusicasPage';
import AjudaPage from './src/components/AjudaPage';
import TecladoPage from './src/components/TecladoPage';
import Configuracoes from './src/components/Configuracoes';
import Exercicio1 from './src/components/exercicios/Exercicio1';
import Exercicio2 from './src/components/exercicios/Exercicio2';
import Exercicio3 from './src/components/exercicios/Exercicio3';
import Exercicio4 from './src/components/exercicios/Exercicio4';
import Exercicio5 from './src/components/exercicios/Exercicio5';
import Exercicio6 from './src/components/exercicios/Exercicio6';
import Exercicio7 from './src/components/exercicios/Exercicio7';
import Exercicio8 from './src/components/exercicios/Exercicio8';
import Exercicio9 from './src/components/exercicios/Exercicio9';
import Exercicio10 from './src/components/exercicios/Exercicio10';

import Musica1 from './src/components/musicas/Musica1';
import Musica2 from './src/components/musicas/Musica2';
import Musica3 from './src/components/musicas/Musica3';
import Musica4 from './src/components/musicas/Musica4';
import Musica5 from './src/components/musicas/Musica5';
import { ScaleProvider } from './src/context/ScaleContext';
import PermissionsHandler from './src/components/PermissionsHandler';

const Stack = createStackNavigator();

export default function Main() {
  return (
    <PermissionsHandler>
      <ScaleProvider>
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
            <Stack.Screen name="Exercicio4" component={Exercicio4} options={{ headerShown: false }} />
            <Stack.Screen name="Exercicio5" component={Exercicio5} options={{ headerShown: false }} />
            <Stack.Screen name="Exercicio6" component={Exercicio6} options={{ headerShown: false }} />
            <Stack.Screen name="Exercicio7" component={Exercicio7} options={{ headerShown: false }} />
            <Stack.Screen name="Exercicio8" component={Exercicio8} options={{ headerShown: false }} />
            <Stack.Screen name="Exercicio9" component={Exercicio9} options={{ headerShown: false }} />
            <Stack.Screen name="Exercicio10" component={Exercicio10} options={{ headerShown: false }} />
            <Stack.Screen name="Musica1" component={Musica1} options={{ headerShown: false }} />
            <Stack.Screen name="Musica2" component={Musica2} options={{ headerShown: false }} />
            <Stack.Screen name="Musica3" component={Musica3} options={{ headerShown: false }} />
            <Stack.Screen name="Musica4" component={Musica4} options={{ headerShown: false }} />
            <Stack.Screen name="Musica5" component={Musica5} options={{ headerShown: false }} />
            <Stack.Screen name="Configuracoes" component={Configuracoes} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </ScaleProvider>
    </PermissionsHandler>
  );
}