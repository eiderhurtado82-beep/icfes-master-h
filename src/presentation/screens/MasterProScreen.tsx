import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Timer,
  Award,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  FileText,
  School,
  Check,
  Zap,
  Target,
  Download,
  AlertCircle
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  xp: number;
}

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: '101', title: 'Maestro de la Física', description: 'Supera 10 preguntas de cinemática y termodinámica sin fallar.', unlocked: true, xp: 150 },
  { id: '102', title: 'Racha de Acero 7 Días', description: 'Conéctate a practicar simulacros durante 7 días consecutivos.', unlocked: true, xp: 300 },
  { id: '103', title: 'Cazador de Distractores', description: 'Identifica correctamente la trampa en 15 preguntas difíciles.', unlocked: false, xp: 250 },
  { id: '104', title: 'Puntaje Top Generación E', description: 'Alcanza un puntaje global superior a 380 puntos en simulación.', unlocked: false, xp: 500 },
];

interface MasterProScreenProps {
  onBack?: () => void;
  onNavigateModule?: (module: string) => void;
}

export function MasterProScreen({ onBack, onNavigateModule }: MasterProScreenProps = {}) {
  const [activeTab, setActiveTab] = useState<'exam' | 'admission' | 'gamification'>('exam');
  const [achievements, setAchievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);
  const [timerActive, setTimerActive] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(4 * 3600 + 30 * 60); // 04:30:00
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [totalXp, setTotalXp] = useState(1250);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, secondsRemaining]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleClaimXp = (id: string, xp: number) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, unlocked: true } : a))
    );
    setTotalXp((prev) => prev + xp);
    showToast(`¡Insignia #${id} reclamada! Se sumaron +${xp} XP a tu perfil Master.`);
  };

  const handleDownloadPdf = () => {
    showToast('Generando reporte diagnóstico Saber 11 en PDF de alta fidelidad...');
    setTimeout(() => {
      showToast('¡Reporte generado! Cumples con los requisitos de Beca Generación E.');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 pb-20">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 bg-[#0B2F64] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 text-sm font-semibold max-w-md"
          >
            <div className="w-8 h-8 rounded-xl bg-[#AFF2D4] text-[#0B2F64] flex items-center justify-center shrink-0 font-bold">
              <CheckCircle2 className="w-5 h-5 text-[#00875A]" />
            </div>
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encabezado Principal H 2.5 */}
      <div className="bg-[#0B2F64] text-white p-6 rounded-3xl shadow-sm border border-blue-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-[#AFF2D4] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
              Ecosistema EdTech Pro · IDs Iniciados en 1
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-2">
            Centro de Alto Rendimiento Saber 11 - Eider
          </h2>
          <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-2xl leading-relaxed">
            Simulación cronometrada, pronóstico de admisión universitaria y sistema de logros.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-2 border border-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
          )}

          <div className="flex gap-1.5 bg-blue-950 p-1.5 rounded-2xl border border-blue-800">
            <button
              onClick={() => setActiveTab('exam')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'exam' ? 'bg-[#AFF2D4] text-[#0B2F64] shadow-sm' : 'text-white hover:bg-blue-900'
              }`}
            >
              ⏱️ 1. Simulador Real
            </button>
            <button
              onClick={() => setActiveTab('admission')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'admission' ? 'bg-[#AFF2D4] text-[#0B2F64] shadow-sm' : 'text-white hover:bg-blue-900'
              }`}
            >
              📊 2. Admisión U.
            </button>
            <button
              onClick={() => setActiveTab('gamification')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'gamification' ? 'bg-[#AFF2D4] text-[#0B2F64] shadow-sm' : 'text-white hover:bg-blue-900'
              }`}
            >
              🏆 3. Logros & XP
            </button>
          </div>
        </div>
      </div>

      {/* MÓDULO 1: SIMULADOR CRONOMETRADO */}
      {activeTab === 'exam' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#F7F9FC] p-5 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-[#00875A] uppercase tracking-wider">
                Modo Oficial Saber 11
              </span>
              <h3 className="font-bold text-lg text-[#0B2F64]">
                Simulacro Condición Real (Sesión 1 y 2)
              </h3>
              <p className="text-xs text-slate-500">
                Cronómetro global estricto, 131 preguntas por sesión y entrega automática.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-black text-[#0B2F64] bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-inner tracking-widest">
                {formatTime(secondsRemaining)}
              </span>
              <button
                onClick={() => setTimerActive(!timerActive)}
                className={`px-5 py-3 rounded-xl font-bold text-xs text-white shadow-sm transition-all cursor-pointer ${
                  timerActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#00875A] hover:bg-[#007049]'
                }`}
              >
                {timerActive ? '⏸ Pausar Simulacro' : '▶ Iniciar Cronómetro'}
              </button>
              {onNavigateModule && (
                <button
                  onClick={() => onNavigateModule('simulador_real')}
                  className="px-4 py-3 rounded-xl font-bold text-xs bg-[#0B2F64] text-white hover:bg-[#08234a] shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#AFF2D4]" />
                  <span>Modo 4 Áreas (IDs 101-104)</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-5 border border-slate-200 rounded-2xl space-y-4">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Pregunta {currentQuestionIndex} de 131 (Matemáticas)</span>
              <span className="text-[#00875A]">
                Progreso: {((currentQuestionIndex / 131) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#00875A] h-full transition-all duration-300"
                style={{ width: `${Math.max(1, (currentQuestionIndex / 131) * 100)}%` }}
              />
            </div>

            <div className="space-y-3 pt-2">
              <span className="font-mono text-xs font-bold bg-[#DCE4F9] text-[#0B2F64] px-2.5 py-1 rounded-md">
                ID Reactivo: 101-MAT
              </span>
              <p className="text-sm font-bold text-[#0B2F64] leading-relaxed">
                1. En una pista circular de atletismo de 400 metros de circunferencia, dos corredores parten simultáneamente desde el mismo punto en direcciones opuestas. El corredor A mantiene una rapidez constante de 6 m/s y el corredor B corre a 4 m/s. ¿Al cabo de cuántos segundos se encontrarán por primera vez?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { id: 'A', text: 'A. 40 segundos' },
                { id: 'B', text: 'B. 66.6 segundos' },
                { id: 'C', text: 'C. 100 segundos' },
                { id: 'D', text: 'D. 200 segundos' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`p-3.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                    selectedOption === opt.id
                      ? 'border-[#0B2F64] bg-[#0B2F64] text-white shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span>{opt.text}</span>
                  {selectedOption === opt.id && <Check className="w-4 h-4 text-[#AFF2D4]" />}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                Puntaje proyectado para esta competencia: <strong>82/100</strong>
              </span>
              <button
                onClick={() => {
                  if (!selectedOption) {
                    showToast('Selecciona una opción para avanzar al siguiente reactivo.');
                    return;
                  }
                  setSelectedOption(null);
                  setCurrentQuestionIndex((prev) => Math.min(131, prev + 1));
                  showToast('Respuesta guardada. Avanzando...');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#0B2F64] text-white text-xs font-bold hover:bg-[#071f43] transition-all cursor-pointer"
              >
                Siguiente Pregunta →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MÓDULO 2: PRONÓSTICO DE ADMISIÓN UNIVERSITARIA */}
      {activeTab === 'admission' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#00875A] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Semáforo de Admisión
              </span>
              <span className="text-xs font-bold text-slate-400">Corte 2026-I</span>
            </div>

            <h3 className="text-xl font-black text-[#0B2F64]">Pronóstico Universidades Públicas</h3>
            <p className="text-xs text-slate-500">
              Basado en tu puntaje estimado actual de{' '}
              <strong className="text-[#0B2F64]">345 / 500 pts</strong> (Percentil Top 14% Nacional).
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-emerald-900">
                    Universidad Nacional de Colombia
                  </h4>
                  <p className="text-[11px] text-emerald-700">Ingeniería de Sistemas (Medellín/Bogotá)</p>
                </div>
                <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-sm">
                  Alta Probabilidad
                </span>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-emerald-900">Universidad del Valle</h4>
                  <p className="text-[11px] text-emerald-700">Medicina / Tecnologías y Ciencias</p>
                </div>
                <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-sm">
                  Aprobado
                </span>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-[#0B2F64]">Universidad de Antioquia - UdeA</h4>
                  <p className="text-[11px] text-blue-700">Ingenierías y Ciencias Sociales</p>
                </div>
                <span className="px-3 py-1 bg-[#0B2F64] text-white rounded-full text-xs font-bold shadow-sm">
                  Muy Probable
                </span>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-emerald-900">Universidad Industrial de Santander</h4>
                  <p className="text-[11px] text-emerald-700">Ingeniería Mecánica / Petróleos</p>
                </div>
                <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-sm">
                  Aprobado
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-[#00875A] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Beca Generación E / Excelencia
              </span>
              <h3 className="text-xl font-black text-[#0B2F64]">Elegibilidad Académica</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tu perfil se ajusta a los criterios de selección para apoyos de sostenimiento y matrícula cero en instituciones de educación superior públicas colombianas.
              </p>

              <div className="space-y-2.5 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600">Requisito Puntaje Saber 11</span>
                  <span className="font-bold text-[#00875A]">Cumplido (≥ 345 pts)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600">Beneficio Cobertura</span>
                  <span className="font-bold text-[#0B2F64]">100% Matrícula + Sostenimiento</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600">Asesoría de Postulación</span>
                  <span className="font-bold text-[#00875A]">Incluida en Plan Pro Eider</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                onClick={handleDownloadPdf}
                className="flex-1 py-3.5 bg-[#0B2F64] hover:bg-[#071f43] text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>📄 Descargar Reporte en PDF</span>
              </button>
              {onNavigateModule && (
                <button
                  onClick={() => onNavigateModule('admision')}
                  className="px-4 py-3.5 bg-[#AFF2D4] hover:bg-[#98e6c4] text-[#0B2F64] font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <TrendingUp className="w-4 h-4 text-[#00875A]" />
                  <span>Simulador con Slider Interactivo</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MÓDULO 3: SISTEMA DE LOGROS Y GAMIFICACIÓN */}
      {activeTab === 'gamification' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h3 className="font-bold text-base text-[#0B2F64]">Insignias y Puntos de Experiencia (XP)</h3>
              <p className="text-xs text-slate-500">Mantén tu racha diaria activa y desbloquea recompensas de nivel Master.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
              <span className="px-4 py-1.5 bg-[#AFF2D4] text-emerald-900 rounded-full text-xs font-black shadow-sm">
                ⭐ Nivel 4 · {totalXp.toLocaleString()} XP
              </span>
              {onNavigateModule && (
                <button
                  onClick={() => onNavigateModule('logros')}
                  className="px-3.5 py-1.5 bg-[#0B2F64] text-white rounded-xl text-xs font-bold hover:bg-[#071f43] transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#AFF2D4]" />
                  <span>Ver Centro de Retos</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center gap-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#DCE4F9] text-[#0B2F64] rounded-md">
                      ID: {item.id}
                    </span>
                    <span className="text-xs font-bold text-amber-600">+{item.xp} XP</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#0B2F64]">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </div>
                <div className="shrink-0">
                  {item.unlocked ? (
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold inline-flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Desbloqueado</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleClaimXp(item.id, item.xp)}
                      className="px-4 py-2 bg-[#00875A] text-white rounded-xl text-xs font-bold hover:bg-[#007049] transition-all shadow-sm cursor-pointer"
                    >
                      Reclamar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
