import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, TrendingUp, TrendingDown, ChevronRight, Sparkles, Shield, X } from 'lucide-react';
import { TierId } from '../types';
import { getTierFromScore, TIERS_CONFIG } from '../lib/rankSystem';
import { TierBadge } from './TierBadge';
import { sounds } from '../lib/soundEffects';

interface RankScoreModalProps {
  isOpen: boolean;
  isWin: boolean;
  pointChange: number; // e.g. +6 or -4
  oldScore: number;
  newScore: number;
  onClose: () => void;
  onProceedToPromotion?: () => void;
  isPromotion?: boolean;
}

export const RankScoreModal: React.FC<RankScoreModalProps> = ({
  isOpen,
  isWin,
  pointChange,
  oldScore,
  newScore,
  onClose,
  onProceedToPromotion,
  isPromotion = false,
}) => {
  const [animatedScore, setAnimatedScore] = useState<number>(oldScore);

  const { tier, currentTierProgress, pointsNeeded, progressPercent, pointsToNextTier, isMaxTier } =
    getTierFromScore(newScore);

  useEffect(() => {
    if (!isOpen) return;

    // Play initial sound
    if (isWin) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    // Number counting animation
    const duration = 1200;
    const steps = 30;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const val = Math.round(oldScore + (newScore - oldScore) * progress);
      setAnimatedScore(val);

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedScore(newScore);
        if (isWin) sounds.playScoreCount();
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isOpen, oldScore, newScore, isWin]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-sm sm:max-w-md bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700/80 p-6 sm:p-7 flex flex-col items-center text-center overflow-hidden"
        >
          {/* Top Banner Tag */}
          <div
            className={`px-3.5 py-1 rounded-full text-xs font-black tracking-wide uppercase mb-3 flex items-center gap-1.5 ${
              isWin
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {isWin ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {isWin ? '랭킹전 승리' : '랭킹전 패배'}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            레이팅 점수 정산
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {isWin ? '승리하여 랭킹 포인트(RP)가 상승했습니다!' : '패배하여 랭킹 포인트(RP)가 차감되었습니다.'}
          </p>

          {/* PUBG Mobile Tier Crest */}
          <div className="my-5 relative flex flex-col items-center">
            {/* Glow Aura */}
            <div
              style={{ backgroundColor: tier.themeColor }}
              className="absolute inset-0 rounded-full blur-2xl opacity-40 scale-125 pointer-events-none"
            />
            <TierBadge tier={tier.id} size="lg" animated />
            <div className="mt-2 text-base font-black text-white flex items-center gap-1.5">
              <span style={{ color: tier.themeColor }}>{tier.name}</span>
              <span className="text-xs text-slate-400 font-bold">({tier.englishName})</span>
            </div>
          </div>

          {/* Score Increment / Decrement Counter with Floating Badge */}
          <div className="flex items-center justify-center gap-3 my-2">
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
              {animatedScore} <span className="text-lg text-slate-400 font-normal">RP</span>
            </div>

            {/* Point Change Badge */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: isWin ? 10 : -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 15 }}
              className={`px-3 py-1.5 rounded-xl font-black text-sm sm:text-base flex items-center gap-1 shadow-lg ${
                isWin
                  ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                  : 'bg-rose-500 text-white shadow-rose-500/30'
              }`}
            >
              {isWin ? '+' : ''}
              {pointChange} RP
            </motion.div>
          </div>

          {/* Progress Bar towards Next Tier */}
          <div className="w-full bg-slate-800/80 rounded-2xl p-4 my-4 border border-slate-700/60 text-left">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                {tier.name} 승급 게이지
              </span>
              <span className="text-slate-200 font-mono">
                {currentTierProgress} / {pointsNeeded} RP
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-3 bg-slate-700/70 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                style={{ backgroundColor: tier.themeColor }}
                className="h-full rounded-full relative"
              >
                {/* Glow highlight inside bar */}
                <div className="absolute inset-0 bg-white/25 rounded-full" />
              </motion.div>
            </div>

            {/* Remaining text */}
            <div className="mt-2 text-right text-[11px] font-bold text-amber-300/90">
              {isMaxTier ? (
                '최고 정복자 티어에 도달했습니다!'
              ) : (
                <>다음 티어까지 앞으로 <span className="text-white underline">{pointsToNextTier} RP</span> 남음</>
              )}
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sounds.playPop();
              if (isPromotion && onProceedToPromotion) {
                onProceedToPromotion();
              } else {
                onClose();
              }
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base shadow-lg cursor-pointer flex items-center justify-center gap-1.5 transition-all"
          >
            {isPromotion ? (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                승급 축하 화면 확인
              </>
            ) : (
              <>
                확인
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
