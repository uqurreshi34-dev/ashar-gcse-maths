"use client";

import { useState, useEffect } from "react";
import QuizTab from "@/components/QuizTab";
import { equationQuestions } from "@/data/equations";
import { powerQuestions } from "@/data/powers";
import { probabilityQuestions } from "@/data/probability";
import { triangleQuestions } from "@/data/triangles";

const TABS = [
  {
    id: "equations",
    label: "Rearranging Equations",
    shortLabel: "Equations",
    icon: "⚖️",
    questions: equationQuestions,
    accentColor: "#6366f1",
    description: "Make a variable the subject of a formula",
  },
  {
    id: "powers",
    label: "Powers of x",
    shortLabel: "Powers",
    icon: "⚡",
    questions: powerQuestions,
    accentColor: "#f59e0b",
    description: "Multiply, divide and simplify index expressions",
  },
  {
    id: "probability",
    label: "Probability",
    shortLabel: "Probability",
    icon: "🎲",
    questions: probabilityQuestions,
    accentColor: "#10b981",
    description: "Calculate chances and combined events",
  },
  {
    id: "triangles",
    label: "Triangles",
    shortLabel: "Triangles",
    icon: "📐",
    questions: triangleQuestions,
    accentColor: "#f43f5e",
    description: "Angles in triangles and Pythagoras' theorem",
  },
];

const TAB_STORAGE_KEY = "gcse-active-tab";

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(TAB_STORAGE_KEY);
      if (saved !== null) {
        const idx = parseInt(saved, 10);
        if (idx >= 0 && idx < TABS.length) setActiveTab(idx);
      }
    } catch {}
  }, []);

  const handleTabChange = (i: number) => {
    setActiveTab(i);
    try {
      localStorage.setItem(TAB_STORAGE_KEY, String(i));
    } catch {}
  };

  const tab = TABS[activeTab];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 transition-all duration-700"
          style={{ backgroundColor: tab.accentColor }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-8 transition-all duration-700"
          style={{ backgroundColor: tab.accentColor }}
        />
      </div>

      {/* Scrollable content — bottom padding leaves room for mobile tab bar */}
      <div className="relative z-10 max-w-2xl mx-auto px-3 sm:px-4 pt-6 sm:pt-10 pb-28 sm:pb-10">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-10 space-y-1">
          <p className="text-white/40 text-xs tracking-[0.2em] uppercase font-medium">GCSE Maths</p>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Ashar's Revision Practice
          </h1>
          <p className="text-white/50 text-xs sm:text-sm">Pick a topic and test yourself</p>
        </div>

        {/* Tab bar — desktop: inline above content */}
        <div className="hidden sm:grid grid-cols-4 gap-2 mb-8 p-1.5 bg-white/5 rounded-2xl border border-white/10">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(i)}
              className={`relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-200 text-center ${
                activeTab === i ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {activeTab === i && (
                <span
                  className="absolute inset-0 rounded-xl"
                  style={{ backgroundColor: t.accentColor + "22" }}
                />
              )}
              <span className="text-xl relative z-10">{t.icon}</span>
              <span
                className="text-xs font-bold tracking-wide relative z-10"
                style={activeTab === i ? { color: t.accentColor } : {}}
              >
                {t.shortLabel}
              </span>
            </button>
          ))}
        </div>

        {/* Active tab description */}
        <div className="mb-4 sm:mb-6 flex items-center gap-3">
          <span className="text-xl sm:text-2xl">{tab.icon}</span>
          <div>
            <h2 className="font-bold text-white text-base sm:text-lg">{tab.label}</h2>
            <p className="text-white/40 text-xs sm:text-sm">{tab.description}</p>
          </div>
        </div>

        {/* Quiz content */}
        <QuizTab
          questions={tab.questions}
          accentColor={tab.accentColor}
          emptyIcon={tab.icon}
          tabId={tab.id}
        />

        {/* Footer — hidden on mobile to save space */}
        <p className="hidden sm:block text-center text-white/20 text-xs mt-12">
          Built for GCSE revision • Good luck! 💙
        </p>
      </div>

      {/* Mobile tab bar — fixed to bottom, only visible on small screens */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-t border-white/10">
        <div className="grid grid-cols-4 px-2 py-2 gap-1 max-w-2xl mx-auto">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(i)}
              className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all duration-200"
            >
              <span className="text-2xl leading-none">{t.icon}</span>
              <span
                className="text-[10px] font-bold tracking-wide leading-none"
                style={{ color: activeTab === i ? t.accentColor : "rgba(255,255,255,0.35)" }}
              >
                {t.shortLabel}
              </span>
              {activeTab === i && (
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: t.accentColor }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
