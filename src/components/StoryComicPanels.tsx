import React from 'react';
import { ComicPanel } from '../types';
import { NPC_ROSTER } from '../data/mockData';
import { Sparkles, MessageSquare } from 'lucide-react';

interface StoryComicPanelsProps {
  panels: ComicPanel[];
}

export const StoryComicPanels: React.FC<StoryComicPanelsProps> = ({ panels }) => {
  if (!panels || panels.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
          STORY CHRONICLE · COMIC PANELS
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {panels.map((panel, idx) => {
          const speakerKey = panel.speaker?.toLowerCase();
          const speakerObj = speakerKey ? NPC_ROSTER[speakerKey] : null;

          return (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900 border-2 border-slate-700/80 p-3.5 space-y-2.5 shadow-lg relative overflow-hidden flex flex-col justify-between"
            >
              {/* Comic Panel Header */}
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/50 text-[10px] font-mono font-bold text-cyan-300">
                  PANEL 0{panel.panelNumber || idx + 1}
                </span>
                {panel.icon && <span className="text-base">{panel.icon}</span>}
              </div>

              {/* Panel Image if present */}
              {panel.image && (
                <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                  <img
                    src={panel.image}
                    alt={panel.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Panel Narrative Caption */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold font-display text-white">
                  {panel.title}
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {panel.caption}
                </p>
              </div>

              {/* Character Speech Bubble in Panel */}
              {panel.speakerDialogue && (
                <div className="p-2 rounded-xl bg-slate-800/90 border border-slate-700 text-[11px] text-slate-100 flex items-start gap-2">
                  {speakerObj?.avatarImage && (
                    <img
                      src={speakerObj.avatarImage}
                      alt={panel.speaker}
                      className="w-6 h-6 rounded-lg object-cover border border-cyan-400 shrink-0 mt-0.5"
                    />
                  )}
                  <div>
                    <span className="font-bold text-[10px] text-cyan-400 block font-mono">
                      {panel.speaker?.toUpperCase() || 'CAST'}:
                    </span>
                    <span className="italic leading-snug">&ldquo;{panel.speakerDialogue}&rdquo;</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
