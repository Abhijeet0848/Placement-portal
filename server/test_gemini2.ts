import { GoogleGenerativeAI } from '@google/generative-ai';

const key = 'AQ.Ab8RN6LQL-hSqoNLUYxWZLnqGxfSwjEjXki1CUBRmCzuMXDkDg';
const genAI = new GoogleGenerativeAI(key);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Say hello world');
    console.log("SUCCESS:", result.response.text());
  } catch (error: any) {
    console.error("ERROR CAUGHT:");
    console.error(error.message || error);
  }
}

test();
