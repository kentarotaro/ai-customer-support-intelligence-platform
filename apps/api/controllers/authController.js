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

  // 1. Ambil data dari body
  const { email, password, full_name, role } = req.body;

  try {
    // 2. Daftarkan user ke Supabase Auth
    // (Kirim metadata agar Trigger bisa menangkap nama & role)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name,       // PENTING: Kirim ke metadata
          role: role || 'agent'       // PENTING: Kirim ke metadata
        }
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        return res.status(409).json({ error: 'Email sudah terdaftar.' });
      }
      throw authError;
    }

    // 3. Sukses
    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Silakan cek email untuk verifikasi.',
      session: authData.session,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: full_name, // Return langsung dari input (karena database sdg proses async)
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

    // ===== TAMBAHKAN LOG INI =====
    console.log('🔍 DEBUG LOGIN:');
    console.log('  User ID:', authData.user.id);
    console.log('  Email:', authData.user.email);
    console.log('  Metadata:', authData.user.user_metadata);

    // Ambil profil dari public.users
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('full_name, role')
      .eq('id', authData.user.id)
      .single();

    // ===== TAMBAHKAN LOG INI =====
    console.log('📊 Profile Query Result:');
    console.log('  Data:', profile);
    console.log('  Error:', profileError);

    // Smart fallback
    let finalFullName = 'Unknown';
    let finalRole = 'agent';

    if (profile && profile.full_name) {
      console.log('✅ CASE 1: Data dari public.users');
      finalFullName = profile.full_name;
      finalRole = profile.role;
    } else if (authData.user.user_metadata) {
      console.log('⚠️ CASE 2: Fallback ke metadata');
      finalFullName = authData.user.user_metadata.full_name || 'Unknown';
      finalRole = authData.user.user_metadata.role || 'agent';
    } else {
      console.log('❌ CASE 3: Tidak ada data sama sekali');
    }

    console.log('📝 Final Result:');
    console.log('  Full Name:', finalFullName);
    console.log('  Role:', finalRole);

    res.json({
      success: true,
      message: 'Login berhasil!',
      session: authData.session,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: finalFullName,
        role: finalRole
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