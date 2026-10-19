/**
 * Utilidad de síntesis de voz (Text-to-Speech) para ICFES MASTER H 2.5
 * Configurado con acento colombiano/latinoamericano (es-CO).
 */

export const handleSpeak = (text: string) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    // Detener cualquier audio previo para que no se encime
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-CO'; // Español con acento natural en español/Latinoamérica
    utterance.rate = 1.0;     // Velocidad normal de lectura
    utterance.pitch = 1.0;    // Tono de voz

    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Lo siento, tu navegador no soporta la reproducción de voz.');
  }
};

export const stopSpeak = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const isSpeaking = (): boolean => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
};
