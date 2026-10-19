import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  Filter,
  Search,
  RotateCcw,
  GraduationCap,
  Check,
  ChevronRight,
  HelpCircle,
  Flame,
} from 'lucide-react';
import { ExamSession, OptionLetter } from '../../domain/models/ExamTypes';
import { ModuleNavigationHub, MainModuleId } from '../components/m3/ModuleNavigationHub';

export interface IncorrectQuestion {
  id: string;
  area: string;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  topic?: string;
}

export const MOCK_ERRORS: IncorrectQuestion[] = [
  {
    id: 'err-1',
    area: 'Ciencias Naturales (Física)',
    topic: 'Cinemática / MRUA',
    prompt: '¿Cuál es la velocidad que alcanza el automóvil al cabo de los 5 segundos de aceleración?',
    userAnswer: 'A (2 m/s)',
    correctAnswer: 'C (10 m/s)',
    explanation: 'Multiplicaste la aceleración por un valor incorrecto. Recuerda la fórmula cinemática V = a · t => 2 m/s² · 5 s = 10 m/s.'
  },
  {
    id: 'err-2',
    area: 'Matemáticas',
    topic: 'Geometría y Álgebra / Perímetros',
    prompt: '¿Cuáles son las medidas del largo y del ancho del terreno rectangular con perímetro de 60 metros?',
    userAnswer: 'D (40 m y 20 m)',
    correctAnswer: 'A (20 m y 10 m)',
    explanation: 'El perímetro es P = 2(Largo + Ancho) = 60. Si el largo es el doble del ancho (2x + x = 30), el ancho es 10 y el largo es 20.'
  },
  {
    id: 'err-3',
    area: 'Lectura Crítica',
    topic: 'Lectura Crítica / Intención del Autor',
    prompt: 'En el fragmento sobre la inteligencia artificial, ¿cuál es la intención comunicativa principal del autor?',
    userAnswer: 'B (Demostrar la superioridad de la máquina)',
    correctAnswer: 'C (Generar una reflexión ética sobre el uso responsable)',
    explanation: 'El texto cuestiona los dilemas bioéticos y la responsabilidad humana, no busca probar superioridad técnica.'
  },
  {
    id: 'err-4',
    area: 'Sociales y Ciudadanas',
    topic: 'Constitución Política / Mecanismos de Participación',
    prompt: 'Ante la vulneración inminente del derecho fundamental a la salud de un menor, ¿cuál es el mecanismo constitucional expedito y preferente que deben interponer sus tutores legales?',
    userAnswer: 'B (Acción Popular)',
    correctAnswer: 'A (Acción de Tutela)',
    explanation: 'La Acción de Tutela (Artículo 86 de la C.P.) es el mecanismo preferente y sumario para proteger derechos fundamentales directos e inmediatos.'
  },
  {
    id: 'err-5',
    area: 'Inglés',
    topic: 'Gramática / Conectores de Contraste',
    prompt: 'Complete the sentence: "The candidate prepared extensively for the examination; _______, he encountered some completely unprecedented question types."',
    userAnswer: 'C (Moreover)',
    correctAnswer: 'B (However)',
    explanation: 'Se requiere un conector disyuntivo o de contraste ("Sin embargo" / "However") para conectar la exhaustiva preparación con la sorpresa de preguntas imprevistas.'
  }
];

interface ErrorReviewScreenProps {
  onBack?: () => void;
  onNavigateModule?: (module: string) => void;
  onOpenAiTutor?: (promptContext?: string) => void;
  history?: ExamSession[];
}

export function ErrorReviewScreen({
  onBack,
  onNavigateModule,
  onOpenAiTutor,
  history = [],
}: ErrorReviewScreenProps) {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  // Extract mistakes from actual user session history if available
  const sessionErrors = useMemo<IncorrectQuestion[]>(() => {
    if (!history || history.length === 0) return [];
    const extracted: IncorrectQuestion[] = [];

    history.forEach((session) => {
      session.questions.forEach((q) => {
        const userAns = session.answers[q.id];
        if (userAns && userAns.selectedOption && userAns.selectedOption !== q.correctAnswer) {
          const userOptionText = q.options.find((o) => o.id === userAns.selectedOption)?.text || userAns.selectedOption;
          const correctOptionText = q.options.find((o) => o.id === q.correctAnswer)?.text || q.correctAnswer;
          
          extracted.push({
            id: `session-${session.id}-${q.id}`,
            area: q.area === 'ciencias_naturales'
              ? 'Ciencias Naturales'
              : q.area === 'matematicas'
              ? 'Matemáticas'
              : q.area === 'lectura_critica'
              ? 'Lectura Crítica'
              : q.area === 'sociales_ciudadanas'
              ? 'Sociales y Ciudadanas'
              : 'Inglés',
            topic: q.topic,
            prompt: q.prompt,
            userAnswer: `${userAns.selectedOption} (${userOptionText.length > 35 ? userOptionText.slice(0, 35) + '...' : userOptionText})`,
            correctAnswer: `${q.correctAnswer} (${correctOptionText.length > 35 ? correctOptionText.slice(0, 35) + '...' : correctOptionText})`,
            explanation: q.explanation || 'Consulta con el tutor pedagógico para ver el análisis de distractores.',
          });
        }
      });
    });

    return extracted;
  }, [history]);

  // Combine real errors with curated mock errors (ensuring no duplicate prompts)
  const allErrors = useMemo<IncorrectQuestion[]>(() => {
    const combined = [...sessionErrors];
    MOCK_ERRORS.forEach((mock) => {
      if (!combined.some((item) => item.prompt === mock.prompt)) {
        combined.push(mock);
      }
    });
    return combined;
  }, [sessionErrors]);

  // Filter errors
  const filteredErrors = useMemo(() => {
    return allErrors.filter((item) => {
      const matchesArea =
        selectedArea === 'all' ||
        item.area.toLowerCase().includes(selectedArea.toLowerCase());
      const matchesSearch =
        item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.topic && item.topic.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.explanation.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesArea && matchesSearch;
    });
  }, [allErrors, selectedArea, searchTerm]);

  const toggleMastered = (id: string) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getAreaBadgeColor = (area: string) => {
    const lower = area.toLowerCase();
    if (lower.includes('ciencias')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (lower.includes('mate')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (lower.includes('lectura')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (lower.includes('sociales')) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (lower.includes('inglés') || lower.includes('ingles')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* M3 Module Navigation Hub */}
      {onNavigateModule && (
        <ModuleNavigationHub
          currentModule="errores"
          onNavigate={(mod) => onNavigateModule(mod)}
          title="Banco de Errores & Refuerzo Pedagógico"
          description="Aprende de tus respuestas equivocadas con explicaciones pedagógicas de distractores y estrategias Saber 11."
          badge="Refuerzo Inteligente"
          badgeColor="tertiary"
        />
      )}

      {/* Encabezado y Navegación */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Volver"
              className="p-2 rounded-xl text-slate-500 hover:text-[#0B2F64] hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#00875A] uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Refuerzo Inteligente
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {masteredIds.size} de {allErrors.length} superados
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B2F64] mt-0.5 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              Banco de Errores y Repaso
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Aprende de tus respuestas equivocadas con explicaciones pedagógicas y estrategias de descarte ICFES.
            </p>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-2">
          {onOpenAiTutor && (
            <button
              onClick={() => onOpenAiTutor('Explícame cómo analizar y no volver a equivocarme en mis fallos del simulacro')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00875A] to-[#0B2F64] text-white text-xs font-semibold shadow-xs hover:opacity-95 transition-opacity"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Pedir Consejo al Tutor</span>
            </button>
          )}
        </div>
      </div>

      {/* Barra de Estadísticas de Aprendizaje */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Fallos Registrados</span>
            <p className="text-lg font-bold text-slate-800">{allErrors.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Conceptos Superados</span>
            <p className="text-lg font-bold text-slate-800">{masteredIds.size}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Tasa de Recuperación</span>
            <p className="text-lg font-bold text-slate-800">
              {allErrors.length > 0 ? Math.round((masteredIds.size / allErrors.length) * 100) : 100}%
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium">Nivel de Retención</span>
            <p className="text-lg font-bold text-[#00875A]">Alto</p>
          </div>
        </div>
      </div>

      {/* Controles de Búsqueda y Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por pregunta, fórmula, concepto o explicación..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0B2F64] focus:bg-white transition-all"
            />
          </div>

          {/* Chips de Área */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'ciencias', label: 'Ciencias' },
              { id: 'mate', label: 'Matemáticas' },
              { id: 'lectura', label: 'Lectura' },
              { id: 'sociales', label: 'Sociales' },
              { id: 'ingles', label: 'Inglés' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedArea(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedArea === tab.id
                    ? 'bg-[#0B2F64] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listado de Preguntas Incorrectas */}
      <div className="space-y-4">
        {filteredErrors.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              ¡Sin fallos en esta categoría!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No tienes preguntas incorrectas registradas con este criterio de búsqueda o filtro. ¡Excelente avance!
            </p>
          </div>
        ) : (
          filteredErrors.map((item, index) => {
            const isMastered = masteredIds.has(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-xs ${
                  isMastered
                    ? 'border-emerald-300 bg-emerald-50/20 opacity-80'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Cabecera del error */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getAreaBadgeColor(
                        item.area
                      )}`}
                    >
                      {item.area}
                    </span>
                    {item.topic && (
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.topic}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleMastered(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                      isMastered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isMastered ? 'Superado' : 'Marcar Superado'}</span>
                  </button>
                </div>

                {/* Pregunta */}
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug mb-4">
                  {item.prompt}
                </h3>

                {/* Comparación de respuestas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {/* Respuesta del Usuario */}
                  <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200/80 flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                        Tu Respuesta (Incorrecta)
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-rose-900">
                        {item.userAnswer}
                      </p>
                    </div>
                  </div>

                  {/* Respuesta Correcta */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                        Respuesta Correcta ICFES
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-emerald-900">
                        {item.correctAnswer}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Explicación Pedagógica */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 space-y-1.5 mb-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0B2F64] uppercase tracking-wide">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Análisis Pedagógico & Descarte:</span>
                  </div>
                  <p className="leading-relaxed">{item.explanation}</p>
                </div>

                {/* Botones de acción complementarios */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Clave Saber 11: Descartar distractores por escala y contexto
                  </span>

                  <div className="flex items-center gap-2">
                    {onOpenAiTutor && (
                      <button
                        onClick={() =>
                          onOpenAiTutor(
                            `Tengo dudas con esta pregunta de ${item.area}: "${item.prompt}". Mi respuesta fue ${item.userAnswer} y la correcta es ${item.correctAnswer}. Explícame el concepto con más detalle y dame una regla mnemotécnica.`
                          )
                        }
                        className="inline-flex items-center gap-1 text-[#00875A] hover:text-[#006241] font-semibold transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Profundizar con Tutor Eider</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
