import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserStats, RankLeaderboardEntry, TierId } from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);

// Ensure local persistence for automatic login across browser sessions
try {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('Firebase persistence setup warning:', err);
  });
} catch (e) {
  console.warn(e);
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection check on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

/**
 * Sign in using Google popup (auto-persistence enabled)
 */
export async function loginWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('로그인 창이 닫혔습니다.');
    }
    if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('로그인 요청이 취소되었습니다.');
    }
    console.error('Google Login Error:', error);
    throw error;
  }
}

/**
 * Sign in using Email and Password
 */
export async function signInWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return userCredential.user;
  } catch (error: any) {
    console.error('Email Sign-in Error:', error);
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('올바른 이메일 형식을 입력해주세요.');
    }
    if (error.code === 'auth/too-many-requests') {
      throw new Error('로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.');
    }
    if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Firebase 콘솔에서 이메일/비밀번호 로그인을 활성화해주세요. (구글 간편 로그인은 이용 가능)');
    }
    throw new Error(error.message || '이메일 로그인 중 오류가 발생했습니다.');
  }
}

/**
 * Sign up using Email and Password with initial Nickname
 */
export async function signUpWithEmail(email: string, pass: string, nickname: string): Promise<FirebaseUser> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    const user = userCredential.user;
    if (nickname && nickname.trim()) {
      await updateProfile(user, { displayName: nickname.trim() });
    }
    return user;
  } catch (error: any) {
    console.error('Email Sign-up Error:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('이미 사용 중인 이메일 주소입니다.');
    }
    if (error.code === 'auth/weak-password') {
      throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');
    }
    if (error.code === 'auth/invalid-email') {
      throw new Error('올바른 이메일 주소를 입력해주세요.');
    }
    if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Firebase 콘솔에서 이메일/비밀번호 가입을 활성화해주세요. (구글 간편 로그인은 이용 가능)');
    }
    throw new Error(error.message || '회원가입 중 오류가 발생했습니다.');
  }
}

/**
 * Sign out user
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

/**
 * Load User Profile and Stats from Firestore
 */
export async function fetchUserProfile(userId: string): Promise<UserStats | null> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserStats;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Save / sync User Profile and Stats to Firestore
 */
export async function syncUserProfile(userId: string, stats: UserStats, user?: FirebaseUser | null): Promise<void> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const rankPoints = Math.max(0, Math.floor(stats.rankPoints || 0));
    const tier = stats.tier || 'BRONZE';
    const rankedGames = Math.max(0, Math.floor(stats.rankedGames || 0));
    const rankedWins = Math.max(0, Math.floor(stats.rankedWins || 0));
    const rankedLosses = Math.max(0, Math.floor(stats.rankedLosses || 0));

    const payload = {
      id: userId,
      nickname: stats.nickname || '끝말장인',
      email: user?.email || '',
      displayName: user?.displayName || stats.nickname || '',
      photoURL: user?.photoURL || '',
      avatarColor: stats.avatarColor || 'white',
      level: Math.max(1, Math.floor(stats.level || 1)),
      exp: Math.max(0, Math.floor(stats.exp || 0)),
      score: Math.floor(typeof stats.score === 'number' && !isNaN(stats.score) ? stats.score : 1000),
      totalGames: Math.max(0, Math.floor(stats.totalGames || 0)),
      wins: Math.max(0, Math.floor(stats.wins || 0)),
      winRate: Math.max(0, Number(stats.winRate || 0)),
      highestRank: String(stats.highestRank || '-'),
      currentStreak: Math.max(0, Math.floor(stats.currentStreak || 0)),
      maxStreak: Math.max(0, Math.floor(stats.maxStreak || 0)),
      rankPoints,
      tier,
      rankedGames,
      rankedWins,
      rankedLosses,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(docRef, payload, { merge: true });

    // Also sync to public rankings document
    try {
      const rankingRef = doc(db, 'rankings', userId);
      await setDoc(rankingRef, {
        userId,
        nickname: stats.nickname || '끝말장인',
        avatarColor: stats.avatarColor || 'emerald',
        tier,
        rankPoints,
        rankedGames,
        rankedWins,
        winRate: rankedGames > 0 ? Math.round((rankedWins / rankedGames) * 1000) / 10 : 0,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn('Rankings collection sync note:', e);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch top rankings from Firestore
 */
export async function fetchTopRankings(): Promise<RankLeaderboardEntry[]> {
  const path = 'rankings';
  try {
    const q = query(collection(db, 'rankings'), orderBy('rankPoints', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    const results: RankLeaderboardEntry[] = [];
    let rankCounter = 1;

    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      results.push({
        rank: rankCounter++,
        userId: d.userId || docSnap.id,
        nickname: d.nickname || '플레이어',
        avatarColor: d.avatarColor || 'slate',
        photoURL: d.photoURL,
        tier: (d.tier as TierId) || 'BRONZE',
        rankPoints: Number(d.rankPoints || 0),
        rankedGames: Number(d.rankedGames || 0),
        rankedWins: Number(d.rankedWins || 0),
        winRate: Number(d.winRate || 0),
      });
    });

    return results;
  } catch (error) {
    console.warn('fetchTopRankings fallback:', error);
    return [];
  }
}

