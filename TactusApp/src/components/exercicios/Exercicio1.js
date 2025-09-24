// Exemplo de página de exercício
// filepath: d:\l\bentao\TCC\TCC-MobDir\TCC-mob\TCC-mob\TactusApp\src\components\Exercicio1.js
import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import TopBar from '../TopBar';
import ButtonPage from '../ButtonPage';
import ExercObject from '../ExercObject';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import { ScaleContext } from '../../context/ScaleContext';

// Função para montar os valores dos dedos (dedos 5 e 10 = polegares, ficam vazios)
function getFingersNotes(scaleNotes) {
  // Usa só os 8 graus: 1 a 7 + oitava acima
  const fingers = Array(10).fill('');
  for (let i = 0; i < 8; i++) {
    // dedos: 0,1,2,3,5,6,7,8 (índices JS)
    const fingerIndex = i < 4 ? i : i + 1;
    fingers[fingerIndex] = scaleNotes[i];
  }
  return fingers;
}

const Exercicio1 = () => {
  const navigation = useNavigation();
  const { selectedScale, scaleNotes, keyMapping } = useContext(ScaleContext);
  const [queue, setQueue] = useState([]); // Sistema de queue para notas

  useEffect(() => {
    if (scaleNotes && scaleNotes.length > 0) {
      // Cria a sequência de subida da escala 2 vezes seguidas
      const sequenciaSubida = [...scaleNotes, ...scaleNotes];
      setQueue(sequenciaSubida);
      
      console.log('Exercício 1 - Escala selecionada:', selectedScale);
      console.log('Exercício 1 - Notas da escala:', scaleNotes);
      console.log('Exercício 1 - Sequência (2x subida):', sequenciaSubida);
    }
  }, [selectedScale, scaleNotes]);

  // Variáveis para cada dedo
  let dedo1 = '', dedo2 = '', dedo3 = '', dedo4 = '', dedo5 = '', dedo6 = '', dedo7 = '', dedo8 = '', dedo9 = '', dedo10 = '';
  let fingers = [];

  if (scaleNotes && scaleNotes.length > 0) {
    fingers = getFingersNotes(scaleNotes);
    [dedo1, dedo2, dedo3, dedo4, dedo5, dedo6, dedo7, dedo8, dedo9, dedo10] = fingers;
  }

  return (
    <View style={styles.pageContainer}>
      <TopBar title="Exercício 1 - Subida da Escala" onBack={() => navigation.goBack()} />
      <View style={[styles.pageContent, { justifyContent: 'flex-start' }]}>
        <View style={{ marginBottom: 16, marginTop: 52, marginHorizontal: 28 }}>
          <Text style={styles.pageText}>
            Neste exercício, você deve tocar a escala de {selectedScale} subindo duas vezes seguidas.
          </Text>
        </View>
        
        {queue.length > 0 ? (
          <>
            <View style={{ marginBottom: 16 }}>
              <Text style={[styles.pageText, { fontWeight: 'bold', fontSize: 16 }]}>
                Escala: {selectedScale}
              </Text>
              <Text style={styles.pageText}>
                Notas: {scaleNotes.join(' - ')}
              </Text>
            </View>

            <View style={{ 
              flex: 1, 
              width: '100%', 
              alignItems: 'center', 
              justifyContent: 'flex-start',
              paddingTop: 20
            }}>
              <ExercObject notes={queue} />
            </View>
          </>
        ) : (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={styles.pageText}>
              ⚠️ Nenhuma escala selecionada
            </Text>
            <Text style={[styles.pageText, { fontSize: 14, marginTop: 10 }]}>
              Vá para Configurações e selecione uma escala musical para começar o exercício.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Exercicio1;