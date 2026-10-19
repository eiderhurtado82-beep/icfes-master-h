import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Filter,
  Lightbulb,
} from 'lucide-react';
import { AreaType, OptionLetter, Question } from '../../domain/models/ExamTypes';
import { examRepository, OFFICIAL_AREAS } from '../../data/ExamRepositoryImpl';
import { M3Card } from '../components/m3/M3Card';
import { M3Button } from '../components/m3/M3Button';
import { M3Chip } from '../components/m3/M3Chip';

interface PracticeScreenProps {
  initialArea?: AreaType;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({ initialArea }) => {
  const [selectedArea, setSelectedArea] = useState<AreaType | 'all'>(initialArea ?? 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<OptionLetter | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [stats, setStats] = useState<{ correct: number; totalAnswered: number }>({
    correct: 0,
    totalAnswered: 0,
  });

  const allQuestions = examRepository.getAllQuestions();

  const filteredQuestions = allQuestions.filter((q) => {
    if (selectedArea !== 'all' && q.area !== selectedArea) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const currentQuestion: Question | undefined = filteredQuestions[currentIdx];

  const handleSelectOption = (opt: OptionLetter) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(opt);
    setIsAnswerSubmitted(true);

    const isCorrect = opt === currentQuestion?.correctAnswer;
    setStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      totalAnswered: prev.totalAnswered + 1,
    }));
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    if (currentIdx < filteredQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setCurrentIdx(0); // Loop back or reset
    }
  };

  const currentAreaInfo = currentQuestion
    ? OFFICIAL_AREAS.find((a) => a.id === currentQuestion.area)
    : undefined;

  return (
    <div className="space-y-5 pb-24">
      {/* Top Filter Chips Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#E1E7F0] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#0B2F64]" />
            <h2 className="text-sm font-bold text-[#0B2F64]">Filtrar por Área Saber 11</h2>
          </div>
          {stats.totalAnswered > 0 && (
            <span className="text-xs font-semibold text-[#00875A] font-mono">
              Aciertos: {stats.correct}/{stats.totalAnswered} (
              {Math.round((stats.correct / stats.totalAnswered) * 100)}%)
            </span>
          )}
        </div>

        {/* Areas Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <M3Chip
            label="Todas las áreas"
            selected={selectedArea === 'all'}
            onClick={() => {
              setSelectedArea('all');
              setCurrentIdx(0);
              setSelectedAnswer(null);
              setIsAnswerSubmitted(false);
            }}
          />
          {OFFICIAL_AREAS.map((a) => (
            <M3Chip
              key={a.id}
              label={a.name}
              selected={selectedArea === a.id}
              onClick={() => {
                setSelectedArea(a.id);
                setCurrentIdx(0);
                setSelectedAnswer(null);
                setIsAnswerSubmitted(false);
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Question Card */}
      {currentQuestion ? (
        <M3Card variant="elevated" className="p-6 space-y-5">
          {/* Header Metadata */}
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
              <span className="text-xs text-[#73777F]">{currentQuestion.topic}</span>
            </div>

            <div className="text-xs font-mono text-[#73777F]">
              Pregunta {currentIdx + 1} de {filteredQuestions.length}
            </div>
          </div>

          {/* Context Reading Passage */}
          {currentQuestion.contextText && (
            <div className="p-4 sm:p-5 bg-[#F7F9FC] rounded-2xl border border-[#E1E7F0] text-sm text-[#191C1E] leading-relaxed whitespace-pre-line font-serif">
              {currentQuestion.contextText}
            </div>
          )}

          {/* Question Prompt */}
          <h3 className="text-base sm:text-lg font-bold text-[#0B2F64] tracking-tight">
            {currentQuestion.prompt}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedAnswer === opt.id;
              const isCorrectAnswer = opt.id === currentQuestion.correctAnswer;

              let cardStyle = 'bg-white border-[#C3C7D0] text-[#191C1E] hover:bg-[#F7F9FC]';
              let badgeStyle = 'bg-[#E1E7F0] text-[#43474E]';

              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  cardStyle = 'bg-[#AFF2D4]/30 border-[#00875A] text-[#002113] font-semibold';
                  badgeStyle = 'bg-[#00875A] text-white';
                } else if (isSelected && !isCorrectAnswer) {
                  cardStyle = 'bg-[#FFDAD6]/30 border-[#BA1A1A] text-[#410002]';
                  badgeStyle = 'bg-[#BA1A1A] text-white';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isAnswerSubmitted}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3 select-none cursor-pointer disabled:cursor-default ${cardStyle}`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${badgeStyle}`}
                  >
                    {opt.id}
                  </span>
                  <div className="flex-1 text-sm pt-0.5 leading-relaxed">
                    <span>{opt.text}</span>
                    {isAnswerSubmitted && isCorrectAnswer && (
                      <span className="block mt-1 text-xs font-bold text-[#00875A] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Opción correcta oficial ICFES
                      </span>
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                      <span className="block mt-1 text-xs font-bold text-[#BA1A1A] flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        Tu respuesta
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Immediate Pedagogical Feedback Drawer */}
          {isAnswerSubmitted && (
            <div className="p-5 rounded-2xl bg-[#F0F4FC] border border-[#DCE4F9] space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0B2F64]">
                <Sparkles className="w-4 h-4 text-[#00668B]" />
                <span>Explicación del Concepto y Descarte:</span>
              </div>
              <p className="text-xs sm:text-sm text-[#001944] leading-relaxed">
                {currentQuestion.explanation}
              </p>

              {currentQuestion.distractorAnalysis && (
                <div className="pt-3 border-t border-[#DCE4F9] text-xs text-[#43474E] space-y-1.5">
                  <span className="font-semibold text-[#0B2F64] block">
                    ¿Por qué se descartan los distractores?
                  </span>
                  {Object.entries(currentQuestion.distractorAnalysis).map(([letter, text]) => (
                    <p key={letter}>
                      <strong className="font-mono text-[#0B2F64]">{letter}:</strong> {text}
                    </p>
                  ))}
                </div>
              )}

              {/* Next Question CTA */}
              <div className="pt-2 flex justify-end">
                <M3Button
                  variant="success"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="end"
                  onClick={handleNextQuestion}
                >
                  {currentIdx < filteredQuestions.length - 1 ? 'Siguiente Pregunta' : 'Reiniciar Práctica'}
                </M3Button>
              </div>
            </div>
          )}
        </M3Card>
      ) : (
        <M3Card variant="outlined" className="p-8 text-center text-[#43474E]">
          <p>No hay preguntas disponibles con los filtros seleccionados.</p>
        </M3Card>
      )}
    </div>
  );
};
