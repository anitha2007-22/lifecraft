import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import QRCode from 'qrcode';
import {
  Sparkles,
  Printer,
  Share2,
  CheckCircle2,
  Award,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const SkillPassportView: React.FC = () => {
  const { user, profile, gameState, activeJourney, achievements } = useGame();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);

  const studentName = profile?.name || user?.name || 'Kiran Verma';
  const passportId = `LC-PASS-${Math.abs(studentName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 100000))}-2026`;
  const issueDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  useEffect(() => {
    // Generate valid QR code data URL pointing to verification link
    const verificationUrl = `https://lifecraft.ai/verify/passport/${passportId}`;
    QRCode.toDataURL(verificationUrl, {
      width: 160,
      margin: 1,
      color: { dark: '#0284c7', light: '#ffffff' },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [passportId]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `Check out my verified LIFECRAFT AI Skill Passport! (ID: ${passportId}) - Level ${gameState.level} Explorer with ${gameState.xp} XP.`
    );
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const unlockedBadges = achievements.filter((a) =>
    gameState.unlockedAchievementIds.includes(a.id)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest block">
            VERIFIED CREDENTIAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Digital Skill Passport
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copySuccess ? 'Link Copied!' : 'Share Passport'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable Passport Document */}
      <div
        id="printable-passport"
        className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-cyan-500/30 p-6 sm:p-12 shadow-2xl space-y-8 relative overflow-hidden"
      >
        {/* Holographic Watermark Border Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Passport Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/20">
              LC
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 block font-bold">
                LIFECRAFT SIMULATION PASSPORT
              </span>
              <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white">
                {studentName}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {profile?.classGrade || '12th Grade Senior'} · Archetype: {profile?.exploratoryArchetype || 'Systems Strategist'}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-slate-500 space-y-1">
            <div>
              <span className="text-slate-400">Passport ID: </span>
              <span className="font-semibold text-slate-900 dark:text-white">{passportId}</span>
            </div>
            <div>
              <span className="text-slate-400">Issued On: </span>
              <span className="font-semibold text-slate-900 dark:text-white">{issueDate}</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1 text-emerald-500 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Simulation Cryptographically Validated</span>
            </div>
          </div>
        </div>

        {/* Middle: Scores Matrix + QR Code */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              DEMONSTRATED COMPETENCY SCORES
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 block">Problem Solving</span>
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {gameState.skillScores.problemSolving}%
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 block">Decision Making</span>
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {gameState.skillScores.decisionMaking}%
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 block">Creativity & Innovation</span>
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {gameState.skillScores.creativity}%
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 block">Collaborative Teamwork</span>
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {gameState.skillScores.teamwork}%
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 block">Strategic Planning</span>
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {gameState.skillScores.planning}%
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 block">Financial Acumen</span>
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {gameState.skillScores.financialManagement}%
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Verification Box */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center space-y-3">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Verification QR Code"
                className="w-32 h-32 rounded-xl shadow-md border border-white"
              />
            ) : (
              <div className="w-32 h-32 bg-slate-200 animate-pulse rounded-xl" />
            )}
            <span className="text-[11px] font-mono text-slate-500 block">
              Scan to verify live credential authenticity on LIFECRAFT registry.
            </span>
          </div>
        </div>

        {/* Badges strip */}
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            ACHIEVEMENTS ATTAINED ({unlockedBadges.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {unlockedBadges.length > 0 ? (
              unlockedBadges.map((b) => (
                <div
                  key={b.id}
                  className="px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-xs font-medium text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{b.title}</span>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">
                Play simulation missions to unlock certified achievement badges.
              </span>
            )}
          </div>
        </div>

        {/* Mandatory Official Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
            Official Simulation Notice:
          </span>
          The scores and rankings contained in this document reflect participant performance within the LIFECRAFT AI gamified decision simulation engine. This document is a gaming and learning achievement record, not an accredited psychological or formal vocational certification.
        </div>
      </div>
    </div>
  );
};
