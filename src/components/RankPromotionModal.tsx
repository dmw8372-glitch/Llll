import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, ArrowRight, ShieldCheck, Zap, X } from 'lucide-react';
import { TierId } from '../types';
import { TIERS_CONFIG } from '../lib/rankSystem';
import { TierBadge } from './TierBadge';
import { sounds } from '../lib/soundEffects';

interface RankPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldTier: TierId;
  newTier: TierId;
  newScore: number;
}

export const RankPromotionModal: React.FC<RankPromotionModalProps> = ({
  isOpen,
  onClose,
  oldTier,
  newTier,
  newScore,
}) => {
  const oldConfig = TIERS_CONFIG[oldTier] || TIERS_CONFIG.BRONZE;
  const newConfig = TIERS_CONFIG[newTier] || TIERS_CONFIG.SILVER;

  useEffect(() => {
    if (isOpen) {
      sounds.playFanfare();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-hidden">
        {/* Rotating Solar / Energy Ray Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-[600px] h-[600px] rounded-full bg-[conic-gradient(from_0deg,#eab308,transparent,#ef4444,transparent,#eab308)] blur-2xl"
          />
        </div>

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-black text-white rounded-3xl shadow-2xl border-2 border-amber-400/40 p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden z-10"
        >
          {/* Close button */}
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Banner Tag */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-white text-xs font-black tracking-widest uppercase shadow-lg mb-3 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-spin" />
            TIER UP! 승급 달성
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-100">
            {newConfig.name} 티어 승급!
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-1 max-w-xs">
            뛰어난 어휘력과 전술로 새로운 전장의 경지에 올랐습니다.
          </p>

          {/* Tier Badge Transition Display */}
          <div className="relative my-6 flex items-center justify-center gap-4 w-full">
            {/* Old Tier (Dimmed) */}
            <div className="flex flex-col items-center opacity-60 scale-85">
              <TierBadge tier={oldTier} size="md" />
              <span className="text-xs font-bold text-slate-400 mt-1">{oldConfig.name}</span>
            </div>

            {/* Arrow */}
            <div className="text-amber-400">
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </div>

            {/* New Tier (Glowing Epic PUBG Badge) */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1.15, rotate: 0 }}
              transition={{ type: 'spring', damping: 14, stiffness: 220, delay: 0.2 }}
              className="flex flex-col items-center relative"
            >
              {/* Radial Aura Glow */}
              <div
                style={{ backgroundColor: newConfig.themeColor }}
                className="absolute inset-0 rounded-full blur-xl opacity-60 scale-150 pointer-events-none"
              />
              <TierBadge tier={newTier} size="lg" animated />
              <span
                style={{ color: newConfig.themeColor }}
                className="text-sm font-black tracking-wider mt-1 drop-shadow-md"
              >
                {newConfig.name}
              </span>
            </motion.div>
          </div>

          {/* New Tier Stats Box */}
          <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 mb-6 text-left">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                현재 레이팅 점수
              </span>
              <span className="text-amber-300 font-black text-sm">{newScore} RP</span>
            </div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                티어 설명
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
              {newConfig.description}
            </p>
          </div>

          {/* Confirm Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-base shadow-lg shadow-amber-500/25 cursor-pointer flex items-center justify-center gap-2"
          >
            <Trophy className="w-5 h-5 text-slate-950" />
            전장으로 복귀하기
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
