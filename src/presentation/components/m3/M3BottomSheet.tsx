import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface M3BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const M3BottomSheet: React.FC<M3BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs transition-opacity duration-300">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250">
        {/* M3 Drag Handle */}
        <div className="w-12 h-1.5 bg-[#C3C7D0] rounded-full mx-auto my-3 shrink-0" />

        {/* Header */}
        <div className="px-6 pb-3 flex items-center justify-between border-b border-[#E1E7F0]">
          {title && (
            <h2 className="text-lg font-bold text-[#0B2F64] tracking-tight">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#43474E] hover:bg-[#191C1E]/8 transition-colors ml-auto cursor-pointer"
            aria-label="Cerrar panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
