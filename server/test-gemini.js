require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

async function run() {
  try {
    const topic = 'Frontend stack';
    const difficulty = 'Medium';
    const count = 5;
    
    const prompt = `
        You are an expert technical assessment creator.
        Generate exactly ${count} multiple choice questions (MCQs) about the topic "${topic}" at a "${difficulty}" difficulty level.
        
        Output strictly valid JSON that matches the following schema:
        [
          {
            "questionText": "Question text here. Use \\n for newlines, NEVER literal newlines.",
            "category": "${topic}",
            "difficulty": "${difficulty}",
            "marks": 2,
            "negativeMarks": 0.5,
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswerIndex": 0,
            "explanation": "Explanation for the correct answer"
          }
        ]
        
        CRITICAL: Respond ONLY with the JSON array. Do not include markdown blocks, ticks, or conversational text. ALL strings inside the JSON must be properly escaped. Do not use literal newline characters inside strings.
      `;

    const response = await model.generateContent(prompt);
    const text = response.response.text().trim();
    
    const matchJson = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    const cleanJson = matchJson ? matchJson[0] : text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    console.log("SUCCESS:");
    console.log(JSON.parse(cleanJson).length);

  } catch (error) {
    console.error('Error details:', error);
  }
}
run();
