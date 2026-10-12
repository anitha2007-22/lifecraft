import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { ARENA_CHALLENGES } from '../data/mockData';
import { ArenaChallenge } from '../types';
import {
  Timer,
  Zap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Swords,
  Flame,
  Award,
} from 'lucide-react';

export const ChallengeArenaView: React.FC = () => {
  const { completeArenaChallenge, gameState } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeChallenge, setActiveChallenge] = useState<ArenaChallenge | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);

  const categories = [
    'all',
    'Logic Battle',
    'Coding Challenge',
    'Money Challenge',
    'Quick Decision',
    'Problem Solving',
  ];

  const filteredChallenges =
    selectedCategory === 'all'
      ? ARENA_CHALLENGES
      : ARENA_CHALLENGES.filter((c) => c.category === selectedCategory);

  // Timer countdown
  useEffect(() => {
    if (!activeChallenge || isFinished || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeChallenge, isFinished, timeLeft]);

  const handleStartChallenge = (ch: ArenaChallenge) => {
    setActiveChallenge(ch);
    setTimeLeft(ch.timeLimitSeconds);
    setSelectedOptionId(null);
    setIsFinished(false);
  };

  const handleSelectOption = (optId: string) => {
    if (isFinished || !activeChallenge) return;
    setSelectedOptionId(optId);
    setIsFinished(true);

    const chosen = activeChallenge.options.find((o) => o.id === optId);
    if (chosen && chosen.isCorrect) {
      completeArenaChallenge(activeChallenge.xpReward);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const currentOption = activeChallenge?.options.find((o) => o.id === selectedOptionId);
  const isCorrectAnswer = currentOption?.isCorrect ?? false;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-500 uppercase tracking-widest mb-1">
            <Swords className="w-3.5 h-3.5" />
            <span>COMPETITIVE MINI-GAME ARENA</span>
          </div>
          <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            LIFECRAFT Challenge Arena
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Test your quick cognitive reflexes, financial logic, and coding acumen against the clock.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
            <Flame className="w-4 h-4 fill-current" />
            <span>Streak: {streak}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
            <Zap className="w-4 h-4" />
            <span>{gameState.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Active Challenge Modal or View */}
      {activeChallenge && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-cyan-500/40 p-6 sm:p-10 shadow-2xl space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase">
              {activeChallenge.category}
            </span>
            <div className="flex items-center gap-2 font-mono text-sm font-bold text-rose-500">
              <Timer className="w-4 h-4 animate-pulse" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              {activeChallenge.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {activeChallenge.description}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {activeChallenge.options.map((opt, i) => {
              const isSelected = selectedOptionId === opt.id;
              let btnClass = 'border-slate-200 dark:border-slate-800 hover:border-cyan-500 bg-slate-50/50 dark:bg-slate-800/40';

              if (isFinished) {
                if (opt.isCorrect) {
                  btnClass = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200';
                } else if (isSelected && !opt.isCorrect) {
                  btnClass = 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200';
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={isFinished}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-xs sm:text-sm font-semibold flex items-center justify-between gap-4 cursor-pointer ${btnClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                  {isFinished && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  )}
                  {isFinished && isSelected && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if finished */}
          {isFinished && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold font-mono">
                {isCorrectAnswer ? (
                  <span className="text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Correct! +{activeChallenge.xpReward} XP Earned
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Time Expired or Incorrect
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {activeChallenge.options.find((o) => o.isCorrect)?.explanation}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveChallenge(null)}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Return to Arena List
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      {!activeChallenge && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Battles' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((ch) => (
              <div
                key={ch.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">{ch.category}</span>
                    <span className="text-slate-400">{ch.timeLimitSeconds}s limit</span>
                  </div>
                  <h4 className="text-base font-bold font-display text-slate-900 dark:text-white">
                    {ch.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {ch.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-500">
                    +{ch.xpReward} XP
                  </span>
                  <button
                    onClick={() => handleStartChallenge(ch)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Fight Challenge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
