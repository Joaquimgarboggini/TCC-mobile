import React, { useEffect, useContext, useState, useRef } from 'react';
import { View, Text, Platform } from 'react-native';
import HeaderMinimal from './HeaderMinimal';
import VirtualKeyboard from './VirtualKeyboard';
import ESP32Invisible from './ESP32Invisible';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ScaleContext } from '../context/ScaleContext';

const TecladoPage = () => {
  const navigation = useNavigation();
  const { 
    selectedScale, 
    scaleNotes, 
    keyMapping,
    startSustainedNote,
    stopSustainedNote
  } = useContext(ScaleContext);

  // Usar refs para manter referências estáveis das funções
  const startSustainedNoteRef = useRef(startSustainedNote);
  const stopSustainedNoteRef = useRef(stopSustainedNote);

  // Atualizar refs quando as funções mudam
  useEffect(() => {
    startSustainedNoteRef.current = startSustainedNote;
    stopSustainedNoteRef.current = stopSustainedNote;
  }, [startSustainedNote, stopSustainedNote]);

  useEffect(() => {
    // Função auxiliar para lidar com orientação de forma segura
    const lockOrientation = async (orientation) => {
      try {
        if (Platform.OS !== 'web') {
          await ScreenOrientation.lockAsync(orientation);
          console.log(`Orientação travada: ${orientation}`);
        }
      } catch (error) {
        console.log('Screen orientation not supported:', error.message);
      }
    };

    // Forçar orientação paisagem ao montar e manter travada
    lockOrientation(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);

    // Adicionar listeners de teclado para web
    let keyDownHandler, keyUpHandler;
    
    if (Platform.OS === 'web') {
      keyDownHandler = (e) => {
        if (e.repeat) return; // Ignora repetições automáticas
        if (!e.key || typeof e.key !== 'string') return; // Validação
        startSustainedNoteRef.current(e.key);
      };

      keyUpHandler = (e) => {
        if (!e.key || typeof e.key !== 'string') return; // Validação
        stopSustainedNoteRef.current(e.key);
      };

      // Verificar se está em ambiente web antes de usar window
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);
      }
    }

    // Cleanup único para todos os casos
    return () => {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.removeEventListener) {
        // Remover listeners web
        if (keyDownHandler) window.removeEventListener('keydown', keyDownHandler);
        if (keyUpHandler) window.removeEventListener('keyup', keyUpHandler);
      }
      
      // Restaurar orientação retrato ao sair
      lockOrientation(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []); // Array vazio - nunca re-executa

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderMinimal title="Teclado" iconType="teclado" onBack={() => navigation.goBack()} inverted={true} />
      
      {/* Legenda sem padding para não limitar o layout */}
      <View style={{
        paddingHorizontal: 20, // Manter padding só na legenda
        marginTop: 5,
        marginBottom: 10
      }}>
        <Text style={{
          fontSize: 14,
          fontWeight: 'bold',
          color: '#333',
          marginBottom: 4,
          textAlign: 'left'
        }}>
          Escala: {String(selectedScale || 'Nenhuma')}
        </Text>
        <Text style={{
          fontSize: 12,
          color: '#666',
          textAlign: 'left'
        }}>
          {scaleNotes && scaleNotes.length > 0 ? String(scaleNotes.join(' - ')) : 'Nenhuma escala selecionada'}
        </Text>
      </View>

      {/* Container do teclado ABSOLUTO - ignora QUALQUER limitação de layout */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: 200, // Aumenta altura do teclado
        paddingHorizontal: 0,
        paddingVertical: 0,
        margin: 0,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        zIndex: 1000 // Z-index alto para ficar sobre tudo
      }}>
        <VirtualKeyboard
          showLabels={true}
          compact={false}
          fullWidth={true}
        />
      </View>

      {/* ESP32 Invisible - sem interface, só funcionalidade */}
      <ESP32Invisible />
    </View>
  );
};

export default TecladoPage;