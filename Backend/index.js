// Backend/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import Routes
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES ---
// Semua request ke /api/messages akan diurus oleh messageRoutes
app.use('/api/messages', messageRoutes);

// Root Endpoint (Cek server nyala/nggak)
app.get('/', (req, res) => {
  res.send('AI Customer Support API is Running...');
});

// Jalankan Server
app.listen(port, () => {
  console.log(`✅ Server berjalan di http://localhost:${port}`);
});