import React, { useEffect, useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import {
  Award,
  Printer,
  Lock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Eye,
  CheckCircle2,
  Trophy,
} from 'lucide-react';
import { playClickSound, playLevelUpSound } from '../utils/soundEffects';

interface CertificateViewProps {
  onContinueSimulation?: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ onContinueSimulation }) => {
  const { user, profile, gameState, activeJourney, soundEnabled } = useGame();
  const [qrUrl, setQrUrl] = useState<string>('');
  const [showCertificatePreview, setShowCertificatePreview] = useState<boolean>(true);
  const certRef = useRef<HTMLDivElement | null>(null);

  // Strictly compute levels based on real simulation progress stored in application
  const totalLevels = activeJourney?.scenarios.length || gameState.totalLevels || 8;
  const completedLevels = Math.min(
    totalLevels,
    gameState.completedLevels ?? gameState.completedMissionsCount ?? 0
  );
  
  // Certificate is strictly unlocked ONLY when completedLevels === totalLevels
  const isUnlocked = Boolean(
    gameState.isCertificateUnlocked || (totalLevels > 0 && completedLevels >= totalLevels)
  );

  const levelsRemaining = Math.max(0, totalLevels - completedLevels);
  const progressPercent = Math.min(100, Math.round((completedLevels / totalLevels) * 100));

  const studentName = profile?.name || user?.name || 'Kiran Verma';
  const journeyTitle = activeJourney?.title || 'Software & Autonomous AI Systems';
  const certId = `LC-CERT-${Math.abs(studentName.length * 997 + 104231)}-2026`;
  const completionDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Confetti and sound on unlock
  useEffect(() => {
    if (isUnlocked) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.35 },
        });
      } catch (e) {
        // safe
      }
      playLevelUpSound(soundEnabled);
    }
  }, [isUnlocked, soundEnabled]);

  // QR Code generator when unlocked
  useEffect(() => {
    if (isUnlocked) {
      QRCode.toDataURL(`https://lifecraft.ai/certificates/verify/${certId}`, {
        width: 140,
        margin: 1,
        color: { dark: '#0891b2', light: '#ffffff' },
      })
        .then((url) => setQrUrl(url))
        .catch((err) => console.error(err));
    }
  }, [certId, isUnlocked]);

  const handlePrint = () => {
    if (!isUnlocked) return;
    playClickSound(soundEnabled);
    window.print();
  };

  const handleViewCertificate = () => {
    if (!isUnlocked) return;
    playClickSound(soundEnabled);
    setShowCertificatePreview(true);
    certRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // =========================================================================
  // 1. LOCKED STATE (When completedLevels < totalLevels)
  // Replaces the preview completely with the locked journey progress card.
  // The button must NOT allow viewing, printing, or downloading the certificate.
  // Do NOT show the actual certificate while it is locked.
  // =========================================================================
  if (!isUnlocked) {
    // Generate text block progress indicator (e.g. ████████░░░░░░░░)
    const totalBlocks = 12;
    const filledBlocks = Math.round((completedLevels / totalLevels) * totalBlocks);
    const emptyBlocks = Math.max(0, totalBlocks - filledBlocks);
    const blockGraphic = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-8 animate-fade-in">
        {/* Prominent Lock Emblem */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-inner transition-transform hover:scale-105">
          <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400" />
        </div>

        {/* Title & Requirement Copy */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase block">
            ACHIEVEMENT CREDENTIAL RESTRICTED
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            🔒 CERTIFICATE LOCKED
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Complete all LIFECRAFT levels to unlock your certificate.
          </p>
        </div>

        {/* Journey Level Progress Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-5 max-w-sm mx-auto text-center">
          <span className="text-xs font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase block">
            LEVEL PROGRESS
          </span>

          {/* Level Progress Fraction */}
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black font-mono text-cyan-600 dark:text-cyan-400 tabular-nums">
              {completedLevels} / {totalLevels}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {completedLevels} / {totalLevels} Levels Completed
            </div>
          </div>

          {/* Graphical Progress Bar */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700/60">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Visual Block Representation (as shown in user specification) */}
            <div className="font-mono text-sm tracking-widest text-cyan-600 dark:text-cyan-400 select-none">
              {blockGraphic}
            </div>
          </div>

          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {levelsRemaining} level{levelsRemaining === 1 ? '' : 's'} remaining
          </div>

          {/* Disabled Locked Button: Strictly prevents viewing, printing, or downloading */}
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Complete all levels to unlock your certificate"
            className="w-full py-3.5 px-6 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-sm cursor-not-allowed border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 select-none shadow-none"
          >
            <Lock className="w-4 h-4" />
            <span>🔒 Certificate Locked</span>
          </button>
        </div>

        {/* CTA to continue playing simulations */}
        {onContinueSimulation && (
          <div className="pt-2">
            <button
              onClick={() => {
                playClickSound(soundEnabled);
                onContinueSimulation();
              }}
              className="px-8 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/25 transition-all cursor-pointer inline-flex items-center gap-2 hover:gap-3"
            >
              <span>Play Level {completedLevels + 1} to Unlock</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. UNLOCKED STATE (When completedLevels === totalLevels)
  // Shows Journey Complete unlock celebration banner, enables:
  // [VIEW CERTIFICATE] and [PRINT / DOWNLOAD CERTIFICATE]
  // and renders the verified Future Explorer Certificate.
  // =========================================================================
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Grand Unlock Celebration Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500/15 via-cyan-500/15 to-emerald-500/15 border-2 border-amber-500/40 p-6 sm:p-8 text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-2 right-4 text-xs font-mono font-bold text-emerald-500 flex items-center gap-1">
          <ShieldCheck className="w-4 h-4" />
          <span>VERIFIED SIMULATION RECORD</span>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <span className="text-3xl animate-bounce">🎉</span>
          <span className="text-3xl animate-pulse">🏆</span>
          <span className="text-3xl animate-bounce">🔓</span>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black font-display text-amber-500 dark:text-amber-400 tracking-wide uppercase">
            🎉 JOURNEY COMPLETE!
          </h2>
          <p className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white font-display">
            🏆 ALL LEVELS COMPLETED ({completedLevels}/{totalLevels})
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono tracking-wider mt-1">
            <span>🔓 CERTIFICATE UNLOCKED</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
          Congratulations, <strong>{studentName}</strong>! You conquered all {totalLevels} critical levels in the <em>{journeyTitle}</em> simulation journey. Your official certificate is unlocked and ready to claim.
        </p>

        {/* Enabled Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleViewCertificate}
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>VIEW CERTIFICATE</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT / DOWNLOAD CERTIFICATE</span>
          </button>
        </div>
      </div>

      {/* Verified Certificate Card */}
      {showCertificatePreview && (
        <div
          ref={certRef}
          id="official-certificate-card"
          className="rounded-3xl bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-4 border-amber-500/40 p-8 sm:p-14 shadow-2xl relative overflow-hidden text-center space-y-8"
        >
          {/* Decorative Certificate Borders */}
          <div className="absolute inset-2 border-2 border-dashed border-amber-500/25 rounded-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Certificate Emblem */}
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-xl shadow-amber-500/25">
            <Award className="w-10 h-10" />
          </div>

          {/* Headers */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-cyan-600 dark:text-cyan-400 uppercase">
              CERTIFICATE OF SIMULATION MASTERY
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">
              LIFECRAFT AI – FUTURE EXPLORER
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Conferred upon demonstrated tactical foresight, resilience, and decision acumen across all {totalLevels} tactical levels.
            </p>
          </div>

          {/* Recipient */}
          <div className="space-y-2 py-4">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">Conferred To</span>
            <h3 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 dark:text-white underline decoration-cyan-500/40 decoration-4 underline-offset-8">
              {studentName}
            </h3>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 pt-2">
              for successfully completing all {totalLevels} simulation levels in the
            </p>
            <p className="text-lg font-bold font-display text-cyan-600 dark:text-cyan-400">
              {journeyTitle} Simulation Journey
            </p>
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto py-4 border-y border-slate-200 dark:border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-400 block">LEVELS</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {completedLevels} / {totalLevels} Completed
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">PLAYER LEVEL</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                Level {gameState.level}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">TOTAL XP</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {gameState.xp} XP
              </span>
            </div>
          </div>

          {/* Footer: Signatures, Date, QR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="text-left font-mono space-y-1">
              <div>Date of Conferral: <span className="font-semibold text-slate-900 dark:text-white">{completionDate}</span></div>
              <div>Certificate ID: <span className="font-semibold text-slate-900 dark:text-white">{certId}</span></div>
              <div className="flex items-center gap-1 text-emerald-500 font-semibold pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified AI Studio Simulation Credential</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {qrUrl && (
                <img
                  src={qrUrl}
                  alt="Verification QR"
                  className="w-20 h-20 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
                />
              )}
              <div className="text-center font-mono">
                <div className="w-28 border-b border-slate-400 dark:border-slate-600 pb-1 mb-1 font-bold text-[11px] text-slate-800 dark:text-slate-200">
                  LIFECRAFT AI
                </div>
                <span className="text-[10px] text-slate-400">Validation Registry</span>
              </div>
            </div>
          </div>

          {/* Educational Disclaimer */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
            This document represents a LIFECRAFT AI project completion and gamified achievement award. It is not an accredited school diploma or government academic degree.
          </div>
        </div>
      )}
    </div>
  );
};
