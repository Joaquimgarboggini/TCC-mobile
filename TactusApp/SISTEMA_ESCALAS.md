# Sistema de Escalas Musicais - TactusApp

## Visão Geral

Este sistema permite que qualquer página do projeto tenha acesso à escala musical selecionada nas configurações e ao mapeamento das teclas QWER YUIO para as notas correspondentes.

## Funcionalidades Implementadas

### 1. Context Global (ScaleContext)
- **Escala selecionada**: Compartilhada em todo o projeto
- **Notas da escala**: Array com as 8 notas da escala atual
- **Mapeamento de teclas**: Objeto que relaciona cada tecla (Q,W,E,R,Y,U,I,O) à sua nota correspondente
- **Função getNoteFromKey**: Retorna a nota correspondente a uma tecla pressionada

### 2. Escalas Disponíveis
**Escalas Maiores:**
- C Maior, D Maior, E Maior, F Maior, G Maior, A Maior, B Maior

**Escalas Menores:**
- C Menor, D Menor, E Menor, F Menor, G Menor, A Menor, B Menor

### 3. Mapeamento de Teclas
```
Q W E R Y U I O
↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
1ª 2ª 3ª 4ª 5ª 6ª 7ª 8ª nota da escala
```

## Como Usar em Qualquer Página

### 1. Importar o Context
```javascript
import React, { useContext } from 'react';
import { ScaleContext } from '../context/ScaleContext';
```

### 2. Usar o Hook
```javascript
const MyComponent = () => {
  const { 
    selectedScale,     // Escala atual (ex: "C Maior")
    scaleNotes,        // Array de notas (ex: ["C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6"])
    keyMapping,        // Objeto {Q: "C5", W: "D5", E: "E5", ...}
    getNoteFromKey,    // Função para obter nota da tecla
    setSelectedScale,  // Função para mudar escala (use apenas em configurações)
    availableScales    // Array com todas as escalas disponíveis
  } = useContext(ScaleContext);

  // Exemplo de uso: detectar tecla pressionada
  const handleKeyPress = (key) => {
    const note = getNoteFromKey(key.toUpperCase());
    if (note) {
      console.log(`Tecla ${key} = Nota ${note}`);
      // Tocar a nota, mostrar feedback visual, etc.
    }
  };

  return (
    // Seu componente aqui
  );
};
```

### 3. Exemplo Prático: Detectar Teclas do Teclado
```javascript
useEffect(() => {
  const handleKeyDown = (event) => {
    const key = event.key.toUpperCase();
    const note = getNoteFromKey(key);
    
    if (note) {
      console.log(`Tecla ${key} pressionada = Nota ${note}`);
      // Aqui você pode:
      // - Tocar o som da nota
      // - Mostrar feedback visual
      // - Registrar a nota tocada
      // - Etc.
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}, [getNoteFromKey]);
```

## Exemplos de Implementação

### 1. TecladoPage.js
Demonstra como criar um teclado virtual que responde à escala selecionada.

### 2. KeyboardListener.js
Componente exemplo que mostra todas as informações do sistema em tempo real.

### 3. Configuracoes.js
Página onde o usuário seleciona a escala, que é automaticamente propagada para todo o projeto.

## Fluxo de Funcionamento

1. **Usuário seleciona escala** na página de Configurações
2. **ScaleContext atualiza** automaticamente:
   - `selectedScale`
   - `scaleNotes` 
   - `keyMapping`
3. **Todas as páginas** que usam o context recebem as atualizações instantaneamente
4. **Teclas QWER YUIO** agora correspondem às notas da nova escala
5. **Qualquer página** pode usar `getNoteFromKey()` para saber qual nota corresponde a uma tecla

## Benefícios

- ✅ **Estado global**: Uma única fonte de verdade para a escala selecionada
- ✅ **Reatividade**: Mudanças se propagam automaticamente para todo o app
- ✅ **Simplicidade**: API fácil de usar em qualquer componente
- ✅ **Flexibilidade**: Suporte a escalas maiores e menores
- ✅ **Performance**: Context otimizado com memoização automática

## Próximos Passos

Para implementar a detecção de teclas físicas do teclado:

1. Adicionar listener global de teclado no componente principal
2. Usar a função `getNoteFromKey()` para converter teclas em notas
3. Integrar com sistema de áudio para tocar as notas
4. Adicionar feedback visual quando teclas são pressionadas