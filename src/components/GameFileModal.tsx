import React, { useState } from 'react';
import { UserProfile } from '../game/types';
import { Download, FileCode, Check, X, Shield, Sparkles } from 'lucide-react';

interface GameFileModalProps {
  profile: UserProfile;
  onClose: () => void;
  lang: 'th' | 'en';
}

export const GameFileModal: React.FC<GameFileModalProps> = ({ profile, onClose, lang }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadGameFile = () => {
    const gameData = {
      title: 'Cyber Angel: Tactical FPS',
      version: '2.8.0',
      developer: {
        name: profile.nickname,
        email: profile.email,
        title: 'Lead Developer & Game Creator (VIP No.1)',
        verifiedGoogle: true,
      },
      playerData: {
        nickname: profile.nickname,
        vipLevel: 1,
        gold: profile.gold,
        gems: profile.gems,
        level: profile.level,
        rank: profile.rank,
        unlockedSkinIds: profile.unlockedSkinIds,
        equippedSkins: profile.equippedSkins,
      },
      system: {
        engine: 'Three.js WebGL2 PBR',
        audio: 'Web Audio Procedural Synthesizer',
        signatureMechanic: 'Angel Dance HP/Armor Regeneration',
        modes: ['Team Deathmatch (4v4)', 'Mutant Outbreak', 'Target Practice Range'],
      },
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(gameData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber-angel-save-${profile.nickname.toLowerCase().replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 select-none p-4 font-sans">
      <div className="relative w-full max-w-lg p-6 rounded-2xl border-2 border-cyan-500/50 bg-slate-950 shadow-[0_0_60px_rgba(6,182,212,0.3)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl border border-cyan-400/40 bg-cyan-950/60 text-cyan-400 shadow">
            <FileCode size={22} />
          </div>
          <div>
            <h2 className="text-lg font-mono font-black text-white tracking-wider flex items-center gap-2">
              {lang === 'th' ? 'ข้อมูลไฟล์เกม & เซฟระบบ' : 'GAME FILE & DATA BACKUP'}
              <Sparkles size={16} className="text-yellow-400" />
            </h2>
            <div className="text-xs font-mono text-cyan-400">
              {lang === 'th' ? 'ไฟล์บันทึกข้อมูลผู้พัฒนาเกมและโปรไฟล์ผู้เล่น' : 'Export game save data & developer configuration'}
            </div>
          </div>
        </div>

        <div className="py-5 flex flex-col gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col gap-2">
            <div className="flex justify-between text-slate-300">
              <span>{lang === 'th' ? 'ชื่อเกม:' : 'Game Title:'}</span>
              <span className="text-white font-bold">Cyber Angel: Tactical FPS v2.8</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>{lang === 'th' ? 'ผู้พัฒนา (Lead Dev):' : 'Lead Creator:'}</span>
              <span className="text-yellow-400 font-bold">{profile.nickname} (👑 VIP 1)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>{lang === 'th' ? 'บัญชี Google ยืนยัน:' : 'Google Account:'}</span>
              <span className="text-emerald-400 font-bold">{profile.email}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>{lang === 'th' ? 'ยอดเงินในเซฟ:' : 'Save Balance:'}</span>
              <span className="text-yellow-300 font-bold">🪙 {profile.gold.toLocaleString()} / 💎 {profile.gems.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-slate-400 text-[11px] leading-relaxed">
            {lang === 'th'
              ? 'คุณสามารถดาวน์โหลดไฟล์เกมนี้เพื่อเก็บไว้เป็นไฟล์หลักของเกม โดยข้อมูลสกินปืนทั้งหมด, ยศ VIP อันดับหนึ่ง และสถิติต่างๆ จะถูกสำรองไว้อย่างปลอดภัย'
              : 'Download this JSON file to back up your full game configuration, developer privileges, unlocked skins, and match history.'}
          </p>

          <button
            onClick={handleDownloadGameFile}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white font-mono font-bold text-sm tracking-wider hover:brightness-110 active:scale-98 transition-all cursor-pointer shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2"
          >
            {downloaded ? (
              <>
                <Check size={18} className="text-emerald-300" />
                <span>{lang === 'th' ? 'ดาวน์โหลดไฟล์เกมเรียบร้อยแล้ว!' : 'DOWNLOADED SUCCESSFULLY!'}</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>{lang === 'th' ? 'ดาวน์โหลดไฟล์เกม (.json)' : 'DOWNLOAD GAME FILE (.JSON)'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
