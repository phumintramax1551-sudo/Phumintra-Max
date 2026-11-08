import React, { useState } from 'react';
import { UserProfile } from '../game/types';
import { I18N, Language } from '../game/i18n';
import { User, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface LoginChoiceModalProps {
  isOpen: boolean;
  onSelectGuest: () => void;
  onSelectGoogle: (email: string) => void;
  lang: Language;
}

export const LoginChoiceModal: React.FC<LoginChoiceModalProps> = ({
  isOpen,
  onSelectGuest,
  onSelectGoogle,
  lang,
}) => {
  if (!isOpen) return null;
  const t = I18N[lang];
  const [customEmail, setCustomEmail] = useState('suniphan1992@gmail.com');
  const [showEmailInput, setShowEmailInput] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border-2 border-cyan-500/40 bg-slate-900/95 p-6 shadow-2xl shadow-cyan-500/20 text-white">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 mb-3 shadow-lg shadow-cyan-500/30">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300">
            {t.gameTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-1">{t.selectAccount}</p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {/* 1. Google Login (Recommended / Cloud Sync) */}
          <div className="p-4 rounded-xl border border-cyan-500/50 bg-gradient-to-r from-cyan-950/40 to-slate-900 hover:border-cyan-400 transition-all shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 font-bold text-cyan-300 text-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.09C3.31 21.43 7.38 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.01-3.09z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.38 0 3.31 2.57 1.27 6.59l4.01 3.09c.95-2.83 3.6-4.93 6.72-4.93z"
                  />
                </svg>
                {t.loginGoogle}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                RECOMMENDED
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              {lang === 'th'
                ? 'ซิงค์ข้อมูลบนคลาวด์ ปลอดภัย ไม่สูญหาย พร้อมรับสิทธิ์ VIP ผู้พัฒนาเกม'
                : lang === 'ms'
                ? 'Simpanan awan selamat dengan ganjaran VIP Pembangun Utama'
                : 'Save to Cloud, zero data loss, plus VIP Lead Developer access'}
            </p>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="email@gmail.com"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-cyan-200 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <button
              onClick={() => onSelectGoogle(customEmail || 'suniphan1992@gmail.com')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              {t.loginGoogle} ({customEmail.split('@')[0]})
            </button>
          </div>

          {/* 2. Guest Login */}
          <div className="p-4 rounded-xl border border-slate-700 bg-slate-950/60 hover:border-slate-500 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-2 font-bold text-slate-200 text-sm">
                <User className="w-4 h-4 text-slate-400" />
                {t.loginGuest}
              </span>
            </div>

            {/* Warning Message as requested */}
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-950/40 border border-amber-600/40 text-amber-300 text-[11px] my-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{t.guestWarning}</span>
            </div>

            <button
              onClick={onSelectGuest}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
            >
              {t.loginGuest}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-5 text-[10px] text-slate-500">
          Google Play Edition • Cyber Angel Tactical FPS • Build 2.0.4
        </div>
      </div>
    </div>
  );
};
