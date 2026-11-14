import React, { useState, useEffect, useCallback } from 'react';
import { SCENARIOS } from './data/trainingData';
import { Scenario, ChatMessage, SopChecklist, FruitProduct, LeaderboardEntry } from './types';
import { Header } from './components/Header';
import { ChatSimulator } from './components/ChatSimulator';
import { CoachSidebar } from './components/CoachSidebar';
import { DeliveryCalculatorModal } from './components/DeliveryCalculatorModal';
import { CheatSheetModal } from './components/CheatSheetModal';
import { ThreeBubbleClosingModal } from './components/ThreeBubbleClosingModal';
import { CatalogPickerModal } from './components/CatalogPickerModal';
import { QuickScriptDrawer } from './components/QuickScriptDrawer';
import { EvaluationSummaryModal } from './components/EvaluationSummaryModal';
import { InteractiveDeliveryMap } from './components/InteractiveDeliveryMap';
import { OrderEntryModal } from './components/OrderEntryModal';
import { ObjectionTrainerModal } from './components/ObjectionTrainerModal';
import { Leaderboard } from './components/Leaderboard';
import { CelebrationConfetti } from './components/CelebrationConfetti';
import { soundManager } from './utils/soundEffects';
import {
  getLeaderboardEntries,
  saveLeaderboardEntry,
  deleteLeaderboardEntry,
  clearLeaderboardEntries,
  getSavedTraineeName,
  computeGrade,
} from './utils/leaderboardStorage';
import { X } from 'lucide-react';

const initialChecklist: SopChecklist = {
  greetingPolite: false,
  askedOccasion: false,
  askedBudget: false,
  askedRecipientProfile: false,
  askedDeliveryLocation: false,
  recommendedWithinBudget: false,
  seasonalFruitHandled: false,
  upsellOffered: false,
  senderInfoCollected: false,
  recipientInfoCollected: false,
  hospitalRuleNotified: false,
  deliveryTimeCollected: false,
  ribbonColorCollected: false,
  cardMessageCollected: false,
  taxInvoiceAsked: false,
  threeBubbleClosingUsed: false,
  goldenRuleMaintained: true,
};

export default function App() {
  const [currentScenario, setCurrentScenario] = useState<Scenario>(SCENARIOS[0]);
  const [examMode, setExamMode] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isCustomerTyping, setIsCustomerTyping] = useState<boolean>(false);
  const [score, setScore] = useState<number>(65);
  const [checklist, setChecklist] = useState<SopChecklist>(initialChecklist);
  const [lastGoldenRulePassed, setLastGoldenRulePassed] = useState<boolean | null>(null);
  const [goldenRuleStats, setGoldenRuleStats] = useState<{ count: number; total: number }>({
    count: 0,
    total: 0,
  });
  const [coachFeedbackHistory, setCoachFeedbackHistory] = useState<
    Array<{ praise?: string; improvement?: string; feedback?: string }>
  >([]);
  const [lastFeedback, setLastFeedback] = useState<{
    feedback?: string;
    praise?: string;
    improvement?: string;
  } | null>(null);

  // Modals state
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [cheatSheetTab, setCheatSheetTab] = useState('sop');
  const [isThreeBubbleOpen, setIsThreeBubbleOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isQuickScriptsOpen, setIsQuickScriptsOpen] = useState(false);
  const [isEvaluationSummaryOpen, setIsEvaluationSummaryOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isOrderEntryOpen, setIsOrderEntryOpen] = useState(false);
  const [isObjectionTrainerOpen, setIsObjectionTrainerOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>(() =>
    getLeaderboardEntries()
  );
  const [currentTraineeName, setCurrentTraineeName] = useState<string>(() =>
    getSavedTraineeName()
  );
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasCelebratedMilestone, setHasCelebratedMilestone] = useState(false);
  const [evaluatingCount, setEvaluatingCount] = useState(0);

  // Trigger confetti celebration when trainee reaches 90+ during Practice (Coach) mode
  useEffect(() => {
    if (!examMode && score >= 90 && !hasCelebratedMilestone) {
      setShowConfetti(true);
      setHasCelebratedMilestone(true);
      soundManager.playCelebration();
    }
  }, [score, examMode, hasCelebratedMilestone]);

  // Reset or load scenario
  const loadScenario = useCallback((scenario: Scenario) => {
    setCurrentScenario(scenario);
    setChecklist(initialChecklist);
    setScore(60);
    setLastGoldenRulePassed(null);
    setGoldenRuleStats({ count: 0, total: 0 });
    setCoachFeedbackHistory([]);
    setLastFeedback(null);
    setShowConfetti(false);
    setHasCelebratedMilestone(false);
    setEvaluatingCount(0);

    // Initial customer message
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([
      {
        id: 'msg-init',
        sender: 'customer',
        text: scenario.initialMessage,
        timestamp: now,
      },
    ]);
  }, []);

  useEffect(() => {
    loadScenario(currentScenario);
  }, [loadScenario]);

  // Check if string ends with an open question
  const checkQuestionEnding = (text: string): boolean => {
    const trimmed = text.trim();
    if (!trimmed) return false;
    const regex = /(\?|ไหม|คะ|ครับ|หรือเปล่า|ดีคะ|ไหมคะ|หรือยัง|อย่างไร|อะไร|ที่ไหน|เมื่อไหร่|ใช่ไหม)[ \t\n]*$/;
    return regex.test(trimmed);
  };

  // Evaluate message and update checklist locally or via Gemini
  const evaluateAdminMessage = async (text: string, currentMsgs: ChatMessage[]) => {
    const hasQuestion = checkQuestionEnding(text);
    setLastGoldenRulePassed(hasQuestion);
    setGoldenRuleStats((prev) => ({
      count: prev.count + (hasQuestion ? 1 : 0),
      total: prev.total + 1,
    }));

    // Heuristic detection based on SOP keywords
    const lower = text.toLowerCase();
    const updated = { ...checklist };

    if (lower.includes('สวัสดี') || lower.includes('ยินดีต้อนรับ') || lower.includes('ยินดีให้บริการ')) {
      updated.greetingPolite = true;
    }
    if (lower.includes('โอกาส') || lower.includes('เนื่องใน') || lower.includes('เยี่ยม') || lower.includes('ยินดี')) {
      updated.askedOccasion = true;
    }
    if (lower.includes('งบ') || lower.includes('ราคา') || lower.includes('ประมาณ')) {
      updated.askedBudget = true;
    }
    if (lower.includes('ผู้รับ') || lower.includes('ผู้ใหญ่') || lower.includes('ผู้หญิง') || lower.includes('ชอบผลไม้')) {
      updated.askedRecipientProfile = true;
    }
    if (lower.includes('ส่งที่ไหน') || lower.includes('สถานที่') || lower.includes('เวลา') || lower.includes('วันไหน')) {
      updated.askedDeliveryLocation = true;
    }
    if (lower.includes('แนะนำ') || lower.includes('แบบ') || lower.includes('รูป') || lower.includes('แคตตาล็อก')) {
      updated.recommendedWithinBudget = true;
    }
    if (
      lower.includes('นอกฤดูกาล') ||
      lower.includes('เชอร์รี่') ||
      lower.includes('ทดแทน') ||
      lower.includes('มัสคัต') ||
      lower.includes('บลูเบอร์รี่') ||
      lower.includes('กีวี่')
    ) {
      updated.seasonalFruitHandled = true;
    }
    if (
      lower.includes('อัปเกรด') ||
      lower.includes('shine muscat') ||
      lower.includes('ไซน์มัสคัต') ||
      lower.includes('รังนก') ||
      lower.includes('+300') ||
      lower.includes('+200')
    ) {
      updated.upsellOffered = true;
    }
    if (
      lower.includes('ผู้สั่ง') &&
      lower.includes('ผู้รับ') &&
      (lower.includes('การ์ด') || lower.includes('โบว์') || lower.includes('ใบกำกับภาษี'))
    ) {
      updated.recipientInfoCollected = true;
    }
    if (
      lower.includes('โรงพยาบาล') ||
      lower.includes('ขึ้นตึกไม่ได้') ||
      lower.includes('จุดรับของ') ||
      lower.includes('จุดดรอป') ||
      lower.includes('ชั้น 1')
    ) {
      updated.hospitalRuleNotified = true;
    }
    if (lower.includes('สรุปยอด') || lower.includes('เลขที่บัญชี') || lower.includes('กสิกร')) {
      updated.threeBubbleClosingUsed = true;
    }

    setChecklist(updated);

    // Call server evaluation endpoint
    setEvaluatingCount((c) => c + 1);
    try {
      try {
        const res = await fetch('/api/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenario: currentScenario,
            messages: currentMsgs,
            lastAdminMessage: text,
          }),
        });

        if (res.ok) {
          const evalData = await res.json();
          if (evalData.score) {
            setScore((prev) => Math.min(100, Math.max(prev, evalData.score)));
          }
          const fb = {
            feedback: evalData.feedback,
            praise: evalData.praise,
            improvement: evalData.improvement,
          };
          setLastFeedback(fb);
          setCoachFeedbackHistory((prev) => [...prev, fb]);
          return;
        }
      } catch {
        // Fallback local scoring if server is not reached
      }

      // Fallback scoring calculation
      let calculatedScore = 55;
      if (updated.greetingPolite) calculatedScore += 5;
      if (updated.askedOccasion) calculatedScore += 7;
      if (updated.askedBudget) calculatedScore += 7;
      if (updated.recommendedWithinBudget) calculatedScore += 8;
      if (updated.seasonalFruitHandled) calculatedScore += 8;
      if (updated.upsellOffered) calculatedScore += 8;
      if (updated.recipientInfoCollected) calculatedScore += 8;
      if (updated.hospitalRuleNotified) calculatedScore += 8;
      if (updated.threeBubbleClosingUsed) calculatedScore += 10;
      if (hasQuestion) calculatedScore += 5;

      setScore(Math.min(100, calculatedScore));

      const fallbackFeedback = {
        praise: hasQuestion
          ? 'ปฏิบัติตามกฎ Golden Rule ได้อย่างยอดเยี่ยม จบด้วยคำถามเปิดเสมอ'
          : 'ตอบสนองอย่างสุภาพ รวดเร็ว และเป็นมิตร',
        improvement: !hasQuestion
          ? 'อย่าลืมจบท้ายด้วยคำถามเพื่อไม่ให้บทสนทนาเงียบหายไปนะคะ'
          : 'เสนอ Up-sell หรือตรวจสอบข้อมูล 7 จุดเพื่อเร่งปิดการขาย',
      };
      setLastFeedback(fallbackFeedback);
      setCoachFeedbackHistory((prev) => [...prev, fallbackFeedback]);
    } finally {
      setEvaluatingCount((c) => Math.max(0, c - 1));
    }
  };

  // Trigger customer reply
  const fetchCustomerReply = async (allMsgs: ChatMessage[], lastAdminMsg: string) => {
    setIsCustomerTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: currentScenario,
          messages: allMsgs,
          lastAdminMessage: lastAdminMsg,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const replyText = data.customerReply || 'ขอบคุณค่ะ ขอพิจารณาสักครู่นะคะ';

        setTimeout(() => {
          soundManager.playIncomingMessage();
          setMessages((prev) => [
            ...prev,
            {
              id: `msg-${Date.now()}`,
              sender: 'customer',
              text: replyText,
              timestamp: now,
            },
          ]);
          setIsCustomerTyping(false);
        }, 1200);
        return;
      }
    } catch {
      // Fallback response if offline
    }

    // Realistic fallback responses based on keywords
    setTimeout(() => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const lower = lastAdminMsg.toLowerCase();
      let reply = 'ขอบคุณสำหรับข้อมูลนะคะ มีแบบไหนที่แนะนำอีกไหมคะ?';

      if (lower.includes('โอกาส') || lower.includes('เนื่องใน')) {
        reply = `จะสั่งไปใช้สำหรับ ${currentScenario.customerGoal} ค่ะ ไม่ทราบว่างบประมาณ ${currentScenario.budget.toLocaleString()} บาท มีแบบไหนจัดสวยๆ บ้างคะ?`;
      } else if (lower.includes('งบ')) {
        reply = `งบประมาณตั้งไว้ราวๆ ${currentScenario.budget.toLocaleString()} บาทค่ะ ขอแบบดูดี ผลไม้สดใหม่นะคะ`;
      } else if (lower.includes('เชอร์รี่') || lower.includes('นอกฤดูกาล')) {
        reply = 'อ๋อ เชอร์รี่นอกฤดูกาลเหรอคะ ถ้างั้นเปลี่ยนเป็นองุ่นไซน์มัสคัตหรือบลูเบอร์รี่ตามที่แนะนำก็ได้ค่ะ น่าทานเหมือนกัน';
      } else if (lower.includes('อัปเกรด') || lower.includes('รังนก') || lower.includes('มัสคัต')) {
        reply = 'ดีเลยค่ะ ดูคุ้มค่าและพรีเมียมขึ้นมาก ขอเพิ่มอันนี้ไปด้วยเลยนะคะ รบกวนรวมยอดให้หน่อยค่ะ';
      } else if (lower.includes('7 จุด') || lower.includes('ผู้สั่ง') || lower.includes('ผู้รับ')) {
        reply = `แจ้งข้อมูลจัดส่งค่ะ:
1. ผู้สั่ง: ${currentScenario.customerName} โทร 081-234-5678
2. ผู้รับ: คุณสมใจ โทร 089-987-6543
3. ที่อยู่: ${currentScenario.destination}
4. วันเวลา: พรุ่งนี้ช่วงเช้า 10:00 น.
5. โบว์: โทนสีทอง/แดง สุภาพค่ะ
6. การ์ด: "ขอแสดงความยินดีในตำแหน่งใหม่ ขอให้ประสบความสำเร็จยิ่งขึ้นไปนะคะ"
7. ไม่รับใบกำกับภาษีค่ะ`;
      } else if (lower.includes('โรงพยาบาล') || lower.includes('จุดรับของ') || lower.includes('จุดดรอป')) {
        reply = 'รับทราบเรื่องข้อกำหนดโรงพยาบาลค่ะ เดี๋ยวแจ้งเบอร์ญาติไว้ให้แมสโทรประสานงานจุดรับของกลางชั้น 1 นะคะ ขอบคุณที่แจ้งเตือนค่ะ';
      } else if (lower.includes('เลขที่บัญชี') || lower.includes('สรุปยอด') || lower.includes('บับเบิ้ล')) {
        reply = 'ได้รับยอดและเลขบัญชีเรียบร้อยค่ะ กำลังโอนให้นะคะ... โอนเรียบร้อยแล้วค่ะ! [แนบสลิปโอนเงินเรียบร้อย] ขอบคุณแอดมินที่ดูแลเป็นอย่างดีนะคะ 🙏✨';
      }

      soundManager.playIncomingMessage();
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'customer',
          text: reply,
          timestamp: now,
        },
      ]);
      setIsCustomerTyping(false);
    }, 1200);
  };

  // Trainee sends message
  const handleSendMessage = (text: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hasQuestion = checkQuestionEnding(text);

    // Audio effects
    soundManager.playMessageSent();
    if (hasQuestion) {
      soundManager.playGoldenRulePass();
    } else {
      soundManager.playWarning();
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      text,
      timestamp: now,
      endedWithQuestion: hasQuestion,
    };

    const newHistory = [...messages, newMsg];
    setMessages(newHistory);

    // Evaluate message against SOP
    evaluateAdminMessage(text, newHistory);

    // Trigger AI customer reply
    fetchCustomerReply(newHistory, text);
  };

  // Send product recommendation card
  const handleSendProduct = (product: FruitProduct) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const text = `ขออนุญาตแนะนำ "${product.name}" (${product.code}) ราคา ${product.price.toLocaleString()} บาท นะคะ 🍎✨
ผลไม้คัดเกรดพรีเมียม: ${product.fruitsIncluded.join(', ')}
${product.upsellOption ? `(สามารถเลือก ${product.upsellOption.name} เพิ่มได้นะคะ)` : ''}
คุณลูกค้าชอบสไตล์หรือโทนผลไม้ของกระเช้านี้ไหมคะ?`;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      text,
      timestamp: now,
      endedWithQuestion: true,
      attachments: [
        {
          type: 'product_card',
          title: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          description: product.fruitsIncluded.join(', '),
        },
      ],
    };

    const newHistory = [...messages, newMsg];
    setMessages(newHistory);
    evaluateAdminMessage(text, newHistory);
    fetchCustomerReply(newHistory, text);
  };

  // Send 8-12 photo album recommendation
  const handleSendAlbum = (budget: number) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const text = `แอดมินส่งรูปตัวอย่างกระเช้าผลไม้พรีเมียม 8-12 แบบ ในช่วงงบประมาณ ${budget.toLocaleString()} บาท ให้เลือกชมเรียบร้อยนะคะ 📸✨
ทุกแบบจัดด้วยผลไม้สดนำเข้าเกรดพิเศษ พร้อมผูกโบว์และการ์ดอวยพรค่ะ คุณลูกค้าถูกใจแบบไหนหรืออยากปรับเปลี่ยนผลไม้ชนิดใดเป็นพิเศษไหมคะ?`;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      text,
      timestamp: now,
      endedWithQuestion: true,
      attachments: [
        {
          type: 'catalog',
          title: `อัลบั้มกระเช้าผลไม้พรีเมียม 8-12 แบบ (ช่วงราคา ${(budget - 200).toLocaleString()} - ${(budget + 300).toLocaleString()} บ.)`,
          imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&auto=format&fit=crop&q=80',
          description: 'รวมแบบยอดนิยม คัดเกรดสดใหม่ทุกวัน',
        },
      ],
    };

    const newHistory = [...messages, newMsg];
    setMessages(newHistory);
    evaluateAdminMessage(text, newHistory);
    fetchCustomerReply(newHistory, text);
  };

  // Send three bubbles closing
  const handleSendThreeBubbles = (bubbles: string[]) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsgs: ChatMessage[] = bubbles.map((bText, idx) => ({
      id: `msg-${Date.now()}-${idx}`,
      sender: 'admin',
      text: bText,
      timestamp: now,
      endedWithQuestion: idx === 1 || bText.includes('นะคะ') || bText.includes('คะ?'),
    }));

    const newHistory = [...messages, ...newMsgs];
    setMessages(newHistory);
    evaluateAdminMessage(bubbles.join('\n'), newHistory);
    fetchCustomerReply(newHistory, bubbles.join('\n'));
  };

  const handleNextScenario = () => {
    const currentIndex = SCENARIOS.findIndex((s) => s.id === currentScenario.id);
    if (currentIndex < SCENARIOS.length - 1) {
      loadScenario(SCENARIOS[currentIndex + 1]);
    }
  };

  const hasNextScenario =
    SCENARIOS.findIndex((s) => s.id === currentScenario.id) < SCENARIOS.length - 1;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Top Navigation */}
      <Header
        currentScenario={currentScenario}
        scenarios={SCENARIOS}
        onSelectScenario={loadScenario}
        examMode={examMode}
        onToggleExamMode={() => setExamMode((prev) => !prev)}
        onOpenCheatSheet={(tab = 'sop') => {
          setCheatSheetTab(tab);
          setIsCheatSheetOpen(true);
        }}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenOrderEntry={() => setIsOrderEntryOpen(true)}
        onOpenObjectionTrainer={() => setIsObjectionTrainerOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        leaderboardCount={leaderboardEntries.length}
        onResetChat={() => loadScenario(currentScenario)}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = soundManager.toggleSound();
          setSoundEnabled(next);
        }}
        score={score}
      />

      {/* Main Workspace: Chat Simulator + Coach Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <ChatSimulator
          scenario={currentScenario}
          messages={messages}
          onSendMessage={handleSendMessage}
          isCustomerTyping={isCustomerTyping}
          onOpenCatalog={() => setIsCatalogOpen(true)}
          onOpenQuickScripts={() => setIsQuickScriptsOpen(true)}
          onOpenThreeBubble={() => setIsThreeBubbleOpen(true)}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenCheatSheet={(tab = 'sop') => {
            setCheatSheetTab(tab);
            setIsCheatSheetOpen(true);
          }}
          examMode={examMode}
        />

        <CoachSidebar
          scenario={currentScenario}
          score={score}
          checklist={checklist}
          lastGoldenRulePassed={lastGoldenRulePassed}
          lastFeedback={lastFeedback}
          isEvaluating={evaluatingCount > 0}
          examMode={examMode}
          onFinishSession={() => {
            setIsEvaluationSummaryOpen(true);
            if (score >= 90) {
              setShowConfetti(true);
              soundManager.playCelebration();
            }
          }}
          onOpenCheatSheet={(tab = 'sop') => {
            setCheatSheetTab(tab);
            setIsCheatSheetOpen(true);
          }}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
        />
      </div>

      {/* MODALS */}
      {/* Interactive Delivery Map Modal */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col relative shadow-2xl">
            <button
              onClick={() => setIsMapOpen(false)}
              className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white bg-slate-800/80 p-1.5 rounded-lg border border-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <InteractiveDeliveryMap
              onInsertFeeScript={(text) => {
                handleSendMessage(text);
                setIsMapOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Order Entry Sheet Modal */}
      <OrderEntryModal
        isOpen={isOrderEntryOpen}
        onClose={() => setIsOrderEntryOpen(false)}
        scenario={currentScenario}
        messages={messages}
        onSubmitOrder={(details) => {
          // Notify in chat
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setMessages((prev) => [
            ...prev,
            {
              id: `msg-${Date.now()}`,
              sender: 'system',
              text: `📋 [ระบบ]: บันทึกข้อมูลออเดอร์ ${details.orderNumber} เข้า Sheet ระบบและส่งมอบงานให้ทีมจัดส่ง (OP) เรียบร้อยแล้วค่ะ`,
              timestamp: now,
            },
          ]);
          setScore((prev) => Math.min(100, prev + 5));
        }}
      />

      {/* Objection Handling Drill Modal */}
      <ObjectionTrainerModal
        isOpen={isObjectionTrainerOpen}
        onClose={() => setIsObjectionTrainerOpen(false)}
        onInsertToChat={(script) => {
          handleSendMessage(script);
        }}
      />

      <DeliveryCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onInsertFeeScript={(text) => handleSendMessage(text)}
      />

      <CheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
        defaultTab={cheatSheetTab}
      />

      <CatalogPickerModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSendProduct={handleSendProduct}
        onSendAlbum={handleSendAlbum}
        currentBudget={currentScenario.budget}
      />

      <QuickScriptDrawer
        isOpen={isQuickScriptsOpen}
        onClose={() => setIsQuickScriptsOpen(false)}
        onSelectScript={handleSendMessage}
      />

      <ThreeBubbleClosingModal
        isOpen={isThreeBubbleOpen}
        onClose={() => setIsThreeBubbleOpen(false)}
        onSendThreeBubbles={handleSendThreeBubbles}
        defaultBasketPrice={currentScenario.budget}
      />

      <EvaluationSummaryModal
        isOpen={isEvaluationSummaryOpen}
        onClose={() => setIsEvaluationSummaryOpen(false)}
        scenario={currentScenario}
        score={score}
        checklist={checklist}
        goldenRuleRatio={goldenRuleStats}
        coachFeedbackHistory={coachFeedbackHistory}
        examMode={examMode}
        onSaveToLeaderboard={(traineeName, sopPassedCount, sopTotalCount, goldenPercent) => {
          const updated = saveLeaderboardEntry({
            traineeName,
            scenarioId: currentScenario.id,
            scenarioTitle: currentScenario.title,
            difficulty: currentScenario.difficulty,
            score,
            grade: computeGrade(score),
            goldenRulePercent: goldenPercent,
            sopPassedCount,
            sopTotalCount,
            mode: examMode ? 'Exam' : 'Coach',
          });
          setLeaderboardEntries(updated);
          setCurrentTraineeName(traineeName);
        }}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onRetry={() => loadScenario(currentScenario)}
        onNextScenario={handleNextScenario}
        hasNextScenario={hasNextScenario}
      />

      <Leaderboard
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        entries={leaderboardEntries}
        scenarios={SCENARIOS}
        currentTraineeName={currentTraineeName}
        onDeleteEntry={(id) => {
          setLeaderboardEntries(deleteLeaderboardEntry(id));
        }}
        onClearAll={() => {
          setLeaderboardEntries(clearLeaderboardEntries());
        }}
        onSelectScenario={loadScenario}
      />

      <CelebrationConfetti
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </div>
  );
}
