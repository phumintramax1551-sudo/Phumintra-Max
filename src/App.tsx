/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './game/engine';
import {
  GameMode,
  GameState,
  PlayerStats,
  MatchScore,
  KillEvent,
  CharacterGender,
  BotGenderSetting,
  UserProfile,
  WeaponSkin,
  MapType,
  CharacterId,
  EmoteType,
  CosmeticCategory,
} from './game/types';
import { Language } from './game/i18n';
import { GOLD_ROYALE_POOL, DIAMOND_ROYALE_POOL, RoyaleDropItem } from './game/cosmetics';
import { LobbyScreen } from './components/LobbyScreen';
import { HUD } from './components/HUD';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { ProfileModal } from './components/ProfileModal';
import { QuizModal } from './components/QuizModal';
import { StoreWardrobeModal } from './components/StoreWardrobeModal';
import { DailyRewardModal } from './components/DailyRewardModal';
import { ExchangeModal } from './components/ExchangeModal';
import { MultiplayerModal } from './components/MultiplayerModal';
import { LoginChoiceModal } from './components/LoginChoiceModal';
import { GameFileModal } from './components/GameFileModal';
import { soundEngine } from './game/audio';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // App & Game State
  const [gameState, setGameState] = useState<GameState>('lobby');
  const [gameMode, setGameMode] = useState<GameMode>('tdm');
  const [selectedMap, setSelectedMap] = useState<MapType>('classic');
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>('eva');
  const [botGenderSetting, setBotGenderSetting] = useState<BotGenderSetting>('mixed');
  const [lang, setLang] = useState<Language>('th');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [sensitivity, setSensitivity] = useState<number>(0.0022);
  const [fov, setFov] = useState<number>(75);
  const [volume, setVolume] = useState<number>(0.7);
  const [isPointerLocked, setIsPointerLocked] = useState<boolean>(false);

  // Modals
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [showStoreWardrobeModal, setShowStoreWardrobeModal] = useState<boolean>(false);
  const [storeInitialTab, setStoreInitialTab] = useState<'store' | 'royale' | 'wardrobe'>('store');
  const [showDailyModal, setShowDailyModal] = useState<boolean>(false);
  const [showExchangeModal, setShowExchangeModal] = useState<boolean>(false);
  const [showMultiplayerModal, setShowMultiplayerModal] = useState<boolean>(false);
  const [showGameFileModal, setShowGameFileModal] = useState<boolean>(false);

  // User Profile (Dev VIP with Google Account suniphan1992@gmail.com)
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cyber_angel_profile_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      nickname: 'Suniphan',
      email: 'suniphan1992@gmail.com',
      isGoogleLinked: true,
      isGuest: false,
      isDevVip: true,
      vipLevel: 1,
      gold: 999999,
      gems: 99999,
      level: 48,
      rank: 'DIAMOND ★★★',
      selectedCharacter: 'eva',
      selectedMap: 'classic',
      equippedSkins: {
        ar_astra: 'ar_golden_archangel',
        awp_valkyrie: 'awp_golden_valkyrie',
        dual_twin: 'dual_thunder_dragon',
        plasma_katana: 'katana_bloodblade',
      },
      unlockedSkinIds: [
        'ar_default',
        'ar_dragon_blaze',
        'ar_cyber_sakura',
        'ar_golden_archangel',
        'awp_default',
        'awp_hyperion_void',
        'awp_golden_valkyrie',
        'dual_default',
        'dual_thunder_dragon',
        'katana_default',
        'katana_bloodblade',
      ],
      equippedCosmetics: {
        shirt: 'shirt_default',
        pants: 'pants_default',
        shoes: 'shoes_default',
        avatar: 'avatar_lead_dev',
        banner: 'banner_lead_dev',
      },
      unlockedCosmeticIds: [
        'shirt_default',
        'pants_default',
        'shoes_default',
        'avatar_default',
        'banner_default',
        'avatar_lead_dev',
        'banner_lead_dev',
      ],
      dailyCheckInDays: 1,
      lastCheckInDate: '',
    };
  });

  // Save profile on change
  useEffect(() => {
    localStorage.setItem('cyber_angel_profile_v3', JSON.stringify(profile));
  }, [profile]);

  // In-Game Live State
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    characterId: 'eva',
    gender: 'female',
    hp: 100,
    maxHp: 100,
    armor: 100,
    maxArmor: 100,
    score: 0,
    kills: 0,
    deaths: 0,
    headshots: 0,
    isDancing: false,
    currentEmote: 'angel_dance',
    danceProgress: 0,
    isMutant: false,
    isArchangel: false,
    isReloading: false,
    reloadProgress: 0,
    activeWeaponIndex: 0,
    currentAmmo: [30, 5, 24, 1],
    reserveAmmo: [120, 25, 96, 1],
    grenadeCount: 2,
    isADS: false,
  });

  const [matchScore, setMatchScore] = useState<MatchScore>({
    blueKills: 0,
    redKills: 0,
    targetKills: 30,
    timeRemaining: 300,
    humanCount: 8,
    mutantCount: 0,
  });

  const [killEvents, setKillEvents] = useState<KillEvent[]>([]);
  const [hitmarker, setHitmarker] = useState<{ visible: boolean; isHeadshot: boolean; damage: number } | null>(null);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [gameOverWinner, setGameOverWinner] = useState<string>('');

  // Initialize Three.js Engine once on mount
  useEffect(() => {
    if (!mountRef.current) return;

    const engine = new GameEngine(mountRef.current, {
      onStatsUpdate: (stats) => setPlayerStats(stats),
      onMatchScoreUpdate: (score) => setMatchScore(score),
      onKillEvent: (evt) => {
        setKillEvents((prev) => [...prev.slice(-8), evt]);
      },
      onAnnouncement: (type) => {
        let msg = '';
        if (type === 'first_blood') msg = lang === 'th' ? 'FIRST BLOOD! สังหารแรก' : 'FIRST BLOOD!';
        else if (type === 'double_kill') msg = 'DOUBLE KILL!';
        else if (type === 'triple_kill') msg = 'TRIPLE KILL!';
        else if (type === 'rampage') msg = 'RAMPAGE (คลั่งสังหาร)!';
        else if (type === 'headshot') msg = 'HEADSHOT!';
        setAnnouncement(msg);
        setTimeout(() => setAnnouncement(null), 2500);
      },
      onHitmarker: (isHeadshot, damage) => {
        setHitmarker({ visible: true, isHeadshot, damage });
        setTimeout(() => setHitmarker(null), 140);
      },
      onGameOver: (winner) => {
        setGameOverWinner(winner);
        setGameState('game_over');

        // Reward Gold & Gems for completing match
        const earnedGold = winner.includes('Victory') || winner.includes('Blue') ? 5000 : 2500;
        const earnedGems = 50;
        setProfile((prev) => ({
          ...prev,
          gold: prev.isDevVip ? 999999 : prev.gold + earnedGold,
          gems: prev.isDevVip ? 99999 : prev.gems + earnedGems,
        }));
      },
      onPointerLockChange: (locked) => {
        setIsPointerLocked(locked);
      },
    });

    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.mouseSensitivity = sensitivity;
      engineRef.current.baseFov = fov;
    }
  }, [sensitivity, fov]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        if (showLoginModal) setShowLoginModal(false);
        else if (showProfileModal) setShowProfileModal(false);
        else if (showQuizModal) setShowQuizModal(false);
        else if (showStoreWardrobeModal) setShowStoreWardrobeModal(false);
        else if (showDailyModal) setShowDailyModal(false);
        else if (showExchangeModal) setShowExchangeModal(false);
        else if (showMultiplayerModal) setShowMultiplayerModal(false);
        else if (showGameFileModal) setShowGameFileModal(false);
        else if (gameState === 'playing') {
          setGameState('paused');
          if (engineRef.current) engineRef.current.state = 'paused';
        } else if (gameState === 'paused') {
          setGameState('playing');
          if (engineRef.current) {
            engineRef.current.state = 'playing';
            mountRef.current?.requestPointerLock();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameState,
    showLoginModal,
    showProfileModal,
    showQuizModal,
    showStoreWardrobeModal,
    showDailyModal,
    showExchangeModal,
    showMultiplayerModal,
    showGameFileModal,
  ]);

  // Actions
  const handleStartGame = (mode: GameMode, botGender: BotGenderSetting, mapType: MapType) => {
    setGameMode(mode);
    setBotGenderSetting(botGender);
    setSelectedMap(mapType);
    setGameState('playing');
    setKillEvents([]);
    if (engineRef.current) {
      engineRef.current.startGame(mode, botGender, mapType);
      mountRef.current?.requestPointerLock();
    }
  };

  const handleSelectCharacter = (charId: CharacterId) => {
    setSelectedCharacter(charId);
    setProfile((prev) => ({ ...prev, selectedCharacter: charId }));
    if (engineRef.current) {
      engineRef.current.setPlayerCharacter(charId);
    }
  };

  const handleSelectMap = (mapType: MapType) => {
    setSelectedMap(mapType);
    setProfile((prev) => ({ ...prev, selectedMap: mapType }));
    if (engineRef.current) {
      engineRef.current.loadMap(mapType);
    }
  };

  const handleResumeGame = () => {
    setGameState('playing');
    if (engineRef.current) {
      engineRef.current.state = 'playing';
      mountRef.current?.requestPointerLock();
    }
  };

  const handleRestartMatch = () => {
    setKillEvents([]);
    setGameState('playing');
    if (engineRef.current) {
      engineRef.current.startGame(gameMode, botGenderSetting, selectedMap);
      mountRef.current?.requestPointerLock();
    }
  };

  const handleQuitToLobby = () => {
    setGameState('lobby');
    soundEngine.stopAngelDanceBGM();
    soundEngine.stopHeartbeat();
    if (engineRef.current) {
      engineRef.current.enterLobby();
    }
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    soundEngine.setMasterVolume(val);
  };

  const handleQuizReward = (gold: number, gems: number) => {
    setProfile((prev) => ({
      ...prev,
      gold: prev.isDevVip ? 999999 : prev.gold + gold,
      gems: prev.isDevVip ? 99999 : prev.gems + gems,
    }));
  };

  // Currency Exchange: 500 Gold -> 90 Gems
  const handleExchange = (goldCost: number, gemsGained: number): boolean => {
    if (profile.isDevVip) {
      return true;
    }
    if (profile.gold >= goldCost) {
      setProfile((prev) => ({
        ...prev,
        gold: prev.gold - goldCost,
        gems: prev.gems + gemsGained,
      }));
      return true;
    }
    return false;
  };

  // Daily Check-in Claim
  const handleClaimDaily = (day: number, gold: number, gems: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setProfile((prev) => ({
      ...prev,
      gold: prev.isDevVip ? 999999 : prev.gold + gold,
      gems: prev.isDevVip ? 99999 : prev.gems + gems,
      dailyCheckInDays: Math.min(7, prev.dailyCheckInDays + 1),
      lastCheckInDate: todayStr,
    }));
  };

  // Store Buy
  const handleBuyItem = (item: any): boolean => {
    if (profile.isDevVip) {
      setProfile((prev) => ({
        ...prev,
        unlockedCosmeticIds: [...(prev.unlockedCosmeticIds || []), item.id],
      }));
      return true;
    }

    if (item.priceGold > 0 && profile.gold >= item.priceGold) {
      setProfile((prev) => ({
        ...prev,
        gold: prev.gold - item.priceGold,
        unlockedCosmeticIds: [...(prev.unlockedCosmeticIds || []), item.id],
      }));
      return true;
    }

    if (item.priceGems > 0 && profile.gems >= item.priceGems) {
      setProfile((prev) => ({
        ...prev,
        gems: prev.gems - item.priceGems,
        unlockedCosmeticIds: [...(prev.unlockedCosmeticIds || []), item.id],
      }));
      return true;
    }

    return false;
  };

  // Equip Cosmetic
  const handleEquipCosmetic = (category: CosmeticCategory, id: string) => {
    setProfile((prev) => ({
      ...prev,
      equippedCosmetics: {
        ...(prev.equippedCosmetics || {}),
        [category]: id,
      },
    }));
  };

  // Angel Royale Lucky Draw
  const handleRoyaleSpin = (type: 'gold' | 'diamond', count: number): RoyaleDropItem[] | null => {
    const cost = type === 'gold' ? (count === 10 ? 2700 : 300) : (count === 10 ? 540 : 60);

    if (!profile.isDevVip) {
      if (type === 'gold' && profile.gold < cost) return null;
      if (type === 'diamond' && profile.gems < cost) return null;

      setProfile((prev) => ({
        ...prev,
        gold: type === 'gold' ? prev.gold - cost : prev.gold,
        gems: type === 'diamond' ? prev.gems - cost : prev.gems,
      }));
    }

    const pool = type === 'gold' ? GOLD_ROYALE_POOL : DIAMOND_ROYALE_POOL;
    const drops: RoyaleDropItem[] = [];

    for (let i = 0; i < count; i++) {
      const item = pool[Math.floor(Math.random() * pool.length)];
      drops.push(item);
      if (item.type === 'cosmetic') {
        setProfile((prev) => ({
          ...prev,
          unlockedCosmeticIds: [...new Set([...(prev.unlockedCosmeticIds || []), item.id])],
        }));
      } else if (item.type === 'gold' && item.amount) {
        setProfile((prev) => ({
          ...prev,
          gold: prev.isDevVip ? 999999 : prev.gold + (item.amount || 0),
        }));
      } else if (item.type === 'gems' && item.amount) {
        setProfile((prev) => ({
          ...prev,
          gems: prev.isDevVip ? 99999 : prev.gems + (item.amount || 0),
        }));
      }
    }

    return drops;
  };

  // First-time login selection
  const handleSelectGoogleLogin = (email: string) => {
    const isDev = email === 'suniphan1992@gmail.com';
    setProfile((prev) => ({
      ...prev,
      email,
      nickname: isDev ? 'Suniphan' : email.split('@')[0],
      isGoogleLinked: true,
      isGuest: false,
      isDevVip: isDev,
      gold: isDev ? 999999 : prev.gold,
      gems: isDev ? 99999 : prev.gems,
    }));
    setShowLoginModal(false);
  };

  const handleSelectGuestLogin = () => {
    setProfile((prev) => ({
      ...prev,
      isGoogleLinked: false,
      isGuest: true,
      isDevVip: false,
      nickname: 'Guest_' + Math.floor(1000 + Math.random() * 9000),
      gold: 15000,
      gems: 150,
    }));
    setShowLoginModal(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 z-0 cursor-crosshair" />

      {/* 1. Bullet Angel Style Tactical Lobby */}
      {gameState === 'lobby' && (
        <LobbyScreen
          onStartGame={handleStartGame}
          selectedMode={gameMode}
          onSelectMode={setGameMode}
          selectedMap={selectedMap}
          onSelectMap={handleSelectMap}
          selectedCharacter={selectedCharacter}
          onSelectCharacter={handleSelectCharacter}
          botGenderSetting={botGenderSetting}
          onSelectBotGender={setBotGenderSetting}
          profile={profile}
          onOpenProfile={() => setShowProfileModal(true)}
          onOpenQuiz={() => setShowQuizModal(true)}
          onOpenStoreWardrobe={(tab) => {
            setStoreInitialTab(tab || 'store');
            setShowStoreWardrobeModal(true);
          }}
          onOpenDailyReward={() => setShowDailyModal(true)}
          onOpenExchange={() => setShowExchangeModal(true)}
          onOpenMultiplayer={() => setShowMultiplayerModal(true)}
          onOpenFileModal={() => setShowGameFileModal(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          lang={lang}
          onSelectLang={setLang}
        />
      )}

      {/* 2. In-Game HUD */}
      {gameState === 'playing' && (
        <HUD
          stats={playerStats}
          score={matchScore}
          killEvents={killEvents}
          mode={gameMode}
          isPointerLocked={isPointerLocked}
          onRequestPointerLock={() => mountRef.current?.requestPointerLock()}
          onTriggerDance={(emote?: EmoteType) => engineRef.current?.toggleAngelDance(emote)}
          onReload={() => engineRef.current?.reload()}
          onThrowGrenade={() => engineRef.current?.throwGrenade()}
          onSwitchWeapon={(idx) => engineRef.current?.switchWeapon(idx)}
          hitmarker={hitmarker}
          announcement={announcement}
          lang={lang}
        />
      )}

      {/* 3. Pause Modal */}
      {gameState === 'paused' && (
        <PauseModal
          onResume={handleResumeGame}
          onRestart={handleRestartMatch}
          onQuit={handleQuitToLobby}
          sensitivity={sensitivity}
          onSensitivityChange={setSensitivity}
          fov={fov}
          onFovChange={setFov}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          lang={lang === 'ms' ? 'en' : lang}
          onToggleLang={() => setLang(lang === 'th' ? 'en' : 'th')}
        />
      )}

      {/* 4. Game Over Modal */}
      {gameState === 'game_over' && (
        <GameOverModal
          winner={gameOverWinner}
          stats={playerStats}
          onPlayAgain={handleRestartMatch}
          onQuitToTitle={handleQuitToLobby}
          lang={lang === 'ms' ? 'en' : lang}
        />
      )}

      {/* 5. First-Time Login Choice Modal */}
      {showLoginModal && (
        <LoginChoiceModal
          isOpen={showLoginModal}
          onSelectGuest={handleSelectGuestLogin}
          onSelectGoogle={handleSelectGoogleLogin}
          lang={lang}
        />
      )}

      {/* 6. Profile & Google Linking Modal */}
      {showProfileModal && (
        <ProfileModal
          profile={profile}
          onUpdateProfile={(updated) => setProfile((p) => ({ ...p, ...updated }))}
          onClose={() => setShowProfileModal(false)}
          lang={lang === 'ms' ? 'en' : lang}
        />
      )}

      {/* 7. Tactical Quiz Modal */}
      {showQuizModal && (
        <QuizModal
          onRewardEarned={handleQuizReward}
          onClose={() => setShowQuizModal(false)}
          lang={lang === 'ms' ? 'en' : lang}
        />
      )}

      {/* 8. Store & Angel Royale & Wardrobe Modal */}
      {showStoreWardrobeModal && (
        <StoreWardrobeModal
          profile={profile}
          initialTab={storeInitialTab}
          onBuyItem={handleBuyItem}
          onEquipCosmetic={handleEquipCosmetic}
          onRoyaleSpin={handleRoyaleSpin}
          onClose={() => setShowStoreWardrobeModal(false)}
          lang={lang}
        />
      )}

      {/* 9. Daily Check-In Modal */}
      {showDailyModal && (
        <DailyRewardModal
          currentDay={profile.dailyCheckInDays || 1}
          lastClaimDate={profile.lastCheckInDate || ''}
          onClaimDay={handleClaimDaily}
          onClose={() => setShowDailyModal(false)}
          lang={lang}
        />
      )}

      {/* 10. Currency Exchange Modal */}
      {showExchangeModal && (
        <ExchangeModal
          profile={profile}
          onExchange={handleExchange}
          onClose={() => setShowExchangeModal(false)}
          lang={lang}
        />
      )}

      {/* 11. Multiplayer Party Modal (Squad 4, Duo 2, Solo 1) */}
      {showMultiplayerModal && (
        <MultiplayerModal
          profile={profile}
          selectedMap={selectedMap}
          selectedMode={gameMode}
          onStartMultiplayerMatch={(code) => {
            setShowMultiplayerModal(false);
            handleStartGame(gameMode, botGenderSetting, selectedMap);
          }}
          onClose={() => setShowMultiplayerModal(false)}
          lang={lang}
        />
      )}

      {/* 12. Game File Backup Modal */}
      {showGameFileModal && (
        <GameFileModal
          profile={profile}
          onClose={() => setShowGameFileModal(false)}
          lang={lang === 'ms' ? 'en' : lang}
        />
      )}
    </div>
  );
}
