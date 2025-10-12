import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScaleContext } from '../context/ScaleContext';

const AudioTest = () => {
  const { audioReady, playNote, stopNote } = useContext(ScaleContext);

  const testNotes = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'];

  const handlePlayNote = async (note) => {
    console.log(`🧪 AudioTest: Tentando tocar ${note}`);
    try {
      await playNote(note, 'Piano1');
      console.log(`✅ AudioTest: Som ${note} tocado com sucesso`);
    } catch (error) {
      console.log(`❌ AudioTest: Erro ao tocar ${note}:`, error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teste de Áudio</Text>
      <Text style={styles.status}>
        Status do Áudio: {audioReady ? '✅ Pronto' : '❌ Não pronto'}
      </Text>
      
      <View style={styles.buttonContainer}>
        {testNotes.map((note) => (
          <TouchableOpacity
            key={note}
            style={styles.button}
            onPress={() => handlePlayNote(note)}
          >
            <Text style={styles.buttonText}>{note}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 5,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AudioTest;