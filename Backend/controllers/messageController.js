// Backend/controllers/messageController.js

// --- DATA DUMMY (MOCK DATA) ---
// Ini kontrak data final buat Yazid.
const mockMessages = [
  {
    id: 1,
    customer_name: "Budi Santoso",
    subject: "Saldo tidak masuk setelah Topup",
    preview: "Saya sudah topup 50rb tapi saldo masih 0...",
    content: "Saya sudah topup 50rb via transfer bank jam 9 pagi tadi. Bukti transfer terlampir. Tolong dicek dong saldo saya masih 0 nih. Saya butuh urgent!",
    timestamp: "Jan 4", // Format tanggal singkat buat Inbox
    status: "Open",
    
    // Data untuk Titik Warna di Inbox
    category: "Billing",
    sentiment: "Negative", 
    priority: "High", // 🔴 Merah
    
    // Data untuk Sidebar Detail (Awalnya mungkin null, tapi kita isi buat tes UI)
    ai_summary: "User komplain saldo belum masuk sebesar 50rb via transfer bank.",
    ai_suggested_reply: "Halo Kak Budi, mohon maaf atas ketidaknyamanannya. Bisa tolong lampirkan bukti transfernya agar kami bantu cek ke bagian finance?"
  },
  {
    id: 2,
    customer_name: "Siti Aminah",
    subject: "Tanya fitur export PDF",
    preview: "Apakah aplikasi ini bisa export laporan...",
    content: "Halo admin, saya mau tanya apakah aplikasi ini bisa export laporan bulanan ke PDF? Saya cari menunya tidak ketemu.",
    timestamp: "Jan 4",
    status: "Open",
    
    category: "Inquiry",
    sentiment: "Neutral",
    priority: "Low", // 🟢 Hijau
    
    ai_summary: "User menanyakan fitur export laporan ke PDF.",
    ai_suggested_reply: "Halo Kak Siti, saat ini fitur export PDF ada di menu Pengaturan > Laporan. Semoga membantu!"
  },
  {
    id: 3,
    customer_name: "Joko Anwar",
    subject: "Aplikasi Force Close",
    preview: "Setiap buka menu profil langsung crash.",
    content: "Tolong diperbaiki bugnya, setiap saya klik menu profil, aplikasi langsung force close dan keluar sendiri. HP saya Samsung S23.",
    timestamp: "Jan 4",
    status: "Open",
    
    category: "Technical",
    sentiment: "Negative",
    priority: "Medium", // 🔵 Biru
    
    ai_summary: "Laporan bug force close saat akses menu profil di Samsung S23.",
    ai_suggested_reply: "Halo Kak Joko, mohon maaf kendalanya. Tim teknis kami sedang menyelidiki isu ini. Mohon pastikan aplikasi sudah versi terbaru ya."
  }
];

// --- FUNGSI CONTROLLER ---

// 1. Ambil Semua Pesan (Untuk Inbox)
const getMessages = (req, res) => {
  // Simulasi delay sedikit biar berasa kayak real server
  setTimeout(() => {
    res.json(mockMessages);
  }, 300); 
};

// 2. Ambil Detail Satu Pesan (Untuk Halaman Detail)
const getMessageDetail = (req, res) => {
  const { id } = req.params;
  const message = mockMessages.find((msg) => msg.id == id);

  if (!message) {
    return res.status(404).json({ error: "Pesan tidak ditemukan" });
  }

  res.json(message);
};

module.exports = { getMessages, getMessageDetail };