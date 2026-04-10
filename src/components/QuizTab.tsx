"use client";

import { useState, useEffect } from "react";
import { Question } from "@/data/equations";
import QuestionCard from "@/components/QuestionCard";

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
  answers: boolean[];
  done: boolean;
}

export default function QuizTab({ questions, accentColor, emptyIcon, tabId }: QuizTabProps) {
  const storageKey = `gcse-quiz-${tabId}`;

  const [shuffled, setShuffled] = useState<Question[]>(questions);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [exhausted, setExhausted] = useState(false); // true when user used both attempts and got it wrong

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
          setCurrent(s.current);
          setScore(s.score);
          setAnswers(s.answers);
          setDone(s.done);
          setHydrated(true);
          return;
        }
      }
    } catch {}
    // No saved state — do initial shuffle
    const s = shuffleArray(questions);
    setShuffled(s);
    setHydrated(true);
  }, [tabId]);

  // Persist state whenever it changes (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    const state: TabState = {
      shuffledIds: shuffled.map((q) => q.id),
      current,
      score,
      answers,
      done,
    };
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [shuffled, current, score, answers, done, hydrated]);

  const total = shuffled.length;
  const q = shuffled[current];

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setScore((s) => s + 1);
      setAnswers((a) => [...a, true]);
    } else {
      // User exhausted both attempts — allow moving forward without recording a correct answer
      setExhausted(true);
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
  };

  const pct = Math.round((score / total) * 100);

  // Don't render until hydrated to avoid flash of wrong state
  if (!hydrated) return null;

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-12 text-center">
        <div className="text-6xl">{pct >= 70 ? "🏆" : pct >= 50 ? "📈" : "💪"}</div>
        <div>
          <p className="text-4xl font-black text-white">{score} / {total}</p>
          <p className="text-white/50 mt-1 text-lg">
            {pct >= 70
              ? "Brilliant! You're smashing it."
              : pct >= 50
              ? "Good effort — keep practising!"
              : "Don't worry, every attempt helps!"}
          </p>
        </div>

        {/* Score dots */}
        <div className="flex gap-2 flex-wrap justify-center max-w-sm">
          {answers.map((a, i) => (
            <span
              key={i}
              className={`w-4 h-4 rounded-full ${a ? "bg-emerald-400" : "bg-red-400"}`}
            />
          ))}
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

  // Question has been answered if answers array has an entry for current index, or user exhausted both attempts
  const isAnswered = answers.length > current || exhausted;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(current / total) * 100}%`,
              backgroundColor: accentColor,
            }}
          />
        </div>
        <span className="text-white/50 text-sm font-medium whitespace-nowrap">
          {current + 1} / {total}
        </span>
      </div>

      {/* Question card — key includes answer state so it re-renders correctly on back */}
      <QuestionCard
        key={`${tabId}-${q.id}-${current}`}
        question={q}
        questionNumber={current + 1}
        onAnswer={handleAnswer}
        accentColor={accentColor}
        initialAnswer={isAnswered ? answers[current] : undefined}
      />

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        {/* Back button — hidden on first question */}
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

        {/* Next / Results button — only shown once answered */}
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
