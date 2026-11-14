import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCheck, FileText } from 'lucide-react';

interface ThreeBubbleClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendThreeBubbles: (bubbles: string[]) => void;
  defaultBasketName?: string;
  defaultBasketPrice?: number;
  defaultDeliveryFee?: number;
}

export const ThreeBubbleClosingModal: React.FC<ThreeBubbleClosingModalProps> = ({
  isOpen,
  onClose,
  onSendThreeBubbles,
  defaultBasketName = 'กระเช้า Sweet Sunshine (B-02)',
  defaultBasketPrice = 1890,
  defaultDeliveryFee = 0,
}) => {
  const [basketName, setBasketName] = useState(defaultBasketName);
  const [basketPrice, setBasketPrice] = useState(defaultBasketPrice);
  const [addonName, setAddonName] = useState('อัปเกรดองุ่น Shine Muscat เกาหลี');
  const [addonPrice, setAddonPrice] = useState(300);
  const [hasAddon, setHasAddon] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState(defaultDeliveryFee);
  const [deliveryReason, setDeliveryReason] = useState('ฟรีโปรโมชั่นยอดครบ 1,500 บ.');
  const [bankName, setBankName] = useState('ธนาคารกสิกรไทย (KBANK)');
  const [accountNumber, setAccountNumber] = useState('123-4-56789-0');
  const [accountName, setAccountName] = useState('บจก. พรีเมียม ฟรุ๊ต เดลิเวอรี่');

  if (!isOpen) return null;

  const totalAmount = basketPrice + (hasAddon ? addonPrice : 0) + deliveryFee;

  // Generate Bubble 1: Order Breakdown
  const bubble1 = `สรุปยอดคำสั่งซื้อนะคะ 🛒
- ${basketName}: ${basketPrice.toLocaleString()} บาท
${hasAddon ? `- ${addonName}: ${addonPrice.toLocaleString()} บาท\n` : ''}- ค่าจัดส่ง (${deliveryFee === 0 ? 'ฟรี' : `${deliveryFee} บ.`}): ${deliveryReason}
✨ รวมยอดชำระทั้งสิ้น: ${totalAmount.toLocaleString()} บาทถ้วนค่ะ`;

  // Generate Bubble 2: Payment Note
  const bubble2 = `สามารถชำระเงินผ่านการโอนบัญชีธนาคารด้านล่างนี้ได้เลยนะคะ 💳
เมื่อโอนเรียบร้อย รบกวนส่งสลิปเพื่อยืนยันออเดอร์ให้แอดมินส่งต่อคิวจัดกระเช้าให้ทันทีค่ะ 🙏`;

  // Generate Bubble 3: Bank details only (for easy copy on mobile)
  const bubble3 = `${bankName}
เลขบัญชี: ${accountNumber}
ชื่อบัญชี: ${accountName}`;

  const handleSend = () => {
    onSendThreeBubbles([bubble1, bubble2, bubble3]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl text-slate-100 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-800/90 px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">
                ตัวช่วยปิดการขายเทคนิค "3 บับเบิ้ล" (3-Bubble Closing)
              </h3>
              <p className="text-xs text-slate-400">
                แยก 3 ข้อความตามมาตรฐาน SOP: บับเบิ้ลสรุปยอด, วิธีชำระ, และเลขบัญชีเดี่ยวๆ เพื่อให้ลูกค้ากดคัดลอกง่าย
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

        <div className="p-6 space-y-4">
          {/* Basket Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-300 font-medium mb-1 block">ชื่อกระเช้าที่เลือก:</label>
              <input
                type="text"
                value={basketName}
                onChange={(e) => setBasketName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium mb-1 block">ราคากระเช้า (บาท):</label>
              <input
                type="number"
                value={basketPrice}
                onChange={(e) => setBasketPrice(Number(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
              />
            </div>
          </div>

          {/* Addon / Upsell */}
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="addonCheck"
                  checked={hasAddon}
                  onChange={(e) => setHasAddon(e.target.checked)}
                  className="rounded text-emerald-500 bg-slate-700 border-slate-600 w-4 h-4"
                />
                <label htmlFor="addonCheck" className="text-xs font-semibold text-emerald-300">
                  มีรายการ Up-sell เพิ่มเติม (เช่น อัปเกรดองุ่น / เพิ่มรังนก)
                </label>
              </div>
            </div>

            {hasAddon && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-2">
                <div>
                  <input
                    type="text"
                    value={addonName}
                    onChange={(e) => setAddonName(e.target.value)}
                    placeholder="ชื่อรายการอัปเซล"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={addonPrice}
                    onChange={(e) => setAddonPrice(Number(e.target.value) || 0)}
                    placeholder="ราคาที่เพิ่ม (บาท)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Delivery Fee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-300 font-medium mb-1 block">ค่าจัดส่ง (บาท):</label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium mb-1 block">หมายเหตุค่าส่ง:</label>
              <input
                type="text"
                value={deliveryReason}
                onChange={(e) => setDeliveryReason(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
              />
            </div>
          </div>

          {/* 3-Bubble Live Preview */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>ตัวอย่างที่จะส่งเป็น 3 บับเบิ้ลเรียงกัน:</span>
              <span className="text-emerald-400 font-bold">รวมทั้งสิ้น {totalAmount.toLocaleString()} บาท</span>
            </div>

            <div className="space-y-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
              {/* Bubble 1 */}
              <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-xl p-2.5 text-emerald-100">
                <span className="text-[10px] text-emerald-400 font-semibold block mb-1">
                  💬 บับเบิ้ลที่ 1: สรุปยอดและค่าส่ง
                </span>
                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">{bubble1}</pre>
              </div>

              {/* Bubble 2 */}
              <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-xl p-2.5 text-emerald-100">
                <span className="text-[10px] text-emerald-400 font-semibold block mb-1">
                  💬 บับเบิ้ลที่ 2: ช่องทางชำระเงิน
                </span>
                <p className="font-sans text-xs leading-relaxed">{bubble2}</p>
              </div>

              {/* Bubble 3 */}
              <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-xl p-2.5 text-emerald-100">
                <span className="text-[10px] text-emerald-400 font-semibold block mb-1">
                  💬 บับเบิ้ลที่ 3: เลขบัญชีแยกเดี่ยว (เพื่อให้กดก็อปปี้ง่าย)
                </span>
                <pre className="whitespace-pre-wrap font-sans text-xs font-mono font-bold text-amber-300">{bubble3}</pre>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="pt-2">
            <button
              onClick={handleSend}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-white text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-900/30"
            >
              <Send className="w-4 h-4" />
              <span>ส่ง 3 บับเบิ้ลเข้าห้องแชททันที</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
