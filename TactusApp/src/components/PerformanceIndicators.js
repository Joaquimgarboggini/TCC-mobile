import React from 'react';
import { View, Text, Platform } from 'react-native';

/**
 * Componente reutilizável para exibir indicadores de performance
 * Compatível com Android e iOS
 */
export const PerformanceIndicators = ({ 
  correctAnswers = 0, 
  wrongAnswers = 0, 
  score = 0, 
  streak = 0,
  style = {} 
}) => {
  return (
    <View style={[defaultStyles.container, style]}>
      <View style={[defaultStyles.indicator, defaultStyles.correctIndicator]}>
        <Text style={[defaultStyles.numberText, defaultStyles.correctText]}>
          {String(correctAnswers || 0)}
        </Text>
        <Text style={[defaultStyles.labelText, defaultStyles.correctLabel]}>
          Acertos
        </Text>
      </View>
      
      <View style={[defaultStyles.indicator, defaultStyles.wrongIndicator]}>
        <Text style={[defaultStyles.numberText, defaultStyles.wrongText]}>
          {String(wrongAnswers || 0)}
        </Text>
        <Text style={[defaultStyles.labelText, defaultStyles.wrongLabel]}>
          Erros
        </Text>
      </View>
      
      <View style={[defaultStyles.indicator, defaultStyles.scoreIndicator]}>
        <Text style={[defaultStyles.numberText, defaultStyles.scoreText]}>
          {String(score || 0)}
        </Text>
        <Text style={[defaultStyles.labelText, defaultStyles.scoreLabel]}>
          Pontos
        </Text>
      </View>
      
      <View style={[defaultStyles.indicator, defaultStyles.streakIndicator]}>
        <Text style={[defaultStyles.numberText, defaultStyles.streakText]}>
          {String(streak || 0)}
        </Text>
        <Text style={[defaultStyles.labelText, defaultStyles.streakLabel]}>
          Sequência
        </Text>
      </View>
    </View>
  );
};

const defaultStyles = {
  container: {
    flexDirection: 'row', 
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000000',
    elevation: 5,
  },
  indicator: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginHorizontal: 2,
    borderRadius: 6,
    borderWidth: 2,
  },
  correctIndicator: {
    backgroundColor: '#FFFFFF',
    borderColor: '#4CAF50'
  },
  wrongIndicator: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F44336'
  },
  scoreIndicator: {
    backgroundColor: '#FFFFFF',
    borderColor: '#2196F3'
  },
  streakIndicator: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FF9800'
  },
  numberText: {
    fontSize: 24, 
    fontWeight: '900',
    textAlign: 'center',
    includeFontPadding: false,
  },
  correctText: {
    color: '#2E7D32'
  },
  wrongText: {
    color: '#C62828'
  },
  scoreText: {
    color: '#1565C0'
  },
  streakText: {
    color: '#E65100'
  },
  labelText: {
    fontSize: 10, 
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
    includeFontPadding: false,
  },
  correctLabel: {
    color: '#2E7D32'
  },
  wrongLabel: {
    color: '#C62828'
  },
  scoreLabel: {
    color: '#1565C0'
  },
  streakLabel: {
    color: '#E65100'
  }
};

export default PerformanceIndicators;