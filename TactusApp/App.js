import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import HeaderMinimal from './src/components/HeaderMinimal';
import ButtonPage from './src/components/ButtonPage';
import styles from './src/components/styles';
import { useNavigation } from '@react-navigation/native';
import { ScaleContext } from './src/context/ScaleContext';
import TecladoButton from './assets/buttons/TecladoButton';
import ExerciciosIcon from './assets/icons/ExerciciosIconFixed';
import MusicasIcon from './assets/icons/MusicasIconNew';
import ConfiguracoesIcon from './assets/icons/ConfiguracoesIconNew';
import AjudaIcon from './assets/icons/AjudaIconNew';

const App = () => {
  const navigation = useNavigation();
  const { selectedScale, keyMapping } = useContext(ScaleContext); // Access keyMapping from context
  const [displayMapping, setDisplayMapping] = useState({});

  // Update the displayed mapping whenever the keyMapping changes
  useEffect(() => {
    setDisplayMapping(keyMapping);
  }, [keyMapping]);

  return (
    <View style={[styles.appContainer, { backgroundColor: '#F6F6F6' }]}>
      <HeaderMinimal title="Home" iconType="home" isHome={true} />
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        
        {/* Botão Teclado em Destaque */}
        <TouchableOpacity 
          style={tecladoStyles.tecladoContainer}
          onPress={() => navigation.navigate('Teclado')}
        >
          <View style={tecladoStyles.tecladoButton}>
            <TecladoButton width={320} height={100} />
            <View style={tecladoStyles.tecladoLabelInside}>
              <Text style={tecladoStyles.tecladoText}>Teclado</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Outros Botões em Grid 2x2 */}
        <View style={gridStyles.gridContainer}>
          {/* Primeira linha */}
          <View style={gridStyles.gridRow}>
            {/* Exercícios */}
            <TouchableOpacity 
              style={[gridStyles.gridButton, { backgroundColor: '#F0F0F0' }]}
              onPress={() => navigation.navigate('Exercicios')}
            >
              <View style={gridStyles.topBar}>
                <View style={[gridStyles.colorBar, { backgroundColor: '#00FF00' }]} />
              </View>
              <View style={gridStyles.iconContainer}>
                <ExerciciosIcon size={35} color="#333" />
              </View>
              <View style={[gridStyles.bottomBar, { backgroundColor: '#00FF00' }]}>
                <Text style={gridStyles.buttonText}>Exercícios</Text>
              </View>
            </TouchableOpacity>

            {/* Músicas */}
            <TouchableOpacity 
              style={[gridStyles.gridButton, { backgroundColor: '#F0F0F0' }]}
              onPress={() => navigation.navigate('Musicas')}
            >
              <View style={gridStyles.topBar}>
                <View style={[gridStyles.colorBar, { backgroundColor: '#FFDC19' }]} />
              </View>
              <View style={gridStyles.iconContainer}>
                <MusicasIcon size={35} color="#333" />
              </View>
              <View style={[gridStyles.bottomBar, { backgroundColor: '#FFDC19' }]}>
                <Text style={gridStyles.buttonText}>Músicas</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Segunda linha */}
          <View style={gridStyles.gridRow}>
            {/* Configurações */}
            <TouchableOpacity 
              style={[gridStyles.gridButton, { backgroundColor: '#F0F0F0' }]}
              onPress={() => navigation.navigate('Configuracoes')}
            >
              <View style={gridStyles.topBar}>
                <View style={[gridStyles.colorBar, { backgroundColor: '#DD00FF' }]} />
              </View>
              <View style={gridStyles.iconContainer}>
                <ConfiguracoesIcon size={35} color="#333" />
              </View>
              <View style={[gridStyles.bottomBar, { backgroundColor: '#DD00FF' }]}>
                <Text style={gridStyles.buttonText}>Configurações</Text>
              </View>
            </TouchableOpacity>

            {/* Ajuda */}
            <TouchableOpacity 
              style={[gridStyles.gridButton, { backgroundColor: '#F0F0F0' }]}
              onPress={() => navigation.navigate('Ajuda')}
            >
              <View style={gridStyles.topBar}>
                <View style={[gridStyles.colorBar, { backgroundColor: '#FF1B1B' }]} />
              </View>
              <View style={gridStyles.iconContainer}>
                <AjudaIcon size={35} color="#333" />
              </View>
              <View style={[gridStyles.bottomBar, { backgroundColor: '#FF1B1B' }]}>
                <Text style={gridStyles.buttonText}>Ajuda</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 100 }}>
          <Text style={styles.selectedScaleText}>
            Escala selecionada: {selectedScale || 'Nenhuma'}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Estilos específicos para o botão Teclado
const tecladoStyles = StyleSheet.create({
  tecladoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  tecladoButton: {
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    width: 340,
    height: 140,
    position: 'relative',
  },
  tecladoLabelInside: {
    backgroundColor: '#78D7FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 0,
    position: 'absolute',
    bottom: 20,
  },
  tecladoText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

// Estilos para o grid 2x2
const gridStyles = StyleSheet.create({
  gridContainer: {
    marginTop: 25,
    paddingHorizontal: 15,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridButton: {
    width: 130,
    height: 130,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    marginHorizontal: 5,
  },
  topBar: {
    height: 6,
    width: '100%',
  },
  colorBar: {
    height: '100%',
    width: '100%',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  bottomBar: {
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default App;