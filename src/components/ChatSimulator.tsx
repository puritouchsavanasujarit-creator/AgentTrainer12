import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Image as ImageIcon,
  Zap,
  FileText,
  Hospital,
  Calculator,
  CheckCheck,
  Sparkles,
  AlertCircle,
  Clock,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import { Scenario, ChatMessage } from '../types';

interface ChatSimulatorProps {
  scenario: Scenario;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isCustomerTyping: boolean;
  onOpenCatalog: () => void;
  onOpenQuickScripts: () => void;
  onOpenThreeBubble: () => void;
  onOpenCalculator: () => void;
  onOpenCheatSheet: (tab?: string) => void;
  examMode: boolean;
}

export const ChatSimulator: React.FC<ChatSimulatorProps> = ({
  scenario,
  messages,
  onSendMessage,
  isCustomerTyping,
  onOpenCatalog,
  onOpenQuickScripts,
  onOpenThreeBubble,
  onOpenCalculator,
  onOpenCheatSheet,
  examMode,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isCustomerTyping]);

  // Check if current text ends with an open question
  const checkQuestionEnding = (text: string): boolean => {
    const trimmed = text.trim();
    if (!trimmed) return false;
    if (trimmed.endsWith('?') || trimmed.endsWith('ไหม') || trimmed.endsWith('คะ') || trimmed.endsWith('ครับ') || trimmed.endsWith('หรือเปล่า') || trimmed.endsWith('ดีคะ') || trimmed.endsWith('ไหมคะ')) {
      return true;
    }
    const regex = /(\?|ไหม|คะ|ครับ|หรือเปล่า|ดีคะ|ไหมคะ|หรือยัง|อย่างไร|อะไร|ที่ไหน|เมื่อไหร่|ใช่ไหม)[ \t\n]*$/;
    return regex.test(trimmed);
  };

  const endsWithQuestion = checkQuestionEnding(inputText);

  const handleSend = () => {
    if (!inputText.trim() || isCustomerTyping) return;
    onSendMessage(inputText.trim());
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertTemplate = (template: string) => {
    setInputText((prev) => (prev ? `${prev}\n${template}` : template));
    textareaRef.current?.focus();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#849EB5] h-full overflow-hidden relative">
      {/* LINE OA Chat Top Bar */}
      <div className="bg-[#243447] text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0 border-b border-slate-700/80">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={scenario.customerAvatar}
              alt={scenario.customerName}
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#243447] rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-sm text-white">{scenario.customerName}</h2>
              <span className="bg-emerald-900/60 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-600/50">
                LINE Official Account
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate max-w-xs md:max-w-md">
              {scenario.customerGoal} (งบ ~{scenario.budget.toLocaleString()} บ.)
            </p>
          </div>
        </div>

        {/* Customer State / Status */}
        <div className="flex items-center space-x-2">
          {scenario.isHospital && (
            <button
              onClick={() => onOpenCheatSheet('hospital')}
              className="flex items-center space-x-1 px-2 py-1 rounded bg-red-900/80 text-red-200 text-xs border border-red-700 hover:bg-red-800 transition"
              title="เคสส่งโรงพยาบาล! คลิกดูกฎจุดดรอป"
            >
              <Hospital className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">ระวังกฎจุดดรอป รพ.</span>
            </button>
          )}

          <div className="bg-slate-800/90 text-xs px-2.5 py-1 rounded-lg text-slate-300 border border-slate-700 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">ระยะทาง:</span>
            <span className="font-semibold text-white">{scenario.distanceKm} กม.</span>
          </div>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {/* Top Scenario Notice */}
        <div className="text-center my-2">
          <div className="inline-block bg-black/25 text-white/90 text-xs px-3.5 py-1.5 rounded-full backdrop-blur-sm shadow-sm border border-white/10">
            📌 {scenario.title} — จุดหมาย: {scenario.destination}
          </div>
        </div>

        {messages.map((msg) => {
          const isCustomer = msg.sender === 'customer';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="text-center my-2">
                <span className="bg-black/30 text-white/80 text-[11px] px-3 py-1 rounded-full">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-end space-x-2 ${isCustomer ? 'justify-start' : 'justify-end'}`}
            >
              {isCustomer && (
                <img
                  src={scenario.customerAvatar}
                  alt={scenario.customerName}
                  className="w-8 h-8 rounded-full object-cover shrink-0 mb-1 border border-white/40 shadow-sm"
                />
              )}

              <div className={`max-w-[85%] sm:max-w-[70%] space-y-1.5 ${isCustomer ? 'items-start' : 'items-end'}`}>
                {/* Chat Bubble */}
                <div
                  className={`p-3 rounded-2xl shadow-md text-xs sm:text-sm leading-relaxed ${
                    isCustomer
                      ? 'bg-white text-slate-800 rounded-bl-xs border border-slate-200'
                      : 'bg-[#00B900] text-white rounded-br-xs font-medium'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Attached Products or Cards */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 space-y-2 pt-2 border-t border-black/10">
                      {msg.attachments.map((att, attIdx) => (
                        <div
                          key={attIdx}
                          className="bg-black/10 p-2.5 rounded-xl flex items-center space-x-3 overflow-hidden text-slate-900"
                        >
                          {att.imageUrl && (
                            <img
                              src={att.imageUrl}
                              alt={att.title || 'Fruit Basket'}
                              className="w-14 h-14 rounded-lg object-cover shrink-0 border border-white/50"
                            />
                          )}
                          <div className="text-xs">
                            <div className="font-bold text-slate-900 line-clamp-1">{att.title}</div>
                            {att.price && (
                              <div className="text-emerald-800 font-bold">฿{att.price.toLocaleString()}</div>
                            )}
                            {att.description && (
                              <div className="text-[11px] text-slate-700 line-clamp-1">{att.description}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sub-bubble Status (Timestamp + Golden Rule Indicator) */}
                <div
                  className={`flex items-center space-x-1.5 text-[10px] text-white/80 px-1 ${
                    isCustomer ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {!isCustomer && (
                    <>
                      <span title="อ่านแล้ว (Read)">
                        <CheckCheck className="w-3.5 h-3.5 text-white/90" />
                      </span>
                      {!examMode && (
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            msg.endedWithQuestion
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                          }`}
                          title={
                            msg.endedWithQuestion
                              ? 'ดีมาก! จบด้วยคำถามตามกฎ Golden Rule'
                              : 'คำเตือน: ข้อความนี้ไม่ได้จบด้วยคำถาม (เสี่ยงทำให้แชทเงียบ)'
                          }
                        >
                          {msg.endedWithQuestion ? 'จบด้วยคำถาม ✅' : 'ลืมคำถาม ⚠️'}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Customer Typing Indicator */}
        {isCustomerTyping && (
          <div className="flex items-center space-x-2">
            <img
              src={scenario.customerAvatar}
              alt={scenario.customerName}
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/40"
            />
            <div className="bg-white/90 px-3 py-2 rounded-2xl rounded-bl-xs text-xs text-slate-600 flex items-center space-x-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] text-slate-500 ml-1">ลูกค้ากำลังพิมพ์...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Toolbar */}
      <div className="bg-slate-900/95 border-t border-slate-800 px-3 py-2 flex items-center space-x-2 overflow-x-auto shrink-0 shadow-lg">
        {/* Catalog 8-12 Button */}
        <button
          onClick={onOpenCatalog}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs border border-emerald-500/40 whitespace-nowrap transition"
        >
          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>ส่งรูปแคตตาล็อก 8-12 แบบ</span>
        </button>

        {/* Quick Reply Snippets */}
        <button
          onClick={onOpenQuickScripts}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 whitespace-nowrap transition"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>คลังสคริปต์ด่วน</span>
        </button>

        {/* 7-Point Info Template */}
        <button
          onClick={() =>
            insertTemplate(
              `เพื่อความถูกต้องในการจัดส่ง รบกวนคุณลูกค้าแจ้งรายละเอียด 7 จุดนี้ได้เลยนะคะ 📝
1. ชื่อ - เบอร์โทรผู้สั่ง:
2. ชื่อ - เบอร์โทรผู้รับ:
3. สถานที่จัดส่ง (ระบุอาคาร ชั้น ห้อง):
4. วันและเวลาที่ต้องการให้ถึง:
5. สีโบว์ที่ต้องการ (แดง/ทอง/น้ำเงิน/เขียว):
6. ข้อความบนการ์ดอวยพร:
7. ต้องการรับใบกำกับภาษีหรือไม่คะ?`
            )
          }
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 whitespace-nowrap transition"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span>ขอข้อมูล 7 จุด</span>
        </button>

        {/* Hospital Notice Template */}
        {scenario.isHospital && (
          <button
            onClick={() =>
              insertTemplate(
                `ขออนุญาตแจ้งข้อมูลการจัดส่งโรงพยาบาลนะคะ ทางโรงพยาบาลมีมาตรการรักษาความปลอดภัย ไม่อนุญาตให้แมสเซนเจอร์ขึ้นห้องพักผู้ป่วย ทางร้านจะประสานงานส่งที่จุดรับของกลางชั้น 1 นะคะ รบกวนขอชื่อตึก ชั้น และเลขห้องคนไข้ด้วยนะคะ?`
              )
            }
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-200 text-xs border border-red-700/60 whitespace-nowrap transition"
          >
            <Hospital className="w-3.5 h-3.5 text-red-400" />
            <span>กฎจุดดรอป รพ.</span>
          </button>
        )}

        {/* 3-Bubble Closing Modal */}
        <button
          onClick={onOpenThreeBubble}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs whitespace-nowrap transition shadow"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>ปิดการขาย 3 บับเบิ้ล</span>
        </button>

        {/* Delivery Fee Calculator */}
        <button
          onClick={onOpenCalculator}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 whitespace-nowrap transition"
        >
          <Calculator className="w-3.5 h-3.5 text-emerald-400" />
          <span>คำนวณค่าส่ง</span>
        </button>
      </div>

      {/* Input Area */}
      <div className="bg-slate-900 p-3 border-t border-slate-800 shrink-0 space-y-2">
        {/* Real-time Golden Rule Indicator Helper */}
        <div className="flex items-center justify-between text-[11px] px-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">กฎ Golden Rule:</span>
            {endsWithQuestion ? (
              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>จบด้วยคำถามแล้ว (พร้อมส่ง!)</span>
              </span>
            ) : inputText.trim().length > 5 ? (
              <span className="text-amber-400 flex items-center space-x-1 animate-pulse">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>คำเตือน: ยังไม่ได้ใส่คำถามทิ้งท้าย (เช่น '...ดีไหมคะ?')</span>
              </span>
            ) : (
              <span className="text-slate-500">
                พิมพ์คำตอบ และอย่าลืมทิ้งคำถามเปิดเสมอ
              </span>
            )}
          </div>

          <span className="text-slate-500 text-[10px]">
            กด Enter เพื่อส่ง (Shift+Enter เพื่อขึ้นบรรทัดใหม่)
          </span>
        </div>

        {/* Text Input + Send Button */}
        <div className="flex items-end space-x-2">
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="พิมพ์ข้อความตอบกลับลูกค้าใน LINE (อย่าลืมทิ้งคำถามไว้ให้ลูกค้าเสมอ)..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none leading-relaxed"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isCustomerTyping}
            className={`p-3 rounded-xl flex items-center justify-center transition shadow-md ${
              inputText.trim() && !isCustomerTyping
                ? 'bg-[#00B900] hover:bg-[#009e00] text-white cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
            title="ส่งข้อความ"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
