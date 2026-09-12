import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, CheckCircle2, Shield, ChevronRight, ChevronLeft, ArrowRight, Zap, LogIn } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { TierId, UserStats } from '../types';
import { TIERS_CONFIG, getTierFromScore } from '../lib/rankSystem';
import { TierBadge } from './TierBadge';
import { sounds } from '../lib/soundEffects';

interface TierGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  currentUser?: FirebaseUser | null;
  onOpenLogin?: () => void;
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
  currentUser,
  onOpenLogin,
  onOpenRankings,
}) => {
  const currentPoints = userStats.rankPoints || 0;
  const scoreTierInfo = getTierFromScore(currentPoints);
  const currentTierId = userStats.tier || scoreTierInfo.tierId;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      sounds.playPop();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTierConfig = TIERS_CONFIG[currentTierId] || TIERS_CONFIG.BRONZE;
  const currentIndex = TIER_ORDER.indexOf(currentTierId);
  const nextTierId = currentIndex < TIER_ORDER.length - 1 ? TIER_ORDER[currentIndex + 1] : null;
  const nextTierConfig = nextTierId ? TIERS_CONFIG[nextTierId] : null;

  const scrollHorizontally = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      sounds.playPop();
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/70 backdrop-blur-xs p-2 sm:p-4 md:p-6 flex flex-col justify-start sm:justify-center items-center select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] sm:max-h-[88vh]"
        >
          {/* 1. Modal Top Bar */}
          <div className="px-5 py-3 sm:py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/95 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-200 text-slate-800 flex items-center justify-center shadow-xs shrink-0">
                <Shield className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight">
                    티어 등급 & 문양 도감
                  </h2>
                  <span className="text-[10px] sm:text-[11px] bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full font-black">
                    8단계 승급 체계
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium hidden sm:block">
                  경쟁 랭킹전 승패 점수(RP)에 따라 부여되는 공식 티어 문양입니다.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 transition-colors cursor-pointer"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Tier Status Banner (Logged in vs Guest) */}
          <div className="px-5 py-3 bg-gradient-to-r from-slate-100 via-amber-50/50 to-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {currentUser ? (
              <>
                <div className="flex items-center gap-3.5">
                  <div className="p-1 rounded-2xl bg-white border border-slate-200 shadow-xs shrink-0">
                    <TierBadge tier={currentTierId} size="sm" showLabel={false} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">내 현재 티어</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                        {userStats.nickname}
                      </span>
                    </div>
                    <div className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
                      <span>{currentTierConfig.name}</span>
                      <span className="text-xs text-slate-400 font-mono">({currentTierConfig.englishName})</span>
                    </div>
                  </div>
                </div>

                {/* Current Score & Next Promotion progress */}
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400">보유 랭크 포인트</div>
                    <div className="text-xl sm:text-2xl font-black text-amber-600 font-mono">
                      {currentPoints} <span className="text-xs text-amber-700 font-bold">RP</span>
                    </div>
                  </div>

                  {nextTierConfig && !scoreTierInfo.isMaxTier ? (
                    <div className="hidden sm:block pl-4 border-l border-slate-200 text-left">
                      <div className="text-[11px] font-bold text-slate-400">다음 티어 승급까지</div>
                      <div className="text-xs font-black text-slate-700 flex items-center gap-1">
                        <span className="text-emerald-600">+{scoreTierInfo.pointsToNextTier} RP</span> 필요
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 inline" />
                        <span className="font-bold text-slate-900">{nextTierConfig.name}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="hidden sm:block pl-4 border-l border-slate-200 text-left">
                      <div className="text-[11px] font-bold text-slate-400">현재 상태</div>
                      <div className="text-xs font-black text-rose-600 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> 최고 등급 달성
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between w-full flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <span>경쟁 랭킹전 티어 안내</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">비로그인</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      로그인 후 랭킹전에 참여하면 실력에 따라 티어 승급과 전용 문양이 부여됩니다.
                    </p>
                  </div>
                </div>

                {onOpenLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      onClose();
                      onOpenLogin();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ml-auto"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>로그인하고 티어 획득하기</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 3. Horizontal Tier Ladder (8 Tiers side-by-side with no cut-off) */}
          <div className="relative flex-1 min-h-0 overflow-y-auto flex flex-col p-3 sm:p-5 bg-slate-50/50">
            {/* Header / Navigation Controls */}
            <div className="flex items-center justify-between mb-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span>티어 랭크 성장 경로 (브론즈 ➔ 정복자)</span>
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollHorizontally('left')}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs cursor-pointer"
                  title="왼쪽으로 스크롤"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollHorizontally('right')}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs cursor-pointer"
                  title="오른쪽으로 스크롤"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* HORIZONTAL CARDS CONTAINER */}
            <div
              ref={scrollContainerRef}
              className="flex-1 min-h-0 flex flex-row items-stretch gap-2 sm:gap-2.5 lg:gap-3 overflow-x-auto py-2 px-2 snap-x scrollbar-thin scrollbar-thumb-slate-300"
            >
              {TIER_ORDER.map((tierKey, index) => {
                const config = TIERS_CONFIG[tierKey];
                // Only mark as current tier if the user is actually logged in!
                const isCurrent = currentUser ? tierKey === currentTierId : false;

                return (
                  <div
                    key={tierKey}
                    className={`w-[130px] sm:w-[138px] md:w-[145px] lg:flex-1 lg:min-w-0 shrink-0 flex flex-col items-center justify-between text-center p-3 rounded-2xl border transition-all snap-center relative ${
                      isCurrent
                        ? 'bg-amber-50/95 border-amber-400 ring-2 ring-amber-400/50 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    {/* Header Tag inside card (Never clipped by overflow) */}
                    <div className="w-full flex items-center justify-between text-[11px] font-bold mb-1">
                      <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold">
                        {index + 1}단계
                      </span>
                      {isCurrent ? (
                        <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> 내 티어
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono truncate max-w-[55px]">
                          {config.englishName}
                        </span>
                      )}
                    </div>

                    {/* Tier Emblem SVG (size="md" fits cleanly without crowding or clipping) */}
                    <div className="my-1 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
                      <TierBadge tier={tierKey} size="md" showLabel={false} />
                    </div>

                    {/* Tier Title & Details */}
                    <div className="w-full flex flex-col items-center">
                      <div className="font-black text-slate-900 text-sm sm:text-base tracking-tight truncate w-full">
                        {config.name}
                      </div>

                      {/* Required Score Pill */}
                      <div className="mt-1 font-mono text-[11px] sm:text-xs font-black text-slate-700 bg-slate-100/90 border border-slate-200 px-1.5 py-0.5 rounded-xl whitespace-nowrap">
                        {tierKey === 'CONQUEROR' ? '230+ RP' : `${config.minScore} ~ ${config.maxScore}`}
                      </div>

                      {/* Condition / Promotion perk */}
                      <div className="mt-1 text-[10px] sm:text-[11px] font-bold text-slate-500 whitespace-nowrap leading-tight">
                        {tierKey === 'CONQUEROR'
                          ? '최상위 0.1%'
                          : `${config.pointsNeeded}RP 승급`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Modal Footer */}
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
            {onOpenRankings && (
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onClose();
                  onOpenRankings();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>명예의 전당 순위표</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="ml-auto px-5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
