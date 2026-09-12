import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, LogIn, Shield, Trophy } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { UserStats } from '../types';
import { MascotAvatar } from './MascotAvatar';
import { TierBadge } from './TierBadge';
import { getTierFromScore, TIERS_CONFIG } from '../lib/rankSystem';
import { sounds } from '../lib/soundEffects';

interface HomeViewProps {
  userStats: UserStats;
  currentUser?: FirebaseUser | null;
  onOpenLogin?: () => void;
  onCreateRoom: () => void;
  onOpenPublicRooms: () => void;
  onOpenQuickJoin: () => void;
  onSelectTab: (tab: string) => void;
  onViewWordDetail?: (word: string) => void;
  onOpenNotices: () => void;
  onOpenRules: () => void;
  onStartRankedMatch: () => void;
  onOpenRankings: () => void;
  onOpenTierGuide?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  userStats,
  currentUser,
  onOpenLogin,
  onSelectTab,
  onOpenNotices,
  onOpenRules,
  onStartRankedMatch,
  onOpenRankings,
  onOpenTierGuide,
}) => {
  const currentPoints = userStats.rankPoints || 0;
  const currentTierId = userStats.tier || getTierFromScore(currentPoints);
  const tierConfig = TIERS_CONFIG[currentTierId];

  // Calculate progress in current tier
  const tierIndex = Object.keys(TIERS_CONFIG).indexOf(currentTierId);
  const nextTierId = Object.keys(TIERS_CONFIG)[tierIndex + 1];
  const nextConfig = nextTierId ? TIERS_CONFIG[nextTierId as keyof typeof TIERS_CONFIG] : null;

  const pointsIntoTier = currentPoints - tierConfig.minPoints;
  const pointsRequired = tierConfig.pointsToPromote;
  const progressPercent = nextConfig
    ? Math.min(100, Math.max(0, Math.round((pointsIntoTier / pointsRequired) * 100)))
    : 100;

  return (
    <div className="relative w-full min-h-[640px] bg-white p-2 sm:p-4 flex flex-col justify-between select-none">
      {/* 1. MAIN LAYOUT: LEFT MENUS + ENLARGED CENTER CHARACTER MASCOT */}
      <div className="w-full flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 my-auto relative z-10 py-4">
        {/* LEFT COLUMN: Feature Buttons (Expanded size, titles only) */}
        <div className="w-full lg:w-88 flex flex-col gap-3.5 z-20">
          {/* Menu 1: 랭킹전 */}
          <motion.button
            whileHover={{ scale: 1.03, x: 6 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sounds.playPop();
              onStartRankedMatch();
            }}
            className="w-full py-4.5 sm:py-5 px-6 rounded-r-3xl rounded-l-2xl bg-gradient-to-r from-[#fed7aa] via-[#ffedd5] to-[#fff7ed] text-[#7c2d12] flex items-center justify-between shadow-xs border border-orange-200 hover:shadow-md transition-all cursor-pointer text-left"
          >
            <span className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
              랭킹전
            </span>
            <span className="text-xs bg-orange-200/90 text-orange-900 px-3 py-1 rounded-full font-black">
              경쟁전
            </span>
          </motion.button>

          {/* Menu 2: 명예의 전당 */}
          <motion.button
            whileHover={{ scale: 1.03, x: 6 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sounds.playPop();
              onOpenRankings();
            }}
            className="w-full py-4.5 sm:py-5 px-6 rounded-r-3xl rounded-l-2xl bg-gradient-to-r from-[#e0e7ff] via-[#eef2ff] to-[#ffffff] text-[#312e81] flex items-center justify-between shadow-xs border border-indigo-200 hover:shadow-md transition-all cursor-pointer text-left"
          >
            <span className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
              명예의 전당
            </span>
            <span className="text-xs bg-indigo-200/90 text-indigo-900 px-3 py-1 rounded-full font-black">
              순위표
            </span>
          </motion.button>

          {/* Menu 3: 친선전 */}
          <motion.button
            whileHover={{ scale: 1.03, x: 6 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sounds.playPop();
              onSelectTab('GAME');
            }}
            className="w-full py-4.5 sm:py-5 px-6 rounded-r-3xl rounded-l-2xl bg-gradient-to-r from-[#fef08a] via-[#fef9c3] to-[#fffbeb] text-[#713f12] flex items-center justify-between shadow-xs border border-amber-200 hover:shadow-md transition-all cursor-pointer text-left"
          >
            <span className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
              친선전
            </span>
            <span className="text-xs bg-amber-200/90 text-amber-900 px-3 py-1 rounded-full font-black">
              자유 대결
            </span>
          </motion.button>

          {/* Menu 4: 낱말 사전 */}
          <motion.button
            whileHover={{ scale: 1.03, x: 6 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sounds.playPop();
              onSelectTab('DICT');
            }}
            className="w-full py-4.5 sm:py-5 px-6 rounded-r-3xl rounded-l-2xl bg-gradient-to-r from-[#f1f5f9] via-[#f8fafc] to-[#ffffff] text-[#1e293b] flex items-center justify-between shadow-xs border border-slate-200 hover:shadow-md transition-all cursor-pointer text-left"
          >
            <span className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
              낱말 사전
            </span>
            <span className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-black">
              50만 어휘
            </span>
          </motion.button>

          {/* Menu 5: 게임 규칙 */}
          <motion.button
            whileHover={{ scale: 1.03, x: 6 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sounds.playPop();
              onOpenRules();
            }}
            className="w-full py-4.5 sm:py-5 px-6 rounded-r-3xl rounded-l-2xl bg-gradient-to-r from-[#ccfbf1] via-[#e6fffa] to-[#f0fdf4] text-[#115e59] flex items-center justify-between shadow-xs border border-teal-100 hover:shadow-md transition-all cursor-pointer text-left"
          >
            <span className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
              게임 규칙
            </span>
            <span className="text-xs bg-teal-200/90 text-teal-900 px-3 py-1 rounded-full font-black">
              규칙
            </span>
          </motion.button>
        </div>

        {/* CENTER STAGE: LEFT TIER SHOWCASE + RIGHT CHARACTER MASCOT */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-14 py-4 px-2">
          {/* LEFT: Tier Showcase (왼쪽에 티어 배치) */}
          <div className="flex flex-col items-center justify-center text-center select-none">
            {currentUser ? (
              <div
                onClick={() => {
                  sounds.playPop();
                  if (onOpenTierGuide) onOpenTierGuide();
                  else onOpenRankings();
                }}
                className="flex flex-col items-center justify-center cursor-pointer group p-4 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
                title="클릭하여 티어 도감 보기"
              >
                {/* 1. 티어 표식 문양 */}
                <div className="flex flex-col items-center group-hover:scale-105 transition-transform">
                  <div className="p-1">
                    <TierBadge tier={currentTierId} size="lg" showLabel={false} />
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      {tierConfig.name}
                    </span>
                    <span className="text-xs font-black text-amber-600 font-mono bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {currentPoints} RP
                    </span>
                  </div>
                </div>

                {/* 2. 티어 승급 진행도 점수바 */}
                <div className="w-56 sm:w-64 mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>{tierConfig.name}</span>
                    <span className="text-amber-600 font-extrabold font-mono">
                      {pointsIntoTier} / {pointsRequired} RP
                    </span>
                    <span>{nextConfig ? nextConfig.name : 'MAX'}</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full shadow-2xs"
                    />
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-slate-700 transition-colors">
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span>티어 도감 & 랭킹 보기</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center p-5 rounded-3xl border border-slate-200 bg-slate-50/80 max-w-xs text-center shadow-2xs">
                <div className="w-13 h-13 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs mb-2.5">
                  <Shield className="w-6 h-6 text-amber-500" />
                </div>
                <div className="text-sm font-black text-slate-800 mb-1">
                  경쟁전 티어 시스템
                </div>
                <p className="text-[11px] text-slate-500 font-medium mb-3 leading-relaxed">
                  로그인하면 랭킹전에 참여하여 브론즈부터 정복자까지 승급할 수 있습니다.
                </p>
                <div className="flex flex-col gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      onOpenLogin?.();
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>로그인하고 티어 획득</span>
                  </button>
                  {onOpenTierGuide && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        onOpenTierGuide();
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all cursor-pointer"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>8단계 티어 도감 보기</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Character Mascot (오른쪽에 캐릭터 마스코트 배치) */}
          <div className="flex flex-col items-center justify-center text-center">
            {/* Animated Large Mascot */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative mb-3 flex flex-col items-center scale-110 sm:scale-125 md:scale-135 transform transition-transform"
            >
              <div className="p-2">
                <MascotAvatar
                  color={userStats.avatarColor || 'yellow'}
                  size="xl"
                  expression="happy"
                />
              </div>
              <div className="w-24 h-3 bg-slate-200/70 rounded-full blur-[3px] mt-1" />
            </motion.div>

            {/* Nickname display */}
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {userStats.nickname}
            </div>
            {currentUser && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full mt-1.5">
                계정 등록 플레이어
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. FOOTER INFO & CHAT ICON */}
      <div className="w-full flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="text-[11px] text-slate-400 font-medium">
          국립국어원 표준국어대사전 연동 · 배틀그라운드 티어 랭킹전
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-bold text-slate-400">
            v3.13.0
          </span>
          <button
            onClick={() => {
              sounds.playPop();
              onOpenNotices();
            }}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="고객센터 / 피드백"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
