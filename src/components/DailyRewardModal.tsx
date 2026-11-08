import React from 'react';
import { I18N, Language } from '../game/i18n';
import { DAILY_CHECKIN_REWARDS } from '../game/cosmetics';
import { Calendar, Check, Gift, X } from 'lucide-react';

interface DailyRewardModalProps {
  currentDay: number;
  lastClaimDate: string;
  onClaimDay: (day: number, gold: number, gems: number) => void;
  onClose: () => void;
  lang: Language;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  currentDay,
  lastClaimDate,
  onClaimDay,
  onClose,
  lang,
}) => {
  const t = I18N[lang];
  const todayStr = new Date().toISOString().split('T')[0];
  const canClaimToday = lastClaimDate !== todayStr;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border-2 border-amber-500/50 bg-slate-900/95 p-6 shadow-2xl shadow-amber-500/20 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Gift className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-amber-300">
              {t.dailyReward}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'th'
                ? 'เข้าเล่นทุกวันเพื่อรับเหรียญทองและเพชรฟรีครบ 7 วัน!'
                : lang === 'ms'
                ? 'Daftar masuk setiap hari untuk emas & permata percuma!'
                : 'Log in daily to claim free Gold and Gems for 7 days!'}
            </p>
          </div>
        </div>

        {/* 7-Day Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 mb-6">
          {DAILY_CHECKIN_REWARDS.map((reward) => {
            const isClaimed = reward.day <= currentDay && (!canClaimToday || reward.day < currentDay);
            const isCurrent = reward.day === currentDay && canClaimToday;
            const isLocked = reward.day > currentDay || (reward.day === currentDay && !canClaimToday);

            return (
              <div
                key={reward.day}
                className={`flex flex-col items-center justify-between p-3 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/30 scale-105'
                    : isClaimed
                    ? 'border-emerald-500/40 bg-emerald-950/30 opacity-75'
                    : 'border-slate-800 bg-slate-950/60 opacity-60'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  D{reward.day}
                </span>

                <span className="text-2xl my-1">{reward.icon}</span>

                <div className="text-[11px] font-black text-amber-300">
                  +{reward.gold.toLocaleString()}
                </div>
                {reward.gems > 0 && (
                  <div className="text-[10px] font-bold text-cyan-300">
                    +{reward.gems} 💎
                  </div>
                )}

                {isClaimed ? (
                  <span className="mt-2 text-[9px] font-bold text-emerald-400 flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> {t.claimed}
                  </span>
                ) : isCurrent ? (
                  <button
                    onClick={() => onClaimDay(reward.day, reward.gold, reward.gems)}
                    className="mt-2 px-2 py-0.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black transition-all cursor-pointer shadow-md"
                  >
                    {t.claim}
                  </button>
                ) : (
                  <span className="mt-2 text-[9px] font-bold text-slate-500">
                    🔒
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Claim status footer */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-cyan-400" />
            {canClaimToday
              ? lang === 'th'
                ? 'คุณมีของขวัญวันนี้รอรับอยู่!'
                : 'You have a reward ready today!'
              : lang === 'th'
              ? 'คุณรับของขวัญวันนี้ไปแล้ว กลับมาใหม่พรุ่งนี้!'
              : 'Claimed today! Come back tomorrow!'}
          </span>
          <span className="font-mono text-cyan-300 font-bold">
            Day {currentDay}/7
          </span>
        </div>
      </div>
    </div>
  );
};
