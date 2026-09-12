import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Medal, Award, Search, X, User, Crown, Shield, Flame, Zap, LogIn } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { UserStats, RankLeaderboardEntry, TierId } from '../types';
import { TierBadge } from './TierBadge';
import { TIERS_CONFIG, getTierFromScore } from '../lib/rankSystem';
import { fetchTopRankings } from '../lib/firebaseClient';
import { sounds } from '../lib/soundEffects';

interface RankingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  currentUser?: FirebaseUser | null;
  onOpenLogin?: () => void;
}

export const RankingsModal: React.FC<RankingsModalProps> = ({
  isOpen,
  onClose,
  userStats,
  currentUser,
  onOpenLogin,
}) => {
  const [leaderboard, setLeaderboard] = useState<RankLeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'TIER' | 'TOP'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { tier: myTierConfig, tierId: myTierId } = getTierFromScore(userStats.rankPoints || 0);

  useEffect(() => {
    if (!isOpen) return;

    sounds.playPop();
    setIsLoading(true);

    const loadData = async () => {
      try {
        const cloudRankings = await fetchTopRankings();
        const map = new Map<string, RankLeaderboardEntry>();

        // Add real registered cloud players from Firestore
        cloudRankings.forEach((p) => {
          map.set(p.userId || p.nickname, {
            ...p,
            isCurrentUser: !!(currentUser && (p.userId === currentUser.uid)),
          });
        });

        // Add current user ONLY if authenticated (logged in)
        if (currentUser) {
          const myId = currentUser.uid;
          const existing = map.get(myId);
          if (existing) {
            existing.isCurrentUser = true;
          } else {
            const myRp = userStats.rankPoints || 0;
            const myWinRate =
              (userStats.rankedGames || 0) > 0
                ? Math.round(((userStats.rankedWins || 0) / userStats.rankedGames) * 1000) / 10
                : 0;

            map.set(myId, {
              rank: 0,
              userId: myId,
              nickname: userStats.nickname,
              avatarColor: userStats.avatarColor || 'emerald',
              tier: myTierId,
              rankPoints: myRp,
              rankedGames: userStats.rankedGames || 0,
              rankedWins: userStats.rankedWins || 0,
              winRate: myWinRate,
              isCurrentUser: true,
            });
          }
        }
        // NOTE: If currentUser is null/undefined (guest/unauthenticated),
        // we DO NOT add them to the leaderboard at all!

        // Sort all players by rankPoints descending
        const sorted = Array.from(map.values()).sort((a, b) => b.rankPoints - a.rankPoints);
        sorted.forEach((item, idx) => {
          item.rank = idx + 1;
        });

        setLeaderboard(sorted);
      } catch (err) {
        console.error('Failed to load rankings:', err);
        if (currentUser) {
          const myRp = userStats.rankPoints || 0;
          setLeaderboard([
            {
              rank: 1,
              userId: currentUser.uid,
              nickname: userStats.nickname,
              avatarColor: userStats.avatarColor || 'emerald',
              tier: myTierId,
              rankPoints: myRp,
              rankedGames: userStats.rankedGames || 0,
              rankedWins: userStats.rankedWins || 0,
              winRate: 0,
              isCurrentUser: true,
            },
          ]);
        } else {
          setLeaderboard([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isOpen, userStats, myTierId, currentUser]);

  if (!isOpen) return null;

  // Filter list
  const filteredList = leaderboard.filter((entry) => {
    if (searchQuery.trim()) {
      return entry.nickname.toLowerCase().includes(searchQuery.trim().toLowerCase());
    }

    if (activeTab === 'TIER') {
      return entry.tier === myTierId;
    }

    if (activeTab === 'TOP') {
      return entry.tier === 'ACE' || entry.tier === 'CONQUEROR' || entry.tier === 'CROWN';
    }

    return true;
  });

  const myEntry = leaderboard.find((item) => item.isCurrentUser);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700 flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-inner">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                  명예의 전당 <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">시즌 1</span>
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  실시간 랭킹전 레이팅 순위표 및 티어 순위
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs & Search Bar */}
          <div className="px-6 py-3 bg-slate-800/50 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'ALL'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                전체 순위
              </button>
              <button
                onClick={() => setActiveTab('TIER')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'TIER'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                내 리그 ({myTierConfig.name})
              </button>
              <button
                onClick={() => setActiveTab('TOP')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'TOP'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-red-400" />
                천상계 (크라운 이상)
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-48">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="플레이어 검색..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Leaderboard Table List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 p-2 sm:p-4">
            {isLoading ? (
              <div className="py-16 text-center text-slate-400 text-xs font-bold">
                순위 데이터를 불러오는 중입니다...
              </div>
            ) : filteredList.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs font-bold">
                조건에 맞는 플레이어가 없습니다.
              </div>
            ) : (
              filteredList.map((entry) => {
                const tierInfo = TIERS_CONFIG[entry.tier] || TIERS_CONFIG.BRONZE;
                const isTop3 = entry.rank <= 3;

                return (
                  <div
                    key={entry.userId + entry.nickname}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                      entry.isCurrentUser
                        ? 'bg-amber-500/10 border border-amber-500/30'
                        : 'hover:bg-slate-800/60'
                    }`}
                  >
                    {/* Rank Number & Medal */}
                    <div className="flex items-center gap-3 min-w-[70px]">
                      <div className="w-7 flex items-center justify-center font-black">
                        {entry.rank === 1 ? (
                          <div className="w-7 h-7 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center text-xs shadow-md shadow-yellow-500/30">
                            🥇
                          </div>
                        ) : entry.rank === 2 ? (
                          <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-950 flex items-center justify-center text-xs shadow-md">
                            🥈
                          </div>
                        ) : entry.rank === 3 ? (
                          <div className="w-7 h-7 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs shadow-md">
                            🥉
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-bold">
                            #{entry.rank}
                          </span>
                        )}
                      </div>

                      {/* Tier Badge Icon */}
                      <TierBadge tier={entry.tier} size="xs" />
                    </div>

                    {/* Nickname & Tier Name */}
                    <div className="flex-1 px-3 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-black text-white truncate">
                          {entry.nickname}
                        </span>
                        {entry.isCurrentUser && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black shrink-0">
                            나
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-bold flex items-center gap-2 mt-0.5">
                        <span style={{ color: tierInfo.themeColor }}>
                          {tierInfo.name}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">
                          {entry.rankedWins}승 / {entry.rankedGames}전 ({entry.winRate}%)
                        </span>
                      </div>
                    </div>

                    {/* RP Score */}
                    <div className="text-right">
                      <div className="text-sm sm:text-base font-black text-amber-300 font-mono">
                        {entry.rankPoints} <span className="text-xs text-slate-400 font-normal">RP</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sticky My Rank Footer */}
          {currentUser ? (
            myEntry ? (
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-black">
                    #{myEntry.rank}
                  </div>
                  <div className="flex items-center gap-2">
                    <TierBadge tier={myTierId} size="xs" />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {userStats.nickname} <span className="text-slate-400 text-[10px]">(내 순위)</span>
                      </div>
                      <div className="text-[11px] text-amber-400 font-black">
                        {myTierConfig.name} • {myEntry.rankPoints} RP
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] font-bold text-slate-400">
                  승률 <span className="text-white">{myEntry.winRate}%</span> ({myEntry.rankedWins}승 {Math.max(0, myEntry.rankedGames - myEntry.rankedWins)}패)
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>랭킹전에 참가하여 첫 승을 거두고 명예의 전당 순위를 획득하세요!</span>
              </div>
            )
          ) : (
            <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                <span>로그인 후 랭킹전에 참여하시면 명예의 전당에 내 티어와 랭킹이 실시간 등재됩니다.</span>
              </div>
              {onOpenLogin && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    onClose();
                    onOpenLogin();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shrink-0 cursor-pointer transition-all flex items-center gap-1.5 ml-auto"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>로그인</span>
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
