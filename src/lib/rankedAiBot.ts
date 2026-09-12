import { TierId } from '../types';
import { TIERS_CONFIG } from './rankSystem';
import { getValidStartingChars, validateWordRules } from './hangulRules';
import { DICTIONARY_DATABASE } from './dictionaryData';
import { COMPREHENSIVE_KOREAN_WORDS } from './koreanLexiconExpanded';
import { KOREAN_LEXICON_EXPANDED } from './koreanLexicon';

export interface BotDecision {
  word: string;
  meaning: string;
  pos: string;
  delayMs: number;
  shouldFail: boolean;
}

// Combine all dictionaries for expansive word pool
const MASTER_WORD_POOL = [
  ...DICTIONARY_DATABASE,
  ...COMPREHENSIVE_KOREAN_WORDS,
  ...KOREAN_LEXICON_EXPANDED,
];

// Deduplicate words by word text
const UNIQUE_WORDS_MAP = new Map<string, { word: string; meaning: string; pos: string; length: number }>();
for (const w of MASTER_WORD_POOL) {
  if (!UNIQUE_WORDS_MAP.has(w.word) && w.word.length >= 2) {
    UNIQUE_WORDS_MAP.set(w.word, {
      word: w.word,
      meaning: w.meaning || '국립국어원 표준어',
      pos: w.pos || '명사',
      length: w.word.length,
    });
  }
}

// Group words by first character for sub-millisecond retrieval
const WORDS_BY_FIRST_CHAR = new Map<string, { word: string; meaning: string; pos: string; length: number }[]>();
for (const item of UNIQUE_WORDS_MAP.values()) {
  const char = item.word[0];
  const list = WORDS_BY_FIRST_CHAR.get(char) || [];
  list.push(item);
  WORDS_BY_FIRST_CHAR.set(char, list);
}

/**
 * Generate intelligent bot response scaled by PUBG Tier!
 */
export function getRankedBotMove(
  lastWord: string | undefined,
  starterChar: string | undefined,
  usedWords: string[],
  tierId: TierId
): BotDecision {
  const config = TIERS_CONFIG[tierId] || TIERS_CONFIG.BRONZE;

  // 1. Calculate realistic response delay according to tier
  const [minDelay, maxDelay] = config.botDelayRange;
  const delayMs = Math.floor(minDelay + Math.random() * (maxDelay - minDelay));

  // 2. Identify target starting characters (including 두음법칙)
  const targetLastChar = lastWord ? lastWord[lastWord.length - 1] : starterChar || null;
  const validChars = targetLastChar ? getValidStartingChars(targetLastChar) : [];

  // 3. Roll for intentional fail rate on lower tiers
  if (config.botFailRate > 0 && Math.random() < config.botFailRate) {
    return {
      word: '',
      meaning: '',
      pos: '',
      delayMs: delayMs + 1500, // Timeout delay
      shouldFail: true,
    };
  }

  // 4. Gather available words
  let candidates: { word: string; meaning: string; pos: string; length: number }[] = [];

  if (validChars.length === 0) {
    // Starting move of round
    candidates = Array.from(UNIQUE_WORDS_MAP.values());
  } else {
    for (const ch of validChars) {
      const list = WORDS_BY_FIRST_CHAR.get(ch) || [];
      for (const item of list) {
        if (!usedWords.includes(item.word)) {
          candidates.push(item);
        }
      }
    }
  }

  if (candidates.length === 0) {
    // Bot has no words remaining -> timeout
    return {
      word: '',
      meaning: '',
      pos: '',
      delayMs,
      shouldFail: true,
    };
  }

  // 5. Filter & Sort words according to Tier Intelligence!
  const [prefMinLen, prefMaxLen] = config.botPreferredLength;

  // Filter candidates matching preferred length
  const matchedLengthCandidates = candidates.filter(
    (c) => c.length >= prefMinLen && c.length <= prefMaxLen
  );

  let pool = matchedLengthCandidates.length > 0 ? matchedLengthCandidates : candidates;

  // High tier AI (Diamond, Crown, Ace, Conqueror) prefers longer words and offensive ending syllables
  if (config.order >= 5) {
    // Sort descending by length first
    pool.sort((a, b) => b.length - a.length);
    // Pick from the top 30% smartest/longest words
    const topSlice = pool.slice(0, Math.max(3, Math.floor(pool.length * 0.35)));
    pool = topSlice;
  } else if (config.order <= 2) {
    // Bronze & Silver pick shorter 2~3 length words
    pool = pool.filter((c) => c.length <= 3);
    if (pool.length === 0) pool = candidates;
  }

  const chosen = pool[Math.floor(Math.random() * pool.length)];

  // Validate rules just in case
  const validation = validateWordRules(chosen.word, lastWord, usedWords);
  if (!validation.valid) {
    // Try first valid from candidate list
    const validCandidate = candidates.find((c) => validateWordRules(c.word, lastWord, usedWords).valid);
    if (validCandidate) {
      return {
        word: validCandidate.word,
        meaning: validCandidate.meaning,
        pos: validCandidate.pos,
        delayMs,
        shouldFail: false,
      };
    }
    return {
      word: '',
      meaning: '',
      pos: '',
      delayMs,
      shouldFail: true,
    };
  }

  return {
    word: chosen.word,
    meaning: chosen.meaning,
    pos: chosen.pos,
    delayMs,
    shouldFail: false,
  };
}
