import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle2, RefreshCw, ArrowRight, Star, Trophy, Save } from 'lucide-react';
import { Scenario, SopChecklist } from '../types';
import { getSavedTraineeName } from '../utils/leaderboardStorage';

interface EvaluationSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: Scenario;
  score: number;
  checklist: SopChecklist;
  goldenRuleRatio: { count: number; total: number };
  coachFeedbackHistory: Array<{ praise?: string; improvement?: string; feedback?: string }>;
  examMode: boolean;
  onSaveToLeaderboard: (traineeName: string, sopPassedCount: number, sopTotalCount: number, goldenPercent: number) => void;
  onOpenLeaderboard: () => void;
  onRetry: () => void;
  onNextScenario: () => void;
  hasNextScenario: boolean;
}

export const EvaluationSummaryModal: React.FC<EvaluationSummaryModalProps> = ({
  isOpen,
  onClose,
  scenario,
  score,
  checklist,
  goldenRuleRatio,
  coachFeedbackHistory,
  examMode,
  onSaveToLeaderboard,
  onOpenLeaderboard,
  onRetry,
  onNextScenario,
  hasNextScenario,
}) => {
  const [traineeName, setTraineeName] = useState('');
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTraineeName(getSavedTraineeName());
      setHasSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getGrade = (val: number) => {
    if (val >= 90) return { grade: 'S', label: 'ยอดเยี่ยมระดับซูเปอร์แอดมิน!', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' };
    if (val >= 80) return { grade: 'A', label: 'ดีมาก พร้อมให้บริการจริง', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' };
    if (val >= 70) return { grade: 'B', label: 'ผ่านเกณฑ์มาตรฐาน SOP', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' };
    if (val >= 60) return { grade: 'C', label: 'พอใช้ ต้องปรับปรุงบางจุด', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' };
    return { grade: 'D', label: 'ต้องฝึกฝนซ้ำตาม Playbook', color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/30' };
  };

  const gradeInfo = getGrade(score);
  const goldenPercent =
    goldenRuleRatio.total > 0
      ? Math.round((goldenRuleRatio.count / goldenRuleRatio.total) * 100)
      : 100;

  const checklistItems = [
    { label: 'ทักทายสุภาพ ต้อนรับน่าประทับใจ', pass: checklist.greetingPolite, stage: 'Stage 1' },
    { label: 'สอบถามโอกาสการใช้งานกระเช้า', pass: checklist.askedOccasion, stage: 'Stage 1' },
    { label: 'สอบถามงบประมาณที่ลูกค้าตั้งไว้', pass: checklist.askedBudget, stage: 'Stage 1' },
    { label: 'สอบถามโปรไฟล์/ความชอบของผู้รับ', pass: checklist.askedRecipientProfile, stage: 'Stage 1' },
    { label: 'ส่งรูปแนะนำ 8-12 แบบตามช่วงงบ', pass: checklist.recommendedWithinBudget, stage: 'Stage 2' },
    { label: 'ชี้แจงผลไม้นอกฤดูกาล & แนะนำทดแทน', pass: checklist.seasonalFruitHandled, stage: 'Stage 2' },
    { label: 'เสนอ Up-selling (องุ่น/รังนก)', pass: checklist.upsellOffered, stage: 'Stage 2' },
    { label: 'เก็บข้อมูลจัดส่ง 7 จุดสำคัญครบถ้วน', pass: checklist.recipientInfoCollected, stage: 'Stage 3' },
    { label: 'แจ้งกฎจุดดรอป รพ. (หากส่ง รพ.)', pass: checklist.hospitalRuleNotified, stage: 'Stage 3' },
    { label: 'ใช้เทคนิคปิดการขาย 3 บับเบิ้ล', pass: checklist.threeBubbleClosingUsed, stage: 'Stage 3' },
  ];

  const totalPassed = checklistItems.filter((i) => i.pass).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl text-slate-100 shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/90 px-6 py-4 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">
                รายงานผลการประเมินการฝึกอบรม (Training Evaluation Card)
              </h3>
              <p className="text-xs text-slate-400">
                เคส: {scenario.title} ({scenario.customerName})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {score >= 90 && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 border border-amber-400/50 flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center space-x-2.5">
                <span className="text-xl">🎉</span>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-amber-300">
                    ยินดีด้วย! คุณทำคะแนนได้ {score} คะแนน (ระดับ S-Rank)
                  </div>
                  <div className="text-[11px] text-emerald-200">
                    ปฏิบัติตามมาตรฐาน SOP และกฎ Golden Rule ได้อย่างยอดเยี่ยม!
                  </div>
                </div>
              </div>
              <span className="text-xl">🏆</span>
            </div>
          )}

          {/* Grade Card */}
          <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${gradeInfo.bg}`}>
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-center justify-center text-3xl font-black ${gradeInfo.color} shadow-inner`}>
                {gradeInfo.grade}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-white">{score}</span>
                  <span className="text-slate-400 text-xs">/ 100 คะแนน</span>
                </div>
                <div className={`text-sm font-semibold ${gradeInfo.color}`}>
                  {gradeInfo.label}
                </div>
              </div>
            </div>

            {/* Golden Rule Badge */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-center sm:text-right w-full sm:w-auto">
              <div className="text-[11px] text-amber-300 font-medium">👑 กฎ Golden Rule</div>
              <div className="text-base font-bold text-white">
                {goldenPercent}% ({goldenRuleRatio.count}/{goldenRuleRatio.total} ข้อความ)
              </div>
              <div className="text-[10px] text-slate-400">จบประโยคด้วยคำถามเสมอ</div>
            </div>
          </div>

          {/* Checklist Grid */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                การปฏิบัติตามมาตรฐาน SOP (ผ่าน {totalPassed}/{checklistItems.length} ข้อ):
              </span>
              <span className="text-emerald-400 font-bold">
                {Math.round((totalPassed / checklistItems.length) * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {checklistItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border flex items-center justify-between ${
                    item.pass
                      ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-200'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    {item.pass ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0"></div>
                    )}
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                    {item.stage}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Coach Feedback */}
          {coachFeedbackHistory.length > 0 && (
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <h4 className="font-semibold text-white flex items-center space-x-1.5">
                <Star className="w-4 h-4 text-amber-400" />
                <span>สรุปข้อเสนอแนะจาก AI Coach:</span>
              </h4>
              <div className="space-y-2 text-slate-300">
                {coachFeedbackHistory.slice(-2).map((item, idx) => (
                  <div key={idx} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    {item.praise && (
                      <p className="text-emerald-300 font-medium">✨ จุดเด่น: {item.praise}</p>
                    )}
                    {item.improvement && (
                      <p className="text-amber-300 mt-1">🎯 ข้อควรปรับปรุง: {item.improvement}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save to Leaderboard Card */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-850 to-slate-850 p-4 rounded-xl border border-amber-500/30 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-amber-300">
                  บันทึกคะแนนลงกระดานผู้นำ ({examMode ? 'โหมด Exam' : 'โหมด Coach'})
                </span>
              </div>
              {hasSaved && (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>บันทึกสถิติแล้ว!</span>
                </span>
              )}
            </div>

            {!hasSaved ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={traineeName}
                  onChange={(e) => setTraineeName(e.target.value)}
                  placeholder="กรอกชื่อเล่น / ชื่อแอดมิน (เช่น น้องมายด์, พี่ต้น)..."
                  maxLength={40}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  disabled={!traineeName.trim()}
                  onClick={() => {
                    if (!traineeName.trim()) return;
                    onSaveToLeaderboard(
                      traineeName.trim(),
                      totalPassed,
                      checklistItems.length,
                      goldenPercent
                    );
                    setHasSaved(true);
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center justify-center space-x-1.5 transition ${
                    traineeName.trim()
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>บันทึกคะแนน</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-slate-900/70 p-2.5 rounded-lg border border-emerald-500/30">
                <span className="text-slate-300">
                  บันทึกคะแนน <strong className="text-white">{score}/100</strong> ในชื่อ{' '}
                  <strong className="text-emerald-300">{traineeName}</strong> เรียบร้อยแล้ว
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenLeaderboard();
                  }}
                  className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold transition flex items-center space-x-1 shrink-0"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>ดูกระดานผู้นำ</span>
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  onRetry();
                  onClose();
                }}
                className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center space-x-2 transition border border-slate-700"
              >
                <RefreshCw className="w-4 h-4" />
                <span>ฝึกซ้อมเคสนี้อีกครั้ง</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenLeaderboard();
                }}
                className="py-2.5 px-4 rounded-xl bg-amber-950/70 hover:bg-amber-900 text-xs font-semibold text-amber-300 flex items-center justify-center space-x-1.5 transition border border-amber-700/60"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>กระดานผู้นำ</span>
              </button>
            </div>

            {hasNextScenario && (
              <button
                onClick={() => {
                  onNextScenario();
                  onClose();
                }}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-900/30"
              >
                <span>ฝึกต่อเคสถัดไป</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
