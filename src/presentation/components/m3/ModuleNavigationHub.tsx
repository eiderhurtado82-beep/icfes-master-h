import React from 'react';
import {
  FileText,
  Play,
  BookOpen,
  GraduationCap,
  ChevronRight,
  Home,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

export type MainModuleId = 'simulacro' | 'cuestionario' | 'formulas' | 'stats' | 'tutor' | 'errores';

interface ModuleNavigationHubProps {
  currentModule: MainModuleId;
  onNavigate: (module: MainModuleId | 'home') => void;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: 'primary' | 'tertiary' | 'secondary';
  actionButton?: React.ReactNode;
}

export const ModuleNavigationHub: React.FC<ModuleNavigationHubProps> = ({
  currentModule,
  onNavigate,
  title,
  description,
  badge,
  badgeColor = 'primary',
  actionButton,
}) => {
  const modules = [
    {
      id: 'cuestionario' as MainModuleId,
      label: 'Práctica Guiada',
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    {
      id: 'simulacro' as MainModuleId,
      label: 'Simulacro Oficial',
      icon: <Play className="w-3.5 h-3.5" />,
    },
    {
      id: 'formulas' as MainModuleId,
      label: 'Cuaderno Fórmulas',
      icon: <BookOpen className="w-3.5 h-3.5" />,
    },
    {
      id: 'stats' as MainModuleId,
      label: 'Diagnóstico & Becas',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
    },
    {
      id: 'tutor' as MainModuleId,
      label: 'Tutor Eider',
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: 'errores' as MainModuleId,
      label: 'Banco Errores',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
    },
  ];

  const badgeColors = {
    primary: 'bg-[#DCE4F9] text-[#001944]',
    tertiary: 'bg-[#AFF2D4] text-[#002113]',
    secondary: 'bg-[#C4E7FF] text-[#001E2C]',
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#E1E7F0] space-y-3.5 mb-5">
      {/* Breadcrumbs & Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <nav className="flex items-center gap-1.5 text-xs text-[#73777F] font-medium" aria-label="Breadcrumb">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#0B2F64] transition-colors cursor-pointer flex items-center gap-1"
          >
            <Home className="w-3 h-3" />
            <span>Inicio</span>
          </button>
          <ChevronRight className="w-3 h-3 text-[#C3C7D0]" />
          <span className="text-[#0B2F64] font-semibold">{title}</span>
        </nav>

        {badge && (
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badgeColors[badgeColor]}`}>
            {badge}
          </span>
        )}
      </div>

      {/* Title & Description & Contextual Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#0B2F64] tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-[#43474E] mt-0.5 leading-relaxed max-w-xl">
            {description}
          </p>
        </div>

        {actionButton && <div className="shrink-0">{actionButton}</div>}
      </div>

      {/* Segmented Module Switcher Bar (Quick Navigation Between 4 Modules) */}
      <div className="pt-2 border-t border-[#E1E7F0]/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          <span className="text-[11px] font-bold text-[#73777F] uppercase tracking-wider mr-1 hidden sm:inline">
            Módulos:
          </span>
          {modules.map((m) => {
            const isActive = m.id === currentModule;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onNavigate(m.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#0B2F64] text-white shadow-xs'
                    : 'bg-[#F7F9FC] text-[#43474E] hover:bg-[#E1E7F0] hover:text-[#0B2F64]'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
