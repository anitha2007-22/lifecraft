import React from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Trophy, ArrowRight, Zap, X } from 'lucide-react';

export const LevelUpModal: React.FC = () => {
  const { showLevelUpModal, closeLevelUpModal, gameState, activeJourney } = useGame();

  if (!showLevelUpModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/50 shadow-2xl p-8 text-center space-y-6 text-white overflow-hidden">
        {/* Holographic light accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={closeLevelUpModal}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold text-3xl shadow-xl shadow-amber-500/25 animate-bounce">
          🚀
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            SIMULATION PROMOTION
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight">
            LEVEL UP!
          </h2>
          <div className="text-lg font-bold font-mono text-amber-400">
            LEVEL {gameState.level < 10 ? `0${gameState.level}` : gameState.level}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-2 text-left">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
            NEW UNLOCKS GRANTED:
          </span>
          <div className="flex items-center gap-2 text-slate-200">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Advanced Crisis Scenarios Unlocked</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>High-Stakes Decision Multiplier Active</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <span>New Arena Challenges Available</span>
          </div>
        </div>

        <button
          onClick={closeLevelUpModal}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Claim Level Up & Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
