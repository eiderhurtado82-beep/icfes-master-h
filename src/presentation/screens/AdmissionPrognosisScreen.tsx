import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  School,
  TrendingUp,
  Award
} from 'lucide-react';

export interface UniversityOption {
  id: string;
  universityName: string;
  program: string;
  requiredScore: number;
  status: 'Alta Probabilidad' | 'En Límite' | 'Requiere Refuerzo';
  colorClass: string;
}

export const MOCK_UNIVERSITIES: UniversityOption[] = [
  {
    id: '101',
    universityName: 'Universidad Nacional de Colombia',
    program: 'Ingeniería de Sistemas (Medellín / Bogotá)',
    requiredScore: 350,
    status: 'Alta Probabilidad',
    colorClass: 'bg-emerald-50 border-emerald-200 text-emerald-900 badge-emerald'
  },
  {
    id: '102',
    universityName: 'Universidad de Antioquia (UdeA)',
    program: 'Medicina / Ciencias de la Salud',
    requiredScore: 390,
    status: 'En Límite',
    colorClass: 'bg-amber-50 border-amber-200 text-amber-900'
  },
  {
    id: '103',
    universityName: 'Universidad del Valle',
    program: 'Ingeniería Industrial y Tecnologías',
    requiredScore: 320,
    status: 'Alta Probabilidad',
    colorClass: 'bg-emerald-50 border-emerald-200 text-emerald-900'
  },
  {
    id: '104',
    universityName: 'Universidad Industrial de Santander (UIS)',
    program: 'Derecho / Ciencias Políticas',
    requiredScore: 340,
    status: 'Alta Probabilidad',
    colorClass: 'bg-emerald-50 border-emerald-200 text-emerald-900'
  }
];

interface AdmissionPrognosisScreenProps {
  onBack?: () => void;
  onNavigateModule?: (module: string) => void;
}

export function AdmissionPrognosisScreen({ onBack, onNavigateModule }: AdmissionPrognosisScreenProps = {}) {
  const [estimatedScore, setEstimatedScore] = useState(375);
  const [downloading, setDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDownloadPdf = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      showToast('¡Reporte diagnóstico oficial en PDF generado y descargado con éxito!');
    }, 1500);
  };

  const eligibleCount = MOCK_UNIVERSITIES.filter(u => estimatedScore >= u.requiredScore).length;

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

      {/* Encabezado del Módulo 2 */}
      <div className="bg-[#0B2F64] text-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-blue-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#AFF2D4] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
              Módulo 2 · Semáforo y Pronóstico de Admisión
            </span>
          </div>
          <h2 className="text-2xl font-black mt-2">Simulador de Ingreso a Universidades Públicas</h2>
          <p className="text-xs text-blue-200 mt-1 max-w-xl">
            Proyección basada en tu puntaje global estimado y ponderación oficial de admisiones Saber 11.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-blue-950 p-4 rounded-2xl border border-blue-800 text-center shadow-inner">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
              PUNTAJE GLOBAL ESTIMADO
            </span>
            <span className="text-3xl font-black text-emerald-400">
              {estimatedScore} <span className="text-xs font-normal text-slate-300">/ 500 pts</span>
            </span>
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

      {/* Control deslizante de prueba para simular puntajes */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center text-xs font-bold text-[#0B2F64]">
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#00875A]" />
            <span>Ajusta tu Puntaje Global de Simulacro:</span>
          </span>
          <span className="font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-sm font-black border border-emerald-200">
            {estimatedScore} Puntos ({eligibleCount} de {MOCK_UNIVERSITIES.length} carreras habilitadas)
          </span>
        </div>
        <input 
          type="range" 
          min="250" 
          max="480" 
          step="5"
          value={estimatedScore} 
          onChange={(e) => setEstimatedScore(Number(e.target.value))}
          className="w-full accent-[#00875A] cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>250 pts (Básico)</span>
          <span>350 pts (Competitivo)</span>
          <span>480 pts (Élite / Generación E)</span>
        </div>
      </div>

      {/* Listado de Universidades con Semáforo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_UNIVERSITIES.map((uni, idx) => {
          const isEligible = estimatedScore >= uni.requiredScore;
          const delta = estimatedScore - uni.requiredScore;
          return (
            <motion.div 
              key={uni.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 bg-[#DCE4F9] text-[#0B2F64] rounded-md">
                    ID: {uni.id}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isEligible ? '✓ Alta Probabilidad' : '⚠ Requiere Subir Puntaje'}
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#0B2F64]">{uni.universityName}</h3>
                <p className="text-xs text-slate-500">{uni.program}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-500">
                  Puntaje histórico de corte: <strong className="font-mono text-[#0B2F64]">{uni.requiredScore} pts</strong>
                </span>
                <span className={`font-mono text-[11px] font-bold ${isEligible ? 'text-[#00875A]' : 'text-amber-700'}`}>
                  {delta >= 0 ? `+${delta} pts holgura` : `${delta} pts faltantes`}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tarjeta de Elegibilidad Generación E y Reporte PDF */}
      <div className="bg-gradient-to-br from-[#0B2F64] to-[#123E82] text-white p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border border-blue-900">
        <div className="space-y-2 max-w-xl">
          <span className="text-[10px] font-bold text-[#AFF2D4] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
            Elegibilidad Becas de Excelencia
          </span>
          <h3 className="text-xl font-black">Apto para Matrícula Cero y Apoyo de Sostenimiento</h3>
          <p className="text-xs text-blue-100 leading-relaxed">
            Con tu puntaje actual de <strong className="text-[#AFF2D4]">{estimatedScore} puntos</strong>, cumples holgadamente con los percentiles requeridos por el Ministerio de Educación Nacional para programas de acceso a educación superior pública colombiana.
          </p>
        </div>
        <button
          onClick={handleDownloadPdf}
          disabled={downloading}
          className="px-6 py-4 bg-[#AFF2D4] text-[#0B2F64] font-black rounded-2xl text-xs hover:bg-[#98e6c4] transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-75 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Generando PDF...' : '📄 Descargar Boletín Diagnóstico PDF'}</span>
        </button>
      </div>
    </div>
  );
}
