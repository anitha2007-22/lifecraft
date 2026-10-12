import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { INTEREST_DISCOVERY_QUESTIONS } from '../data/mockData';
import { Sparkles, ArrowRight, Compass, CheckCircle2, RefreshCw } from 'lucide-react';

interface InterestDiscoveryProps {
  onCompleteJourney: (suggestedCategory: string) => void;
}

export const InterestDiscovery: React.FC<InterestDiscoveryProps> = ({ onCompleteJourney }) => {
  const { profile, updateProfile } = useGame();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Array<{ question: string; chosenText: string; archetype: string }>
  >([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    archetype: string;
    tagline: string;
    summary: string;
    suggestedJourneys: string[];
    recommendedFocus: string;
  } | null>(null);

  const currentQ = INTEREST_DISCOVERY_QUESTIONS[currentQIndex];

  const handleSelectOption = async (option: { text: string; primaryArchetype: string }) => {
    const updatedAnswers = [
      ...selectedAnswers,
      {
        question: currentQ.scenarioTitle,
        chosenText: option.text,
        archetype: option.primaryArchetype,
      },
    ];
    setSelectedAnswers(updatedAnswers);

    if (currentQIndex < INTEREST_DISCOVERY_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Analyze with Gemini
      setIsAnalyzing(true);
      try {
        const response = await fetch('/api/ai/analyze-interests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentName: profile?.name || 'Explorer',
            answers: updatedAnswers,
            favouriteSubjects: profile?.favouriteSubjects || [],
            interests: profile?.interests || [],
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setAnalysisResult(data);
          updateProfile({ exploratoryArchetype: data.archetype });
        } else {
          throw new Error('Analysis API error');
        }
      } catch (err) {
        console.warn('Fallback analysis used', err);
        const fallback = {
          archetype: 'Strategic Systems Innovator',
          tagline: 'Driven by curiosity, analytical clarity, and collaborative execution.',
          summary: 'Your gameplay choices suggest a natural inclination toward tackling systemic challenges where technology, planning, and teamwork intersect.',
          suggestedJourneys: ['Technology', 'Engineering', 'Business'],
          recommendedFocus: 'Iterative problem-solving',
        };
        setAnalysisResult(fallback);
        updateProfile({ exploratoryArchetype: fallback.archetype });
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleReset = () => {
    setCurrentQIndex(0);
    setSelectedAnswers([]);
    setAnalysisResult(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-xs font-medium text-cyan-700 dark:text-cyan-300 mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Interactive Decision Discovery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          Discover Your Simulation Profile
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto mt-2">
          Experience 3 quick real-world decision challenges. We evaluate your decision instincts to recommend high-impact simulation journeys.
        </p>
      </div>

      {isAnalyzing && (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            LIFECRAFT AI Engine Analyzing Decisions...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Synthesizing your problem-solving approaches, resource allocation priorities, and trade-off selections.
          </p>
        </div>
      )}

      {!isAnalyzing && !analysisResult && currentQ && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span>CHALLENGE {currentQIndex + 1} OF {INTEREST_DISCOVERY_QUESTIONS.length}</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{currentQ.scenarioTitle}</span>
          </div>

          <div>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-2">
              {currentQ.situation}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select the response that best reflects how you would tackle this situation in real life:
            </p>
          </div>

          <div className="space-y-3">
            {currentQ.choices.map((opt, idx) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20 transition-all flex items-start justify-between gap-4 group cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {opt.text}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">
                    Demonstrates: {opt.skillHint}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 shrink-0 mt-1 transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>
      )}

      {analysisResult && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-mono font-bold">LIFECRAFT EXPLORATORY PROFILE</span>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Re-take Discovery
            </button>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 tracking-wider uppercase">
              Demonstrated Gameplay Archetype
            </span>
            <h2 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              {analysisResult.archetype}
            </h2>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              "{analysisResult.tagline}"
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {analysisResult.summary}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recommended Simulation Journeys for You
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {analysisResult.suggestedJourneys.map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => onCompleteJourney(cat)}
                  className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-50/50 dark:bg-cyan-950/30 hover:border-cyan-500 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                      {cat}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {i === 0 ? 'Primary Match' : 'High Alignment'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Mandatory Non-Predictive Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200">
            <span className="font-semibold block mb-0.5">Important Simulation Principle:</span>
            Your gameplay suggests areas you may enjoy exploring. LIFECRAFT AI simulations do NOT scientifically predict your future career or fixed personality traits; they provide an interactive playground to build decision-making confidence.
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onCompleteJourney(analysisResult.suggestedJourneys[0] || 'Technology')}
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-all shadow-md hover:shadow-cyan-500/25 cursor-pointer flex items-center gap-2"
            >
              <span>Explore {analysisResult.suggestedJourneys[0] || 'Technology'} Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
