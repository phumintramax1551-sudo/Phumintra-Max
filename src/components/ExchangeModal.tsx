import React, { useState } from 'react';
import { UserProfile } from '../game/types';
import { I18N, Language } from '../game/i18n';
import { ArrowRightLeft, Sparkles, Coins, Gem, Crown, X, CheckCircle } from 'lucide-react';

interface ExchangeModalProps {
  profile: UserProfile;
  onExchange: (goldCost: number, gemsGained: number) => boolean;
  onClose: () => void;
  lang: Language;
}

export const ExchangeModal: React.FC<ExchangeModalProps> = ({
  profile,
  onExchange,
  onClose,
  lang,
}) => {
  const t = I18N[lang];
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Exchange packages based on 500 Gold -> 90 Gems
  const packages = [
    { gold: 500, gems: 90, label: 'แพ็กเกจมาตรฐาน (Standard)' },
    { gold: 1500, gems: 270, label: 'แพ็กเกจคุ้มค่า (Value Pack)' },
    { gold: 3000, gems: 550, bonus: '+10 Gems', label: 'แพ็กเกจยอดนิยม (Popular Pack)' },
    { gold: 5000, gems: 950, bonus: '+50 Gems', label: 'แพ็กเกจพรีเมียม (Mega Pack)' },
  ];

  const handleConvert = (gold: number, gems: number) => {
    const ok = onExchange(gold, gems);
    if (ok) {
      setSuccessMsg(
        lang === 'th'
          ? `แลกเปลี่ยนสำเร็จ! ได้รับ +${gems} เพชร`
          : lang === 'ms'
          ? `Berjaya menukar! Mendapat +${gems} Permata`
          : `Exchange successful! Received +${gems} Gems`
      );
      setTimeout(() => setSuccessMsg(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border-2 border-cyan-500/50 bg-slate-900/95 p-6 shadow-2xl shadow-cyan-500/20 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <ArrowRightLeft className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-cyan-300">
              {t.exchange}
            </h2>
            <p className="text-xs text-slate-400">{t.exchangeDesc}</p>
          </div>
        </div>

        {/* Dev VIP Indicator if applicable */}
        {profile.isDevVip && (
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-950/60 to-yellow-950/40 border border-amber-500/50 flex items-center gap-2.5 text-xs text-amber-300">
            <Crown className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold block">
                {lang === 'th'
                  ? '👑 บัญชีผู้พัฒนาเกม VIP No.1 (Infinite Currency)'
                  : '👑 No.1 Lead Dev VIP Account'}
              </span>
              <span className="text-[11px] text-amber-200/80">
                {lang === 'th'
                  ? 'เหรียญและเพชรของคุณไม่มีวันลด สามารถแลกและซื้อไอเทมได้ไม่อั้น!'
                  : 'Your Gold and Gems never decrease!'}
              </span>
            </div>
          </div>
        )}

        {/* Current Balance */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/30 flex items-center gap-2.5">
            <Coins className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">{t.gold}</div>
              <div className="text-base font-black text-amber-300 font-mono">
                {profile.gold.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/30 flex items-center gap-2.5">
            <Gem className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">{t.gems}</div>
              <div className="text-base font-black text-cyan-300 font-mono">
                {profile.gems.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            {successMsg}
          </div>
        )}

        {/* Package list */}
        <div className="space-y-2.5">
          {packages.map((pkg, idx) => {
            const canAfford = profile.isDevVip || profile.gold >= pkg.gold;

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-cyan-500/40 transition-all"
              >
                <div>
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    {pkg.label}
                    {pkg.bonus && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        {pkg.bonus}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="text-amber-400 font-bold">{pkg.gold} ทอง</span>
                    <span>➔</span>
                    <span className="text-cyan-400 font-bold">+{pkg.gems} เพชร</span>
                  </div>
                </div>

                <button
                  disabled={!canAfford}
                  onClick={() => handleConvert(pkg.gold, pkg.gems)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer ${
                    canAfford
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {t.exchange}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
