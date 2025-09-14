import React from 'react';
import { View, Text } from 'react-native';
import TopBar from './TopBar';
import ButtonPage from './ButtonPage';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';

const musicSets = [
  { label: 'Música 1', route: 'Musica1' },
  { label: 'Música 2', route: 'Musica2' },
  { label: 'Música 3', route: 'Musica3' },
  { label: 'Música 4', route: 'Musica4' },
  { label: 'Música 5', route: 'Musica5' },
];

const MusicasPage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.pageContainer}>
      <TopBar title="Músicas" onBack={() => navigation.goBack()} />
      <View style={styles.pageContent}>
        <Text style={styles.pageText}>Escolha uma música:</Text>
        {musicSets.map(music => (
          <ButtonPage
            key={music.route}
            label={music.label}
            onPress={() => navigation.navigate(music.route)}
          />
        ))}
      </View>
    </View>
  );
};

export default MusicasPage;