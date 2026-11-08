import React, { useState } from 'react';
import { TACTICAL_QUIZ_QUESTIONS } from '../game/skins';
import { QuizQuestion } from '../game/types';
import { Brain, CheckCircle2, XCircle, Award, Sparkles, X, ChevronRight, RotateCcw } from 'lucide-react';

interface QuizModalProps {
  onRewardEarned: (gold: number, gems: number) => void;
  onClose: () => void;
  lang: 'th' | 'en';
}

export const QuizModal: React.FC<QuizModalProps> = ({ onRewardEarned, onClose, lang }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalGoldWon, setTotalGoldWon] = useState(0);
  const [totalGemsWon, setTotalGemsWon] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const question = TACTICAL_QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === question.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
      setTotalGoldWon((g) => g + question.rewardGold);
      setTotalGemsWon((m) => m + question.rewardGems);
      onRewardEarned(question.rewardGold, question.rewardGems);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < TACTICAL_QUIZ_QUESTIONS.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 select-none p-4 font-sans">
      <div className="relative w-full max-w-xl p-6 rounded-2xl border-2 border-cyan-500/50 bg-slate-950 shadow-[0_0_60px_rgba(6,182,212,0.3)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl border border-cyan-400/40 bg-cyan-950/60 text-cyan-400 shadow">
            <Brain size={22} />
          </div>
          <div>
            <h2 className="text-lg font-mono font-black text-white tracking-wider flex items-center gap-2">
              {lang === 'th' ? 'ควิซแท็กติคอล // รับเหรียญทอง & เพชร' : 'TACTICAL QUIZ // EARN REWARDS'}
              <Sparkles size={16} className="text-yellow-400" />
            </h2>
            <div className="text-xs font-mono text-cyan-400">
              {lang === 'th' ? 'ตอบคำถามยุทธวิธีเพื่อรับเหรียญไปซื้อสกินปืน!' : 'Answer questions to earn gold for weapon skins!'}
            </div>
          </div>
        </div>

        {/* Quiz Body */}
        {!isCompleted ? (
          <div className="py-5 flex flex-col gap-4">
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>
                QUESTION {currentIdx + 1} / {TACTICAL_QUIZ_QUESTIONS.length}
              </span>
              <span className="text-yellow-400 font-bold">
                REWARD: +{question.rewardGold} 🪙 · +{question.rewardGems} 💎
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / TACTICAL_QUIZ_QUESTIONS.length) * 100}%` }}
              ></div>
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-white font-mono font-bold text-sm sm:text-base leading-relaxed">
              {lang === 'th' ? question.questionTh : question.questionEn}
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2.5 font-mono">
              {(lang === 'th' ? question.optionsTh : question.optionsEn).map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === question.correctIndex;
                let btnStyle = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-600';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-950/80 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] font-bold';
                  } else if (isSelected) {
                    btnStyle = 'border-rose-500 bg-rose-950/80 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && (
                      <span>
                        {isCorrect ? (
                          <CheckCircle2 size={18} className="text-emerald-400" />
                        ) : isSelected ? (
                          <XCircle size={18} className="text-rose-400" />
                        ) : null}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next button */}
            {isAnswered && (
              <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 flex flex-col gap-2 mt-1">
                <span className="text-xs font-mono text-cyan-300">
                  {lang === 'th' ? question.explanationTh : 'Correct answer verified! Rewards credited to profile.'}
                </span>
                <button
                  onClick={handleNext}
                  className="self-end px-5 py-2 rounded-lg bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <span>{currentIdx + 1 < TACTICAL_QUIZ_QUESTIONS.length ? (lang === 'th' ? 'ข้อถัดไป' : 'NEXT') : (lang === 'th' ? 'ดูสรุปผล' : 'SEE RESULTS')}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Completion Result */
          <div className="py-8 flex flex-col items-center text-center gap-4 font-mono">
            <div className="w-16 h-16 rounded-full border-2 border-yellow-400 bg-yellow-950/60 flex items-center justify-center text-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.5)]">
              <Award size={36} />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">
                {lang === 'th' ? 'ทำควิซเสร็จสิ้นแล้ว!' : 'QUIZ COMPLETED!'}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {lang === 'th' ? `คุณตอบถูก ${score} จาก ${TACTICAL_QUIZ_QUESTIONS.length} ข้อ` : `Score: ${score} / ${TACTICAL_QUIZ_QUESTIONS.length}`}
              </p>
            </div>

            <div className="flex items-center gap-6 p-4 rounded-xl border border-yellow-500/30 bg-yellow-950/20">
              <div className="text-center">
                <div className="text-xs text-slate-400">{lang === 'th' ? 'ทองที่ได้รับ' : 'GOLD WON'}</div>
                <div className="text-xl font-black text-yellow-400">+{totalGoldWon.toLocaleString()} 🪙</div>
              </div>
              <div className="w-[1px] h-8 bg-slate-800"></div>
              <div className="text-center">
                <div className="text-xs text-slate-400">{lang === 'th' ? 'เพชรที่ได้รับ' : 'GEMS WON'}</div>
                <div className="text-xl font-black text-cyan-400">+{totalGemsWon.toLocaleString()} 💎</div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition-colors flex items-center gap-2 cursor-pointer text-xs"
              >
                <RotateCcw size={14} />
                <span>{lang === 'th' ? 'เล่นควิซอีกครั้ง' : 'PLAY AGAIN'}</span>
              </button>
              <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-bold text-xs hover:brightness-110 transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                {lang === 'th' ? 'ไปซื้อสกินปืน' : 'GO TO SHOP'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
