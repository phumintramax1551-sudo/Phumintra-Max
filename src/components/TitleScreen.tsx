import React from 'react';
import { GameMode } from '../game/types';
import { Shield, Zap, Crosshair, Volume2, VolumeX, Sparkles, Trophy } from 'lucide-react';
import { soundEngine } from '../game/audio';

interface TitleScreenProps {
  onStartGame: (mode: GameMode) => void;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  lang: 'th' | 'en';
  onToggleLang: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  selectedMode,
  onSelectMode,
  isMuted,
  onToggleMute,
  lang,
  onToggleLang,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        onStartGame(selectedMode);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame, selectedMode]);

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-10 pointer-events-none select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">
            PROTOCOL // V2.8 ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLang}
            className="px-3 py-1.5 rounded border border-cyan-500/30 bg-slate-900/80 hover:bg-cyan-950/60 text-xs font-mono text-cyan-300 transition-colors cursor-pointer"
          >
            {lang === 'th' ? 'TH | ภาษาไทย' : 'EN | English'}
          </button>
          <button
            onClick={onToggleMute}
            className="p-2 rounded border border-cyan-500/30 bg-slate-900/80 hover:bg-cyan-950/60 text-cyan-300 transition-colors cursor-pointer"
            title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* Center Hero Title Lockup (Bespoke Inline SVG over 35% negative space) */}
      <div className="flex flex-col items-center justify-center my-auto text-center pointer-events-auto">
        {/* Bespoke Inline SVG Title Lockup with Cyber Angel Wings */}
        <div className="relative mb-2 max-w-xl w-full">
          <svg viewBox="0 0 700 160" className="w-full h-auto drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]">
            <defs>
              <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Stylized Cyber Wings */}
            <path
              d="M 120 80 Q 70 20 20 60 Q 60 90 100 85 Z"
              fill="url(#wingGrad)"
              stroke="#00f0ff"
              strokeWidth="1.5"
            />
            <path
              d="M 140 90 Q 90 40 40 80 Q 80 110 120 100 Z"
              fill="url(#wingGrad)"
              stroke="#00f0ff"
              strokeWidth="1.2"
            />

            <path
              d="M 580 80 Q 630 20 680 60 Q 640 90 600 85 Z"
              fill="url(#wingGrad)"
              stroke="#00f0ff"
              strokeWidth="1.5"
            />
            <path
              d="M 560 90 Q 610 40 660 80 Q 620 110 580 100 Z"
              fill="url(#wingGrad)"
              stroke="#00f0ff"
              strokeWidth="1.2"
            />

            {/* Main Title Text */}
            <text
              x="350"
              y="75"
              textAnchor="middle"
              fontFamily="'Orbitron', sans-serif"
              fontWeight="900"
              fontSize="52"
              letterSpacing="6"
              fill="url(#cyberGrad)"
            >
              CYBER ANGEL
            </text>

            {/* Subtitle Tech Line */}
            <text
              x="350"
              y="115"
              textAnchor="middle"
              fontFamily="'Rajdhani', sans-serif"
              fontWeight="700"
              fontSize="20"
              letterSpacing="10"
              fill="#94a3b8"
            >
              TACTICAL FPS · PROTOCOL
            </text>

            {/* Decorative Tech Underline */}
            <line x1="160" y1="132" x2="540" y2="132" stroke="#06b6d4" strokeWidth="2" strokeOpacity="0.6" />
            <polygon points="350,128 356,134 350,140 344,134" fill="#00f0ff" />
          </svg>
        </div>

        <p className="text-slate-300 font-medium text-sm sm:text-base max-w-lg mb-8 drop-shadow">
          {lang === 'th'
            ? 'เกมยิงปืน FPS แท็กติคอล พร้อมระบบ Angel Dance ฟื้นฟูเลือด และโหมดชีวะกลายพันธุ์สุดมันส์'
            : 'Next-gen tactical arcade FPS featuring the iconic Angel Dance heal mechanic & Bio-Mutant Outbreak'}
        </p>

        {/* Game Mode Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl w-full mb-8">
          {/* Mode 1: TDM */}
          <button
            onClick={() => onSelectMode('tdm')}
            className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
              selectedMode === 'tdm'
                ? 'border-cyan-400 bg-cyan-950/80 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'border-slate-800 bg-slate-900/70 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-cyan-400">MODE 01</span>
              <Crosshair size={18} className={selectedMode === 'tdm' ? 'text-cyan-400' : 'text-slate-500'} />
            </div>
            <h3 className="font-bold text-white text-base">
              {lang === 'th' ? 'ทีมเดธแมตช์ (TDM)' : 'Team Deathmatch'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'th' ? '4v4 ปะทะเดือด ชิง 30 Kills สู่ชัยชนะ' : 'Fast 4v4 arena skirmish to 30 kills'}
            </p>
          </button>

          {/* Mode 2: Mutant Outbreak */}
          <button
            onClick={() => onSelectMode('mutant')}
            className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
              selectedMode === 'mutant'
                ? 'border-emerald-400 bg-emerald-950/80 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'border-slate-800 bg-slate-900/70 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-emerald-400">MODE 02</span>
              <Zap size={18} className={selectedMode === 'mutant' ? 'text-emerald-400' : 'text-slate-500'} />
            </div>
            <h3 className="font-bold text-white text-base">
              {lang === 'th' ? 'ชีวะกลายพันธุ์ (มัมมี่)' : 'Mutant Outbreak'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'th' ? 'มนุษย์เอาชีวิตรอด หรือแพร่เชื้อกลายพันธุ์' : 'Survive the infected or infect all'}
            </p>
          </button>

          {/* Mode 3: Training */}
          <button
            onClick={() => onSelectMode('training')}
            className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
              selectedMode === 'training'
                ? 'border-purple-400 bg-purple-950/80 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'border-slate-800 bg-slate-900/70 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-purple-400">MODE 03</span>
              <Trophy size={18} className={selectedMode === 'training' ? 'text-purple-400' : 'text-slate-500'} />
            </div>
            <h3 className="font-bold text-white text-base">
              {lang === 'th' ? 'สนามฝึกยิง (Firing Range)' : 'Target Practice'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'th' ? 'ทดสอบอาวุธ เล็ง Headshot ไร้จำกัด' : 'Unlimited ammo & target test dummies'}
            </p>
          </button>
        </div>

        {/* Primary Start CTA Button */}
        <button
          onClick={() => onStartGame(selectedMode)}
          className="group relative px-10 py-4 rounded-md font-black font-mono tracking-widest text-lg uppercase bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_45px_rgba(6,182,212,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span className="relative z-10 flex items-center gap-3">
            <Sparkles size={20} className="animate-spin" />
            {lang === 'th' ? 'เริ่มเข้าสู่สมรภูมิ (START MISSION)' : 'DEPLOY OPERATIVE (START)'}
          </span>
          <div className="absolute inset-0 rounded-md border-2 border-cyan-300 opacity-60 group-hover:opacity-100 transition-opacity"></div>
        </button>

        <span className="mt-3 text-xs font-mono text-cyan-400/80 tracking-wider">
          {lang === 'th' ? 'กด [ Enter ] หรือ [ Space ] เพื่อเริ่มทันที' : 'Press [ ENTER ] or [ SPACE ] to Deploy'}
        </span>
      </div>

      {/* Flat Single-Line Control Hint (Game Craft Requirement) */}
      <div className="w-full text-center pointer-events-auto">
        <div className="inline-block px-5 py-2 rounded-full border border-slate-800 bg-slate-950/85 text-xs font-mono text-slate-400 tracking-wider">
          {lang === 'th'
            ? 'WASD เคลื่อนที่ · คลิกซ้าย ยิง · คลิกขวา เล็ง · C ร่าย Angel Dance (ฟื้นฟูเลือด) · R บรรจุกระสุน · G ปาระเบิด · 1-4 เปลี่ยนปืน · Esc เมนู'
            : 'WASD Move · Left Click Fire · Right Click ADS · C Angel Dance (Heal) · R Reload · G Grenade · 1-4 Switch · Esc Menu'}
        </div>
      </div>
    </div>
  );
};
