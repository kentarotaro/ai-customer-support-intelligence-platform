// Backend/config/supabaseClient.js
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load konfigurasi dari file .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Cek apakah kunci rahasia sudah ada
if (!supabaseUrl || !supabaseKey) {
  console.error("❌ FATAL: Supabase URL atau Key tidak ditemukan! Cek file .env kamu.");
}

// Buat koneksi ke Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("✅ Supabase Client siap digunakan.");

module.exports = supabase;