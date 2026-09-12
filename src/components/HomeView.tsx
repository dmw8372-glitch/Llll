import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { UserStats } from '../types';
import { MascotAvatar } from './MascotAvatar';
import { TierBadge } from './TierBadge';
import { getTierFromScore, TIERS_CONFIG } from '../lib/rankSystem';
import { sounds } from '../lib/soundEffects';

interface HomeViewProps {
  userStats: UserStats;
  onCreateRoom: () => void;
  onOpenPublicRooms: () => void;
  onOpenQuickJoin: () => void;
  onSelectTab: (tab: string) => void;
  onViewWordDetail?: (word: string) => void;
  onOpenNotices: () => void;
  onOpenRules: () => void;
  onStartRankedMatch: () => void;
  onOpenRankings: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  userStats,
  onSelectTab,
  onOpenNotices,
  onOpenRules,
  onStartRankedMatch,
  onOpenRankings,
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
        {/* LEFT COLUMN: Feature Buttons */}
        <div className="w-full lg:w-80 flex flex-col gap-3 z-20">
          {/* Menu 1: 랭킹전 (PUBG Tier Competitive Match) */}
          <motion.button
            whileHover={{ scale: 1.03, x: 5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sounds.playPop();
              onStartRankedMatch();
            }}
            className="w-full py-3.5 px-5 rounded-r-3xl rounded-l-2xl bg-gradient-to-r from-[#fed7aa] via-[#ffedd5] to-[#fff7ed] text-[#7c2d12] font-black text-base flex items-center justify-between shadow-xs border border-orange-200 hover:shadow-md transition-all cursor-pointer text-left"
          >
            <div>
              <div className="font-black text-slate-900 text-base">랭킹전</div>
              <div className="text-[11px] text-orange-800 font-bold">배틀그라운드 티어전</div>
            </div>
            <span className="text-[11px] bg-orange-200/80 text-orange-900 px-2.5 py-1 rounded-full font-bold">
              경쟁전
            </span>
          </motion.button>

          {/* Menu 2: 명예의 전당 (Leaderboard) */}
          <motion.button
            whileHover={{ scale: 1.03, x: 5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sounds.playPop();
              onOpenRankings();
            }}
            className="w-full py-3.5 px-5 rounded-r-3xl rounded-l-2xl bg-gradient-to-r from-[#e0e7ff] via-[#eef2ff] to-[#ffffff] text-[#312e81] font-black text-base flex items-center justify-between shadow-xs border border-indigo-200 hover:shadow-md transition-all cursor-pointer text-left"
          >
            <div>
              <div className="font-black text-slate-900 text-base">명예의 전당</div>
              <div className="text-[11px] text-indigo-700 font-bold">전체 티어 순위표</div>
            </div>
            <span className="text-[11px] bg-indigo-200/80 text-indigo-900 px-2.5 py-1 rounded-full font-bold">
              순위표
            </span>
          </motion.button>

          {/* Menu 3: 친선전 */}
          <motion.button
            whileHover={{ scale: 1.03, x: 5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sounds.playPop();
              onSelectTab('GAME');
            }}
            className="w-full py-3.5 px-5 rounded-r-3xl rounded-l-2xl bg-gradient-to-r from-[#fef08a] via-[#fef9c3] to-[#fffbeb] text-[#713f12] font-black text-base flex items-center justify-between shadow-xs border border-amber-200 hover:shadow-md transition-all cursor-pointer text-left"
          >
            <div>
              <div className="font-black text-slate-900 text-base">친선전</div>
              <div className="text-[11px] text-amber-800 font-bold">방 만들기 & 참가</div>
            </div>
            <span className="text-[11px] bg-amber-200/80 text-amber-900 px-2.5 py-1 rounded-full font-bold">
              자유 대결
            </span>
          </motion.button>

          {/* Menu 4: 낱말 사전 */}
          <motion.button
            whileHover={{ scale: 1.03, x: 5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sounds.playPop();
              onSelectTab('DICT');
            }}
            className="w-full py-3.5 px-5 rounded-r-3xl rounded-l-2xl bg-gradient-to-r from-[#f1f5f9] via-[#f8fafc] to-[#ffffff] text-[#1e293b] font-black text-base flex items-center justify-between shadow-xs border border-slate-200 hover:shadow-md transition-all cursor-pointer text-left"
          >
            <div>
              <div className="font-black text-slate-900 text-base">낱말 사전</div>
              <div className="text-[11px] text-slate-500 font-bold">국립국어원 표준국어</div>
            </div>
            <span className="text-[11px] bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full font-bold">
              50만 어휘
            </span>
          </motion.button>

          {/* Menu 5: 튜토리얼 */}
          <motion.button
            whileHover={{ scale: 1.03, x: 5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sounds.playPop();
              onOpenRules();
            }}
            className="w-full py-3.5 px-5 rounded-r-3xl rounded-l-2xl bg-gradient-to-r from-[#ccfbf1] via-[#e6fffa] to-[#f0fdf4] text-[#115e59] font-black text-base flex items-center justify-between shadow-xs border border-teal-100 hover:shadow-md transition-all cursor-pointer text-left"
          >
            <div>
              <div className="font-black text-slate-900 text-base">게임 규칙</div>
              <div className="text-[11px] text-teal-700 font-bold">두음법칙 & 감점 안내</div>
            </div>
            <span className="text-[11px] bg-teal-200/80 text-teal-900 px-2.5 py-1 rounded-full font-bold">
              규칙
            </span>
          </motion.button>
        </div>

        {/* CENTER STAGE: Enlarged Character Mascot + Tier Emblem & Score Bar (No black card box) */}
        <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
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
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            {userStats.nickname}
          </div>

          {/* Tier Emblem & Score Bar */}
          <div
            onClick={() => {
              sounds.playPop();
              onOpenRankings();
            }}
            className="flex flex-col items-center justify-center cursor-pointer group select-none"
            title="클릭하여 랭킹 순위표 보기"
          >
            {/* 1. 티어 표식 문양 */}
            <div className="flex flex-col items-center group-hover:scale-105 transition-transform">
              <div className="p-1">
                <TierBadge tier={currentTierId} size="lg" showLabel={false} />
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {tierConfig.name}
                </span>
                <span className="text-xs font-black text-amber-600 font-mono">
                  {currentPoints} RP
                </span>
              </div>
            </div>

            {/* 2. 그 밑에 점수바 */}
            <div className="w-56 sm:w-64 mt-2 space-y-1">
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
