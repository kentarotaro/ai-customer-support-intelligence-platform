// Backend/services/aiService.js
const { model } = require('../config/gemini');

/**
 * FUNGSI 1: KLASIFIKASI (Jalur Cepat - Background)
 */
const analyzeIncomingMessage = async (text) => {
  try {
    const prompt = `
      Analyze the following customer message.
      Return ONLY a JSON object (no markdown, no backticks) with these fields:
      - category: "Billing" | "Technical" | "General" | "Inquiry"
      - sentiment: "Positive" | "Neutral" | "Negative"
      - priority: "High" | "Medium" | "Low" (High if user is angry or money issue)
      
      Message: "${text}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();
    
    // Bersihkan format markdown jika ada
    const cleanJson = textResponse.replace(/```json|```/g, '').trim();
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("❌ Error AI Classification:", error);
    // Return default jika error
    return { category: "General", sentiment: "Neutral", priority: "Medium" };
  }
};

/**
 * FUNGSI 2: SUMMARIZATION (Jalur Lambat - On Demand)
 */
const generateSummary = async (text, customerName) => {
  try {
    const prompt = `
      Act as a professional Customer Support Assistant.
      Read this message from customer named ${customerName}.
      Return ONLY a JSON object (no markdown) with:
      - summary: A concise summary of the issue (max 2 sentences).
      - suggested_reply: A polite, professional draft reply (in Indonesian).

      Message: "${text}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();
    
    const cleanJson = textResponse.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("❌ Error AI Summary:", error);
    return { summary: "Gagal memproses ringkasan.", suggested_reply: "" };
  }
};

module.exports = { analyzeIncomingMessage, generateSummary };