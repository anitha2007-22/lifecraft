import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Lock,
  Volume2,
  VolumeX,
  Lightbulb,
  Award,
  RotateCcw,
  Compass,
  MapPin,
  TrendingUp,
  Brain,
  MessageSquare,
  HelpCircle,
  Users,
} from 'lucide-react';
import { playClickSound, playRevealSound, playLockSound } from '../utils/soundEffects';
import { StoryCharacterStage } from './StoryCharacterStage';
import { StoryDialogueBox } from './StoryDialogueBox';
import { StoryComicPanels } from './StoryComicPanels';
import { ComicHardwareFailureModal } from './ComicHardwareFailureModal';
import { ExplainSimplyModal } from './ExplainSimplyModal';
import { NPC_ROSTER } from '../data/mockData';
import { Choice, StoryDialogue, CharacterExpression } from '../types';

interface GameEngineViewProps {
  onViewPassport: () => void;
  onViewCertificate: () => void;
  onSelectAnotherJourney: () => void;
}

type StageMode = 'story_dialogue' | 'decision_ready' | 'choice_transition' | 'consequence_reveal';

export const GameEngineView: React.FC<GameEngineViewProps> = ({
  onViewPassport,
  onViewCertificate,
  onSelectAnotherJourney,
}) => {
  const {
    activeJourney,
    currentScenario,
    gameState,
    makeDecision,
    advanceToNextMission,
    activeLifeEvent,
    resolveLifeEvent,
    profile,
    user,
    startJourney,
    soundEnabled,
    toggleSound,
  } = useGame();

  const [stageMode, setStageMode] = useState<StageMode>('story_dialogue');
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [lumaReactionText, setLumaReactionText] = useState<string>('');
  const [showLumaHint, setShowLumaHint] = useState<boolean>(false);
  const [selectedChoiceObj, setSelectedChoiceObj] = useState<Choice | null>(null);
  const [activeDialogueSpeaker, setActiveDialogueSpeaker] = useState<string>('maya');
  const [activeDialogueExpression, setActiveDialogueExpression] = useState<CharacterExpression>('thinking');
  const [showExplainSimplyModal, setShowExplainSimplyModal] = useState<boolean>(false);

  const [outcomeData, setOutcomeData] = useState<{
    consequenceHeadline: string;
    consequenceStory: string;
    consequenceImage: string;
    consequence: string;
    commentary: string;
    skillDeltas: Record<string, number | undefined>;
    xpEarned: number;
    unlockedChallengeTitle?: string;
  } | null>(null);

  // Reset stage mode whenever the mission changes
  useEffect(() => {
    setStageMode('story_dialogue');
    setSelectedChoiceId(null);
    setSelectedChoiceObj(null);
    setOutcomeData(null);
    setLumaReactionText('');
    setShowLumaHint(false);
    if (currentScenario?.storyDialogues?.[0]) {
      setActiveDialogueSpeaker(currentScenario.storyDialogues[0].speaker);
      setActiveDialogueExpression((currentScenario.storyDialogues[0].expression as CharacterExpression) || 'thinking');
    }
  }, [gameState.currentMissionIndex]);

  if (!activeJourney) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5 animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-cyan-950 border-2 border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          No Active Simulation Story
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Choose a career journey to dive into interactive narrative chapters and make consequential decisions.
        </p>
        <button
          onClick={onSelectAnotherJourney}
          className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-colors cursor-pointer"
        >
          Explore Journeys
        </button>
      </div>
    );
  }

  const totalMissions = activeJourney.scenarios.length;
  const isJourneyCompleted = gameState.currentMissionIndex >= totalMissions;

  // =========================================================================
  // FINAL JOURNEY COMPLETED: Grand Story Finale with Full Cast
  // =========================================================================
  if (isJourneyCompleted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in space-y-6">
        <div className="rounded-3xl bg-slate-900 border-2 border-amber-500/60 shadow-2xl p-6 sm:p-10 text-center space-y-8 relative overflow-hidden">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
              🎉 STORY FINALE · ALL 8 CHAPTERS CONQUERED
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-display text-white">
              {activeJourney.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
              Masterful leadership, {profile?.name || user?.name || 'Explorer'}! Your squad stood firm at every crucial fork, took responsibility for the outcomes, and brought the vision to life.
            </p>
          </div>

          {/* Group Cast Reunion Presentation */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase block">
              FINAL CAST REFLECTION
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="flex flex-col items-center space-y-2">
                <img
                  src={NPC_ROSTER.maya.avatarImage}
                  alt="Maya"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
                />
                <span className="text-xs font-bold font-display text-white">Maya</span>
                <p className="text-[11px] text-slate-400 italic text-center">
                  &ldquo;We proved our vision works in the real world!&rdquo;
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <img
                  src={NPC_ROSTER.arjun.avatarImage}
                  alt="Arjun"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-400 shadow-md"
                />
                <span className="text-xs font-bold font-display text-white">Arjun</span>
                <p className="text-[11px] text-slate-400 italic text-center">
                  &ldquo;Zero regressions. The pipeline scaled under fire.&rdquo;
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <img
                  src={NPC_ROSTER.drNova.avatarImage}
                  alt="Dr. Nova"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-violet-400 shadow-md"
                />
                <span className="text-xs font-bold font-display text-white">Dr. Nova</span>
                <p className="text-[11px] text-slate-400 italic text-center">
                  &ldquo;Exemplary foresight and scientific conviction.&rdquo;
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <img
                  src={NPC_ROSTER.luma.avatarImage}
                  alt="LUMA"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-md"
                />
                <span className="text-xs font-bold font-display text-white">LUMA</span>
                <p className="text-[11px] text-slate-400 italic text-center">
                  &ldquo;Your future Explorer credentials are fully unlocked.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Skill Performance Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-left">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Problem Solving</span>
              <p className="text-xl font-bold font-mono text-cyan-400 tabular-nums">
                {gameState.skillScores.problemSolving}%
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Decision Making</span>
              <p className="text-xl font-bold font-mono text-blue-400 tabular-nums">
                {gameState.skillScores.decisionMaking}%
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Creativity</span>
              <p className="text-xl font-bold font-mono text-purple-400 tabular-nums">
                {gameState.skillScores.creativity}%
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Teamwork</span>
              <p className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {gameState.skillScores.teamwork}%
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Planning</span>
              <p className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                {gameState.skillScores.planning}%
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Financial Skills</span>
              <p className="text-xl font-bold font-mono text-rose-400 tabular-nums">
                {gameState.skillScores.financialManagement}%
              </p>
            </div>
          </div>

          {/* Enabled Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onViewCertificate}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>CLAIM CERTIFICATE (UNLOCKED)</span>
            </button>
            <button
              onClick={onViewPassport}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              View Skill Passport
            </button>
            <button
              onClick={() => startJourney(activeJourney.id)}
              className="w-full sm:w-auto px-4 py-3 rounded-xl text-slate-400 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Replay Journey
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentScenario) {
    return null;
  }

  // Setup dialogues: use scenario's story dialogues or generate fallback narrative
  const defaultDialogues: StoryDialogue[] = currentScenario.storyDialogues || [
    { speaker: 'maya', speakerName: 'Maya', text: currentScenario.story, expression: 'excited' },
    { speaker: 'arjun', speakerName: 'Arjun', text: currentScenario.situation, expression: 'thinking' },
    { speaker: 'luma', speakerName: 'LUMA', text: currentScenario.lumaDialogue || 'Consider the long-term impact before deciding.', expression: 'thinking' },
  ];

  // Characters in scene
  const charactersInScene = currentScenario.charactersInScene || ['maya', 'arjun', 'luma'];
  const activeSpeaker = stageMode === 'story_dialogue' ? currentScenario.npc?.id || 'maya' : 'luma';
  const speakerExpression = (currentScenario.npc?.defaultExpression as CharacterExpression) || 'thinking';

  // Handle choice selection with the mandatory 2-phase cinematic transition
  const handleSelectChoice = async (choice: Choice) => {
    setSelectedChoiceId(choice.id);
    setSelectedChoiceObj(choice);
    setStageMode('choice_transition');
    setActiveDialogueSpeaker('luma');
    setActiveDialogueExpression('thinking');
    setLumaReactionText('Interesting choice... Let us see how the world responds.');
    playLockSound(soundEnabled);

    try {
      const result = await makeDecision(choice.id);

      // Brief cinematic delay for dramatic effect
      setTimeout(() => {
        setOutcomeData(result);
        setStageMode('consequence_reveal');
        if (choice.consequenceReaction) {
          setActiveDialogueSpeaker(choice.consequenceReaction.speaker);
          setActiveDialogueExpression((choice.consequenceReaction.expression as CharacterExpression) || 'surprised');
        }
        playRevealSound(soundEnabled);
      }, 950);
    } catch (e) {
      console.error(e);
      setStageMode('decision_ready');
    }
  };

  const handleNextMission = () => {
    playClickSound(soundEnabled);
    advanceToNextMission();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-5 animate-fade-in">
      {/* 1. TOP: Chapter & Mission Indicator (Mobile Comic Header) */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              CHAPTER 0{currentScenario.missionNumber} · LEVEL 0{currentScenario.missionNumber}
            </span>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">
              {currentScenario.difficulty}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white pt-1">
            {currentScenario.title}
          </h1>
        </div>

        {/* Chapter Progress Dots + Explain Simply Button + Audio Control */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setShowExplainSimplyModal(true)}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-cyan-500/50 bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/70 text-xs font-bold font-sans flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
            title="Click for simple English and Tamil explanation"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
            <span className="hidden sm:inline">Explain simply / எளிய விளக்கம்</span>
            <span className="sm:hidden font-mono">Guide / உதவி</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {Array.from({ length: totalMissions }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === gameState.currentMissionIndex
                    ? 'w-6 bg-cyan-500'
                    : idx < gameState.currentMissionIndex
                    ? 'w-2 bg-emerald-500'
                    : 'w-2 bg-slate-300 dark:bg-slate-700'
                }`}
                title={`Level ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* =====================================================================
          2. MIDDLE: THE ILLUSTRATED STORY SCENE
          (Replaces the old rectangular hero banner with interactive character stage)
          ===================================================================== */}
      {stageMode !== 'consequence_reveal' ? (
        <StoryCharacterStage
          sceneBackground={currentScenario.sceneBackground || currentScenario.sceneVisual}
          sceneLocationName={currentScenario.sceneLocationName || currentScenario.worldRegion}
          charactersInScene={charactersInScene}
          activeSpeaker={activeDialogueSpeaker}
          speakerExpression={activeDialogueExpression}
          lumaReactionText={lumaReactionText}
          onOpenExplainSimply={() => setShowExplainSimplyModal(true)}
        />
      ) : (
        /* Dynamic Illustrated Consequence Scene */
        <div className="relative w-full rounded-3xl overflow-hidden border-2 border-cyan-500/50 shadow-2xl bg-slate-950 aspect-[16/10] sm:aspect-[16/9] max-h-[460px]">
          <img
            src={outcomeData?.consequenceImage || selectedChoiceObj?.choiceIllustration || currentScenario.sceneVisual}
            alt="Consequence Scene"
            className="w-full h-full object-cover filter brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

          {/* Consequence Location & Status Badge */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-400 text-cyan-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>WORLD STATE RESOLUTION</span>
          </div>

          {/* Headline Banner */}
          <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 z-20 space-y-1">
            <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 text-xs font-mono font-black uppercase tracking-wider inline-block">
              {outcomeData?.consequenceHeadline || 'CONSEQUENCE OBSERVED'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-display text-white drop-shadow-md">
              {selectedChoiceObj?.title}
            </h3>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. BOTTOM: STORY PROGRESSION & INTERACTIVE DECISIONS
          ===================================================================== */}

      {/* PHASE A: Progressive Dialogue Box */}
      {stageMode === 'story_dialogue' && (
        <StoryDialogueBox
          dialogues={defaultDialogues}
          onFinishDialogues={() => {
            setStageMode('decision_ready');
            setActiveDialogueSpeaker('luma');
            setActiveDialogueExpression('thinking');
          }}
          onDialogueStepChange={(speaker, expression) => {
            setActiveDialogueSpeaker(speaker);
            setActiveDialogueExpression(expression);
          }}
          soundEnabled={soundEnabled}
        />
      )}

      {/* PHASE B: Decision Ready (Reveal Visual Choice Cards without scores!) */}
      {stageMode === 'decision_ready' && (
        <div className="space-y-4 animate-fade-in">
          {/* Section Prompt */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
                WHAT SHOULD YOUR TEAM DO?
              </span>
              <h3 className="text-lg sm:text-xl font-black font-display text-slate-900 dark:text-white">
                {currentScenario.situation}
              </h3>
            </div>

            {/* Action Buttons: Explain Simply + LUMA Hint */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowExplainSimplyModal(true)}
                className="px-3 py-1.5 rounded-xl border border-cyan-500/50 bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/70 text-xs font-bold font-sans flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                <span>Explain simply / எளிய விளக்கம்</span>
              </button>

              {currentScenario.lumaHint && (
                <button
                  type="button"
                  onClick={() => setShowLumaHint(!showLumaHint)}
                  className="px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hint</span>
                </button>
              )}
            </div>
          </div>

          {/* LUMA Hint Bubble */}
          {showLumaHint && (
            <div className="p-4 rounded-2xl bg-cyan-950/90 border border-cyan-400 text-cyan-100 text-xs sm:text-sm font-medium backdrop-blur-md shadow-lg flex items-start gap-3 animate-fade-in">
              <img
                src={NPC_ROSTER.luma.avatarImage}
                alt="LUMA"
                className="w-8 h-8 rounded-xl object-cover shrink-0 border border-cyan-400"
              />
              <p className="leading-relaxed">
                <span className="font-bold text-cyan-300 font-mono">LUMA Guidance: </span>
                {currentScenario.lumaHint}
              </p>
            </div>
          )}

          {/* VISUAL CHOICE CARDS (STRICTLY NO SCORES OR XP BEFORE CHOOSING) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {currentScenario.choices.map((choice) => (
              <div
                key={choice.id}
                onClick={() => handleSelectChoice(choice)}
                className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-400 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group flex flex-col justify-between"
              >
                {/* Illustration Card Top */}
                <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden">
                  <img
                    src={choice.choiceIllustration || choice.consequenceImage || currentScenario.sceneVisual}
                    alt={choice.title}
                    className="w-full h-full object-cover filter brightness-[0.85] group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Icon & Tag Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold tracking-wider">
                    <span>{choice.icon}</span>
                    <span>{choice.tag}</span>
                  </div>
                </div>

                {/* Narrative Summary */}
                <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                      {choice.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                      {choice.text}
                    </p>
                    {choice.simpleChoiceText && (
                      <div className="pt-1 text-[11px] font-sans text-cyan-600 dark:text-cyan-400 flex items-center gap-1 font-medium">
                        <Sparkles className="w-3 h-3 shrink-0 text-amber-500" />
                        <span>{choice.simpleChoiceText}</span>
                      </div>
                    )}
                  </div>

                  {/* Action CTA Button */}
                  <div className="pt-2">
                    <div className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-cyan-600 group-hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold font-mono text-center transition-all flex items-center justify-center gap-1.5 shadow-sm">
                      <span>CHOOSE THIS PATH</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASE C: Choice Transitioning */}
      {stageMode === 'choice_transition' && (
        <div className="p-8 rounded-3xl bg-slate-900 border-2 border-cyan-500 text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-950 border border-cyan-400 text-cyan-300 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              LUMA QUANTUM ENGINE
            </span>
            <h4 className="text-xl font-bold font-display text-white">
              {lumaReactionText || 'Processing world reaction...'}
            </h4>
          </div>
        </div>
      )}

      {/* PHASE D: Consequence Reveal (Narrative Story Outcome) */}
      {stageMode === 'consequence_reveal' && outcomeData && (
        <div className="space-y-6 animate-fade-in">
          {/* Character Reaction Speech Bubble */}
          {selectedChoiceObj?.consequenceReaction && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border-2 border-cyan-500/60 shadow-xl flex items-start gap-3.5">
              <img
                src={NPC_ROSTER[selectedChoiceObj.consequenceReaction.speaker]?.avatarImage}
                alt={selectedChoiceObj.consequenceReaction.speakerName}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-cyan-400 shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {selectedChoiceObj.consequenceReaction.speakerName.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                    REACTION
                  </span>
                </div>
                <p className="text-sm sm:text-base font-medium font-sans text-white italic leading-snug">
                  &ldquo;{selectedChoiceObj.consequenceReaction.dialogue}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Comic Panels Chronicle (if present for this decision) */}
          {selectedChoiceObj?.comicPanels && (
            <StoryComicPanels panels={selectedChoiceObj.comicPanels} />
          )}

          {/* Deep Story Narrative */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase block">
              NARRATIVE OUTCOME
            </span>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
              {outcomeData.consequenceStory}
            </p>
          </div>

          {/* REVEALED IMPACT STATS (ONLY SHOWN AFTER DECISION) */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase block">
              DEMONSTRATED COMPETENCIES & XP EARNED
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">EXPERIENCE</span>
                <span className="text-base font-bold text-cyan-400">
                  +{outcomeData.xpEarned} XP
                </span>
              </div>

              {Object.entries(outcomeData.skillDeltas).map(([skillKey, deltaVal]) => {
                if (deltaVal === undefined) return null;
                return (
                  <div key={skillKey} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block capitalize">
                      {skillKey.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="text-base font-bold text-emerald-400">
                      +{deltaVal}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Chapter CTA Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextMission}
              className="px-8 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-600/30 transition-all cursor-pointer flex items-center gap-2 hover:gap-3"
            >
              <span>
                {gameState.currentMissionIndex + 1 >= totalMissions
                  ? 'COMPLETE CHAPTER · VIEW GRAND FINALE'
                  : `CONTINUE TO CHAPTER 0${gameState.currentMissionIndex + 2}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. UNEXPECTED LIFE EVENT MODAL (Hardware Failure)
          ===================================================================== */}
      {activeLifeEvent && (
        <ComicHardwareFailureModal
          event={activeLifeEvent}
          onResolve={(choiceId) => resolveLifeEvent(activeLifeEvent, choiceId)}
          soundEnabled={soundEnabled}
        />
      )}

      {/* 5. EXPLAIN SIMPLY / எளிய விளக்கம் MODAL */}
      {showExplainSimplyModal && currentScenario && (
        <ExplainSimplyModal
          scenario={currentScenario}
          onClose={() => setShowExplainSimplyModal(false)}
          soundEnabled={soundEnabled}
        />
      )}
    </div>
  );
};
