import React from 'react';
import { M3Button } from './M3Button';

interface M3DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  icon?: React.ReactNode;
  confirmVariant?: 'filled' | 'success';
}

export const M3Dialog: React.FC<M3DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  onConfirm,
  icon,
  confirmVariant = 'filled',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E1E7F0] animate-in zoom-in-95 duration-150">
        {icon && (
          <div className="w-12 h-12 rounded-full bg-[#DCE4F9] text-[#0B2F64] flex items-center justify-center mb-4">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-bold text-[#191C1E] tracking-tight">{title}</h3>
        <p className="mt-2 text-sm text-[#43474E] leading-relaxed">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <M3Button variant="text" onClick={onClose}>
            {cancelText}
          </M3Button>
          <M3Button variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </M3Button>
        </div>
      </div>
    </div>
  );
};
