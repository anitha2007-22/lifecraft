import React, { useEffect, useState } from 'react';
import { StoryDialogue, CharacterExpression } from '../types';
import { NPC_ROSTER } from '../data/mockData';
import { EXPRESSION_EMOJIS } from './StoryCharacterStage';
import { ChevronRight, FastForward, Sparkles, Volume2 } from 'lucide-react';
import { playClickSound } from '../utils/soundEffects';

interface StoryDialogueBoxProps {
  dialogues: StoryDialogue[];
  onFinishDialogues: () => void;
  onDialogueStepChange?: (speaker: string, expression: CharacterExpression) => void;
  soundEnabled?: boolean;
}

export const StoryDialogueBox: React.FC<StoryDialogueBoxProps> = ({
  dialogues,
  onFinishDialogues,
  onDialogueStepChange,
  soundEnabled = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentLine = dialogues[currentIndex] || dialogues[0];
  const isLastLine = currentIndex >= dialogues.length - 1;

  useEffect(() => {
    if (currentLine && onDialogueStepChange) {
      onDialogueStepChange(currentLine.speaker, currentLine.expression || 'neutral');
    }
  }, [currentIndex, currentLine, onDialogueStepChange]);

  const speakerData = NPC_ROSTER[currentLine?.speaker] || {
    name: currentLine?.speakerName || 'Narrator',
    role: 'LIFECRAFT Cast',
    avatarEmoji: '💬',
    avatarImage: '/src/assets/images/char_maya_leader_1791613549629.jpg',
  };

  const expression = currentLine?.expression || 'neutral';
  const emoji = EXPRESSION_EMOJIS[expression] || '🙂';

  const handleNext = () => {
    playClickSound(soundEnabled);
    if (isLastLine) {
      onFinishDialogues();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSkipAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound(soundEnabled);
    onFinishDialogues();
  };

  return (
    <div
      onClick={handleNext}
      className="relative w-full rounded-3xl bg-slate-900/95 border-2 border-cyan-500/40 p-4 sm:p-6 shadow-2xl backdrop-blur-xl cursor-pointer select-none transition-all hover:border-cyan-400 group overflow-hidden"
    >
      {/* Subtle comic top accent line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

      {/* Header Row: Speaker Nameplate + Dialogue Step Progress + Skip Button */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          {/* Character Mini Portrait */}
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden border-2 border-cyan-400 bg-slate-950 shrink-0 shadow-md">
            <img
              src={speakerData.avatarImage}
              alt={currentLine.speakerName}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold font-display text-sm sm:text-base text-white tracking-wide">
                {currentLine.speakerName.toUpperCase()}
              </span>
              <span className="text-sm" title={`Expression: ${expression}`}>{emoji}</span>
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-cyan-400 block -mt-0.5">
              {speakerData.role}
            </span>
          </div>
        </div>

        {/* Step dots & Skip action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {dialogues.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-5 bg-cyan-400'
                    : i < currentIndex
                    ? 'w-2 bg-slate-600'
                    : 'w-1.5 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleSkipAll}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Skip</span>
            <FastForward className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Dialogue Content (1-2 punchy sentences) */}
      <div className="py-4 sm:py-5 min-h-[72px] sm:min-h-[84px] flex items-center">
        <p className="text-base sm:text-xl font-medium font-sans text-slate-100 leading-snug tracking-normal">
          &ldquo;{currentLine.text}&rdquo;
        </p>
      </div>

      {/* Footer prompt */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
        <span className="text-[11px] font-mono text-slate-500">
          Scene dialogue {currentIndex + 1} of {dialogues.length}
        </span>

        <div className="flex items-center gap-1 font-mono font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors animate-pulse">
          <span>{isLastLine ? 'Make Decision →' : 'Tap to continue →'}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
