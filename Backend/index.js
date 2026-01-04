const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000; // Kita pakai port 4000 biar gak bentrok sama Next.js (biasanya 3000)

// --- MIDDLEWARE ---
app.use(cors()); // PENTING: Izinkan Frontend akses data ini
app.use(express.json()); // Agar bisa baca data JSON dari request body

// --- DATA DUMMY (MOCK DATA) ---
// Ini data bohong-bohongan untuk tampilan Inbox Yazid
const mockMessages = [
  {
    id: 1,
    customer_name: "Budi Santoso",
    subject: "Saldo tidak masuk",
    preview: "Saya sudah topup 50rb tapi saldo masih 0...",
    timestamp: "2024-01-04 09:30",
    status: "Open",
    category: "Billing",
    sentiment: "Negative",
    priority: "High"
  },
  {
    id: 2,
    customer_name: "Siti Aminah",
    subject: "Fitur baru bagus!",
    preview: "Terima kasih update terbarunya sangat membantu.",
    timestamp: "2024-01-04 10:15",
    status: "Closed",
    category: "General",
    sentiment: "Positive",
    priority: "Low"
  },
  {
    id: 3,
    customer_name: "Joko Anwar",
    subject: "App Crash saat login",
    preview: "Setiap saya buka aplikasi langsung force close.",
    timestamp: "2024-01-04 11:00",
    status: "Open",
    category: "Technical",
    sentiment: "Negative",
    priority: "High"
  }
];

// --- ROUTES (JALUR API) ---

// 1. Cek Server Nyala
app.get('/', (req, res) => {
  res.send('Backend AI Support Platform is Running!');
});

// 2. Ambil Semua Pesan (Untuk Inbox)
app.get('/api/messages', (req, res) => {
  // Simulasi delay sedikit biar Yazid bisa bikin loading spinner
  setTimeout(() => {
    res.json({
        success: true,
        data: mockMessages,
        total: mockMessages.length
    });
  }, 1000); // Delay 1 detik
});

// 3. Ambil Detail Pesan (Untuk Detail View)
app.get('/api/messages/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const message = mockMessages.find(m => m.id === id);
  
  if (message) {
    res.json({ success: true, data: message });
  } else {
    res.status(404).json({ success: false, message: "Pesan tidak ditemukan" });
  }
});

// --- JALANKAN SERVER ---
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});