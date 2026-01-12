// Backend/controllers/messageController.js
const supabase = require('../config/supabaseClient');
const aiService = require('../services/aiService');
const { validationResult } = require('express-validator');

/**
 * 1. AMBIL SEMUA PESAN (Untuk Inbox)
 */
const getMessages = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: 'Gagal mengambil data pesan' });
  }
};

/**
 * 2. AMBIL DETAIL SATU PESAN (Untuk Halaman Detail)
 */
const getMessageDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
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
 * 3. KIRIM PESAN BARU (Untuk Postman / Webhook)
 */
const createMessage = async (req, res) => {
  // A. Validasi Input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validasi gagal',
      details: errors.array() 
    });
  }

  const { content, customer_name, subject } = req.body;

  try {
    // B. Simpan Pesan Mentah ke Database
    const { data: message, error } = await supabase
      .from('messages')
      .insert([{ 
        content, 
        customer_name, 
        subject,
        status: 'Open' 
      }])
      .select()
      .single();

    if (error) throw error;

    // C. Kirim Respon Cepat ke Pengirim
    res.status(201).json({ 
      success: true, 
      message: "Pesan diterima. AI sedang melakukan analisis lengkap...", 
      data: message 
    });

    // D. BACKGROUND PROCESS: Panggil 2 Fungsi AI Sekaligus
    console.log(`🤖 [Start] AI sedang bekerja untuk ID: ${message.id}...`);
    
    // Jalankan Klasifikasi & Summary secara PARALEL (biar cepat)
    Promise.all([
      aiService.analyzeIncomingMessage(content),
      aiService.generateSummary(content, customer_name)
    ]).then(async ([analysisResult, summaryResult]) => {
      
      console.log("✅ [Finish] AI selesai mikir!");
      console.log("📊 Analysis:", analysisResult);
      console.log("📝 Summary:", summaryResult);

      // Update database dengan hasil gabungan
      await supabase
        .from('messages')
        .update({
          category: analysisResult.category,
          sentiment: analysisResult.sentiment,
          priority: analysisResult.priority,
          ai_summary: summaryResult.summary,
          ai_suggested_reply: summaryResult.suggested_reply
        })
        .eq('id', message.id);

      console.log(`💾 Database updated untuk ID: ${message.id}`);
        
    }).catch(err => {
      console.error("❌ AI Error (Background Process):", err);
      console.error("❌ Error Stack:", err.stack);
    });

  } catch (err) {
    console.error("❌ Error create message:", err);
    res.status(500).json({ error: "Gagal menyimpan pesan" });
  }
};

/**
 * 4. BALAS PESAN
 */
const replyMessage = async (req, res) => {
  const { id } = req.params;
  
  // A. Validasi Input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validasi gagal',
      details: errors.array() 
    });
  }

  const { reply_content } = req.body;

  try {
    // B. Simpan Balasan ke Tabel 'replies'
    const { error: replyError } = await supabase
      .from('replies')
      .insert([{ message_id: id, reply_content }]);

    if (replyError) throw replyError;

    // C. Update Status Pesan jadi 'Closed'
    const { data: updatedMessage, error: updateError } = await supabase
      .from('messages')
      .update({ status: 'Closed' })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // D. Kirim Sukses
    res.json({
      success: true,
      message: "Pesan berhasil dibalas dan tiket ditutup.",
      data: updatedMessage
    });

  } catch (error) {
    console.error("❌ Error replying:", error);
    res.status(500).json({ error: "Gagal memproses balasan" });
  }
};

module.exports = { 
  getMessages, 
  getMessageDetail, 
  createMessage, 
  replyMessage
};