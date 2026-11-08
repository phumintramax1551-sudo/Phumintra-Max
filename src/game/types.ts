export type GameMode = 'tdm' | 'mutant' | 'training';

export type GameState = 'title' | 'lobby' | 'playing' | 'paused' | 'game_over';

export type Team = 'red' | 'blue' | 'mutant';

export type MapType = 'classic' | 'desert' | 'ice';

export type CharacterId = 'eva' | 'kevin' | 'kelly' | 'hayato';

export type CharacterGender = 'female' | 'male';

export type BotGenderSetting = 'mixed' | 'all_male' | 'all_female';

export type EmoteType = 'angel_dance' | 'breakdance' | 'victory_dab' | 'heart_dance';

export type CosmeticCategory = 'hat' | 'mask' | 'shirt' | 'pants' | 'shoes' | 'avatar' | 'banner';

export interface DamageNumber {
  id: string;
  text: string;
  x: number;
  y: number;
  z: number;
  life: number;
  maxLife: number;
  isHeadshot: boolean;
}

export interface CosmeticItem {
  id: string;
  name: string;
  nameTh: string;
  nameMs: string;
  category: CosmeticCategory;
  priceGold: number;
  priceGems: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
  icon?: string;
  unlockedByDefault?: boolean;
}

export interface WeaponSkin {
  id: string;
  weaponId: string;
  name: string;
  nameTh: string;
  color: string;
  metalColor: number;
  neonColor: number;
  priceGold: number;
  priceGems: number;
  unlocked: boolean;
  rarity: 'rare' | 'epic' | 'legendary';
}

export interface WeaponDef {
  id: string;
  name: string;
  nameTh: string;
  category: 'primary' | 'secondary' | 'melee';
  damage: number;
  headshotMultiplier: number;
  fireRate: number;
  magazineSize: number;
  reserveAmmo: number;
  reloadTime: number;
  spread: number;
  recoil: { vertical: number; horizontal: number };
  bulletSpeed: number;
  range: number;
  isAutomatic: boolean;
  canADS: boolean;
  adsFov: number;
  color: string;
  descriptionTh: string;
  equippedSkinId?: string;
}

export interface PlayerStats {
  characterId: CharacterId;
  gender: CharacterGender;
  hp: number;
  maxHp: number;
  armor: number;
  maxArmor: number;
  score: number;
  kills: number;
  deaths: number;
  headshots: number;
  isDancing: boolean;
  currentEmote: EmoteType;
  danceProgress: number;
  isMutant: boolean;
  isArchangel: boolean;
  isReloading: boolean;
  reloadProgress: number;
  activeWeaponIndex: number;
  currentAmmo: number[];
  reserveAmmo: number[];
  grenadeCount: number;
  isADS: boolean;
}

export interface UserProfile {
  nickname: string;
  email: string;
  isGoogleLinked: boolean;
  isGuest: boolean;
  isDevVip: boolean;
  vipLevel: number;
  gold: number;
  gems: number;
  level: number;
  rank: string;
  selectedCharacter: CharacterId;
  selectedMap: MapType;
  equippedSkins: { [weaponId: string]: string };
  unlockedSkinIds: string[];
  equippedCosmetics: {
    hat?: string;
    mask?: string;
    shirt?: string;
    pants?: string;
    shoes?: string;
    avatar?: string;
    banner?: string;
  };
  unlockedCosmeticIds: string[];
  dailyCheckInDays: number;
  lastCheckInDate: string;
}

export interface QuizQuestion {
  id: number;
  questionTh: string;
  questionEn: string;
  optionsTh: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationTh: string;
  rewardGold: number;
  rewardGems: number;
}

export interface BotEntity {
  id: string;
  name: string;
  gender: CharacterGender;
  characterId: CharacterId;
  team: Team;
  position: { x: number; y: number; z: number };
  rotationY: number;
  hp: number;
  maxHp: number;
  isMutant: boolean;
  isArchangel: boolean;
  isDancing: boolean;
  isAlive: boolean;
  targetPos: { x: number; y: number; z: number } | null;
  shootCooldown: number;
  strafeTimer: number;
  strafeDir: number;
  kills: number;
  deaths: number;
  meshGroup?: any;
}

export interface KillEvent {
  id: string;
  killerName: string;
  killerTeam: Team;
  victimName: string;
  victimTeam: Team;
  weaponName: string;
  isHeadshot: boolean;
  timestamp: number;
}

export interface MatchScore {
  blueKills: number;
  redKills: number;
  targetKills: number;
  timeRemaining: number;
  humanCount: number;
  mutantCount: number;
  winnerTeam?: Team | 'humans' | 'mutants' | null;
}
