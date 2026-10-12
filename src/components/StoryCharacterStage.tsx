import React from 'react';
import { CharacterExpression, NPCCharacter } from '../types';
import { NPC_ROSTER } from '../data/mockData';
import { Sparkles, MapPin } from 'lucide-react';

interface StoryCharacterStageProps {
  sceneBackground: string;
  sceneLocationName?: string;
  charactersInScene: string[]; // e.g. ['maya', 'arjun', 'luma']
  activeSpeaker?: string;
  speakerExpression?: CharacterExpression;
  lumaReactionText?: string;
  onOpenExplainSimply?: () => void;
}

export const EXPRESSION_EMOJIS: Record<CharacterExpression, string> = {
  happy: '🙂',
  worried: '😟',
  surprised: '😮',
  thinking: '🤔',
  confident: '😎',
  stressed: '😰',
  frustrated: '😡',
  excited: '🎉',
  neutral: '😐',
};

export const StoryCharacterStage: React.FC<StoryCharacterStageProps> = ({
  sceneBackground,
  sceneLocationName = 'Startup Innovation Lab',
  charactersInScene,
  activeSpeaker,
  speakerExpression = 'neutral',
  lumaReactionText,
  onOpenExplainSimply,
}) => {
  const isLumaPresent = charactersInScene.includes('luma');
  const humanCharacters = charactersInScene.filter((c) => c !== 'luma');

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-2 border-slate-700/60 shadow-2xl bg-slate-950 aspect-[16/10] sm:aspect-[16/9] max-h-[460px] select-none group">
      {/* Background Illustrated Scene */}
      <img
        src={sceneBackground}
        alt={sceneLocationName}
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05] transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
      />

      {/* Comic Vignette & Ambient Glow Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/40 pointer-events-none" />

      {/* Top Left: Scene Location Badge */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[11px] sm:text-xs font-mono font-bold tracking-wider shadow-lg">
        <MapPin className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>{sceneLocationName.toUpperCase()}</span>
      </div>

      {/* Top Right: Floating LUMA Companion (Animated Hologram) */}
      {isLumaPresent && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex flex-col items-end">
          <div className="relative flex items-center gap-2">
            {/* Luma Floating Dialogue Cloud (if reacting) */}
            {lumaReactionText ? (
              <div className="max-w-[200px] sm:max-w-[240px] px-3 py-1.5 rounded-2xl bg-cyan-950/90 border border-cyan-400 text-cyan-100 text-xs font-medium backdrop-blur-md shadow-xl animate-bounce">
                <span className="font-bold text-cyan-300">LUMA: </span>
                {lumaReactionText}
              </div>
            ) : onOpenExplainSimply ? (
              <button
                type="button"
                onClick={onOpenExplainSimply}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/90 border border-cyan-400/50 text-[11px] font-mono text-cyan-300 hover:text-white hover:border-cyan-400 transition-all shadow-md cursor-pointer animate-pulse"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Explain simply / எளிய விளக்கம்</span>
              </button>
            ) : null}

            {/* Glowing Floating Luma Hologram */}
            <button
              type="button"
              onClick={onOpenExplainSimply}
              title="Click for Easy Guide & Tamil Explanation"
              className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-xl cursor-pointer hover:scale-105 ${
                activeSpeaker === 'luma'
                  ? 'border-cyan-400 ring-4 ring-cyan-400/30 scale-110 shadow-cyan-500/50'
                  : 'border-cyan-500/70 hover:border-cyan-400'
              }`}
              style={{
                animation: 'float 3.5s ease-in-out infinite',
              }}
            >
              <img
                src={NPC_ROSTER.luma.avatarImage}
                alt="LUMA AI"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-cyan-950/90 text-[9px] font-mono font-bold text-cyan-300 text-center py-0.5 tracking-widest flex items-center justify-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>HELP</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Center/Stage: Characters Standing in the Scene */}
      <div className="absolute inset-x-4 bottom-2 sm:inset-x-8 sm:bottom-3 z-20 flex items-end justify-around gap-2 sm:gap-6">
        {humanCharacters.map((charKey) => {
          const charData: NPCCharacter | undefined = NPC_ROSTER[charKey];
          if (!charData) return null;

          const isSpeaking = activeSpeaker === charKey;
          const currentExpr = isSpeaking ? speakerExpression : charData.defaultExpression || 'neutral';
          const emoji = EXPRESSION_EMOJIS[currentExpr] || '🙂';

          return (
            <div
              key={charKey}
              className={`relative flex flex-col items-center transition-all duration-300 transform origin-bottom ${
                isSpeaking
                  ? 'scale-105 sm:scale-110 z-30 filter drop-shadow-[0_10px_20px_rgba(6,182,212,0.35)]'
                  : 'scale-95 sm:scale-100 opacity-75 filter grayscale-[25%]'
              }`}
            >
              {/* Dynamic Emotional Expression Badge */}
              <div
                className={`absolute -top-3 sm:-top-4 z-30 px-2 sm:px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-bold shadow-lg border backdrop-blur-md flex items-center gap-1 transition-transform ${
                  isSpeaking
                    ? 'bg-amber-400 text-slate-950 border-amber-300 scale-110 animate-pulse'
                    : 'bg-slate-900/80 text-white border-slate-700'
                }`}
              >
                <span>{emoji}</span>
                <span className="text-[10px] font-mono capitalize hidden sm:inline">{currentExpr}</span>
              </div>

              {/* Character Portrait with Comic Frame */}
              <div
                className={`w-28 sm:w-40 md:w-48 aspect-square rounded-3xl overflow-hidden border-3 sm:border-4 transition-all duration-300 shadow-2xl relative bg-slate-900 ${
                  isSpeaking
                    ? 'border-cyan-400 ring-4 ring-cyan-500/40 shadow-cyan-500/40'
                    : 'border-slate-700/80'
                }`}
              >
                <img
                  src={charData.avatarImage}
                  alt={charData.name}
                  className="w-full h-full object-cover object-top"
                />

                {/* Subtle speaker glow pulse */}
                {isSpeaking && (
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-transparent to-transparent pointer-events-none" />
                )}
              </div>

              {/* Character Name Tag with Role */}
              <div
                className={`mt-1.5 px-3 py-1 rounded-xl text-center backdrop-blur-md border shadow-md transition-all ${
                  isSpeaking
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-extrabold shadow-cyan-500/30'
                    : 'bg-slate-900/90 text-slate-200 border-slate-700 font-medium'
                }`}
              >
                <div className="text-xs sm:text-sm font-bold font-display leading-tight">{charData.name}</div>
                <div className={`text-[9px] sm:text-[10px] font-mono leading-none tracking-tight ${isSpeaking ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                  {charData.role}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Keyframe Animation in local style */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
};
