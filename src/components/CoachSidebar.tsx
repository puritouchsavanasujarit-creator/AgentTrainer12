import React from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { Scenario, SopChecklist } from '../types';

interface CoachSidebarProps {
  scenario: Scenario;
  score: number;
  checklist: SopChecklist;
  lastGoldenRulePassed: boolean | null;
  lastFeedback: {
    feedback?: string;
    praise?: string;
    improvement?: string;
  } | null;
  isEvaluating?: boolean;
  examMode: boolean;
  onFinishSession: () => void;
  onOpenCheatSheet: (tab?: string) => void;
  onOpenCalculator: () => void;
}

export const CoachSidebar: React.FC<CoachSidebarProps> = ({
  scenario,
  score,
  checklist,
  lastGoldenRulePassed,
  lastFeedback,
  isEvaluating = false,
  examMode,
  onFinishSession,
  onOpenCheatSheet,
  onOpenCalculator,
}) => {
  // Determine Stage 1, 2, 3 progress
  const stage1Count = [
    checklist.greetingPolite,
    checklist.askedOccasion,
    checklist.askedBudget,
    checklist.askedRecipientProfile,
  ].filter(Boolean).length;

  const stage2Count = [
    checklist.recommendedWithinBudget,
    checklist.seasonalFruitHandled,
    checklist.upsellOffered,
  ].filter(Boolean).length;

  const stage3Count = [
    checklist.recipientInfoCollected,
    checklist.hospitalRuleNotified,
    checklist.threeBubbleClosingUsed,
  ].filter(Boolean).length;

  return (
    <aside className="w-full lg:w-80 xl:w-96 bg-slate-900 border-l border-slate-800 p-4 flex flex-col justify-between overflow-y-auto space-y-4">
      {/* Top Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">AI Sales Coach</h3>
              <p className="text-[11px] text-slate-400">ผู้ช่วยประเมินสดตาม SOP</p>
            </div>
          </div>

          {!examMode ? (
            <div className="flex items-center space-x-1.5 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
              <span className="text-[11px] text-slate-400">คะแนน:</span>
              <span className="text-xs font-bold text-amber-400">{score}/100</span>
            </div>
          ) : (
            <span className="text-[10px] bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded border border-purple-700">
              โหมดทดสอบ
            </span>
          )}
        </div>

        {/* Golden Rule Status Box */}
        <div
          className={`p-3 rounded-xl border transition ${
            lastGoldenRulePassed === true
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              : lastGoldenRulePassed === false
              ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              : 'bg-slate-850 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="flex items-center space-x-1">
              <span>👑 กฎ Golden Rule</span>
            </span>
            {lastGoldenRulePassed === true && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                ผ่านเกณฑ์ ✅
              </span>
            )}
            {lastGoldenRulePassed === false && (
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">
                ระวัง! ⚠️
              </span>
            )}
          </div>
          <p className="text-[11px] leading-relaxed">
            {lastGoldenRulePassed === true
              ? 'ยอดเยี่ยม! คุณจบข้อความด้วยคำถามเพื่อรักษาบทสนทนาไม่ให้ตาย'
              : lastGoldenRulePassed === false
              ? 'ข้อความล่าสุดไม่ได้จบด้วยคำถาม! อย่าปล่อยให้บทสนทนาเงียบ ถามต่อทันที'
              : 'จบทุกข้อความด้วยคำถามเปิดหรือคำถามยืนยันเสมอ'}
          </p>
        </div>

        {/* Live Coach Feedback */}
        {!examMode && lastFeedback && (
          <div className="bg-slate-850 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="font-semibold text-emerald-400 flex items-center space-x-1 text-[11px] uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>โค้ชแนะนำทันที:</span>
            </div>
            {lastFeedback.praise && (
              <p className="text-emerald-300 text-[11px] leading-relaxed">
                👍 {lastFeedback.praise}
              </p>
            )}
            {lastFeedback.improvement && (
              <p className="text-amber-300 text-[11px] leading-relaxed">
                💡 {lastFeedback.improvement}
              </p>
            )}
          </div>
        )}

        {/* 3-Stage Progress Tracker */}
        <div className="space-y-2.5 pt-1">
          <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>ความคืบหน้ากระบวนการขาย 3 ขั้นตอน:</span>
          </div>

          {/* Stage 1 */}
          <div className="bg-slate-850 p-2.5 rounded-lg border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-200">
                1. ทักทาย & ค้นหา Need
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">
                {stage1Count}/4
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-400">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2
                  className={`w-3 h-3 ${
                    checklist.askedOccasion ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span>ถามโอกาสการใช้งาน (เยี่ยมไข้/ยินดี/วันเกิด)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2
                  className={`w-3 h-3 ${
                    checklist.askedBudget ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span>ถามงบประมาณที่ลูกค้าตั้งไว้</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2
                  className={`w-3 h-3 ${
                    checklist.askedRecipientProfile
                      ? 'text-emerald-400'
                      : 'text-slate-600'
                  }`}
                />
                <span>ถามโปรไฟล์ผู้รับ / รสชาติที่ชอบ</span>
              </div>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="bg-slate-850 p-2.5 rounded-lg border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-200">
                2. นำเสนอแบบ & Up-selling
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">
                {stage2Count}/3
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-400">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2
                  className={`w-3 h-3 ${
                    checklist.recommendedWithinBudget
                      ? 'text-emerald-400'
                      : 'text-slate-600'
                  }`}
                />
                <span>ส่งรูปแนะนำ 8-12 แบบ (+-200 บ.)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2
                  className={`w-3 h-3 ${
                    checklist.seasonalFruitHandled
                      ? 'text-emerald-400'
                      : 'text-slate-600'
                  }`}
                />
                <span>ชี้แจงผลไม้นอกฤดูกาล (เชอร์รี่) & ทางเลือก</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2
                  className={`w-3 h-3 ${
                    checklist.upsellOffered ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span>เสนอ Up-sell (องุ่นไซน์มัสคัต/รังนก)</span>
              </div>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="bg-slate-850 p-2.5 rounded-lg border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-200">
                3. ปิดการขาย 3 บับเบิ้ล & 7 จุด
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">
                {stage3Count}/3
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-400">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2
                  className={`w-3 h-3 ${
                    checklist.recipientInfoCollected
                      ? 'text-emerald-400'
                      : 'text-slate-600'
                  }`}
                />
                <span>เก็บข้อมูล 7 จุด (ผู้สั่ง ผู้รับ ที่อยู่ เวลา การ์ด โบว์ ภาษี)</span>
              </div>
              {scenario.isHospital && (
                <div className="flex items-center space-x-1.5 text-amber-300">
                  <CheckCircle2
                    className={`w-3 h-3 ${
                      checklist.hospitalRuleNotified
                        ? 'text-emerald-400'
                        : 'text-amber-500'
                    }`}
                  />
                  <span>แจ้งจุดดรอป รพ. (แมสไม่ขึ้นตึก)</span>
                </div>
              )}
              <div className="flex items-center space-x-1.5">
                <CheckCircle2
                  className={`w-3 h-3 ${
                    checklist.threeBubbleClosingUsed
                      ? 'text-emerald-400'
                      : 'text-slate-600'
                  }`}
                />
                <span>ปิดการขายสรุป 3 บับเบิ้ล</span>
              </div>
            </div>
          </div>
        </div>

        {/* Case Special Notes */}
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px]">
          <span className="font-semibold text-emerald-400 block mb-0.5">
            🎯 จุดหมายเคสนี้:
          </span>
          <p className="text-slate-300">{scenario.destination}</p>
          {scenario.specialNotes && (
            <p className="text-amber-300/90 mt-1">
              ⚠️ {scenario.specialNotes}
            </p>
          )}
        </div>
      </div>

      {/* Footer Finish Button + Subtle Analyzing Indicator */}
      <div className="pt-3 border-t border-slate-800 space-y-2.5">
        {isEvaluating && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-850/90 border border-emerald-500/25 text-[11px] text-emerald-300/90"
          >
            <div className="flex items-center space-x-2">
              <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin shrink-0" />
              <span className="font-medium tracking-wide">AI Coach is analyzing...</span>
            </div>
            <span className="flex space-x-0.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse [animation-delay:0.2s]" />
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse [animation-delay:0.4s]" />
            </span>
          </div>
        )}

        <button
          onClick={onFinishSession}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-950/50"
        >
          <Award className="w-4 h-4" />
          <span>จบการฝึก & ดูรายงานประเมินผล</span>
        </button>
      </div>
    </aside>
  );
};
