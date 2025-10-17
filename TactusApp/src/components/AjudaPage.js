import React from 'react';
import { View, Text } from 'react-native';
import HeaderMinimal from './HeaderMinimal';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';

const AjudaPage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.pageContainer}>
      <HeaderMinimal title="Ajuda" iconType="ajuda" onBack={() => navigation.goBack()} />
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
          lineHeight: 24
        }}>
          Esta seção estará disponível em futuras versões do aplicativo.
        </Text>
      </View>
    </View>
  );
};

export default AjudaPage;