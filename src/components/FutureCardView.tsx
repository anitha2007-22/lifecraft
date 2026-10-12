import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import QRCode from 'qrcode';
import { Download, Share2, Sparkles, Trophy } from 'lucide-react';

export const FutureCardView: React.FC = () => {
  const { user, profile, gameState, activeJourney } = useGame();
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const studentName = profile?.name || user?.name || 'Kiran Verma';
  const archetype = profile?.exploratoryArchetype || 'Systems Strategist';

  useEffect(() => {
    QRCode.toDataURL(`https://lifecraft.ai/card/${studentName.replace(/\s+/g, '-').toLowerCase()}`, {
      width: 120,
      margin: 1,
      color: { dark: '#0284c7', light: '#ffffff' },
    })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error(err));
  }, [studentName]);

  const handleShare = () => {
    navigator.clipboard.writeText(
      `Check out my LIFECRAFT Future Explorer Card! Level ${gameState.level} ${archetype} with ${gameState.completedMissionsCount} completed missions.`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-1">
        <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
          DIGITAL IDENTITY BADGE
        </span>
        <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Your Future Explorer Card
        </h2>
        <p className="text-xs text-slate-500">
          A shareable holographic trading card of your simulation prowess.
        </p>
      </div>

      {/* The Collectible Card */}
      <div
        id="future-card-element"
        className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-cyan-500/40 p-6 sm:p-8 shadow-2xl text-white space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold font-display tracking-tight text-sm">
            <Sparkles className="w-4 h-4" />
            <span>LIFECRAFT AI</span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 font-bold border border-cyan-500/30 px-2 py-0.5 rounded-full">
            FUTURE EXPLORER
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">SIMULATOR IDENTITY</span>
          <h3 className="text-2xl font-extrabold font-display">{studentName}</h3>
          <p className="text-xs text-cyan-300 font-medium">{archetype}</p>
        </div>

        {/* Core skills */}
        <div className="space-y-2 py-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">DEMONSTRATED STRENGTHS</span>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-300">Problem Solving</span>
              <span className="font-mono text-cyan-400 font-bold tabular-nums">
                {gameState.skillScores.problemSolving}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Strategic Planning</span>
              <span className="font-mono text-amber-400 font-bold tabular-nums">
                {gameState.skillScores.planning}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Creative Decision Making</span>
              <span className="font-mono text-purple-400 font-bold tabular-nums">
                {gameState.skillScores.creativity}%
              </span>
            </div>
          </div>
        </div>

        {/* Footer info & QR */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="font-mono text-xs space-y-1">
            <div className="text-slate-400">
              Missions: <span className="font-bold text-white">{gameState.completedMissionsCount}</span>
            </div>
            <div className="text-slate-400">
              Rank Tier: <span className="font-bold text-amber-400">Level {gameState.level}</span>
            </div>
            <div className="text-slate-400">
              XP Earned: <span className="font-bold text-cyan-400">{gameState.xp}</span>
            </div>
          </div>

          {qrUrl && (
            <img
              src={qrUrl}
              alt="Card QR"
              className="w-16 h-16 rounded-lg bg-white p-1 border border-slate-700 shadow-sm"
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleShare}
          className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Card Copied!' : 'Share Player Card'}</span>
        </button>
      </div>
    </div>
  );
};
