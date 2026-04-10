"use client";

import { useState } from "react";
import { Question } from "@/data/equations";
import { TriangleQuestion } from "@/data/triangles";
import MathText from "@/components/MathText";
import TriangleDiagram from "@/components/TriangleDiagram";

interface QuestionCardProps {
  question: Question | TriangleQuestion;
  questionNumber: number;
  onAnswer: (correct: boolean) => void;
  accentColor: string;
  initialAnswer?: boolean;
}

export default function QuestionCard({
  question,
  questionNumber,
  onAnswer,
  accentColor,
  initialAnswer,
}: QuestionCardProps) {
  const wasAnswered = initialAnswer !== undefined;

  // attempt: 0 = fresh, 1 = first wrong (used internally after retry too), 2 = second wrong locked
  const [attempt, setAttempt] = useState(0);
  const [showingHint, setShowingHint] = useState(false);
  const [selected, setSelected] = useState<number | null>(
    wasAnswered ? question.correct : null
  );
  const [locked, setLocked] = useState(wasAnswered);

  const isCorrect = wasAnswered ? true : selected === question.correct;

  const handleSelect = (idx: number) => {
    if (locked) return;
    if (showingHint && idx === selected) return; // can't re-pick same wrong answer
    setSelected(idx);

    if (idx === question.correct) {
      setShowingHint(false);
      setLocked(true);
      onAnswer(true);
    } else {
      if (attempt === 0) {
        // First wrong — show hint
        setAttempt(1);
        setShowingHint(true);
      } else {
        // Second wrong — reveal and allow forward
        setShowingHint(false);
        setAttempt(2);
        setLocked(true);
        onAnswer(false);
      }
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setShowingHint(false); // explicitly hide hint
    // attempt stays at 1 — next wrong pick triggers reveal
  };

  const optionStyle = (idx: number): string => {
    const base =
      "w-full text-left px-3 py-3 sm:px-5 sm:py-4 rounded-xl border-2 transition-all duration-200 font-medium text-sm sm:text-base ";

    if (!locked && showingHint && idx === selected) {
      // Keep first wrong pick highlighted red while hint is shown
      return base + "border-red-400 bg-red-500/20 text-red-300";
    }

    if (!locked) {
      return (
        base +
        "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 cursor-pointer text-white"
      );
    }

    // Locked
    if (idx === question.correct) {
      return base + "border-emerald-400 bg-emerald-500/20 text-emerald-300";
    }
    if (idx === selected && idx !== question.correct) {
      return base + "border-red-400 bg-red-500/20 text-red-300";
    }
    return base + "border-white/5 bg-white/3 text-white/30";
  };

  const showCorrect = locked && isCorrect;
  const showHint = showingHint;
  const showReveal = locked && !isCorrect;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-8 space-y-4 sm:space-y-6">
      {/* Question */}
      <div className="space-y-1.5">
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: accentColor }}
        >
          Question {questionNumber}
        </span>
        <MathText
          text={question.question}
          as="p"
          className="text-base sm:text-xl font-semibold text-white leading-relaxed"
        />
      </div>

      {/* Triangle diagram if present */}
      {"diagram" in question && question.diagram && (
        <div className="rounded-xl border border-white/10 bg-white/3 py-2 px-1 sm:py-3 sm:px-2">
          <TriangleDiagram diagram={question.diagram} />
        </div>
      )}

      {/* Options */}
      <div className="grid gap-2 sm:gap-3">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            className={optionStyle(idx)}
            onClick={() => handleSelect(idx)}
          >
            <span className="flex items-center gap-2 sm:gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                {String.fromCharCode(65 + idx)}
              </span>
              <MathText text={opt} />
            </span>
          </button>
        ))}
      </div>

      {/* Correct */}
      {showCorrect && (
        <div className="rounded-xl p-4 sm:p-5 border bg-emerald-500/10 border-emerald-500/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <span className="font-bold text-sm sm:text-base text-emerald-300">Correct! Great work!</span>
          </div>
        </div>
      )}

      {/* Hint after first wrong attempt */}
      {showHint && (
        <div className="rounded-xl p-4 sm:p-5 border bg-sky-500/10 border-sky-500/30 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💭</span>
            <span className="font-bold text-sm sm:text-base text-sky-300">Hint</span>
          </div>
          <MathText
            text={question.hint}
            as="p"
            className="text-sm text-white/80 leading-relaxed"
          />
          <button
            onClick={handleRetry}
            className="px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: accentColor }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Reveal after second wrong attempt */}
      {showReveal && (
        <div className="rounded-xl p-4 sm:p-5 border bg-amber-500/10 border-amber-500/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💡</span>
            <span className="font-bold text-sm sm:text-base text-amber-300">Here's the solution:</span>
          </div>
          <div className="space-y-1">
            {question.working.split(". ").map((step, i) => (
              <div key={i} className="flex gap-2 text-xs sm:text-sm text-white/80">
                <span className="text-amber-400 font-bold flex-shrink-0">{i + 1}.</span>
                <MathText text={step.endsWith(".") ? step : step + "."} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
