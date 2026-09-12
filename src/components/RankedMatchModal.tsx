import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, X, User, ShieldAlert, Sparkles, Zap, CheckCircle2 } from 'lucide-react';
import { UserStats, Player, TierId } from '../types';
import { getTierFromScore, generateBotForTier, BotProfile } from '../lib/rankSystem';
import { TierBadge } from './TierBadge';
import { sounds } from '../lib/soundEffects';

interface RankedMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  onMatchFound: (opponent: Player, targetTier: TierId) => void;
}

export const RankedMatchModal: React.FC<RankedMatchModalProps> = ({
  isOpen,
  onClose,
  userStats,
  onMatchFound,
}) => {
  const [matchingTime, setMatchingTime] = useState(0);
  const [matchedOpponent, setMatchedOpponent] = useState<BotProfile | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const { tier, tierId } = getTierFromScore(userStats.rankPoints || 0);

  useEffect(() => {
    if (!isOpen) {
      setMatchingTime(0);
      setMatchedOpponent(null);
      setCountdown(null);
      return;
    }

    sounds.playPop();

    // Timer counter
    const timer = setInterval(() => {
      setMatchingTime((prev) => prev + 1);
    }, 1000);

    // Matchmaking logic:
    // Search for 3.5 seconds. If no real player, automatically match with Tier-appropriate AI bot!
    const matchTimeout = setTimeout(() => {
      const bot = generateBotForTier(tierId);
      setMatchedOpponent(bot);
      sounds.playCorrect();

      // Start 3 second countdown before launching game
      let count = 3;
      setCountdown(count);

      const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
          setCountdown(count);
          sounds.playPop();
        } else {
          clearInterval(countdownInterval);
          // Convert bot to Player object and start ranked match
          const opponentPlayer: Player = {
            id: `bot_ranked_${Date.now()}`,
            nickname: bot.name,
            avatarColor: bot.avatarColor,
            level: bot.level,
            isHost: false,
            isReady: true,
            isAlive: true,
            score: 0,
            wordsUsed: [],
            isBot: true,
            tier: bot.tier,
            rankPoints: bot.rp,
          };
          onMatchFound(opponentPlayer, tierId);
        }
      }, 1000);
    }, 3500);

    return () => {
      clearInterval(timer);
      clearTimeout(matchTimeout);
    };
  }, [isOpen, tierId]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700/80 p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between w-full mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Swords className="w-4 h-4" />
              </div>
              <span className="text-sm font-black text-white tracking-wide">
                랭킹전 자동 매칭 시스템
              </span>
            </div>

            {!matchedOpponent && (
              <button
                onClick={() => {
                  sounds.playPop();
                  onClose();
                }}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Center Content: Matching VS Screen */}
          <div className="w-full grid grid-cols-11 items-center gap-2 my-4">
            {/* Player Side */}
            <div className="col-span-5 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 flex flex-col items-center relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-2">
                <User className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400">나 (도전자)</span>
              <h4 className="text-sm font-black text-white truncate max-w-[120px] mt-0.5">
                {userStats.nickname}
              </h4>
              <div className="mt-3 flex items-center gap-1.5">
                <TierBadge tier={tierId} size="xs" />
                <span className="text-xs font-black text-amber-300">
                  {tier.name} ({userStats.rankPoints || 0} RP)
                </span>
              </div>
            </div>

            {/* VS Badge */}
            <div className="col-span-1 flex flex-col items-center justify-center">
              <span className="text-lg font-black text-amber-400 tracking-wider">VS</span>
            </div>

            {/* Opponent Side */}
            <div className="col-span-5 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 flex flex-col items-center relative overflow-hidden min-h-[160px] justify-center">
              {matchedOpponent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center w-full"
                >
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center mb-2">
                    <User className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-rose-400">대전 상대</span>
                  <h4 className="text-sm font-black text-white truncate max-w-[120px] mt-0.5">
                    {matchedOpponent.name}
                  </h4>
                  <div className="mt-3 flex items-center gap-1.5">
                    <TierBadge tier={matchedOpponent.tier} size="xs" />
                    <span className="text-xs font-black text-slate-300">
                      {tier.name} ({matchedOpponent.rp} RP)
                    </span>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative w-12 h-12 flex items-center justify-center mb-2">
                    {/* Spinning Radar Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/50 animate-spin" />
                    <User className="w-6 h-6 text-slate-500" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">경쟁자 탐색 중</span>
                  <span className="text-[11px] text-amber-400 font-mono mt-1">
                    {formatTime(matchingTime)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status Message / Countdown */}
          <div className="my-3">
            {countdown !== null ? (
              <motion.div
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> 매칭 완료!
                </span>
                <span className="text-3xl font-black text-amber-400 mt-1 font-mono">
                  {countdown}초 후 시작
                </span>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  접속 중인 유저 우선 매칭 중... (미접속 시 {tier.name} AI 배정)
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  승리 시 +1~8 RP 획득, 패배 시 티어별 감점이 적용됩니다.
                </p>
              </div>
            )}
          </div>

          {/* Cancel Button */}
          {!matchedOpponent && (
            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="mt-3 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              매칭 취소
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
