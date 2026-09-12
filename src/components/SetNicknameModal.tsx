import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { User, ShieldCheck, Check, AlertCircle, RefreshCw, Lock } from 'lucide-react';
import { sounds } from '../lib/soundEffects';

interface SetNicknameModalProps {
  isOpen: boolean;
  initialNickname?: string;
  userEmail?: string;
  onConfirm: (newNickname: string) => Promise<void> | void;
}

const FORBIDDEN_WORDS = ['바보', '멍청', '시발', '씨발', '개새', '병신', '섹스', '존나', '새끼', '운영자', '어드민', '관리자'];

export const SetNicknameModal: React.FC<SetNicknameModalProps> = ({
  isOpen,
  initialNickname = '',
  userEmail,
  onConfirm,
}) => {
  const [nickname, setNickname] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // If initial nickname is a placeholder like '끝말도사' or starts with guest pattern, allow user to refine
      const cleanInit = initialNickname.replace(/^게스트\d+$/, '') || '';
      setNickname(cleanInit);
      setErrorMsg(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, initialNickname]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nickname.trim();

    if (!trimmed) {
      sounds.playWrong();
      setErrorMsg('설정하실 닉네임을 입력해주세요.');
      return;
    }

    if (trimmed.length < 2 || trimmed.length > 10) {
      sounds.playWrong();
      setErrorMsg('닉네임은 2자 이상 10자 이하이어야 합니다.');
      return;
    }

    if (!/^[a-zA-Z0-9가-힣]+$/.test(trimmed)) {
      sounds.playWrong();
      setErrorMsg('한글, 영문, 숫자만 사용할 수 있습니다. (공백 및 특수문자 불가)');
      return;
    }

    const hasBadWord = FORBIDDEN_WORDS.some((bad) => trimmed.includes(bad));
    if (hasBadWord) {
      sounds.playWrong();
      setErrorMsg('부적절한 단어가 포함되어 있습니다. 다른 닉네임을 사용해주세요.');
      return;
    }

    sounds.playPop();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onConfirm(trimmed);
      sounds.playCorrect();
    } catch (err: any) {
      console.error(err);
      sounds.playWrong();
      setErrorMsg(err.message || '닉네임 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-xs p-4 flex items-center justify-center select-none animate-in fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/25 flex items-center justify-center shadow-xs mb-3">
              <ShieldCheck className="w-7 h-7 text-amber-600" />
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                대표 닉네임 설정
              </h2>
              <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                고유 식별자
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium max-w-xs leading-relaxed">
              끝잇기 공식 랭킹 및 클라우드 계정에 영구 등록될 대표 닉네임을 설정해주세요.
            </p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {userEmail && (
              <div className="text-[11px] text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="font-semibold text-slate-600">연동 계정</span>
                <span className="font-mono text-slate-800 font-bold truncate max-w-[200px]">
                  {userEmail}
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5 flex items-center justify-between">
                <span>희망 닉네임 (2~10자)</span>
                <span className="text-[11px] font-mono text-slate-400 font-semibold">
                  {nickname.length}/10
                </span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={10}
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setErrorMsg(null);
                  }}
                  placeholder="예: 단어장인, 끝말왕"
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-black focus:bg-white transition-all"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Crucial policy notice: locked after setting */}
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed font-medium">
                <strong className="font-black text-amber-950">닉네임 변경 제한 안내:</strong>
                <br />
                랭킹전 승률, 티어 점수(RP) 및 명예의 전당 공정성 유지를 위해 설정하신 닉네임은 계정에 고유 확정되며 자유 변경이 제한됩니다.
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !nickname.trim()}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99] mt-1"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>닉네임 등록 중...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>이 닉네임으로 확정하기</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
