/**
 * Utilidad para compartir la aplicación ICFES MASTER H 2.5
 * Soporta la API nativa navigator.share y fallback a portapapeles.
 */

export const handleShareApp = async () => {
  const shareData = {
    title: 'ICFES MASTER H 2.5',
    text: '¡Prepárate para el ICFES Saber 11 con inteligencia artificial, simulacros oficiales y tutor personalizado!',
    url: typeof window !== 'undefined' ? window.location.href : '', // O el enlace público de tu web
  };

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.log('Error al compartir:', err);
      }
    }
  } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
    // Fallback para navegadores que no soportan Web Share API
    try {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      if (typeof window !== 'undefined' && typeof window.alert === 'function') {
        window.alert('¡Enlace y mensaje copiado al portapapeles! Compártelo con tus amigos.');
      }
    } catch (err) {
      console.error('No se pudo copiar', err);
    }
  }
};
