import { GoogleGenerativeAI } from '@google/generative-ai';

const key = 'AIzaSyC-lK2L2VT2qD9UwfwOmMeXmrWAEQfsTic';
const genAI = new GoogleGenerativeAI(key);

async function test() {
  try {
    console.log("Initializing model...");
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    console.log("Generating content...");
    const result = await model.generateContent('Say hello world');
    console.log("SUCCESS:", result.response.text());
  } catch (error: any) {
    console.error("ERROR CAUGHT:", error.message || error);
  }
}

test();
