import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { TierId, UserStats } from '../types';
import { TIERS_CONFIG, getTierFromScore } from '../lib/rankSystem';
import { TierBadge } from './TierBadge';
import { sounds } from '../lib/soundEffects';

interface TierGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  onOpenRankings?: () => void;
}

const TIER_ORDER: TierId[] = [
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'DIAMOND',
  'CROWN',
  'ACE',
  'CONQUEROR',
];

export const TierGuideModal: React.FC<TierGuideModalProps> = ({
  isOpen,
  onClose,
  userStats,
  onOpenRankings,
}) => {
  const currentPoints = userStats.rankPoints || 0;
  const currentTierId = userStats.tier || getTierFromScore(currentPoints);

  useEffect(() => {
    if (isOpen) {
      sounds.playPop();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-200 text-slate-800 flex items-center justify-center shadow-xs">
                <Shield className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>티어 등급 & 문양 도감</span>
                  <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                    브론즈 ~ 정복자
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  경쟁 랭킹전 점수(RP)에 따라 부여되는 8단계 티어 표식 문양입니다.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Tier Summary Card */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-100 via-slate-50 to-white border-b border-slate-200/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-1 rounded-2xl bg-white border border-slate-200 shadow-xs shrink-0">
                <TierBadge tier={currentTierId} size="md" showLabel={false} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-extrabold text-slate-500">내 현재 티어</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                    {userStats.nickname}
                  </span>
                </div>
                <div className="text-lg font-black text-slate-900 tracking-tight">
                  {TIERS_CONFIG[currentTierId]?.name || '브론즈'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] font-bold text-slate-400">보유 랭크 포인트</div>
              <div className="text-xl sm:text-2xl font-black text-amber-600 font-mono">
                {currentPoints} <span className="text-xs text-amber-700 font-bold">RP</span>
              </div>
            </div>
          </div>

          {/* Scrollable Tier List (Bronze ~ Conqueror) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {TIER_ORDER.map((tierKey, index) => {
              const config = TIERS_CONFIG[tierKey];
              const isCurrent = tierKey === currentTierId;

              return (
                <div
                  key={tierKey}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center gap-3 sm:gap-4 ${
                    isCurrent
                      ? 'bg-amber-50/70 border-amber-300 shadow-xs ring-2 ring-amber-400/40'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  {/* Tier Number & Emblem */}
                  <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                    <span className="text-xs font-black text-slate-400 w-4 text-center">
                      {index + 1}
                    </span>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center p-0.5 shrink-0">
                      <TierBadge tier={tierKey} size="sm" showLabel={false} />
                    </div>
                  </div>

                  {/* Tier Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-slate-900 text-base tracking-tight">
                        {config.name}
                      </span>
                      <span className="text-xs font-bold text-slate-400 font-mono">
                        {config.englishName}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] bg-amber-500 text-white font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                          <CheckCircle2 className="w-3 h-3" /> 내 티어
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1 sm:line-clamp-none">
                      {config.description}
                    </p>
                  </div>

                  {/* Required RP Badge */}
                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-black text-slate-800 font-mono bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
                      {tierKey === 'CONQUEROR' ? '230+ RP' : `${config.minScore} ~ ${config.maxScore} RP`}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold mt-1">
                      {tierKey === 'CONQUEROR' ? '최상위 리그' : `승급 필요: ${config.pointsNeeded}RP`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
            {onOpenRankings && (
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onClose();
                  onOpenRankings();
                }}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>전체 순위표 보기</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="ml-auto px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
