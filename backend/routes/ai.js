const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const upload = multer({ dest: 'uploads/' });

// Analyze image with Gemini Vision
router.post('/analyze-image', upload.single('image'), async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const imageData = fs.readFileSync(req.file.path);
    const base64Image = imageData.toString('base64');
    const mimeType = req.file.mimetype;

    const prompt = `Analyze this community issue image. Reply ONLY with this JSON, no extra text:
{"category":"Pothole or Water Leakage or Broken Streetlight or Garbage/Waste or Damaged Road or Flooding or Graffiti or Other","severity":"Low or Medium or High or Critical","title":"max 5 words","description":"one sentence","analysis":"one sentence about why it needs attention"}`;

    const result = await Promise.race([
      model.generateContent([
        prompt,
        { inlineData: { data: base64Image, mimeType } }
      ]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout after 60s')), 60000)
      )
    ]);

    const text = result.response.text();
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.json(parsed);
  } catch (err) {
    console.error('AI analyze error:', err.message);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: err.message });
  }
});

// AI Chat assistant
router.post('/chat', async (req, res) => {
  try {
    const { message, issuesSummary } = req.body;
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are CommunityBot, a helpful AI assistant for the Community Hero civic issue platform.
Current community issues data: ${issuesSummary}
User question: ${message}
Answer helpfully and concisely based on the issues data.`;

    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;