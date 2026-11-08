import React, { useState, useEffect } from 'react';
import {
  GameMode,
  CharacterGender,
  BotGenderSetting,
  UserProfile,
  MapType,
  CharacterId,
} from '../game/types';
import { I18N, Language } from '../game/i18n';
import {
  Shield,
  Zap,
  Volume2,
  VolumeX,
  Sparkles,
  Users,
  Play,
  ShoppingBag,
  Brain,
  FileCode,
  Crown,
  Gift,
  ArrowRightLeft,
  Dices,
  Shirt,
  Compass,
  MapPin,
} from 'lucide-react';
import { soundEngine } from '../game/audio';

interface LobbyScreenProps {
  onStartGame: (mode: GameMode, botGender: BotGenderSetting, mapType: MapType) => void;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  selectedMap: MapType;
  onSelectMap: (map: MapType) => void;
  selectedCharacter: CharacterId;
  onSelectCharacter: (charId: CharacterId) => void;
  botGenderSetting: BotGenderSetting;
  onSelectBotGender: (setting: BotGenderSetting) => void;
  profile: UserProfile;
  onOpenProfile: () => void;
  onOpenQuiz: () => void;
  onOpenStoreWardrobe: (tab?: 'store' | 'royale' | 'wardrobe') => void;
  onOpenDailyReward: () => void;
  onOpenExchange: () => void;
  onOpenMultiplayer: () => void;
  onOpenFileModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  lang: Language;
  onSelectLang: (lang: Language) => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  onStartGame,
  selectedMode,
  onSelectMode,
  selectedMap,
  onSelectMap,
  selectedCharacter,
  onSelectCharacter,
  botGenderSetting,
  onSelectBotGender,
  profile,
  onOpenProfile,
  onOpenQuiz,
  onOpenStoreWardrobe,
  onOpenDailyReward,
  onOpenExchange,
  onOpenMultiplayer,
  onOpenFileModal,
  isMuted,
  onToggleMute,
  lang,
  onSelectLang,
}) => {
  const t = I18N[lang];
  const [isLobbyDancing, setIsLobbyDancing] = useState(false);

  // Keyboard shortcut: Space or Enter to Play
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        onStartGame(selectedMode, botGenderSetting, selectedMap);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame, selectedMode, botGenderSetting, selectedMap]);

  const handleToggleLobbyDance = () => {
    if (isLobbyDancing) {
      soundEngine.stopAngelDanceBGM();
      setIsLobbyDancing(false);
    } else {
      soundEngine.startAngelDanceBGM();
      setIsLobbyDancing(true);
      setTimeout(() => {
        soundEngine.stopAngelDanceBGM();
        setIsLobbyDancing(false);
      }, 7000);
    }
  };

  const characters: { id: CharacterId; nameTh: string; nameEn: string; roleTh: string; roleEn: string; icon: string }[] = [
    { id: 'eva', nameTh: 'เอวา (Eva)', nameEn: 'Eva', roleTh: 'สไนเปอร์ / แองเจิ้ล', roleEn: 'Valkyrie Scout', icon: '🪽' },
    { id: 'kevin', nameTh: 'เควิน (Kevin)', nameEn: 'Kevin', roleTh: 'หน่วยรบเกราะหนัก', roleEn: 'Heavy Assault', icon: '🛡️' },
    { id: 'kelly', nameTh: 'เคลลี่ (Kelly)', nameEn: 'Kelly', roleTh: 'นักวิ่งลมกรด', roleEn: 'Speed Runner', icon: '⚡' },
    { id: 'hayato', nameTh: 'ฮายาโตะ (Hayato)', nameEn: 'Hayato', roleTh: 'ซามูไรประชิด', roleEn: 'Ronin Blade', icon: '🗡️' },
  ];

  const maps: { id: MapType; labelTh: string; labelEn: string; icon: string }[] = [
    { id: 'classic', labelTh: 'ไซเบอร์ ซิตี้ (Classic)', labelEn: 'Cyber City', icon: '🏙️' },
    { id: 'desert', labelTh: 'โอเอซิสทะเลทราย (Desert)', labelEn: 'Desert Outpost', icon: '🏜️' },
    { id: 'ice', labelTh: 'ภูเขาน้ำแข็ง (Arctic)', labelEn: 'Frozen Tundra', icon: '❄️' },
  ];

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-5 pointer-events-none select-none font-sans overflow-hidden">
      {/* 1. TOP HEADER: ORDERLY PROFILE, CURRENCY, QUICK ACCESS */}
      <div className="flex items-center justify-between w-full pointer-events-auto gap-2 flex-wrap">
        {/* Left: Player Profile & VIP Crown Badge */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 p-1.5 sm:p-2 pr-3.5 rounded-xl border border-yellow-400/50 bg-slate-950/90 hover:bg-slate-900/90 transition-all cursor-pointer shadow-[0_0_20px_rgba(250,204,21,0.2)] text-left"
          title="คลิกเพื่อแก้ไขชื่อ / ดูโปรไฟล์ Google"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black text-lg shadow-inner">
              {profile.isDevVip ? '👑' : '🎖️'}
            </div>
            {profile.isDevVip && (
              <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded-full bg-yellow-400 text-slate-950 text-[8px] font-black uppercase">
                #1 DEV
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-white drop-shadow">
                {profile.nickname}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 font-mono font-bold">
                {profile.rank}
              </span>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">
              {profile.email}
            </span>
          </div>
        </button>

        {/* Center: Currency counters & Exchange button */}
        <div className="flex items-center gap-2">
          {/* Gold */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-slate-950/85 text-xs font-mono font-bold text-amber-300 shadow-md">
            <span>🪙</span>
            <span>{profile.gold.toLocaleString()}</span>
          </div>

          {/* Gems */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-slate-950/85 text-xs font-mono font-bold text-cyan-300 shadow-md">
            <span>💎</span>
            <span>{profile.gems.toLocaleString()}</span>
          </div>

          {/* Exchange 500 Gold -> 90 Gems */}
          <button
            onClick={onOpenExchange}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-cyan-400 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
            title="แลก 500 เหรียญทอง ➔ 90 เพชร"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">แลกเพชร</span>
          </button>
        </div>

        {/* Right Action Icons: Daily, Royale, Store, Party, Quiz, Save, Audio, Lang */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Daily Reward */}
          <button
            onClick={onOpenDailyReward}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-amber-500/50 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-md"
            title="ของขวัญเช็คอินรายวัน"
          >
            <Gift className="w-3.5 h-3.5 animate-bounce" />
            <span className="hidden md:inline">รายวัน</span>
          </button>

          {/* Angel Royale */}
          <button
            onClick={() => onOpenStoreWardrobe('royale')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-amber-400 bg-gradient-to-r from-amber-500/30 to-yellow-500/30 hover:border-amber-300 text-amber-300 text-xs font-black transition-all cursor-pointer shadow-md"
            title="แองเจิ้ลรอยัล (Angel Royale)"
          >
            <Dices className="w-3.5 h-3.5" />
            <span className="hidden md:inline">รอยัล</span>
          </button>

          {/* Store / Wardrobe */}
          <button
            onClick={() => onOpenStoreWardrobe('store')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-cyan-500/40 bg-slate-950/80 hover:bg-slate-900 text-cyan-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
            title="ร้านค้าสโตร์ & ตู้เสื้อผ้า"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden md:inline">สโตร์</span>
          </button>

          {/* Multiplayer Party */}
          <button
            onClick={onOpenMultiplayer}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-emerald-500/50 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 text-xs font-black transition-all cursor-pointer shadow-sm"
            title="เล่นกับเพื่อน (4 คน / 2 คน / Solo)"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden md:inline">ปาร์ตี้</span>
          </button>

          {/* Tactical Quiz */}
          <button
            onClick={onOpenQuiz}
            className="p-1.5 rounded-xl border border-purple-500/40 bg-slate-950/80 hover:bg-slate-900 text-purple-300 transition-all cursor-pointer"
            title="ควิซกลยุทธ์ชิงรางวัล"
          >
            <Brain className="w-4 h-4" />
          </button>

          {/* Save File Backup */}
          <button
            onClick={onOpenFileModal}
            className="p-1.5 rounded-xl border border-slate-700 bg-slate-950/80 hover:bg-slate-900 text-slate-300 transition-all cursor-pointer"
            title="สำรองไฟล์เกม (.json)"
          >
            <FileCode className="w-4 h-4" />
          </button>

          {/* Mute */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-xl border border-slate-700 bg-slate-950/80 hover:bg-slate-900 text-slate-300 transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Language Selector (TH / MS / EN) */}
          <div className="flex bg-slate-950/80 rounded-xl border border-slate-700 p-0.5 text-[10px] font-bold">
            {(['th', 'ms', 'en'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => onSelectLang(l)}
                className={`px-1.5 py-1 rounded uppercase transition-all cursor-pointer ${
                  lang === l ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MIDDLE AREA: CLEAN UNCLUTTERED LEFT PANEL & CLEAR RIGHT STAGE FOR 3D CHARACTER */}
      <div className="flex-1 flex items-center justify-between py-2 sm:py-4 overflow-hidden">
        {/* Left Control Panel: Compact & Organized (Max width 280px) */}
        <div className="w-64 sm:w-72 flex flex-col gap-2.5 pointer-events-auto bg-slate-950/75 p-3 rounded-2xl border border-slate-800 backdrop-blur-md shadow-2xl">
          {/* Section A: Map Selector (3 Maps) */}
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-cyan-400 tracking-wider mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>เลือกแผนที่ (MAP)</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {maps.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onSelectMap(m.id)}
                  className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                    selectedMap === m.id
                      ? 'border-cyan-400 bg-cyan-500/25 text-cyan-300 font-bold shadow-sm'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-base block">{m.icon}</span>
                  <span className="text-[9px] block truncate">{m.id.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section B: Operative Selector (Eva, Kevin, Kelly, Hayato) */}
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-amber-400 tracking-wider mb-1">
              <span>{t.character}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {characters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => onSelectCharacter(char.id)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                    selectedCharacter === char.id
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold shadow-sm'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{char.icon}</span>
                  <div className="truncate">
                    <div className="text-xs font-bold text-white leading-tight">
                      {char.id === 'eva' ? 'เอวา (Eva)' : char.id === 'kevin' ? 'เควิน (Kevin)' : char.id === 'kelly' ? 'เคลลี่ (Kelly)' : 'ฮายาโตะ'}
                    </div>
                    <div className="text-[9px] text-slate-400 truncate">
                      {lang === 'th' ? char.roleTh : char.roleEn}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section C: Game Mode Selector */}
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
              โหมดการเล่น (MODE)
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'tdm', label: 'TDM 5v5', icon: '⚔️' },
                { id: 'mutant', label: 'มัมมี่', icon: '🧟' },
                { id: 'training', label: 'ซ้อมยิง', icon: '🎯' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => onSelectMode(m.id as GameMode)}
                  className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                    selectedMode === m.id
                      ? 'border-cyan-400 bg-cyan-500/25 text-cyan-300 font-bold'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs block">{m.icon}</span>
                  <span className="text-[9px] block">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section D: Bot Genders */}
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
              เพศของบอทศัตรู
            </div>
            <div className="grid grid-cols-3 gap-1 text-[9px] font-bold">
              {[
                { id: 'mixed', label: 'ผสม ช/ญ' },
                { id: 'all_female', label: 'หญิงล้วน' },
                { id: 'all_male', label: 'ชายล้วน' },
              ].map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => onSelectBotGender(bg.id as BotGenderSetting)}
                  className={`py-1 rounded border text-center transition-all cursor-pointer ${
                    botGenderSetting === bg.id
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                      : 'border-slate-800 bg-slate-900/40 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lobby Dance Test Button */}
          <button
            onClick={handleToggleLobbyDance}
            className={`w-full py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isLobbyDancing
                ? 'border-cyan-400 bg-cyan-500/30 text-cyan-300 animate-pulse'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            <span>🕺</span>
            <span>{isLobbyDancing ? 'กำลังเต้นแองเจิ้ลแดนซ์...' : 'ทดลองเต้นในล็อบบี้'}</span>
          </button>
        </div>

        {/* Right Stage: Completely open for Three.js 3D character viewing! */}
        <div className="flex-1 pointer-events-none" />
      </div>

      {/* 3. BOTTOM BAR: COMPACT (HALF-SIZED) NEON PLAY BUTTON */}
      <div className="flex items-center justify-between w-full pointer-events-auto pt-2">
        {/* Left: Quick controls reminder */}
        <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400 font-mono">
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">WASD</span>
          <span>เคลื่อนที่</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 ml-1">V</span>
          <span>เต้นฮีล</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 ml-1">Space</span>
          <span>เริ่มเกม</span>
        </div>

        {/* Right: COMPACT HALF-SIZED PLAY BUTTON AS REQUESTED */}
        <button
          onClick={() => onStartGame(selectedMode, botGenderSetting, selectedMap)}
          className="relative group px-8 sm:px-10 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:from-cyan-300 hover:via-sky-400 hover:to-blue-500 text-slate-950 font-black text-base sm:text-lg tracking-widest uppercase shadow-xl shadow-cyan-500/40 hover:shadow-cyan-400/60 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer ml-auto border-2 border-cyan-200"
        >
          <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950 text-slate-950 transition-transform group-hover:scale-110" />
          <span>{t.playNow}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 text-white font-mono font-bold tracking-normal">
            Space
          </span>
        </button>
      </div>
    </div>
  );
};
