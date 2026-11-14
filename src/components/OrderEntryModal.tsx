import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  AlertTriangle,
  Receipt,
  User,
  MapPin,
  Gift,
} from 'lucide-react';
import { Scenario, ChatMessage } from '../types';

interface OrderEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: Scenario;
  messages: ChatMessage[];
  onSubmitOrder: (orderDetails: Record<string, string | number | boolean>) => void;
}

export const OrderEntryModal: React.FC<OrderEntryModalProps> = ({
  isOpen,
  onClose,
  scenario,
  messages,
  onSubmitOrder,
}) => {
  const [orderNumber] = useState(`PMF-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-008`);
  const [deliveryDate, setDeliveryDate] = useState('2026-11-13');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('10:00 - 12:00 น.');
  const [senderName, setSenderName] = useState(scenario.customerName);
  const [senderPhone, setSenderPhone] = useState('081-234-5678');
  const [recipientName, setRecipientName] = useState('คุณสมใจ มิตรสถิตย์');
  const [recipientPhone, setRecipientPhone] = useState('089-987-6543');
  const [address, setAddress] = useState(scenario.destination);
  const [basketItem, setBasketItem] = useState('กระเช้า Sweet Sunshine (B-02)');
  const [addonItem, setAddonItem] = useState('อัปเกรดองุ่น Shine Muscat เกาหลี (+300 บ.)');
  const [ribbonColor, setRibbonColor] = useState('สีทองมงคล (Gold)');
  const [cardMessage, setCardMessage] = useState('ขอแสดงความยินดีในตำแหน่งใหม่ ขอให้ประสบความสำเร็จยิ่งๆ ขึ้นไปนะคะ');
  const [taxInvoice, setTaxInvoice] = useState(false);
  const [shiftHandoff, setShiftHandoff] = useState('กะเช้า (08:00 - 17:00 น.) - แจ้งในไลน์กลุ่ม Admin');
  const [paymentStatus, setPaymentStatus] = useState('โอนชำระเรียบร้อย (มีสลิปยืนยัน)');
  const [deliveryFee, setDeliveryFee] = useState(scenario.distanceKm <= 10 ? 0 : 159);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Auto-fill from chat history
  const handleAutoExtract = () => {
    // Scan messages for keywords
    const fullText = messages.map((m) => m.text).join('\n');
    if (fullText.includes('ศิริราช')) {
      setAddress('รพ.ศิริราช ตึก 84 พรรษา ชั้น 7 ห้อง 704 (ฝากโต๊ะรับของกลางชั้น 1)');
      setBasketItem('กระเช้าผลไม้บำรุงสุขภาพ Health & Care (B-03)');
      setAddonItem('เพิ่มรังนกแท้ Premium Bird Nest 2 ขวด (+200 บ.)');
      setCardMessage('ขอให้คุณแม่หายป่วยเร็วๆ สุขภาพแข็งแรงนะคะ');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      onSubmitOrder({
        orderNumber,
        senderName,
        recipientName,
        address,
        basketItem,
        ribbonColor,
        cardMessage,
        deliveryFee,
        shiftHandoff,
      });
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl text-slate-100 shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/90 px-6 py-4 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">
                แบบฟอร์มคีย์ออเดอร์ส่งทีมจัดส่ง (Order Entry Sheet)
              </h3>
              <p className="text-xs text-slate-400">
                ขั้นตอนส่งต่องานหลังปิดการขาย: กรอกข้อมูล 7 จุดสำคัญเข้าระบบเพื่อส่งทีมจัดกระเช้าและแมสเซนเจอร์
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

        {/* Action helper */}
        <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 px-6 py-2.5 border-b border-emerald-900/40 flex items-center justify-between shrink-0">
          <span className="text-xs text-emerald-300">
            💡 ตรวจสอบข้อมูล 7 จุดจากการสนทนาใน LINE
          </span>
          <button
            type="button"
            onClick={handleAutoExtract}
            className="text-xs bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-lg flex items-center space-x-1 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ดึงข้อมูลจากห้องแชทอัตโนมัติ</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Order Meta Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-850 p-3.5 rounded-xl border border-slate-800">
            <div>
              <label className="text-slate-400 block mb-1">รหัสออเดอร์ (Order ID):</label>
              <input
                type="text"
                disabled
                value={orderNumber}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-emerald-400 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">วันที่จัดส่ง:</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">รอบเวลาจัดส่ง:</label>
              <input
                type="text"
                value={deliveryTimeSlot}
                onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
              />
            </div>
          </div>

          {/* Section 1: Customer & Recipient (Points 1 & 2) */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs flex items-center space-x-1.5 text-emerald-400">
              <User className="w-4 h-4" />
              <span>1. ข้อมูลผู้สั่ง และ ผู้รับสินค้า (จุดที่ 1 & 2)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">ชื่อผู้สั่งสินค้า:</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-medium">เบอร์โทรผู้สั่ง:</label>
                <input
                  type="text"
                  required
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-medium">ชื่อผู้รับสินค้า:</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-medium">เบอร์โทรผู้รับปลายทาง:</label>
                <input
                  type="text"
                  required
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Destination & Hospital Drop-point (Point 3) */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs flex items-center space-x-1.5 text-emerald-400">
              <MapPin className="w-4 h-4" />
              <span>2. สถานที่จัดส่งและจุดดรอป รพ. (จุดที่ 3)</span>
            </h4>
            <div>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="ระบุสถานที่ บ้าน/อาคาร/ชั้น/ห้อง หรือจุดรับของกลาง รพ."
                className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-white leading-relaxed resize-none"
              />
            </div>
            {scenario.isHospital && (
              <div className="p-2 rounded bg-red-950/50 border border-red-700/60 text-[11px] text-red-200 flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>
                  ตรวจสอบ: เคสโรงพยาบาล แมสขึ้นตึกไม่ได้ ต้องระบุจุดดรอปและให้ญาติลงมารับ
                </span>
              </div>
            )}
          </div>

          {/* Section 3: Basket, Add-on, Ribbon & Card (Points 4, 5, 6) */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs flex items-center space-x-1.5 text-emerald-400">
              <Gift className="w-4 h-4" />
              <span>3. รายการกระเช้า, โบว์, และข้อความการ์ด (จุดที่ 4, 5, 6)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">รายการกระเช้าผลไม้:</label>
                <input
                  type="text"
                  required
                  value={basketItem}
                  onChange={(e) => setBasketItem(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-medium">รายการ Up-sell (ถ้ามี):</label>
                <input
                  type="text"
                  value={addonItem}
                  onChange={(e) => setAddonItem(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-medium">สีโบว์ที่ลูกค้าเลือก:</label>
                <select
                  value={ribbonColor}
                  onChange={(e) => setRibbonColor(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                >
                  <option value="สีทองมงคล (Gold)">สีทองมงคล (Gold)</option>
                  <option value="สีแดงมงคล (Red)">สีแดงมงคล (Red)</option>
                  <option value="สีน้ำเงินเข้มหรูหรา (Navy)">สีน้ำเงินเข้มหรูหรา (Navy)</option>
                  <option value="สีเขียวมรกต (Emerald Green)">สีเขียวมรกต (Emerald Green)</option>
                  <option value="สีชมพูหวานละมุน (Soft Pink)">สีชมพูหวานละมุน (Soft Pink)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-medium">ค่าจัดส่ง (บาท):</label>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Number(e.target.value) || 0)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">ข้อความเขียนการ์ดอวยพร:</label>
              <textarea
                rows={2}
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
                placeholder="ระบุข้อความอวยพรที่จะปริ้นท์ใส่การ์ด Calligraphy"
                className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-white leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Section 4: Tax Invoice & Shift (Point 7 & Shift) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-850 p-3.5 rounded-xl border border-slate-800">
            <div className="space-y-2">
              <label className="font-medium text-slate-300 block">ใบกำกับภาษี (จุดที่ 7):</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="taxCheck"
                  checked={taxInvoice}
                  onChange={(e) => setTaxInvoice(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 bg-slate-700 border-slate-600"
                />
                <label htmlFor="taxCheck" className="text-slate-300 cursor-pointer">
                  ลูกค้าต้องการรับใบกำกับภาษีเต็มรูปแบบ
                </label>
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-300 block mb-1">การส่งมอบกะ (Shift Protocol):</label>
              <select
                value={shiftHandoff}
                onChange={(e) => setShiftHandoff(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs"
              >
                <option value="กะเช้า (08:00 - 17:00 น.) - แจ้งในไลน์กลุ่ม Admin">
                  08:00 - 17:00 น. (คีย์ Sheet + แจ้งไลน์กลุ่ม Admin)
                </option>
                <option value="กะเย็น (17:00 - 20:00 น.) - ส่งเข้ากลุ่ม BKK Head office">
                  17:00 - 20:00 น. (คีย์ Sheet + สรุปเข้ากลุ่ม BKK Head office)
                </option>
                <option value="หลัง 20:00 น. - แคปแชทพร้อม 7 จุดเข้ากลุ่มเตรียมคิวเช้า">
                  หลัง 20:00 น. (แคปแชท + 7 จุด เตรียมคิวเช้า)
                </option>
              </select>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSuccess}
              className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition shadow-lg ${
                isSuccess
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
              }`}
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
                  <span>บันทึกและส่งมอบงานให้ทีมจัดส่งสำเร็จ! 🎉</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>บันทึกออเดอร์และส่งมอบงานให้ฝ่ายจัดส่ง (Submit to OP)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
