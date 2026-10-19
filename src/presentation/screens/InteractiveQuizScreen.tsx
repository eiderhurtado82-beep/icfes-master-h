import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Calculator,
  Trophy,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { AreaType, OptionLetter, Question } from '../../domain/models/ExamTypes';
import { examRepository, OFFICIAL_AREAS } from '../../data/ExamRepositoryImpl';
import { M3Card } from '../components/m3/M3Card';
import { M3Button } from '../components/m3/M3Button';
import { M3LinearProgress, M3CircularProgress } from '../components/m3/M3ProgressBar';

import { ModuleNavigationHub, MainModuleId } from '../components/m3/ModuleNavigationHub';

interface InteractiveQuizScreenProps {
  onBackToHome?: () => void;
  onNavigateModule?: (module: MainModuleId | 'home') => void;
}

import type { Variants } from 'framer-motion';

// Variantes de animación de deslizamiento (Slide Animation) con framer-motion
const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.32,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    transition: {
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export const InteractiveQuizScreen: React.FC<InteractiveQuizScreenProps> = ({
  onBackToHome,
  onNavigateModule,
}) => {
  // Materia seleccionada (Matemáticas o Lectura Crítica por defecto)
  const [selectedSubject, setSelectedSubject] = useState<AreaType>('matematicas');

  // Dirección de la animación (1 = avance / siguiente, -1 = reinicio / retroceso)
  const [slideDirection, setSlideDirection] = useState<number>(1);

  // Obtener preguntas filtradas por la materia seleccionada
  const questions: Question[] = examRepository.getQuestionsByArea(selectedSubject);

  // Estados locales del cuestionario
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<OptionLetter | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [historyAnswers, setHistoryAnswers] = useState<
    Array<{
      question: Question;
      userAnswer: OptionLetter;
      isCorrect: boolean;
    }>
  >([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  const currentQuestion = questions[currentIndex];
  const currentAreaInfo = OFFICIAL_AREAS.find((a) => a.id === selectedSubject);

  // Manejador para seleccionar una opción de respuesta (A, B, C, D)
  const handleSelectOption = (option: OptionLetter) => {
    if (isAnswerSubmitted) return;

    setSelectedOption(option);
    setIsAnswerSubmitted(true);

    const isCorrect = option === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setHistoryAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion,
        userAnswer: option,
        isCorrect,
      },
    ]);
  };

  // Manejador para avanzar a la siguiente pregunta con animación hacia adelante
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setSlideDirection(1);
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  // Reiniciar cuestionario con la misma o diferente materia
  const handleRestartQuiz = (newSubject?: AreaType) => {
    setSlideDirection(-1);
    if (newSubject) {
      setSelectedSubject(newSubject);
    }
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setHistoryAnswers([]);
    setIsQuizCompleted(false);
  };

  const progressFraction = ((currentIndex + 1) / questions.length) * 100;

  // ==========================================
  // PANTALLA DE RESUMEN FINAL DE ACIERTOS
  // ==========================================
  if (isQuizCompleted) {
    const totalQuestions = questions.length;
    const accuracyPercent = Math.round((score / totalQuestions) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
        className="space-y-6 pb-24"
      >
        {/* Tarjeta de Felicitación / Resumen General */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0B2F64] via-[#0E3D7E] to-[#00875A] text-white p-6 sm:p-8 shadow-xl text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#AFF2D4] border border-white/15">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>Módulo Interactivo Completado</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Resumen de Respuestas: {currentAreaInfo?.name}
              </h2>
              <p className="text-sm text-blue-100 max-w-md">
                Has finalizado el bloque de preguntas con retroalimentación inmediata tipo Saber 11.
              </p>
            </div>

            {/* Indicador Circular de Aciertos */}
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-5 border border-white/20 flex flex-col items-center shrink-0 min-w-[180px]">
              <span className="text-xs uppercase font-semibold text-blue-200 mb-2">
                Puntaje de Aciertos
              </span>
              <M3CircularProgress
                value={accuracyPercent}
                size={84}
                strokeWidth={8}
                color="tertiary"
                label={`${score}/${totalQuestions}`}
              />
              <span className="text-xs font-bold text-[#AFF2D4] mt-2">
                {accuracyPercent >= 80
                  ? 'Nivel Avanzado'
                  : accuracyPercent >= 60
                  ? 'Nivel Competente'
                  : 'Requiere Refuerzo'}
              </span>
            </div>
          </div>

          {/* Botones de acción post-cuestionario */}
          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap gap-3 justify-center sm:justify-start">
            <M3Button
              variant="elevated"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={() => handleRestartQuiz()}
            >
              Reintentar {currentAreaInfo?.name}
            </M3Button>

            <M3Button
              variant="tonal"
              onClick={() =>
                handleRestartQuiz(
                  selectedSubject === 'matematicas' ? 'lectura_critica' : 'matematicas'
                )
              }
              className="bg-white/20 text-white hover:bg-white/30"
            >
              Cambiar a {selectedSubject === 'matematicas' ? 'Lectura Crítica' : 'Matemáticas'}
            </M3Button>
          </div>
        </div>

        {/* Desglose de cada pregunta respondida con su justificación */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#0B2F64]">
            Revisión Detallada de Preguntas
          </h3>

          {historyAnswers.map((item, idx) => (
            <M3Card key={item.question.id} variant="outlined" className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#E1E7F0] text-[#191C1E] text-xs font-bold flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-[#0B2F64]">
                    {item.question.topic}
                  </span>
                </div>

                {item.isCorrect ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#AFF2D4] text-[#002113] text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00875A]" />
                    Correcta
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFDAD6] text-[#410002] text-xs font-bold">
                    <XCircle className="w-3.5 h-3.5 text-[#BA1A1A]" />
                    Incorrecta
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-[#191C1E]">
                {item.question.prompt}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F7F9FC] border border-[#E1E7F0]">
                  <span className="text-[#73777F] block">Tu respuesta seleccionada:</span>
                  <strong className={item.isCorrect ? 'text-[#00875A]' : 'text-[#BA1A1A]'}>
                    Opción {item.userAnswer}
                  </strong>
                </div>

                <div className="p-2.5 rounded-xl bg-[#AFF2D4]/25 border border-[#AFF2D4]">
                  <span className="text-[#002113] block">Respuesta oficial correcta:</span>
                  <strong className="text-[#00875A]">
                    Opción {item.question.correctAnswer}
                  </strong>
                </div>
              </div>

              <div className="p-3 bg-[#F0F4FC] rounded-xl text-xs text-[#001944] border border-[#DCE4F9]">
                <strong className="block text-[#0B2F64] mb-1">Justificación:</strong>
                <p className="leading-relaxed">{item.question.explanation}</p>
              </div>
            </M3Card>
          ))}
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // VISTA ACTIVA DEL CUESTIONARIO CON ANIMACIÓN SLIDE
  // ==========================================
  const isCorrectAnswer = selectedOption === currentQuestion.correctAnswer;

  return (
    <div className="space-y-4 pb-24 overflow-hidden">
      {/* M3 Module Navigation Hub */}
      <ModuleNavigationHub
        currentModule="cuestionario"
        onNavigate={(mod) => onNavigateModule && onNavigateModule(mod)}
        title="Práctica Guiada Saber 11"
        description="Preguntas oficiales con contexto real, selección A-B-C-D y justificación pedagógica paso a paso."
        badge="Etapa 2 Activa"
        badgeColor="tertiary"
      />

      {/* Selector Rápido de Materias (M3 Segmented / Filter Chips) */}
      <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#E1E7F0] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleRestartQuiz('matematicas')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedSubject === 'matematicas'
                ? 'bg-[#0B2F64] text-white shadow-xs'
                : 'bg-[#F0F4FC] text-[#43474E] hover:bg-[#E1E7F0]'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Matemáticas</span>
          </button>

          <button
            type="button"
            onClick={() => handleRestartQuiz('lectura_critica')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedSubject === 'lectura_critica'
                ? 'bg-[#00668B] text-white shadow-xs'
                : 'bg-[#F0F4FC] text-[#43474E] hover:bg-[#E1E7F0]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Lectura Crítica</span>
          </button>
        </div>

        {/* Contador de aciertos en vivo */}
        <div className="text-xs font-bold text-[#00875A] font-mono bg-[#AFF2D4]/40 px-2.5 py-1 rounded-lg">
          Aciertos: {score} / {questions.length}
        </div>
      </div>

      {/* Barra de progreso M3 en verde/turquesa institucional */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-semibold text-[#43474E]">
          <span className="font-mono text-[#0B2F64]">
            Pregunta {currentIndex + 1} de {questions.length}
          </span>
          <span className="text-[#00875A] font-mono">
            {Math.round(progressFraction)}% completado
          </span>
        </div>
        <M3LinearProgress value={progressFraction} color="tertiary" height={6} />
      </div>

      {/* Contenedor animado con AnimatePresence para transición de deslizamiento (Slide) */}
      <div className="relative">
        <AnimatePresence mode="wait" custom={slideDirection}>
          <motion.div
            key={`${selectedSubject}-${currentQuestion.id}`}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            {/* Tarjeta Principal de la Pregunta */}
            <M3Card variant="elevated" className="p-5 sm:p-7 space-y-5">
              {/* Metadatos institucionales del ICFES */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E1E7F0]">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded-md text-xs font-bold"
                    style={{
                      backgroundColor: currentAreaInfo?.containerHex,
                      color: currentAreaInfo?.colorHex,
                    }}
                  >
                    {currentAreaInfo?.name}
                  </span>
                  <span className="text-xs text-[#73777F] font-medium">
                    {currentQuestion.topic}
                  </span>
                </div>

                <span className="text-[11px] text-[#73777F] font-mono">
                  Dificultad: {currentQuestion.difficulty}
                </span>
              </div>

              {/* 1. Contexto o Texto Guía de la Pregunta */}
              {currentQuestion.contextText && (
                <div className="p-4 sm:p-5 bg-[#F7F9FC] rounded-2xl border border-[#E1E7F0] text-sm text-[#191C1E] leading-relaxed whitespace-pre-line font-serif shadow-xs">
                  <div className="text-[11px] font-bold text-[#0B2F64] uppercase tracking-wider mb-1 font-sans">
                    Texto o Situación Problema
                  </div>
                  {currentQuestion.contextText}
                </div>
              )}

              {/* Enunciado de la Pregunta */}
              <h3 className="text-base sm:text-lg font-bold text-[#0B2F64] tracking-tight leading-snug">
                {currentQuestion.prompt}
              </h3>

              {/* 2. Las 4 Opciones de Respuesta (A, B, C, D) con microinteracciones */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const isOptionCorrect = option.id === currentQuestion.correctAnswer;

                  let cardBackground =
                    'bg-white border-[#C3C7D0] text-[#191C1E] hover:bg-[#F7F9FC] hover:border-[#0B2F64]/40';
                  let badgeBackground = 'bg-[#E1E7F0] text-[#43474E]';

                  if (isAnswerSubmitted) {
                    if (isOptionCorrect) {
                      cardBackground =
                        'bg-[#AFF2D4]/35 border-[#00875A] text-[#002113] font-semibold ring-1 ring-[#00875A]';
                      badgeBackground = 'bg-[#00875A] text-white';
                    } else if (isSelected && !isOptionCorrect) {
                      cardBackground =
                        'bg-[#FFDAD6]/40 border-[#BA1A1A] text-[#410002] ring-1 ring-[#BA1A1A]';
                      badgeBackground = 'bg-[#BA1A1A] text-white';
                    } else {
                      cardBackground = 'bg-white border-[#E1E7F0] text-[#73777F] opacity-75';
                    }
                  }

                  return (
                    <motion.button
                      key={option.id}
                      type="button"
                      whileHover={!isAnswerSubmitted ? { scale: 1.008 } : {}}
                      whileTap={!isAnswerSubmitted ? { scale: 0.992 } : {}}
                      onClick={() => handleSelectOption(option.id)}
                      disabled={isAnswerSubmitted}
                      className={`w-full text-left p-4 rounded-2xl border transition-colors duration-150 flex items-start gap-3 select-none cursor-pointer disabled:cursor-default ${cardBackground}`}
                    >
                      {/* Burbuja M3 de Opción */}
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 font-mono transition-colors ${badgeBackground}`}
                      >
                        {option.id}
                      </span>

                      <div className="flex-1 text-sm pt-0.5 leading-relaxed">
                        <span>{option.text}</span>

                        {isAnswerSubmitted && isOptionCorrect && (
                          <span className="block mt-1 text-xs font-bold text-[#00875A] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Opción Correcta Oficial
                          </span>
                        )}
                        {isAnswerSubmitted && isSelected && !isOptionCorrect && (
                          <span className="block mt-1 text-xs font-bold text-[#BA1A1A] flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" />
                            Tu Selección
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* 3. Feedback Inmediato con Justificación y Animación Suave */}
              {isAnswerSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] as const }}
                  className={`p-5 rounded-2xl border space-y-3 ${
                    isCorrectAnswer
                      ? 'bg-[#AFF2D4]/25 border-[#AFF2D4] text-[#002113]'
                      : 'bg-[#FFDAD6]/25 border-[#FFDAD6] text-[#410002]'
                  }`}
                >
                  {/* Banner de Acierto / Error */}
                  <div className="flex items-center gap-2">
                    {isCorrectAnswer ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-[#00875A]" />
                        <span className="text-sm font-bold text-[#00875A]">
                          ¡Excelente! Respuesta correcta.
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-[#BA1A1A]" />
                        <span className="text-sm font-bold text-[#BA1A1A]">
                          Respuesta incorrecta. ¡Analicemos por qué!
                        </span>
                      </>
                    )}
                  </div>

                  {/* Justificación pedagógica */}
                  <div className="p-3.5 bg-white rounded-xl border border-[#E1E7F0] text-xs sm:text-sm text-[#191C1E] space-y-1.5 shadow-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#0B2F64]">
                      <Sparkles className="w-4 h-4 text-[#00668B]" />
                      <span>Justificación Pedagógica:</span>
                    </div>
                    <p className="leading-relaxed">{currentQuestion.explanation}</p>
                  </div>

                  {/* Análisis de descarte de distractores */}
                  {currentQuestion.distractorAnalysis && (
                    <div className="p-3.5 bg-white/80 rounded-xl border border-[#E1E7F0] text-xs text-[#43474E] space-y-1.5">
                      <span className="font-semibold text-[#0B2F64] block">
                        ¿Por qué se descartan las otras opciones?
                      </span>
                      {Object.entries(currentQuestion.distractorAnalysis).map(([letter, distText]) => (
                        <p key={letter}>
                          <strong className="font-mono text-[#0B2F64]">{letter}:</strong> {distText}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* 4. Botón para pasar a la siguiente pregunta */}
                  <div className="pt-2 flex justify-end">
                    <M3Button
                      variant={isCorrectAnswer ? 'success' : 'filled'}
                      size="large"
                      icon={<ArrowRight className="w-4 h-4" />}
                      iconPosition="end"
                      onClick={handleNextQuestion}
                    >
                      {currentIndex < questions.length - 1
                        ? 'Siguiente Pregunta'
                        : 'Ver Resumen de Aciertos'}
                    </M3Button>
                  </div>
                </motion.div>
              )}
            </M3Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
