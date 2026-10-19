/**
 * Dominio de datos para ICFES MASTER - Preparación Pruebas Saber 11
 * Arquitectura Clean: Modelos puros e inmutables.
 */

export const AreaType = {
  MATEMATICAS: 'matematicas',
  LECTURA_CRITICA: 'lectura_critica',
  SOCIALES_CIUDADANAS: 'sociales_ciudadanas',
  CIENCIAS_NATURALES: 'ciencias_naturales',
  INGLES: 'ingles',
} as const;
export type AreaType = (typeof AreaType)[keyof typeof AreaType];

export const OptionLetter = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
} as const;
export type OptionLetter = (typeof OptionLetter)[keyof typeof OptionLetter];

export interface QuestionOption {
  id: OptionLetter;
  text: string;
}

export interface Question {
  id: string;
  area: AreaType;
  topic: string;
  officialCompetency?: string;
  contextText?: string;
  diagramSvg?: string; // Para gráficos y figuras geométricas/físicas integradas
  prompt: string;
  options: QuestionOption[];
  correctAnswer: OptionLetter;
  explanation: string;
  distractorAnalysis?: Partial<Record<OptionLetter, string>>;
  difficulty?: 'Básico' | 'Medio' | 'Avanzado';
}

export interface UserAnswer {
  questionId: string;
  selectedOption: OptionLetter | null;
  isMarkedForReview: boolean;
  timeSpentSeconds: number;
}

export type ExamMode = 'simulacro_completo' | 'simulacro_express' | 'practica_guiada';

export interface ExamSession {
  id: string;
  mode: ExamMode;
  title: string;
  areaFilter?: AreaType;
  questions: Question[];
  answers: Record<string, UserAnswer>;
  startedAt: number;
  completedAt?: number;
  totalDurationSeconds: number;
  timeRemainingSeconds: number;
  isCompleted: boolean;
  finalScore?: number; // Escala ICFES oficial: 0 - 500 puntos
  areaScores?: Record<AreaType, number>; // Escala por área: 0 - 100 puntos
  percentilEstimado?: number; // 1 - 99
}

export interface AreaInfo {
  id: AreaType;
  name: string;
  shortName: string;
  description: string;
  competencies: string[];
  officialWeight: number; // Porcentaje estándar en el cálculo Saber 11
  colorHex: string;
  containerHex: string;
}

export interface UniversityAdmission {
  id: string;
  university: string;
  career: string;
  city: string;
  type: 'Pública' | 'Privada' | 'Programa Estatal';
  requiredScore: number;
  acceptanceRate: string;
  notes: string;
}

export interface FormulaCard {
  id: string;
  area: AreaType;
  topic: string;
  title: string;
  formulaOrRule: string;
  explanation: string;
  example: string;
  icfesTip: string;
}
