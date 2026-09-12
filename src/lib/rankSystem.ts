import { TierId } from '../types';

export interface TierDetail {
  id: TierId;
  name: string;
  englishName: string;
  order: number;
  minScore: number;
  maxScore: number; // For progress calculation
  pointsNeeded: number; // 30 for Bronze~Crown, 50 for Ace/Conqueror
  themeColor: string;
  accentColor: string;
  textColor: string;
  bgGradient: string;
  glowColor: string;
  lossPenaltyRange: [number, number]; // [min, max]
  description: string;
  // Bot settings
  botDelayRange: [number, number]; // in ms
  botPreferredLength: [number, number];
  botFailRate: number; // 0.0 - 1.0
}

export const TIERS_CONFIG: Record<TierId, TierDetail> = {
  BRONZE: {
    id: 'BRONZE',
    name: '브론즈',
    englishName: 'Bronze',
    order: 1,
    minScore: 0,
    maxScore: 29,
    pointsNeeded: 30,
    themeColor: '#ca8a04',
    accentColor: '#b45309',
    textColor: '#854d0e',
    bgGradient: 'from-amber-900/10 via-amber-800/5 to-amber-900/10',
    glowColor: 'rgba(180, 83, 9, 0.4)',
    lossPenaltyRange: [1, 2],
    description: '끝말잇기 신병 훈련소. 기본 단어를 익히는 단계입니다.',
    botDelayRange: [3800, 5200],
    botPreferredLength: [2, 3],
    botFailRate: 0.25,
  },
  SILVER: {
    id: 'SILVER',
    name: '실버',
    englishName: 'Silver',
    order: 2,
    minScore: 30,
    maxScore: 59,
    pointsNeeded: 30,
    themeColor: '#94a3b8',
    accentColor: '#64748b',
    textColor: '#334155',
    bgGradient: 'from-slate-300/20 via-slate-100/10 to-slate-300/20',
    glowColor: 'rgba(148, 163, 184, 0.4)',
    lossPenaltyRange: [2, 3],
    description: '기초 어휘를 탄탄히 다진 전사 단계입니다.',
    botDelayRange: [3200, 4500],
    botPreferredLength: [2, 4],
    botFailRate: 0.15,
  },
  GOLD: {
    id: 'GOLD',
    name: '골드',
    englishName: 'Gold',
    order: 3,
    minScore: 60,
    maxScore: 89,
    pointsNeeded: 30,
    themeColor: '#eab308',
    accentColor: '#ca8a04',
    textColor: '#a16207',
    bgGradient: 'from-amber-400/20 via-yellow-200/20 to-amber-500/20',
    glowColor: 'rgba(234, 179, 8, 0.5)',
    lossPenaltyRange: [3, 4],
    description: '다양한 음절과 두음법칙에 익숙해진 숙련자 단계입니다.',
    botDelayRange: [2700, 3800],
    botPreferredLength: [3, 4],
    botFailRate: 0.08,
  },
  PLATINUM: {
    id: 'PLATINUM',
    name: '플래티넘',
    englishName: 'Platinum',
    order: 4,
    minScore: 90,
    maxScore: 119,
    pointsNeeded: 30,
    themeColor: '#06b6d4',
    accentColor: '#0891b2',
    textColor: '#0e7490',
    bgGradient: 'from-cyan-400/20 via-teal-200/20 to-cyan-500/20',
    glowColor: 'rgba(6, 182, 212, 0.5)',
    lossPenaltyRange: [4, 5],
    description: '긴 단어와 공격 어휘를 자유자재로 구사하는 실력자입니다.',
    botDelayRange: [2200, 3200],
    botPreferredLength: [3, 5],
    botFailRate: 0.04,
  },
  DIAMOND: {
    id: 'DIAMOND',
    name: '다이아',
    englishName: 'Diamond',
    order: 5,
    minScore: 120,
    maxScore: 149,
    pointsNeeded: 30,
    themeColor: '#3b82f6',
    accentColor: '#1d4ed8',
    textColor: '#1e40af',
    bgGradient: 'from-blue-500/20 via-sky-300/20 to-indigo-500/20',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    lossPenaltyRange: [5, 6],
    description: '희귀 음절 방어와 날카로운 공격력을 지닌 최상위권입니다.',
    botDelayRange: [1800, 2600],
    botPreferredLength: [4, 6],
    botFailRate: 0.01,
  },
  CROWN: {
    id: 'CROWN',
    name: '크라운',
    englishName: 'Crown',
    order: 6,
    minScore: 150,
    maxScore: 179,
    pointsNeeded: 30,
    themeColor: '#f59e0b',
    accentColor: '#b45309',
    textColor: '#78350f',
    bgGradient: 'from-amber-500/25 via-rose-400/15 to-amber-600/25',
    glowColor: 'rgba(245, 158, 11, 0.7)',
    lossPenaltyRange: [6, 7],
    description: '왕관을 쓴 끝말잇기 군주. 사전에 막힘이 없습니다.',
    botDelayRange: [1400, 2100],
    botPreferredLength: [4, 7],
    botFailRate: 0.0,
  },
  ACE: {
    id: 'ACE',
    name: '에이스',
    englishName: 'Ace',
    order: 7,
    minScore: 180,
    maxScore: 229,
    pointsNeeded: 50, // 50 points needed to reach Conqueror
    themeColor: '#ef4444',
    accentColor: '#b91c1c',
    textColor: '#991b1b',
    bgGradient: 'from-red-500/25 via-orange-400/20 to-amber-500/25',
    glowColor: 'rgba(239, 68, 68, 0.75)',
    lossPenaltyRange: [7, 8],
    description: '전장을 지배하는 최정예 에이스. 50점을 쌓아야 정복자에 도달합니다.',
    botDelayRange: [1100, 1700],
    botPreferredLength: [5, 8],
    botFailRate: 0.0,
  },
  CONQUEROR: {
    id: 'CONQUEROR',
    name: '정복자',
    englishName: 'Conqueror',
    order: 8,
    minScore: 230,
    maxScore: 9999,
    pointsNeeded: 50,
    themeColor: '#dc2626',
    accentColor: '#7f1d1d',
    textColor: '#450a0a',
    bgGradient: 'from-amber-400/30 via-red-600/30 to-purple-800/30',
    glowColor: 'rgba(220, 38, 38, 0.85)',
    lossPenaltyRange: [7, 8],
    description: '끝말잇기 전장의 신. 가장 높은 곳에 오른 절대 정복자입니다.',
    botDelayRange: [800, 1300],
    botPreferredLength: [5, 9],
    botFailRate: 0.0,
  },
};

export const TIER_ORDER: TierId[] = [
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'DIAMOND',
  'CROWN',
  'ACE',
  'CONQUEROR',
];

/**
 * Get Tier Information from current Rank Points (RP)
 */
export function getTierFromScore(score: number): {
  tier: TierDetail;
  tierId: TierId;
  currentTierProgress: number; // 0 to pointsNeeded
  pointsNeeded: number;
  progressPercent: number; // 0 to 100
  pointsToNextTier: number;
  isMaxTier: boolean;
} {
  const safeScore = Math.max(0, Math.floor(score || 0));

  let currentTierId: TierId = 'BRONZE';
  if (safeScore >= 230) currentTierId = 'CONQUEROR';
  else if (safeScore >= 180) currentTierId = 'ACE';
  else if (safeScore >= 150) currentTierId = 'CROWN';
  else if (safeScore >= 120) currentTierId = 'DIAMOND';
  else if (safeScore >= 90) currentTierId = 'PLATINUM';
  else if (safeScore >= 60) currentTierId = 'GOLD';
  else if (safeScore >= 30) currentTierId = 'SILVER';
  else currentTierId = 'BRONZE';

  const tier = TIERS_CONFIG[currentTierId];
  const isMaxTier = currentTierId === 'CONQUEROR';

  let currentTierProgress = safeScore - tier.minScore;
  let pointsNeeded = tier.pointsNeeded;

  if (isMaxTier) {
    currentTierProgress = safeScore - 230;
    pointsNeeded = 50;
  }

  const progressPercent = Math.min(100, Math.max(0, (currentTierProgress / pointsNeeded) * 100));
  const pointsToNextTier = isMaxTier ? 0 : Math.max(0, pointsNeeded - currentTierProgress);

  return {
    tier,
    tierId: currentTierId,
    currentTierProgress,
    pointsNeeded,
    progressPercent,
    pointsToNextTier,
    isMaxTier,
  };
}

export interface MatchScoreMetrics {
  wordCount: number;
  maxWordLength: number;
  matchScore: number;
  wonRounds: number;
}

export function isTierPromotion(oldTier: TierId, newTier: TierId): boolean {
  return TIERS_CONFIG[newTier].order > TIERS_CONFIG[oldTier].order;
}

/**
 * Calculate RP point change on match finish.
 * Rules requested by user:
 * - 한판당 점수따라 1점에서 8점 오름
 * - 지면 깍임, 티어 올라갈수록 더 많이 깍임
 */
export function calculateRankPointChange(
  arg1: boolean | number,
  arg2: boolean | number,
  arg3?: any,
  arg4?: any
): {
  pointChange: number;
  pointsDelta: number;
  newScore: number;
  newPoints: number;
  oldTier: TierId;
  previousTier: TierId;
  newTier: TierId;
  isPromotion: boolean;
  promoted: boolean;
  isDemotion: boolean;
  reason: string;
} {
  let isWin = false;
  let currentScore = 0;
  let metrics: Partial<MatchScoreMetrics> = {};

  if (typeof arg1 === 'boolean') {
    isWin = arg1;
    currentScore = typeof arg2 === 'number' ? arg2 : 0;
    metrics = arg3 || {};
  } else {
    currentScore = typeof arg1 === 'number' ? arg1 : 0;
    isWin = !!arg2;
    if (typeof arg3 === 'number') {
      metrics = { matchScore: arg3 };
    } else if (typeof arg3 === 'object' && arg3 !== null) {
      metrics = arg3;
    }
  }

  const { tierId: oldTier, tier: oldTierConfig } = getTierFromScore(currentScore);

  let pointChange = 0;
  let reason = '';

  if (isWin) {
    // 1 to 8 points based on match performance
    let pts = 4; // Base win points

    // Bonus for high word count
    if ((metrics.wordCount || 0) >= 6) pts += 2;
    else if ((metrics.wordCount || 0) >= 3) pts += 1;

    // Bonus for long words used
    if ((metrics.maxWordLength || 0) >= 5) pts += 1;

    // Bonus for match score dominance
    if ((metrics.matchScore || 0) >= 500) pts += 2;
    else if ((metrics.matchScore || 0) >= 200) pts += 1;

    // Clamp between 1 and 8 points as requested by user
    pointChange = Math.min(8, Math.max(1, pts));
    reason = `승리 보너스 (+${pointChange} RP)`;
  } else {
    // Loss deduction scales heavier as tier increases
    const [minPen, maxPen] = oldTierConfig.lossPenaltyRange;
    const pen = Math.floor(minPen + Math.random() * (maxPen - minPen + 1));
    pointChange = -Math.min(9, Math.max(1, pen));
    reason = `패배 감점 (${pointChange} RP)`;
  }

  const newScore = Math.max(0, currentScore + pointChange);
  const { tierId: newTier } = getTierFromScore(newScore);

  const oldOrder = TIERS_CONFIG[oldTier].order;
  const newOrder = TIERS_CONFIG[newTier].order;

  const isPromotion = newOrder > oldOrder;
  const isDemotion = newOrder < oldOrder;

  return {
    pointChange,
    pointsDelta: pointChange,
    newScore,
    newPoints: newScore,
    oldTier,
    previousTier: oldTier,
    newTier,
    isPromotion,
    promoted: isPromotion,
    isDemotion,
    reason,
  };
}

/**
 * AI Bot Profiles per Tier
 */
export interface BotProfile {
  name: string;
  avatarColor: string;
  level: number;
  tier: TierId;
  rp: number;
}

const BOT_NAMES_BY_TIER: Record<TierId, string[]> = {
  BRONZE: ['초보_뽀삐', '배린이_두더지', '단어꿈나무', '브론즈탈출러', '병아리말장인'],
  SILVER: ['실버돌격대', '말꼬리잡이', '책읽는곰', '글자사냥꾼', '골드지망생'],
  GOLD: ['황금말장인', '골드독수리', '어휘마니아', '끝말도사', '사전탐험가'],
  PLATINUM: ['백금수호자', '국어국문학도', '단어폭격기', '플래티넘단어왕', '날카로운글귀'],
  DIAMOND: ['다이아몬드_칼날', '사전암기봇', '끝판왕_포식자', '어휘분석관', '무패의수호신'],
  CROWN: ['크라운_지배자', '언어의연금술사', '사전통달자', '단어황제', '불멸의사서'],
  ACE: ['에이스_불사조', '그랜드마스터_K', '절대무적_어휘신', '전설의승부사', '사전그자체'],
  CONQUEROR: ['정복자_전설', '절대패왕', '갓종대왕', '천상계_지존', '끝말잇기_신'],
};

const BOT_COLORS = ['blue', 'red', 'purple', 'emerald', 'yellow', 'orange', 'cyan'];

export function generateBotForTier(targetTier: TierId): BotProfile {
  const names = BOT_NAMES_BY_TIER[targetTier] || BOT_NAMES_BY_TIER.BRONZE;
  const name = names[Math.floor(Math.random() * names.length)];
  const avatarColor = BOT_COLORS[Math.floor(Math.random() * BOT_COLORS.length)];
  const tierConfig = TIERS_CONFIG[targetTier];

  const minRP = tierConfig.minScore;
  const maxRP = tierConfig.id === 'CONQUEROR' ? 300 : tierConfig.maxScore;
  const rp = Math.floor(minRP + Math.random() * (maxRP - minRP + 1));
  const level = tierConfig.order * 5 + Math.floor(Math.random() * 5);

  return {
    name,
    avatarColor,
    level,
    tier: targetTier,
    rp,
  };
}
