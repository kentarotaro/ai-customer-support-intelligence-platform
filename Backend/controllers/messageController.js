// Backend/controllers/messageController.js
const supabase = require('../config/supabaseClient');

/**
 * 1. AMBIL SEMUA PESAN (Untuk Halaman Inbox)
 * Mengambil data dari tabel 'messages', diurutkan dari yang terbaru.
 */
const getMessages = async (req, res) => {
  try {
    // Query ke Database Supabase
    const { data, error } = await supabase
      .from('messages') // Nama tabel harus sama persis dengan di Supabase
      .select('*')      // Ambil semua kolom (id, subject, priority, dll)
      .order('created_at', { ascending: false }); // Urutkan dari yang paling baru

    if (error) {
      throw error;
    }

    // Kirim data JSON asli ke Frontend
    res.json(data);

  } catch (error) {
    console.error('❌ Error mengambil pesan:', error.message);
    res.status(500).json({ error: 'Gagal mengambil data dari database' });
  }
};

/**
 * 2. AMBIL DETAIL SATU PESAN (Untuk Halaman Baca Pesan)
 * Mengambil pesan berdasarkan ID.
 */
const getMessageDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single(); // .single() memastikan kita cuma dapat 1 objek, bukan array

    if (error) {
      // Kode PGRST116 artinya data tidak ketemu
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Pesan tidak ditemukan' });
      }
      throw error;
    }

    res.json(data);

  } catch (error) {
    console.error('❌ Error mengambil detail:', error.message);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};

module.exports = { getMessages, getMessageDetail };