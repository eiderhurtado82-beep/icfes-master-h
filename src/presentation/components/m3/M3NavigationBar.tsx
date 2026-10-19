import React from 'react';

export interface M3NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
}

interface M3NavigationBarProps {
  items: M3NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export const M3NavigationBar: React.FC<M3NavigationBarProps> = ({
  items,
  activeId,
  onSelect,
  className = '',
}) => {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E1E7F0] select-none ${className}`}
      role="navigation"
      aria-label="Barra de navegación principal"
    >
      <div className="max-w-md md:max-w-xl mx-auto h-18 px-2 flex items-center justify-around">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="group relative flex flex-col items-center justify-center min-w-[56px] py-1 cursor-pointer transition-colors"
            >
              {/* Active pill indicator container */}
              <div
                className={`relative flex items-center justify-center w-14 h-8 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-[#DCE4F9] text-[#001944] scale-100'
                    : 'text-[#43474E] group-hover:bg-[#191C1E]/5 scale-95'
                }`}
              >
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-[#B3261E] text-white text-[10px] font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-semibold mt-1 tracking-tight transition-colors ${
                  isActive ? 'text-[#0B2F64]' : 'text-[#73777F]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
