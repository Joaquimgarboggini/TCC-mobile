// Função para mapear notas para teclas QWERTY
export const notes = [
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
  'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6'
];

// Teclas QWERTY (24 teclas)
export const qwertyKeys = [
  'Q','W','E','R','T','Y','U','I','O','P','A','S',
  'D','F','G','H','J','K','L','Z','X','C','V','B'
];

// Relaciona cada nota a uma tecla QWERTY
export const noteToKey = notes.reduce((acc, note, idx) => {
  acc[note] = qwertyKeys[idx];
  return acc;
}, {});

// Relaciona cada tecla QWERTY a uma nota
export const keyToNote = qwertyKeys.reduce((acc, key, idx) => {
  acc[key] = notes[idx];
  return acc;
}, {});