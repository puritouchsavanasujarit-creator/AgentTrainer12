import React, { useMemo, useState } from 'react';
import {
  X,
  Trophy,
  Medal,
  Award,
  Crown,
  Users,
  History,
  Trash2,
  Filter,
  Sparkles,
  ShieldAlert,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { LeaderboardEntry, Scenario } from '../types';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  scenarios: Scenario[];
  currentTraineeName?: string;
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
  onSelectScenario?: (scenario: Scenario) => void;
}

interface TraineeAggregate {
  traineeName: string;
  bestScore: number;
  bestGrade: LeaderboardEntry['grade'];
  avgScore: number;
  totalSessions: number;
  avgGoldenRule: number;
  scenariosCompleted: number;
  lastActive: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  isOpen,
  onClose,
  entries,
  scenarios,
  currentTraineeName = '',
  onDeleteEntry,
  onClearAll,
  onSelectScenario,
}) => {
  const [viewMode, setViewMode] = useState<'sessions' | 'trainees'>('sessions');
  const [scenarioFilter, setScenarioFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<'all' | 'Coach' | 'Exam'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'recent'>('score');
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  const filteredEntries = useMemo(() => {
    const base = entries.filter((entry) => {
      if (scenarioFilter !== 'all' && entry.scenarioId !== scenarioFilter) {
        return false;
      }
      if (modeFilter !== 'all' && entry.mode !== modeFilter) {
        return false;
      }
      return true;
    });

    return [...base].sort((a, b) => {
      if (sortBy === 'score') {
        if (b.score !== a.score) return b.score - a.score;
        if (b.goldenRulePercent !== a.goldenRulePercent) {
          return b.goldenRulePercent - a.goldenRulePercent;
        }
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [entries, scenarioFilter, modeFilter, sortBy]);

  const traineeRankings = useMemo<TraineeAggregate[]>(() => {
    const map = new Map<
      string,
      {
        displayName: string;
        scores: number[];
        goldenRules: number[];
        scenarioIds: Set<string>;
        bestScore: number;
        bestGrade: LeaderboardEntry['grade'];
        lastActive: string;
      }
    >();

    for (const entry of filteredEntries) {
      const key = entry.traineeName.trim().toLowerCase();
      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          displayName: entry.traineeName.trim(),
          scores: [entry.score],
          goldenRules: [entry.goldenRulePercent],
          scenarioIds: new Set([entry.scenarioId]),
          bestScore: entry.score,
          bestGrade: entry.grade,
          lastActive: entry.timestamp,
        });
      } else {
        existing.scores.push(entry.score);
        existing.goldenRules.push(entry.goldenRulePercent);
        existing.scenarioIds.add(entry.scenarioId);
        if (entry.score > existing.bestScore) {
          existing.bestScore = entry.score;
          existing.bestGrade = entry.grade;
        }
        if (new Date(entry.timestamp).getTime() > new Date(existing.lastActive).getTime()) {
          existing.lastActive = entry.timestamp;
        }
      }
    }

    const result: TraineeAggregate[] = [];
    map.forEach((val) => {
      const total = val.scores.length;
      const avgScore = Math.round(val.scores.reduce((s, n) => s + n, 0) / total);
      const avgGoldenRule = Math.round(
        val.goldenRules.reduce((s, n) => s + n, 0) / total
      );
      result.push({
        traineeName: val.displayName,
        bestScore: val.bestScore,
        bestGrade: val.bestGrade,
        avgScore,
        totalSessions: total,
        avgGoldenRule,
        scenariosCompleted: val.scenarioIds.size,
        lastActive: val.lastActive,
      });
    });

    return result.sort((a, b) => {
      if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
      if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore;
      return b.avgGoldenRule - a.avgGoldenRule;
    });
  }, [filteredEntries]);

  if (!isOpen) return null;

  const topScore =
    filteredEntries.length > 0
      ? Math.max(...filteredEntries.map((e) => e.score))
      : 0;
  const avgScore =
    filteredEntries.length > 0
      ? Math.round(
          filteredEntries.reduce((sum, e) => sum + e.score, 0) /
            filteredEntries.length
        )
      : 0;
  const avgGoldenRule =
    filteredEntries.length > 0
      ? Math.round(
          filteredEntries.reduce((sum, e) => sum + e.goldenRulePercent, 0) /
            filteredEntries.length
        )
      : 0;

  const getGradeStyle = (grade: LeaderboardEntry['grade']) => {
    switch (grade) {
      case 'S':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'A':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'B':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'C':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  const getRankBadge = (rankIndex: number) => {
    if (rankIndex === 0) {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center justify-center font-black shadow-inner">
          <Crown className="w-4 h-4" />
        </div>
      );
    }
    if (rankIndex === 1) {
      return (
        <div className="w-8 h-8 rounded-xl bg-slate-300/15 border border-slate-300/40 text-slate-200 flex items-center justify-center font-black">
          <Medal className="w-4 h-4" />
        </div>
      );
    }
    if (rankIndex === 2) {
      return (
        <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-400/40 text-orange-300 flex items-center justify-center font-black">
          <Award className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-xs font-bold">
        #{rankIndex + 1}
      </div>
    );
  };

  const formatTimestamp = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleString('th-TH', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl text-slate-100 shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/90 px-6 py-4 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                กระดานผู้นำแอดมินขาย (Trainee Leaderboard)
              </h3>
              <p className="text-xs text-slate-400">
                บันทึกสถิติคะแนนสูงสุดจากการฝึกซ้อมแต่ละรอบไว้ในเครื่อง เพื่อกระตุ้นการพัฒนาฝีมือทีม Admin Sale
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700 transition"
            aria-label="ปิดหน้าต่างกระดานผู้นำ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Stats Row */}
        <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
            <div className="text-[11px] text-slate-400">จำนวนรอบที่บันทึก</div>
            <div className="text-xl font-black text-white mt-0.5">
              {filteredEntries.length} <span className="text-xs font-normal text-slate-400">รอบ</span>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
            <div className="text-[11px] text-slate-400">คะแนนสูงสุด</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">
              {topScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
            <div className="text-[11px] text-slate-400">คะแนนเฉลี่ยรวม</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {avgScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
            <div className="text-[11px] text-slate-400">เฉลี่ย Golden Rule</div>
            <div className="text-xl font-black text-blue-400 mt-0.5">
              {avgGoldenRule}%
            </div>
          </div>
        </div>

        {/* Filter & View Controls */}
        <div className="px-6 py-3 bg-slate-900/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* View Toggle: Sessions vs Trainee Standings */}
          <div className="flex rounded-lg bg-slate-800 p-1 border border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('sessions')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center space-x-1.5 transition ${
                viewMode === 'sessions'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>อันดับรายรอบ (Top Runs)</span>
            </button>
            <button
              onClick={() => setViewMode('trainees')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center space-x-1.5 transition ${
                viewMode === 'trainees'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>อันดับรวมผู้ฝึก ({traineeRankings.length})</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center space-x-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={scenarioFilter}
                onChange={(e) => setScenarioFilter(e.target.value)}
                aria-label="กรองตามเคสฝึก"
                className="bg-transparent text-slate-200 focus:outline-none text-xs max-w-[180px]"
              >
                <option value="all" className="bg-slate-900">
                  ทุกเคสฝึกซ้อม
                </option>
                {scenarios.map((sc) => (
                  <option key={sc.id} value={sc.id} className="bg-slate-900">
                    {sc.title.split(':')[0]}: {sc.title.split(':')[1]?.trim() || sc.title}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value as 'all' | 'Coach' | 'Exam')}
              aria-label="กรองตามโหมด"
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none text-xs"
            >
              <option value="all">ทุกโหมด</option>
              <option value="Coach">โหมดฝึกฝน (Coach)</option>
              <option value="Exam">โหมดทดสอบ (Exam)</option>
            </select>

            {viewMode === 'sessions' && (
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'score' | 'recent')}
                aria-label="เรียงลำดับ"
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none text-xs"
              >
                <option value="score">เรียงตามคะแนนสูงสุด</option>
                <option value="recent">เรียงตามล่าสุด</option>
              </select>
            )}
          </div>
        </div>

        {/* Main Content List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {filteredEntries.length === 0 ? (
            <div className="py-14 text-center space-y-3 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-amber-400">
                <Trophy className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white">
                  ยังไม่มีสถิติคะแนนในกระดานผู้นำ
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  ลองฝึกโต้ตอบแชทกับลูกค้าจนจบ แล้วกดปุ่ม{' '}
                  <span className="text-emerald-400 font-semibold">
                    "จบการฝึก & ดูรายงานประเมินผล"
                  </span>{' '}
                  เพื่อบันทึกคะแนนของคุณลงในกระดานผู้นำ!
                </p>
              </div>
            </div>
          ) : viewMode === 'sessions' ? (
            <div className="space-y-2.5">
              {filteredEntries.map((entry, index) => {
                const isTopThree = sortBy === 'score' && index < 3;
                const isCurrentUser =
                  currentTraineeName.trim() !== '' &&
                  entry.traineeName.trim().toLowerCase() ===
                    currentTraineeName.trim().toLowerCase();

                return (
                  <div
                    key={entry.id}
                    className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isTopThree && index === 0
                        ? 'bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900 border-amber-500/40'
                        : isCurrentUser
                        ? 'bg-emerald-950/30 border-emerald-500/40'
                        : 'bg-slate-850/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {sortBy === 'score' ? (
                        getRankBadge(index)
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0">
                          {index + 1}
                        </div>
                      )}

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-white truncate">
                            {entry.traineeName}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-semibold">
                              คุณ
                            </span>
                          )}
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded border font-bold ${getGradeStyle(
                              entry.grade
                            )}`}
                          >
                            เกรด {entry.grade}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center space-x-1 ${
                              entry.mode === 'Exam'
                                ? 'bg-purple-950/70 text-purple-300 border-purple-700/60'
                                : 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60'
                            }`}
                          >
                            {entry.mode === 'Exam' ? (
                              <ShieldAlert className="w-2.5 h-2.5" />
                            ) : (
                              <Sparkles className="w-2.5 h-2.5" />
                            )}
                            <span>{entry.mode}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                          <button
                            type="button"
                            onClick={() => {
                              const target = scenarios.find(
                                (s) => s.id === entry.scenarioId
                              );
                              if (target && onSelectScenario) {
                                onSelectScenario(target);
                                onClose();
                              }
                            }}
                            className="text-slate-300 hover:text-emerald-400 transition truncate max-w-xs text-left"
                            title="คลิกเพื่อลองเล่นเคสนี้อีกครั้ง"
                          >
                            {entry.scenarioTitle}
                          </button>
                          <span>•</span>
                          <span>👑 Golden Rule {entry.goldenRulePercent}%</span>
                          <span>•</span>
                          <span>
                            ✅ SOP {entry.sopPassedCount}/{entry.sopTotalCount}
                          </span>
                          <span>•</span>
                          <span>{formatTimestamp(entry.timestamp)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Score & Delete */}
                    <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pl-11 sm:pl-0">
                      <div className="text-right">
                        <div className="text-lg font-black text-white leading-none">
                          {entry.score}
                          <span className="text-[11px] font-normal text-slate-400">
                            /100
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          คะแนนรวม
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteEntry(entry.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
                        title="ลบรายการนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2.5">
              {traineeRankings.map((trainee, index) => {
                const isCurrentUser =
                  currentTraineeName.trim() !== '' &&
                  trainee.traineeName.trim().toLowerCase() ===
                    currentTraineeName.trim().toLowerCase();

                return (
                  <div
                    key={trainee.traineeName}
                    className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      index === 0
                        ? 'bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900 border-amber-500/40'
                        : isCurrentUser
                        ? 'bg-emerald-950/30 border-emerald-500/40'
                        : 'bg-slate-850/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {getRankBadge(index)}
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-white truncate">
                            {trainee.traineeName}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-semibold">
                              คุณ
                            </span>
                          )}
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded border font-bold ${getGradeStyle(
                              trainee.bestGrade
                            )}`}
                          >
                            สูงสุด {trainee.bestGrade}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                          <span className="flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>ฝึกแล้ว {trainee.totalSessions} รอบ</span>
                          </span>
                          <span>•</span>
                          <span>ผ่าน {trainee.scenariosCompleted} เคส</span>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3 text-blue-400" />
                            <span>เฉลี่ย {trainee.avgScore} คะแนน</span>
                          </span>
                          <span>•</span>
                          <span>👑 Golden Rule เฉลี่ย {trainee.avgGoldenRule}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right pl-11 sm:pl-0 shrink-0">
                      <div className="text-lg font-black text-amber-300 leading-none">
                        {trainee.bestScore}
                        <span className="text-[11px] font-normal text-slate-400">
                          /100
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        สถิติสูงสุด (Personal Best)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-850 px-6 py-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-400">
            ข้อมูลถูกจัดเก็บอย่างปลอดภัยในเบราว์เซอร์ (Local Storage)
          </div>

          <div className="flex items-center space-x-2">
            {entries.length > 0 && !confirmClear && (
              <button
                onClick={() => setConfirmClear(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-xs text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-700/60 flex items-center space-x-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ล้างสถิติทั้งหมด</span>
              </button>
            )}

            {confirmClear && (
              <div className="flex items-center space-x-2 bg-rose-950/60 border border-rose-700/60 px-3 py-1 rounded-lg">
                <span className="text-xs text-rose-200">ยืนยันล้างสถิติทั้งหมด?</span>
                <button
                  onClick={() => {
                    onClearAll();
                    setConfirmClear(false);
                  }}
                  className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition"
                >
                  ลบทั้งหมด
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs transition"
                >
                  ยกเลิก
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
