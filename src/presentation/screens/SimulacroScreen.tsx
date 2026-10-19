import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  FileText,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import {
  ExamMode,
  ExamSession,
  OptionLetter,
  UserAnswer,
  AreaType,
} from '../../domain/models/ExamTypes';
import { examRepository, OFFICIAL_AREAS } from '../../data/ExamRepositoryImpl';
import { M3Card } from '../components/m3/M3Card';
import { M3Button } from '../components/m3/M3Button';
import { M3BottomSheet } from '../components/m3/M3BottomSheet';
import { M3Dialog } from '../components/m3/M3Dialog';
import { M3LinearProgress } from '../components/m3/M3ProgressBar';
import { ModuleNavigationHub, MainModuleId } from '../components/m3/ModuleNavigationHub';

// Variantes de animación de deslizamiento (Framer Motion)
const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -50 : 50,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export interface SimulacroScreenProps {
  mode?: ExamMode;
  areaFilter?: AreaType;
  onFinishSimulacro?: (score: number) => void;
  onExit?: () => void;
  onSessionFinished?: () => void;
  onNavigateModule?: (module: MainModuleId | 'home') => void;
}

export function SimulacroScreen({
  mode = 'simulacro_completo',
  areaFilter,
  onFinishSimulacro,
  onExit = () => {},
  onSessionFinished,
  onNavigateModule,
}: SimulacroScreenProps) {
  const [session, setSession] = useState<ExamSession>(() =>
    examRepository.createExamSession(mode, areaFilter)
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [isAnswerSheetOpen, setIsAnswerSheetOpen] = useState<boolean>(false);
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState<boolean>(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState<boolean>(false);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  // Filtro de revisión post-simulacro
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'marked'>('all');

  // Temporizador regresivo
  useEffect(() => {
    if (session.isCompleted || isTimerPaused) return;

    const timer = setInterval(() => {
      setSession((prev) => {
        if (prev.timeRemainingSeconds <= 1) {
          clearInterval(timer);
          return finalizeSession(prev);
        }
        return {
          ...prev,
          timeRemainingSeconds: prev.timeRemainingSeconds - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session.isCompleted, isTimerPaused]);

  // Formato mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = session.questions[currentIndex];
  const currentAnswer = session.answers[currentQuestion?.id] || {
    questionId: currentQuestion?.id,
    selectedOption: null,
    isMarkedForReview: false,
    timeSpentSeconds: 0,
  };

  const handleSelectOption = (option: OptionLetter) => {
    if (session.isCompleted) return;
    setSession((prev) => {
      const updatedAnswers: Record<string, UserAnswer> = {
        ...prev.answers,
        [currentQuestion.id]: {
          ...(prev.answers[currentQuestion.id] || {
            questionId: currentQuestion.id,
            isMarkedForReview: false,
            timeSpentSeconds: 0,
          }),
          selectedOption: option,
        },
      };
      return { ...prev, answers: updatedAnswers };
    });
  };

  const handleToggleMarkForReview = () => {
    if (session.isCompleted) return;
    setSession((prev) => {
      const prevAns = prev.answers[currentQuestion.id];
      const updatedAnswers = {
        ...prev.answers,
        [currentQuestion.id]: {
          ...prevAns,
          isMarkedForReview: !prevAns?.isMarkedForReview,
        },
      };
      return { ...prev, answers: updatedAnswers };
    });
  };

  const finalizeSession = (targetSession: ExamSession): ExamSession => {
    const scoreResult = examRepository.calculateIcfesScore(targetSession);
    const finished: ExamSession = {
      ...targetSession,
      isCompleted: true,
      completedAt: Date.now(),
      finalScore: scoreResult.globalScore,
      areaScores: scoreResult.areaScores,
      percentilEstimado: scoreResult.percentil,
    };
    examRepository.saveExamSession(finished);
    if (onSessionFinished) onSessionFinished();
    if (onFinishSimulacro) onFinishSimulacro(scoreResult.globalScore);
    return finished;
  };

  const handleConfirmFinish = () => {
    setIsFinishDialogOpen(false);
    setSession((prev) => finalizeSession(prev));
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setSlideDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < session.questions.length - 1) {
      setSlideDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const answeredCount = Object.values(session.answers).filter(
    (a) => a.selectedOption !== null
  ).length;
  const markedCount = Object.values(session.answers).filter(
    (a) => a.isMarkedForReview
  ).length;
  const totalQuestions = session.questions.length;
  const progressPercent = (answeredCount / totalQuestions) * 100;

  // ==========================================
  // PANTALLA DE RESULTADOS POST-SIMULACRO
  // ==========================================
  if (session.isCompleted) {
    const scoreResult = examRepository.calculateIcfesScore(session);
    const filteredQuestions = session.questions.filter((q) => {
      const ans = session.answers[q.id];
      if (reviewFilter === 'incorrect') {
        return ans?.selectedOption !== q.correctAnswer;
      }
      if (reviewFilter === 'marked') {
        return ans?.isMarkedForReview;
      }
      return true;
    });

    return (
      <div className="space-y-5 pb-24 animate-in fade-in duration-300">
        {/* Module Navigation Hub */}
        <ModuleNavigationHub
          currentModule="simulacro"
          onNavigate={(mod) => onNavigateModule && onNavigateModule(mod)}
          title="Simulacro Oficial Saber 11"
          description="Resultados calculados con ponderación oficial ICFES (0 a 500 puntos) y percentiles colombianos."
          badge="Examen Completado"
          badgeColor="tertiary"
        />

        {/* Results Hero Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0B2F64] via-[#0E3D7E] to-[#00875A] text-white p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#AFF2D4]">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>Simulacro Oficial Calificado</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Resultados del Examen
              </h2>
              <p className="text-sm text-blue-100">
                Puntaje calculado con la metodología oficial ponderada del ICFES Saber 11.
              </p>
            </div>

            {/* Score Big Badge */}
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-5 border border-white/20 text-center min-w-[200px]">
              <span className="block text-xs uppercase font-semibold text-blue-200">
                Puntaje Global ICFES
              </span>
              <div className="text-5xl font-black font-mono tabular-nums tracking-tight my-1 text-white">
                {scoreResult.globalScore}
                <span className="text-xl text-blue-200 font-normal">/500</span>
              </div>
              <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#AFF2D4] text-[#002113] text-xs font-bold">
                Percentil Nacional: {scoreResult.percentil} (Top {100 - scoreResult.percentil}%)
              </div>
            </div>
          </div>

          {/* Area Breakdown Pill Strip */}
          <div className="mt-8 pt-6 border-t border-white/15">
            <span className="block text-xs font-semibold uppercase tracking-wider text-blue-200 mb-3">
              Desglose por Áreas Evaluadas (Escala 0 a 100)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {OFFICIAL_AREAS.map((area) => {
                const areaScore = scoreResult.areaScores[area.id] || 0;
                return (
                  <div
                    key={area.id}
                    className="bg-white/10 rounded-2xl p-3 text-center border border-white/10"
                  >
                    <span className="block text-xs text-blue-100 font-medium truncate">
                      {area.shortName}
                    </span>
                    <span className="text-xl font-bold font-mono text-white">
                      {areaScore}
                    </span>
                    <span className="block text-[10px] text-[#AFF2D4] mt-0.5">
                      {areaScore >= 70 ? 'Nivel Avanzado' : areaScore >= 50 ? 'Nivel Medio' : 'Por Mejorar'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action bar after exam */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReviewFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                reviewFilter === 'all'
                  ? 'bg-[#0B2F64] text-white'
                  : 'bg-white text-[#43474E] border border-[#C3C7D0]'
              }`}
            >
              Todas ({session.questions.length})
            </button>
            <button
              onClick={() => setReviewFilter('incorrect')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                reviewFilter === 'incorrect'
                  ? 'bg-[#BA1A1A] text-white'
                  : 'bg-white text-[#43474E] border border-[#C3C7D0]'
              }`}
            >
              Incorrectas ({session.questions.length - scoreResult.correctCount})
            </button>
            <button
              onClick={() => setReviewFilter('marked')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                reviewFilter === 'marked'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-[#43474E] border border-[#C3C7D0]'
              }`}
            >
              Dudosas / Marcadas ({markedCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <M3Button
              variant="outlined"
              size="small"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={() => {
                setSession(examRepository.createExamSession(mode, areaFilter));
                setCurrentIndex(0);
              }}
            >
              Repetir Simulacro
            </M3Button>
            {onNavigateModule && (
              <M3Button
                variant="tonal"
                size="small"
                onClick={() => onNavigateModule('stats')}
              >
                Ver Admisión Universitaria
              </M3Button>
            )}
            <M3Button variant="filled" size="small" onClick={onExit}>
              Finalizar y Volver
            </M3Button>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#0B2F64]">
            Revisión Pedagógica Paso a Paso
          </h3>

          {filteredQuestions.map((q, idx) => {
            const ans = session.answers[q.id];
            const isCorrect = ans?.selectedOption === q.correctAnswer;
            const area = OFFICIAL_AREAS.find((a) => a.id === q.area);

            return (
              <M3Card key={q.id} variant="outlined" className="p-5 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#E1E7F0] text-[#191C1E] text-xs font-bold flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span
                      className="px-2.5 py-0.5 rounded-md text-xs font-bold"
                      style={{ backgroundColor: area?.containerHex, color: area?.colorHex }}
                    >
                      {area?.name}
                    </span>
                    <span className="text-xs text-[#73777F]">{q.topic}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#AFF2D4] text-[#002113] text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00875A]" />
                        Correcta
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFDAD6] text-[#410002] text-xs font-bold">
                        <XCircle className="w-3.5 h-3.5 text-[#BA1A1A]" />
                        {ans?.selectedOption ? 'Incorrecta' : 'Sin responder'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Context text */}
                {q.contextText && (
                  <div className="p-3.5 bg-[#F7F9FC] rounded-xl text-xs text-[#43474E] leading-relaxed border-l-3 border-[#0B2F64] font-serif">
                    {q.contextText}
                  </div>
                )}

                {/* Prompt */}
                <p className="text-sm font-semibold text-[#191C1E]">{q.prompt}</p>

                {/* Options grid */}
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isOptionCorrect = opt.id === q.correctAnswer;
                    const isUserSelected = ans?.selectedOption === opt.id;

                    let optBg = 'bg-white border-[#E1E7F0] text-[#191C1E]';
                    if (isOptionCorrect) {
                      optBg = 'bg-[#AFF2D4]/40 border-[#00875A] text-[#002113] font-semibold';
                    } else if (isUserSelected && !isOptionCorrect) {
                      optBg = 'bg-[#FFDAD6]/40 border-[#BA1A1A] text-[#410002]';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${optBg}`}
                      >
                        <span className="w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono text-[11px] shrink-0 bg-white shadow-xs">
                          {opt.id}
                        </span>
                        <div className="flex-1">
                          <span>{opt.text}</span>
                          {isUserSelected && !isOptionCorrect && (
                            <span className="ml-2 text-[10px] text-[#BA1A1A] font-bold">
                              (Tu respuesta)
                            </span>
                          )}
                          {isOptionCorrect && (
                            <span className="ml-2 text-[10px] text-[#00875A] font-bold">
                              (Respuesta oficial ICFES)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Step by step explanation */}
                <div className="mt-3 p-4 bg-[#F0F4FC] rounded-xl text-xs text-[#001944] space-y-2 border border-[#DCE4F9]">
                  <div className="flex items-center gap-1.5 font-bold text-[#0B2F64]">
                    <Sparkles className="w-4 h-4 text-[#00668B]" />
                    <span>Justificación Pedagógica ICFES:</span>
                  </div>
                  <p className="leading-relaxed">{q.explanation}</p>
                  {q.distractorAnalysis && (
                    <div className="pt-2 border-t border-[#DCE4F9]/60 text-[11px] text-[#43474E] space-y-1">
                      <span className="font-semibold block text-[#0B2F64]">
                        Análisis de distractores:
                      </span>
                      {Object.entries(q.distractorAnalysis).map(([letter, distText]) => (
                        <p key={letter}>
                          <strong className="font-mono">{letter}:</strong> {distText}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </M3Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // VISTA ACTIVA DEL SIMULACRO EN CURSO
  // ==========================================
  const currentAreaInfo = OFFICIAL_AREAS.find((a) => a.id === currentQuestion.area);
  const isTimeCritical = session.timeRemainingSeconds < 300;

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-24">
      {/* Barra superior con Temporizador y Estado */}
      <div className="flex flex-wrap justify-between items-center bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 gap-3">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Simulacro Oficial
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#0B2F64]">
            Prueba Saber 11 - Sesión Única
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Cronómetro */}
          <div
            className={`px-4 py-2 rounded-xl font-mono font-bold text-sm flex items-center gap-1.5 transition-colors ${
              isTimeCritical
                ? 'bg-red-100 text-red-700 animate-pulse'
                : 'bg-[#DCE4F9] text-[#0B2F64]'
            }`}
          >
            <span>⏱</span>
            <span>{formatTime(session.timeRemainingSeconds)}</span>
          </div>

          <button
            onClick={() => setIsTimerPaused(!isTimerPaused)}
            className="text-xs text-[#73777F] hover:text-[#0B2F64] font-medium underline cursor-pointer"
          >
            {isTimerPaused ? 'Reanudar' : 'Pausar'}
          </button>

          {/* Botón de Hoja de Respuestas rápida */}
          <M3Button
            variant="tonal"
            size="small"
            icon={<FileText className="w-3.5 h-3.5" />}
            onClick={() => setIsAnswerSheetOpen(true)}
          >
            Hoja ({answeredCount}/{totalQuestions})
          </M3Button>

          {/* Salir */}
          <button
            onClick={() => setIsExitDialogOpen(true)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Barra de progreso lineal */}
      <M3LinearProgress value={progressPercent} color="tertiary" height={6} />

      {/* Contenedor Animado de la Pregunta Activa */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={slideDirection}>
          <motion.div
            key={currentQuestion.id}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            {/* Tarjeta de Pregunta Activa */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200 space-y-6">
              {/* Encabezado de Pregunta */}
              <div className="flex justify-between items-center text-sm text-slate-500 pb-3 border-b border-slate-100">
                <span className="font-semibold text-slate-700">
                  Pregunta {currentIndex + 1} de {totalQuestions}
                </span>

                <div className="flex items-center gap-2">
                  <span
                    className="font-semibold px-3 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: currentAreaInfo?.containerHex,
                      color: currentAreaInfo?.colorHex,
                    }}
                  >
                    {currentAreaInfo?.name} / {currentQuestion.topic}
                  </span>

                  <button
                    onClick={handleToggleMarkForReview}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      currentAnswer.isMarkedForReview
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        currentAnswer.isMarkedForReview ? 'fill-amber-600 text-amber-600' : ''
                      }`}
                    />
                    <span>{currentAnswer.isMarkedForReview ? 'Dudosa' : 'Marcar'}</span>
                  </button>
                </div>
              </div>

              {/* Texto Guía / Situación Problema */}
              {currentQuestion.contextText && (
                <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-100 font-serif text-slate-800 leading-relaxed text-sm">
                  <p className="text-xs font-sans font-bold text-[#0B2F64] mb-2 tracking-wide uppercase">
                    TEXTO GUÍA / SITUACIÓN PROBLEMA
                  </p>
                  {currentQuestion.contextText}
                </div>
              )}

              {/* Enunciado */}
              <h3 className="text-base sm:text-lg font-bold text-[#0B2F64] tracking-tight leading-snug">
                {currentQuestion.prompt}
              </h3>

              {/* Opciones A, B, C, D */}
              <div className="space-y-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = currentAnswer.selectedOption === opt.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer select-none ${
                        isSelected
                          ? 'bg-[#DCE4F9] border-[#0B2F64] text-[#0B2F64] font-semibold shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                          isSelected ? 'bg-[#0B2F64] text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {opt.id}
                      </span>
                      <span className="text-sm leading-relaxed">
                        {opt.id}. {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Barra de Navegación de Preguntas */}
              <div className="flex justify-between items-center pt-5 border-t border-slate-100">
                <button
                  disabled={currentIndex === 0}
                  onClick={handlePrevQuestion}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold disabled:opacity-40 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Anterior
                </button>

                <span className="text-xs font-mono text-slate-400">
                  {currentIndex + 1} / {totalQuestions}
                </span>

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-xl bg-[#0B2F64] text-white font-semibold shadow-sm hover:bg-[#09234e] transition-colors cursor-pointer"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    onClick={() => setIsFinishDialogOpen(true)}
                    className="px-6 py-2.5 rounded-xl bg-[#00875A] text-white font-semibold shadow-sm hover:bg-[#007049] transition-colors cursor-pointer"
                  >
                    Finalizar y Calificar
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Drawer Hoja de Respuestas (Cuadernillo) */}
      <M3BottomSheet
        isOpen={isAnswerSheetOpen}
        onClose={() => setIsAnswerSheetOpen(false)}
        title="Hoja de Respuestas (Cuadernillo Saber 11)"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#43474E]">
            Selecciona el número para ir a la pregunta o rellena la burbuja correspondiente:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto p-1">
            {session.questions.map((q, idx) => {
              const ans = session.answers[q.id];
              const isSelectedCurrent = currentIndex === idx;

              return (
                <div
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsAnswerSheetOpen(false);
                  }}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                    isSelectedCurrent
                      ? 'border-[#0B2F64] bg-[#DCE4F9]/50'
                      : 'border-[#E1E7F0] bg-white hover:bg-[#F7F9FC]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#43474E] mb-2">
                    <span>#{idx + 1}</span>
                    {ans?.isMarkedForReview && (
                      <Bookmark className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                    )}
                  </div>

                  <div className="flex justify-center gap-1.5">
                    {(['A', 'B', 'C', 'D'] as OptionLetter[]).map((letter) => {
                      const isOptionSelected = ans?.selectedOption === letter;
                      return (
                        <span
                          key={letter}
                          className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center font-mono ${
                            isOptionSelected
                              ? 'bg-[#0B2F64] text-white shadow-xs'
                              : 'bg-[#F0F4FC] text-[#73777F] border border-[#C3C7D0]'
                          }`}
                        >
                          {letter}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E1E7F0] flex justify-end gap-3">
            <M3Button variant="filled" fullWidth onClick={() => setIsAnswerSheetOpen(false)}>
              Continuar respondiendo
            </M3Button>
          </div>
        </div>
      </M3BottomSheet>

      {/* Diálogo de Confirmación para Calificar */}
      <M3Dialog
        isOpen={isFinishDialogOpen}
        onClose={() => setIsFinishDialogOpen(false)}
        title="¿Deseas calificar tu simulacro?"
        description={`Has respondido ${answeredCount} de ${totalQuestions} preguntas.${
          answeredCount < totalQuestions
            ? ` Tienes ${totalQuestions - answeredCount} preguntas sin contestar.`
            : ' ¡Excelente, completaste todo el cuadernillo!'
        }`}
        confirmText="Sí, Calificar Ahora"
        cancelText="Revisar preguntas"
        confirmVariant="success"
        icon={<CheckCircle2 className="w-6 h-6 text-[#00875A]" />}
        onConfirm={handleConfirmFinish}
      />

      {/* Diálogo de Confirmación para Salir */}
      <M3Dialog
        isOpen={isExitDialogOpen}
        onClose={() => setIsExitDialogOpen(false)}
        title="¿Deseas salir del simulacro?"
        description="Si sales ahora, no se registrará la puntuación de esta sesión en tu historial de diagnóstico."
        confirmText="Sí, Salir"
        cancelText="Continuar respondiendo"
        confirmVariant="filled"
        icon={<AlertCircle className="w-6 h-6 text-[#BA1A1A]" />}
        onConfirm={onExit}
      />
    </div>
  );
}
