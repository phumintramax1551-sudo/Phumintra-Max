import React, { useState } from 'react';
import { WEAPON_SKINS } from '../game/skins';
import { WeaponSkin, UserProfile } from '../game/types';
import { ShoppingBag, Check, Sparkles, X, Shield, Lock } from 'lucide-react';

interface ShopModalProps {
  profile: UserProfile;
  onBuySkin: (skin: WeaponSkin) => boolean;
  onEquipSkin: (skin: WeaponSkin) => void;
  onClose: () => void;
  lang: 'th' | 'en';
}

export const ShopModal: React.FC<ShopModalProps> = ({
  profile,
  onBuySkin,
  onEquipSkin,
  onClose,
  lang,
}) => {
  const [selectedWeaponId, setSelectedWeaponId] = useState<string>('ar_astra');
  const [purchaseMsg, setPurchaseMsg] = useState<string | null>(null);

  const weapons = [
    { id: 'ar_astra', name: 'AR-47 Astra' },
    { id: 'awp_valkyrie', name: 'AWP Valkyrie' },
    { id: 'dual_twin', name: 'Twin Strike' },
    { id: 'plasma_katana', name: 'Plasma Katana' },
  ];

  const filteredSkins = WEAPON_SKINS.filter((s) => s.weaponId === selectedWeaponId);

  const handleBuy = (skin: WeaponSkin) => {
    const success = onBuySkin(skin);
    if (success) {
      setPurchaseMsg(lang === 'th' ? `ปลดล็อก ${skin.nameTh} สำเร็จแล้ว!` : `Unlocked ${skin.name}!`);
      setTimeout(() => setPurchaseMsg(null), 2500);
    } else {
      setPurchaseMsg(lang === 'th' ? 'เหรียญทองไม่เพียงพอ! ไปทำควิซเพื่อรับเหรียญเพิ่ม' : 'Not enough Gold! Complete quizzes for more.');
      setTimeout(() => setPurchaseMsg(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 select-none p-4 font-sans">
      <div className="relative w-full max-w-2xl p-6 rounded-2xl border-2 border-cyan-500/50 bg-slate-950 shadow-[0_0_60px_rgba(6,182,212,0.3)] max-h-[85vh] flex flex-col">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border border-cyan-400/40 bg-cyan-950/60 text-cyan-400 shadow">
              <ShoppingBag size={22} />
            </div>
            <div>
              <h2 className="text-lg font-mono font-black text-white tracking-wider flex items-center gap-2">
                {lang === 'th' ? 'ร้านค้าสกินปืน // CYBER ARSENAL' : 'WEAPON SKIN ARSENAL'}
                <Sparkles size={16} className="text-yellow-400" />
              </h2>
              <div className="text-xs font-mono text-cyan-400">
                {lang === 'th' ? 'ซื้อและสวมใส่สกินระดับเทพเพิ่มความสวยงาม' : 'Purchase & equip legendary weapon finishes'}
              </div>
            </div>
          </div>

          {/* User Currency Badge */}
          <div className="flex items-center gap-3 pr-8">
            <span className="px-3 py-1 rounded-lg border border-yellow-500/40 bg-yellow-950/40 text-xs font-mono font-bold text-yellow-300">
              🪙 {profile.gold.toLocaleString()}
            </span>
            <span className="px-3 py-1 rounded-lg border border-cyan-500/40 bg-cyan-950/40 text-xs font-mono font-bold text-cyan-300">
              💎 {profile.gems.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Notification Toast */}
        {purchaseMsg && (
          <div className="my-2 p-2.5 rounded-lg border border-yellow-400/60 bg-yellow-950/80 text-yellow-300 text-xs font-mono text-center animate-bounce">
            {purchaseMsg}
          </div>
        )}

        {/* Weapon Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-4 border-b border-slate-800">
          {weapons.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWeaponId(w.id)}
              className={`py-2 px-3 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer ${
                selectedWeaponId === w.id
                  ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              {w.name}
            </button>
          ))}
        </div>

        {/* Skins Grid */}
        <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[48vh] pr-1">
          {filteredSkins.map((skin) => {
            const isUnlocked = profile.unlockedSkinIds.includes(skin.id);
            const isEquipped = profile.equippedSkins[skin.weaponId] === skin.id;

            return (
              <div
                key={skin.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isEquipped
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : isUnlocked
                    ? 'border-slate-700 bg-slate-900/60'
                    : 'border-slate-800 bg-slate-950/60'
                }`}
              >
                <div>
                  {/* Skin Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase ${
                        skin.rarity === 'legendary'
                          ? 'bg-amber-500/20 text-yellow-300 border border-yellow-500/40'
                          : skin.rarity === 'epic'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      {skin.rarity}
                    </span>
                    {/* Color Swatch Dot */}
                    <div
                      className="w-4 h-4 rounded-full shadow-[0_0_8px_currentColor]"
                      style={{ backgroundColor: skin.color, color: skin.color }}
                    ></div>
                  </div>

                  <h4 className="font-mono font-bold text-white text-sm">{skin.name}</h4>
                  <div className="text-xs text-slate-400 mt-0.5">{skin.nameTh}</div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  {isUnlocked ? (
                    isEquipped ? (
                      <span className="flex items-center gap-1.5 text-xs font-mono font-black text-cyan-400">
                        <Check size={16} /> {lang === 'th' ? 'สวมใส่อยู่ (EQUIPPED)' : 'EQUIPPED'}
                      </span>
                    ) : (
                      <button
                        onClick={() => onEquipSkin(skin)}
                        className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
                      >
                        {lang === 'th' ? 'สวมใส่ (EQUIP)' : 'EQUIP'}
                      </button>
                    )
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <div className="text-xs font-mono font-black text-yellow-400">
                        🪙 {skin.priceGold.toLocaleString()}
                      </div>
                      <button
                        onClick={() => handleBuy(skin)}
                        className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-mono text-xs font-black hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow flex items-center gap-1"
                      >
                        <span>{lang === 'th' ? 'ซื้อทันที' : 'BUY'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
