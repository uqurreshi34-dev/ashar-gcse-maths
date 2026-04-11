"use client";

import { useState, useEffect } from "react";
import { Question } from "@/data/equations";
import QuestionCard from "@/components/QuestionCard";

type AnswerResult = "first" | "hint" | "failed";

interface QuizTabProps {
  questions: Question[];
  accentColor: string;
  emptyIcon: string;
  tabId: string;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface TabState {
  shuffledIds: number[];
  current: number;
  score: number;
  answers: AnswerResult[];
  done: boolean;
}

// Dot colours per result
const DOT_STYLE: Record<AnswerResult, string> = {
  first:  "bg-emerald-400",
  hint:   "bg-amber-400",
  failed: "bg-red-400",
};

const DOT_LABEL: Record<AnswerResult, string> = {
  first:  "✓ first try",
  hint:   "✓ after hint",
  failed: "✗ not answered",
};

export default function QuizTab({ questions, accentColor, emptyIcon, tabId }: QuizTabProps) {
  const storageKey = `gcse-quiz-${tabId}`;

  const [shuffled, setShuffled] = useState<Question[]>(questions);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [done, setDone] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const [streak, setStreak] = useState(0);

  // When tabId changes, reset everything immediately
  useEffect(() => {
    setHydrated(false);
    setShuffled(questions);
    setCurrent(0);
    setScore(0);
    setAnswers([]);
    setDone(false);
    setExhausted(false);
    setStreak(0);
  }, [tabId]);

  // Restore persisted state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const s: TabState = JSON.parse(saved);
        const restored = s.shuffledIds
          .map((id) => questions.find((q) => q.id === id))
          .filter(Boolean) as Question[];
        if (restored.length === questions.length) {
          setShuffled(restored);
          if (s.done) {
            setShuffled(shuffleArray(questions));
            setCurrent(0);
            setScore(0);
            setAnswers([]);
          } else {
            setCurrent(s.current);
            setScore(s.score);
            setAnswers(s.answers);
            // Recalculate streak from saved answers
            let str = 0;
            for (let i = s.answers.length - 1; i >= 0; i--) {
              if (s.answers[i] === "first") str++;
              else break;
            }
            setStreak(str);
          }
          setHydrated(true);
          return;
        }
      }
    } catch {}
    const s = shuffleArray(questions);
    setShuffled(s);
    setHydrated(true);
  }, [tabId]);

  // Persist state
  useEffect(() => {
    if (!hydrated) return;
    const state: TabState = {
      shuffledIds: shuffled.map((q) => q.id),
      current,
      score,
      answers,
      done: false,
    };
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [shuffled, current, score, answers, done, hydrated]);

  const total = shuffled.length;
  const q = shuffled[current];

  const handleAnswer = (result: AnswerResult) => {
    if (result === "first" || result === "hint") {
      setScore((s) => s + 1);
      setAnswers((a) => [...a, result]);
      setStreak((s) => result === "first" ? s + 1 : 0);
    } else {
      setAnswers((a) => [...a, "failed"]);
      setExhausted(true);
      setStreak(0);
    }
  };

  const handleNext = () => {
    setExhausted(false);
    if (current + 1 >= total) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const handleBack = () => {
    if (current === 0) return;
    setExhausted(false);
    setCurrent((c) => c - 1);
  };

  const restart = () => {
    const s = shuffleArray(questions);
    setShuffled(s);
    setCurrent(0);
    setScore(0);
    setAnswers([]);
    setDone(false);
    setExhausted(false);
    setStreak(0);
  };

  const pct = Math.round((score / total) * 100);

  if (!hydrated) return null;

  // Results screen
  if (done && shuffled.length === questions.length) {
    const firstTry = answers.filter(a => a === "first").length;
    const withHint = answers.filter(a => a === "hint").length;
    const failed  = answers.filter(a => a === "failed").length;

    return (
      <div className="flex flex-col items-center justify-center gap-6 py-10 text-center">
        <div className="text-6xl">{pct >= 70 ? "🏆" : pct >= 50 ? "📈" : "💪"}</div>
        <div>
          <p className="text-4xl font-black text-white">{score} / {total}</p>
          <p className="text-white/50 mt-1 text-base">
            {pct >= 70 ? "Brilliant! You're smashing it." : pct >= 50 ? "Good effort — keep practising!" : "Don't worry, every attempt helps!"}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 flex-wrap justify-center max-w-xs">
          {answers.map((a, i) => (
            <span
              key={i}
              title={DOT_LABEL[a]}
              className={`w-4 h-4 rounded-full ${DOT_STYLE[a]}`}
            />
          ))}
        </div>

        {/* Breakdown */}
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
            <span className="text-white/60">{firstTry} first try</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
            <span className="text-white/60">{withHint} after hint</span>
          </span>
          {failed > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
              <span className="text-white/60">{failed} missed</span>
            </span>
          )}
        </div>

        <button
          onClick={restart}
          className="px-8 py-3 rounded-xl font-bold text-white text-base transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: accentColor }}
        >
          Try Again →
        </button>
      </div>
    );
  }

  const isAnswered = answers.length > current || exhausted;

  return (
    <div className="space-y-5">
      {/* Progress dots + streak */}
      <div className="flex items-center gap-3">
        {/* Dots */}
        <div className="flex gap-1.5 flex-1 flex-wrap">
          {Array.from({ length: total }).map((_, i) => {
            const result = answers[i];
            const isCurrent = i === current;
            return (
              <span
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  result
                    ? `w-3 h-3 ${DOT_STYLE[result]}`
                    : isCurrent
                    ? "w-3 h-3 border-2 border-white/60"
                    : "w-3 h-3 bg-white/15"
                }`}
              />
            );
          })}
        </div>

        {/* Streak */}
        {streak >= 2 && (
          <div className="flex items-center gap-1 text-sm font-bold text-amber-400 whitespace-nowrap">
            <span>🔥</span>
            <span>{streak}</span>
          </div>
        )}

        {/* Counter */}
        <span className="text-white/50 text-sm font-medium whitespace-nowrap">
          {current + 1} / {total}
        </span>
      </div>

      {/* Question card */}
      <QuestionCard
        key={`${tabId}-${q.id}-${current}`}
        question={q}
        questionNumber={current + 1}
        onAnswer={handleAnswer}
        accentColor={accentColor}
        initialAnswer={isAnswered ? (answers[current] !== "failed") : undefined}
      />

      {/* Navigation */}
      <div className="flex justify-between items-center">
        {current > 0 ? (
          <button
            onClick={handleBack}
            className="px-5 py-3 rounded-xl font-bold text-sm transition-all text-white/60 hover:text-white border border-white/10 hover:border-white/30 hover:scale-105 active:scale-95"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}

        {isAnswered && (
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: accentColor }}
          >
            {current + 1 >= total ? "See Results →" : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
}
