import { LeaderboardEntry } from '../types';

const LEADERBOARD_STORAGE_KEY = 'pmf_admin_leaderboard_v1';
const TRAINEE_NAME_STORAGE_KEY = 'pmf_trainee_name_v1';

export function getLeaderboardEntries(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is LeaderboardEntry =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.traineeName === 'string' &&
        typeof item.score === 'number'
    );
  } catch {
    return [];
  }
}

export function saveLeaderboardEntry(
  entry: Omit<LeaderboardEntry, 'id' | 'timestamp'>
): LeaderboardEntry[] {
  const existing = getLeaderboardEntries();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: `lb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  // Keep up to 100 latest/top records in localStorage
  const updated = [newEntry, ...existing].slice(0, 100);
  try {
    window.localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
    if (entry.traineeName.trim()) {
      window.localStorage.setItem(TRAINEE_NAME_STORAGE_KEY, entry.traineeName.trim());
    }
  } catch {
    // Ignore storage quota errors
  }
  return updated;
}

export function deleteLeaderboardEntry(id: string): LeaderboardEntry[] {
  const existing = getLeaderboardEntries();
  const updated = existing.filter((item) => item.id !== id);
  try {
    window.localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
  return updated;
}

export function clearLeaderboardEntries(): LeaderboardEntry[] {
  try {
    window.localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
  return [];
}

export function getSavedTraineeName(): string {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(TRAINEE_NAME_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function computeGrade(score: number): 'S' | 'A' | 'B' | 'C' | 'D' {
  if (score >= 90) return 'S';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  return 'D';
}
