/**
 * Classe para gerenciar contadores de performance em exercícios
 * Permite controlar acertos, erros, pontuação e streak de forma consistente
 */
export class PerformanceCounter {
  constructor(config = {}) {
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.score = 0;
    this.streak = 0;
    
    // Configurações personalizáveis
    this.config = {
      basePoints: config.basePoints || 5,        // Pontos base por acerto
      streakBonus: config.streakBonus || true,   // Se streak adiciona bonus
      errorPenalty: config.errorPenalty || 2,    // Pontos perdidos por erro
      minScore: config.minScore || 0,            // Pontuação mínima
      maxStreak: config.maxStreak || 50,         // Streak máximo
      ...config
    };
    
    // Callbacks para notificar mudanças
    this.onUpdate = null;
  }

  /**
   * Registra um acerto
   * @param {Object} options - Opções para o acerto
   * @param {number} options.customPoints - Pontos customizados (sobrescreve cálculo padrão)
   * @returns {Object} Resultado do acerto com pontos ganhos
   */
  registerCorrect(options = {}) {
    this.correctAnswers++;
    this.streak = Math.min(this.streak + 1, this.config.maxStreak);
    
    // Calcular pontos
    let points;
    if (options.customPoints !== undefined) {
      points = options.customPoints;
    } else {
      points = this.config.basePoints;
      if (this.config.streakBonus) {
        points += Math.min(this.streak - 1, 10); // Bonus máximo de 10 por streak
      }
    }
    
    this.score += points;
    
    const result = {
      type: 'correct',
      points,
      totalScore: this.score,
      streak: this.streak,
      correctAnswers: this.correctAnswers
    };
    
    this._notifyUpdate(result);
    return result;
  }

  /**
   * Registra um erro
   * @param {Object} options - Opções para o erro
   * @param {number} options.customPenalty - Penalidade customizada
   * @returns {Object} Resultado do erro com pontos perdidos
   */
  registerWrong(options = {}) {
    this.wrongAnswers++;
    this.streak = 0;
    
    // Calcular penalidade
    const penalty = options.customPenalty !== undefined 
      ? options.customPenalty 
      : this.config.errorPenalty;
    
    this.score = Math.max(this.config.minScore, this.score - penalty);
    
    const result = {
      type: 'wrong',
      penalty,
      totalScore: this.score,
      streak: this.streak,
      wrongAnswers: this.wrongAnswers
    };
    
    this._notifyUpdate(result);
    return result;
  }

  /**
   * Reseta todos os contadores
   */
  reset() {
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.score = 0;
    this.streak = 0;
    
    this._notifyUpdate({
      type: 'reset',
      correctAnswers: 0,
      wrongAnswers: 0,
      score: 0,
      streak: 0
    });
  }

  /**
   * Retorna o estado atual dos contadores
   * @returns {Object} Estado atual
   */
  getState() {
    return {
      correctAnswers: this.correctAnswers,
      wrongAnswers: this.wrongAnswers,
      score: this.score,
      streak: this.streak,
      total: this.correctAnswers + this.wrongAnswers,
      accuracy: this.getTotalAnswers() > 0 
        ? (this.correctAnswers / this.getTotalAnswers() * 100).toFixed(1)
        : 0
    };
  }

  /**
   * Retorna o total de respostas
   * @returns {number} Total de respostas
   */
  getTotalAnswers() {
    return this.correctAnswers + this.wrongAnswers;
  }

  /**
   * Define callback para ser notificado de mudanças
   * @param {Function} callback - Função a ser chamada nas mudanças
   */
  setUpdateCallback(callback) {
    this.onUpdate = callback;
  }

  /**
   * Notifica sobre mudanças nos contadores
   * @private
   */
  _notifyUpdate(result) {
    if (this.onUpdate && typeof this.onUpdate === 'function') {
      this.onUpdate(result, this.getState());
    }
  }

  /**
   * Cria mensagem de feedback baseada no resultado
   * @param {Object} result - Resultado do registerCorrect ou registerWrong
   * @param {string} correctAnswer - Resposta correta (para casos de erro)
   * @returns {string} Mensagem de feedback
   */
  getFeedbackMessage(result, correctAnswer = '') {
    if (result.type === 'correct') {
      const messages = [
        `✅ Correto! +${String(result.points || 0)} pontos`,
        `🎯 Acertou! +${String(result.points || 0)} pontos`,
        `👍 Muito bem! +${String(result.points || 0)} pontos`,
        `⭐ Excelente! +${String(result.points || 0)} pontos`
      ];
      
      if (result.streak > 5) {
        return `🔥 Sequência de ${String(result.streak || 0)}! +${String(result.points || 0)} pontos`;
      }
      
      return messages[Math.min(Math.floor(result.streak / 2), messages.length - 1)];
    } else {
      const penaltyText = result.penalty > 0 ? ` -${String(result.penalty || 0)} pontos` : '';
      const answerText = correctAnswer ? ` A resposta era ${String(correctAnswer)}.` : '';
      return `❌ Incorreto!${answerText}${penaltyText}`;
    }
  }
}

/**
 * Factory function para criar um PerformanceCounter com configuração padrão
 * @param {Object} config - Configuração personalizada
 * @returns {PerformanceCounter} Nova instância
 */
export function createPerformanceCounter(config = {}) {
  return new PerformanceCounter(config);
}

/**
 * Hook React para usar PerformanceCounter com estado
 * @param {Object} config - Configuração do contador
 * @returns {Object} Objeto com counter e estado
 */
import { useState, useCallback, useRef, useEffect } from 'react';

export function usePerformanceCounter(config = {}) {
  const counterRef = useRef(null);
  const [state, setState] = useState({
    correctAnswers: 0,
    wrongAnswers: 0,
    score: 0,
    streak: 0,
    total: 0,
    accuracy: 0
  });

  // Inicializar counter na primeira renderização
  useEffect(() => {
    if (!counterRef.current) {
      counterRef.current = new PerformanceCounter(config);
      counterRef.current.setUpdateCallback((result, newState) => {
        setState(newState);
      });
    }
  }, []);

  const registerCorrect = useCallback((options = {}) => {
    return counterRef.current?.registerCorrect(options);
  }, []);

  const registerWrong = useCallback((options = {}) => {
    return counterRef.current?.registerWrong(options);
  }, []);

  const reset = useCallback(() => {
    counterRef.current?.reset();
  }, []);

  const getFeedbackMessage = useCallback((result, correctAnswer = '') => {
    return counterRef.current?.getFeedbackMessage(result, correctAnswer);
  }, []);

  return {
    state,
    registerCorrect,
    registerWrong,
    reset,
    getFeedbackMessage,
    counter: counterRef.current
  };
}