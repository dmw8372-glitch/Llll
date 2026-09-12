import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogIn, LogOut, CheckCircle2, ShieldCheck, Sparkles, User, AlertCircle, RefreshCw, Mail, Lock, UserPlus } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { UserStats } from '../types';
import { loginWithGoogle, signInWithEmail, signUpWithEmail, logoutUser } from '../lib/firebaseClient';
import { sounds } from '../lib/soundEffects';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FirebaseUser | null;
  userStats: UserStats;
  onLoginSuccess: (user: FirebaseUser) => void;
  onLogoutSuccess: () => void;
  promptReason?: string | null;
}

type EmailAuthMode = 'LOGIN' | 'SIGNUP';

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  userStats,
  onLoginSuccess,
  onLogoutSuccess,
  promptReason,
}) => {
  const [emailAuthMode, setEmailAuthMode] = useState<EmailAuthMode>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    sounds.playPop();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const user = await loginWithGoogle();
      sounds.playCorrect();
      onLoginSuccess(user);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '구글 로그인 중 오류가 발생했습니다.');
      sounds.playWrong();
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('이메일과 비밀번호를 모두 입력해주세요.');
      sounds.playWrong();
      return;
    }

    sounds.playPop();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const user = await signInWithEmail(email, password);
      sounds.playCorrect();
      onLoginSuccess(user);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '이메일 로그인에 실패했습니다.');
      sounds.playWrong();
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('이메일과 비밀번호를 입력해주세요.');
      sounds.playWrong();
      return;
    }
    if (password.length < 6) {
      setErrorMsg('비밀번호는 최소 6자 이상이어야 합니다.');
      sounds.playWrong();
      return;
    }

    sounds.playPop();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const nick = nickname.trim() || userStats.nickname || '끝말도사';
      const user = await signUpWithEmail(email, password, nick);
      sounds.playCorrect();
      onLoginSuccess(user);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '회원가입에 실패했습니다.');
      sounds.playWrong();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    sounds.playPop();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await logoutUser();
      onLogoutSuccess();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('로그아웃 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {currentUser ? '내 계정 관리' : '로그인 & 전적 동기화'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {currentUser ? '자동 로그인 세션이 유지되고 있습니다' : '클라우드 전적 동기화 및 랭킹전 참여'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col gap-4">
            {promptReason && !currentUser && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-amber-50 border border-amber-300/80 flex items-center gap-2.5 text-xs text-amber-950 font-bold shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{promptReason}</span>
              </motion.div>
            )}

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 font-bold"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {currentUser ? (
              /* Already Logged In View */
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border-2 border-white shadow-xs object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center font-black text-base shadow-xs">
                      {userStats.nickname.slice(0, 1)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-slate-900 text-sm truncate">
                        {userStats.nickname}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black shrink-0">
                        Lv.{userStats.level}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                      {currentUser.email || '익명 계정'}
                    </div>
                    <div className="text-[11px] text-slate-600 font-bold mt-1">
                      랭킹: <span className="font-extrabold text-amber-600 font-mono">{userStats.rankPoints || 0} RP</span> | 승률: <span className="font-extrabold text-slate-900">{userStats.winRate}%</span>
                    </div>
                  </div>
                </div>

                {/* Auto-login status badge */}
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900">
                    <span className="font-extrabold block">자동 로그인 활성화 중</span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      다음번에 재방문할 때도 별도의 로그인 없이 전적과 티어가 자동 복원됩니다.
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
                  ) : (
                    <LogOut className="w-4 h-4 text-slate-600" />
                  )}
                  <span>로그아웃 (게스트 모드로 전환)</span>
                </button>
              </div>
            ) : (
              /* Two Distinct Sections: 원클릭 간편 로그인 & 클라우드 랭킹 영구 보관 (회원가입 & 로그인) */
              <div className="flex flex-col gap-3.5">
                {/* 1. 원클릭 간편 로그인 칸 */}
                <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100/90 shadow-2xs">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">
                        원클릭 간편 로그인
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                        Google 계정으로 별도 가입 없이 1초 만에 즉시 연동
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-2xs hover:shadow-xs text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    )}
                    <span>Google 계정으로 계속하기</span>
                  </button>
                </div>

                {/* 2. 클라우드 랭킹 영구 보관 칸 (회원가입 & 로그인 버튼이 위치) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shadow-2xs shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">
                        클라우드 랭킹 영구 보관
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                        티어, 승률, 랭크 포인트 영구 저장을 위한 계정
                      </p>
                    </div>
                  </div>

                  {/* 회원가입 버튼 & 로그인 버튼 선택 영역 */}
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-200/80 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setEmailAuthMode('LOGIN');
                        setErrorMsg(null);
                      }}
                      className={`py-2 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        emailAuthMode === 'LOGIN'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>이메일 로그인</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setEmailAuthMode('SIGNUP');
                        setErrorMsg(null);
                      }}
                      className={`py-2 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        emailAuthMode === 'SIGNUP'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>회원가입</span>
                    </button>
                  </div>

                  {/* Form depending on selected mode */}
                  {emailAuthMode === 'LOGIN' ? (
                    <form onSubmit={handleEmailLogin} className="flex flex-col gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          이메일 주소
                        </label>
                        <div className="relative">
                          <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            className="w-full bg-white border border-slate-200 rounded-xl pl-8.5 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          비밀번호
                        </label>
                        <div className="relative">
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호 입력"
                            className="w-full bg-white border border-slate-200 rounded-xl pl-8.5 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-1 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-xs"
                      >
                        {isLoading ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                        ) : (
                          <LogIn className="w-3.5 h-3.5 text-white" />
                        )}
                        <span>이메일로 로그인</span>
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleEmailSignup} className="flex flex-col gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          플레이어 닉네임
                        </label>
                        <div className="relative">
                          <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            maxLength={12}
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder={userStats.nickname || '끝말도사'}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-8.5 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          이메일 주소
                        </label>
                        <div className="relative">
                          <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            className="w-full bg-white border border-slate-200 rounded-xl pl-8.5 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          비밀번호 (6자 이상)
                        </label>
                        <div className="relative">
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="6자 이상 입력"
                            className="w-full bg-white border border-slate-200 rounded-xl pl-8.5 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-1 w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-xs"
                      >
                        {isLoading ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                        ) : (
                          <UserPlus className="w-3.5 h-3.5 text-slate-950" />
                        )}
                        <span>회원가입 완료 및 로그인</span>
                      </button>
                    </form>
                  )}

                  <p className="text-[10px] text-center text-slate-400 font-medium">
                    자동 로그인 설정이 적용되어 재방문 시 세션이 유지됩니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
