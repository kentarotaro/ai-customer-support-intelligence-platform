// Backend/controllers/messageController.js
const supabase = require('../config/supabaseClient');
const aiService = require('../services/aiService');

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
  const { content, customer_name, subject } = req.body;

  try {
    // A. Simpan Pesan Mentah ke Database
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

    // B. Kirim Respon Cepat ke Pengirim
    res.status(201).json({ 
      success: true, 
      message: "Pesan diterima, AI sedang menganalisa...", 
      data: message 
    });

    // C. BACKGROUND PROCESS: Panggil AI
    console.log(`🤖 Memulai analisis AI untuk pesan ID: ${message.id}...`);
    
    // Jangan pakai await di sini agar tidak memblokir respon
    aiService.analyzeIncomingMessage(content).then(async (aiResult) => {
      console.log(`✅ AI Selesai! Hasil: ${JSON.stringify(aiResult)}`);
      
      await supabase
        .from('messages')
        .update({
          category: aiResult.category,
          sentiment: aiResult.sentiment,
          priority: aiResult.priority
        })
        .eq('id', message.id);
        
    }).catch(err => {
      console.error("❌ AI Error:", err);
    });

  } catch (err) {
    console.error("Error create message:", err);
    res.status(500).json({ error: "Gagal menyimpan pesan" });
  }
};

// Ekspor ketiga fungsi ini agar bisa dipakai di routes
module.exports = { getMessages, getMessageDetail, createMessage };