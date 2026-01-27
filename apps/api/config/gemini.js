// Backend/config/gemini.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log("🚀 Initializing Gemini AI Service...");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Menggunakan model Gemini 2.5 Flash sesuai request (Pastikan model ini tersedia di regionmu)
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash" 
});

module.exports = { model };