import React, { useState } from 'react';
import { X, Calculator, MapPin, CheckCircle2, AlertTriangle, ArrowRight, Copy } from 'lucide-react';

interface DeliveryCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertFeeScript?: (feeText: string) => void;
}

const PRESET_LOCATIONS = [
  { name: 'รพ.ศิริราช (Siriraj)', km: 5, note: 'เขตบางกอกน้อย ฝั่งธนบุรี (ใกล้ศูนย์จรัญ 59)' },
  { name: 'สีลม คอมเพล็กซ์ (Silom Complex)', km: 9, note: 'ย่านธุรกิจ สีลม-สาทร' },
  { name: 'รพ.จุฬาลงกรณ์ (Chulalongkorn)', km: 10, note: 'พระราม 4 / ปทุมวัน' },
  { name: 'อารีย์ / พหลโยธิน ซอย 7', km: 8, note: 'โซนพญาไท' },
  { name: 'รพ.พระราม 9 / อโศก', km: 13, note: 'โซนห้วยขวาง-พระราม 9' },
  { name: 'เซ็นทรัล ลาดพร้าว', km: 12, note: 'โซนจตุจักร' },
  { name: 'เดอะมอลล์ บางแค', km: 14, note: 'โซนเพชรเกษม' },
  { name: 'บางนา-ตราด กม.14', km: 28, note: 'โซนรอบนอก (เกิน 25 กม.)' },
  { name: 'แฟชั่นไอส์แลนด์ รามอินทรา', km: 27, note: 'โซนรอบนอก (เกิน 25 กม.)' },
];

export const DeliveryCalculatorModal: React.FC<DeliveryCalculatorModalProps> = ({
  isOpen,
  onClose,
  onInsertFeeScript,
}) => {
  const [distanceKm, setDistanceKm] = useState<number>(9);
  const [orderAmount, setOrderAmount] = useState<number>(2500);
  const [brand, setBrand] = useState<'PMF' | 'UB'>('PMF');
  const [isExpress, setIsExpress] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Calculate PMF
  let pmfFee = 0;
  let pmfRuleExplanation = '';
  let pmfIsFree = false;

  if (distanceKm <= 10) {
    if (orderAmount >= 1500) {
      pmfFee = 0;
      pmfIsFree = true;
      pmfRuleExplanation = 'ระยะ 1-10 กม. ยอดสั่งครบ 1,500 บาท ฟรีค่าจัดส่งทันที! (หากไม่ถึงคิด 59 บาท)';
    } else {
      pmfFee = 59;
      pmfIsFree = false;
      pmfRuleExplanation = 'ระยะ 1-10 กม. ยอดสั่งยังไม่ถึง 1,500 บาท ค่าส่ง 59 บาท (แนะนำลูกค้าซื้อเพิ่มให้ครบ 1,500 บาทเพื่อส่งฟรี)';
    }
  } else if (distanceKm <= 25) {
    if (orderAmount >= 4000) {
      pmfFee = 0;
      pmfIsFree = true;
      pmfRuleExplanation = 'ระยะ 11-25 กม. ยอดสั่งครบ 4,000 บาท ฟรีค่าจัดส่งทันที! (หากไม่ถึงคิด 159 บาท)';
    } else {
      pmfFee = 159;
      pmfIsFree = false;
      pmfRuleExplanation = 'ระยะ 11-25 กม. ยอดสั่งยังไม่ถึง 4,000 บาท คิดค่าจัดส่ง 159 บาท';
    }
  } else {
    // Over 25 km
    const excessKm = distanceKm - 25;
    const excessFee = excessKm * 10;
    if (orderAmount >= 4000) {
      // Free 159 waiver, only pay excess
      pmfFee = excessFee;
      pmfIsFree = false;
      pmfRuleExplanation = `ระยะ ${distanceKm} กม. (เกิน 25 กม.) ยอดครบ 4,000 บ. ได้รับสิทธิ์ฟรีค่าส่งฐาน 159 บ.! ชำระเฉพาะส่วนเกิน ${excessKm} กม. x 10 บ. = ${excessFee} บาท`;
    } else {
      pmfFee = 159 + excessFee;
      pmfIsFree = false;
      pmfRuleExplanation = `ระยะ ${distanceKm} กม. (เกิน 25 กม.) ค่าส่งฐาน 159 บ. + ส่วนเกิน ${excessKm} กม. x 10 บ. (${excessFee} บ.) = รวม ${pmfFee} บาท`;
    }
  }

  // Calculate UB (Uncle Ben)
  let ubFee = 0;
  let ubRuleExplanation = '';
  if (distanceKm <= 30) {
    ubFee = isExpress ? 200 : 0;
    ubRuleExplanation = isExpress
      ? 'UB ฟรีค่าจัดส่งทุกออเดอร์ (ไม่เกิน 30 กม.) + บริการส่งด่วน Express 2 ชม. เพิ่ม 200 บาท'
      : 'UB ฟรีค่าจัดส่งทุกออเดอร์ (ไม่เกิน 30 กม.) รอบจัดส่งปกติ 2.5 - 4 ชม.';
  } else {
    ubFee = 200 + (distanceKm - 30) * 15;
    ubRuleExplanation = 'เกิน 30 กม. มีค่าบริการเพิ่มเติมตามระยะทาง';
  }

  const currentFee = brand === 'PMF' ? pmfFee : ubFee;
  const currentExplanation = brand === 'PMF' ? pmfRuleExplanation : ubRuleExplanation;
  const grandTotal = orderAmount + currentFee;

  const summaryScript = `สำหรับค่าจัดส่งปลายทาง (${distanceKm} กม. จากศูนย์จรัญ 59)
ยอดสั่งซื้อ ${orderAmount.toLocaleString()} บาท:
👉 ${currentFee === 0 ? 'ฟรีค่าจัดส่งค่ะ! 🎉' : `ค่าจัดส่ง ${currentFee} บาท`}
(${currentExplanation})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    if (onInsertFeeScript) {
      onInsertFeeScript(summaryScript);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl text-slate-100 shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-slate-800/90 px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">
                เครื่องคิดเลขคำนวณค่าจัดส่ง (จุดสตาร์ท: จรัญ 59)
              </h3>
              <p className="text-xs text-slate-400">
                ระบบคำนวณตามโครงสร้างราคาจริงของร้าน Premium Fruit Delivery (PMF) & Uncle Ben (UB)
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

        <div className="p-6 space-y-5">
          {/* Brand Switcher */}
          <div className="flex rounded-lg bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => setBrand('PMF')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                brand === 'PMF'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PMF (มอเตอร์ไซค์ควบคุมงาน 60 กม.)
            </button>
            <button
              onClick={() => setBrand('UB')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                brand === 'UB'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Uncle Ben (ฟรีส่งทุกออเดอร์ / ด่วน 2 ชม.)
            </button>
          </div>

          {/* Quick Preset Locations */}
          <div>
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">
              เลือกสถานที่ยอดนิยมอย่างรวดเร็ว:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_LOCATIONS.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => setDistanceKm(loc.km)}
                  className={`text-left p-2 rounded-lg text-xs border transition ${
                    distanceKm === loc.km
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="font-medium truncate">{loc.name}</div>
                  <div className="text-[11px] text-slate-400">{loc.km} กม.</div>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">
                ระยะทางจริงจากจรัญ 59 (กม.):
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value) || 1)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="absolute right-3 top-2 text-xs text-slate-400">กม.</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 block">
                ยอดราคาสินค้าในกระเช้า (บาท):
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(Number(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="absolute right-3 top-2 text-xs text-slate-400">บาท</span>
              </div>
            </div>
          </div>

          {brand === 'UB' && (
            <div className="flex items-center space-x-2 bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <input
                type="checkbox"
                id="expressCheckbox"
                checked={isExpress}
                onChange={(e) => setIsExpress(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 focus:ring-offset-slate-900 bg-slate-700 border-slate-600"
              />
              <label htmlFor="expressCheckbox" className="text-xs text-slate-200 cursor-pointer">
                ต้องการส่งด่วนพิเศษภายใน 2 ชั่วโมง (Express 2 hrs +200 บาท)
              </label>
            </div>
          )}

          {/* Result Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-850 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">ผลการคำนวณค่าส่ง:</span>
              {currentFee === 0 ? (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ฟรีค่าจัดส่ง!</span>
                </span>
              ) : (
                <span className="text-lg font-bold text-amber-300">
                  +{currentFee} บาท
                </span>
              )}
            </div>

            <p className="text-xs text-emerald-200/90 leading-relaxed mb-3">
              {currentExplanation}
            </p>

            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-400">ยอดรวมทั้งสิ้น (สินค้า + ค่าส่ง):</span>
              <span className="font-bold text-base text-white">
                {grandTotal.toLocaleString()} บาท
              </span>
            </div>
          </div>

          {/* Action to use text */}
          <div className="flex items-center space-x-2 pt-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center justify-center space-x-1.5 transition border border-slate-700"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'คัดลอกข้อความแล้ว!' : 'คัดลอกข้อความแจ้งลูกค้า'}</span>
            </button>

            {onInsertFeeScript && (
              <button
                onClick={handleInsert}
                className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white flex items-center justify-center space-x-1.5 transition shadow"
              >
                <span>ใส่ในกล่องข้อความแชท</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
