// Backend/controllers/authController.js
const supabase = require('../config/supabaseClient');
const { validationResult } = require('express-validator');

/**
 * 1. REGISTER - Pakai Supabase Auth
 */
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, full_name, role } = req.body;

  try {
    // A. Daftarkan user ke Supabase Auth (email + password)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      // Handle error spesifik Supabase
      if (authError.message.includes('already registered')) {
        return res.status(409).json({ error: 'Email sudah terdaftar.' });
      }
      throw authError;
    }

    // B. Simpan profil tambahan ke public.users
    const { error: profileError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id, // UUID dari auth.users
        full_name,
        role: role || 'agent'
      }]);

    if (profileError) throw profileError;

    // C. Return session token dari Supabase
    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Silakan cek email untuk verifikasi.',
      session: authData.session, // Berisi access_token & refresh_token
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name,
        role: role || 'agent'
      }
    });

  } catch (error) {
    console.error('❌ Error Register:', error);
    res.status(500).json({ 
      error: 'Gagal mendaftarkan user.', 
      details: error.message 
    });
  }
};

/**
 * 2. LOGIN - Pakai Supabase Auth
 */
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // A. Login via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({ 
        error: 'Email atau password salah.',
        details: authError.message 
      });
    }

    // B. Ambil profil dari public.users
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('full_name, role')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('⚠️ Profil tidak ditemukan, user mungkin belum register lengkap');
    }

    // C. Return session + profil
    res.json({
      success: true,
      message: 'Login berhasil!',
      session: authData.session, // access_token ada di sini
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: profile?.full_name || 'Unknown',
        role: profile?.role || 'agent'
      }
    });

  } catch (error) {
    console.error('❌ Error Login:', error);
    res.status(500).json({ 
      error: 'Gagal login.', 
      details: error.message 
    });
  }
};

/**
 * 3. LOGOUT - Hapus session Supabase
 */
const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;

    res.json({
      success: true,
      message: 'Logout berhasil.'
    });

  } catch (error) {
    console.error('❌ Error Logout:', error);
    res.status(500).json({ error: 'Gagal logout.' });
  }
};

/**
 * 4. GET PROFILE - Ambil data user yang sedang login
 */
const getProfile = async (req, res) => {
  try {
    // req.user.id sudah diisi oleh middleware authenticateToken
    const { data: profile, error } = await supabase
      .from('users')
      .select('id, full_name, role, created_at')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;

    // Gabungkan dengan data auth (email)
    const { data: authUser } = await supabase.auth.getUser(req.user.access_token);

    res.json({
      ...profile,
      email: authUser?.user?.email
    });

  } catch (error) {
    console.error('❌ Error Get Profile:', error);
    res.status(500).json({ error: 'Gagal mengambil profil.' });
  }
};

module.exports = { register, login, logout, getProfile };