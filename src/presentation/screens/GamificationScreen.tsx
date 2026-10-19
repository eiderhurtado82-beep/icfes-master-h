import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Flame,
  Star,
  CheckCircle2,
  Award,
  Zap,
  Target,
  Trophy,
  TrendingUp
} from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  xp: number;
  icon: string;
}

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: '101',
    title: 'Maestro de la Física',
    description: 'Supera 10 preguntas de cinemática y termodinámica sin fallar.',
    unlocked: true,
    xp: 150,
    icon: '⚡'
  },
  {
    id: '102',
    title: 'Racha de Acero 7 Días',
    description: 'Conéctate a practicar simulacros durante 7 días consecutivos.',
    unlocked: true,
    xp: 300,
    icon: '🔥'
  },
  {
    id: '103',
    title: 'Cazador de Distractores',
    description: 'Identifica correctamente la trampa en 15 preguntas difíciles.',
    unlocked: false,
    xp: 250,
    icon: '🎯'
  },
  {
    id: '104',
    title: 'Puntaje Top Generación E',
    description: 'Alcanza un puntaje global superior a 380 puntos en simulación.',
    unlocked: false,
    xp: 500,
    icon: '🏆'
  }
];

interface GamificationScreenProps {
  onBack?: () => void;
  onNavigateModule?: (module: string) => void;
}

export function GamificationScreen({ onBack, onNavigateModule }: GamificationScreenProps = {}) {
  const [achievements, setAchievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);
  const [userXp, setUserXp] = useState(1250);
  const [streakDays, setStreakDays] = useState(7);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleClaimXp = (id: string, xpValue: number) => {
    setAchievements(prev => prev.map(a => a.id === id ? { ...a, unlocked: true } : a));
    setUserXp(prev => prev + xpValue);
    showToast(`¡Insignia #${id} reclamada con éxito! +${xpValue} XP sumados a tu perfil Master.`);
  };

  const targetXp = 1500;
  const progressPercent = Math.min(100, Math.round((userXp / targetXp) * 100));
  const currentLevel = Math.floor(userXp / 300) + 1;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 pb-20">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 bg-[#0B2F64] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 text-sm font-semibold max-w-md"
          >
            <div className="w-8 h-8 rounded-xl bg-[#AFF2D4] text-[#0B2F64] flex items-center justify-center shrink-0 font-bold">
              <CheckCircle2 className="w-5 h-5 text-[#00875A]" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encabezado del Módulo 3 */}
      <div className="bg-[#0B2F64] text-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-blue-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#AFF2D4] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
              Módulo 3 · Gamificación y Retos Diarios
            </span>
          </div>
          <h2 className="text-2xl font-black mt-2">Centro de Logros y Rachas EdTech</h2>
          <p className="text-xs text-blue-200 mt-1 max-w-xl">
            Potencia tu compromiso diario superando metas y acumulando puntos de experiencia.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-3 bg-blue-950 p-3 rounded-2xl border border-blue-800 shadow-inner">
            <div className="text-center px-3 border-r border-blue-800">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">RACHA ACTUAL</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">🔥 {streakDays} Días</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">NIVEL MASTER</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">⭐ {userXp.toLocaleString()} XP</span>
            </div>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              <span>Volver</span>
            </button>
          )}
        </div>
      </div>

      {/* Barra de Progreso de Nivel */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-[#0B2F64]">
          <span>Progreso hacia Nivel {currentLevel + 1} (Maestro Absoluto Saber 11)</span>
          <span className="text-[#00875A] font-mono">
            {userXp.toLocaleString()} / {targetXp.toLocaleString()} XP ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#00875A] to-[#AFF2D4] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500">
          Completa un simulacro exprés o responde preguntas del Banco de Errores para ganar los {Math.max(0, targetXp - userXp)} XP restantes.
        </p>
      </div>

      {/* Listado de Insignias y Logros (IDs Iniciados en 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#DCE4F9] text-[#0B2F64] flex items-center justify-center text-2xl shrink-0 shadow-sm">
                {item.icon}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 bg-[#DCE4F9] text-[#0B2F64] rounded-md">
                    ID: {item.id}
                  </span>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    +{item.xp} XP
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#0B2F64]">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              {item.unlocked ? (
                <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  ✓ Insignia Desbloqueada
                </span>
              ) : (
                <button
                  onClick={() => handleClaimXp(item.id, item.xp)}
                  className="px-5 py-2.5 bg-[#00875A] text-white rounded-xl text-xs font-bold hover:bg-[#007049] transition-all shadow-sm cursor-pointer"
                >
                  Reclamar Recompensa XP
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
