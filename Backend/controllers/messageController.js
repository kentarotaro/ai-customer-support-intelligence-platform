// Backend/controllers/messageController.js
const supabase = require('../config/supabaseClient');
const aiService = require('../services/aiService');
const { validationResult } = require('express-validator');

/**
 * 1. AMBIL SEMUA PESAN (Untuk Inbox)
 */
const getMessages = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    let query = supabase
      .from('messages')
      .select(`
        *,
        assigned_agent:assigned_to (
          id,
          full_name
        )
      `)
      .order('created_at', { ascending: false });

    if (userRole === 'agent') {
      query = query.or(`assigned_to.eq.${userId},assigned_to.is.null`);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: 'Gagal mengambil data pesan' });
  }
};

/**
 * 2. AMBIL DETAIL SATU PESAN
 */
const getMessageDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        assigned_agent:assigned_to (
          id,
          full_name
        ),
        replies (
          id,
          reply_content,
          created_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Pesan tidak ditemukan' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching detail:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};

/**
 * 3. KIRIM PESAN BARU
 */
const createMessage = async (req, res) => {
  // 1. Validasi Input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validasi gagal',
      details: errors.array() 
    });
  }

  // 2. VARIABEL SAMA PERSIS SEPERTI KODE LAMA
  const { content, customer_name, subject } = req.body;

  try {
    // 3. Insert ke Database - STRUKTUR SAMA
    const { data: message, error } = await supabase
      .from('messages')
      .insert([{ 
        content, 
        customer_name, 
        subject,
        status: 'open'
      }])
      .select()
      .single();

    if (error) throw error;

    // 4. 🤖 AI PROCESS (BLOCKING - Tunggu sampai selesai)
    console.log(`🤖 [Start] AI sedang bekerja untuk ID: ${message.id}...`);
    
    let aiAnalysis = { category: 'General', sentiment: 'Neutral', priority: 'medium' };
    let aiSummary = { summary: '', suggested_reply: '' };

    try {
      // Panggil AI secara PARALEL dan TUNGGU hasilnya
      const [analysisResult, summaryResult] = await Promise.all([
        aiService.analyzeIncomingMessage(content),
        aiService.generateSummary(content, customer_name)
      ]);

      aiAnalysis = analysisResult;
      aiSummary = summaryResult;
      
      console.log("✅ [Finish] AI selesai mikir!");

      // Update Database dengan hasil AI - SESUAI SCHEMA KAMU
      await supabase
        .from('messages')
        .update({
          category: aiAnalysis.category,
          sentiment: aiAnalysis.sentiment,
          priority: aiAnalysis.priority,
          ai_summary: aiSummary.summary,
          ai_suggested_reply: aiSummary.suggested_reply
        })
        .eq('id', message.id);

      console.log(`💾 Database updated untuk ID: ${message.id}`);

    } catch (aiError) {
      console.error("❌ AI Error:", aiError.message);
      // Jangan throw error, biarkan pesan tetap tersimpan
    }

    // 5. Response SETELAH AI selesai (dengan hasil AI)
    res.status(201).json({ 
      success: true, 
      message: "Pesan berhasil disimpan dan dianalisis AI", 
      data: {
        ...message, // Data asli dari database
        category: aiAnalysis.category,
        sentiment: aiAnalysis.sentiment,
        priority: aiAnalysis.priority,
        ai_summary: aiSummary.summary,
        ai_suggested_reply: aiSummary.suggested_reply
      }
    });

  } catch (err) {
    console.error("❌ Error create message:", err);
    res.status(500).json({ error: "Gagal menyimpan pesan" });
  }
};

/**
 * 4. ASSIGN TICKET
 */
const assignTicket = async (req, res) => {
  const { id } = req.params;
  const { agent_id } = req.body;
  const userRole = req.user.role;
  const userId = req.user.id;

  try {
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('id, assigned_to, status')
      .eq('id', id)
      .single();

    if (fetchError || !message) {
      return res.status(404).json({ error: 'Pesan tidak ditemukan' });
    }

    let targetAgentId;

    if (userRole === 'lead') {
      if (!agent_id) {
        return res.status(400).json({ 
          error: 'agent_id wajib diisi untuk Lead' 
        });
      }

      const { data: targetAgent, error: agentError } = await supabase
        .from('users')
        .select('id, role, full_name')
        .eq('id', agent_id)
        .single();

      if (agentError || !targetAgent) {
        return res.status(404).json({ 
          error: 'Agent tidak ditemukan',
          details: agentError?.message 
        });
      }

      if (targetAgent.role !== 'agent') {
        return res.status(400).json({ 
          error: 'Target harus memiliki role agent' 
        });
      }

      targetAgentId = agent_id;
    } 
    else if (userRole === 'agent') {
      if (message.assigned_to) {
        return res.status(403).json({ 
          error: 'Tiket sudah di-assign ke agent lain. Hanya Lead yang bisa reassign.' 
        });
      }

      targetAgentId = userId;
    }

    const { data: updatedMessage, error: updateError } = await supabase
      .from('messages')
      .update({ 
        assigned_to: targetAgentId,
        status: 'in_progress'
      })
      .eq('id', id)
      .select(`
        *,
        assigned_agent:assigned_to (
          id,
          full_name
        )
      `)
      .single();

    if (updateError) throw updateError;

    res.json({
      success: true,
      message: userRole === 'lead' 
        ? 'Tiket berhasil di-assign ke agent' 
        : 'Anda berhasil claim tiket ini',
      data: updatedMessage
    });

  } catch (error) {
    console.error('❌ Error assign ticket:', error);
    res.status(500).json({ error: 'Gagal assign tiket' });
  }
};

/**
 * 5. UNASSIGN TICKET
 */
const unassignTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: updatedMessage, error } = await supabase
      .from('messages')
      .update({ 
        assigned_to: null,
        status: 'open'
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Pesan tidak ditemukan' });
      }
      throw error;
    }

    res.json({
      success: true,
      message: 'Assignment berhasil dihapus. Tiket kembali ke pool.',
      data: updatedMessage
    });

  } catch (error) {
    console.error('❌ Error unassign ticket:', error);
    res.status(500).json({ error: 'Gagal unassign tiket' });
  }
};

/**
 * 6. BALAS PESAN
 */
const replyMessage = async (req, res) => {
  const { id } = req.params;
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validasi gagal',
      details: errors.array() 
    });
  }

  const { reply_content } = req.body;

  try {
    const { error: replyError } = await supabase
      .from('replies')
      .insert([{ 
        message_id: id, 
        reply_content,
        replied_by: req.user.id
      }]);

    if (replyError) throw replyError;

    const { data: updatedMessage, error: updateError } = await supabase
      .from('messages')
      .update({ 
        status: 'resolved',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        assigned_agent:assigned_to (
          id,
          full_name
        )
      `)
      .single();

    if (updateError) throw updateError;

    res.json({
      success: true,
      message: "Pesan berhasil dibalas dan tiket ditandai resolved.",
      data: updatedMessage
    });

  } catch (error) {
    console.error("❌ Error replying:", error);
    res.status(500).json({ error: "Gagal memproses balasan" });
  }
};

/**
 * 7. UPDATE STATUS MANUAL
 */
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['open', 'in_progress', 'resolved'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: `Status harus salah satu dari: ${validStatuses.join(', ')}` 
    });
  }

  try {
    const { data: updatedMessage, error } = await supabase
      .from('messages')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Pesan tidak ditemukan' });
      }
      throw error;
    }

    res.json({
      success: true,
      message: `Status berhasil diubah menjadi '${status}'`,
      data: updatedMessage
    });

  } catch (error) {
    console.error('❌ Error update status:', error);
    res.status(500).json({ error: 'Gagal update status' });
  }
};

/**
 * 8. GET ALL AGENTS (untuk dropdown assign)
 */
const getAgents = async (req, res) => {
  try {
    console.log('🔍 Fetching agents...');
    
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, role')
      .eq('role', 'agent')
      .order('full_name');

    console.log('📊 Query result:', { data, error });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching agents:', error);
    res.status(500).json({ error: 'Gagal mengambil data agent' });
  }
};

// ===== EXPORTS =====
module.exports = { 
  getMessages, 
  getMessageDetail, 
  createMessage, 
  assignTicket,
  unassignTicket,
  replyMessage,
  updateStatus,
  getAgents
};