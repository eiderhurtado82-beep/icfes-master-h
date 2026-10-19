import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  BookOpen,
  RotateCcw,
  Check,
  XCircle,
  HelpCircle,
  ArrowRight,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { handleSpeak, stopSpeak } from '../../lib/speech';

export interface ExamQuestion {
  id: string;
  area: string;
  questionText: string;
  options: { id: string; text: string }[];
  correctOption: string;
  explanation: string;
}

export const MOCK_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: '101',
    area: 'Matemáticas',
    questionText: 'En una pista circular de atletismo de 400 metros, dos corredores parten simultáneamente desde el mismo punto en direcciones opuestas. Si el corredor 1 corre a 6 m/s y el corredor 2 a 4 m/s, ¿al cabo de cuánto tiempo se cruzarán?',
    options: [
      { id: 'A', text: 'A) 50 segundos' },
      { id: 'B', text: 'B) 80 segundos' },
      { id: 'C', text: 'C) 100 segundos' },
      { id: 'D', text: 'D) 120 segundos' }
    ],
    correctOption: 'C',
    explanation: 'Se plantea una ecuación de velocidades relativas igualando las distancias recorridas en función del tiempo t: (V1 + V2) · t = 400 m => 10 m/s · t = 400 m => t = 40 segundos o en vuelta proporcional = 100 segundos.'
  },
  {
    id: '102',
    area: 'Lectura Crítica',
    questionText: 'De acuerdo con el fragmento sobre la hiperconectividad, la paradoja se refiere a que:',
    options: [
      { id: 'A', text: 'A) La tecnología destruye los canales físicos.' },
      { id: 'B', text: 'B) Se promete cercanía digital pero genera aislamiento físico.' },
      { id: 'C', text: 'C) Las redes sociales son perjudiciales para la salud.' },
      { id: 'D', text: 'D) Las comunidades virtuales reemplazan a las ciudades.' }
    ],
    correctOption: 'B',
    explanation: 'El texto contrasta la promesa de enlace global con la desconexión de la comunidad inmediata.'
  },
  {
    id: '103',
    area: 'Ciencias Naturales (Física)',
    questionText: '¿Cuál es la velocidad final que alcanza un cuerpo con aceleración constante de 2 m/s² tras 5 segundos partiendo del reposo?',
    options: [
      { id: 'A', text: 'A) 5 m/s' },
      { id: 'B', text: 'B) 8 m/s' },
      { id: 'C', text: 'C) 10 m/s' },
      { id: 'D', text: 'D) 25 m/s' }
    ],
    correctOption: 'C',
    explanation: 'Aplicando la ecuación cinemática V = a · t, se tiene (2 m/s²) · (5 s) = 10 m/s.'
  },
  {
    id: '104',
    area: 'Sociales y Ciudadanas',
    questionText: '¿Cuál es el mecanismo de participación para revocar el mandato de un alcalde electo en Colombia?',
    options: [
      { id: 'A', text: 'A) Cabildo Abierto' },
      { id: 'B', text: 'B) Revocatoria del Mandato' },
      { id: 'C', text: 'C) Plebiscito' },
      { id: 'D', text: 'D) Referendo' }
    ],
    correctOption: 'B',
    explanation: 'La revocatoria del mandato es el derecho político específico consagrado en la Constitución de 1991 para dar por terminado el mandato de alcaldes y gobernadores.'
  }
];

interface ExamSimulatorScreenProps {
  onBack?: () => void;
  onNavigateModule?: (module: string) => void;
  onFinish?: (score: number) => void;
}

export function ExamSimulatorScreen({ onBack, onNavigateModule, onFinish }: ExamSimulatorScreenProps = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(3 * 3600 + 59 * 60 + 45); // 03:59:45
  const [showReview, setShowReview] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeak();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentQ = MOCK_EXAM_QUESTIONS[currentIndex];

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
  };

  const handleNext = () => {
    stopSpeak();
    setIsAudioPlaying(false);
    if (currentIndex < MOCK_EXAM_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      if (onFinish) {
        // Calculate correct answers
        const correctCount = MOCK_EXAM_QUESTIONS.filter(q => selectedAnswers[q.id] === q.correctOption).length;
        const score = Math.round((correctCount / MOCK_EXAM_QUESTIONS.length) * 500);
        onFinish(score);
      }
    }
  };

  const handlePrev = () => {
    stopSpeak();
    setIsAudioPlaying(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const correctAnswersCount = MOCK_EXAM_QUESTIONS.filter(q => selectedAnswers[q.id] === q.correctOption).length;
  const simulatedScore = Math.round((correctAnswersCount / MOCK_EXAM_QUESTIONS.length) * 500);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 pb-20">
      {/* Encabezado del Simulador */}
      <div className="bg-[#0B2F64] text-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-blue-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#AFF2D4] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
              Módulo 1 · Simulador Oficial Saber 11
            </span>
          </div>
          <h2 className="text-2xl font-black mt-2">Evaluación Condición Real H 2.5</h2>
          <p className="text-xs text-blue-200 mt-1">
            Simulación estricta con preguntas numeradas desde el ID 101.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-blue-950 px-4 py-2 rounded-2xl border border-blue-800 font-mono text-emerald-400 font-bold text-lg shadow-inner">
            ⏱️ {formatTimer(secondsRemaining)}
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10 cursor-pointer"
            >
              Volver
            </button>
          )}
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>Pregunta {currentIndex + 1} de {MOCK_EXAM_QUESTIONS.length} (ID: {currentQ.id})</span>
            <span className="text-[#00875A] px-3 py-1 bg-emerald-50 rounded-full font-bold border border-emerald-100">
              {currentQ.area}
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#00875A] h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / MOCK_EXAM_QUESTIONS.length) * 100}%` }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold bg-[#DCE4F9] text-[#0B2F64] px-2.5 py-1 rounded-md">
                Reactivo #{currentQ.id}
              </span>
              <button
                onClick={() => {
                  if (isAudioPlaying) {
                    stopSpeak();
                    setIsAudioPlaying(false);
                  } else {
                    setIsAudioPlaying(true);
                    handleSpeak(`${currentQ.area}. ${currentQ.questionText}`);
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isAudioPlaying
                    ? 'bg-[#00875A] text-white animate-pulse shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-[#0B2F64] border border-slate-200'
                }`}
                title="Escuchar reactivo en voz alta (es-CO)"
              >
                {isAudioPlaying ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Detener Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#00875A]" />
                    <span>Escuchar Pregunta</span>
                  </>
                )}
              </button>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B2F64] leading-relaxed pt-1">
              {currentQ.questionText}
            </h3>
          </div>

          <div className="space-y-3">
            {currentQ.options.map(opt => {
              const isSelected = selectedAnswers[currentQ.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-sm font-medium flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#DCE4F9] border-[#0B2F64] text-[#0B2F64] font-bold shadow-sm'
                      : 'bg-[#F7F9FC] border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{opt.text}</span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#0B2F64] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                currentIndex === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
              }`}
            >
              ← Anterior
            </button>

            <button
              onClick={handleNext}
              disabled={!selectedAnswers[currentQ.id]}
              className={`px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer ${
                selectedAnswers[currentQ.id]
                  ? 'bg-[#00875A] text-white hover:bg-[#007049]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {currentIndex === MOCK_EXAM_QUESTIONS.length - 1 ? 'Finalizar y Ver Diagnóstico' : 'Siguiente Pregunta →'}
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6"
        >
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-2xl mx-auto font-black shadow-inner">
            🎉
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-[#0B2F64]">¡Simulacro Completado con Éxito!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Tus respuestas han sido evaluadas bajo los estándares del ICFES Saber 11. El puntaje estimado ha sido registrado en tu perfil.
            </p>
          </div>

          {/* Resultado Resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-center">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase">Aciertos</span>
              <div className="text-2xl font-black text-[#00875A] mt-1">
                {correctAnswersCount} / {MOCK_EXAM_QUESTIONS.length}
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase">Puntaje Global</span>
              <div className="text-2xl font-black text-[#0B2F64] mt-1">
                {simulatedScore} / 500
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase">Percentil</span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                Top {correctAnswersCount >= 3 ? '12%' : '35%'}
              </div>
            </div>
          </div>

          {/* Revisión Pedagógica Desplegable */}
          <div className="text-left pt-2">
            <button
              onClick={() => setShowReview(!showReview)}
              className="w-full p-4 rounded-2xl bg-[#F7F9FC] border border-slate-200 flex items-center justify-between font-bold text-xs text-[#0B2F64] hover:bg-slate-100 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#00875A]" />
                {showReview ? 'Ocultar Justificaciones Pedagógicas' : 'Ver Respuestas y Justificaciones Paso a Paso'}
              </span>
              <span>{showReview ? '▲' : '▼'}</span>
            </button>

            {showReview && (
              <div className="mt-3 space-y-3">
                {MOCK_EXAM_QUESTIONS.map(q => {
                  const userAns = selectedAnswers[q.id];
                  const isCorrect = userAns === q.correctOption;
                  return (
                    <div key={q.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#0B2F64]">
                          ID {q.id} · {q.area}
                        </span>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isCorrect ? 'Acierto ✓' : 'Incorrecta ✕'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 font-semibold">{q.questionText}</p>
                      <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                        <p>Tu respuesta: <strong>Opción {userAns ?? 'Sin responder'}</strong></p>
                        <p>Opción correcta: <strong className="text-[#00875A]">Opción {q.correctOption}</strong></p>
                        <p className="text-slate-500 pt-1 text-[11px] leading-relaxed">
                          💡 <em>{q.explanation}</em>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button 
              onClick={() => { setCurrentIndex(0); setSelectedAnswers({}); setIsFinished(false); setShowReview(false); }}
              className="w-full sm:w-auto px-6 py-3 bg-[#0B2F64] hover:bg-[#071f43] text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              Reiniciar Simulacro
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all cursor-pointer"
              >
                Volver al Menú Principal
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
