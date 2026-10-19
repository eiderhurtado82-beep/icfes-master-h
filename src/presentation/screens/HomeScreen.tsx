import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Flame,
  Play,
  RotateCcw,
  Sparkles,
  Timer,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  ShieldCheck,
  Bot,
  User,
} from 'lucide-react';
import { AreaType, ExamSession } from '../../domain/models/ExamTypes';
import { OFFICIAL_AREAS } from '../../data/ExamRepositoryImpl';
import { M3Card } from '../components/m3/M3Card';
import { M3Button } from '../components/m3/M3Button';
import { M3LinearProgress } from '../components/m3/M3ProgressBar';
import { PWAInstallButton } from '../components/pwa/PWAInstallButton';

export interface HomeScreenProps {
  onStartExam?: () => void;
  onStartExpress?: () => void;
  onStartSimulacro?: (mode: 'simulacro_completo' | 'simulacro_express', area?: AreaType) => void;
  onOpenPractice?: (area?: AreaType) => void;
  onOpenInteractiveQuiz?: (area?: AreaType) => void;
  onOpenFormulas?: () => void;
  onOpenStats?: () => void;
  onOpenAiTutor?: () => void;
  onOpenCheckout?: () => void;
  onOpenErrors?: () => void;
  onOpenAdmin?: () => void;
  onOpenMasterPro?: () => void;
  onOpenExamSimulator?: () => void;
  onOpenAuth?: () => void;
  currentUser?: any;
  history?: ExamSession[];
}

export function HomeScreen({
  onStartExam,
  onStartExpress,
  onStartSimulacro,
  onOpenPractice,
  onOpenInteractiveQuiz,
  onOpenFormulas,
  onOpenStats,
  onOpenAiTutor,
  onOpenErrors,
  onOpenCheckout,
  onOpenAdmin,
  onOpenMasterPro,
  onOpenExamSimulator,
  onOpenAuth,
  currentUser,
  history = [],
}: HomeScreenProps) {
  // Handlers compatibles
  const handleStartExam = () => {
    if (onStartExam) {
      onStartExam();
    } else if (onStartSimulacro) {
      onStartSimulacro('simulacro_completo');
    }
  };

  const handleStartExpress = () => {
    if (onStartExpress) {
      onStartExpress();
    } else if (onStartSimulacro) {
      onStartSimulacro('simulacro_express');
    }
  };

  const latestSession = history.length > 0 ? history[0] : null;
  const projectedScore = latestSession?.finalScore ?? 345;
  const estimatedPercentile = latestSession?.percentilEstimado ?? 86;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 pb-20">
      {/* Barra Superior / Logo con Versión H 2.5 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0B2F64] text-white flex items-center justify-center font-black text-xl shadow-sm">
            IM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-[#0B2F64]">ICFES MASTER</h1>
              <span className="px-2 py-0.5 bg-[#AFF2D4] text-emerald-900 rounded-full text-[10px] font-black tracking-wider">
                H 2.5
              </span>
            </div>
            <p className="text-xs text-slate-500">Saber 11 · Colombia · EdTech Pro</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F7F9FC] text-[#0B2F64] hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <User className="w-3.5 h-3.5 text-[#00875A]" />
              <span>
                {currentUser
                  ? (currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Mi Cuenta')
                  : 'Iniciar Sesión'}
              </span>
            </button>
          )}
          {onOpenMasterPro && (
            <button
              onClick={onOpenMasterPro}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#AFF2D4] text-[#0B2F64] hover:bg-[#92ebc3] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Centro de Alto Rendimiento Saber 11"
            >
              <Award className="w-3.5 h-3.5 text-[#00875A]" />
              <span>Alto Rendimiento Pro</span>
            </button>
          )}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F7F9FC] text-[#0B2F64] hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0B2F64]" />
              <span>🛡 Consola Master</span>
            </button>
          )}
          {onOpenCheckout && (
            <button
              onClick={onOpenCheckout}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0B2F64] text-white hover:bg-[#082249] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#AFF2D4]" />
              <span>Obtener Plan Pro</span>
            </button>
          )}
          <PWAInstallButton />
        </div>
      </motion.div>

      {/* Hero Card: Puntaje Proyectado & Estado Saber 11 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B2F64] via-[#0E3D7E] to-[#00668B] text-white p-6 sm:p-8 shadow-xl"
      >
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-48 h-48 rounded-full bg-[#AFF2D4]/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#AFF2D4] border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prueba Oficial ICFES Saber 11</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-balance">
              ¡Prepárate para la Excelencia Académica, Eider!
            </h2>
            <p className="text-sm text-blue-100 max-w-xl leading-relaxed">
              Simulador oficial Saber 11 con retroalimentación instantánea, banco de preguntas actualizado y tutoría por IA.
            </p>
          </div>

          {/* Quick Score Badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center gap-4 shrink-0">
            <div className="text-center pr-4 border-r border-white/20">
              <span className="block text-xs uppercase tracking-wider text-blue-200 font-semibold">
                Puntaje Meta
              </span>
              <span className="text-3xl font-black font-mono tabular-nums text-white">
                {projectedScore}
                <span className="text-sm text-blue-200 font-normal">/500</span>
              </span>
            </div>
            <div className="text-center">
              <span className="block text-xs uppercase tracking-wider text-[#AFF2D4] font-semibold">
                Percentil
              </span>
              <span className="text-2xl font-bold font-mono tabular-nums text-[#AFF2D4]">
                Top {100 - estimatedPercentile}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons in Hero */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/15 flex flex-wrap gap-3">
          <M3Button
            variant="success"
            size="large"
            icon={<Play className="w-4 h-4 fill-current" />}
            onClick={handleStartExam}
          >
            Iniciar Simulacro Completo
          </M3Button>

          <M3Button
            variant="tonal"
            size="large"
            icon={<Timer className="w-4 h-4" />}
            onClick={handleStartExpress}
            className="bg-white/15 text-white hover:bg-white/25"
          >
            Simulacro Exprés (15 min)
          </M3Button>

          {onOpenExamSimulator && (
            <M3Button
              variant="tonal"
              size="large"
              icon={<Sparkles className="w-4 h-4 text-[#AFF2D4]" />}
              onClick={onOpenExamSimulator}
              className="bg-white/20 text-white hover:bg-white/30 border border-white/20"
            >
              Simulador Condición Real H 2.5
            </M3Button>
          )}
        </div>
      </motion.div>

      {/* Daily streak & quick metrics strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <M3Card variant="filled" className="p-3.5 sm:p-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#AFF2D4] text-[#00875A] flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-xs text-[#43474E] font-medium block">Racha Diaria</span>
              <span className="text-lg font-bold text-[#191C1E] font-mono tabular-nums">
                6 Días
              </span>
            </div>
          </div>
        </M3Card>

        <M3Card variant="filled" className="p-3.5 sm:p-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#DCE4F9] text-[#0B2F64] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#43474E] font-medium block">Preguntas</span>
              <span className="text-lg font-bold text-[#191C1E] font-mono tabular-nums">
                {history.length > 0 ? history.length * 8 : '16'} Resueltas
              </span>
            </div>
          </div>
        </M3Card>

        <M3Card variant="filled" className="p-3.5 sm:p-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#AFF2D4] text-[#00875A] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#43474E] font-medium block">Precisión</span>
              <span className="text-lg font-bold text-[#00875A] font-mono tabular-nums">
                78.4%
              </span>
            </div>
          </div>
        </M3Card>

        <M3Card variant="filled" className="p-3.5 sm:p-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#C4E7FF] text-[#00668B] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#43474E] font-medium block">Beca Estimada</span>
              <span className="text-sm font-bold text-[#00668B] truncate block">
                Generación E
              </span>
            </div>
          </div>
        </M3Card>
      </div>

      {/* Sección Destacada: Tutor IA Eider y Banco de Errores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tutor IA Pedagógico Card */}
        {onOpenAiTutor && (
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.15 }}
            onClick={onOpenAiTutor}
            className="cursor-pointer rounded-3xl p-6 bg-gradient-to-br from-[#0B2F64] via-[#0E3D7E] to-[#124285] text-white border border-blue-400/20 shadow-md flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md text-[#AFF2D4] shadow-xs flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-[#AFF2D4] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  Inteligencia Artificial
                </span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Tutor IA Pedagógico (Eider)</h3>
                <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                  Resuelve dudas teóricas, conceptos clave y recibe estrategias de descarte paso a paso para la prueba Saber 11.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between text-xs font-bold text-[#AFF2D4] group-hover:text-emerald-300 transition-colors">
              <span>Consultar con Eider</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        )}

        {/* Banco de Errores y Repaso Card */}
        {onOpenErrors && (
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.15 }}
            onClick={onOpenErrors}
            className="cursor-pointer rounded-3xl p-6 bg-gradient-to-br from-amber-50 via-orange-50/60 to-white border border-amber-200/80 shadow-md flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white shadow-xs flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                  Refuerzo Inteligente
                </span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#0B2F64]">Banco de Errores y Repaso</h3>
                <p className="text-xs text-[#43474E] mt-1 leading-relaxed">
                  Analiza tus fallos históricos y consolida los conceptos que necesitas dominar con descarte de distractores.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-amber-200/80 flex items-center justify-between text-xs font-bold text-amber-900 group-hover:text-amber-950 transition-colors">
              <span>Repasar mis Fallos</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Etapa 2: Módulo de Preguntas Interactivas Callout */}
      {onOpenInteractiveQuiz && (
        <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-[#DCE4F9] via-[#E9F0FE] to-[#AFF2D4]/30 border border-[#0B2F64]/15 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0B2F64] text-white text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-[#AFF2D4]" />
              <span>Etapa 2: Cuestionario Interactivo</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B2F64]">
              Preguntas Saber 11 con Justificación Inmediata
            </h3>
            <p className="text-xs text-[#43474E] max-w-xl leading-relaxed">
              Responde enunciados contextualizados A-B-C-D, recibe retroalimentación explicativa al instante y entrena técnicas de descarte.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <M3Button
              variant="filled"
              size="medium"
              icon={<ChevronRight className="w-4 h-4" />}
              iconPosition="end"
              onClick={() => onOpenInteractiveQuiz('matematicas')}
            >
              Cuestionario de Matemáticas
            </M3Button>
            <M3Button
              variant="tonal"
              size="medium"
              onClick={() => onOpenInteractiveQuiz('lectura_critica')}
            >
              Lectura Crítica
            </M3Button>
          </div>
        </div>
      )}

      {/* The 5 Official Saber 11 Areas Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B2F64] tracking-tight">
              Módulos Oficiales Saber 11
            </h2>
            <p className="text-xs text-[#43474E]">
              Selecciona un área para practicar preguntas guiadas con justificación pedagógica
            </p>
          </div>
          {onOpenPractice && (
            <M3Button
              variant="text"
              size="small"
              icon={<ChevronRight className="w-4 h-4" />}
              iconPosition="end"
              onClick={() => onOpenPractice()}
            >
              Ver todas
            </M3Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {OFFICIAL_AREAS.map((area) => (
            <M3Card
              key={area.id}
              variant="outlined"
              interactive
              onClick={() => onOpenPractice?.(area.id)}
              className="flex flex-col justify-between group hover:border-[#0B2F64]/40"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={{ backgroundColor: area.containerHex, color: area.colorHex }}
                  >
                    {area.name}
                  </span>
                  <span className="text-xs text-[#73777F] font-mono">
                    Peso ICFES: {area.officialWeight}x
                  </span>
                </div>

                <p className="text-xs text-[#43474E] line-clamp-2 leading-relaxed">
                  {area.description}
                </p>

                {/* Progress bar */}
                <div className="pt-1">
                  <div className="flex justify-between text-[11px] font-semibold text-[#73777F] mb-1">
                    <span>Dominio del área</span>
                    <span className="font-mono text-[#00875A]">72%</span>
                  </div>
                  <M3LinearProgress value={72} color="tertiary" height={6} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E1E7F0] flex items-center justify-between text-xs font-semibold text-[#0B2F64] group-hover:text-[#00875A] transition-colors">
                <span>Practicar preguntas</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </M3Card>
          ))}

          {/* Quick Cheat Sheet Card */}
          {onOpenFormulas && (
            <M3Card
              variant="filled"
              interactive
              onClick={onOpenFormulas}
              className="flex flex-col justify-between bg-gradient-to-br from-[#DCE4F9] to-[#EAF0FF] border border-[#0B2F64]/10 group"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white text-[#0B2F64] shadow-xs flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0B2F64]">
                  Cuaderno de Fórmulas y Leyes
                </h3>
                <p className="text-xs text-[#43474E] leading-relaxed">
                  Repasa en 5 minutos las fórmulas de física, estequiometría, artículos de la Constitución y conectores en inglés.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#0B2F64]/15 flex items-center justify-between text-xs font-bold text-[#0B2F64]">
                <span>Abrir Cuaderno</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </M3Card>
          )}

          {/* Suscripción Plan Pro EdTech Card */}
          {onOpenCheckout && (
            <M3Card
              variant="filled"
              interactive
              onClick={onOpenCheckout}
              className="flex flex-col justify-between bg-gradient-to-br from-[#0B2F64] via-[#0E3D7E] to-[#00875A] text-white border border-[#00875A]/30 group sm:col-span-2"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md text-[#AFF2D4] shadow-xs flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-[#AFF2D4] uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-full">
                    Nequi · Daviplata · PayPal
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">
                  Suscripción ICFES MASTER Pro
                </h3>
                <p className="text-xs text-blue-100 leading-relaxed max-w-xl">
                  Desbloquea simulacros ilimitados, todas las explicaciones de distractores pedagógicos, diagnósticos predictivos y asesoría continua del Tutor Eider.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-[#AFF2D4]">
                <span>Ver Planes y Métodos de Pago ($29.900 COP)</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </M3Card>
          )}
        </div>
      </div>

      {/* Recent History / Diagnostics Teaser */}
      {history.length > 0 && onOpenStats && (
        <M3Card variant="outlined" className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[#0B2F64]" />
              <h3 className="text-base font-bold text-[#0B2F64]">
                Últimos Simulacros Realizados
              </h3>
            </div>
            <M3Button variant="text" size="small" onClick={onOpenStats}>
              Ver Diagnóstico Completo
            </M3Button>
          </div>

          <div className="divide-y divide-[#E1E7F0]">
            {history.slice(0, 3).map((session) => (
              <div key={session.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#191C1E]">
                    {session.title}
                  </h4>
                  <span className="text-xs text-[#73777F]">
                    {new Date(session.startedAt).toLocaleDateString('es-CO', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold font-mono tabular-nums text-[#00875A]">
                    {session.finalScore ?? '--'}
                    <span className="text-xs text-[#73777F]"> / 500</span>
                  </span>
                  <span className="block text-[11px] text-[#43474E] font-medium">
                    Percentil {session.percentilEstimado ?? '--'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </M3Card>
      )}

      {/* Admin / Docente Console Teaser */}
      {onOpenAdmin && (
        <div className="pt-2">
          <div className="bg-slate-100/80 hover:bg-slate-200/80 transition-colors border border-slate-200 rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0B2F64] text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#0B2F64] block">Consola Master EdTech (Administración)</span>
                <span className="text-slate-500 text-[11px]">Validación de pagos Nequi/Daviplata/PayPal, reactivos y estadísticas del sistema.</span>
              </div>
            </div>
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-1.5 rounded-xl font-bold bg-white text-[#0B2F64] hover:bg-slate-50 border border-slate-200 shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-center"
            >
              <span>Acceder al Panel</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
