import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Si ya está ejecutándose como PWA instalada, ocultar
  if (isInstalled) {
    return null;
  }

  // Flujo Chromium / Android / Desktop
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#AFF2D4] hover:bg-[#98e6c4] text-[#0B2F64] shadow-sm transition-all cursor-pointer ${className}`}
        title="Instalar ICFES MASTER en tu dispositivo"
      >
        <Download className="w-3.5 h-3.5 text-[#00875A]" />
        <span>Instalar App</span>
      </button>
    );
  }

  // Flujo iOS Safari (guía paso a paso)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-[#0B2F64] border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer ${className}`}
          title="Instalar en iPhone o iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#00875A]" />
          <span>Instalar en iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#0B2F64] text-white flex items-center justify-center font-black text-sm">
                    IM
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B2F64]">Instalar ICFES MASTER H 2.5</h3>
                    <p className="text-[11px] text-slate-500">En tu iPhone o iPad</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2.5">
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0B2F64] text-white font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                  <span>Toca el botón <strong>Compartir</strong> (icono de cuadrado con flecha) en la barra inferior de Safari.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0B2F64] text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                  <span>Desplázate hacia abajo y selecciona <strong>"Agregar a pantalla de inicio"</strong>.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0B2F64] text-white font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                  <span>Presiona <strong>"Agregar"</strong> para usarla como una app nativa en pantalla completa.</span>
                </p>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#0B2F64] text-white font-bold text-xs hover:bg-[#071f43] transition-all cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Botón manual de información de instalación si el navegador no ha disparado beforeinstallprompt aún
  return (
    <button
      onClick={() => {
        alert('Para instalar ICFES MASTER en tu dispositivo:\n\n• En Chrome/Edge: Haz clic en el icono de instalación en la barra de direcciones.\n• En Android: Toca los tres puntos (⋮) y elige "Instalar aplicación".\n• En iPhone/iPad: Presiona Compartir y "Agregar a pantalla de inicio".');
      }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F7F9FC] text-[#0B2F64] hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer ${className}`}
      title="Instalar como App PWA"
    >
      <Download className="w-3.5 h-3.5 text-[#00875A]" />
      <span>Instalar App</span>
    </button>
  );
};
