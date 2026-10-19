import React from 'react';

export interface TopAppNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface M3TopAppBarProps {
  title: string;
  subtitle?: string;
  navigationIcon?: React.ReactNode;
  onNavigationClick?: () => void;
  navItems?: TopAppNavItem[];
  activeNavId?: string;
  onSelectNav?: (id: string) => void;
  actions?: React.ReactNode;
  isScrolled?: boolean;
}

export const M3TopAppBar: React.FC<M3TopAppBarProps> = ({
  title,
  subtitle,
  navigationIcon,
  onNavigationClick,
  navItems,
  activeNavId,
  onSelectNav,
  actions,
  isScrolled = false,
}) => {
  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-200 select-none ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E1E7F0]'
          : 'bg-[#F7F9FC] border-b border-[#E1E7F0]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6 sm:gap-8">
        {/* Zone 1: Brand title & Navigation mark */}
        <div
          onClick={onNavigationClick}
          className="flex items-center gap-2.5 min-w-0 cursor-pointer group shrink-0"
        >
          {navigationIcon}
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-[#0B2F64] group-hover:text-[#00668B] transition-colors truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[11px] text-[#73777F] font-semibold truncate -mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Zone 2: Navigation Links (Desktop / Tablet view) */}
        {navItems && navItems.length > 0 && (
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = item.id === activeNavId;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectNav && onSelectNav(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#DCE4F9] text-[#001944] shadow-xs'
                      : 'text-[#43474E] hover:bg-[#E1E7F0]/60 hover:text-[#0B2F64]'
                  }`}
                >
                  {item.icon && <span className="w-3.5 h-3.5 shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Zone 3: Actions (Device Toggle / CTA) */}
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
    </header>
  );
};
