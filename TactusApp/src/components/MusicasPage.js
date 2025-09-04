import React from 'react';
import { View, Text } from 'react-native';
import TopBar from './TopBar';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';

const MusicasPage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.pageContainer}>
      <TopBar title="Músicas" onBack={() => navigation.goBack()} />
      <View style={styles.pageContent}>
        <Text style={styles.pageText}>Página de Músicas</Text>
      </View>
    </View>
  );
};

export default MusicasPage;