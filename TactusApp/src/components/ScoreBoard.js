import React from 'react';
import { View, Text } from 'react-native';

/**
 * ScoreBoard - Componente para exibir contadores de performance nos exercícios
 * Compatível com Android e iOS, otimizado para renderização mobile
 */
const ScoreBoard = ({ 
  currentRound = 1,
  totalRounds = 10,
  pontuacao = 0, 
  sequenciaAcertos = 0,
  acertos = 0,
  erros = 0,
  style = {} 
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Rodada atual */}
      <View style={[styles.indicator, styles.roundIndicator]}>
        <Text style={[styles.numberText, styles.roundText]}>
          {String(currentRound || 1)}/{String(totalRounds || 10)}
        </Text>
        <Text style={[styles.labelText, styles.roundLabel]}>
          Rodada
        </Text>
      </View>
      
      {/* Pontuação */}
      <View style={[styles.indicator, styles.scoreIndicator]}>
        <Text style={[styles.numberText, styles.scoreText]}>
          {String(pontuacao || 0)}
        </Text>
        <Text style={[styles.labelText, styles.scoreLabel]}>
          Pontos
        </Text>
      </View>
      
      {/* Sequência de acertos */}
      <View style={[styles.indicator, styles.streakIndicator]}>
        <Text style={[styles.numberText, styles.streakText]}>
          {String(sequenciaAcertos || 0)}
        </Text>
        <Text style={[styles.labelText, styles.streakLabel]}>
          Sequência
        </Text>
      </View>
      
      {/* Acertos (opcional) */}
      {acertos > 0 && (
        <View style={[styles.indicator, styles.correctIndicator]}>
          <Text style={[styles.numberText, styles.correctText]}>
            {String(acertos || 0)}
          </Text>
          <Text style={[styles.labelText, styles.correctLabel]}>
            Acertos
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row', 
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  indicator: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  roundIndicator: {
    borderColor: '#9C27B0'
  },
  scoreIndicator: {
    borderColor: '#2196F3'
  },
  streakIndicator: {
    borderColor: '#FF9800'
  },
  correctIndicator: {
    borderColor: '#4CAF50'
  },
  numberText: {
    fontSize: 20, 
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  roundText: {
    color: '#7B1FA2'
  },
  scoreText: {
    color: '#1565C0'
  },
  streakText: {
    color: '#E65100'
  },
  correctText: {
    color: '#2E7D32'
  },
  labelText: {
    fontSize: 11, 
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 13,
  },
  roundLabel: {
    color: '#7B1FA2'
  },
  scoreLabel: {
    color: '#1565C0'
  },
  streakLabel: {
    color: '#E65100'
  },
  correctLabel: {
    color: '#2E7D32'
  }
};

export default ScoreBoard;
