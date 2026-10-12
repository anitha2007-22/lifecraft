import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { JourneysView } from './components/JourneysView';
import { GameEngineView } from './components/GameEngineView';
import { InterestDiscovery } from './components/InterestDiscovery';
import { ChallengeArenaView } from './components/ChallengeArenaView';
import { SkillPassportView } from './components/SkillPassportView';
import { CertificateView } from './components/CertificateView';
import { FutureCardView } from './components/FutureCardView';
import { LeaderboardView } from './components/LeaderboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AchievementModal } from './components/AchievementModal';
import { LevelUpModal } from './components/LevelUpModal';
import {
  Compass,
  LayoutDashboard,
  Play,
  Swords,
  Trophy,
  User as UserIcon,
  Award,
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, profile, startDemoMode, startJourney, journeys } = useGame();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // If user just signed up or logged in without onboarding, open onboarding
  React.useEffect(() => {
    if (user && profile && !profile.onboardingCompleted) {
      setIsOnboardingOpen(true);
    }
  }, [user, profile]);

  const handleStartJourneyCTA = () => {
    if (!user) {
      setIsAuthOpen(true);
    } else if (!profile?.onboardingCompleted) {
      setIsOnboardingOpen(true);
    } else {
      setCurrentTab('discovery');
    }
  };

  const handleExploreDemo = () => {
    startDemoMode();
    // Start tech journey automatically and go to game engine
    startJourney('tech');
    setCurrentTab('play');
  };

  const handleLaunchJourney = (journeyId: string) => {
    startJourney(journeyId);
    setCurrentTab('play');
  };

  const handleDiscoveryComplete = (category: string) => {
    const matched = journeys.find((j) => j.category.toLowerCase() === category.toLowerCase()) || journeys[0];
    startJourney(matched.id);
    setCurrentTab('play');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 pb-20 md:pb-8">
        {currentTab === 'home' && (
          <LandingPage
            onStartJourney={handleStartJourneyCTA}
            onExploreDemo={handleExploreDemo}
            onExploreJourneys={() => setCurrentTab('journeys')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            onPlayMission={() => setCurrentTab('play')}
            onExploreJourneys={() => setCurrentTab('journeys')}
            onOpenArena={() => setCurrentTab('arena')}
            onViewPassport={() => setCurrentTab('passport')}
          />
        )}

        {currentTab === 'journeys' && (
          <JourneysView onStartJourney={handleLaunchJourney} />
        )}

        {currentTab === 'play' && (
          <GameEngineView
            onViewPassport={() => setCurrentTab('passport')}
            onViewCertificate={() => setCurrentTab('certificate')}
            onSelectAnotherJourney={() => setCurrentTab('journeys')}
          />
        )}

        {currentTab === 'discovery' && (
          <InterestDiscovery onCompleteJourney={handleDiscoveryComplete} />
        )}

        {currentTab === 'arena' && <ChallengeArenaView />}

        {currentTab === 'passport' && <SkillPassportView />}

        {currentTab === 'certificate' && (
          <CertificateView onContinueSimulation={() => setCurrentTab('play')} />
        )}

        {currentTab === 'card' && <FutureCardView />}

        {currentTab === 'leaderboard' && <LeaderboardView />}

        {currentTab === 'admin' && <AdminDashboardView />}
      </main>

      {/* Mobile Bottom Navigation Bar (Responsive Requirement) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md px-2 py-1.5 flex items-center justify-around text-[10px]">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center gap-0.5 p-1.5 ${
            currentTab === 'home' ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-slate-500'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Home</span>
        </button>
        {user && (
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 p-1.5 ${
              currentTab === 'dashboard' ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        )}
        <button
          onClick={() => setCurrentTab('journeys')}
          className={`flex flex-col items-center gap-0.5 p-1.5 ${
            currentTab === 'journeys' ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-slate-500'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Simulate</span>
        </button>
        <button
          onClick={() => setCurrentTab('arena')}
          className={`flex flex-col items-center gap-0.5 p-1.5 ${
            currentTab === 'arena' ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-slate-500'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>Arena</span>
        </button>
        {user ? (
          <button
            onClick={() => setCurrentTab('passport')}
            className={`flex flex-col items-center gap-0.5 p-1.5 ${
              currentTab === 'passport' ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-slate-500'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Passport</span>
          </button>
        ) : (
          <button
            onClick={() => setIsAuthOpen(true)}
            className="flex flex-col items-center gap-0.5 p-1.5 text-cyan-600 dark:text-cyan-400 font-semibold"
          >
            <UserIcon className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          if (user?.role === 'admin') {
            setCurrentTab('admin');
          } else {
            setCurrentTab('dashboard');
          }
        }}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={() => {
          setIsOnboardingOpen(false);
          setCurrentTab('discovery');
        }}
      />

      <AchievementModal />
      <LevelUpModal />

      {/* Clean quiet Footer adhering to anti-slop rules (no ornamental buzzword engines) */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 dark:text-white font-display">
              LIFECRAFT AI
            </span>
            <span aria-hidden="true">·</span>
            <span>Experience Your Future. One Decision at a Time.</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentTab('discovery')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Interest Discovery
            </button>
            <button
              onClick={() => setCurrentTab('card')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Future Card
            </button>
            <button
              onClick={() => setCurrentTab('certificate')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Certificate
            </button>
            <button
              onClick={() => {
                if (!user) setIsAuthOpen(true);
                else setCurrentTab('admin');
              }}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer text-amber-500"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainApp />
    </GameProvider>
  );
}
