import {
  AreaInfo,
  AreaType,
  ExamMode,
  ExamSession,
  FormulaCard,
  Question,
  UniversityAdmission,
} from '../domain/models/ExamTypes';
import { IExamRepository } from '../domain/repository/ExamRepository';
import { SAMPLE_QUESTIONS } from './local/sampleQuestions';
import { EXPANDED_SAMPLE_QUESTIONS } from './local/expandedQuestions';
import { MORE_SAMPLE_QUESTIONS } from './local/moreQuestions';
import { STUDY_FORMULAS } from './local/studyNotes';
import { UNIVERSITY_CUTOFFS } from './local/scholarshipsData';

const STORAGE_KEY = 'icfes_master_sessions_v2';

export const OFFICIAL_AREAS: AreaInfo[] = [
  {
    id: 'matematicas',
    name: 'Matemáticas',
    shortName: 'Mat',
    description: 'Álgebra, geometría, trigonometría, estadística y probabilidad para resolución de problemas.',
    competencies: [
      'Interpretación y Representación',
      'Formulación y Ejecución',
      'Argumentación y Justificación',
    ],
    officialWeight: 3,
    colorHex: '#0B2F64',
    containerHex: '#DCE4F9',
  },
  {
    id: 'lectura_critica',
    name: 'Lectura Crítica',
    shortName: 'L. Crítica',
    description: 'Comprensión textual de textos literarios, argumentativos, filosóficos y discontinuos.',
    competencies: [
      'Identificar contenidos locales',
      'Comprender el sentido global del texto',
      'Reflexión sobre el contenido y la forma',
    ],
    officialWeight: 3,
    colorHex: '#00668B',
    containerHex: '#C4E7FF',
  },
  {
    id: 'ciencias_naturales',
    name: 'Ciencias Naturales',
    shortName: 'C. Naturales',
    description: 'Física, química, biología y CTS (Ciencia, Tecnología y Sociedad) en contextos reales.',
    competencies: [
      'Uso comprensivo del conocimiento',
      'Explicación de fenómenos',
      'Indagación y modelamiento',
    ],
    officialWeight: 3,
    colorHex: '#00875A',
    containerHex: '#AFF2D4',
  },
  {
    id: 'sociales_ciudadanas',
    name: 'Sociales y Ciudadanas',
    shortName: 'Sociales',
    description: 'Historia, geografía, Constitución de 1991, multiperspectivismo y competencias ciudadanas.',
    competencies: [
      'Pensamiento social',
      'Interpretación y análisis de perspectivas',
      'Pensamiento reflexivo y sistémico',
    ],
    officialWeight: 3,
    colorHex: '#B3261E',
    containerHex: '#FFDAD6',
  },
  {
    id: 'ingles',
    name: 'Inglés',
    shortName: 'Inglés',
    description: 'Competencia comunicativa según el Marco Común Europeo (Niveles A1, A2, B1, B+).',
    competencies: [
      'Avisos cotidianos',
      'Vocabulario en contexto',
      'Lectura inferencial y gramática',
    ],
    officialWeight: 1,
    colorHex: '#5B4EB1',
    containerHex: '#E5DEFF',
  },
];

export class ExamRepositoryImpl implements IExamRepository {
  private questions: Question[] = [
    ...SAMPLE_QUESTIONS,
    ...EXPANDED_SAMPLE_QUESTIONS.filter(
      (eq) => !SAMPLE_QUESTIONS.some((sq) => sq.id === eq.id)
    ),
    ...MORE_SAMPLE_QUESTIONS.filter(
      (mq) => !SAMPLE_QUESTIONS.some((sq) => sq.id === mq.id) &&
              !EXPANDED_SAMPLE_QUESTIONS.some((eq) => eq.id === mq.id)
    ),
  ];
  private formulas: FormulaCard[] = STUDY_FORMULAS;
  private universities: UniversityAdmission[] = UNIVERSITY_CUTOFFS;

  getAreas(): AreaInfo[] {
    return OFFICIAL_AREAS;
  }

  getAreaInfo(area: AreaType): AreaInfo | undefined {
    return OFFICIAL_AREAS.find((a) => a.id === area);
  }

  getQuestionsByArea(area: AreaType): Question[] {
    return this.questions.filter((q) => q.area === area);
  }

  getAllQuestions(): Question[] {
    return [...this.questions];
  }

  createExamSession(mode: ExamMode, area?: AreaType): ExamSession {
    let sessionQuestions: Question[] = [];

    if (mode === 'practica_guiada' && area) {
      sessionQuestions = this.getQuestionsByArea(area);
    } else if (mode === 'simulacro_express') {
      // Tomamos 1 o 2 preguntas por área para un test rápido
      const shuffled = [...this.questions].sort(() => 0.5 - Math.random());
      sessionQuestions = shuffled.slice(0, 8);
    } else {
      // Simulacro completo con distribución equilibrada
      sessionQuestions = [...this.questions];
    }

    // Inicializamos respuestas vacías
    const initialAnswers: Record<string, any> = {};
    sessionQuestions.forEach((q) => {
      initialAnswers[q.id] = {
        questionId: q.id,
        selectedOption: null,
        isMarkedForReview: false,
        timeSpentSeconds: 0,
      };
    });

    const durationSeconds =
      mode === 'simulacro_express'
        ? 15 * 60 // 15 minutos
        : mode === 'practica_guiada'
        ? 30 * 60 // 30 minutos sin presión estricta
        : 45 * 60; // 45 minutos para el simulacro completo en web

    const session: ExamSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      mode,
      title:
        mode === 'practica_guiada' && area
          ? `Práctica Guiada: ${this.getAreaInfo(area)?.name || area}`
          : mode === 'simulacro_express'
          ? 'Simulacro Exprés Saber 11'
          : 'Simulacro General Saber 11',
      areaFilter: area,
      questions: sessionQuestions,
      answers: initialAnswers,
      startedAt: Date.now(),
      totalDurationSeconds: durationSeconds,
      timeRemainingSeconds: durationSeconds,
      isCompleted: false,
    };

    return session;
  }

  saveExamSession(session: ExamSession): void {
    try {
      const history = this.getExamHistory();
      const existingIdx = history.findIndex((s) => s.id === session.id);
      if (existingIdx >= 0) {
        history[existingIdx] = session;
      } else {
        history.unshift(session);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 25)));
    } catch {
      // Silently handle if storage quota is full or unavailable
    }
  }

  getExamHistory(): ExamSession[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  getFormulaCards(area?: AreaType): FormulaCard[] {
    if (!area) return this.formulas;
    return this.formulas.filter((f) => f.area === area);
  }

  getUniversityAdmissions(minScore?: number): UniversityAdmission[] {
    if (!minScore) return this.universities;
    return this.universities.filter((u) => u.requiredScore <= minScore);
  }

  calculateIcfesScore(session: ExamSession): {
    globalScore: number;
    areaScores: Record<AreaType, number>;
    percentil: number;
    correctCount: number;
    totalCount: number;
  } {
    const areaStats: Record<AreaType, { correct: number; total: number }> = {
      matematicas: { correct: 0, total: 0 },
      lectura_critica: { correct: 0, total: 0 },
      ciencias_naturales: { correct: 0, total: 0 },
      sociales_ciudadanas: { correct: 0, total: 0 },
      ingles: { correct: 0, total: 0 },
    };

    let totalCorrect = 0;
    const totalQuestions = session.questions.length;

    session.questions.forEach((q) => {
      const ans = session.answers[q.id];
      const isCorrect = ans && ans.selectedOption === q.correctAnswer;
      areaStats[q.area].total += 1;
      if (isCorrect) {
        areaStats[q.area].correct += 1;
        totalCorrect += 1;
      }
    });

    // Puntuación por área en escala 0-100 oficial ICFES
    const areaScores: Record<AreaType, number> = {
      matematicas: 0,
      lectura_critica: 0,
      ciencias_naturales: 0,
      sociales_ciudadanas: 0,
      ingles: 0,
    };

    let weightedSum = 0;
    let totalWeight = 0;

    (Object.keys(areaStats) as AreaType[]).forEach((area) => {
      const stat = areaStats[area];
      const weight = OFFICIAL_AREAS.find((a) => a.id === area)?.officialWeight || 3;
      
      // Si no hubo preguntas de esa área en esta sesión específica (ej. práctica guiada de una sola área)
      const ratio = stat.total > 0 ? stat.correct / stat.total : 0.7; // baseline proporcional
      
      // Transformación a escala ICFES: 15 puntos base mínimos a 100 máximos
      const score100 = Math.round(15 + ratio * 85);
      areaScores[area] = score100;

      weightedSum += score100 * weight;
      totalWeight += weight;
    });

    // Ponderación estándar colombiana ICFES (peso 3 para Mat, Lec, Cie, Soc y peso 1 para Ing => 13 pesos)
    // Multiplicado por 5 da la escala global de 0 a 500 puntos
    const averageScore100 = weightedSum / totalWeight;
    const globalScore = Math.min(500, Math.max(0, Math.round(averageScore100 * 5)));

    // Estimación estadística del percentil nacional en Colombia:
    // Media histórica nacional colombiana ≈ 252, desviación estándar ≈ 48
    const z = (globalScore - 252) / 48;
    const percentil = Math.min(99, Math.max(1, Math.round(this.cumulativeNormalDistribution(z) * 100)));

    return {
      globalScore,
      areaScores,
      percentil,
      correctCount: totalCorrect,
      totalCount: totalQuestions,
    };
  }

  private cumulativeNormalDistribution(z: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp((-z * z) / 2);
    let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if (z > 0) p = 1 - p;
    return p;
  }
}

export const examRepository = new ExamRepositoryImpl();
