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
    status: normalizeStatus(msg.status)
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
    status: normalizeStatus(data.status)
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
 * @returns Promise dengan data reply termasuk ID-nya
 */
export async function sendReply(messageId: number, content: string): Promise<{
  success: boolean;
  data?: { id: number; reply_content: string; created_at: string };
}> {
  const response = await fetch(`${API_BASE_URL}/api/messages/${messageId}/reply`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reply_content: content }),
  });
  
  return handleResponse(response);
}

/**
 * tandain pesan udah dibaca (khusus UI aja)
 */
export async function markAsRead(messageId: number): Promise<boolean> {
  // placeholder - backend belum support fitur ini
  console.log('Marking message as read:', messageId);
  return Promise.resolve(true);
}

/**
 * hapus pesan dari backend (khusus lead aja)
 * @param messageId - ID pesan yang mau dihapus
 * @returns Promise<boolean> - status sukses
 */
export async function deleteMessage(messageId: number): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/messages/${messageId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  const data = await handleResponse<{ success: boolean }>(response);
  return data.success;
}

/**
 * arsipkan pesan (placeholder UI aja - backend belum support)
 */
export async function archiveMessage(messageId: number): Promise<boolean> {
  // placeholder - backend belum support fitur ini
  console.log('Archiving message:', messageId);
  return Promise.resolve(true);
}

// ============================================================================
// ENDPOINT TICKET ASSIGNMENT (baru dari backend)
// ============================================================================

/**
 * assign tiket ke agent (Lead assign atau Agent self-claim)
 * @param messageId - ID pesan/tiket
 * @param agentId - ID agent (wajib kalo lead, opsional kalo agent claim sendiri)
 * @returns Promise dengan data assignment
 */
export async function assignTicket(messageId: number, agentId?: string): Promise<{
  success: boolean;
  message: string;
  assignment_type: 'lead_assign' | 'agent_claim';
  data: Message;
}> {
  const response = await fetch(`${API_BASE_URL}/api/messages/${messageId}/assign`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(agentId ? { agent_id: agentId } : {}),
  });
  
  return handleResponse(response);
}

/**
 * unassign tiket dari agent (khusus lead)
 * @param messageId - ID pesan/tiket
 * @returns Promise<boolean> - status sukses
 */
export async function unassignTicket(messageId: number): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/messages/${messageId}/unassign`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  
  const data = await handleResponse<{ success: boolean }>(response);
  return data.success;
}

/**
 * ambil daftar semua agents (khusus lead buat assign dropdown)
 * @returns Promise<Agent[]> - array agents
 */
export async function fetchAgents(): Promise<{ id: string; full_name: string; role: string }[]> {
  const response = await fetch(`${API_BASE_URL}/api/messages/agents/list`, {
    headers: getAuthHeaders(),
  });
  
  return handleResponse(response);
}

/**
 * update status pesan manual
 * @param messageId - ID pesan
 * @param status - status baru ('open' | 'in_progress' | 'resolved')
 * @returns Promise<boolean> - status sukses
 */
export async function updateMessageStatus(
  messageId: number, 
  status: 'open' | 'in_progress' | 'resolved'
): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/messages/${messageId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  
  const data = await handleResponse<{ success: boolean }>(response);
  return data.success;
}

/**
 * edit balasan yang udah dikirim
 * @param replyId - ID balasan
 * @param content - isi balasan baru
 * @returns Promise dengan data balasan yang diupdate
 */
export async function editReply(replyId: number, content: string): Promise<{
  success: boolean;
  message: string;
  data: { id: number; reply_content: string; updated_at: string };
}> {
  const response = await fetch(`${API_BASE_URL}/api/messages/replies/${replyId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reply_content: content }),
  });
  
  return handleResponse(response);
}

// ============================================================================
// ENDPOINT ANALYTICS (Dilindungi, Khusus Lead)
// ============================================================================

/**
 * ambil overview analytics (khusus lead aja)
 * @returns Promise<AnalyticsOverview> - statistik dashboard
 */
export async function fetchAnalyticsOverview(): Promise<AnalyticsOverview> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
    headers: getAuthHeaders(),
  });
  
  const result = await handleResponse<{ 
    success: boolean; 
    timestamp: string; 
    data: {
      total_tickets: number;
      status_breakdown: { open: number; in_progress: number; resolved: number };
      sentiment_stats: { positive: number; neutral: number; negative: number };
      priority_stats: { high: number; medium: number; low: number };
    }
  }>(response);
  
  // transform backend data ke format frontend
  return {
    total: result.data.total_tickets,
    by_status: {
      Open: result.data.status_breakdown.open,
      Closed: result.data.status_breakdown.resolved
    },
    by_sentiment: {
      Positive: result.data.sentiment_stats.positive,
      Neutral: result.data.sentiment_stats.neutral,
      Negative: result.data.sentiment_stats.negative
    },
    by_priority: {
      High: result.data.priority_stats.high,
      Medium: result.data.priority_stats.medium,
      Low: result.data.priority_stats.low
    },
    by_category: {
      Billing: 0,
      Technical: 0,
      Inquiry: 0,
      General: 0
    }
  };
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
