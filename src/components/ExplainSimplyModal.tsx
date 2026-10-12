import React, { useState } from 'react';
import { Scenario } from '../types';
import { NPC_ROSTER } from '../data/mockData';
import { Sparkles, X, BookOpen, Lightbulb, HelpCircle, Check, Languages } from 'lucide-react';
import { playClickSound } from '../utils/soundEffects';

interface ExplainSimplyModalProps {
  scenario: Scenario;
  onClose: () => void;
  soundEnabled?: boolean;
}

export const ExplainSimplyModal: React.FC<ExplainSimplyModalProps> = ({
  scenario,
  onClose,
  soundEnabled = true,
}) => {
  const [activeLang, setActiveLang] = useState<'en' | 'ta'>('en');

  const explanation = scenario.simpleExplanation;
  const luma = NPC_ROSTER.luma;

  const handleToggleLang = (lang: 'en' | 'ta') => {
    playClickSound(soundEnabled);
    setActiveLang(lang);
  };

  const handleClose = () => {
    playClickSound(soundEnabled);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border-2 border-cyan-500/60 shadow-2xl overflow-hidden my-6 text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header with LUMA and Language Toggle */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-cyan-950/90 via-slate-900 to-indigo-950/90 border-b border-cyan-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-cyan-400 bg-slate-950 shadow-md shrink-0">
              <img
                src={luma.avatarImage}
                alt="LUMA"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black font-display text-white">
                  {activeLang === 'en' ? "LUMA's Easy Guide" : 'LUMA-வின் எளிய வழிகாட்டி'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                  STUDENT HELPER
                </span>
              </div>
              <p className="text-xs text-cyan-200/80">
                {activeLang === 'en'
                  ? 'Simple everyday words to help you understand without any stress.'
                  : 'எளிய தமிழில் புரிந்துகொள்ள உதவும் வழிகாட்டி.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-1 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Languages className="w-4 h-4 text-cyan-400" />
            <span>Select language / மொழியைத் தேர்ந்தெடுக்கவும்:</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => handleToggleLang('en')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLang === 'en'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => handleToggleLang('ta')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLang === 'ta'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🇮🇳 தமிழ் (Tamil)
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm">
          {activeLang === 'en' ? (
            /* ENGLISH EXPLANATION */
            <>
              {/* Simple Summary */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider font-mono">
                  <BookOpen className="w-4 h-4" />
                  <span>What is happening right now?</span>
                </div>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  {explanation?.simpleSummary || scenario.situation}
                </p>
              </div>

              {/* Real Student Life Analogy */}
              {explanation?.studentContext && (
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                    <Sparkles className="w-4 h-4" />
                    <span>Think of it like this (Student life example):</span>
                  </div>
                  <p className="text-cyan-100 text-sm leading-relaxed">
                    {explanation.studentContext}
                  </p>
                </div>
              )}

              {/* Key Words Helper */}
              {explanation?.keyWords && explanation.keyWords.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Word Helper (Meanings in simple English):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {explanation.keyWords.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5"
                      >
                        <span className="font-bold text-cyan-300 text-xs font-mono">
                          {item.word}:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {item.meaning}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* The Choices in Plain Words */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Your Choices Explained Simply:
                </span>
                <div className="space-y-2">
                  {scenario.choices.map((choice, idx) => (
                    <div
                      key={choice.id}
                      className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex items-start gap-2.5"
                    >
                      <span className="text-lg shrink-0 mt-0.5">{choice.icon}</span>
                      <div className="space-y-0.5">
                        <span className="font-bold text-white text-xs block">
                          Choice {idx + 1}: {choice.title}
                        </span>
                        <p className="text-xs text-slate-300 leading-snug">
                          {choice.simpleChoiceText || choice.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LUMA Friendly Thinking Tip */}
              <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-indigo-300 uppercase">
                    LUMA&apos;s Friendly Hint:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {scenario.lumaHint}
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* TAMIL EXPLANATION (தமிழ் விளக்கம்) */
            <>
              {/* Tamil Summary */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                  <BookOpen className="w-4 h-4" />
                  <span>இங்கு என்ன நடக்கிறது? (எளிய விளக்கம்)</span>
                </div>
                <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-sans">
                  {explanation?.tamilSummary || 'உங்கள் குழுவினர் ஒரு முக்கியமான முடிவை எடுக்க வேண்டும். கவனமாக சிந்தியுங்கள்.'}
                </p>
              </div>

              {/* Tamil Student Life Analogy */}
              {explanation?.tamilStudentContext && (
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider font-mono">
                    <Sparkles className="w-4 h-4" />
                    <span>மாணவர் வாழ்க்கையோடு ஒரு ஒப்பீடு:</span>
                  </div>
                  <p className="text-cyan-100 text-sm leading-relaxed font-sans">
                    {explanation.tamilStudentContext}
                  </p>
                </div>
              )}

              {/* Tamil Vocabulary Words */}
              {explanation?.tamilKeywords && explanation.tamilKeywords.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                    சொல் விளக்கம் (முக்கிய வார்த்தைகள்):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {explanation.tamilKeywords.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5"
                      >
                        <span className="font-bold text-amber-300 text-xs font-mono">
                          {item.word}:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {item.meaning}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tamil Choices Summary */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  உங்கள் தேர்வுகள் (எளிய தமிழில்):
                </span>
                <div className="space-y-2">
                  {scenario.choices.map((choice, idx) => (
                    <div
                      key={choice.id}
                      className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex items-start gap-2.5"
                    >
                      <span className="text-lg shrink-0 mt-0.5">{choice.icon}</span>
                      <div className="space-y-0.5">
                        <span className="font-bold text-white text-xs block">
                          தேர்வு {idx + 1}: {choice.title}
                        </span>
                        <p className="text-xs text-slate-300 leading-snug font-sans">
                          {choice.tamilChoiceText || choice.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LUMA Tamil Hint */}
              <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-indigo-300 uppercase">
                    LUMA-வின் உதவிக்குறிப்பு:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    {scenario.lumaHint}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with "Got it" button */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            {activeLang === 'en'
              ? 'Take your time. There are no right or wrong answers, only consequences.'
              : 'அவசரப்படாமல் யோசித்து உங்களுக்குச் சரியானதைத் தேர்வு செய்யுங்கள்.'}
          </span>
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 ml-auto"
          >
            <Check className="w-4 h-4" />
            <span>{activeLang === 'en' ? 'Got it! Return to Game' : 'புரிந்தது! விளையாட்டைத் தொடர்க'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
