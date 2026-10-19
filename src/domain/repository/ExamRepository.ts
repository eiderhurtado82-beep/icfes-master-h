import {
  AreaType,
  ExamSession,
  Question,
  FormulaCard,
  UniversityAdmission,
  AreaInfo,
  ExamMode,
} from '../models/ExamTypes';

export interface IExamRepository {
  getAreas(): AreaInfo[];
  getAreaInfo(area: AreaType): AreaInfo | undefined;
  getQuestionsByArea(area: AreaType): Question[];
  getAllQuestions(): Question[];
  createExamSession(mode: ExamMode, area?: AreaType): ExamSession;
  saveExamSession(session: ExamSession): void;
  getExamHistory(): ExamSession[];
  getFormulaCards(area?: AreaType): FormulaCard[];
  getUniversityAdmissions(minScore?: number): UniversityAdmission[];
  calculateIcfesScore(session: ExamSession): {
    globalScore: number;
    areaScores: Record<AreaType, number>;
    percentil: number;
    correctCount: number;
    totalCount: number;
  };
}
