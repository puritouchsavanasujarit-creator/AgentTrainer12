import React, { useState } from 'react';
import {
  X,
  Target,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Trophy,
} from 'lucide-react';

interface ObjectionQuestion {
  id: string;
  customerObjection: string;
  category: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
    hasGoldenRule: boolean;
  }[];
}

const OBJECTION_QUESTIONS: ObjectionQuestion[] = [
  {
    id: 'obj-1',
    customerObjection: 'ทำไมราคากระเช้าผลไม้ที่นี่ถึงแพงกว่าร้านทั่วไปหรือตลาดไทคะ?',
    category: 'ข้อโต้แย้งเรื่องราคา (Price Objection)',
    options: [
      {
        text: 'ผลไม้ของร้านเราเป็นเกรดนำเข้าพรีเมียม คัดพิเศษทุกลูกไม่ให้มีตำหนิ มีประกันเคลม 100% ภายใน 24 ชม. หากช้ำหรือมีปัญหา พร้อมจัดตกแต่งด้วยโบว์และการ์ดอย่างประณีตสมเกียรติผู้รับค่ะ คุณลูกค้ามองหางบประมาณประมาณเท่าไหร่ดีคะ?',
        isCorrect: true,
        explanation: 'ถูกต้องตาม Playbook! ชี้แจงจุดขายคัดเกรดพรีเมียม มีประกันเคลม 100% และจบด้วยคำถามตามกฎ Golden Rule ทันที',
        hasGoldenRule: true,
      },
      {
        text: 'เพราะเราคิดค่ากระเช้าและค่าบริการจัดค่ะ ถ้าลูกค้าคิดว่าแพง ซื้อตลาดไทถูกกว่าจริงๆ ค่ะ',
        isCorrect: false,
        explanation: 'ไม่ถูกต้อง! เสียภาพลักษณ์ของแบรนด์พรีเมียม และทำให้ลูกค้าหลุดการซื้อ',
        hasGoldenRule: false,
      },
      {
        text: 'เกรดผลไม้คนละแบบกันค่ะ ร้านเราขายแต่ของดีนำเข้า ไม่เหมือนผลไม้ทั่วไปนะคะ',
        isCorrect: false,
        explanation: 'ไม่แนะนำ! การพูดเปรียบเทียบในแง่ลบและไม่มีการจบด้วยคำถามเปิด ทำให้บทสนทนาหยุดชะงัก',
        hasGoldenRule: false,
      },
    ],
  },
  {
    id: 'obj-2',
    customerObjection: 'สั่งไปเยี่ยมคุณแม่ที่ รพ.ศิริราช ให้คนขับเดินขึ้นไปส่งที่ห้องพักผู้ป่วยชั้น 7 เลยได้ไหมคะ พอดีญาติไม่สะดวกเดินลงมารับ?',
    category: 'ข้อกำหนดโรงพยาบาล (Hospital Policy)',
    options: [
      {
        text: 'ได้เลยค่ะ เดี๋ยวบอกให้พี่แมสเซนเจอร์เดินขึ้นลิฟต์ไปส่งให้ถึงเตียงเลยค่ะ',
        isCorrect: false,
        explanation: 'ผิดกฎร้ายแรง! โรงพยาบาลศิริราชมีมาตรการห้ามคนขับส่งอาหาร/พัสดุขึ้นอาคารผู้ป่วยเด็ดขาด',
        hasGoldenRule: false,
      },
      {
        text: 'ขออนุญาตเรียนแจ้งนะคะ ทาง รพ.ศิริราช มีมาตรการรักษาความปลอดภัยและป้องกันการติดเชื้อ ไม่อนุญาตให้แมสเซนเจอร์ขึ้นบนอาคารผู้ป่วย ทางร้านจะประสานงานส่งที่จุดรับของกลางชั้น 1 เพื่อให้เจ้าหน้าที่นำส่งต่อให้ หรือรบกวนขอเบอร์ติดต่อญาติไว้ประสานงานนะคะ คุณลูกค้าสะดวกไหมคะ?',
        isCorrect: true,
        explanation: 'ถูกต้องสมบูรณ์แบบ! อธิบายเหตุผลทางการแพทย์อย่างสุภาพ แนะนำทางออก และจบด้วยคำถาม Golden Rule',
        hasGoldenRule: true,
      },
      {
        text: 'แมสเซนเจอร์ไม่ขึ้นตึกค่ะ ต้องลงมารับเองที่หน้าตึกเท่านั้นค่ะ',
        isCorrect: false,
        explanation: 'ห้วนเกินไป ขาดความเห็นอกเห็นใจ และไม่ได้จบด้วยคำถาม',
        hasGoldenRule: false,
      },
    ],
  },
  {
    id: 'obj-3',
    customerObjection: 'อยากได้กระเช้าที่มีเชอร์รี่เยอะๆ ทำไมแอดมินบอกว่าไม่มีคะ มีร้านอื่นเขาบอกมีนะ?',
    category: 'ผลไม้นอกฤดูกาล (Seasonal Out of Season)',
    options: [
      {
        text: 'เชอร์รี่ช่วงนี้เป็นช่วงนอกฤดูกาล (Out of season) ผลไม้จะไม่สดกรอบและเสียง่าย ทางร้านเน้นคุณภาพจึงคัดสรรเป็น "องุ่นไซน์มัสคัตญี่ปุ่น/เกาหลี" หวานกรอบไร้เมล็ด หรือ "บลูเบอร์รี่สดจัมโบ้" แทน ซึ่งสวยหรูและผู้รับประทับใจแน่นอนค่ะ คุณลูกค้าสะดวกรับเป็นแบบนี้ไหมคะ?',
        isCorrect: true,
        explanation: 'ยอดเยี่ยม! แสดงถึงความจริงใจเรื่องมาตรฐานคุณภาพ พร้อมเสนอผลไม้ทดแทนระดับพรีเมียมและปิดด้วยคำถาม',
        hasGoldenRule: true,
      },
      {
        text: 'ร้านอื่นเขาเอาของเก่าค้างสต็อกมาขายค่ะ ของร้านเราขายแต่ของสด เลยไม่มีค่ะ',
        isCorrect: false,
        explanation: 'ห้ามพาดพิงหรือว่าร้ายร้านอื่นตามจรรยาบรรณของร้าน',
        hasGoldenRule: false,
      },
      {
        text: 'ช่วงนี้ไม่มีเชอร์รี่ค่ะ มีแต่อย่างอื่น ลองดูแบบอื่นแทนไหมคะ',
        isCorrect: false,
        explanation: 'ข้อมูลไม่ครบถ้วน ไม่ได้ระบุว่าทำไมไม่มี และไม่ได้นำเสนอผลไม้ทดแทนที่น่าสนใจ',
        hasGoldenRule: true,
      },
    ],
  },
];

interface ObjectionTrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToChat?: (text: string) => void;
}

export const ObjectionTrainerModal: React.FC<ObjectionTrainerModalProps> = ({
  isOpen,
  onClose,
  onInsertToChat,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  if (!isOpen) return null;

  const currentQ = OBJECTION_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (showResult) return;
    setSelectedOption(idx);
    setShowResult(true);
    if (currentQ.options[idx].isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    if (currentIdx < OBJECTION_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setCurrentIdx(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl text-slate-100 shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/90 px-6 py-4 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">
                มินิเกมฝึกตอบข้อโต้แย้งลูกค้า (Objection Handling Drill)
              </h3>
              <p className="text-xs text-slate-400">
                ฝึกฝนสถานการณ์ฉุกเฉินและข้อโต้แย้งยอดฮิตตาม Sales Playbook
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

        {/* Question Area */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-amber-300 font-semibold">
              คำถามที่ {currentIdx + 1} / {OBJECTION_QUESTIONS.length}
            </span>
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
              <Trophy className="w-4 h-4" />
              <span>คะแนน: {score} ข้อ</span>
            </div>
          </div>

          {/* Customer Objection Quote */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              {currentQ.category}
            </span>
            <div className="flex items-start space-x-2.5">
              <span className="text-xl">💬</span>
              <p className="font-medium text-white text-sm sm:text-base leading-relaxed italic">
                "{currentQ.customerObjection}"
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-slate-300 block">
              เลือกคำตอบที่ถูกต้องที่สุดตามมาตรฐาน SOP และ Golden Rule:
            </label>

            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-600';

              if (showResult) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-medium';
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                } else {
                  btnStyle = 'bg-slate-850/40 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer text-xs sm:text-sm leading-relaxed space-y-2 ${btnStyle}`}
                >
                  <div className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                  </div>

                  {showResult && isSelected && (
                    <div className="pt-2 border-t border-white/10 text-xs">
                      {opt.isCorrect ? (
                        <div className="text-emerald-400 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{opt.explanation}</span>
                        </div>
                      ) : (
                        <div className="text-rose-400 font-semibold flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{opt.explanation}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Next Button or Insert into Chat */}
          {showResult && (
            <div className="pt-2 flex items-center justify-between gap-3">
              {onInsertToChat && currentQ.options[selectedOption || 0].isCorrect && (
                <button
                  onClick={() => {
                    onInsertToChat(currentQ.options[selectedOption || 0].text);
                    onClose();
                  }}
                  className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-emerald-300 border border-emerald-600/50 transition flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ใช้คำตอบนี้ในห้องแชท</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="ml-auto py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-1.5 transition shadow"
              >
                <span>{currentIdx < OBJECTION_QUESTIONS.length - 1 ? 'ข้อถัดไป' : 'เริ่มรอบใหม่'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
