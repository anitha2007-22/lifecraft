import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import {
  Laptop,
  HeartPulse,
  HardHat,
  Briefcase,
  Palette,
  Microscope,
  ArrowRight,
  Clock,
  Zap,
  Target,
} from 'lucide-react';

interface JourneysViewProps {
  onStartJourney: (journeyId: string) => void;
}

export const JourneysView: React.FC<JourneysViewProps> = ({ onStartJourney }) => {
  const { journeys, gameState } = useGame();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    'all',
    'Technology',
    'Healthcare',
    'Engineering',
    'Business',
    'Design',
    'Research',
  ];

  const filtered =
    filterCategory === 'all'
      ? journeys
      : journeys.filter((j) => j.category === filterCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop': return <Laptop className="w-5 h-5 text-cyan-400" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-rose-400" />;
      case 'HardHat': return <HardHat className="w-5 h-5 text-amber-400" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-blue-400" />;
      case 'Palette': return <Palette className="w-5 h-5 text-purple-400" />;
      case 'Microscope': return <Microscope className="w-5 h-5 text-emerald-400" />;
      default: return <Target className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
          INTERACTIVE CAREER SIMULATION CATALOG
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          Explore Future Career Journeys
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Step into pivotal decision moments in technology, healthcare, infrastructure, and enterprise. Every mission alters your skill profile and resource balance.
        </p>
      </div>

      {/* Filter Tabs (Interactive Segmented Control allowed by frontend-design) */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl max-w-2xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              filterCategory === cat
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All Journeys' : cat}
          </button>
        ))}
      </div>

      {/* Journeys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((journey) => {
          const isActive = gameState.activeJourneyId === journey.id;
          return (
            <div
              key={journey.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image banner */}
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img
                  src={journey.heroImage}
                  alt={journey.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute top-3 left-3 p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700">
                  {getIcon(journey.icon)}
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-mono">{journey.category}</span>
                  <span className="font-mono text-slate-300">{journey.difficulty}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {journey.title}
                  </h3>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                    {journey.tagline}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {journey.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  {/* Metadata strip with typographic separators (Zero-pill discipline) */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-cyan-500" />
                      {journey.totalMissions} Missions
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      ~{journey.estimatedMinutes} Mins
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      450+ XP
                    </span>
                  </div>

                  <button
                    onClick={() => onStartJourney(journey.id)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
                        : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white'
                    }`}
                  >
                    <span>{isActive ? 'Resume Simulation' : 'Launch Journey'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
