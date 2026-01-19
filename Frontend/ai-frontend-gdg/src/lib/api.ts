/**
 * ============================================================================
 * FUNGSI-FUNGSI UTILITY API
 * ============================================================================
 * file ini isinya semua pemanggilan API ke server backend.
 * backend-nya jalan di port 4000 (Express/Node.js pake Supabase + Gemini AI).
 * semua endpoint yang dilindungi butuh autentikasi Bearer token.
 * ============================================================================
 */

import { 
  Message, 
  AISummary, 
  AIResponseSuggestion,
  AnalyticsOverview
} from '@/types';
import { getStoredToken } from '@/context/AuthContext';

// URL dasar backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * normalisasi status dari backend ke format frontend
 */
function normalizeStatus(status: string): 'Open' | 'In Progress' | 'Closed' {
  const statusMap: Record<string, 'Open' | 'In Progress' | 'Closed'> = {
    'open': 'Open',
    'in_progress': 'In Progress',
    'resolved': 'Closed',
    'Open': 'Open',
    'In Progress': 'In Progress',
    'Closed': 'Closed'
  };
  return statusMap[status] || 'Open';
}

/**
 * dapetin header authorization dengan token
 */
function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * handle error API secara konsisten
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
    
    if (response.status === 401) {
      throw new Error('Session expired. Please login again.');
    }
    
    throw new Error(errorMessage);
  }
  
  return response.json();
}

/**
 * ambil semua pesan dari inbox
 * @returns Promise<Message[]> - Array semua pesan
 */
export async function fetchMessages(): Promise<Message[]> {
  const response = await fetch(`${API_BASE_URL}/api/messages`, {
    headers: getAuthHeaders(),
  });
  
  const data = await handleResponse<Message[]>(response);
  
  // ubah status dari backend ke format frontend
  return data.map(msg => ({
    ...msg,
    status: normalizeStatus(msg.status) as any
  }));
}

/**
 * ambil satu pesan doang by ID dengan detail lengkap
 * @param id - ID Pesan
 * @returns Promise<Message> - Pesan lengkap
 */
export async function fetchMessageById(id: number): Promise<Message> {
  const response = await fetch(`${API_BASE_URL}/api/messages/${id}`, {
    headers: getAuthHeaders(),
  });
  
  const data = await handleResponse<Message>(response);
  
  // ubah status dari backend ke format frontend
  return {
    ...data,
    status: normalizeStatus(data.status) as any
  };
}

/**
 * ambil ringkasan yang di-generate AI buat percakapan
 * @param messageId - ID pesan yang mau diringkas
 * @returns Promise<AISummary> - ringkasan yang di-generate AI
 */
export async function fetchAISummary(messageId: number): Promise<AISummary> {
  const message = await fetchMessageById(messageId);
  
  return {
    messageId,
    summary: message.ai_summary || 'AI summary is being generated...',
    keyPoints: message.ai_summary ? [message.ai_summary] : ['Issue reported by customer'],
    suggestedCategory: message.category,
    confidence: 0.85
  };
}

/**
 * ambil saran balasan AI buat percakapan
 * @param messageId - ID pesan buat generate response
 * @returns Promise<AIResponseSuggestion> - saran balasan yang di-generate AI
 */
export async function fetchAIResponseSuggestion(messageId: number): Promise<AIResponseSuggestion> {
  const message = await fetchMessageById(messageId);
  
  return {
    suggestion: message.ai_suggested_reply || 'AI is generating a response...',
    tone: 'professional',
    confidence: 0.85
  };
}

/**
 * kirim balasan ke pesan customer
 * @param messageId - ID pesan yang mau dibales
 * @param content - isi balasan
 * @returns Promise<boolean> - status sukses
 */
export async function sendReply(messageId: number, content: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/messages/${messageId}/reply`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reply_content: content }),
  });
  
  const data = await handleResponse<{ success: boolean }>(response);
  return data.success;
}

/**
 * tandain pesan udah dibaca (khusus UI aja)
 */
export async function markAsRead(_messageId: number): Promise<boolean> {
  return Promise.resolve(true);
}

/**
 * update status pesan (di-handle lewat endpoint reply)
 */
export async function updateMessageStatus(
  _messageId: number, 
  _status: 'Open' | 'In Progress' | 'Closed'
): Promise<boolean> {
  return Promise.resolve(true);
}

/**
 * hapus pesan (placeholder UI aja)
 */
export async function deleteMessage(_messageId: number): Promise<boolean> {
  return Promise.resolve(true);
}

/**
 * arsipkan pesan (placeholder UI aja)
 */
export async function archiveMessage(_messageId: number): Promise<boolean> {
  return Promise.resolve(true);
}

// ============================================================================
// ENDPOINT ANALYTICS (Dilindungi, Khusus Lead)
// ============================================================================

/**
 * ambil overview analytics (khusus lead aja)
 * @returns Promise<AnalyticsOverview> - statistik dashboard
 */
export async function fetchAnalyticsOverview(): Promise<AnalyticsOverview> {
  const response = await fetch(`${API_BASE_URL}/api/analytics/overview`, {
    headers: getAuthHeaders(),
  });
  
  return handleResponse<AnalyticsOverview>(response);
}

// ============================================================================
// ENDPOINT PUBLIC (Ga butuh auth)
// ============================================================================

/**
 * kirim pesan customer baru (endpoint public)
 */
export async function submitCustomerMessage(
  customerName: string, 
  content: string, 
  subject?: string
): Promise<Message> {
  const response = await fetch(`${API_BASE_URL}/api/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer_name: customerName,
      content,
      subject,
    }),
  });
  
  const data = await handleResponse<{ success: boolean; data: Message }>(response);
  return data.data;
}
