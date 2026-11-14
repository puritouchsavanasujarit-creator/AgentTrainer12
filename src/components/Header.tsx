import React from 'react';
import { Scenario } from '../types';
import { BookOpen, Calculator, Sparkles, RefreshCw, Award, ShieldAlert, CheckCircle2, Map, FileSpreadsheet, Target, Volume2, VolumeX, Trophy } from 'lucide-react';

interface HeaderProps {
  currentScenario: Scenario;
  scenarios: Scenario[];
  onSelectScenario: (scenario: Scenario) => void;
  examMode: boolean;
  onToggleExamMode: () => void;
  onOpenCheatSheet: (tab?: string) => void;
  onOpenCalculator: () => void;
  onOpenMap: () => void;
  onOpenOrderEntry: () => void;
  onOpenObjectionTrainer: () => void;
  onOpenLeaderboard: () => void;
  leaderboardCount: number;
  onResetChat: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  score: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentScenario,
  scenarios,
  onSelectScenario,
  examMode,
  onToggleExamMode,
  onOpenCheatSheet,
  onOpenCalculator,
  onOpenMap,
  onOpenOrderEntry,
  onOpenObjectionTrainer,
  onOpenLeaderboard,
  leaderboardCount,
  onResetChat,
  soundEnabled,
  onToggleSound,
  score,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-xl shadow-inner font-bold text-white">
            🍎
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-base md:text-lg text-emerald-400 leading-tight">
                Premium Fruit Delivery
              </h1>
              <span className="bg-emerald-950 text-emerald-300 text-xs px-2 py-0.5 rounded-full border border-emerald-700 font-medium">
                Admin Sale Simulator
              </span>
            </div>
            <p className="text-xs text-slate-400">
              ระบบจำลองแชท LINE ฝึกอบรมแอดมินขายกระเช้าผลไม้ & โค้ช AI ตรวจสอบ SOP
            </p>
          </div>
        </div>

        {/* Scenario Switcher */}
        <div className="flex items-center space-x-2 flex-grow sm:flex-grow-0">
          <label className="text-xs text-slate-400 whitespace-nowrap hidden lg:inline">
            เลือกเคสฝึก:
          </label>
          <select
            value={currentScenario.id}
            onChange={(e) => {
              const selected = scenarios.find((s) => s.id === e.target.value);
              if (selected) onSelectScenario(selected);
            }}
            aria-label="เลือกเคสฝึกจำลอง"
            className="bg-slate-800 border border-slate-700 rounded-lg text-xs md:text-sm text-slate-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-xs md:max-w-sm"
          >
            {scenarios.map((sc) => (
              <option key={sc.id} value={sc.id}>
                [{sc.difficulty}] {sc.title.split(':')[1]?.trim() || sc.title}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons & Helpers */}
        <div className="flex items-center space-x-1.5 flex-wrap">
          {/* Interactive Delivery Map Button */}
          <button
            onClick={onOpenMap}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-xs text-emerald-300 border border-emerald-700/60 transition shadow-sm"
            title="เปิดแผนที่โซนจัดส่งและวัดระยะทางจากจรัญ 59"
          >
            <Map className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline font-medium">แผนที่โซนจัดส่ง</span>
          </button>

          {/* Order Entry Sheet Button */}
          <button
            onClick={onOpenOrderEntry}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-blue-950/70 hover:bg-blue-900 text-xs text-blue-300 border border-blue-700/60 transition shadow-sm"
            title="ระบบคีย์ออเดอร์ส่งทีมจัดส่งและคลังสินค้า (Order Sheet)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline font-medium">คีย์ออเดอร์ (OP)</span>
          </button>

          {/* Objection Drill Button */}
          <button
            onClick={onOpenObjectionTrainer}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 text-xs text-amber-300 border border-amber-700/60 transition shadow-sm"
            title="มินิเกมฝึกตอบข้อโต้แย้งลูกค้า (Objection Drill)"
          >
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline font-medium">ฝึกตอบข้อโต้แย้ง</span>
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-yellow-950/70 hover:bg-yellow-900 text-xs text-yellow-300 border border-yellow-700/60 transition shadow-sm"
            title="เปิดกระดานผู้นำแอดมินขาย (Leaderboard)"
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden md:inline font-medium">กระดานผู้นำ</span>
            {leaderboardCount > 0 && (
              <span className="bg-yellow-500/20 text-yellow-200 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-yellow-500/30">
                {leaderboardCount}
              </span>
            )}
          </button>

          {/* Calculator Quick Button */}
          <button
            onClick={onOpenCalculator}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition"
            title="เครื่องคิดเลขคำนวณค่าส่งจากจรัญ 59"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">คิดค่าส่ง</span>
          </button>

          {/* SOP Cheat Sheet Button */}
          <button
            onClick={() => onOpenCheatSheet('sop')}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition"
            title="เปิดคู่มือ SOP, กฎจุดดรอป รพ., สคริปต์ปิดการขาย"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">SOP</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded-lg border transition ${
              soundEnabled
                ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700'
            }`}
            title={soundEnabled ? 'ปิดเสียงเอฟเฟกต์แชท' : 'เปิดเสียงเอฟเฟกต์แชท'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Exam / Practice Toggle */}
          <button
            onClick={onToggleExamMode}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              examMode
                ? 'bg-purple-900/80 text-purple-200 border border-purple-600'
                : 'bg-emerald-900/80 text-emerald-200 border border-emerald-600'
            }`}
            title="สลับระหว่างโหมดฝึกฝน (แสดงคำแนะนำทันที) และโหมดทดสอบจริง"
          >
            {examMode ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span>โหมดทดสอบ (Exam)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>โหมดฝึกฝน (Coach)</span>
              </>
            )}
          </button>

          {/* Score Badge */}
          <div className="bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-700 flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">คะแนน:</span>
            <span className="text-xs font-bold text-amber-300">
              {examMode ? '??' : `${score}/100`}
            </span>
          </div>

          {/* Reset Button */}
          <button
            onClick={onResetChat}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="เริ่มบทสนทนานี้ใหม่"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
