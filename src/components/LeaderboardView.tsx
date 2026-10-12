import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { LEADERBOARD_SEED } from '../data/mockData';
import { Trophy, Medal, Crown, Zap, Target, Award } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { gameState, profile, user } = useGame();
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'weekly' | 'daily'>('all');

  // Inject current user into leaderboard dynamically
  const currentUserEntry = {
    rank: 4,
    name: profile?.name || user?.name || 'You (Explorer)',
    avatarSeed: 'you',
    level: gameState.level,
    xp: gameState.xp,
    missionsCompleted: gameState.completedMissionsCount,
    badgeCount: gameState.unlockedAchievementIds.length,
    archetype: profile?.exploratoryArchetype || 'Systems Strategist',
  };

  const combinedList = [...LEADERBOARD_SEED];
  // Sort by XP
  combinedList.sort((a, b) => b.xp - a.xp);
  const formatted = combinedList.map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-500 uppercase tracking-widest mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>GLOBAL STUDENT HALL OF FAME</span>
          </div>
          <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            LIFECRAFT Arena Leaderboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Top performing simulation strategists across all 12th-grade cohorts.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit">
          {(['all', 'weekly', 'daily'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setFilterPeriod(period)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer capitalize ${
                filterPeriod === period
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {period === 'all' ? 'All Time' : period}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {formatted.slice(0, 3).map((player, idx) => {
          const podiumColors = [
            'border-amber-400/50 bg-amber-50/20 dark:bg-amber-950/20',
            'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40',
            'border-amber-700/40 bg-amber-950/10',
          ];
          const crownColor = ['text-amber-400', 'text-slate-300', 'text-amber-700'];

          return (
            <div
              key={player.name}
              className={`rounded-3xl border p-6 text-center space-y-3 relative overflow-hidden shadow-sm ${podiumColors[idx]}`}
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-sm relative">
                {idx === 0 && (
                  <Crown className={`w-5 h-5 absolute -top-3 text-amber-400 fill-current`} />
                )}
                <span>#{player.rank}</span>
              </div>
              <div>
                <h4 className="text-base font-bold font-display text-slate-900 dark:text-white">
                  {player.name}
                </h4>
                <p className="text-[11px] text-slate-500 font-mono">{player.archetype}</p>
              </div>
              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800 flex justify-center gap-4 text-xs font-mono">
                <span className="text-amber-500 font-bold tabular-nums">{player.xp} XP</span>
                <span className="text-slate-400">Lv.{player.level}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Rank</th>
                <th className="py-3.5 px-6">Player</th>
                <th className="py-3.5 px-6">Simulation Archetype</th>
                <th className="py-3.5 px-6 text-right">Missions</th>
                <th className="py-3.5 px-6 text-right">Badges</th>
                <th className="py-3.5 px-6 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {formatted.map((entry) => (
                <tr
                  key={entry.name}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    #{entry.rank}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                    {entry.name}
                  </td>
                  <td className="py-4 px-6 text-slate-500">{entry.archetype}</td>
                  <td className="py-4 px-6 text-right font-mono tabular-nums">
                    {entry.missionsCompleted}
                  </td>
                  <td className="py-4 px-6 text-right font-mono tabular-nums text-purple-400 font-semibold">
                    {entry.badgeCount}
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-amber-500 tabular-nums">
                    {entry.xp} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
