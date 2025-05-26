// backend/routes/utilityRoutes.js
const express = require('express');
const router = express.Router();
const { checkJwt } = require('../middleware/authMiddleware'); // To protect the endpoint
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'; 

router.post('/gemini-tips', checkJwt, async (req, res, next) => { // Added next
  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_actual_gemini_api_key' || GEMINI_API_KEY === 'your_mongodb_connection_string_here') {
      console.error('Gemini API key not configured on server or is a placeholder.');
      // Create a custom error for the global handler
      const err = new Error('Gemini API key not configured on server.');
      err.statusCode = 500; // Or 503 Service Unavailable
      return next(err);
    }

    const { score, q10Score, language } = req.body; 

    if (score === undefined || q10Score === undefined || !language) {
      // Client error, handle directly
      return res.status(400).json({ message: 'Missing required parameters: score, q10Score, language.' });
    }
    
    const fullGeminiUrl = `${GEMINI_API_URL_BASE}?key=${GEMINI_API_KEY}`;

    let promptText = `A new mother has completed a well-being questionnaire. Her EPDS score is ${score} (out of 30), and her score for question 10 (thoughts of self-harm) is ${q10Score}. Provide gentle encouragement and tips. Frame this as general suggestions, not medical advice. Start the response with 'Here are some gentle thoughts and tips that might be helpful:' and end with 'Remember, these are just general suggestions. If you continue to feel overwhelmed, please reach out to your healthcare provider or a trusted support person.' Ensure the output is plain text.`;
    if (language === 'zh') {
      promptText = `一位新手妈妈完成了健康问卷。她的EPDS分数是 ${score} (满分30)，第10题（自我伤害想法）的得分是 ${q10Score}。请用简体中文提供一些温馨的鼓励和建议。请将此表述为一般性建议，而非医疗意见。回复请以“以下是一些可能有帮助的温馨想法和提示：”开头，并以“请记住，这些只是一般性建议。如果您持续感到不知所措，请联系您的医疗服务提供者或信任的支持人士。”结尾。确保输出为纯文本。`;
    }
    
    const payload = {
      contents: [{ role: "user", parts: [{ text: promptText }] }]
    };

    const geminiResponse = await fetch(fullGeminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      console.error('Gemini API Error:', errorBody);
      let detail = errorBody;
      try { detail = JSON.parse(errorBody).error.message; } catch(e) { /* ignore */ }
      // Create a custom error for the global handler
      const err = new Error(`Gemini API request failed with status ${geminiResponse.status}. Detail: ${detail}`);
      err.statusCode = geminiResponse.status; // Pass along the status from Gemini
      return next(err);
    }

    const result = await geminiResponse.json();
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      res.json({ tips: result.candidates[0].content.parts[0].text });
    } else {
      console.error('Unexpected response structure from Gemini API (Backend):', result);
      // Create a custom error for the global handler
      const err = new Error('Unexpected response from Gemini API.');
      err.statusCode = 500;
      return next(err);
    }
  } catch (error) {
    // Catch any other synchronous errors or errors from fetch itself (e.g., network issues)
    console.error('Error in /gemini-tips route:', error);
    next(error); // Pass to global error handler
  }
});

module.exports = router;
