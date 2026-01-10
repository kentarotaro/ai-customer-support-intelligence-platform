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
      message: "Pesan diterima. AI sedang melakukan analisis lengkap...", 
      data: message 
    });

    // C. BACKGROUND PROCESS: Panggil 2 Fungsi AI Sekaligus
    console.log(`🤖 [Start] AI sedang bekerja untuk ID: ${message.id}...`);
    
    // Jalankan Klasifikasi & Summary secara PARALEL (biar cepat)
    Promise.all([
      aiService.analyzeIncomingMessage(content),             // Tugas 1: Cek Sentiment/Prioritas
      aiService.generateSummary(content, customer_name)      // Tugas 2: Bikin Rangkuman & Saran Balasan
    ]).then(async ([analysisResult, summaryResult]) => {
      
      console.log("✅ [Finish] AI selesai mikir!");

      // Update database dengan hasil gabungan
      await supabase
        .from('messages')
        .update({
          // Hasil Analisis
          category: analysisResult.category,
          sentiment: analysisResult.sentiment,
          priority: analysisResult.priority,
          
          // Hasil Summary & Suggestion
          ai_summary: summaryResult.summary,
          ai_suggested_reply: summaryResult.suggested_reply
        })
        .eq('id', message.id);

      console.log(`💾 Database updated untuk ID: ${message.id}`);
        
    }).catch(err => {
      console.error("❌ AI Error (Background Process):", err);
    });

  } catch (err) {
    console.error("Error create message:", err);
    res.status(500).json({ error: "Gagal menyimpan pesan" });
  }
};

const replyMessage = async (req, res) => {
  const { id } = req.params; // ID Pesan (dari URL)
  const { reply_content } = req.body; // Isi balasan (dari Yazid/Postman)

  if (!reply_content) {
    return res.status(400).json({ error: "Isi balasan tidak boleh kosong" });
  }

  try {
    // A. Simpan Balasan ke Tabel 'replies'
    const { error: replyError } = await supabase
      .from('replies')
      .insert([{ message_id: id, reply_content }]);

    if (replyError) throw replyError;

    // B. Update Status Pesan jadi 'Closed' (Sesuai Flowchart)
    const { data: updatedMessage, error: updateError } = await supabase
      .from('messages')
      .update({ status: 'Closed' })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // C. Kirim Sukses
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

// --- UPDATE EXPORTS (PENTING!) ---
// Pastikan replyMessage dimasukkan ke sini
module.exports = { 
  getMessages, 
  getMessageDetail, 
  createMessage, 
  replyMessage // <--- Tambahan baru
};