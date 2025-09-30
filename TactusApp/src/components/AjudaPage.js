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
      <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 }}>
        <Text style={styles.pageText}>Página de Ajuda</Text>
      </View>
    </View>
  );
};

export default AjudaPage;