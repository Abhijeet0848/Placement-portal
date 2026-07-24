import dotenv from 'dotenv';
dotenv.config();
import { getCareerSuggestions } from './src/services/ai.service';

async function test() {
  const result = await getCareerSuggestions(['JavaScript'], 8, ['Teaching']);
  console.log(result);
}

test();
