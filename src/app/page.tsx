"use client";

import { useState, useEffect } from "react";
import QuizTab from "@/components/QuizTab";
import { equationQuestions } from "@/data/equations";
import { powerQuestions } from "@/data/powers";
import { probabilityQuestions } from "@/data/probability";

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
];

const TAB_STORAGE_KEY = "gcse-active-tab";

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);

  // Restore last active tab on mount
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
      {/* Subtle gradient background */}
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

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <p className="text-white/40 text-sm tracking-[0.2em] uppercase font-medium">GCSE Maths</p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Revision Practice
          </h1>
          <p className="text-white/50 text-sm">Pick a topic and test yourself</p>
        </div>

        {/* Tab buttons */}
        <div className="grid grid-cols-3 gap-2 mb-8 p-1.5 bg-white/5 rounded-2xl border border-white/10">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(i)}
              className={`relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-200 text-center ${
                activeTab === i
                  ? "text-white"
                  : "text-white/40 hover:text-white/70"
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
        <div className="mb-6 flex items-center gap-3">
          <span className="text-2xl">{tab.icon}</span>
          <div>
            <h2 className="font-bold text-white text-lg">{tab.label}</h2>
            <p className="text-white/40 text-sm">{tab.description}</p>
          </div>
        </div>

        {/* Quiz — no key prop so tab switch preserves each tab's internal state */}
        <QuizTab
          key={tab.id}
          questions={tab.questions}
          accentColor={tab.accentColor}
          emptyIcon={tab.icon}
          tabId={tab.id}
        />

        {/* Footer */}
        <p className="text-center text-white/20 text-xs mt-12">
          Built for GCSE revision • Good luck! 💙
        </p>
      </div>
    </main>
  );
}
