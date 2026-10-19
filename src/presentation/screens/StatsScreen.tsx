import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  GraduationCap,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import { ExamSession } from '../../domain/models/ExamTypes';
import { OFFICIAL_AREAS } from '../../data/ExamRepositoryImpl';
import { ModuleNavigationHub, MainModuleId } from '../components/m3/ModuleNavigationHub';
import { M3LinearProgress } from '../components/m3/M3ProgressBar';

export interface UniversityItem {
  id: string;
  name: string;
  city: string;
  minScore: number;
  logoBg: string;
  type: 'Pública' | 'Privada' | 'Beca Estatal';
  description: string;
}

export const UNIVERSITIES_DATA: UniversityItem[] = [
  {
    id: 'unal',
    name: 'Universidad Nacional de Colombia',
    city: 'Bogotá / Sedes Nacionales',
    minScore: 340,
    logoBg: 'bg-emerald-100 text-emerald-800',
    type: 'Pública',
    description: 'Exige un puntaje competitivo en Matemáticas y Lectura Crítica mediante el examen de admisión institucional.',
  },
  {
    id: 'udea',
    name: 'Universidad de Antioquia (UdeA)',
    city: 'Medellín / Antioquia',
    minScore: 310,
    logoBg: 'bg-amber-100 text-amber-800',
    type: 'Pública',
    description: 'Valora fuertemente el componente de competencias ciudadanas y ciencias naturales en programas de salud e ingeniería.',
  },
  {
    id: 'uniandes',
    name: 'Universidad de los Andes',
    city: 'Bogotá D.C.',
    minScore: 360,
    logoBg: 'bg-blue-100 text-blue-800',
    type: 'Privada',
    description: 'Elegible para becas parciales y programas de apoyo financiero como "Quiero Estudiar" con puntajes superiores a 360.',
  },
  {
    id: 'uis',
    name: 'Universidad Industrial de Santander (UIS)',
    city: 'Bucaramanga',
    minScore: 300,
    logoBg: 'bg-indigo-100 text-indigo-800',
    type: 'Pública',
    description: 'Referente académico en ingenierías y ciencias exactas en el oriente colombiano.',
  },
  {
    id: 'univalle',
    name: 'Universidad del Valle',
    city: 'Cali / Valle del Cauca',
    minScore: 295,
    logoBg: 'bg-purple-100 text-purple-800',
    type: 'Pública',
    description: 'Alta ponderación en el núcleo común de ciencias y matemáticas para carreras de alta demanda.',
  },
  {
    id: 'javeriana',
    name: 'Pontificia Universidad Javeriana',
    city: 'Bogotá / Cali',
    minScore: 330,
    logoBg: 'bg-sky-100 text-sky-800',
    type: 'Privada',
    description: 'Becas por excelencia académica ICFES a los mejores bachilleres de cada departamento.',
  },
  {
    id: 'utp',
    name: 'Universidad Tecnológica de Pereira (UTP)',
    city: 'Pereira / Eje Cafetero',
    minScore: 290,
    logoBg: 'bg-teal-100 text-teal-800',
    type: 'Pública',
    description: 'Destacada en ingenierías y programas de medicina con alta inserción laboral.',
  },
];

interface StatsScreenProps {
  history?: ExamSession[];
  onNavigateModule?: (module: MainModuleId | 'home') => void;
  onStartSimulacro?: () => void;
}

export function StatsScreen({
  history = [],
  onNavigateModule,
  onStartSimulacro,
}: StatsScreenProps = {}) {
  const latestSession = history.length > 0 ? history[0] : null;
  const initialScore = latestSession?.finalScore ?? 345;

  // Estado interactivo para simular el puntaje global del estudiante (0 a 500)
  const [userScore, setUserScore] = useState<number>(initialScore);
  const [selectedFilter, setSelectedFilter] = useState<string>('Todas');

  // Cálculo estimado de percentil nacional y becas
  const estimatedPercentile = Math.min(99, Math.max(1, Math.round(((userScore - 200) / 300) * 85 + 15)));
  const isEligibleGeneracionE = userScore >= 345;

  const filteredUnis = UNIVERSITIES_DATA.filter((uni) => {
    if (selectedFilter === 'Todas') return true;
    if (selectedFilter === 'Públicas') return uni.type === 'Pública';
    if (selectedFilter === 'Privadas') return uni.type === 'Privada';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 pb-28">
      {/* Hub de Navegación entre Módulos */}
      {onNavigateModule && (
        <ModuleNavigationHub
          currentModule="stats"
          onNavigate={(mod) => onNavigateModule(mod)}
          title="Diagnóstico & Simulador de Admisión"
          description="Simula tu puntaje global Saber 11 para evaluar tu percentil nacional y tu elegibilidad en universidades públicas, privadas y programas de becas."
          badge="Análisis Predictivo"
          badgeColor="secondary"
          actionButton={
            onStartSimulacro && (
              <button
                onClick={onStartSimulacro}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B2F64] text-white rounded-xl text-xs font-bold hover:bg-[#001944] transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Nuevo Simulacro
              </button>
            )
          }
        />
      )}

      {/* Encabezado del Módulo */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-[#00875A] uppercase tracking-wider">
              Análisis Predictivo
            </span>
            <h2 className="text-xl font-bold text-[#0B2F64]">
              Diagnóstico y Simulador de Admisión
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Simula tu puntaje global Saber 11 para evaluar tu elegibilidad en universidades públicas, privadas y programas de becas del gobierno.
            </p>
          </div>
          {latestSession && (
            <button
              onClick={() => setUserScore(latestSession.finalScore ?? 345)}
              className="inline-flex items-center gap-1.5 text-xs text-[#0B2F64] font-semibold bg-[#DCE4F9] px-3 py-1.5 rounded-xl self-start sm:self-auto hover:bg-[#c9d6f8] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Restablecer a mi último puntaje ({latestSession.finalScore} pts)
            </button>
          )}
        </div>

        {/* Control Deslizante de Puntaje */}
        <div className="p-5 bg-[#F7F9FC] rounded-2xl border border-slate-200 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[#0B2F64] uppercase tracking-wide">
              Puntaje Global Proyectado (0 - 500)
            </span>
            <span className="text-2xl font-black text-[#0B2F64] font-mono bg-[#DCE4F9] px-4 py-1 rounded-xl">
              {userScore} <span className="text-xs font-normal text-slate-600">pts</span>
            </span>
          </div>

          <input
            type="range"
            min="200"
            max="450"
            step="5"
            value={userScore}
            onChange={(e) => setUserScore(Number(e.target.value))}
            className="w-full accent-[#0B2F64] cursor-pointer h-2 bg-slate-200 rounded-lg"
          />

          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>200 pts (Básico)</span>
            <span>345 pts (Meta Becas)</span>
            <span>450 pts (Élite)</span>
          </div>
        </div>

        {/* Tarjetas de Indicadores Clave */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-[#DCE4F9]/40 rounded-2xl border border-[#0B2F64]/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0B2F64] text-white flex items-center justify-center font-black text-lg shrink-0">
              📈
            </div>
            <div>
              <p className="text-xs font-bold text-[#0B2F64] uppercase">Percentil Nacional Estimado</p>
              <p className="text-2xl font-black text-[#0B2F64]">Top {estimatedPercentile}%</p>
              <p className="text-[11px] text-slate-600">Superas al {100 - estimatedPercentile}% de los aspirantes en Colombia.</p>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
              isEligibleGeneracionE
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0 ${
                isEligibleGeneracionE ? 'bg-[#00875A] text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              🎓
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-700">Elegibilidad Generación E / Renta Joven</p>
              <p
                className={`text-sm font-bold ${
                  isEligibleGeneracionE ? 'text-emerald-800' : 'text-slate-600'
                }`}
              >
                {isEligibleGeneracionE
                  ? '✓ Alta probabilidad de acceso'
                  : '⚠ Requiere superar 345 pts'}
              </p>
              <p className="text-[11px] text-slate-500">Subsidio de sostenimiento y matrícula cero.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desglose por Competencias Oficiales (si hay historial) */}
      {latestSession && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0B2F64]">
              Desglose de Competencias (Último Simulacro)
            </h3>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              Promedio: {Math.round(userScore / 5)} / 100
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {OFFICIAL_AREAS.map((area) => {
              const baseScore =
                latestSession.areaScores?.[area.id] ?? Math.round(userScore / 5);
              return (
                <div key={area.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700">{area.name}</span>
                    <span className="font-mono text-[#0B2F64]">{baseScore} / 100</span>
                  </div>
                  <M3LinearProgress
                    value={baseScore}
                    color={baseScore >= 70 ? 'tertiary' : 'primary'}
                    height={6}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Callout directo al Banco de Errores */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 p-5 rounded-3xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              Banco de Errores y Refuerzo Pedagógico
            </h4>
            <p className="text-xs text-slate-600">
              Analiza las preguntas que fallaste en tus simulacros con la estrategia de descarte y la explicación de cada distractor.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateModule?.('errores')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B2F64] hover:bg-[#001944] text-white text-xs font-bold transition-colors shrink-0 shadow-xs cursor-pointer"
        >
          <span>Repasar Mis Fallos</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Listado de Universidades y Probabilidad de Admisión */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-lg text-[#0B2F64]">
            Probabilidad de Admisión por Universidad
          </h3>

          {/* Filtros de Tipo */}
          <div className="flex gap-2">
            {['Todas', 'Públicas', 'Privadas'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === filter
                    ? 'bg-[#0B2F64] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredUnis.map((uni, idx) => {
            const diff = userScore - uni.minScore;
            const isAdmitted = diff >= 0;
            const probability = isAdmitted
              ? Math.min(100, 70 + diff * 2)
              : Math.max(10, 70 + diff * 3);

            return (
              <motion.div
                key={uni.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#0B2F64]/30 hover:shadow-md transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-3 py-0.5 rounded-full ${uni.logoBg}`}
                    >
                      {uni.city}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Puntaje mínimo histórico: {uni.minScore} pts
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-[#0B2F64]">{uni.name}</h4>
                  <p className="text-xs text-slate-600 max-w-xl">{uni.description}</p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-2 shrink-0">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-xl ${
                      isAdmitted ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {isAdmitted ? '✓ Alta Probabilidad' : '⚠ En Zona de Riesgo'}
                  </span>
                  <div className="text-right">
                    <span className="text-lg font-black text-[#0B2F64] font-mono">
                      {probability}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Efectividad de ingreso
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
