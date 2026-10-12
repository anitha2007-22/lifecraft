import React, { useState, useEffect } from 'react';
import { LifeEvent, Choice } from '../types';
import { NPC_ROSTER } from '../data/mockData';
import { Zap, AlertTriangle, ArrowRight, Laptop, School, Volume2 } from 'lucide-react';
import { playClickSound, playLockSound } from '../utils/soundEffects';

interface ComicHardwareFailureModalProps {
  event: LifeEvent;
  onResolve: (choiceId: string) => void;
  soundEnabled?: boolean;
}

export const ComicHardwareFailureModal: React.FC<ComicHardwareFailureModalProps> = ({
  event,
  onResolve,
  soundEnabled = true,
}) => {
  const [flash, setFlash] = useState(true);
  const [dialogueStep, setDialogueStep] = useState(0);

  const dialogues = event.storyDialogues || [
    { speaker: 'maya', speakerName: 'Maya', text: 'Wait... what just happened?', expression: 'surprised' },
    { speaker: 'arjun', speakerName: 'Arjun', text: 'The motherboard is gone.', expression: 'stressed' },
    { speaker: 'luma', speakerName: 'LUMA', text: 'Estimated replacement cost: ₹12,000.', expression: 'worried' },
    { speaker: 'maya', speakerName: 'Maya', text: 'We have assignments and sprint releases due this week!', expression: 'frustrated' },
  ];

  // Trigger flash effect on mount
  useEffect(() => {
    const timer = setTimeout(() => setFlash(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const isDialogueFinished = dialogueStep >= dialogues.length;

  const handleAdvanceDialogue = () => {
    playClickSound(soundEnabled);
    setDialogueStep((prev) => prev + 1);
  };

  const handleSelectChoice = (choiceId: string) => {
    playLockSound(soundEnabled);
    onResolve(choiceId);
  };

  const currentDialogue = dialogues[Math.min(dialogueStep, dialogues.length - 1)];
  const speakerObj = NPC_ROSTER[currentDialogue?.speaker] || NPC_ROSTER.maya;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
      {/* Sudden Comic Flash Overlay */}
      {flash && (
        <div className="absolute inset-0 bg-amber-400 z-50 pointer-events-none animate-ping opacity-75" />
      )}

      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border-3 border-amber-500 shadow-2xl overflow-hidden my-8">
        {/* Top Warning Ribbon */}
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 text-white p-3.5 flex items-center justify-between text-xs font-mono font-bold tracking-widest uppercase">
          <div className="flex items-center gap-2 animate-pulse">
            <Zap className="w-4 h-4 fill-current" />
            <span>UNEXPECTED CHALLENGE · ⚡ LAPTOP TROUBLE</span>
          </div>
          <span className="bg-black/30 px-2 py-0.5 rounded">11:00 PM NIGHT BEFORE DEADLINE</span>
        </div>

        {/* Comic Story Scene Illustration */}
        <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden border-b border-amber-500/40">
          <img
            src="/src/assets/images/scene_startup_studio_1791613582393.jpg"
            alt="Hardware failure"
            className="w-full h-full object-cover filter brightness-50 contrast-125"
          />

          {/* Dramatic Blackout & Sparks Effect */}
          <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center animate-bounce shadow-xl">
              <Zap className="w-8 h-8 fill-current" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                ⚡ LAPTOP SUDDENLY OVERHEATS
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-display text-white">
                The Screen Goes Pitch Black!
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                It is 11:00 PM before the big project submission. Arjun’s laptop suddenly clicks and shuts down.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Dialogue Sequence */}
        <div className="p-6 sm:p-8 space-y-6">
          {!isDialogueFinished ? (
            <div
              onClick={handleAdvanceDialogue}
              className="p-5 rounded-2xl bg-slate-950 border-2 border-amber-500/60 cursor-pointer hover:border-amber-400 transition-all shadow-xl group space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-400">
                    <img
                      src={speakerObj.avatarImage}
                      alt={currentDialogue.speakerName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400 block">
                      {currentDialogue.speakerName.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{speakerObj.role}</span>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-slate-500">
                  {dialogueStep + 1} / {dialogues.length}
                </span>
              </div>

              <p className="text-base sm:text-lg font-medium text-slate-100 font-sans leading-relaxed py-1">
                &ldquo;{currentDialogue.text}&rdquo;
              </p>

              <div className="flex items-center justify-between text-xs font-mono text-amber-400/90 pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400">Click to advance dialogue</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                  Next line <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center space-y-1">
                <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                  WHAT SHOULD YOUR TEAM DO?
                </span>
                <h4 className="text-xl sm:text-2xl font-black font-display text-white">
                  Pick the Best Way Forward
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Submission is tomorrow morning. How should you and your team solve this problem?
                </p>
              </div>

              {/* Two Visual Game Options (NO SCORES OR XP DISPLAYED) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {event.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectChoice(choice.id)}
                    className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-700 hover:border-amber-400 text-left transition-all hover:scale-[1.02] shadow-xl space-y-3 cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{choice.icon}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {choice.tag}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold font-display text-white group-hover:text-amber-300 transition-colors">
                        {choice.title}
                      </h5>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {choice.text}
                      </p>
                    </div>

                    <div className="w-full py-2 rounded-xl bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-300 text-xs font-bold font-mono text-center transition-colors flex items-center justify-center gap-1 mt-2">
                      <span>CHOOSE THIS PATH</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
