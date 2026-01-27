// Backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

/**
 * Rate Limiter untuk Auth Endpoints
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: 'Terlalu banyak percobaan login/register. Silakan coba lagi dalam 15 menit.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // FIX: Hapus keyGenerator custom (pakai default yang support IPv6)
  handler: (req, res) => {
    console.warn(`⚠️ Rate limit exceeded from IP: ${req.ip}`);
    res.status(429).json({
      error: 'Terlalu banyak percobaan. Silakan coba lagi dalam 15 menit.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: '15 minutes'
    });
  }
});

/**
 * Rate Limiter untuk AI Operations
 */
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: {
    error: 'Batas penggunaan AI tercapai (50 request/jam). Coba lagi nanti.',
    code: 'AI_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // FIX: Pakai function sederhana (library akan handle IPv6)
  keyGenerator: (req) => req.user?.id || 'anonymous',
  handler: (req, res) => {
    console.warn(`⚠️ AI rate limit exceeded from ${req.user?.email || req.ip}`);
    res.status(429).json({
      error: 'Batas penggunaan AI tercapai (50/jam). Coba lagi dalam 1 jam.',
      code: 'AI_RATE_LIMIT_EXCEEDED',
      retryAfter: '1 hour'
    });
  },
  skip: (req) => {
    return req.headers['x-bypass-rate-limit'] === process.env.RATE_LIMIT_BYPASS_KEY;
  }
});

/**
 * Rate Limiter untuk General API
 */
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    error: 'Terlalu banyak request. Slow down!',
    code: 'GENERAL_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // FIX: Hapus keyGenerator custom
  handler: (req, res) => {
    res.status(429).json({
      error: 'Terlalu banyak request. Mohon tunggu sebentar.',
      code: 'GENERAL_RATE_LIMIT_EXCEEDED'
    });
  }
});

module.exports = { authLimiter, aiLimiter, generalLimiter };