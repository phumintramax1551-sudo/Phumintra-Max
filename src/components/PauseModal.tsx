import React from 'react';
import { Volume2, VolumeX, Sliders, Play, RotateCcw, Home, X } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  sensitivity: number;
  onSensitivityChange: (val: number) => void;
  fov: number;
  onFovChange: (val: number) => void;
  volume: number;
  onVolumeChange: (val: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  lang: 'th' | 'en';
  onToggleLang: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onQuit,
  sensitivity,
  onSensitivityChange,
  fov,
  onFovChange,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  lang,
  onToggleLang,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 select-none p-4 font-sans">
      <div className="relative w-full max-w-md p-6 rounded-xl border border-cyan-500/40 bg-slate-950 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders size={20} className="text-cyan-400" />
            <h2 className="text-lg font-mono font-bold text-white tracking-wider">
              {lang === 'th' ? 'เมนูหยุดชั่วคราว (PAUSED)' : 'TACTICAL PAUSE'}
            </h2>
          </div>
          <button
            onClick={onResume}
            className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Settings Sliders */}
        <div className="flex flex-col gap-5 py-5 border-b border-slate-800">
          {/* Mouse Sensitivity */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">
                {lang === 'th' ? 'ความไวเมาส์ (Sensitivity)' : 'Mouse Sensitivity'}
              </span>
              <span className="text-cyan-400 font-bold">{(sensitivity * 1000).toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.001"
              max="0.005"
              step="0.0002"
              value={sensitivity}
              onChange={(e) => onSensitivityChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 cursor-pointer"
            />
          </div>

          {/* Field of View (FOV) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">{lang === 'th' ? 'มุมมอง (FOV)' : 'Field of View'}</span>
              <span className="text-cyan-400 font-bold">{Math.round(fov)}°</span>
            </div>
            <input
              type="range"
              min="65"
              max="95"
              step="1"
              value={fov}
              onChange={(e) => onFovChange(parseInt(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 cursor-pointer"
            />
          </div>

          {/* Master Volume */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">{lang === 'th' ? 'ระดับเสียง (Volume)' : 'Master Volume'}</span>
              <span className="text-cyan-400 font-bold">{Math.round(volume * 100)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleMute}
                className="p-1.5 rounded border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 cursor-pointer"
              />
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center justify-between text-xs font-mono pt-1">
            <span className="text-slate-300">{lang === 'th' ? 'ภาษา (Language)' : 'Language'}</span>
            <button
              onClick={onToggleLang}
              className="px-3 py-1 rounded border border-cyan-500/30 bg-slate-900 text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {lang === 'th' ? 'TH | ภาษาไทย' : 'EN | English'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-5">
          <button
            onClick={onResume}
            className="flex items-center justify-center gap-2 py-3 rounded-lg font-mono font-bold text-sm bg-gradient-to-r from-cyan-500 to-sky-600 text-white hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            <Play size={16} />
            {lang === 'th' ? 'เล่นต่อ (RESUME)' : 'RESUME MISSION'}
          </button>

          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-mono font-semibold text-xs border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <RotateCcw size={14} />
            {lang === 'th' ? 'เริ่มรอบใหม่ (RESTART MATCH)' : 'RESTART MATCH'}
          </button>

          <button
            onClick={onQuit}
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-mono font-semibold text-xs border border-rose-900/40 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40 transition-all cursor-pointer"
          >
            <Home size={14} />
            {lang === 'th' ? 'กลับสู่หน้าหลัก (QUIT TO TITLE)' : 'QUIT TO TITLE'}
          </button>
        </div>
      </div>
    </div>
  );
};
