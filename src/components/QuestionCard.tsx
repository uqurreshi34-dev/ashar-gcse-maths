"use client";

import { useState } from "react";
import { Question } from "@/data/equations";
import { TriangleQuestion } from "@/data/triangles";
import MathText from "@/components/MathText";
import TriangleDiagram from "@/components/TriangleDiagram";
import confetti from "canvas-confetti";

interface QuestionCardProps {
  question: Question | TriangleQuestion;
  questionNumber: number;
  onAnswer: (result: "first" | "hint" | "failed") => void;
  accentColor: string;
  initialAnswer?: boolean;
}

// Play a short success chime using Web Audio API
function playSuccessSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.3, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
      osc.start(start);
      osc.stop(start + 0.25);
    });
  } catch {}
}

// Play an electric buzzer sound for incorrect answer
function playErrorSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    // Add distortion for buzzer character
    const distortion = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = (Math.PI + 400) * x / (Math.PI + 400 * Math.abs(x));
    }
    distortion.curve = curve;
    osc.connect(distortion);
    distortion.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    // Descending pitch — classic wrong-answer feel
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch {}
}

function fireConfetti(accentColor: string) {
  // Two bursts from the sides
  confetti({
    particleCount: 60,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.7 },
    colors: [accentColor, "#ffffff", "#ffd700"],
    zIndex: 9999,
  });
  confetti({
    particleCount: 60,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.7 },
    colors: [accentColor, "#ffffff", "#ffd700"],
    zIndex: 9999,
  });
}

export default function QuestionCard({
  question,
  questionNumber,
  onAnswer,
  accentColor,
  initialAnswer,
}: QuestionCardProps) {
  const wasAnswered = initialAnswer !== undefined;

  const [attempt, setAttempt] = useState(0);
  const [showingHint, setShowingHint] = useState(false);
  const [selected, setSelected] = useState<number | null>(
    wasAnswered ? question.correct : null
  );
  const [locked, setLocked] = useState(wasAnswered);

  const isCorrect = wasAnswered ? true : selected === question.correct;

  const handleSelect = (idx: number) => {
    if (locked) return;
    if (showingHint) return; // must click Retry before answering again
    setSelected(idx);

    if (idx === question.correct) {
      setShowingHint(false);
      setLocked(true);
      onAnswer(attempt === 0 ? "first" : "hint");
      fireConfetti(accentColor);
      playSuccessSound();
    } else {
      if (attempt === 0) {
        setAttempt(1);
        setShowingHint(true);
        playErrorSound();
      } else {
        setShowingHint(false);
        setAttempt(2);
        setLocked(true);
        onAnswer("failed");
        playErrorSound();
      }
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setShowingHint(false);
  };

  const optionStyle = (idx: number): string => {
    const base =
      "w-full text-left px-3 py-3 sm:px-5 sm:py-4 rounded-xl border-2 transition-all duration-200 font-medium text-sm sm:text-base ";

    if (!locked && showingHint && idx === selected) {
      return base + "border-red-400 bg-red-500/20 text-red-300 cursor-not-allowed";
    }

    if (!locked && showingHint) {
      return base + "border-white/5 bg-white/3 text-white/20 cursor-not-allowed";
    }

    if (!locked) {
      return (
        base +
        "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 cursor-pointer text-white"
      );
    }

    if (idx === question.correct) {
      return base + "border-emerald-400 bg-emerald-500/20 text-emerald-300";
    }
    if (idx === selected && idx !== question.correct) {
      return base + "border-red-400 bg-red-500/20 text-red-300";
    }
    return base + "border-white/5 bg-white/3 text-white/30";
  };

  const showCorrect = locked && isCorrect && attempt !== 2;
  const showHint = showingHint;
  const showReveal = locked && (!isCorrect || attempt === 2);

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
