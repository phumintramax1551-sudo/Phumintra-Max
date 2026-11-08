import React from 'react';
import { PlayerStats } from '../game/types';
import { Trophy, Skull, Target, Award, RotateCcw, Home } from 'lucide-react';

interface GameOverModalProps {
  winner: string;
  stats: PlayerStats;
  onPlayAgain: () => void;
  onQuitToTitle: () => void;
  lang: 'th' | 'en';
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  winner,
  stats,
  onPlayAgain,
  onQuitToTitle,
  lang,
}) => {
  const isVictory = winner.includes('Victory') || winner.includes('Blue');
  const kdRatio = stats.deaths > 0 ? (stats.kills / stats.deaths).toFixed(2) : stats.kills.toFixed(2);
  const headshotRate = stats.kills > 0 ? Math.round((stats.headshots / stats.kills) * 100) : 0;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/85 select-none p-4 font-sans">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl border border-cyan-500/40 bg-slate-950 shadow-[0_0_60px_rgba(6,182,212,0.4)] text-center">
        {/* Banner Result */}
        <div className="flex flex-col items-center mb-6">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 border-2 ${
              isVictory
                ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.6)]'
                : 'border-rose-500 bg-rose-950/80 text-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.6)]'
            }`}
          >
            {isVictory ? <Trophy size={32} /> : <Skull size={32} />}
          </div>

          <h2
            className={`text-3xl font-mono font-black tracking-widest uppercase ${
              isVictory ? 'text-cyan-300 drop-shadow-[0_0_15px_#00f0ff]' : 'text-rose-400 drop-shadow-[0_0_15px_#f43f5e]'
            }`}
          >
            {isVictory ? (lang === 'th' ? 'ชัยชนะ! (VICTORY)' : 'MISSION ACCOMPLISHED') : (lang === 'th' ? 'พ่ายแพ้ (DEFEAT)' : 'MISSION FAILED')}
          </h2>
          <span className="text-xs font-mono text-slate-400 mt-1">{winner}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/60 mb-6">
          {/* Kills */}
          <div className="flex flex-col items-center p-2 rounded bg-slate-950/60">
            <span className="text-xs font-mono text-slate-400">{lang === 'th' ? 'สังหาร' : 'KILLS'}</span>
            <span className="text-2xl font-mono font-black text-cyan-400 tabular-nums">{stats.kills}</span>
          </div>

          {/* Deaths */}
          <div className="flex flex-col items-center p-2 rounded bg-slate-950/60">
            <span className="text-xs font-mono text-slate-400">{lang === 'th' ? 'ตาย' : 'DEATHS'}</span>
            <span className="text-2xl font-mono font-black text-rose-400 tabular-nums">{stats.deaths}</span>
          </div>

          {/* K/D */}
          <div className="flex flex-col items-center p-2 rounded bg-slate-950/60">
            <span className="text-xs font-mono text-slate-400">K / D</span>
            <span className="text-2xl font-mono font-black text-yellow-400 tabular-nums">{kdRatio}</span>
          </div>

          {/* Headshots */}
          <div className="flex flex-col items-center p-2 rounded bg-slate-950/60">
            <span className="text-xs font-mono text-slate-400">{lang === 'th' ? 'เฮดช็อต' : 'HS %'}</span>
            <span className="text-2xl font-mono font-black text-purple-400 tabular-nums">{headshotRate}%</span>
          </div>
        </div>

        {/* Total Score & Rating */}
        <div className="flex items-center justify-between px-6 py-3 rounded-lg border border-cyan-500/30 bg-cyan-950/30 mb-8">
          <div className="flex items-center gap-2 text-left">
            <Award size={20} className="text-cyan-400" />
            <div>
              <div className="text-xs font-mono text-slate-400">{lang === 'th' ? 'คะแนนแมตช์' : 'TOTAL SCORE'}</div>
              <div className="text-lg font-mono font-bold text-white">{stats.score} PTS</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
              {stats.score > 1200 ? 'RATING: S+ (VALKYRIE)' : stats.score > 600 ? 'RATING: A (ELITE)' : 'RATING: B (OPERATIVE)'}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg font-mono font-bold text-sm bg-gradient-to-r from-cyan-500 to-sky-600 text-white hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            <RotateCcw size={16} />
            {lang === 'th' ? 'เล่นอีกครั้ง (PLAY AGAIN)' : 'DEPLOY AGAIN'}
          </button>
          <button
            onClick={onQuitToTitle}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-lg font-mono font-semibold text-xs border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Home size={16} />
            {lang === 'th' ? 'กลับสู่หน้าหลัก (MAIN MENU)' : 'MAIN MENU'}
          </button>
        </div>
      </div>
    </div>
  );
};
