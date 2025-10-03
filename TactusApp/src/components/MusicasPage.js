import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderMinimal from './HeaderMinimal';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';

const musicSets = [
  { label: 'Música 1', route: 'Musica1', difficulty: 'Fácil', scale: 'C Maior' },
  { label: 'Música 2', route: 'Musica2', difficulty: 'Fácil', scale: 'G Maior' },
  { label: 'Música 3', route: 'Musica3', difficulty: 'Médio', scale: 'D Maior' },
  { label: 'Música 4', route: 'Musica4', difficulty: 'Médio', scale: 'A Menor' },
  { label: 'Música 5', route: 'Musica5', difficulty: 'Difícil', scale: 'F Maior' },
];

const MusicasPage = () => {
  const navigation = useNavigation();

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Fácil':
        return '#4CAF50'; // Verde
      case 'Médio':
        return '#FF9800'; // Laranja
      case 'Difícil':
        return '#F44336'; // Vermelho
      default:
        return '#666';
    }
  };

  const renderMusicButton = (music) => {
    const difficultyColor = getDifficultyColor(music.difficulty);
    
    return (
      <View 
        key={music.route}
        style={{
          flexDirection: 'row',
          marginBottom: 15,
          width: '100%',
        }}
      >
        {/* Área principal da música com fundo cinza (não clicável) */}
        <View style={{
          flex: 1,
          backgroundColor: '#D9D9D9',
          paddingVertical: 15,
          paddingHorizontal: 20,
          borderRadius: 8,
          justifyContent: 'center',
          marginRight: 10, // Espaço entre a área e o botão play
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
          position: 'relative',
          // Bordas coloridas baseadas na dificuldade
          borderLeftWidth: 4,
          borderBottomWidth: 4,
          borderLeftColor: difficultyColor,
          borderBottomColor: difficultyColor,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#333',
            paddingRight: 80, // Espaço para o indicador de dificuldade
          }}>
            {music.label}
          </Text>
          
          {/* Exibição da escala temporária */}
          <Text style={{
            fontSize: 12,
            fontWeight: '400',
            color: '#666',
            fontStyle: 'italic',
            marginTop: 2,
            paddingRight: 80,
          }}>
            Escala: {music.scale}
          </Text>
          
          {/* Indicador de dificuldade no canto superior direito */}
          <View style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: '#B9B9B9',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderTopRightRadius: 8, // Apenas canto superior direito arredondado
            borderBottomLeftRadius: 8, // Apenas canto inferior esquerdo arredondado
            borderTopLeftRadius: 0, // Canto superior esquerdo reto
            borderBottomRightRadius: 0, // Canto inferior direito reto
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
          }}>
            <Text style={{
              fontSize: 10,
              color: '#333', // Texto preto em vez da cor da dificuldade
              fontWeight: '600',
            }}>
              {music.difficulty}
            </Text>
          </View>
        </View>

        {/* Botão de play quadrado separado e clicável */}
        <TouchableOpacity
          style={{
            backgroundColor: '#616161',
            width: 60,
            height: 60, // Altura fixa para manter formato quadrado
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
          }}
          onPress={() => navigation.navigate(music.route)}
          activeOpacity={0.7}
        >
          <Icon 
            name="play" 
            size={20} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.pageContainer}>
      <HeaderMinimal title="Músicas" iconType="musicas" onBack={() => navigation.goBack()} />
      <View style={{ 
        flex: 1, 
        paddingHorizontal: 20, 
        paddingTop: 20 
      }}>
        <Text style={[styles.pageText, { 
          marginBottom: 25, 
          textAlign: 'center',
          fontSize: 16,
          color: '#666'
        }]}>
          Selecione uma música para tocar:
        </Text>
        
        {musicSets.map(renderMusicButton)}
      </View>
    </View>
  );
};

export default MusicasPage;