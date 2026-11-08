import React, { useState } from 'react';
import { UserProfile, CosmeticCategory } from '../game/types';
import { I18N, Language } from '../game/i18n';
import {
  COSMETIC_ITEMS,
  GOLD_ROYALE_POOL,
  DIAMOND_ROYALE_POOL,
  RoyaleDropItem,
} from '../game/cosmetics';
import {
  ShoppingBag,
  Sparkles,
  Shirt,
  Coins,
  Gem,
  Check,
  X,
  Crown,
  Dices,
} from 'lucide-react';

interface StoreWardrobeModalProps {
  profile: UserProfile;
  initialTab?: 'store' | 'royale' | 'wardrobe';
  onBuyItem: (item: any) => boolean;
  onEquipCosmetic: (category: CosmeticCategory, id: string) => void;
  onRoyaleSpin: (type: 'gold' | 'diamond', count: number) => RoyaleDropItem[] | null;
  onClose: () => void;
  lang: Language;
}

export const StoreWardrobeModal: React.FC<StoreWardrobeModalProps> = ({
  profile,
  initialTab = 'store',
  onBuyItem,
  onEquipCosmetic,
  onRoyaleSpin,
  onClose,
  lang,
}) => {
  const t = I18N[lang];
  const [activeTab, setActiveTab] = useState<'store' | 'royale' | 'wardrobe'>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<CosmeticCategory>('shirt');
  const [royaleType, setRoyaleType] = useState<'gold' | 'diamond'>('gold');
  const [spinResults, setSpinResults] = useState<RoyaleDropItem[] | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const categories: { id: CosmeticCategory; labelTh: string; labelEn: string; icon: string }[] = [
    { id: 'shirt', labelTh: 'เสื้อ', labelEn: 'Shirts', icon: '🦺' },
    { id: 'pants', labelTh: 'กางเกง', labelEn: 'Pants', icon: '👖' },
    { id: 'shoes', labelTh: 'รองเท้า', labelEn: 'Shoes', icon: '👟' },
    { id: 'hat', labelTh: 'หมวก', labelEn: 'Hats', icon: '🧢' },
    { id: 'mask', labelTh: 'หน้ากาก', labelEn: 'Masks', icon: '🎭' },
    { id: 'avatar', labelTh: 'อวตาร', labelEn: 'Avatars', icon: '🎖️' },
    { id: 'banner', labelTh: 'แบนเนอร์', labelEn: 'Banners', icon: '🚩' },
  ];

  const filteredItems = COSMETIC_ITEMS.filter((item) => item.category === selectedCategory);

  const handleSpin = (count: number) => {
    if (isSpinning) return;
    setIsSpinning(true);
    setTimeout(() => {
      const results = onRoyaleSpin(royaleType, count);
      setIsSpinning(false);
      if (results) setSpinResults(results);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[90vh] max-h-[720px] rounded-2xl border-2 border-cyan-500/50 bg-slate-900/95 shadow-2xl shadow-cyan-500/20 text-white flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-800/90 rounded-xl p-1 border border-slate-700">
              <button
                onClick={() => setActiveTab('store')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'store'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {t.store}
              </button>

              <button
                onClick={() => setActiveTab('royale')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'royale'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Dices className="w-4 h-4" />
                {t.angelRoyale}
              </button>

              <button
                onClick={() => setActiveTab('wardrobe')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'wardrobe'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shirt className="w-4 h-4" />
                {t.wardrobe}
              </button>
            </div>
          </div>

          {/* User Currency Badges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-black text-amber-300 font-mono">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              {profile.gold.toLocaleString()}
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs font-black text-cyan-300 font-mono">
              <Gem className="w-3.5 h-3.5 text-cyan-400" />
              {profile.gems.toLocaleString()}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* TAB 1: STORE / WARDROBE (Side Categories + Item Grid) */}
          {(activeTab === 'store' || activeTab === 'wardrobe') && (
            <>
              {/* Category Sidebar */}
              <div className="w-40 border-r border-slate-800 bg-slate-950/60 p-3 space-y-1 shrink-0 overflow-y-auto">
                <div className="text-[10px] font-bold text-slate-500 px-2 py-1 uppercase tracking-wider">
                  หมวดหมู่
                </div>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{lang === 'th' ? cat.labelTh : cat.labelEn}</span>
                  </button>
                ))}
              </div>

              {/* Items Grid */}
              <div className="flex-1 p-5 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {filteredItems.map((item) => {
                    const isUnlocked =
                      item.unlockedByDefault ||
                      profile.unlockedCosmeticIds?.includes(item.id) ||
                      profile.isDevVip;
                    const isEquipped = profile.equippedCosmetics?.[item.category] === item.id;
                    const canAfford =
                      profile.isDevVip ||
                      (item.priceGold > 0 && profile.gold >= item.priceGold) ||
                      (item.priceGems > 0 && profile.gems >= item.priceGems);

                    // If viewing wardrobe, only show unlocked items
                    if (activeTab === 'wardrobe' && !isUnlocked) return null;

                    return (
                      <div
                        key={item.id}
                        className={`flex flex-col justify-between p-3.5 rounded-xl border transition-all ${
                          isEquipped
                            ? 'border-emerald-500 bg-emerald-950/20 shadow-md shadow-emerald-500/20'
                            : isUnlocked
                            ? 'border-slate-700 bg-slate-950/50 hover:border-slate-500'
                            : 'border-slate-800 bg-slate-950/70 hover:border-cyan-500/40'
                        }`}
                      >
                        <div>
                          {/* Item Card Visual */}
                          <div
                            className="h-24 rounded-lg flex items-center justify-center text-3xl mb-2.5 relative border border-white/10"
                            style={{ backgroundColor: `${item.color}33` }}
                          >
                            <span
                              className="w-10 h-10 rounded-full flex items-center justify-center text-2xl shadow-inner"
                              style={{ backgroundColor: item.color }}
                            >
                              {item.icon || (item.category === 'hat' ? '🧢' : item.category === 'mask' ? '🎭' : '🦺')}
                            </span>
                            <span className="absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded font-black uppercase bg-black/60 text-slate-300">
                              {item.rarity}
                            </span>
                          </div>

                          <div className="font-bold text-xs text-white leading-tight">
                            {lang === 'th' ? item.nameTh : item.name}
                          </div>
                        </div>

                        <div className="mt-3">
                          {isEquipped ? (
                            <button
                              disabled
                              className="w-full py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" /> {t.equipped}
                            </button>
                          ) : isUnlocked ? (
                            <button
                              onClick={() => onEquipCosmetic(item.category, item.id)}
                              className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 text-white text-xs font-bold transition-all cursor-pointer"
                            >
                              {t.equip}
                            </button>
                          ) : (
                            <button
                              disabled={!canAfford}
                              onClick={() => onBuyItem(item)}
                              className={`w-full py-1.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                canAfford
                                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-md'
                                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              {item.priceGold === 0 && item.priceGems === 0 ? (
                                t.free
                              ) : item.priceGold > 0 ? (
                                <>
                                  <Coins className="w-3.5 h-3.5" />
                                  {item.priceGold.toLocaleString()}
                                </>
                              ) : (
                                <>
                                  <Gem className="w-3.5 h-3.5 text-cyan-300" />
                                  {item.priceGems}
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: ANGEL ROYALE (LUCKY DRAW) */}
          {activeTab === 'royale' && (
            <div className="flex-1 flex flex-col p-6 overflow-y-auto items-center">
              {/* Royale Banner Switch */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setRoyaleType('gold')}
                  className={`px-5 py-2.5 rounded-xl font-black text-sm tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
                    royaleType === 'gold'
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <Coins className="w-4 h-4" /> GOLD ROYALE
                </button>

                <button
                  onClick={() => setRoyaleType('diamond')}
                  className={`px-5 py-2.5 rounded-xl font-black text-sm tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
                    royaleType === 'diamond'
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/30 scale-105'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <Gem className="w-4 h-4" /> DIAMOND ROYALE (แรร์พิเศษ)
                </button>
              </div>

              {/* Main Draw Vault Display */}
              <div className="relative w-full max-w-md h-56 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-slate-900 to-amber-950/40 flex flex-col items-center justify-center p-6 shadow-2xl mb-6 text-center">
                <div
                  className={`text-6xl mb-3 transition-transform ${
                    isSpinning ? 'animate-spin scale-110' : 'animate-bounce'
                  }`}
                >
                  {royaleType === 'gold' ? '🪙' : '💎'}
                </div>

                <div className="text-xl font-black uppercase text-amber-300 tracking-wider">
                  {royaleType === 'gold' ? 'ตู้สุ่มเหรียญทอง (Gold Royale)' : 'ตู้สุ่มเพชรแท้ (Diamond Royale)'}
                </div>

                <div className="text-xs text-slate-400 mt-1">
                  {royaleType === 'gold'
                    ? 'สุ่มรับชุดแฟชั่น สกินปืน และรางวัลเหรียญทอง'
                    : 'สุ่มรับไอเทมระดับ LEGENDARY เท่านั้น!'}
                </div>
              </div>

              {/* Spin Action Buttons */}
              <div className="flex gap-4">
                <button
                  disabled={isSpinning}
                  onClick={() => handleSpin(1)}
                  className={`px-6 py-3 rounded-xl font-black text-sm tracking-wide transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                    royaleType === 'gold'
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/30'
                      : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-500/30'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {t.spin1} ({royaleType === 'gold' ? '300 ทอง' : '60 เพชร'})
                </button>

                <button
                  disabled={isSpinning}
                  onClick={() => handleSpin(10)}
                  className={`px-6 py-3 rounded-xl font-black text-sm tracking-wide transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                    royaleType === 'gold'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 shadow-amber-500/40'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 text-slate-950 shadow-cyan-500/40'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {t.spin10} ({royaleType === 'gold' ? '2,700 ทอง' : '540 เพชร'})
                </button>
              </div>

              {/* Reward Reveal Modal if spin completed */}
              {spinResults && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4 animate-in zoom-in-95 duration-200">
                  <div className="relative w-full max-w-lg rounded-2xl border-2 border-amber-400 bg-slate-900 p-6 text-center text-white shadow-2xl shadow-amber-500/30">
                    <button
                      onClick={() => setSpinResults(null)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="text-3xl mb-2 animate-bounce">🎉</div>
                    <h3 className="text-xl font-black text-amber-300 uppercase tracking-wider mb-4">
                      {t.congrats}
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 max-h-60 overflow-y-auto p-1">
                      {spinResults.map((res, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-amber-500/50 bg-slate-950 flex flex-col items-center shadow-md"
                        >
                          <span className="text-3xl mb-1">{res.icon}</span>
                          <span className="text-xs font-bold text-white line-clamp-1">
                            {lang === 'th' ? res.nameTh : res.name}
                          </span>
                          <span className="text-[10px] uppercase font-black text-amber-400 mt-1">
                            {res.rarity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setSpinResults(null)}
                      className="px-6 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm tracking-wide cursor-pointer"
                    >
                      ตกลง (OK)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
