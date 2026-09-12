import React, { useState, useEffect, useRef } from 'react';
import { Home, Settings, Edit2, Check, X, Shuffle, User, LogIn, Shield, ShieldCheck, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User as FirebaseUser } from 'firebase/auth';
import { UserStats } from '../types';
import { sounds } from '../lib/soundEffects';
import { TierBadge } from './TierBadge';
import { TierGuideModal } from './TierGuideModal';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userStats: UserStats;
  currentUser?: FirebaseUser | null;
  onOpenLogin: () => void;
  onUpdateUserStats?: (updated: Partial<UserStats>) => void;
  onOpenNotices: () => void;
  onOpenRules: () => void;
  onOpenLegalDoc?: (type: 'terms' | 'privacy' | 'stdict_license') => void;
  onOpenRankings?: () => void;
  onOpenTierGuide?: () => void;
}

const RANDOM_ADJECTIVES = [
  '날쌘', '용감한', '달콤한', '슬기로운', '빛나는', '포근한', '신속한',
  '엉뚱한', '당당한', '즐거운', '따뜻한', '귀여운', '멋진', '신비한',
  '총명한', '친절한', '기운찬', '씩씩한', '행복한', '재빠른',
];

const RANDOM_NOUNS = [
  '토끼', '호랑이', '다람쥐', '여우', '사자', '판다', '수달',
  '부엉이', '표범', '고양이', '강아지', '별빛', '구름', '바람',
  '마법사', '탐험가', '국어왕', '단어장인', '끝말왕', '달인',
];

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  userStats,
  currentUser,
  onOpenLogin,
  onUpdateUserStats,
  onOpenNotices,
  onOpenRules,
  onOpenRankings,
  onOpenTierGuide,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Quick Nickname Edit Modal/Popover State
  const [isEditNicknameOpen, setIsEditNicknameOpen] = useState(false);
  const [isTierGuideOpen, setIsTierGuideOpen] = useState(false);
  const [newNickname, setNewNickname] = useState(userStats.nickname);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Focus input when modal opens
  useEffect(() => {
    if (isEditNicknameOpen) {
      setNewNickname(userStats.nickname);
      setNicknameError(null);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isEditNicknameOpen, userStats.nickname]);

  // Handle outside click to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsEditNicknameOpen(false);
      }
    };
    if (isEditNicknameOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditNicknameOpen]);

  const handleRandomNickname = () => {
    sounds.playPop();
    const adj = RANDOM_ADJECTIVES[Math.floor(Math.random() * RANDOM_ADJECTIVES.length)];
    const noun = RANDOM_NOUNS[Math.floor(Math.random() * RANDOM_NOUNS.length)];
    const num = Math.floor(Math.random() * 90 + 10);
    setNewNickname(`${adj}${noun}${num}`);
    setNicknameError(null);
  };

  const handleSaveNickname = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newNickname.trim();
    if (!trimmed) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }
    if (trimmed.length < 2 || trimmed.length > 10) {
      setNicknameError('닉네임은 2자 이상 10자 이하이어야 합니다.');
      return;
    }
    if (!/^[a-zA-Z0-9가-힣]+$/.test(trimmed)) {
      setNicknameError('특수문자 및 띄어쓰기는 사용할 수 없습니다.');
      return;
    }

    sounds.playCorrect();
    if (onUpdateUserStats) {
      onUpdateUserStats({ nickname: trimmed });
    }
    setIsEditNicknameOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Left: Original Black & White Donut Logo from IMG_0962.jpeg */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playPop();
              onSelectTab('HOME');
            }}
            className="flex items-center gap-2.5 sm:gap-3 text-left cursor-pointer focus:outline-none group"
            title="끝잇기 홈으로"
          >
            {/* Black Donut Ring Icon (IMG_0962) */}
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-[5px] sm:border-[6px] border-black flex items-center justify-center group-hover:scale-105 transition-transform" />
            
            {/* Bold Black "끝잇기" Typography */}
            <span className="font-black text-xl sm:text-2xl text-black tracking-tight font-sans">
              끝잇기
            </span>
          </button>
        </div>

        {/* Right: Quick Nickname Pill + Action Buttons (홈, 공지, 규칙, 설정) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Tier Guide Quick Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sounds.playPop();
              if (onOpenTierGuide) {
                onOpenTierGuide();
              } else {
                setIsTierGuideOpen(true);
              }
            }}
            className="flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-all cursor-pointer shadow-2xs group"
            title="티어 등급 & 문양 도감 보기"
          >
            {currentUser ? (
              <>
                <TierBadge tier={userStats.tier || 'BRONZE'} size="sm" showLabel={false} />
                <span className="font-extrabold text-[11px] sm:text-xs text-slate-700 font-mono">
                  {userStats.rankPoints || 0}RP
                </span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 text-amber-600" />
                <span className="font-extrabold text-xs text-slate-700">
                  티어 도감
                </span>
              </>
            )}
          </motion.button>

          {/* Top-Right Nickname Badge with Quick Edit Button */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                sounds.playPop();
                setIsEditNicknameOpen((prev) => !prev);
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition-all cursor-pointer shadow-2xs group"
              title="클릭하여 닉네임 바로 변경하기"
            >
              <div className="relative w-5 h-5 rounded-full overflow-hidden bg-black text-white flex items-center justify-center text-[10px] font-black shrink-0">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="avatar"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-3 h-3 text-white" />
                )}
                {currentUser && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                )}
              </div>
              <span className="font-extrabold text-xs sm:text-sm text-black max-w-[85px] sm:max-w-[120px] truncate">
                {userStats.nickname}
              </span>
              {currentUser ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-black transition-colors shrink-0" />
              )}
            </motion.button>

            {/* Nickname Popover: Fixed state for logged-in, editable for guest */}
            <AnimatePresence>
              {isEditNicknameOpen && (
                <div
                  ref={modalRef}
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-300 p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm text-black">
                      {currentUser ? (
                        <>
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>계정 고유 닉네임</span>
                        </>
                      ) : (
                        <>
                          <Edit2 className="w-3.5 h-3.5 text-black" />
                          <span>게스트 닉네임 설정</span>
                        </>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditNicknameOpen(false)}
                      className="text-slate-400 hover:text-black p-1 rounded-lg cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Account / Auto-login status bar */}
                  <div className="mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      {currentUser ? (
                        <div className="text-[11px] text-emerald-800 font-bold flex items-center gap-1.5 truncate">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span className="truncate">자동로그인 유지 중</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-600 font-semibold truncate">
                          게스트 (비로그인 상태)
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 truncate">
                        {currentUser?.email || '로그인 시 전적 영구 보관'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setIsEditNicknameOpen(false);
                        onOpenLogin();
                      }}
                      className="px-2 py-1 rounded-lg bg-black hover:bg-slate-800 text-white text-[10px] font-black shrink-0 cursor-pointer transition-colors"
                    >
                      {currentUser ? '계정 관리' : '로그인'}
                    </button>
                  </div>

                  {currentUser ? (
                    /* LOGGED-IN: Nickname is LOCKED and cannot be freely changed */
                    <div className="flex flex-col gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400">현재 확정된 닉네임</span>
                          <span className="text-sm font-black text-slate-900">{userStats.nickname}</span>
                        </div>
                        <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg flex items-center gap-1">
                          <Lock className="w-3 h-3" /> 변경 제한
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed font-medium">
                        <strong className="font-black text-amber-950">공정성 및 전적 보존:</strong><br />
                        로그인 계정의 닉네임은 랭킹전 승패 점수 및 명예의 전당 보존을 위해 임의로 변경할 수 없습니다.
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsEditNicknameOpen(false)}
                        className="w-full py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        확인
                      </button>
                    </div>
                  ) : (
                    /* GUEST: Can change temporary guest nickname */
                    <form onSubmit={handleSaveNickname} className="flex flex-col gap-3">
                      <div>
                        <div className="relative flex items-center">
                          <input
                            ref={inputRef}
                            type="text"
                            maxLength={10}
                            value={newNickname}
                            onChange={(e) => {
                              setNewNickname(e.target.value);
                              setNicknameError(null);
                            }}
                            placeholder="임시 닉네임 입력 (2~10자)"
                            className="w-full pl-3 pr-9 py-2 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                          />
                          <button
                            type="button"
                            onClick={handleRandomNickname}
                            className="absolute right-2 text-slate-400 hover:text-black p-1 cursor-pointer transition-colors"
                            title="랜덤 닉네임 생성"
                          >
                            <Shuffle className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {nicknameError ? (
                          <p className="text-[11px] text-rose-600 font-bold mt-1.5">
                            {nicknameError}
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-400 font-medium mt-1.5">
                            게스트 임시 닉네임입니다. 로그인 시 고유 닉네임으로 확정됩니다.
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleRandomNickname}
                          className="flex-1 py-1.5 px-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Shuffle className="w-3 h-3" />
                          <span>랜덤</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditNicknameOpen(false)}
                          className="py-1.5 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          className="py-1.5 px-4 rounded-xl bg-black hover:bg-slate-800 text-white text-xs font-black transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>저장</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Login / User Status Button */}
          {currentUser ? (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenLogin();
              }}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="자동 로그인 중 - 계정 관리"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="hidden sm:inline">로그인됨</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenLogin();
              }}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-slate-900 bg-white hover:bg-slate-50 border-2 border-slate-300 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs group"
              title="Google 계정으로 로그인 (자동 로그인)"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-700 group-hover:text-black" />
              <span className="hidden sm:inline">로그인</span>
            </button>
          )}

          {/* Home Button (Shown when not on HOME screen) */}
          {currentTab !== 'HOME' && (
            <button
              onClick={() => {
                sounds.playPop();
                onSelectTab('HOME');
              }}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-black bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="메인 홈으로 이동"
            >
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
              <span className="hidden sm:inline">홈</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={() => {
              sounds.playPop();
              onSelectTab('SETTINGS');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              currentTab === 'SETTINGS'
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-black'
            }`}
            title="설정"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">설정</span>
          </button>
        </div>
      </div>

      {/* Tier Guide Modal (Fallback if not managed by parent) */}
      {!onOpenTierGuide && (
        <TierGuideModal
          isOpen={isTierGuideOpen}
          onClose={() => setIsTierGuideOpen(false)}
          userStats={userStats}
          currentUser={currentUser}
          onOpenLogin={onOpenLogin}
          onOpenRankings={onOpenRankings}
        />
      )}
    </header>
  );
};

