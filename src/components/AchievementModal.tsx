import React from 'react';
import { useGame } from '../context/GameContext';
import { Award, Sparkles, X, CheckCircle2 } from 'lucide-react';

export const AchievementModal: React.FC = () => {
  const { recentUnlockedBadge, clearUnlockedBadge } = useGame();

  if (!recentUnlockedBadge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-500/50 shadow-2xl p-6 text-center space-y-4">
        <button
          onClick={clearUnlockedBadge}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-md">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
            ACHIEVEMENT UNLOCKED
          </span>
          <h3 className="text-xl font-extrabold font-display text-slate-900 dark:text-white">
            {recentUnlockedBadge.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {recentUnlockedBadge.description}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 font-mono text-xs text-amber-700 dark:text-amber-400 font-bold">
          +{recentUnlockedBadge.xpBonus} Bonus XP Added to Your Profile!
        </div>

        <button
          onClick={clearUnlockedBadge}
          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
        >
          Awesome, Continue Playing
        </button>
      </div>
    </div>
  );
};
