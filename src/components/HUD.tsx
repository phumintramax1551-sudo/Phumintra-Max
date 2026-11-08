import React from 'react';
import { PlayerStats, MatchScore, KillEvent, GameMode, EmoteType } from '../game/types';
import { WEAPON_REGISTRY } from '../game/weapons';
import { Language } from '../game/i18n';
import { Shield, Heart, Sparkles, Crosshair, Bomb, Radio, Skull } from 'lucide-react';
import { SniperScope } from './SniperScope';

interface HUDProps {
  stats: PlayerStats;
  score: MatchScore;
  killEvents: KillEvent[];
  mode: GameMode;
  isPointerLocked: boolean;
  onRequestPointerLock: () => void;
  onTriggerDance: (emote?: EmoteType) => void;
  onReload: () => void;
  onThrowGrenade: () => void;
  onSwitchWeapon: (idx: number) => void;
  hitmarker: { visible: boolean; isHeadshot: boolean; damage: number } | null;
  announcement: string | null;
  lang: Language;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  score,
  killEvents,
  mode,
  isPointerLocked,
  onRequestPointerLock,
  onTriggerDance,
  onReload,
  onThrowGrenade,
  onSwitchWeapon,
  hitmarker,
  announcement,
  lang,
}) => {
  const activeWeapon = WEAPON_REGISTRY[stats.activeWeaponIndex];
  const isAWPSniperADS = stats.isADS && activeWeapon.id === 'awp_valkyrie';

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden font-sans">
      {/* 1. Sniper Scope (when ADS with sniper) */}
      {isAWPSniperADS && <SniperScope />}

      {/* 2. Angel Dance Aura Screen Effect */}
      {stats.isDancing && (
        <div className="absolute inset-0 bg-cyan-500/10 shadow-[0_0_80px_rgba(6,182,212,0.5)_inset] pointer-events-none flex flex-col items-center justify-center">
          <div className="p-4 rounded-lg border border-cyan-400 bg-slate-950/80 text-center mb-16">
            <div className="flex items-center justify-center gap-2 text-cyan-300 font-mono font-bold tracking-widest text-sm mb-1">
              <Sparkles size={18} className="text-cyan-400" />
              {lang === 'th' ? 'กำลังเต้นรำเทวทูต (ANGEL DANCE)' : 'ANGEL DANCE ACTIVE'}
            </div>
            <div className="text-xs text-slate-300">
              {lang === 'th'
                ? 'ฟื้นฟู HP/เกราะ อย่างรวดเร็ว · เคลื่อนที่หรือคลิกเพื่อยกเลิก'
                : 'Rapid Health & Armor Regen · Move or click to cancel'}
            </div>
          </div>
        </div>
      )}

      {/* 3. Pointer Lock Prompt Banner (when not locked) */}
      {!isPointerLocked && !stats.isDancing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-auto">
          <button
            onClick={onRequestPointerLock}
            className="flex items-center gap-3 px-10 py-5 rounded-xl border-2 border-yellow-400 bg-slate-950/95 text-yellow-300 font-mono font-black text-xl tracking-widest hover:bg-yellow-950/80 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_40px_rgba(250,204,21,0.6)]"
          >
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black">
              ▶
            </div>
            <span>{lang === 'th' ? 'คลิกที่นี่เพื่อเริ่มเล่น / ควบคุมเมาส์' : 'CLICK TO CONTROL & PLAY'}</span>
          </button>
        </div>
      )}

      {/* 4. Center Crosshair & Hitmarker (hidden during sniper ADS or dancing) */}
      {!isAWPSniperADS && !stats.isDancing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Dynamic Crosshair Lines */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Top tick */}
            <div className="absolute top-0 w-[2px] h-2.5 bg-cyan-400 shadow-[0_0_4px_#00f0ff]"></div>
            {/* Bottom tick */}
            <div className="absolute bottom-0 w-[2px] h-2.5 bg-cyan-400 shadow-[0_0_4px_#00f0ff]"></div>
            {/* Left tick */}
            <div className="absolute left-0 h-[2px] w-2.5 bg-cyan-400 shadow-[0_0_4px_#00f0ff]"></div>
            {/* Right tick */}
            <div className="absolute right-0 h-[2px] w-2.5 bg-cyan-400 shadow-[0_0_4px_#00f0ff]"></div>
            {/* Center dot */}
            <div className="w-1 h-1 rounded-full bg-cyan-300"></div>

            {/* Hitmarker X ticks */}
            {hitmarker?.visible && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`w-6 h-6 border-2 rotate-45 ${
                    hitmarker.isHeadshot
                      ? 'border-yellow-400 shadow-[0_0_12px_#facc15]'
                      : 'border-red-500 shadow-[0_0_8px_#ef4444]'
                  }`}
                ></div>
                {hitmarker.isHeadshot && (
                  <div className="absolute -top-6 text-[10px] font-mono font-black text-yellow-300 tracking-wider flex items-center gap-1">
                    <Skull size={12} /> HEADSHOT
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Center-Top Multi-Kill Announcement Popup */}
      {announcement && (
        <div className="absolute top-24 inset-x-0 flex justify-center pointer-events-none animate-bounce">
          <div className="px-6 py-2.5 rounded border-2 border-yellow-400 bg-slate-950/90 text-yellow-300 font-mono font-black text-xl tracking-widest uppercase shadow-[0_0_30px_rgba(250,204,21,0.6)]">
            {announcement}
          </div>
        </div>
      )}

      {/* 6. PERIMETER HUD - TOP ROW */}
      <div className="p-4 sm:p-6 flex items-start justify-between w-full">
        {/* Top-Left: Mini Tactical Radar */}
        <div className="flex flex-col gap-1">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-cyan-500/40 bg-slate-950/75 relative flex items-center justify-center overflow-hidden">
            {/* Radar sweep line */}
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(6,182,212,0.4)_360deg)] animate-spin"></div>
            {/* Radar grid rings */}
            <div className="absolute w-20 h-20 rounded-full border border-cyan-500/30"></div>
            <div className="absolute w-10 h-10 rounded-full border border-cyan-500/30"></div>
            {/* Cross axis */}
            <div className="absolute w-full h-[1px] bg-cyan-500/20"></div>
            <div className="absolute h-full w-[1px] bg-cyan-500/20"></div>
            {/* Center Player blip (Blue) */}
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 z-10 shadow-[0_0_6px_#00f0ff]"></div>
            {/* Enemy blips (Red) */}
            <div className="absolute top-6 right-8 w-2 h-2 rounded-full bg-red-500"></div>
            <div className="absolute bottom-7 left-7 w-2 h-2 rounded-full bg-red-500"></div>
            <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-red-500"></div>
          </div>
          <span className="text-[10px] font-mono text-cyan-400/80 tracking-wider">
            RADAR · SECTOR 9
          </span>
        </div>

        {/* Top-Center: Score & Match Status Bar */}
        <div className="flex flex-col items-center">
          {mode === 'tdm' ? (
            <div className="flex items-center gap-4 px-6 py-2 rounded-lg border border-slate-800 bg-slate-950/85 shadow-lg">
              {/* Blue Team Score */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">BLUE</span>
                <span className="text-2xl font-mono font-black text-cyan-300 tabular-nums">
                  {score.blueKills}
                </span>
              </div>

              {/* Timer & Target */}
              <div className="flex flex-col items-center px-4 border-x border-slate-800">
                <span className="text-xs font-mono text-slate-400 font-bold">
                  GOAL: {score.targetKills}
                </span>
                <span className="text-sm font-mono font-bold text-white tabular-nums">
                  {formatTime(score.timeRemaining)}
                </span>
              </div>

              {/* Red Team Score */}
              <div className="flex items-center gap-2">
                <span className="text-2xl font-mono font-black text-rose-400 tabular-nums">
                  {score.redKills}
                </span>
                <span className="text-xs font-mono font-bold text-rose-400">RED</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 px-6 py-2 rounded-lg border border-emerald-500/40 bg-slate-950/85">
              <div className="flex items-center gap-2 text-emerald-400">
                <Radio size={16} />
                <span className="text-xs font-mono font-bold">
                  {score.mutantCount > 0
                    ? `${lang === 'th' ? 'มนุษย์' : 'HUMANS'}: ${score.humanCount} | ${lang === 'th' ? 'มัมมี่' : 'MUTANTS'}: ${score.mutantCount}`
                    : `${lang === 'th' ? 'ระวังการกลายพันธุ์ใน' : 'MUTANT ALERT IN'}: ${score.timeRemaining}s`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Top-Right: Dynamic Killfeed */}
        <div className="flex flex-col items-end gap-1.5 max-w-xs">
          {killEvents.slice(-4).map((evt) => (
            <div
              key={evt.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950/80 border border-slate-800 text-[11px] font-mono"
            >
              <span className={evt.killerTeam === 'blue' ? 'text-cyan-400 font-bold' : 'text-rose-400 font-bold'}>
                {evt.killerName}
              </span>
              <span className="px-1 py-0.5 rounded bg-slate-800 text-[9px] text-slate-300">
                {evt.weaponName}
              </span>
              {evt.isHeadshot && <Skull size={12} className="text-yellow-400" />}
              <span className={evt.victimTeam === 'blue' ? 'text-cyan-400' : 'text-rose-400'}>
                {evt.victimName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. PERIMETER HUD - BOTTOM ROW */}
      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 flex items-end justify-between pointer-events-none">
        {/* Bottom-Left: Vital Health & Armor Cluster + Angel Dance */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* Angel Dance Button */}
          <button
            onClick={() => onTriggerDance('angel_dance')}
            className={`flex items-center gap-2 px-4 py-2 rounded border font-mono text-xs font-bold transition-all cursor-pointer ${
              stats.isDancing
                ? 'border-yellow-400 bg-yellow-950/80 text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                : 'border-cyan-500/40 bg-slate-900/80 hover:bg-cyan-950/80 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
            }`}
          >
            <Sparkles size={16} />
            <span>[C] {stats.isDancing ? (lang === 'th' ? 'ยกเลิกการเต้น' : 'STOP DANCE') : (lang === 'th' ? 'ANGEL DANCE (ฟื้นฟูเลือด)' : 'ANGEL DANCE (HEAL)')}</span>
          </button>

          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/85 flex flex-col gap-2 min-w-[200px]">
            {/* Health Bar */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Heart size={14} /> HP
                </span>
                <span className="text-white tabular-nums">{Math.round(stats.hp)} / 100</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-200 ${
                    stats.hp > 50 ? 'bg-emerald-500' : stats.hp > 25 ? 'bg-yellow-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, stats.hp))}%` }}
                ></div>
              </div>
            </div>

            {/* Armor Bar */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Shield size={14} /> ARMOR
                </span>
                <span className="text-white tabular-nums">{Math.round(stats.armor)} / 100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-200"
                  style={{ width: `${Math.max(0, Math.min(100, stats.armor))}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom-Center: Emotes & Weapon Quick Slots */}
        <div className="flex flex-col items-center gap-1.5 pointer-events-auto">
          {/* Interactive Emote Bar */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950/80 border border-cyan-500/40 shadow-md">
            <button
              onClick={() => onTriggerDance('angel_dance')}
              title="Angel Dance (เต้นฟื้นฟูเลือด)"
              className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/40 text-[11px] font-bold text-cyan-300 flex items-center gap-1 cursor-pointer transition-all"
            >
              🕺 [V] {lang === 'th' ? 'เต้นแองเจิ้ล' : 'Angel Dance'}
            </button>
            <button
              onClick={() => onTriggerDance('breakdance')}
              title="Cyber Breakdance"
              className="px-2 py-1 rounded bg-purple-500/20 hover:bg-purple-500/40 text-[11px] font-bold text-purple-300 flex items-center gap-1 cursor-pointer transition-all"
            >
              💃 [B] {lang === 'th' ? 'เบรกแดนซ์' : 'Breakdance'}
            </button>
            <button
              onClick={() => onTriggerDance('victory_dab')}
              title="Victory Dab"
              className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/40 text-[11px] font-bold text-amber-300 flex items-center gap-1 cursor-pointer transition-all"
            >
              ✌️ Dab
            </button>
            <button
              onClick={() => onTriggerDance('heart_dance')}
              title="Love Heart Dance"
              className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/40 text-[11px] font-bold text-rose-300 flex items-center gap-1 cursor-pointer transition-all"
            >
              💖 Love
            </button>
          </div>

          {/* Weapon Quick Slots */}
          <div className="hidden sm:flex items-center gap-2">
            {WEAPON_REGISTRY.map((w, idx) => (
              <button
                key={w.id}
                onClick={() => onSwitchWeapon(idx)}
                className={`px-3 py-1.5 rounded border text-xs font-mono transition-all cursor-pointer ${
                  stats.activeWeaponIndex === idx
                    ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-[10px] text-cyan-500 mr-1">[{idx + 1}]</span>
                {w.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom-Right: Active Weapon & Ammo Cluster */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Grenade Button */}
          <button
            onClick={onThrowGrenade}
            className="flex items-center gap-2 px-3 py-1.5 rounded border border-amber-500/40 bg-slate-900/80 hover:bg-amber-950/80 text-amber-300 font-mono text-xs font-bold transition-all cursor-pointer"
          >
            <Bomb size={14} />
            <span>[G] {lang === 'th' ? 'ระเบิดพัลส์' : 'GRENADE'} x{stats.grenadeCount}</span>
          </button>

          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/85 flex flex-col items-end min-w-[210px]">
            {/* Weapon Name */}
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
              {lang === 'th' ? activeWeapon.nameTh : activeWeapon.name}
            </span>

            {/* Ammo Readout (tabular-nums) */}
            {activeWeapon.category !== 'melee' ? (
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-mono font-black text-white tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                  {stats.currentAmmo[stats.activeWeaponIndex]}
                </span>
                <span className="text-lg font-mono text-slate-400 tabular-nums">
                  / {stats.reserveAmmo[stats.activeWeaponIndex]}
                </span>
              </div>
            ) : (
              <div className="text-2xl font-mono font-bold text-amber-400 mt-1">
                MELEE BLADE
              </div>
            )}

            {/* Reloading Status or Button */}
            {activeWeapon.category !== 'melee' && (
              <button
                onClick={onReload}
                className="mt-1 text-[11px] font-mono text-cyan-400/80 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                {stats.isReloading ? (
                  <span className="text-amber-400 animate-pulse">
                    {lang === 'th' ? 'กำลังบรรจุกระสุน...' : 'RELOADING...'}
                  </span>
                ) : (
                  <span>[R] {lang === 'th' ? 'กด R บรรจุกระสุน' : 'PRESS R TO RELOAD'}</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
