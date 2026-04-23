/**
 * OmniSign — Phrase Builder
 * Manages the word stack, history, and pre-built quick phrases.
 */

export const QUICK_WORDS = [
  'Hello', 'I', 'You', 'Want', 'Need', 'Help',
  'Thank you', 'Please', 'Yes', 'No', 'Good', 'Bad',
  'More', 'Stop', 'Go', 'Come', 'Here', 'There',
  'Water', 'Food', 'Bathroom', 'Doctor', 'Name', 'Sign',
  'Understand', 'Repeat', 'Slow', 'Fast', 'Sorry', 'Love',
];

export const PRESET_PHRASES = [
  { label: 'Greeting',    words: ['Hello', 'My', 'Name', 'Is'] },
  { label: 'Ask Help',    words: ['Can', 'You', 'Help', 'Me'] },
  { label: 'Thank',       words: ['Thank', 'You', 'Very', 'Much'] },
  { label: 'Emergency',   words: ['I', 'Need', 'Help', 'Now'] },
  { label: 'Understand',  words: ['I', 'Do', 'Not', 'Understand'] },
];

export class PhraseBuilder {
  constructor() {
    this.words   = [];
    this.history = [];
    this.maxHistory = 10;
  }

  add(word) {
    this.words.push(word);
    return this.words;
  }

  undo() {
    this.words.pop();
    return this.words;
  }

  clear() {
    this.words = [];
    return this.words;
  }

  loadPreset(preset) {
    this.words = [...preset.words];
    return this.words;
  }

  get phrase() {
    return this.words.join(' ');
  }

  commit() {
    if (!this.phrase) return;
    this.history.unshift({ text: this.phrase, time: new Date().toLocaleTimeString() });
    if (this.history.length > this.maxHistory) this.history.pop();
  }
}
