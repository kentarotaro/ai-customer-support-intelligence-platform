/**
 * ============================================================================
 * TYPE DEFINITIONS
 * ============================================================================
 * file ini isinya semua interface sama type TypeScript yang dipake
 * di seluruh aplikasi AI Customer Support Intelligence Platform-nya.
 * ============================================================================
 */

/**
 * tingkat prioritas buat pesan customer
 * - Urgent: masalah kritis perlu ditangani secepatnya
 * - High: masalah penting butuh respons cepet
 * - Medium: penting tapi ga kritis-kritis amat
 * - Low: pertanyaan biasa atau feedback positif aja
 */
export type Priority = 'Urgent' | 'High' | 'Medium' | 'Low';

/**
 * hasil analisis sentimen dari AI
 * - Positive: customer happy/puas banget
 * - Neutral: customer nada biasa aja
 * - Negative: customer lagi kesel/ga puas
 */
export type Sentiment = 'Positive' | 'Neutral' | 'Negative';

/**
 * kategori masalah yang dikategoriin sama AI
 */
export type Category = 'Billing' | 'Technical' | 'General' | 'Account' | 'Feature Request' | 'Inquiry';

/**
 * status pesan di workflow support
 * backend pake lowercase: 'open', 'in_progress', 'resolved'
 */
export type MessageStatus = 'open' | 'in_progress' | 'resolved' | 'Open' | 'In Progress' | 'Closed';

/**
 * info agent yang di-assign dari backend
 */
export interface AssignedAgent {
  id: string;
  full_name: string;
}

/**
 * balasan ke sebuah pesan
 */
export interface MessageReply {
  id: number;
  reply_content: string;
  created_at: string;
}

/**
 * representasi satu pesan di thread percakapan
 */
export interface ConversationMessage {
  id: number;
  sender: 'customer' | 'support';
  content: string;
  timestamp: string;
}

/**
 * representasi pesan/tiket customer support
 * ini struktur data utama buat item-item di inbox
 * udah diupdate sesuai struktur backend Supabase yang baru
 */
export interface Message {
  id: number;
  customer_name: string;
  customer_email?: string;
  subject: string;
  content: string; // isi pesan utama dari customer
  preview?: string; // buat tampilan list (diambil dari content)
  created_at: string; // backend pake created_at
  timestamp?: string; // alias buat backwards compatibility
  status: MessageStatus;
  category?: Category; // opsional soalnya AI mungkin masih proses
  sentiment?: Sentiment; // opsional soalnya AI mungkin masih proses
  priority?: Priority; // opsional soalnya AI mungkin masih proses
  ai_summary?: string; // ringkasan yang di-generate AI (bisa null)
  ai_suggested_reply?: string; // balasan yang disaranin AI (bisa null)
  assigned_to?: string; // UUID agent yang di-assign
  assigned_agent?: AssignedAgent; // info agent nested dari backend
  replies?: MessageReply[]; // array balasan dari backend
  conversation?: ConversationMessage[]; // buat backwards compatibility
  isRead?: boolean; // buat management state UI
}

/**
 * wrapper response API buat list pesan
 */
export interface MessagesResponse {
  success: boolean;
  data: Message[];
  total: number;
}

/**
 * wrapper response API buat satu pesan doang
 */
export interface MessageDetailResponse {
  success: boolean;
  data: Message;
}

/**
 * ringkasan yang di-generate AI buat percakapan
 * udah disimplifikasi sesuai struktur backend baru
 */
export interface AISummary {
  messageId?: number;
  summary: string; // ringkasan AI utama dari backend
  keyPoints: string[]; // diekstrak dari ai_summary
  suggestedCategory?: Category; // dari field category
  confidence: number; // skor confidence
}

/**
 * saran balasan yang di-generate AI
 */
export interface AIResponseSuggestion {
  messageId?: number;
  suggestion: string;
  tone: 'empathetic' | 'professional' | 'friendly';
  confidence: number;
}

/**
 * opsi tema buat aplikasi
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * konfigurasi settings
 */
export interface Settings {
  theme: Theme;
  notificationsEnabled: boolean;
  autoRefreshInterval: number; // dalam detik
}

/**
 * role user
 */
export type UserRole = 'agent' | 'lead';

/**
 * profil user dari authentication
 */
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at?: string;
}

/**
 * session authentication
 */
export interface AuthSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

/**
 * response Login/Register
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  session: AuthSession;
  user: User;
}

/**
 * data overview analytics (khusus buat lead)
 */
export interface AnalyticsOverview {
  total: number;
  by_status: {
    Open: number;
    Closed: number;
  };
  by_sentiment: {
    Positive: number;
    Neutral: number;
    Negative: number;
  };
  by_priority: {
    High: number;
    Medium: number;
    Low: number;
  };
  by_category: {
    Billing: number;
    Technical: number;
    Inquiry: number;
    General: number;
  };
}
