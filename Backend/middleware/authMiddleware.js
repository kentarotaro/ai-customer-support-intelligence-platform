// Backend/middleware/authMiddleware.js
const supabase = require('../config/supabaseClient');

/**
 * Middleware untuk verifikasi Supabase JWT Token
 * Flow:
 * 1. Ambil token dari header Authorization
 * 2. Verifikasi token dengan supabase.auth.getUser()
 * 3. Ambil role dari public.users
 * 4. Attach data ke req.user
 */
const authenticateToken = async (req, res, next) => {
  try {
    // 1. Ambil token dari header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"// Backend/middleware/authMiddleware.js
const supabase = require('../config/supabaseClient');

/**
 * Middleware untuk verifikasi Supabase JWT Token
 * Flow:
 * 1. Ambil token dari header Authorization
 * 2. Verifikasi token dengan supabase.auth.getUser()
 * 3. Ambil role dari public.users
 * 4. Attach data ke req.user
 */
const authenticateToken = async (req, res, next) => {
  try {
    // 1. Ambil token dari header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ 
        error: 'Token tidak ditemukan. Silakan login terlebih dahulu.',
        code: 'NO_TOKEN'
      });
    }

    // 2. Verifikasi token dengan Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError) {
      console.error('❌ Auth Error:', authError.message);
      return res.status(401).json({ 
        error: 'Token tidak valid atau sudah kadaluarsa.',
        code: 'INVALID_TOKEN',
        details: authError.message
      });
    }

    if (!user) {
      return res.status(401).json({ 
        error: 'User tidak ditemukan.',
        code: 'USER_NOT_FOUND'
      });
    }

    // 3. Ambil role dari public.users
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('⚠️ Profile Error:', profileError.message);
      // Jika profil tidak ditemukan, set default role
      console.warn(`User ${user.email} tidak punya profil di public.users`);
    }

    // 4. Attach data user ke request object (bisa diakses di controller)
    req.user = {
      id: user.id,
      email: user.email,
      role: profile?.role || 'agent', // Default role jika tidak ada profil
      full_name: profile?.full_name || 'Unknown',
      access_token: token,
      // Data tambahan dari Supabase Auth (opsional)
      email_verified: user.email_confirmed_at ? true : false,
      last_sign_in: user.last_sign_in_at
    };

    // Lanjut ke controller
    next();

  } catch (error) {
    console.error('❌ Middleware Error:', error);
    return res.status(500).json({ 
      error: 'Gagal memverifikasi token.',
      code: 'INTERNAL_ERROR',
      details: error.message
    });
  }
};

/**
 * Middleware untuk cek role (Agent vs Lead)
 * Contoh usage: 
 * router.get('/analytics', authenticateToken, authorizeRole(['lead']), controller)
 */
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    // Pastikan authenticateToken sudah jalan dulu
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized. Middleware authenticateToken belum dijalankan.',
        code: 'MISSING_AUTH_MIDDLEWARE'
      });
    }

    // Cek apakah role user ada di allowedRoles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Akses ditolak. Endpoint ini hanya untuk role: ${allowedRoles.join(', ')}.`,
        code: 'FORBIDDEN',
        your_role: req.user.role,
        required_roles: allowedRoles
      });
    }

    // Role valid, lanjut ke controller
    next();
  };
};

/**
 * Middleware opsional: Cek apakah user sudah verified email
 */
const requireEmailVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!req.user.email_verified) {
    return res.status(403).json({ 
      error: 'Email belum diverifikasi. Silakan cek inbox Anda.',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }

  next();
};

module.exports = { 
  authenticateToken, 
  authorizeRole,
  requireEmailVerified 
};

    if (!token) {
      return res.status(401).json({ 
        error: 'Token tidak ditemukan. Silakan login terlebih dahulu.',
        code: 'NO_TOKEN'
      });
    }

    // 2. Verifikasi token dengan Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError) {
      console.error('❌ Auth Error:', authError.message);
      return res.status(401).json({ 
        error: 'Token tidak valid atau sudah kadaluarsa.',
        code: 'INVALID_TOKEN',
        details: authError.message
      });
    }

    if (!user) {
      return res.status(401).json({ 
        error: 'User tidak ditemukan.',
        code: 'USER_NOT_FOUND'
      });
    }

    // 3. Ambil role dari public.users
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('⚠️ Profile Error:', profileError.message);
      // Jika profil tidak ditemukan, set default role
      console.warn(`User ${user.email} tidak punya profil di public.users`);
    }

    // 4. Attach data user ke request object (bisa diakses di controller)
    req.user = {
      id: user.id,
      email: user.email,
      role: profile?.role || 'agent', // Default role jika tidak ada profil
      full_name: profile?.full_name || 'Unknown',
      access_token: token,
      // Data tambahan dari Supabase Auth (opsional)
      email_verified: user.email_confirmed_at ? true : false,
      last_sign_in: user.last_sign_in_at
    };

    // Lanjut ke controller
    next();

  } catch (error) {
    console.error('❌ Middleware Error:', error);
    return res.status(500).json({ 
      error: 'Gagal memverifikasi token.',
      code: 'INTERNAL_ERROR',
      details: error.message
    });
  }
};

/**
 * Middleware untuk cek role (Agent vs Lead)
 * Contoh usage: 
 * router.get('/analytics', authenticateToken, authorizeRole(['lead']), controller)
 */
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    // Pastikan authenticateToken sudah jalan dulu
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized. Middleware authenticateToken belum dijalankan.',
        code: 'MISSING_AUTH_MIDDLEWARE'
      });
    }

    // Cek apakah role user ada di allowedRoles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Akses ditolak. Endpoint ini hanya untuk role: ${allowedRoles.join(', ')}.`,
        code: 'FORBIDDEN',
        your_role: req.user.role,
        required_roles: allowedRoles
      });
    }

    // Role valid, lanjut ke controller
    next();
  };
};

/**
 * Middleware opsional: Cek apakah user sudah verified email
 */
const requireEmailVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!req.user.email_verified) {
    return res.status(403).json({ 
      error: 'Email belum diverifikasi. Silakan cek inbox Anda.',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }

  next();
};

module.exports = { 
  authenticateToken, 
  authorizeRole,
  requireEmailVerified 
};