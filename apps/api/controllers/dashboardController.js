// Backend/controllers/dashboardController.js
const supabase = require('../config/supabaseClient');

/**
 * GET DASHBOARD STATS (Khusus Lead)
 * Menampilkan ringkasan total tiket, breakdown status, sentimen, dan prioritas.
 */
const getDashboardStats = async (req, res) => {
  try {
    console.log("📊 Generating Dashboard Stats...");

    // Menggunakan Promise.all agar semua query jalan barengan (Paralel) -> Lebih Cepat
    const [
      { count: totalTickets },
      { count: openTickets },
      { count: inProgressTickets },
      { count: resolvedTickets },
      { count: sentimentPos },
      { count: sentimentNeu },
      { count: sentimentNeg },
      { count: priorityHigh },
      { count: priorityMed },
      { count: priorityLow }
    ] = await Promise.all([
      // 1. Total Tiket
      supabase.from('messages').select('*', { count: 'exact', head: true }),
      
      // 2. Breakdown Status
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('status', 'open'),
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),

      // 3. Breakdown Sentiment
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('sentiment', 'Positive'),
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('sentiment', 'Neutral'),
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('sentiment', 'Negative'),

      // 4. Breakdown Priority (Perhatikan huruf kecil/besar di DB kamu)
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('priority', 'high'),
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('priority', 'medium'),
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('priority', 'low'),
    ]);

    // 5. Kirim Response JSON
    res.json({
      success: true,
      timestamp: new Date(),
      data: {
        total_tickets: totalTickets || 0,
        status_breakdown: {
          open: openTickets || 0,
          in_progress: inProgressTickets || 0,
          resolved: resolvedTickets || 0
        },
        sentiment_stats: {
          positive: sentimentPos || 0,
          neutral: sentimentNeu || 0,
          negative: sentimentNeg || 0
        },
        priority_stats: {
          high: priorityHigh || 0,
          medium: priorityMed || 0,
          low: priorityLow || 0
        }
      }
    });

  } catch (error) {
    console.error('❌ Error Dashboard Stats:', error);
    res.status(500).json({ error: 'Gagal mengambil data statistik dashboard' });
  }
};

module.exports = { getDashboardStats };