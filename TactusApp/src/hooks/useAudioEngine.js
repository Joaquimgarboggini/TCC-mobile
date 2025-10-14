import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

const noteNumberMapping = {
  1: 'C5', 2: 'C#5', 3: 'D5', 4: 'D#5', 5: 'E5', 6: 'F5',
  7: 'F#5', 8: 'G5', 9: 'G#5', 10: 'A5', 11: 'A#5', 12: 'B5',
  13: 'C6', 14: 'C#6', 15: 'D6', 16: 'D#6', 17: 'E6', 18: 'F6',
  19: 'F#6', 20: 'G6', 21: 'G#6', 22: 'A6', 23: 'A#6', 24: 'B6'
};

const instrumentAssets = {
  Piano1: {
    'C5': require('../../assets/Audios/Piano1/Piano1-C5.wav'),
    'C#5': require('../../assets/Audios/Piano1/Piano1-Csharp5.wav'),
    'D5': require('../../assets/Audios/Piano1/Piano1-D5.wav'),
    'D#5': require('../../assets/Audios/Piano1/Piano1-Dsharp5.wav'),
    'E5': require('../../assets/Audios/Piano1/Piano1-E5.wav'),
    'F5': require('../../assets/Audios/Piano1/Piano1-F5.wav'),
    'F#5': require('../../assets/Audios/Piano1/Piano1-Fsharp5.wav'),
    'G5': require('../../assets/Audios/Piano1/Piano1-G5.wav'),
    'G#5': require('../../assets/Audios/Piano1/Piano1-Gsharp5.wav'),
    'A5': require('../../assets/Audios/Piano1/Piano1-A5.wav'),
    'A#5': require('../../assets/Audios/Piano1/Piano1-Asharp5.wav'),
    'B5': require('../../assets/Audios/Piano1/Piano1-B5.wav'),
    'C6': require('../../assets/Audios/Piano1/Piano1-C6.wav'),
    'C#6': require('../../assets/Audios/Piano1/Piano1-Csharp6.wav'),
    'D6': require('../../assets/Audios/Piano1/Piano1-D6.wav'),
    'D#6': require('../../assets/Audios/Piano1/Piano1-Dsharp6.wav'),
    'E6': require('../../assets/Audios/Piano1/Piano1-E6.wav'),
    'F6': require('../../assets/Audios/Piano1/Piano1-F6.wav'),
    'F#6': require('../../assets/Audios/Piano1/Piano1-Fsharp6.wav'),
    'G6': require('../../assets/Audios/Piano1/Piano1-G6.wav'),
    'G#6': require('../../assets/Audios/Piano1/Piano1-Gsharp6.wav'),
    'A6': require('../../assets/Audios/Piano1/Piano1-A6.wav'),
    'A#6': require('../../assets/Audios/Piano1/Piano1-Asharp6.wav'),
    'B6': require('../../assets/Audios/Piano1/Piano1-B6.wav'),
  },
  Keys1: {
    'C5': require('../../assets/Audios/Keys1/Keys1 (1).wav'),
    'C#5': require('../../assets/Audios/Keys1/Keys1 (2).wav'),
    'D5': require('../../assets/Audios/Keys1/Keys1 (3).wav'),
    'D#5': require('../../assets/Audios/Keys1/Keys1 (4).wav'),
    'E5': require('../../assets/Audios/Keys1/Keys1 (5).wav'),
    'F5': require('../../assets/Audios/Keys1/Keys1 (6).wav'),
    'F#5': require('../../assets/Audios/Keys1/Keys1 (7).wav'),
    'G5': require('../../assets/Audios/Keys1/Keys1 (8).wav'),
    'G#5': require('../../assets/Audios/Keys1/Keys1 (9).wav'),
    'A5': require('../../assets/Audios/Keys1/Keys1 (10).wav'),
    'A#5': require('../../assets/Audios/Keys1/Keys1 (11).wav'),
    'B5': require('../../assets/Audios/Keys1/Keys1 (12).wav'),
    'C6': require('../../assets/Audios/Keys1/Keys1 (13).wav'),
    'C#6': require('../../assets/Audios/Keys1/Keys1 (14).wav'),
    'D6': require('../../assets/Audios/Keys1/Keys1 (15).wav'),
    'D#6': require('../../assets/Audios/Keys1/Keys1 (16).wav'),
    'E6': require('../../assets/Audios/Keys1/Keys1 (17).wav'),
    'F6': require('../../assets/Audios/Keys1/Keys1 (18).wav'),
    'F#6': require('../../assets/Audios/Keys1/Keys1 (19).wav'),
    'G6': require('../../assets/Audios/Keys1/Keys1 (20).wav'),
    'G#6': require('../../assets/Audios/Keys1/Keys1 (21).wav'),
    'A6': require('../../assets/Audios/Keys1/Keys1 (22).wav'),
    'A#6': require('../../assets/Audios/Keys1/Keys1 (23).wav'),
    'B6': require('../../assets/Audios/Keys1/Keys1 (24).wav'),
  },
  Keys2: {
    'C5': require('../../assets/Audios/Keys2/Keys2 (1).wav'),
    'C#5': require('../../assets/Audios/Keys2/Keys2 (2).wav'),
    'D5': require('../../assets/Audios/Keys2/Keys2 (3).wav'),
    'D#5': require('../../assets/Audios/Keys2/Keys2 (4).wav'),
    'E5': require('../../assets/Audios/Keys2/Keys2 (5).wav'),
    'F5': require('../../assets/Audios/Keys2/Keys2 (6).wav'),
    'F#5': require('../../assets/Audios/Keys2/Keys2 (7).wav'),
    'G5': require('../../assets/Audios/Keys2/Keys2 (8).wav'),
    'G#5': require('../../assets/Audios/Keys2/Keys2 (9).wav'),
    'A5': require('../../assets/Audios/Keys2/Keys2 (10).wav'),
    'A#5': require('../../assets/Audios/Keys2/Keys2 (11).wav'),
    'B5': require('../../assets/Audios/Keys2/Keys2 (12).wav'),
    'C6': require('../../assets/Audios/Keys2/Keys2 (13).wav'),
    'C#6': require('../../assets/Audios/Keys2/Keys2 (14).wav'),
    'D6': require('../../assets/Audios/Keys2/Keys2 (15).wav'),
    'D#6': require('../../assets/Audios/Keys2/Keys2 (16).wav'),
    'E6': require('../../assets/Audios/Keys2/Keys2 (17).wav'),
    'F6': require('../../assets/Audios/Keys2/Keys2 (18).wav'),
    'F#6': require('../../assets/Audios/Keys2/Keys2 (19).wav'),
    'G6': require('../../assets/Audios/Keys2/Keys2 (20).wav'),
    'G#6': require('../../assets/Audios/Keys2/Keys2 (21).wav'),
    'A6': require('../../assets/Audios/Keys2/Keys2 (22).wav'),
    'A#6': require('../../assets/Audios/Keys2/Keys2 (23).wav'),
    'B6': require('../../assets/Audios/Keys2/Keys2 (24).wav'),
  },
  Keys3: {
    'C5': require('../../assets/Audios/Keys3/Keys3 (1).wav'),
    'C#5': require('../../assets/Audios/Keys3/Keys3 (2).wav'),
    'D5': require('../../assets/Audios/Keys3/Keys3 (3).wav'),
    'D#5': require('../../assets/Audios/Keys3/Keys3 (4).wav'),
    'E5': require('../../assets/Audios/Keys3/Keys3 (5).wav'),
    'F5': require('../../assets/Audios/Keys3/Keys3 (6).wav'),
    'F#5': require('../../assets/Audios/Keys3/Keys3 (7).wav'),
    'G5': require('../../assets/Audios/Keys3/Keys3 (8).wav'),
    'G#5': require('../../assets/Audios/Keys3/Keys3 (9).wav'),
    'A5': require('../../assets/Audios/Keys3/Keys3 (10).wav'),
    'A#5': require('../../assets/Audios/Keys3/Keys3 (11).wav'),
    'B5': require('../../assets/Audios/Keys3/Keys3 (12).wav'),
    'C6': require('../../assets/Audios/Keys3/Keys3 (13).wav'),
    'C#6': require('../../assets/Audios/Keys3/Keys3 (14).wav'),
    'D6': require('../../assets/Audios/Keys3/Keys3 (15).wav'),
    'D#6': require('../../assets/Audios/Keys3/Keys3 (16).wav'),
    'E6': require('../../assets/Audios/Keys3/Keys3 (17).wav'),
    'F6': require('../../assets/Audios/Keys3/Keys3 (18).wav'),
    'F#6': require('../../assets/Audios/Keys3/Keys3 (19).wav'),
    'G6': require('../../assets/Audios/Keys3/Keys3 (20).wav'),
    'G#6': require('../../assets/Audios/Keys3/Keys3 (21).wav'),
    'A6': require('../../assets/Audios/Keys3/Keys3 (22).wav'),
    'A#6': require('../../assets/Audios/Keys3/Keys3 (23).wav'),
    'B6': require('../../assets/Audios/Keys3/Keys3 (24).wav'),
  },
  Lead1: {
    'C5': require('../../assets/Audios/Lead1/Lead1 (1).wav'),
    'C#5': require('../../assets/Audios/Lead1/Lead1 (2).wav'),
    'D5': require('../../assets/Audios/Lead1/Lead1 (3).wav'),
    'D#5': require('../../assets/Audios/Lead1/Lead1 (4).wav'),
    'E5': require('../../assets/Audios/Lead1/Lead1 (5).wav'),
    'F5': require('../../assets/Audios/Lead1/Lead1 (6).wav'),
    'F#5': require('../../assets/Audios/Lead1/Lead1 (7).wav'),
    'G5': require('../../assets/Audios/Lead1/Lead1 (8).wav'),
    'G#5': require('../../assets/Audios/Lead1/Lead1 (9).wav'),
    'A5': require('../../assets/Audios/Lead1/Lead1 (10).wav'),
    'A#5': require('../../assets/Audios/Lead1/Lead1 (11).wav'),
    'B5': require('../../assets/Audios/Lead1/Lead1 (12).wav'),
    'C6': require('../../assets/Audios/Lead1/Lead1 (13).wav'),
    'C#6': require('../../assets/Audios/Lead1/Lead1 (14).wav'),
    'D6': require('../../assets/Audios/Lead1/Lead1 (15).wav'),
    'D#6': require('../../assets/Audios/Lead1/Lead1 (16).wav'),
    'E6': require('../../assets/Audios/Lead1/Lead1 (17).wav'),
    'F6': require('../../assets/Audios/Lead1/Lead1 (18).wav'),
    'F#6': require('../../assets/Audios/Lead1/Lead1 (19).wav'),
    'G6': require('../../assets/Audios/Lead1/Lead1 (20).wav'),
    'G#6': require('../../assets/Audios/Lead1/Lead1 (21).wav'),
    'A6': require('../../assets/Audios/Lead1/Lead1 (22).wav'),
    'A#6': require('../../assets/Audios/Lead1/Lead1 (23).wav'),
    'B6': require('../../assets/Audios/Lead1/Lead1 (24).wav'),
  },
  Lead2: {
    'C5': require('../../assets/Audios/Lead2/Lead2 (1).wav'),
    'C#5': require('../../assets/Audios/Lead2/Lead2 (2).wav'),
    'D5': require('../../assets/Audios/Lead2/Lead2 (3).wav'),
    'D#5': require('../../assets/Audios/Lead2/Lead2 (4).wav'),
    'E5': require('../../assets/Audios/Lead2/Lead2 (5).wav'),
    'F5': require('../../assets/Audios/Lead2/Lead2 (6).wav'),
    'F#5': require('../../assets/Audios/Lead2/Lead2 (7).wav'),
    'G5': require('../../assets/Audios/Lead2/Lead2 (8).wav'),
    'G#5': require('../../assets/Audios/Lead2/Lead2 (9).wav'),
    'A5': require('../../assets/Audios/Lead2/Lead2 (10).wav'),
    'A#5': require('../../assets/Audios/Lead2/Lead2 (11).wav'),
    'B5': require('../../assets/Audios/Lead2/Lead2 (12).wav'),
    'C6': require('../../assets/Audios/Lead2/Lead2 (13).wav'),
    'C#6': require('../../assets/Audios/Lead2/Lead2 (14).wav'),
    'D6': require('../../assets/Audios/Lead2/Lead2 (15).wav'),
    'D#6': require('../../assets/Audios/Lead2/Lead2 (16).wav'),
    'E6': require('../../assets/Audios/Lead2/Lead2 (17).wav'),
    'F6': require('../../assets/Audios/Lead2/Lead2 (18).wav'),
    'F#6': require('../../assets/Audios/Lead2/Lead2 (19).wav'),
    'G6': require('../../assets/Audios/Lead2/Lead2 (20).wav'),
    'G#6': require('../../assets/Audios/Lead2/Lead2 (21).wav'),
    'A6': require('../../assets/Audios/Lead2/Lead2 (22).wav'),
    'A#6': require('../../assets/Audios/Lead2/Lead2 (23).wav'),
    'B6': require('../../assets/Audios/Lead2/Lead2 (24).wav'),
  },
  Lead3: {
    'C5': require('../../assets/Audios/Lead3/lead3 (1).wav'),
    'C#5': require('../../assets/Audios/Lead3/lead3 (2).wav'),
    'D5': require('../../assets/Audios/Lead3/lead3 (3).wav'),
    'D#5': require('../../assets/Audios/Lead3/lead3 (4).wav'),
    'E5': require('../../assets/Audios/Lead3/lead3 (5).wav'),
    'F5': require('../../assets/Audios/Lead3/lead3 (6).wav'),
    'F#5': require('../../assets/Audios/Lead3/lead3 (7).wav'),
    'G5': require('../../assets/Audios/Lead3/lead3 (8).wav'),
    'G#5': require('../../assets/Audios/Lead3/lead3 (9).wav'),
    'A5': require('../../assets/Audios/Lead3/lead3 (10).wav'),
    'A#5': require('../../assets/Audios/Lead3/lead3 (11).wav'),
    'B5': require('../../assets/Audios/Lead3/lead3 (12).wav'),
    'C6': require('../../assets/Audios/Lead3/lead3 (13).wav'),
    'C#6': require('../../assets/Audios/Lead3/lead3 (14).wav'),
    'D6': require('../../assets/Audios/Lead3/lead3 (15).wav'),
    'D#6': require('../../assets/Audios/Lead3/lead3 (16).wav'),
    'E6': require('../../assets/Audios/Lead3/lead3 (17).wav'),
    'F6': require('../../assets/Audios/Lead3/lead3 (18).wav'),
    'F#6': require('../../assets/Audios/Lead3/lead3 (19).wav'),
    'G6': require('../../assets/Audios/Lead3/lead3 (20).wav'),
    'G#6': require('../../assets/Audios/Lead3/lead3 (21).wav'),
    'A6': require('../../assets/Audios/Lead3/lead3 (22).wav'),
    'A#6': require('../../assets/Audios/Lead3/lead3 (23).wav'),
    'B6': require('../../assets/Audios/Lead3/lead3 (24).wav'),
  },
};

const useAudioEngine = () => {
  const [isReady, setIsReady] = useState(false);
  const soundObjectsRef = useRef({});

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log('AudioEngine: [' + timestamp + '] ' + message);
  };

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });

        addLog('Audio configurado com sucesso');
        setIsReady(true);
      } catch (error) {
        addLog('Erro ao configurar audio: ' + error.message);
      }
    };

    setupAudio();
  }, []);

  const playNote = async (note, instrument = 'Piano1') => {
    if (!isReady) {
      addLog('AudioEngine nao esta pronto ainda');
      return;
    }

    try {
      if (!instrumentAssets[instrument]) {
        addLog('Instrumento ' + instrument + ' nao encontrado');
        return;
      }

      const soundUri = instrumentAssets[instrument][note];
      if (!soundUri) {
        addLog('Nota ' + note + ' nao encontrada para instrumento ' + instrument);
        return;
      }

      const timestamp = Date.now();
      const soundKey = instrument + '_' + note + '_' + timestamp;
      
      const { sound } = await Audio.Sound.createAsync(soundUri, {
        shouldPlay: true,
        isLooping: false,
        rate: 1.0,
        volume: 0.8,
        progressUpdateIntervalMillis: 100,
      });

      soundObjectsRef.current[soundKey] = sound;

      addLog('Tocando ' + note + ' com ' + instrument + ' (arquivo especifico - qualidade perfeita)');

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
          delete soundObjectsRef.current[soundKey];
          addLog('Som ' + note + ' (' + instrument + ') finalizou naturalmente');
        }
      });

    } catch (error) {
      addLog('Erro ao tocar nota ' + note + ' com ' + instrument + ': ' + error.message);
    }
  };

  const stopNote = async (note, instrument = 'Piano1') => {
    addLog('StopNote chamado para ' + note + ' (' + instrument + '), mas som continuara tocando ate o final');
  };

  const stopAllSounds = async () => {
    const soundKeys = Object.keys(soundObjectsRef.current);
    
    for (const soundKey of soundKeys) {
      try {
        await soundObjectsRef.current[soundKey].stopAsync();
        await soundObjectsRef.current[soundKey].unloadAsync();
        delete soundObjectsRef.current[soundKey];
      } catch (error) {
        addLog('Erro ao parar som ' + soundKey + ': ' + error.message);
      }
    }
    
    addLog('Todos os sons foram parados');
  };

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
    instrumentAssets,
    noteNumberMapping,
  };
};

export default useAudioEngine;
