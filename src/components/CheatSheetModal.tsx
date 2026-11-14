import React, { useState } from 'react';
import { X, BookOpen, Truck, Hospital, Sparkles, Clock, CheckCircle2, AlertTriangle, Copy } from 'lucide-react';
import { DELIVERY_FEES_MATRIX, HOSPITAL_POLICIES } from '../data/trainingData';

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
  onCopySnippet?: (text: string) => void;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'sop',
  onCopySnippet,
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    if (onCopySnippet) onCopySnippet(text);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl text-slate-100 shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/90 px-6 py-4 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">
                คู่มือการปฏิบัติงานแอดมินขาย (SOP Cheat Sheet & Knowledge Base)
              </h3>
              <p className="text-xs text-slate-400">
                สรุปจาก Playbook, ขั้นตอนการขาย 3 ขั้นตอน, อัตราค่าจัดส่งจรัญ 59 และข้อกำหนดโรงพยาบาล
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-850 px-6 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('sop')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center space-x-1.5 transition whitespace-nowrap ${
              activeTab === 'sop'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>กระบวนการขาย 3 ขั้นตอน & Golden Rule</span>
          </button>

          <button
            onClick={() => setActiveTab('delivery')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center space-x-1.5 transition whitespace-nowrap ${
              activeTab === 'delivery'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>อัตราค่าจัดส่ง จรัญ 59 (PMF / UB)</span>
          </button>

          <button
            onClick={() => setActiveTab('hospital')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center space-x-1.5 transition whitespace-nowrap ${
              activeTab === 'hospital'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Hospital className="w-4 h-4" />
            <span>ข้อกำหนดส่งโรงพยาบาล (Drop Points)</span>
          </button>

          <button
            onClick={() => setActiveTab('upsell')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center space-x-1.5 transition whitespace-nowrap ${
              activeTab === 'upsell'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>เทคนิค Up-selling & ผลไม้นอกฤดูกาล</span>
          </button>

          <button
            onClick={() => setActiveTab('shift')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center space-x-1.5 transition whitespace-nowrap ${
              activeTab === 'shift'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>การส่งมอบงานกะ & ส่วนลดสมาชิก</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* TAB 1: SOP & GOLDEN RULE */}
          {activeTab === 'sop' && (
            <div className="space-y-6">
              {/* The Golden Rule Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/80 to-amber-900/40 border border-amber-500/50 shadow-md">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">👑</span>
                  <div>
                    <h4 className="font-bold text-amber-300 text-base">
                      กฎ Golden Rule (หัวใจสำคัญที่สุดของการเป็นแอดมินขาย)
                    </h4>
                    <p className="text-xs text-amber-100 mt-1 leading-relaxed">
                      "<strong>ห้ามปล่อยให้บทสนทนาตาย</strong>: ทุกขั้นตอนของการคุยกับลูกค้า เราจะต้องทิ้งคำถามไว้ให้ลูกค้าเสมอ เพื่อเปิดและรักษาบทสนทนากับลูกค้า ให้ลูกค้ารู้สึกมีส่วนร่วมและไม่หลุดการซื้อ"
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Stages Flowchart */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Stage 1 */}
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 space-y-2.5">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs border border-emerald-500/40">
                      1
                    </span>
                    <span>ทักทาย & ค้นหา Need</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>ทักทายสุภาพ น่ารัก อบอุ่น</li>
                    <li>
                      <strong>ถามโอกาสการใช้งาน:</strong> เช่น เยี่ยมไข้, แสดงความยินดี, มอบให้ผู้ใหญ่, วันเกิด
                    </li>
                    <li>
                      <strong>ถามงบประมาณที่มองไว้:</strong> เพื่อง่ายต่อการคัดเลือก
                    </li>
                    <li>
                      <strong>ถามผู้รับ:</strong> เพศ, วัย, ความชอบผลไม้
                    </li>
                    <li>
                      <strong>ถามวันและสถานที่ส่ง:</strong> เช็คคิวแมสเซนเจอร์
                    </li>
                  </ul>
                </div>

                {/* Stage 2 */}
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 space-y-2.5">
                  <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs border border-blue-500/40">
                      2
                    </span>
                    <span>นำเสนอแบบตามงบ & อัปเซล</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>
                      <strong>ส่งรูปแนะนำ 8-12 แบบ:</strong> ในช่วงราคา +- 200 บ. จากงบ
                    </li>
                    <li>
                      <strong>ผลไม้นอกฤดูกาล (เช่น เชอร์รี่):</strong> แจ้งสุภาพ แนะนำองุ่นไซน์มัสคัต/กีวี่ทองแทนทันที
                    </li>
                    <li>
                      <strong>เสนอ Up-sell ทุกเคส:</strong> อัปเกรดองุ่น Shine Muscat (+300 บ.) หรือ รังนกแท้ (+200 บ.)
                    </li>
                  </ul>
                </div>

                {/* Stage 3 */}
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 space-y-2.5">
                  <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs border border-purple-500/40">
                      3
                    </span>
                    <span>ปิดการขาย & เก็บ 7 จุด</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>เก็บข้อมูลจัดส่ง 7 จุดสำคัญครบถ้วน</li>
                    <li>แจ้งจุดดรอป รพ. (หากส่ง รพ.)</li>
                    <li>คำนวณค่าส่งจากจรัญ 59 แม่นยำ</li>
                    <li>
                      <strong>ส่งสรุปแบบ 3 บับเบิ้ล:</strong>
                      <div className="pl-4 text-[11px] text-slate-400">
                        1. สรุปยอด + ค่าส่ง<br />
                        2. ช่องทางชำระเงิน<br />
                        3. เลขบัญชีเดี่ยวๆ เพื่อกดก็อปปี้ง่าย
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 7-Point Checklist */}
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-semibold text-xs text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                  <span>ข้อมูลจัดส่ง 7 จุดสำคัญที่ต้องเก็บก่อนส่งมอบให้ Operation:</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `1. ชื่อ - เบอร์โทรผู้สั่ง:\n2. ชื่อ - เบอร์โทรผู้รับ:\n3. สถานที่จัดส่ง (ระบุอาคาร ชั้น ห้อง):\n4. วันและเวลาที่ต้องการให้ถึง:\n5. สีโบว์ที่ต้องการ:\n6. ข้อความเขียนการ์ดอวยพร:\n7. ต้องการรับใบกำกับภาษีหรือไม่:`,
                        '7points'
                      )
                    }
                    className="flex items-center space-x-1 text-slate-400 hover:text-white normal-case text-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedIndex === '7points' ? 'คัดลอกแล้ว' : 'คัดลอกแบบฟอร์ม 7 จุด'}</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="bg-slate-800/60 p-2 rounded border border-slate-700/60">
                    1. ชื่อ และเบอร์โทร ของผู้สั่ง
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded border border-slate-700/60">
                    2. ชื่อ และเบอร์โทร ของผู้รับสินค้า
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded border border-slate-700/60">
                    3. สถานที่จัดส่งอย่างละเอียด (บ้าน/คอนโด/รพ. ระบุตึก ชั้น ห้อง)
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded border border-slate-700/60">
                    4. วัน และเวลาที่ต้องการให้สินค้าถึงปลายทาง
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded border border-slate-700/60">
                    5. สีโบว์ที่ต้องการ (แดง/ทอง/น้ำเงิน/เขียว/ชมพู)
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded border border-slate-700/60">
                    6. ข้อความบนการ์ดอวยพร
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded border border-slate-700/60 col-span-1 sm:col-span-2 text-emerald-300">
                    7. ลูกค้าต้องการรับใบกำกับภาษีเต็มรูปแบบหรือไม่
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DELIVERY MATRIX */}
          {activeTab === 'delivery' && (
            <div className="space-y-5">
              <div className="p-3 bg-emerald-950/40 border border-emerald-700/40 rounded-xl text-xs text-emerald-200">
                <strong>📍 ศูนย์จัดส่งหลัก (Dispatch Hub):</strong> ซอยจรัญสนิทวงศ์ 59 (Charan 59) ทุกระยะทางจะวัดจากจุดนี้
              </div>

              {/* PMF Matrix */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-emerald-400 flex items-center space-x-2">
                  <span>🛵 แบรนด์ PMF (Premium Fruit Delivery)</span>
                  <span className="text-xs font-normal text-slate-400">(มอเตอร์ไซค์ควบคุมอุณหภูมิ & ล็อคกระเช้า)</span>
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-700">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-800 text-slate-300 border-b border-slate-700">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">ระยะทาง</th>
                        <th className="py-2.5 px-4 font-semibold">เงื่อนไขโปรโมชั่น</th>
                        <th className="py-2.5 px-4 font-semibold">อัตราค่าจัดส่ง</th>
                        <th className="py-2.5 px-4 font-semibold">หมายเหตุ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {DELIVERY_FEES_MATRIX.PMF.map((tier, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-4 font-medium text-white">{tier.range}</td>
                          <td className="py-2.5 px-4 text-emerald-300 font-semibold">{tier.condition}</td>
                          <td className="py-2.5 px-4 text-amber-300 font-bold">{tier.feeText}</td>
                          <td className="py-2.5 px-4 text-slate-400">{tier.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Uncle Ben (UB) */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-amber-400 flex items-center space-x-2">
                  <span>🚗 แบรนด์ Uncle Ben (UB)</span>
                  <span className="text-xs font-normal text-slate-400">(จัดส่งมาตรฐาน 2.5 - 4 ชม.)</span>
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-700">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-800 text-slate-300 border-b border-slate-700">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">ระยะทาง</th>
                        <th className="py-2.5 px-4 font-semibold">เงื่อนไข</th>
                        <th className="py-2.5 px-4 font-semibold">อัตราค่าบริการ</th>
                        <th className="py-2.5 px-4 font-semibold">หมายเหตุ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {DELIVERY_FEES_MATRIX.UB.map((tier, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-4 font-medium text-white">{tier.range}</td>
                          <td className="py-2.5 px-4 text-slate-300">{tier.condition}</td>
                          <td className="py-2.5 px-4 text-amber-300 font-bold">{tier.feeText}</td>
                          <td className="py-2.5 px-4 text-slate-400">{tier.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOSPITAL POLICIES */}
          {activeTab === 'hospital' && (
            <div className="space-y-4">
              <div className="p-3 bg-red-950/40 border border-red-700/50 rounded-xl text-xs text-red-200 flex items-start space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong>กฎเหล็กการจัดส่งโรงพยาบาล:</strong> เจ้าหน้าที่จัดส่ง (Messenger) <strong>ไม่สามารถขึ้นไปยังห้องพักผู้ป่วยบนตึกได้เด็ดขาด</strong> เนื่องจากนโยบายคัดกรองและการติดเชื้อของโรงพยาบาล
                  แอดมินต้องแจ้งลูกค้าทุกครั้ง และขอเบอร์ติดต่อญาติที่ลงมารับ หรือระบุเคาน์เตอร์พยาบาล/จุดรับของกลางชั้น 1
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {HOSPITAL_POLICIES.map((hosp, idx) => (
                  <div key={idx} className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-white text-xs">{hosp.name}</h5>
                      <span className="text-[10px] bg-red-900/60 text-red-200 px-2 py-0.5 rounded border border-red-700/60">
                        ห้ามขึ้นตึก
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-300">
                      <strong>จุดเสี่ยง:</strong> {hosp.zone}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2 rounded">
                      {hosp.instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: UP-SELLING & SEASONS */}
          {activeTab === 'upsell' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3">
                <h4 className="font-bold text-sm text-emerald-400">
                  🍈 ผลไม้นอกฤดูกาล (Out of Season) & การเสนอทดแทน
                </h4>
                <div className="text-xs text-slate-300 space-y-2">
                  <p>
                    <strong>กรณีลูกค้าถามหา "เชอร์รี่":</strong>
                  </p>
                  <div className="bg-slate-900 p-3 rounded-lg text-xs border border-slate-800 text-slate-300">
                    <span className="text-emerald-400 font-semibold block mb-1">
                      💡 สคริปต์ที่ถูกต้อง:
                    </span>
                    "เชอร์รี่ช่วงนี้เป็นช่วงนอกฤดูกาล (Out of season) ผลไม้จะไม่สดกรอบตามมาตรฐานของร้านค่ะ ทางร้านขออนุญาตแนะนำเป็น <strong>องุ่นไซน์มัสคัตญี่ปุ่น/เกาหลี</strong> หวานกรอบไร้เมล็ด หรือ <strong>บลูเบอร์รี่สดจัมโบ้</strong> แทน จะพรีเมียมและสวยงามมากๆ เลยค่ะ คุณลูกค้าสะดวกรับเป็นแบบนี้ไหมคะ?"
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3">
                <h4 className="font-bold text-sm text-amber-400">
                  💎 3 ท่า Up-selling สร้างยอดขายเพิ่ม
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5">
                    <span className="font-bold text-emerald-400">1. อัปเกรดองุ่น Shine Muscat</span>
                    <p className="text-slate-300">เพิ่ม +300 บาท จากองุ่นแดงธรรมดา ได้พวงไซน์มัสคัตเม็ดใหญ่</p>
                    <span className="text-[11px] text-slate-400 block">เหมาะกับ: งานแสดงความยินดี, วันเกิด</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5">
                    <span className="font-bold text-emerald-400">2. เพิ่มเซ็ตรังนกแท้บำรุง</span>
                    <p className="text-slate-300">เพิ่ม +200 บาท ได้รังนกแท้ตุ๋น 2 ขวด ผูกโบว์คู่กระเช้า</p>
                    <span className="text-[11px] text-slate-400 block">เหมาะกับ: กระเช้าเยี่ยมไข้, คุณแม่หลังคลอด</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5">
                    <span className="font-bold text-emerald-400">3. ขนมไหว้พระจันทร์ / ชา TWG</span>
                    <p className="text-slate-300">เพิ่ม +250 - 390 บาท คู่กระเช้ากล่องไม้พรีเมียม</p>
                    <span className="text-[11px] text-slate-400 block">เหมาะกับ: เทศกาล, สวัสดีปีใหม่ผู้ใหญ่</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SHIFT HANDOFF & DISCOUNTS */}
          {activeTab === 'shift' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                <h4 className="font-bold text-sm text-emerald-400">
                  ⏰ การบริหารกะเวลาทำงาน และส่งมอบงาน (Shift Handoff)
                </h4>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  <li>
                    <strong>กะเช้า (08:00 - 17:00 น.):</strong> ลงออเดอร์ใน Google Sheet ระบบ และทักแจ้ง Admin ในไลน์กลุ่ม
                  </li>
                  <li>
                    <strong>กะเย็น (17:00 - 20:00 น.):</strong> ลงออเดอร์ใน Sheet ระบบ และส่งข้อความสรุปเข้ากลุ่ม Line: <em>BKK Head office</em>
                  </li>
                  <li>
                    <strong>หลัง 20:00 น.:</strong> แคปภาพแชทลูกค้า พร้อมรายละเอียด 7 จุด ส่งเข้ากลุ่ม Admin เพื่อเตรียมคิวส่งวันถัดไป
                  </li>
                </ul>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                <h4 className="font-bold text-sm text-amber-400">
                  🎁 สิทธิพิเศษสำหรับสมาชิกใหม่ (Member Discounts)
                </h4>
                <p className="text-xs text-slate-300">
                  ใช้เป็นไพ่ตายในการดึงลูกค้าที่อ่านแล้วเงียบ หรือลังเลเรื่องราคา:
                </p>
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-slate-400">ซื้อครบ 1,000 บาท</div>
                    <div className="text-base font-bold text-emerald-400">ลด 50 บาท</div>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-slate-400">ซื้อครบ 1,500 บาท</div>
                    <div className="text-base font-bold text-emerald-400">ลด 100 บาท</div>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-slate-400">ซื้อครบ 2,000 บาท</div>
                    <div className="text-base font-bold text-emerald-400">ลด 150 บาท</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
