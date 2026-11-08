import React, { useState } from 'react';
import { UserProfile, MapType, GameMode } from '../game/types';
import { I18N, Language } from '../game/i18n';
import { Users, UserPlus, Shield, Play, MessageSquare, Check, X, Crown, Copy, Send } from 'lucide-react';

interface MultiplayerModalProps {
  profile: UserProfile;
  selectedMap: MapType;
  selectedMode: GameMode;
  onStartMultiplayerMatch: (roomCode: string, partyType: 'solo' | 'duo' | 'squad') => void;
  onClose: () => void;
  lang: Language;
}

interface MemberSlot {
  id: string;
  nickname: string;
  characterId: string;
  isReady: boolean;
  isHost: boolean;
  avatar: string;
}

export const MultiplayerModal: React.FC<MultiplayerModalProps> = ({
  profile,
  selectedMap,
  selectedMode,
  onStartMultiplayerMatch,
  onClose,
  lang,
}) => {
  const t = I18N[lang];
  const [partyType, setPartyType] = useState<'solo' | 'duo' | 'squad'>('squad');
  const [activeRoomCode, setActiveRoomCode] = useState<string | null>(null);
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'SYSTEM', text: 'ยินดีต้อนรับสู่ห้องรวมพลทีม (Team Room Ready)!' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [copied, setCopied] = useState(false);

  // Initial host member
  const maxSlots = partyType === 'solo' ? 1 : partyType === 'duo' ? 2 : 4;
  const [members, setMembers] = useState<MemberSlot[]>([
    {
      id: 'host',
      nickname: profile.nickname,
      characterId: profile.selectedCharacter || 'eva',
      isReady: true,
      isHost: true,
      avatar: profile.isDevVip ? '👑' : '🎖️',
    },
  ]);

  const handleCreateRoom = () => {
    const code = `ANGEL-${Math.floor(1000 + Math.random() * 9000)}`;
    setActiveRoomCode(code);
    setMembers([
      {
        id: 'host',
        nickname: profile.nickname,
        characterId: profile.selectedCharacter || 'eva',
        isReady: true,
        isHost: true,
        avatar: profile.isDevVip ? '👑' : '🎖️',
      },
    ]);
  };

  const handleJoinRoom = () => {
    if (!inputRoomCode.trim()) return;
    const cleanCode = inputRoomCode.trim().toUpperCase();
    setActiveRoomCode(cleanCode);
    setMembers((prev) => [
      ...prev,
      {
        id: `guest_${Date.now()}`,
        nickname: profile.nickname,
        characterId: profile.selectedCharacter || 'eva',
        isReady: true,
        isHost: false,
        avatar: profile.isDevVip ? '👑' : '🎖️',
      },
    ]);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { sender: profile.nickname, text: chatInput.trim() }]);
    setChatInput('');
  };

  const handleCopyCode = () => {
    if (!activeRoomCode) return;
    navigator.clipboard?.writeText(activeRoomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border-2 border-cyan-500/50 bg-slate-900/95 shadow-2xl shadow-cyan-500/20 text-white flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wider uppercase text-cyan-300">
                {lang === 'th' ? 'เล่นกับเพื่อน (Multiplayer / Party)' : 'Party & Multiplayer'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'th'
                  ? 'สร้างห้องหรือเข้าร่วมห้องกับเพื่อน รองรับ 4 คน (Squad), 2 คน (Duo), หรือคนเดียว (Solo)'
                  : 'Play with friends: Squad (4), Duo (2), or Solo (1)'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto">
          {!activeRoomCode ? (
            /* Room Setup Screen */
            <div className="space-y-6">
              {/* Party Type Select */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  {lang === 'th' ? 'เลือกขนาดทีม (Team Size)' : 'Select Team Size'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'solo', label: 'โซโล่ (Solo 1v1)', sub: 'ลุยเดี่ยวไร้ปรานี', icon: '👤' },
                    { id: 'duo', label: 'ดูโอ้ (Duo 2 Players)', sub: 'จับคู่กับคู่หู 2 คน', icon: '👥' },
                    { id: 'squad', label: 'สควอด (Squad 4 Players)', sub: 'ทีมรบ 4 คนครบทีม', icon: '🛡️' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPartyType(p.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        partyType === p.id
                          ? 'border-cyan-400 bg-cyan-500/20 shadow-md shadow-cyan-500/20 scale-102'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{p.icon}</span>
                      <div className="text-xs font-black text-white">{p.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{p.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Create or Join */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Create Room */}
                <div className="p-4 rounded-xl border border-cyan-500/40 bg-slate-950/70 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-cyan-300 uppercase mb-1">
                      {lang === 'th' ? 'สร้างห้องใหม่ (Create Room)' : 'Create New Room'}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      {lang === 'th'
                        ? 'รับรหัสห้องอัตโนมัติเพื่อส่งให้เพื่อนเข้ามาเล่นด้วยกัน'
                        : 'Get a room code to invite your friends'}
                    </p>
                  </div>

                  <button
                    onClick={handleCreateRoom}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-black text-xs tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    สร้างห้องทันที (CREATE ROOM)
                  </button>
                </div>

                {/* Join Room */}
                <div className="p-4 rounded-xl border border-slate-700 bg-slate-950/70 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-200 uppercase mb-1">
                      {lang === 'th' ? 'เข้าร่วมห้องเพื่อน (Join Room)' : 'Join Room'}
                    </h3>
                    <p className="text-xs text-slate-400 mb-2">
                      {lang === 'th' ? 'กรอกรหัสห้อง 9 หลักที่เพื่อนส่งให้' : 'Enter 9-digit room code'}
                    </p>

                    <input
                      type="text"
                      value={inputRoomCode}
                      onChange={(e) => setInputRoomCode(e.target.value)}
                      placeholder="ANGEL-XXXX"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400 uppercase mb-3"
                    />
                  </div>

                  <button
                    onClick={handleJoinRoom}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs tracking-wider transition-all cursor-pointer"
                  >
                    เข้าร่วมห้อง (JOIN)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Active Room Lobby View */
            <div className="space-y-4">
              {/* Room Code Bar */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-cyan-500/40">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">รหัสห้อง (Room Code):</span>
                  <span className="font-mono text-base font-black text-cyan-300 tracking-wider">
                    {activeRoomCode}
                  </span>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'คัดลอกแล้ว!' : 'คัดลอกรหัส'}
                </button>
              </div>

              {/* Player Slots */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: maxSlots }).map((_, idx) => {
                  const m = members[idx];

                  return (
                    <div
                      key={idx}
                      className={`h-36 rounded-xl border p-3 flex flex-col justify-between items-center text-center transition-all ${
                        m
                          ? 'border-cyan-500/50 bg-slate-950/80 shadow-md shadow-cyan-500/10'
                          : 'border-dashed border-slate-800 bg-slate-950/30 text-slate-600'
                      }`}
                    >
                      {m ? (
                        <>
                          <div className="w-full flex justify-between items-center text-[10px]">
                            {m.isHost && (
                              <span className="text-amber-400 flex items-center gap-0.5 font-bold">
                                <Crown className="w-3 h-3" /> HOST
                              </span>
                            )}
                            <span className="text-emerald-400 font-bold ml-auto flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> READY
                            </span>
                          </div>

                          <span className="text-3xl my-1">{m.avatar}</span>

                          <div>
                            <div className="text-xs font-bold text-white line-clamp-1">
                              {m.nickname}
                            </div>
                            <div className="text-[10px] text-cyan-400 uppercase font-mono">
                              {m.characterId}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center">
                          <UserPlus className="w-6 h-6 mb-1 text-slate-600 animate-pulse" />
                          <span className="text-[11px] font-bold">รอเพื่อน...</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* In-Room Quick Chat */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 flex flex-col h-32">
                <div className="flex-1 overflow-y-auto space-y-1 text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className="flex gap-1.5">
                      <span className="font-bold text-cyan-400 shrink-0">[{msg.sender}]:</span>
                      <span className="text-slate-300">{msg.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-2 pt-2 border-t border-slate-800/80">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    placeholder="พิมพ์ข้อความในทีม..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={handleSendChat}
                    className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Ready / Start Match Trigger */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setActiveRoomCode(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  ออกจากห้อง (LEAVE)
                </button>

                <button
                  onClick={() => onStartMultiplayerMatch(activeRoomCode, partyType)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  เริ่มเกมทั้งทีม (START MATCH)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
