import React from 'react';
import { useGame } from '../context/GameContext';
import { Sun, Moon, Shield, Sparkles, User as UserIcon, LogOut } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenAuth }) => {
  const { user, profile, logout, theme, toggleTheme, startDemoMode, gameState } = useGame();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => setCurrentTab('home')}
          className="text-left font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          LIFECRAFT AI
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setCurrentTab('home')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              currentTab === 'home' ? 'text-cyan-600 dark:text-cyan-400 font-semibold' : ''
            }`}
          >
            Home
          </button>
          {user && (
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
                currentTab === 'dashboard' ? 'text-cyan-600 dark:text-cyan-400 font-semibold' : ''
              }`}
            >
              Dashboard
            </button>
          )}
          <button
            onClick={() => setCurrentTab('journeys')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              currentTab === 'journeys' ? 'text-cyan-600 dark:text-cyan-400 font-semibold' : ''
            }`}
          >
            Explore Journeys
          </button>
          <button
            onClick={() => setCurrentTab('arena')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              currentTab === 'arena' ? 'text-cyan-600 dark:text-cyan-400 font-semibold' : ''
            }`}
          >
            Challenge Arena
          </button>
          <button
            onClick={() => setCurrentTab('leaderboard')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              currentTab === 'leaderboard' ? 'text-cyan-600 dark:text-cyan-400 font-semibold' : ''
            }`}
          >
            Leaderboard
          </button>
          {user && (
            <button
              onClick={() => setCurrentTab('passport')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
                currentTab === 'passport' ? 'text-cyan-600 dark:text-cyan-400 font-semibold' : ''
              }`}
            >
              Skill Passport
            </button>
          )}
          {user?.role === 'admin' && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`transition-colors whitespace-nowrap shrink-0 text-amber-500 font-semibold hover:text-amber-400 flex items-center gap-1.5`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Action / Profile / Theme Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTab('dashboard')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-cyan-600/20 text-cyan-400 flex items-center justify-center text-xs">
                  {profile?.avatarIcon || '🚀'}
                </div>
                <span className="max-w-[100px] truncate">{user.name}</span>
                <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold tabular-nums">
                  Lv.{gameState.level}
                </span>
              </button>

              <button
                onClick={logout}
                title="Log out"
                className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={startDemoMode}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Try Demo
              </button>
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
