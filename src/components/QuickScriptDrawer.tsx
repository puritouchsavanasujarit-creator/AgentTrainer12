import React, { useState } from 'react';
import { X, Copy, Zap, ArrowRight, Check } from 'lucide-react';
import { QUICK_SCRIPTS } from '../data/trainingData';

interface QuickScriptDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScript: (text: string) => void;
}

export const QuickScriptDrawer: React.FC<QuickScriptDrawerProps> = ({
  isOpen,
  onClose,
  onSelectScript,
}) => {
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTitle(title);
    setTimeout(() => setCopiedTitle(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl text-slate-100 shadow-2xl overflow-hidden my-6 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/90 px-6 py-4 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">
                คลังสคริปต์คำตอบมาตรฐาน (Quick Reply Snippets)
              </h3>
              <p className="text-xs text-slate-400">
                คลิกเพื่อแทรกลงในกล่องแชททันที หรือคัดลอกไปปรับแต่งคำตอบ
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

        {/* List of categories */}
        <div className="p-6 overflow-y-auto space-y-6">
          {QUICK_SCRIPTS.map((cat, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>{cat.category}</span>
              </h4>

              <div className="space-y-2.5">
                {cat.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80 hover:border-emerald-500/50 transition group space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition">
                        {item.title}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleCopy(item.text, item.title)}
                          className="px-2 py-1 rounded bg-slate-700/70 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-white flex items-center space-x-1 transition"
                          title="คัดลอกข้อความ"
                        >
                          {copiedTitle === item.title ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">คัดลอกแล้ว</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>คัดลอก</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            onSelectScript(item.text);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-[11px] font-medium text-white flex items-center space-x-1 transition shadow"
                          title="นำข้อความนี้ใส่ในช่องพิมพ์แชท"
                        >
                          <span>ใส่ในแชท</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                      {item.text}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
