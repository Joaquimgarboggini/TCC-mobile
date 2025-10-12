import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

/**
 * Sistema de áudio com pitch shifting para TactusApp
 * 
 * LIMITAÇÃO CONHECIDA: expo-av não suporta time-stretching independente
 * 
 * Quando você aumenta o 'rate' para fazer pitch shifting, o áudio também acelera,
 * encurtando sua duração. Isso é uma limitação da biblioteca expo-av.
 * 
 * SOLUÇÕES IMPLEMENTADAS:
 * 1. Pitch limitado a 2.0x para evitar encurtamento excessivo
 * 2. Compensação de volume para notas agudas
 * 3. Tabela de pitch mais conservadora
 * 4. Som natural sem repetições artificiais
 * 
 * SOLUÇÕES ALTERNATIVAS (não implementadas devido à complexidade):
 * - FFmpeg com time-stretching nativo
 * - Múltiplos arquivos pré-processados para cada nota
 * - Web Audio API (apenas web)
 */

// Mapeamento estático dos arquivos de áudio
const audioAssets = {
  'Piano1': require('../../assets/audios/Piano1.wav'),
  'Keys1': require('../../assets/audios/Keys1.wav'),
  'Keys2': require('../../assets/audios/Keys2.wav'),
  'Keys3': require('../../assets/audios/Keys3.wav'),
  'Lead1': require('../../assets/audios/Lead1.wav'),
  'Lead2': require('../../assets/audios/Lead2.wav'),
  'Lead3': require('../../assets/audios/Lead3.wav'),
  'E-Guitar1': require('../../assets/audios/E-Guitar1.wav'),
  'E-Guitar2': require('../../assets/audios/E-Guitar2.wav'),
  'E-Guitar3': require('../../assets/audios/E-Guitar3.wav'),
};

const useAudioEngine = () => {
  const [isReady, setIsReady] = useState(false);
  const soundObjectsRef = useRef({});

  // Tabela de pitch shifts para cada nota
  // C5 é a base (1.0), outras notas são relativas
  // NOTA: Valores mais conservadores para minimizar encurtamento excessivo
  const pitchTable = {
    'C5': 1.0,      // Base (Dó5)
    'C#5': 1.050,   // Dó# (reduzido de 1.059)
    'D5': 1.100,    // Ré (reduzido de 1.122)
    'D#5': 1.150,   // Ré# (reduzido de 1.189)
    'E5': 1.200,    // Mi (reduzido de 1.260)
    'F5': 1.250,    // Fá (reduzido de 1.335)
    'F#5': 1.300,   // Fá# (reduzido de 1.414)
    'G5': 1.350,    // Sol (reduzido de 1.498)
    'G#5': 1.400,   // Sol# (reduzido de 1.587)
    'A5': 1.450,    // Lá (reduzido de 1.682)
    'A#5': 1.500,   // Lá# (reduzido de 1.782)
    'B5': 1.550,    // Si (reduzido de 1.888)
    'C6': 1.600,    // Dó6 (reduzido de 2.0)
    'C#6': 1.650,   // Dó#6
    'D6': 1.700,    // Ré6
    'D#6': 1.750,   // Ré#6
    'E6': 1.800,    // Mi6
    'F6': 1.850,    // Fá6
    'F#6': 1.900,   // Fá#6
    'G6': 1.950,    // Sol6
    'G#6': 2.000,   // Sol#6
    'A6': 2.050,    // Lá6
    'A#6': 2.100,   // Lá#6
    'B6': 2.150     // Si6
  };

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`🎵 AudioEngine: [${timestamp}] ${message}`);
  };

  // Configurar áudio no início
  useEffect(() => {
    const setupAudio = async () => {
      try {
        // Configurar modo de áudio para permitir reprodução simultânea
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });

        addLog('Áudio configurado com sucesso');
        setIsReady(true);
      } catch (error) {
        addLog(`Erro ao configurar áudio: ${error.message}`);
      }
    };

    setupAudio();
  }, []);

  // Função para tocar uma nota com pitch shifting
  const playNote = async (note, instrument = 'Piano1') => {
    if (!isReady) {
      addLog('AudioEngine não está pronto ainda');
      return;
    }

    try {
      const pitch = pitchTable[note];
      if (!pitch) {
        addLog(`Nota ${note} não encontrada na tabela de pitch`);
        return;
      }

      // Verificar se o instrumento existe
      const soundUri = audioAssets[instrument];
      if (!soundUri) {
        addLog(`Instrumento ${instrument} não encontrado`);
        return;
      }

      // Criar chave única para o som baseada em timestamp para permitir múltiplos sons da mesma nota
      const timestamp = Date.now();
      const soundKey = `${instrument}_${note}_${timestamp}`;
      
      // LIMITAÇÃO: expo-av não suporta time-stretching independente
      // Aumentar o 'rate' acelera o áudio, reduzindo sua duração
      // Soluções possíveis:
      // 1. Aceitar o encurtamento (atual)
      // 2. Usar múltiplos arquivos pré-processados
      // 3. Implementar FFmpeg nativo (complexo)
      
      // Para minimizar o problema, usamos pitch mais conservador e ajustamos volume
      const adjustedPitch = Math.min(pitch, 2.0); // Limitar pitch máximo
      const volumeCompensation = Math.max(0.4, 1.0 - (adjustedPitch - 1.0) * 0.4);
      
      // Carregar novo som usando mapeamento estático
      // NOTA: No expo-av, aumentar o 'rate' também acelera a velocidade, encurtando a duração
      // Isso é uma limitação da biblioteca - não suporta time-stretching independente
      const { sound } = await Audio.Sound.createAsync(soundUri, {
        shouldPlay: true, // Tocar imediatamente para evitar som duplo
        isLooping: false, // Remover loop - deixar som natural
        rate: adjustedPitch, // Aplicar pitch shift limitado
        volume: volumeCompensation, // Ajustar volume para compensar
        progressUpdateIntervalMillis: 100,
      });

      soundObjectsRef.current[soundKey] = sound;

      // Som já está tocando devido a shouldPlay: true
      addLog(`Tocando ${note} com pitch ${adjustedPitch.toFixed(3)} (${instrument}) - Som natural`);

      // Limpar após terminar naturalmente
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
          delete soundObjectsRef.current[soundKey];
          addLog(`Som ${note} finalizou naturalmente`);
        }
      });

    } catch (error) {
      addLog(`Erro ao tocar nota ${note}: ${error.message}`);
    }
  };

  // Função para parar uma nota específica - MODIFICADA: não para mais os sons
  const stopNote = async (note, instrument = 'Piano1') => {
    // Som continuará tocando até o final naturalmente
    addLog(`StopNote chamado para ${note}, mas som continuará tocando até o final`);
  };

  // Função para parar todos os sons
  const stopAllSounds = async () => {
    const soundKeys = Object.keys(soundObjectsRef.current);
    
    for (const soundKey of soundKeys) {
      try {
        await soundObjectsRef.current[soundKey].stopAsync();
        await soundObjectsRef.current[soundKey].unloadAsync();
        delete soundObjectsRef.current[soundKey];
      } catch (error) {
        addLog(`Erro ao parar som ${soundKey}: ${error.message}`);
      }
    }
    
    addLog('Todos os sons foram parados');
  };

  // Limpar sons ao desmontar
  useEffect(() => {
    return () => {
      stopAllSounds();
    };
  }, []);

  return {
    isReady,
    playNote,
    stopNote,
    stopAllSounds,
    pitchTable
  };
};

export default useAudioEngine;