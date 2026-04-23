/**
 * OmniSign — Speech Module
 * Thin wrapper around the Web Speech API.
 */

export function speak(text, { rate = 0.9, pitch = 1, onStart, onEnd } = {}) {
  if (!window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const utt      = new SpeechSynthesisUtterance(text);
  utt.rate       = rate;
  utt.pitch      = pitch;
  utt.onstart    = onStart;
  utt.onend      = onEnd;
  window.speechSynthesis.speak(utt);
}

export function cancelSpeech() {
  window.speechSynthesis?.cancel();
}

export function isSpeechSupported() {
  return 'speechSynthesis' in window;
}
