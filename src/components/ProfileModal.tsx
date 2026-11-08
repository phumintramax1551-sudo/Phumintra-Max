import React, { useState } from 'react';
import { UserProfile } from '../game/types';
import { Award, Crown, Check, Edit3, X, Mail, ShieldCheck, Sparkles } from 'lucide-react';

interface ProfileModalProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onClose: () => void;
  lang: 'th' | 'en';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onUpdateProfile,
  onClose,
  lang,
}) => {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.nickname);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateProfile({ nickname: nameInput.trim() });
      setEditingName(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 select-none p-4 font-sans">
      <div className="relative w-full max-w-lg p-6 rounded-2xl border-2 border-yellow-400/60 bg-slate-950 shadow-[0_0_60px_rgba(250,204,21,0.3)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Developer Crown Banner */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border border-yellow-400/60 w-fit mb-4">
          <Crown size={16} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-mono font-black text-yellow-300 tracking-wider">
            👑 VIP NO.1 // LEAD GAME DEVELOPER & CREATOR
          </span>
        </div>

        {/* Profile Header */}
        <div className="flex items-center gap-4 pb-5 border-b border-slate-800">
          <div className="relative w-16 h-16 rounded-xl border-2 border-yellow-400 bg-slate-900 flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.5)]">
            <span className="font-mono font-black text-xl text-yellow-300">DEV</span>
            <div className="absolute -bottom-1.5 px-2 py-0.5 rounded bg-yellow-400 text-slate-950 text-[9px] font-mono font-black">
              VIP 1
            </div>
          </div>

          <div className="flex-1">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-cyan-400 text-white font-mono font-bold text-sm focus:outline-none"
                  placeholder="Enter name..."
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1.5 rounded bg-cyan-500 text-black hover:bg-cyan-400 cursor-pointer"
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-mono font-black text-white">{profile.nickname}</h3>
                <button
                  onClick={() => setEditingName(true)}
                  className="p-1 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                  title="เปลี่ยนชื่อ / Change Nickname"
                >
                  <Edit3 size={15} />
                </button>
              </div>
            )}
            <div className="text-xs font-mono text-cyan-400 mt-0.5">
              {lang === 'th' ? 'หัวหน้าผู้พัฒนาเกม (Creator / Lead Developer)' : 'Lead Developer & Game Creator'}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              RANK: {profile.rank} · LEVEL {profile.level}
            </div>
          </div>
        </div>

        {/* Google Account Linking */}
        <div className="py-4 border-b border-slate-800 flex flex-col gap-2">
          <span className="text-xs font-mono text-slate-400 font-bold uppercase">
            {lang === 'th' ? 'การเชื่อมต่อบัญชี GOOGLE (AUTHENTICATION)' : 'GOOGLE ACCOUNT LINK'}
          </span>
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-3">
              {/* Google G Icon */}
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-sm text-slate-900 shadow">
                <span className="text-blue-500">G</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                  {profile.email}
                  <ShieldCheck size={14} className="text-emerald-400" />
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {lang === 'th' ? 'ยืนยันตัวตนสำเร็จ · บัญชีผู้พัฒนาเกม' : 'Verified Google Account · Lead Dev'}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
              CONNECTED
            </span>
          </div>
        </div>

        {/* Currency & Developer Perks */}
        <div className="grid grid-cols-2 gap-3 py-4 border-b border-slate-800">
          <div className="p-3 rounded-xl border border-yellow-500/30 bg-yellow-950/20 flex flex-col items-center">
            <span className="text-xs font-mono text-slate-400">{lang === 'th' ? 'เหรียญทอง (GOLD)' : 'CYBER GOLD'}</span>
            <span className="text-xl font-mono font-black text-yellow-400 tabular-nums">
              🪙 {profile.gold.toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-950/20 flex flex-col items-center">
            <span className="text-xs font-mono text-slate-400">{lang === 'th' ? 'เพชร (GEMS)' : 'CYBER GEMS'}</span>
            <span className="text-xl font-mono font-black text-cyan-400 tabular-nums">
              💎 {profile.gems.toLocaleString()}
            </span>
          </div>
        </div>

        {/* VIP Perks */}
        <div className="pt-4 flex flex-col gap-2">
          <span className="text-xs font-mono font-bold text-yellow-300 flex items-center gap-1.5">
            <Sparkles size={14} /> {lang === 'th' ? 'สิทธิพิเศษ VIP อันดับ 1' : 'NO.1 DEVELOPER VIP PERKS'}
          </span>
          <ul className="text-xs font-mono text-slate-300 space-y-1 list-disc list-inside">
            <li>{lang === 'th' ? 'เหรียญทองและเพชรไม่จำกัดสำหรับทดสอบ' : 'Unlimited developer Gold & Gems'}</li>
            <li>{lang === 'th' ? 'ปลดล็อกสกินปืนระดับ Legendary ทุกกระบอก' : 'All Legendary weapon skins available'}</li>
            <li>{lang === 'th' ? 'ตรามงกุฎเกียรติยศผู้พัฒนาเกมอันดับหนึ่ง' : 'Exclusive Lead Creator Crown Badge'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
