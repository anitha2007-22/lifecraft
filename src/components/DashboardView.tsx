import React from 'react';
import { useGame } from '../context/GameContext';
import {
  Zap,
  Target,
  Brain,
  Award,
  ArrowRight,
  Sparkles,
  Compass,
  Play,
  RotateCcw,
} from 'lucide-react';

interface DashboardViewProps {
  onPlayMission: () => void;
  onExploreJourneys: () => void;
  onOpenArena: () => void;
  onViewPassport: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onPlayMission,
  onExploreJourneys,
  onOpenArena,
  onViewPassport,
}) => {
  const { user, profile, gameState, activeJourney, achievements, journeys, startJourney } = useGame();

  const xpProgressPercent = (gameState.xp % 200) / 2; // Level up every 200 XP
  const unlockedCount = gameState.unlockedAchievementIds.length;

  const skillsList = [
    { label: 'Problem Solving', val: gameState.skillScores.problemSolving, color: 'bg-cyan-500' },
    { label: 'Decision Making', val: gameState.skillScores.decisionMaking, color: 'bg-blue-500' },
    { label: 'Creativity', val: gameState.skillScores.creativity, color: 'bg-purple-500' },
    { label: 'Teamwork', val: gameState.skillScores.teamwork, color: 'bg-emerald-500' },
    { label: 'Planning', val: gameState.skillScores.planning, color: 'bg-amber-500' },
    { label: 'Financial Skills', val: gameState.skillScores.financialManagement, color: 'bg-rose-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Banner & Key KPIs */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest">
              LIFECRAFT STUDENT SIMULATOR
            </span>
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 rounded-2xl bg-slate-800/80 border border-slate-700">
                {profile?.avatarIcon || '🚀'}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display">
                WELCOME BACK, {profile?.name?.toUpperCase() || user?.name?.toUpperCase() || 'EXPLORER'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {profile?.classGrade} · Archetype: {profile?.exploratoryArchetype || 'Systems Strategist'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {activeJourney ? (
              <button
                onClick={onPlayMission}
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Simulation</span>
              </button>
            ) : (
              <button
                onClick={onExploreJourneys}
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Select Career Journey</span>
              </button>
            )}
            <button
              onClick={onViewPassport}
              className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
            >
              Skill Passport
            </button>
          </div>
        </div>

        {/* HUD Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div>
            <span className="text-[11px] font-mono text-slate-400 block">PLAYER LEVEL</span>
            <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
              LEVEL {gameState.level}
            </div>
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 block">TOTAL EXPERIENCE</span>
            <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {gameState.xp} XP
            </div>
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 block">MISSIONS PLAYED</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {gameState.completedMissionsCount}
            </div>
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 block">BADGES UNLOCKED</span>
            <div className="text-2xl font-bold font-mono text-purple-400 tabular-nums">
              {unlockedCount} / {achievements.length}
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Skills Breakdown vs Active Journey */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Skill Scores Breakdown */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                YOUR GAME SKILLS
              </span>
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                Skills Earned from Decisions
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">Starts at 0% · Grows as you play</span>
          </div>

          <div className="space-y-4">
            {skillsList.map((skill) => (
              <div key={skill.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">{skill.label}</span>
                  <span className="font-mono text-slate-900 dark:text-white tabular-nums">
                    {skill.val}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full ${skill.color} transition-all duration-500 rounded-full`}
                    style={{ width: `${Math.min(100, Math.max(0, skill.val))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Skills start at 0% for every student and increase only when you make real decisions in the game.
          </p>
        </div>

        {/* Right Column: Active Journey Card & Quick Challenges */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          {/* Active Journey Box */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
              CURRENT CAREER JOURNEY
            </span>
            {activeJourney ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                      {activeJourney.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {activeJourney.description}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-500 whitespace-nowrap">
                    M{gameState.currentMissionIndex + 1}/{activeJourney.totalMissions}
                  </span>
                </div>

                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all"
                    style={{
                      width: `${(gameState.currentMissionIndex / activeJourney.totalMissions) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={onPlayMission}
                    className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors cursor-pointer text-center"
                  >
                    Play Mission {gameState.currentMissionIndex + 1}
                  </button>
                  <button
                    onClick={onExploreJourneys}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Switch
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <p className="text-xs text-slate-500">No active journey selected yet.</p>
                <button
                  onClick={onExploreJourneys}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer"
                >
                  Pick a Career Journey
                </button>
              </div>
            )}
          </div>

          {/* Quick Arena Challenge Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-800/40 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                CHALLENGE ARENA
              </span>
              <span className="text-[11px] font-mono text-amber-400 font-semibold">+50 XP Bonus</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Daily Quick Decision Test
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Test your reflexes against timed 20-second logic & budgeting dilemmas.
            </p>
            <button
              onClick={onOpenArena}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline pt-1 cursor-pointer"
            >
              <span>Enter Arena</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
