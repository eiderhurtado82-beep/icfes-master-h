/**
 * Utilidad de síntesis de voz (Text-to-Speech) para ICFES MASTER H 2.5
 * Configuración optimizada con voz masculina en español (Tutor Eider).
 */

const findMaleSpanishVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
  // Filtrar todas las voces disponibles en español
  const spanishVoices = voices.filter((v) => v.lang.startsWith('es'));

  // Buscar una voz masculina explícita por nombre o palabras clave
  const maleVoice = spanishVoices.find((v) => {
    const name = v.name.toLowerCase();
    return (
      name.includes('male') ||
      name.includes('masculino') ||
      name.includes('pablo') ||
      name.includes('jorge') ||
      name.includes('diego') ||
      name.includes('carlos') ||
      name.includes('alberto') ||
      name.includes('raul') ||
      name.includes('felipe')
    );
  });

  if (maleVoice) {
    return maleVoice;
  }

  // Si no hay una explícitamente masculina, filtramos las que claramente son femeninas
  if (spanishVoices.length > 0) {
    const neutralOrMaleVoice = spanishVoices.find((v) => {
      const name = v.name.toLowerCase();
      return (
        !name.includes('female') &&
        !name.includes('femenina') &&
        !name.includes('helena') &&
        !name.includes('laura') &&
        !name.includes('mónica') &&
        !name.includes('sofia') &&
        !name.includes('lucia') &&
        !name.includes('zira')
      );
    });
    return neutralOrMaleVoice || spanishVoices[0];
  }

  return null;
};

export const handleSpeak = (text: string) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    // Detener cualquier audio previo
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 0.95; // Tono un poco más grave para acentuar el registro masculino
    utterance.lang = 'es-CO';

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = findMaleSpanishVoice(voices);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      window.speechSynthesis.speak(utterance);
    } else {
      // Si las voces aún no están cargadas en el navegador, escuchar el evento
      window.speechSynthesis.onvoiceschanged = () => {
        const loadedVoices = window.speechSynthesis.getVoices();
        const voice = findMaleSpanishVoice(loadedVoices);
        if (voice) {
          utterance.voice = voice;
        }
        window.speechSynthesis.speak(utterance);
      };
      // Fallback inmediato en caso de que onvoiceschanged no dispare
      window.speechSynthesis.speak(utterance);
    }
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
