import React, { useState, useMemo } from 'react';
import { questionsBank } from '../data/questionsData';
import { Question } from '../types/physics';
import { CheckCircle, XCircle, RotateCcw, Award, BookOpen, Layers, Check, ArrowRight, Lightbulb, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessChime, playErrorChime } from '../utils/audio';

export const QuizModule: React.FC = () => {
  const [quizMode, setQuizMode] = useState<'practice' | 'exam' | 'flashcards'>('practice');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Flashcard flip state
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  // Filtered Questions list
  const activeQuestions: Question[] = useMemo(() => {
    let list = [...questionsBank];
    if (selectedCategory !== 'all') {
      list = list.filter((q) => q.category === selectedCategory);
    }
    if (quizMode === 'exam') {
      return list; // All questions in category
    }
    return list;
  }, [selectedCategory, quizMode]);

  const currentQ = activeQuestions[currentQuestionIndex] || activeQuestions[0];
  const currentAnswer = selectedAnswers[currentQuestionIndex];
  const isCurrentSubmitted = isSubmitted[currentQuestionIndex];

  // Calculate Score
  const score = useMemo(() => {
    let count = 0;
    activeQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        count++;
      }
    });
    return count;
  }, [selectedAnswers, activeQuestions]);

  const handleSelectOption = (optionIndex: number) => {
    if (isCurrentSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleCheckAnswer = () => {
    if (currentAnswer === undefined) return;
    setIsSubmitted((prev) => ({
      ...prev,
      [currentQuestionIndex]: true,
    }));

    const isCorrect = currentAnswer === currentQ.correctIndex;
    if (soundEnabled) {
      if (isCorrect) playSuccessChime();
      else playErrorChime();
    }

    // If last question in exam mode, trigger finish
    if (quizMode === 'exam' && currentQuestionIndex === activeQuestions.length - 1) {
      setIsFinished(true);
      if (score >= activeQuestions.length * 0.75) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsCardFlipped(false);
    } else {
      setIsFinished(true);
      if (score >= activeQuestions.length * 0.75) {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setIsCardFlipped(false);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted({});
    setCurrentQuestionIndex(0);
    setIsFinished(false);
    setIsCardFlipped(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Mode Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Physics Question Bank & Interactive Quiz
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            25 comprehensive questions covering Wave Types, Mechanical vs EM, Amplitude & Wavelength, and Wave Speed Calculations.
          </p>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => {
              setQuizMode('practice');
              handleResetQuiz();
            }}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              quizMode === 'practice' ? 'bg-sky-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Practice Mode
          </button>
          <button
            onClick={() => {
              setQuizMode('exam');
              handleResetQuiz();
            }}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              quizMode === 'exam' ? 'bg-sky-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Exam Challenge
          </button>
          <button
            onClick={() => {
              setQuizMode('flashcards');
              handleResetQuiz();
            }}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              quizMode === 'flashcards' ? 'bg-sky-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Flashcard Study
          </button>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-400 font-medium shrink-0">Filter Topic:</span>
          {[
            { id: 'all', label: 'All Topics (25)' },
            { id: 'types', label: 'Wave Types' },
            { id: 'mechanical_vs_em', label: 'Mechanical vs EM' },
            { id: 'parameters', label: 'A & λ Concepts' },
            { id: 'calculations', label: 'Calculations (v=fλ)' },
            { id: 'real_world', label: 'Real World Physics' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                handleResetQuiz();
              }}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span>Question {currentQuestionIndex + 1} of {activeQuestions.length}</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-400 font-mono font-bold">Score: {score}</span>
        </div>
      </div>

      {/* Finished Summary Screen */}
      {isFinished ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-sky-500/10 text-sky-400 rounded-full flex items-center justify-center mx-auto border border-sky-500/30">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Quiz Complete!</h3>
            <p className="text-xs text-slate-400 mt-1">Here is how well you mastered wave physics:</p>
          </div>

          <div className="p-6 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-4xl font-extrabold text-white font-mono tabular-nums">
              {score} <span className="text-xl text-slate-500 font-normal">/ {activeQuestions.length}</span>
            </div>
            <div className="text-sm font-semibold text-sky-400 mt-1">
              {Math.round((score / activeQuestions.length) * 100)}% Accuracy
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {score === activeQuestions.length
                ? 'Outstanding! You have mastered wave types, formulas, and electromagnetic principles.'
                : score >= activeQuestions.length * 0.75
                ? 'Great job! Strong understanding of key wave concepts.'
                : 'Good effort! Review the comparison matrices and interactive wave lab to boost your score.'}
            </p>
          </div>

          <button
            onClick={handleResetQuiz}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-xl transition-all cursor-pointer shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Question Challenge</span>
          </button>
        </div>
      ) : quizMode === 'flashcards' ? (
        /* --- Flashcard Study Mode --- */
        <div className="max-w-2xl mx-auto">
          <div
            onClick={() => setIsCardFlipped(!isCardFlipped)}
            className="min-h-[300px] p-8 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer flex flex-col justify-between transition-all shadow-xl select-none"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-sky-400 uppercase tracking-wider">
                Flashcard {currentQuestionIndex + 1} / {activeQuestions.length}
              </span>
              <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                Click Card to {isCardFlipped ? 'Show Question' : 'Reveal Answer'}
              </span>
            </div>

            <div className="my-6">
              {!isCardFlipped ? (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-sky-400 uppercase">Question:</span>
                  <p className="text-lg font-semibold text-white leading-relaxed">
                    {currentQ.question}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                    <CheckCircle className="w-4 h-4" />
                    <span>Correct Answer:</span>
                  </div>
                  <p className="text-base font-bold text-emerald-300">
                    {currentQ.options[currentQ.correctIndex]}
                  </p>
                  <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <strong className="text-slate-200">Explanation:</strong> {currentQ.explanation}
                  </div>
                  {currentQ.formula && (
                    <div className="p-2 bg-slate-950 rounded border border-slate-800 text-xs font-mono text-amber-300">
                      Formula: {currentQ.formula}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800">
              <span>Topic: {currentQ.category.replace('_', ' ')}</span>
              <span>Difficulty: {currentQ.difficulty}</span>
            </div>
          </div>

          {/* Flashcard Navigation */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors cursor-pointer"
            >
              Previous Card
            </button>
            <button
              onClick={() => setIsCardFlipped(!isCardFlipped)}
              className="px-4 py-2 text-xs font-medium text-sky-300 bg-sky-950/60 border border-sky-800/80 hover:bg-sky-900/60 rounded-lg transition-colors cursor-pointer"
            >
              {isCardFlipped ? 'Flip Back' : 'Flip to Answer'}
            </button>
            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === activeQuestions.length - 1}
              className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors cursor-pointer"
            >
              Next Card
            </button>
          </div>
        </div>
      ) : (
        /* --- Standard Practice / Exam Question Card --- */
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          {/* Question Meta Header */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sky-400 font-semibold">
                Question {currentQuestionIndex + 1} of {activeQuestions.length}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 capitalize">{currentQ.category.replace('_', ' ')}</span>
            </div>
            <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
              currentQ.difficulty === 'Easy'
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                : currentQ.difficulty === 'Medium'
                ? 'bg-sky-950/60 text-sky-300 border border-sky-800'
                : 'bg-amber-950/60 text-amber-300 border border-amber-800'
            }`}>
              {currentQ.difficulty}
            </span>
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = currentAnswer === optIdx;
              const isCorrectOpt = optIdx === currentQ.correctIndex;

              let style = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

              if (isCurrentSubmitted) {
                if (isCorrectOpt) {
                  style = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-semibold';
                } else if (isSelected && !isCorrectOpt) {
                  style = 'bg-rose-950/50 border-rose-500 text-rose-200';
                } else {
                  style = 'bg-slate-950/40 border-slate-900 text-slate-500';
                }
              } else if (isSelected) {
                style = 'bg-sky-950/60 border-sky-500 text-sky-100 font-medium';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isCurrentSubmitted}
                  className={`w-full p-3.5 text-left text-xs sm:text-sm rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-xs font-mono shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isCurrentSubmitted && isCorrectOpt && (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {isCurrentSubmitted && isSelected && !isCorrectOpt && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed Scientific Explanation Box (appears after submit) */}
          {isCurrentSubmitted && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs leading-relaxed animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 font-semibold text-sky-300">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Physics Explanation & Analysis</span>
              </div>
              <p className="text-slate-300">{currentQ.explanation}</p>
              {currentQ.formula && (
                <div className="p-2 bg-slate-900 rounded font-mono text-amber-300 text-[11px]">
                  Equation: {currentQ.formula}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {!isCurrentSubmitted ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={currentAnswer === undefined}
                  className="px-5 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 disabled:opacity-40 rounded-lg transition-colors cursor-pointer"
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer"
                >
                  <span>{currentQuestionIndex < activeQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
