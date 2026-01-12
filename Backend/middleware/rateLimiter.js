// Backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

/**
 * Rate Limiter untuk Auth Endpoints
 * Prevent brute force login/register
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // Max 5 requests per 15 menit per IP
  message: {
    error: 'Terlalu banyak percobaan login/register. Silakan coba lagi dalam 15 menit.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
  // Custom key generator (pakai IP address)
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
  // Handler ketika limit exceeded
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
 * Prevent spam AI calls (mahal dan bisa abuse!)
 */
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 50, // Max 50 AI calls per jam per IP
  message: {
    error: 'Batas penggunaan AI tercapai (50 request/jam). Coba lagi nanti.',
    code: 'AI_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Pakai user ID kalau sudah login, kalau tidak pakai IP
    return req.user?.id || req.ip;
  },
  handler: (req, res) => {
    console.warn(`⚠️ AI rate limit exceeded from ${req.user?.email || req.ip}`);
    res.status(429).json({
      error: 'Batas penggunaan AI tercapai (50/jam). Coba lagi dalam 1 jam.',
      code: 'AI_RATE_LIMIT_EXCEEDED',
      retryAfter: '1 hour'
    });
  },
  // Skip limiter untuk testing (opsional)
  skip: (req) => {
    // Bypass rate limit kalau ada header khusus untuk testing
    return req.headers['x-bypass-rate-limit'] === process.env.RATE_LIMIT_BYPASS_KEY;
  }
});

/**
 * Rate Limiter untuk General API
 * Prevent spam requests
 */
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 100, // Max 100 requests per menit
  message: {
    error: 'Terlalu banyak request. Slow down!',
    code: 'GENERAL_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Terlalu banyak request. Mohon tunggu sebentar.',
      code: 'GENERAL_RATE_LIMIT_EXCEEDED'
    });
  }
});

module.exports = { authLimiter, aiLimiter, generalLimiter };