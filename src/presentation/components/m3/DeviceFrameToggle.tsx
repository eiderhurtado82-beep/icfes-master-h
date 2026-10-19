import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface DeviceFrameToggleProps {
  isMobileFrame: boolean;
  onToggle: () => void;
}

export const DeviceFrameToggle: React.FC<DeviceFrameToggleProps> = ({
  isMobileFrame,
  onToggle,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#DCE4F9] text-[#001944] hover:bg-[#CFDCF7] transition-all cursor-pointer select-none"
      title={isMobileFrame ? 'Cambiar a Pantalla Completa' : 'Ver en Marco Móvil Android'}
    >
      {isMobileFrame ? (
        <>
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Modo Monitor</span>
        </>
      ) : (
        <>
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Modo Android Móvil</span>
        </>
      )}
    </button>
  );
};
