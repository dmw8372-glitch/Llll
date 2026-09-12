import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  MessageCircle,
  AlertCircle,
  Volume2,
  VolumeX,
  Sparkles,
  LogOut,
  Trophy,
  X,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { GameRoom, Player, ChatMessage, WordChainItem, LiveTypingPayload } from '../types';
import { MascotAvatar } from './MascotAvatar';
import { validateWordRules, getValidStartingChars } from '../lib/hangulRules';
import { checkWordInDictionary, prefetchWordInDictionary, getCachedWordInfo, DICTIONARY_DATABASE } from '../lib/dictionaryData';
import { sounds } from '../lib/soundEffects';
import { TierBadge } from './TierBadge';
import { getRankedBotMove } from '../lib/rankedAiBot';

interface GameViewProps {
  room: GameRoom;
  currentPlayerId: string;
  chatMessages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onSubmitWord: (
    word: string,
    isDueum: boolean,
    matchedChar: string,
    definition?: string,
    pos?: string,
    isEasterEgg?: boolean
  ) => void;
  onTypingWord?: (payload: LiveTypingPayload | null) => void;
  onPlayerTimeout: (playerId: string) => void;
  onLeaveRoom: () => void;
}

export const GameView: React.FC<GameViewProps> = ({
  room,
  currentPlayerId,
  chatMessages,
  onSendMessage,
  onSubmitWord,
  onTypingWord,
  onPlayerTimeout,
  onLeaveRoom,
}) => {
  const [inputText, setInputText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Floating circular chat state (Default is collapsed / closed)
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const [latestChatToast, setLatestChatToast] = useState<{ id: string; sender: string; text: string } | null>(null);
  const lastChatCountRef = useRef<number>(chatMessages.length);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Time tracking for disappearing previous words (words fade out after 8 seconds)
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Chat message notifications & unread counter
  useEffect(() => {
    if (chatMessages.length > lastChatCountRef.current) {
      const latest = chatMessages[chatMessages.length - 1];
      if (latest && latest.text) {
        setLatestChatToast({
          id: latest.id,
          sender: latest.senderName,
          text: latest.text,
        });

        if (toastTimerRef.current) {
          clearTimeout(toastTimerRef.current);
        }
        toastTimerRef.current = setTimeout(() => {
          setLatestChatToast(null);
        }, 4000);
      }

      if (!chatOpen) {
        setUnreadCount((prev) => prev + (chatMessages.length - lastChatCountRef.current));
      }
    }
    lastChatCountRef.current = chatMessages.length;

    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTop = chatScrollContainerRef.current.scrollHeight;
    }
  }, [chatMessages, chatOpen]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Dynamic Turn Duration: Starts at 15.0s, reduces by 0.3s per word in chain, min 5.0s
  const currentChainLength = room.wordChain ? room.wordChain.length : 0;
  const maxTurnDuration = Math.max(5.0, Number((15.0 - currentChainLength * 0.3).toFixed(1)));

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<number>(maxTurnDuration);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSubmittingRef = useRef<boolean>(false);
  const isComposingRef = useRef<boolean>(false);

  // Active player identification
  const activePlayer = room.currentPlayers[room.currentTurnIndex];
  const isMyTurn = activePlayer?.id === currentPlayerId && activePlayer?.isAlive;

  // Start game BGM on mount
  useEffect(() => {
    sounds.startBGM('game');
  }, []);

  // Realtime background dictionary prefetch while typing
  useEffect(() => {
    const checkAndPrefetch = () => {
      const liveVal = (inputRef.current?.value || inputText).trim();
      if (liveVal.length >= 2) {
        prefetchWordInDictionary(liveVal);
      }
    };

    checkAndPrefetch();
    const intervalId = setInterval(checkAndPrefetch, 500);
    return () => clearInterval(intervalId);
  }, [inputText]);

  // Focus input when my turn starts
  useEffect(() => {
    if (isMyTurn) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isMyTurn, room.currentTurnIndex]);

  // Automated bot turn logic (Host executes for bot players)
  useEffect(() => {
    if (!activePlayer || !activePlayer.id.startsWith('bot_') || !activePlayer.isAlive) {
      return;
    }
    if (room.hostId !== currentPlayerId) {
      return;
    }

    // Determine delay based on ranked mode tier or standard delay
    let botDelay = Math.max(1000, Math.min(maxTurnDuration * 0.45 * 1000, 2800));
    if (room.mode === 'RANKED') {
      const tier = room.targetTier || activePlayer.tier || 'BRONZE';
      const tierDelays: Record<string, number> = {
        BRONZE: 2100,
        SILVER: 1800,
        GOLD: 1500,
        PLATINUM: 1300,
        DIAMOND: 1100,
        CROWN: 950,
        ACE: 850,
        CONQUEROR: 750,
      };
      botDelay = Math.min(tierDelays[tier] || 1600, maxTurnDuration * 0.7 * 1000);
    }

    const botTimer = setTimeout(() => {
      // 1. If Ranked Mode, use high-fidelity Tier AI logic
      if (room.mode === 'RANKED') {
        const targetTier = room.targetTier || activePlayer.tier || 'BRONZE';
        const rankedMove = getRankedBotMove(room.lastWord, room.starterChar, room.usedWords, targetTier);

        if (rankedMove.shouldFail || !rankedMove.word) {
          // Bot is configured to timeout at lower tiers, simulating human error
          return;
        }

        const ruleRes = validateWordRules(rankedMove.word, room.lastWord, room.usedWords);
        if (ruleRes.valid) {
          sounds.playCorrect();
          onSubmitWord(
            rankedMove.word,
            ruleRes.isDueum ?? false,
            ruleRes.matchedChar ?? rankedMove.word[0],
            rankedMove.meaning,
            rankedMove.pos
          );
        }
        return;
      }

      // 2. Standard Casual Bot
      const lastChar = room.lastWord
        ? room.lastWord[room.lastWord.length - 1]
        : room.starterChar || null;
      const validChars = lastChar ? getValidStartingChars(lastChar) : [];

      let candidate: any = null;
      if (!lastChar) {
        const starters = DICTIONARY_DATABASE.filter((w) => w.word.length >= 2);
        candidate = starters[Math.floor(Math.random() * starters.length)];
      } else {
        const available = DICTIONARY_DATABASE.filter(
          (w) =>
            w.word.length >= 2 &&
            validChars.includes(w.word[0]) &&
            !room.usedWords.includes(w.word)
        );
        if (available.length > 0) {
          candidate = available[Math.floor(Math.random() * available.length)];
        } else {
          const endings = ['박', '수', '도', '기', '과', '원', '문', '리', '화', '산', '물'];
          const randEnd = endings[Math.floor(Math.random() * endings.length)];
          candidate = {
            word: `${validChars[0]}${randEnd}`,
            meaning: '국립국어원 표준어',
            pos: '명사',
          };
        }
      }

      if (candidate) {
        const ruleRes = validateWordRules(candidate.word, room.lastWord, room.usedWords);
        if (ruleRes.valid) {
          sounds.playCorrect();
          onSubmitWord(
            candidate.word,
            ruleRes.isDueum ?? false,
            ruleRes.matchedChar ?? candidate.word[0],
            candidate.meaning,
            candidate.pos
          );
        }
      }
    }, botDelay);

    return () => clearTimeout(botTimer);
  }, [room.currentTurnIndex, activePlayer?.id, room.hostId, currentPlayerId, maxTurnDuration, room.mode, room.targetTier]);

  // Turn Countdown Timer
  useEffect(() => {
    setTimeLeft(maxTurnDuration);
    setValidationError(null);

    if (timerRef.current) clearInterval(timerRef.current);

    const startTime = Date.now();
    const durationMs = maxTurnDuration * 1000;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, (durationMs - elapsed) / 1000);
      setTimeLeft(remaining);

      if (remaining <= Math.min(2.5, maxTurnDuration * 0.3) && remaining > 0) {
        sounds.playTick(true);
      }

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        if (activePlayer && activePlayer.isAlive && (isMyTurn || room.hostId === currentPlayerId)) {
          sounds.playWrong();
          onPlayerTimeout(activePlayer.id);
        }
      }
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [room.currentTurnIndex, activePlayer?.id, currentChainLength, maxTurnDuration]);

  // Cache ref for instant pre-validated submits
  const preValidatedWordRef = useRef<{
    word: string;
    dictRes: { isValid: boolean; wordInfo?: any; reason?: string };
    ruleRes: { valid: boolean; isDueum?: boolean; matchedChar?: string; reason?: string };
  } | null>(null);

  // Realtime typing sync
  const handleLiveTyping = (rawVal: string) => {
    const cleanVal = rawVal.trim();
    if (cleanVal.length === 0) {
      preValidatedWordRef.current = null;
      if (isMyTurn) onTypingWord?.(null);
      return;
    }

    prefetchWordInDictionary(cleanVal);
    const ruleRes = validateWordRules(cleanVal, room.lastWord, room.usedWords);
    const cached = getCachedWordInfo(cleanVal);

    if (cached && cached.isValid) {
      preValidatedWordRef.current = {
        word: cleanVal,
        dictRes: cached,
        ruleRes,
      };
    } else if (cleanVal.length >= 2 && ruleRes.valid) {
      checkWordInDictionary(cleanVal)
        .then((res) => {
          const latestInput = (inputRef.current?.value || inputText).trim();
          if (latestInput === cleanVal) {
            preValidatedWordRef.current = {
              word: cleanVal,
              dictRes: res,
              ruleRes,
            };
          }
        })
        .catch(() => {});
    }

    if (isMyTurn) {
      onTypingWord?.({
        playerId: currentPlayerId,
        word: cleanVal,
        isDueum: ruleRes.isDueum,
        matchedChar: ruleRes.matchedChar,
        timestamp: Date.now(),
      });
    }
  };

  // Word submission logic (Allows typing anytime, but enforces that submission only occurs on my turn)
  const processSubmit = async (wordToSubmit?: string) => {
    const rawWord = typeof wordToSubmit === 'string' ? wordToSubmit : (inputRef.current?.value || inputText);
    const trimmed = rawWord.trim();

    if (!isMyTurn) {
      sounds.playWrong();
      setValidationError('아직 내 차례가 아닙니다! 내 차례가 되면 바로 전송할 수 있습니다.');
      return;
    }

    if (isSubmittingRef.current || !trimmed) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setValidationError(null);

    try {
      const ruleRes = validateWordRules(trimmed, room.lastWord, room.usedWords);
      if (!ruleRes.valid) {
        sounds.playWrong();
        setValidationError(ruleRes.reason || '규칙에 맞지 않는 단어입니다.');
        return;
      }

      let dictRes: { isValid: boolean; wordInfo?: any; reason?: string } | undefined;

      if (preValidatedWordRef.current && preValidatedWordRef.current.word === trimmed) {
        dictRes = preValidatedWordRef.current.dictRes;
      }

      if (!dictRes || !dictRes.isValid) {
        const cached = getCachedWordInfo(trimmed);
        if (cached && cached.isValid) {
          dictRes = cached;
        }
      }

      if (!dictRes) {
        dictRes = await checkWordInDictionary(trimmed);
      }

      if (!dictRes.isValid) {
        sounds.playWrong();
        setValidationError(dictRes.reason || '사전에 등재되지 않은 단어입니다.');
        return;
      }

      preValidatedWordRef.current = null;
      onTypingWord?.(null);

      sounds.playCorrect();
      onSubmitWord(
        trimmed,
        ruleRes.isDueum ?? false,
        ruleRes.matchedChar ?? trimmed[0],
        dictRes.wordInfo?.meaning,
        dictRes.wordInfo?.pos,
        dictRes.wordInfo?.isEasterEgg
      );

      setInputText('');
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processSubmit();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const currentVal = (e.currentTarget.value || inputText).trim();
      if (currentVal) {
        processSubmit(currentVal);
      }
    }
  };

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    onSendMessage(text);
    setChatInput('');
  };

  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  };

  // Calculate valid starting characters for display
  const lastChar = room.lastWord
    ? room.lastWord[room.lastWord.length - 1]
    : room.starterChar || null;
  const validChars = lastChar ? getValidStartingChars(lastChar) : [];
  const hasDueum = validChars.length > 1;

  // Sound toggling
  const [isSoundMuted, setIsSoundMuted] = useState(sounds.getIsMuted());
  const toggleSound = () => {
    const next = !isSoundMuted;
    setIsSoundMuted(next);
    sounds.setMuted(next);
  };

  // Previous words handling:
  // 1) Latest word search message (shown like a message with full definition, disappears after 8s)
  const wordChain = room.wordChain || [];
  const latestWordItem = wordChain.length > 0 ? wordChain[wordChain.length - 1] : null;
  const isLatestRecent = latestWordItem ? currentTime - (latestWordItem.timestamp || currentTime) < 8000 : false;

  // 2) Passed words (small compact badges, only words within last 8s, older words disappear)
  const previousWords = wordChain.length > 1 ? wordChain.slice(0, -1) : [];
  const recentPassedWords = previousWords.filter(
    (item) => currentTime - (item.timestamp || currentTime) < 8000
  );

  // Preceding word (just before the latest word in chain) for IMG_0990.jpeg display
  const previousWordItem = wordChain.length > 1 ? wordChain[wordChain.length - 2] : null;

  // Helper to extract pos short form ('명', '구', '동', etc.)
  const getPosShort = (pos?: string) => {
    if (!pos) return '명';
    const clean = pos.trim();
    if (clean.includes('명사')) return '명';
    if (clean.includes('어구') || clean.includes('구')) return '구';
    if (clean.includes('동사')) return '동';
    if (clean.includes('형용사')) return '형';
    if (clean.includes('부사')) return '부';
    if (clean.includes('감탄사')) return '감';
    if (clean.includes('수사')) return '수';
    if (clean.includes('관형사')) return '관';
    return clean.charAt(0) || '명';
  };

  // Helper to render definition with blue category 《...》 tag matching IMG_0990.jpeg
  const renderDefinitionWithCategory = (def: string, pos?: string) => {
    if (!def) {
      return (
        <span className="text-slate-700">국립국어원 표준국어대사전 및 우리말샘 등재 어휘.</span>
      );
    }

    const match = def.match(/^(\s*《[^》]+》)(.*)$/);
    if (match) {
      return (
        <span className="text-slate-800">
          <span className="text-sky-600 font-bold mr-1">{match[1].trim()}</span>
          <span>{match[2].trim()}</span>
        </span>
      );
    }

    const category = pos || '표준어';
    return (
      <span className="text-slate-800">
        <span className="text-sky-600 font-bold mr-1">《{category}》</span>
        <span>{def}</span>
      </span>
    );
  };

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto w-full px-2 sm:px-4 relative pb-20 select-none">
      {/* 1. Top In-Game Header Bar (Clean Original Style) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2 w-full relative">
        {/* Left: Room Code & Round & Live Toast */}
        <div className="relative flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-300 px-2 sm:px-2.5 py-1 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono font-black text-sm sm:text-base text-black tracking-wider">
              {room.id}
            </span>
          </div>
          {room.mode === 'RANKED' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-900 shadow-xs">
              <TierBadge tier={room.targetTier || 'BRONZE'} size="sm" showLabel={false} />
              <span className="font-black text-xs hidden sm:inline">랭킹전</span>
            </div>
          )}
          <span className="px-2 py-0.5 rounded-full bg-black text-white font-black text-[11px] sm:text-xs">
            {room.round}/{room.totalRounds || 3}R
          </span>
          <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              생존 {room.currentPlayers.filter((p) => p.isAlive).length}/{room.currentPlayers.length}
            </span>
          </div>

          {/* Quick Floating Chat Notification Toast */}
          <AnimatePresence>
            {latestChatToast && !chatOpen && (
              <motion.div
                key={latestChatToast.id}
                initial={{ opacity: 0, y: -6, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.92 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  setChatOpen(true);
                  setUnreadCount(0);
                }}
                className="absolute top-full left-0 mt-2 z-50 flex items-center gap-2 bg-slate-900/95 text-white text-xs px-3 py-2 rounded-2xl shadow-xl border border-slate-700/80 backdrop-blur-md max-w-[280px] sm:max-w-[340px] cursor-pointer hover:bg-black transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-ping" />
                <span className="text-amber-300 font-bold shrink-0">[{latestChatToast.sender}]</span>
                <span className="truncate text-white font-medium flex-1">
                  {latestChatToast.text}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center: Round History Boxes */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 mr-1">제시어:</span>
          {(room.roundHistoryWords || [room.starterChar || '수', '?', '?']).map((char, idx) => (
            <div
              key={idx}
              className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                idx + 1 === room.round
                  ? 'bg-black text-white ring-2 ring-slate-400 shadow-xs scale-105'
                  : char !== '?'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-white text-slate-400 border border-slate-200'
              }`}
            >
              {char}
            </div>
          ))}
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title={isSoundMuted ? '효과음 켜기' : '효과음 음소거'}
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              onLeaveRoom();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200/80 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
            title="방 나가기"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">나가기</span>
          </button>
        </div>
      </div>

      {/* 2. Main Arena: Word Board stays FIXED at the dead center, Definition Card is placed on the right */}
      <div className="relative w-full flex flex-col items-center justify-center min-h-[210px] sm:min-h-[235px]">
        {/* Main Word Board Window (단어치는창 - 항상 정중앙 고정, 회전 없이 얇은 줄처럼 작아졌다가 다시 부드럽게 펴짐) */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`word-stage-${room.round}-${room.wordChain.length}-${room.currentTurnIndex}`}
            initial={{
              scaleY: 0.02,
              scaleX: 0.88,
              opacity: 0.5,
            }}
            animate={{
              scaleY: 1,
              scaleX: 1,
              opacity: 1,
            }}
            exit={{
              scaleY: 0.02,
              scaleX: 0.88,
              opacity: 0.5,
              transition: {
                duration: 0.28,
                ease: [0.4, 0, 0.2, 1],
              },
            }}
            transition={{
              duration: 0.54,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              transformOrigin: 'center center',
            }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-slate-50 to-slate-100 border-2 sm:border-3 border-slate-300 shadow-md p-4 sm:p-5 flex flex-col items-center justify-center min-h-[195px] sm:min-h-[220px] w-full max-w-[480px] md:max-w-[500px] lg:max-w-xl xl:max-w-2xl text-center z-10"
          >
            {/* Passed Words Chain (Compact badges, only words within last 8s, older words disappear) */}
            <div className="flex items-center gap-1.5 mb-2 overflow-x-auto max-w-full pb-1 no-scrollbar px-2 justify-center flex-wrap min-h-[26px]">
              <AnimatePresence>
                {recentPassedWords.length === 0 ? (
                  <span className="text-[11px] sm:text-xs text-slate-400 font-semibold">
                    단어를 입력하여 끝말잇기를 이어가세요!
                  </span>
                ) : (
                  recentPassedWords.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-1 shrink-0"
                    >
                      <span className="px-2 py-0.5 rounded-lg bg-white text-slate-800 text-[11px] font-bold border border-slate-200 shadow-2xs whitespace-nowrap">
                        {item.word}
                      </span>
                      <span className="text-slate-300 text-[10px] font-black">→</span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Big Central Required Starting Character Display */}
            <div className="my-1 sm:my-2 flex flex-col items-center justify-center text-center">
              {lastChar ? (
                <div className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-normal leading-none select-none drop-shadow-xs">
                  {lastChar}
                </div>
              ) : (
                <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-snug select-none text-center">
                  첫 단어 시작
                </div>
              )}

              {/* Dueum Rule Badge */}
              {hasDueum && (
                <motion.div
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mt-2 px-3 py-1 rounded-full bg-slate-800 text-white font-extrabold text-[10px] sm:text-xs shadow-xs flex items-center gap-1 whitespace-nowrap"
                >
                  <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                  <span>두음법칙: 「{validChars.join(' / ')}」 가능</span>
                </motion.div>
              )}
            </div>

            {/* Dynamic Turn Countdown Bar */}
            <div className="w-full max-w-xl sm:max-w-2xl mt-2 sm:mt-3">
              <div className="flex justify-between items-center text-[10px] sm:text-xs font-extrabold mb-1">
                <span
                  className={`flex items-center gap-1 transition-colors ${
                    timeLeft <= Math.min(2.5, maxTurnDuration * 0.3)
                      ? 'text-rose-600 animate-pulse'
                      : 'text-slate-600'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      timeLeft <= Math.min(2.5, maxTurnDuration * 0.3)
                        ? 'bg-rose-500 animate-ping'
                        : 'bg-slate-700'
                    }`}
                  />
                  남은 시간{' '}
                  <span className="text-[9px] text-slate-400 font-normal">
                    ({maxTurnDuration.toFixed(1)}s)
                  </span>
                </span>
                <span
                  className={`font-mono text-xs sm:text-sm font-black ${
                    timeLeft <= Math.min(2.5, maxTurnDuration * 0.3)
                      ? 'text-rose-600 animate-pulse'
                      : 'text-slate-800'
                  }`}
                >
                  {timeLeft.toFixed(1)}s
                </span>
              </div>
              <div className="w-full h-2.5 sm:h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                <div
                  className={`h-full rounded-full transition-all duration-100 ${
                    timeLeft <= Math.min(2.5, maxTurnDuration * 0.3)
                      ? 'bg-rose-500 shadow-sm'
                      : 'bg-slate-800'
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(0, (timeLeft / maxTurnDuration) * 100))}%`,
                  }}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Right Side: Small Compact Word Definition Card (단어 검색 및 뜻 창 작게 배치, 중앙 단어창을 밀지 않음) */}
        <AnimatePresence>
          {latestWordItem && (
            <motion.div
              key={`def-${latestWordItem.id}`}
              initial={{ opacity: 0, scale: 0.92, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 4 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-[280px] md:max-w-none md:w-[185px] lg:w-[215px] xl:w-[245px] md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 shrink-0 flex flex-col justify-start text-left mt-2 md:mt-0 z-20"
            >
              {/* Preceding Word Chip on top-left (e.g. '이전: 함수') */}
              {previousWordItem && (
                <div className="self-start mb-1 ml-0.5">
                  <span className="px-2 py-0.5 rounded-md bg-white text-slate-700 text-[11px] font-bold border border-slate-200 shadow-2xs inline-flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-medium">이전:</span>
                    <span className="truncate max-w-[110px] lg:max-w-[130px]">{previousWordItem.word}</span>
                  </span>
                </div>
              )}

              {/* Word Definition Card (가독성을 위해 적당히 키운 크기) */}
              <div className="w-full bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
                {/* Card Header */}
                <div className="bg-[#f4f5f7] px-2.5 py-1.5 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="bg-[#3e4246] text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-tight shrink-0">
                      #{wordChain.length}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight truncate" title={latestWordItem.word}>
                      {latestWordItem.word}
                    </span>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-[#dcdfe4] text-slate-700 font-black text-[9px] flex items-center justify-center shrink-0 ml-1">
                    {getPosShort(latestWordItem.pos)}
                  </div>
                </div>

                {/* Card Definition Body with blue category 《...》 */}
                <div
                  className="p-2 sm:p-2.5 text-[11px] sm:text-xs leading-relaxed text-slate-800 overflow-y-auto max-h-[115px] sm:max-h-[135px] no-scrollbar"
                  title={latestWordItem.definition || ''}
                >
                  {renderDefinitionWithCategory(latestWordItem.definition || '', latestWordItem.pos)}
                </div>
              </div>

              {/* Bottom Copyright Caption */}
              <div className="text-[9px] text-slate-400 font-medium mt-1 flex items-center gap-0.5 self-start ml-0.5">
                <span>ⓒ</span>
                <span className="truncate">국립국어원 표준국어대사전</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Centered Mascot Characters Stage (사람 있는 화면의 외곽선 제거) */}
      <div className="rounded-2xl sm:rounded-3xl p-3 sm:p-5 w-full flex items-end justify-center">
        <div className="flex items-end justify-center gap-2.5 sm:gap-4 md:gap-6 flex-wrap w-full">
          {room.currentPlayers.map((player) => {
            const isActive = player.id === activePlayer?.id;
            const isMe = player.id === currentPlayerId;

            return (
              <div
                key={player.id}
                className="flex flex-col items-center relative flex-1 min-w-[85px] max-w-[130px]"
              >
                {/* Penalty Banner upon elimination */}
                <AnimatePresence>
                  {!player.isAlive && (
                    <motion.div
                      initial={{ y: -20, opacity: 0, scale: 1.3 }}
                      animate={{
                        y: [0, 4, 2],
                        opacity: [1, 1, 0.95],
                        rotate: [0, -6, 6, 0],
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-red-600 text-white font-black text-[9px] shadow-lg flex items-center gap-0.5 whitespace-nowrap ring-2 ring-white"
                    >
                      <span>-600pt</span>
                      <span>💤</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Speech Bubble / Latest Word or Live Typing Sync */}
                {player.isAlive && (() => {
                  const isTyping =
                    room.liveTyping &&
                    room.liveTyping.playerId === player.id &&
                    !!room.liveTyping.word;
                  const latestWord =
                    player.wordsUsed.length > 0
                      ? player.wordsUsed[player.wordsUsed.length - 1]
                      : null;

                  if (isTyping) {
                    return (
                      <div className="mb-1 px-2 py-0.5 rounded-xl bg-slate-900 text-amber-300 border border-amber-400/50 text-[10px] font-black shadow-md max-w-full truncate text-center relative flex items-center justify-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                        <span className="truncate">{room.liveTyping!.word}</span>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-900 rotate-45" />
                      </div>
                    );
                  }

                  if (latestWord) {
                    return (
                      <div className="mb-1 px-2 py-0.5 rounded-xl bg-[#1e2022] text-white text-[10px] font-bold shadow-md max-w-full truncate text-center relative animate-in fade-in zoom-in-90 duration-150">
                        {latestWord}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#1e2022] rotate-45" />
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Pedestal Top Spotlight on Active Player */}
                {isActive && player.isAlive && (
                  <motion.div
                    layoutId="activePedestalSpotlight"
                    className="absolute -top-2 w-12 sm:w-16 h-2.5 sm:h-3 bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full blur-xs shadow-lg"
                  />
                )}

                {/* Mascot Avatar */}
                <div className="relative mb-1 sm:mb-2">
                  <MascotAvatar
                    color={player.avatarColor}
                    size="sm"
                    isHost={player.isHost}
                    isAlive={player.isAlive}
                    isActiveTurn={isActive}
                    expression={player.isAlive ? (isActive ? 'happy' : 'smile') : 'sleeping'}
                  />
                </div>

                {/* Pedestal Stand with ALWAYS VISIBLE Score Display */}
                <div
                  className={`w-full rounded-xl sm:rounded-2xl p-1.5 sm:p-2 text-center transition-all relative ${
                    isActive && player.isAlive
                      ? 'bg-amber-50/90 border-2 border-black shadow-md ring-2 ring-black/15'
                      : !player.isAlive
                      ? 'bg-slate-100/90 border border-slate-200 opacity-70'
                      : 'bg-slate-50 border border-slate-200'
                  }`}
                >
                  {/* Ranked Tier Badge in Ranked Mode */}
                  {(room.mode === 'RANKED' || player.tier) && (
                    <div className="flex items-center justify-center mb-1">
                      <TierBadge tier={player.tier || room.targetTier || 'BRONZE'} size="sm" showLabel={false} />
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        player.isAlive ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                    <span className="font-extrabold text-[11px] sm:text-xs text-[#1e2022] truncate max-w-[60px] sm:max-w-[80px]">
                      {player.nickname}
                    </span>
                    {isMe && (
                      <span className="text-[8px] font-black text-white bg-black px-1 rounded shrink-0">
                        나
                      </span>
                    )}
                  </div>

                  {/* Clearly visible score badge on character card (Visible for all players at all times) */}
                  <div className="my-0.5 flex items-center justify-center gap-0.5">
                    <span
                      className={`font-mono font-black text-xs sm:text-sm ${
                        player.score < 0 ? 'text-rose-600' : 'text-slate-900'
                      }`}
                    >
                      {player.score.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500">점</span>
                  </div>

                  {!player.isAlive && (
                    <div className="text-[8px] font-bold text-slate-500 truncate mt-0.5 flex items-center justify-center gap-0.5">
                      <span>Zzz 탈락</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Centered Word Input Bar */}
      {/* Requirement: Can type even when not my turn, but sending is blocked until my turn */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-2.5 sm:p-4 flex flex-col gap-2 w-full">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onInput={(e) => {
                const val = (e.target as HTMLInputElement).value;
                handleLiveTyping(val);
              }}
              onChange={(e) => {
                const val = e.target.value;
                setInputText(val);
                if (validationError) setValidationError(null);
                handleLiveTyping(val);
              }}
              onKeyDown={handleInputKeyDown}
              onCompositionStart={() => {
                isComposingRef.current = true;
              }}
              onCompositionUpdate={(e) => {
                const val = (e.target as HTMLInputElement).value;
                handleLiveTyping(val);
              }}
              onCompositionEnd={(e) => {
                isComposingRef.current = false;
                const val = e.currentTarget.value || inputText;
                if (val) {
                  setInputText(val);
                  handleLiveTyping(val);
                }
              }}
              disabled={false}
              placeholder={
                isMyTurn
                  ? lastChar
                    ? `「${validChars.join('/')}」 시작 단어 입력 후 전송`
                    : '첫 단어를 입력하세요 (2글자 이상)'
                  : lastChar
                  ? `(미리 입력 가능) 다음 글자: 「${validChars.join('/')}」`
                  : '단어를 미리 입력해 둘 수 있습니다 (내 차례에 전송)'
              }
              className={`w-full px-3.5 py-3 sm:px-4 sm:py-3 rounded-xl border text-base font-bold transition-all focus:outline-none ${
                isMyTurn
                  ? 'bg-white border-black focus:ring-4 focus:ring-black/15 shadow-inner text-black'
                  : 'bg-slate-50 border-slate-300 text-slate-800 focus:ring-2 focus:ring-slate-300'
              }`}
            />
          </div>

          <button
            type="submit"
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={(e) => {
              e.preventDefault();
              const val = (inputRef.current?.value || inputText).trim();
              if (val) {
                processSubmit(val);
              }
            }}
            disabled={isSubmitting || !inputText.trim()}
            className={`px-4 sm:px-8 py-3 rounded-xl font-black text-sm sm:text-base transition-all flex items-center justify-center gap-1.5 shrink-0 min-w-[76px] sm:min-w-[96px] ${
              isMyTurn
                ? inputText.trim()
                  ? 'bg-black hover:bg-slate-800 text-white shadow-md active:scale-95 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300 cursor-pointer'
            }`}
            title={isMyTurn ? '단어 전송' : '내 차례 대기 중 (미리 입력 가능)'}
          >
            {isMyTurn ? (
              <>
                <Send className="w-4 h-4" />
                <span>전송</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs sm:text-sm">차례 대기</span>
              </>
            )}
          </button>
        </form>

        {/* Validation or Waiting Warning Banner */}
        {validationError && (
          <motion.div
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-xl"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{validationError}</span>
          </motion.div>
        )}
      </div>

      {/* 5. Floating Circular Chat Button at Bottom-Right */}
      {/* Requirement: Small circular button at bottom right, default is closed, clicking opens chat window */}
      <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40">
        <button
          type="button"
          onClick={() => {
            if (!chatOpen) {
              setUnreadCount(0);
            }
            setChatOpen(!chatOpen);
          }}
          className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-slate-900 hover:bg-black text-white shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform border-2 border-slate-700/60"
          title={chatOpen ? '채팅창 닫기' : '실시간 채팅 열기'}
        >
          {chatOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}

          {/* Unread badge on floating circle */}
          {unreadCount > 0 && !chatOpen && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white shadow-md animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* 6. Floating Chat Modal Popover */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-20 right-5 sm:bottom-24 sm:right-7 z-50 w-[300px] sm:w-[350px] h-[400px] max-h-[75vh] bg-white rounded-3xl border border-slate-300 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm">실시간 채팅</span>
                <span className="text-[10px] text-slate-400">({chatMessages.length})</span>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div
              ref={chatScrollContainerRef}
              className="flex-1 overflow-y-auto p-3 space-y-2 text-xs pr-1.5 min-h-0 bg-slate-50/50"
            >
              {chatMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs text-center py-10">
                  아직 채팅 메시지가 없습니다.<br />첫 메시지를 남겨보세요!
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.senderId === currentPlayerId ? 'items-end' : 'items-start'
                    }`}
                  >
                    <span className="text-[9px] text-slate-400 font-semibold mb-0.5 px-0.5">
                      {msg.senderName}
                    </span>
                    <div
                      className={`px-3 py-1.5 rounded-2xl max-w-[85%] text-xs break-words font-medium shadow-2xs ${
                        msg.senderId === currentPlayerId
                          ? 'bg-black text-white rounded-br-xs'
                          : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendChat}
              className="p-2.5 bg-white border-t border-slate-200 flex gap-1.5 shrink-0"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleChatKeyDown}
                placeholder="채팅 메시지 입력..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-black font-medium"
              />
              <button
                type="submit"
                onMouseDown={(e) => e.preventDefault()}
                className="p-2 bg-black text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title="전송"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
