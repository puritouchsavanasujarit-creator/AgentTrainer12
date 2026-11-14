export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  customerName: string;
  customerAvatar: string;
  customerProfile: string;
  customerGoal: string;
  budget: number;
  destination: string;
  isHospital: boolean;
  hospitalDetails?: {
    name: string;
    dropPointPolicy: string;
    allowedToRoom: boolean;
  };
  distanceKm: number;
  specialNotes?: string;
  initialMessage: string;
  recommendedProducts: string[];
  learningObjectives: string[];
}

export interface ChatAttachment {
  type: 'image' | 'product_card' | 'catalog' | 'payment_card';
  title?: string;
  imageUrl?: string;
  price?: number;
  description?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'admin' | 'system';
  text: string;
  timestamp: string;
  attachments?: ChatAttachment[];
  endedWithQuestion?: boolean;
  coachReview?: {
    score: number;
    feedback: string;
    praise?: string;
    improvement?: string;
    detectedPhase?: string;
  };
}

export interface SopChecklist {
  // Stage 1: Greeting & Discovery
  greetingPolite: boolean;
  askedOccasion: boolean;
  askedBudget: boolean;
  askedRecipientProfile: boolean;
  askedDeliveryLocation: boolean;

  // Stage 2: Proposal & Upsell
  recommendedWithinBudget: boolean;
  seasonalFruitHandled: boolean;
  upsellOffered: boolean;

  // Stage 3: Closing & Delivery 7-point check
  senderInfoCollected: boolean;
  recipientInfoCollected: boolean;
  hospitalRuleNotified: boolean;
  deliveryTimeCollected: boolean;
  ribbonColorCollected: boolean;
  cardMessageCollected: boolean;
  taxInvoiceAsked: boolean;
  threeBubbleClosingUsed: boolean;

  // Golden Rule
  goldenRuleMaintained: boolean;
}

export interface EvaluationResponse {
  score: number;
  endedWithQuestion: boolean;
  detectedPhase: string;
  checklistStatus: Partial<Record<string, boolean>>;
  feedback: string;
  goldenRulePassed: boolean;
  praise?: string;
  improvement?: string;
}

export interface FruitProduct {
  id: string;
  name: string;
  code: string;
  price: number;
  category: 'กระเช้าพรีเมียม' | 'กล่องของขวัญ' | 'ผลไม้เดี่ยวคัดพิเศษ' | 'ชุดผลไม้เยี่ยมไข้';
  imageUrl: string;
  fruitsIncluded: string[];
  inSeason: boolean;
  replacementNotes?: string;
  popularFor: string[];
  upsellOption?: {
    name: string;
    addPrice: number;
    description: string;
  };
}

export interface DeliveryRuleTier {
  range: string;
  condition: string;
  feeText: string;
  note: string;
}

export interface LeaderboardEntry {
  id: string;
  traineeName: string;
  scenarioId: string;
  scenarioTitle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  score: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  goldenRulePercent: number;
  sopPassedCount: number;
  sopTotalCount: number;
  mode: 'Coach' | 'Exam';
  timestamp: string;
}

