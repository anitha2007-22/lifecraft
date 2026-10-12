import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Scenario } from '../types';
import {
  Users,
  Target,
  Plus,
  Trash2,
  Edit2,
  Shield,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { journeys, addScenario, deleteScenario, registeredStudents } = useGame();
  const [activeTab, setActiveTab] = useState<'stats' | 'scenarios' | 'students'>('stats');
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>(journeys[0]?.id || 'tech');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New scenario form state
  const [newTitle, setNewTitle] = useState('');
  const [newStory, setNewStory] = useState('');
  const [newSituation, setNewSituation] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [optAText, setOptAText] = useState('');
  const [optBText, setOptBText] = useState('');

  const currentJourney = journeys.find((j) => j.id === selectedJourneyId) || journeys[0];

  const handleCreateScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSituation.trim()) return;

    addScenario(selectedJourneyId, {
      journeyId: selectedJourneyId,
      missionNumber: currentJourney.scenarios.length + 1,
      worldRegion: currentJourney.worldName || 'INNOVATION VALLEY',
      title: newTitle,
      subtitle: `Mission 0${currentJourney.scenarios.length + 1} · ${newDifficulty}`,
      story: newStory || 'A sudden operational challenge emerges requiring executive decision-making.',
      situation: newSituation,
      difficulty: newDifficulty,
      sceneVisual: currentJourney.heroImage,
      lumaDialogue: 'A new tactical dilemma has presented itself. Choose carefully.',
      lumaHint: 'Assess the long-term trade-offs before committing your sprint resources.',
      choices: [
        {
          id: `c_${Date.now()}_1`,
          icon: '🛡️',
          tag: 'STRATEGIC RISK MITIGATION',
          title: optAText || 'Deploy Immediate Risk Mitigation',
          text: optAText || 'Deploy immediate conservative risk mitigation strategy.',
          consequenceHeadline: '🛡️ DEFENSIVE MEASURE EXECUTED',
          consequenceStory: 'Your defensive mitigation protocol stabilizes internal team operations with low systemic risk.',
          skillImpacts: { planning: 8, decisionMaking: 6, financialManagement: 5 },
          xpReward: 60,
          moneyChange: -200,
          timeEnergyChange: -5,
          consequenceText: 'Strategic stability is preserved with low systemic downside.',
        },
        {
          id: `c_${Date.now()}_2`,
          icon: '⚡',
          tag: 'RAPID INITIATIVE',
          title: optBText || 'Take Bold Counter-Measure',
          text: optBText || 'Take an aggressive creative counter-measure.',
          consequenceHeadline: '⚡ RAPID PIVOT INITIATED',
          consequenceStory: 'Your aggressive counter-measure breaks through the bottleneck quickly, proving high courage.',
          skillImpacts: { creativity: 8, problemSolving: 8, teamwork: 4 },
          xpReward: 70,
          moneyChange: -500,
          timeEnergyChange: -10,
          consequenceText: 'High-risk initiative generates rapid breakthrough with minor friction.',
        },
      ],
    });

    setNewTitle('');
    setNewStory('');
    setNewSituation('');
    setOptAText('');
    setOptBText('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-500 uppercase tracking-widest mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>COMMAND CONSOLE · ROLE: ADMINISTRATOR</span>
          </div>
          <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Admin Management Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage simulation scenarios, inspect registered cohorts, and monitor simulation metrics.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            System Metrics
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'scenarios'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Scenario Manager
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'students'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Student Cohort
          </button>
        </div>
      </div>

      {/* Tab 1: System Stats */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[11px] font-mono text-slate-400">TOTAL STUDENTS</span>
              <div className="text-3xl font-extrabold font-mono text-cyan-500 tabular-nums">
                {registeredStudents.length + 124}
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[11px] font-mono text-slate-400">ACTIVE SIMULATIONS</span>
              <div className="text-3xl font-extrabold font-mono text-emerald-500 tabular-nums">
                38
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[11px] font-mono text-slate-400">TOTAL MISSIONS PLAYED</span>
              <div className="text-3xl font-extrabold font-mono text-amber-500 tabular-nums">
                1,842
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[11px] font-mono text-slate-400">AVG DECISION TIME</span>
              <div className="text-3xl font-extrabold font-mono text-purple-500 tabular-nums">
                34s
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                Most Popular Career Journeys
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Technology & AI Systems</span>
                    <span className="font-mono">42%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Healthcare & Biomedical</span>
                    <span className="font-mono">24%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '24%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Smart Infrastructure & Engineering</span>
                    <span className="font-mono">18%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Business & Entrepreneurship</span>
                    <span className="font-mono">16%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '16%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                Cohort Average Competency Benchmarks
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-400 block">Problem Solving</span>
                  <span className="text-xl font-bold font-mono text-cyan-500">78%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-400 block">Decision Making</span>
                  <span className="text-xl font-bold font-mono text-blue-500">81%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-400 block">Teamwork</span>
                  <span className="text-xl font-bold font-mono text-emerald-500">72%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-400 block">Financial Acumen</span>
                  <span className="text-xl font-bold font-mono text-amber-500">65%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Scenario Manager */}
      {activeTab === 'scenarios' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Select Journey:</span>
              <select
                value={selectedJourneyId}
                onChange={(e) => setSelectedJourneyId(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              >
                {journeys.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.scenarios.length} missions)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Scenario</span>
            </button>
          </div>

          {/* Scenario List */}
          <div className="space-y-3">
            {currentJourney.scenarios.map((sc, idx) => (
              <div
                key={sc.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      Mission {idx + 1}
                    </span>
                    <span className="text-xs text-slate-400">· {sc.difficulty}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {sc.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {sc.situation}
                  </p>
                  <div className="text-[11px] text-slate-400 pt-1">
                    {sc.choices.length} Decision Paths Configured
                  </div>
                </div>

                <button
                  onClick={() => deleteScenario(currentJourney.id, sc.id)}
                  title="Delete Scenario"
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Scenario Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Add Scenario to {currentJourney.title}
                </h3>
                <form onSubmit={handleCreateScenario} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Scenario Title</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Mission 7: The Supply Bottleneck"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Situation Description</label>
                    <textarea
                      required
                      rows={2}
                      value={newSituation}
                      onChange={(e) => setNewSituation(e.target.value)}
                      placeholder="Describe the high-pressure dilemma students must solve..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Choice Option A</label>
                    <input
                      type="text"
                      value={optAText}
                      onChange={(e) => setOptAText(e.target.value)}
                      placeholder="e.g. Conduct conservative fail-safe audit"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Choice Option B</label>
                    <input
                      type="text"
                      value={optBText}
                      onChange={(e) => setOptBText(e.target.value)}
                      placeholder="e.g. Rapidly deploy decentralized workaround"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                    >
                      Save Scenario
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Registered Students */}
      {activeTab === 'students' && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-6">Student Name</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Current Level</th>
                  <th className="py-3.5 px-6">Accumulated XP</th>
                  <th className="py-3.5 px-6">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {registeredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                      {s.name}
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-mono">{s.email}</td>
                    <td className="py-4 px-6 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      Level {s.level}
                    </td>
                    <td className="py-4 px-6 font-mono text-amber-500 font-semibold tabular-nums">
                      {s.xp} XP
                    </td>
                    <td className="py-4 px-6 text-slate-400 font-mono">{s.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
