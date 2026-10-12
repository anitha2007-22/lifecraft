import React from 'react';
import { useGame } from '../context/GameContext';
import {
  Gamepad2,
  Cpu,
  Brain,
  Trophy,
  ArrowRight,
  Sparkles,
  Compass,
  CheckCircle2,
  Shield,
  Layers,
} from 'lucide-react';

interface LandingPageProps {
  onStartJourney: () => void;
  onExploreDemo: () => void;
  onExploreJourneys: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartJourney,
  onExploreDemo,
  onExploreJourneys,
}) => {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Vision & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Generation Career Simulation Engine</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-[1.08] text-balance">
                  Experience Your Future. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500">
                    One Decision at a Time.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                  Explore careers, solve real-world challenges, make consequential decisions, and discover the skills you demonstrate through gameplay.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onStartJourney}
                  className="px-8 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onExploreDemo}
                  className="px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  <span>Explore Demo (3 Mins)</span>
                </button>
              </div>

              {/* Core Concept Flow Pill */}
              <div className="pt-4 flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>PLAY</span>
                <span aria-hidden="true">→</span>
                <span>DECIDE</span>
                <span aria-hidden="true">→</span>
                <span>EXPERIENCE</span>
                <span aria-hidden="true">→</span>
                <span>LEARN</span>
                <span aria-hidden="true">→</span>
                <span>ACHIEVE</span>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-900 group">
                <img
                  src="/src/assets/images/lifecraft_hero_banner_1791609562540.jpg"
                  alt="LIFECRAFT Futuristic Simulation Cockpit"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs text-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="font-mono">Live Simulation Active</span>
                  </div>
                  <span className="font-mono text-cyan-400 font-bold">12th Grade Cohort</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
            THE SIMULATION LOOP
          </span>
          <h2 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            How LIFECRAFT Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            A continuous loop from situational decisions to certified skill analytics.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { step: '01', title: 'Create Profile', desc: 'Define your stream, interests, and natural curiosity.' },
            { step: '02', title: 'Choose Journey', desc: 'Select from 6 cutting-edge career tracks.' },
            { step: '03', title: 'Face Missions', desc: 'Encounter real industry crises and complex dilemmas.' },
            { step: '04', title: 'Make Decisions', desc: 'Weigh critical trade-offs between risk and resource.' },
            { step: '05', title: 'Consequences', desc: 'Watch your choices ripple through system outcomes.' },
            { step: '06', title: 'Discover Skills', desc: 'Earn a verified Skill Passport and achievement card.' },
          ].map((item) => (
            <div
              key={item.step}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-cyan-500/50 transition-colors"
            >
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                {item.step}
              </span>
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why LIFECRAFT Section (4 Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
            DESIGNED FOR THE FUTURE
          </span>
          <h2 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Why LIFECRAFT?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Far beyond conventional quizzes: an interactive proving ground.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Gamified Learning
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Earn XP, level up your avatar, balance operating budgets, and solve unexpected life events in a high-stakes environment.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                AI-Powered Scenarios
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Integrated AI Game Master powered by Gemini evaluates your tactical decisions and provides real-world industry context.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Skill Discovery
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Continuous measurement of Problem Solving, Planning, Teamwork, and Financial Acumen rather than arbitrary career labels.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Achievement System
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Unlock certified badges, compete in the Arena, generate printable certificates, and export your verified digital Skill Passport.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Career Journeys Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest block">
              6 CORE DOMAINS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              Featured Simulation Worlds
            </h2>
          </div>
          <button
            onClick={onExploreJourneys}
            className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5 cursor-pointer w-fit"
          >
            <span>View All Journeys</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between">
            <img
              src="/src/assets/images/journey_tech_lab_1791609573574.jpg"
              alt="Technology"
              className="w-full h-44 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="p-6 space-y-3">
              <span className="text-xs font-mono text-cyan-500 font-bold uppercase">Technology</span>
              <h4 className="text-base font-bold font-display text-slate-900 dark:text-white">
                Software & Autonomous AI Systems
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Architect neural platforms, tackle severe code outages, and navigate investor demos.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between">
            <img
              src="/src/assets/images/journey_healthcare_1791609585149.jpg"
              alt="Healthcare"
              className="w-full h-44 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="p-6 space-y-3">
              <span className="text-xs font-mono text-rose-500 font-bold uppercase">Healthcare</span>
              <h4 className="text-base font-bold font-display text-slate-900 dark:text-white">
                Healthcare & Biomedical Sciences
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Emergency trauma triage, diagnostic anomalies, and hospital capital allocation.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between">
            <img
              src="/src/assets/images/journey_business_1791609595359.jpg"
              alt="Business"
              className="w-full h-44 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="p-6 space-y-3">
              <span className="text-xs font-mono text-blue-500 font-bold uppercase">Business</span>
              <h4 className="text-base font-bold font-display text-slate-900 dark:text-white">
                Business, Finance & Entrepreneurship
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pivots, price wars, working capital squeezes, and Series A term sheets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* College Project Expo Demo Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-800/40 p-8 sm:p-12 text-center space-y-4">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
            VISITING A COLLEGE DEMO OR EXPO?
          </span>
          <h2 className="text-3xl font-extrabold font-display text-white">
            Experience the 3-Minute LIFECRAFT Demo
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Zero sign-up required. Instantly play 3 rapid missions, make tough calls, receive AI feedback, and generate your demo Skill Card.
          </p>
          <div className="pt-2">
            <button
              onClick={onExploreDemo}
              className="px-8 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              Launch 3-Minute Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
