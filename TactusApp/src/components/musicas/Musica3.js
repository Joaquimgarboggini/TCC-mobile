import React from 'react';
import { View, Text } from 'react-native';
import HeaderMinimal from '../HeaderMinimal';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';

const Musica3 = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.pageContainer}>
      <HeaderMinimal title="Música 3" iconType="musicas" onBack={() => navigation.goBack()} />
      <View style={{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingTop: 20 
      }}>
        <Text style={[styles.pageText, {
          fontSize: 28,
          fontWeight: 'bold',
          color: '#666',
          textAlign: 'center',
          marginBottom: 20
        }]}>
          Em Breve
        </Text>
        <Text style={{
          fontSize: 16,
          color: '#888',
          textAlign: 'center',
          lineHeight: 24,
          marginBottom: 10
        }}>
          Esta música estará disponível em futuras versões do aplicativo.
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#999',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          Escala: D Maior • Dificuldade: Médio
        </Text>
      </View>
    </View>
  );
};

export default Musica3;
