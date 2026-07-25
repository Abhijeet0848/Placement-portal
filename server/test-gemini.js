require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

async function run() {
  try {
    const prompt = `
        You are an expert technical assessment creator.
        Generate exactly 1 multiple choice questions (MCQs) about the topic "Frontend" at a "Medium" difficulty level.
        
        Output strictly valid JSON that matches the following schema:
        [
          {
            "questionText": "Question text here",
            "category": "Frontend",
            "difficulty": "Medium",
            "marks": 2,
            "negativeMarks": 0.5,
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswerIndex": 0,
            "explanation": "Explanation for the correct answer"
          }
        ]
        
        Respond only with the JSON array. Do not include markdown blocks or any other text.
      `;
    const response = await model.generateContent(prompt);
    const text = response.response.text();
    console.log('--- raw text ---');
    console.log(text);
    console.log('----------------');

    const matchJson = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    const cleanJson = matchJson ? matchJson[0] : text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    console.log('--- parsed json ---');
    console.log(JSON.parse(cleanJson));

  } catch(e) {
    console.error('Error:', e);
  }
}
run();
