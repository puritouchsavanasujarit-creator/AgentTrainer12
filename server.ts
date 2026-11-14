import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let genAI: GoogleGenAI | null = null;
if (apiKey) {
  genAI = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instructions for customer simulator
const CUSTOMER_SYSTEM_PROMPT = `
คุณคือผู้ช่วยจำลองบทบาทเป็น "ลูกค้า" (Customer Persona) ที่ทักเข้ามาใน LINE Official Account ของร้าน "Premium Fruit Delivery" (ร้านจำหน่ายกระเช้าผลไม้พรีเมียม สดใหม่ คัดเกรด พร้อมส่งด่วนทั่วกรุงเทพฯ)
ผู้ใช้ที่คุยกับคุณคือ "แอดมินฝึกหัด" (Trainee Admin Sale) ของร้าน

เป้าหมายของคุณคือ:
1. ตอบกลับแอดมินเหมือนลูกค้าคนไทยจริงๆ ที่คุยผ่าน LINE (ใช้คำพูดเป็นธรรมชาติ เช่น ค่ะ/ครับ, มีสติกเกอร์/อีโมจิบ้าง, บางครั้งพิมพ์สั้น, บางครั้งถามซ้ำ)
2. ยึดตาม Scenario และ Persona ที่กำหนดไว้อย่างเคร่งครัด
3. ตอบสนองต่อการกระทำของแอดมิน:
   - ถ้าแอดมินไม่ถามคำถามทิ้งท้าย หรือตอบห้วน: ให้คุณตอบสั้นลง หรือลังเล
   - ถ้าแอดมินถามโอกาสใช้งาน/งบประมาณ: ให้บอกข้อมูลตาม scenario
   - ถ้าแอดมินแนะนำกระเช้า: แสดงความสนใจหรือถามรายละเอียดผลไม้ในกระเช้า
   - ถ้าแอดมินจำแนกเรื่องผลไม้นอกฤดูกาล (เช่น ขอเชอร์รี่ แต่แอดมินแนะนำเปลี่ยนเป็นกีวี่/บลูเบอร์รี่อย่างสุภาพ): ให้ยอมรับ
   - ถ้าแอดมินเสนออัปเซล (เช่น อัปเกรดองุ่นไซน์มัสคัต +300 บ. หรือเพิ่มรังนกแท้ +200 บ. สำหรับเยี่ยมไข้): ตอบตกลงหากข้อเสนอคุ้มค่า
   - ถ้าแอดมินถามข้อมูล 7 จุด (ผู้สั่ง, ผู้รับ, เบอร์, จุดส่ง/รพ., วันเวลา, สีโบว์, ข้อความการ์ด): ให้ตอบข้อมูลทีละส่วนหรือให้ครบตามที่แอดมินถาม
   - หากส่งโรงพยาบาล: อย่าลืมว่าแมสเซนเจอร์ไม่สามารถขึ้นตึกคนไข้ได้ (แอดมินต้องแจ้งจุดรับหรือฝากพยาบาล)

ตอบกลับเป็น JSON ในรูปแบบนี้เท่านั้น:
{
  "customerReply": "ข้อความตอบกลับของลูกค้าใน LINE",
  "mood": "happy" | "neutral" | "hesitant" | "satisfied" | "impatient",
  "currentStage": "greeting" | "discovery" | "proposal" | "upsell" | "closing" | "completed",
  "internalThought": "ความคิดในใจของลูกค้าต่อคำตอบของแอดมิน (สั้นๆ 1-2 ประโยค)"
}
`;

// API endpoint for customer chat reply
app.post('/api/chat', async (req, res) => {
  try {
    const { scenario, messages, lastAdminMessage } = req.body;

    if (!genAI) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const conversationContext = messages
      .map((m: { sender: string; text: string }) => `${m.sender === 'admin' ? 'แอดมิน' : 'ลูกค้า'}: ${m.text}`)
      .join('\n');

    const prompt = `
สถานการณ์จำลอง (Scenario):
- ชื่อสถานการณ์: ${scenario.title}
- บทบาทลูกค้า: ${scenario.customerName} (${scenario.customerProfile})
- วัตถุประสงค์ของลูกค้า: ${scenario.customerGoal}
- งบประมาณในใจ: ${scenario.budget} บาท
- จุดส่งปลายทาง: ${scenario.destination}
- เงื่อนไขพิเศษ: ${scenario.specialNotes || 'ไม่มี'}

ประวัติการสนทนาล่าสุด:
${conversationContext}

ข้อความล่าสุดจากแอดมิน:
"${lastAdminMessage}"

จงตอบกลับในบทบาทของลูกค้าคนนี้ตามสถานการณ์และข้อมูลข้างต้น โดยรักษาคาแรคเตอร์อย่างสมจริง และส่งผลลัพธ์เป็น JSON ตามที่กำหนด`;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: CUSTOMER_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const responseText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      parsedData = {
        customerReply: responseText,
        mood: 'neutral',
        currentStage: 'discovery',
        internalThought: 'ลูกค้ากำลังพิจารณาข้อเสนอ',
      };
    }

    res.json(parsedData);
  } catch (error: unknown) {
    console.error('Error generating chat response:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// System prompt for Coach Evaluation
const COACH_SYSTEM_PROMPT = `
คุณคือ "AI Coach & Sale Trainer ผู้เชี่ยวชาญ" ของร้าน Premium Fruit Delivery
หน้าที่ของคุณคือตรวจสอบและประเมินข้อความของ "แอดมินฝึกหัด" (Trainee) ทุกข้อความเทียบกับมาตรฐานการทำงาน (SOP) และ Playbook ของร้าน:

หลักเกณฑ์สำคัญของ Premium Fruit Delivery:
1. กฎ Golden Rule (หัวใจสำคัญที่สุด): "ห้ามปล่อยให้บทสนทนาตาย: ทุกขั้นตอนของการคุยกับลูกค้า เราจะต้องทิ้งคำถามไว้ให้ลูกค้าเสมอ เพื่อเปิดและรักษาบทสนทนากับลูกค้า"
2. ขั้นตอนที่ 1 ทักทาย & ค้นหา Need:
   - สุภาพ น่าประทับใจ
   - สอบถามโอกาสใช้งาน (เยี่ยมไข้/แสดงความยินดี/ผู้ใหญ่/วันเกิด)
   - สอบถามงบประมาณที่ต้องการ
   - สอบถามเพศ/อายุ/ความชอบของผู้รับ
   - สอบถามวันเวลาและสถานที่จัดส่ง
3. ขั้นตอนที่ 2 นำเสนอแบบตามงบ & อัปเซล (Up-selling):
   - ส่งรูปให้เลือก 8-12 แบบ ในช่วงราคา +- 200 บ. จากงบ
   - หากลูกค้าถามหาผลไม้นอกฤดูกาล (เช่น เชอร์รี่) ต้องแจ้งสุภาพและแนะนำผลไม้ทดแทนเกรดพรีเมียม (เช่น องุ่นไซน์มัสคัต, บลูเบอร์รี่, กีวี่ทอง)
   - มีการเสนอ Up-sell: เช่น อัปเกรดองุ่นไซน์มัสคัต (+300 บ.) หรือ เพิ่มรังนกแท้ (+200 บ. สำหรับเยี่ยมไข้) หรือ กล่องพรีเมียม
4. ขั้นตอนที่ 3 ปิดการขาย & เก็บข้อมูลจัดส่ง:
   - ตรวจสอบ 7 จุดสำคัญ: (1) ชื่อ-เบอร์ผู้สั่ง (2) ชื่อ-เบอร์ผู้รับ (3) สถานที่จัดส่ง/จุดดรอป รพ. (4) วัน-เวลาจัดส่ง (5) สีโบว์ที่ชอบ (6) ข้อความเขียนการ์ด (7) ต้องการใบกำกับภาษีหรือไม่
   - หากส่งโรงพยาบาล: แมสเซนเจอร์ขึ้นตึกไม่ได้ ต้องแจ้งจุดรับของกลาง/ฝากพยาบาล และขอตึก/ชั้น/ห้อง
   - ค่าส่งคิดจากจรัญ 59:
     * PMF: 1-10 กม. ครบ 1,500 ส่งฟรี (ไม่ถึงคิด 59 บ.), 11-25 กม. ครบ 4,000 ส่งฟรี (ไม่ถึงคิด 159 บ.), >25 กม. 159+10บ./กม.
     * UB: ส่งฟรีทุกออเดอร์ (<= 30 กม.), ด่วน 2 ชม. +200 บ.
   - ปิดการขายด้วยรูปแบบ 3 บับเบิ้ล (สรุปยอด+ค่าส่ง / ช่องทางชำระ / เลขบัญชีแยกบับเบิ้ลเพื่อให้กดคัดลอกง่าย)

จงประเมินและส่งผลลัพธ์เป็น JSON:
{
  "score": number (0-100),
  "endedWithQuestion": boolean,
  "detectedPhase": "greeting" | "need_discovery" | "presentation" | "upselling" | "closing_details" | "payment_summary",
  "checklistStatus": {
    "greetingPolite": boolean,
    "askedOccasion": boolean,
    "askedBudget": boolean,
    "recommendedWithinBudget": boolean,
    "seasonalFruitHandled": boolean,
    "upsellOffered": boolean,
    "deliveryRulesMentioned": boolean,
    "collectedRecipientInfo": boolean,
    "collectedCardAndRibbon": boolean,
    "threeBubbleClosingUsed": boolean
  },
  "feedback": "คำแนะนำแบบตรงจุดและสร้างสรรค์ (ภาษาไทย)",
  "goldenRulePassed": boolean,
  "praise": "จุดเด่นที่ทำได้ดีมากในข้อความนี้",
  "improvement": "จุดที่ควรปรับปรุงเพื่อเพิ่มโอกาสปิดการขาย"
}
`;

// API endpoint for real-time coaching evaluation
app.post('/api/evaluate', async (req, res) => {
  try {
    const { scenario, messages, lastAdminMessage } = req.body;

    if (!genAI) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const conversationContext = messages
      .map((m: { sender: string; text: string }) => `${m.sender === 'admin' ? 'แอดมิน' : 'ลูกค้า'}: ${m.text}`)
      .join('\n');

    const prompt = `
บริบทสถานการณ์:
- สถานการณ์: ${scenario.title}
- งบประมาณลูกค้า: ${scenario.budget} บาท
- จุดหมาย: ${scenario.destination}
- ประเภท: ${scenario.category}

ประวัติการคุย:
${conversationContext}

ข้อความล่าสุดของแอดมินที่ต้องประเมิน:
"${lastAdminMessage}"

จงประเมินข้อความนี้อย่างละเอียดและให้คำแนะนำที่เป็นประโยชน์ต่อแอดมิน`;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: COACH_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const responseText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      parsedData = {
        score: 75,
        endedWithQuestion: lastAdminMessage.trim().endsWith('?') || lastAdminMessage.includes('ไหม') || lastAdminMessage.includes('คะ') || lastAdminMessage.includes('ครับ'),
        detectedPhase: 'need_discovery',
        checklistStatus: {},
        feedback: 'ประเมินเบื้องต้น: พยายามจบประโยคด้วยคำถามเสมอเพื่อรักษาการสนทนา',
        goldenRulePassed: true,
        praise: 'ตอบสนองอย่างรวดเร็วและสุภาพ',
        improvement: 'ระบุข้อมูลเพิ่มเติมตาม SOP',
      };
    }

    res.json(parsedData);
  } catch (error: unknown) {
    console.error('Error evaluating message:', error);
    res.status(500).json({
      error: 'Failed to evaluate',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Vite dev middleware or static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();
