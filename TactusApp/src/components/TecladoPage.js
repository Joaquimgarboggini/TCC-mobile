import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import TopBar from './TopBar';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';

const TecladoPage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);

  return (
    <View style={styles.pageContainer}>
      <TopBar title="Teclado" onBack={() => navigation.goBack()} />
      <View style={styles.pageContent}>
        <Text style={styles.pageText}>Página do Teclado (horizontal)</Text>
      </View>
    </View>
  );
};

export default TecladoPage;