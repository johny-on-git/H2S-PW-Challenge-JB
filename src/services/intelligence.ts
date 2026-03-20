import { GoogleGenerativeAI } from '@google/generative-ai';
import { Report } from './reports';

/**
 * Summarizes the provided civic reports using Gemini 1.5 Flash.
 */
export async function summarizeIssues(reports: Report[]): Promise<string> {
  if (reports.length === 0) {
    return 'No reports available for summarization.';
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || 'placeholder-key';
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Summarize the following civic reports reported by citizens. 
      Provide a concise, professional, and actionable summary for emergency dispatchers.
      
      Reports:
      ${reports.map(r => `- [${r.categoryId}] ${r.description || 'No description provided'}`).join('\n')}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return 'Summary unavailable (AI service error).';
  }
}
