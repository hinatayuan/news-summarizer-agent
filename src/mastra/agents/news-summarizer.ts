import { Agent } from '@mastra/core/agent';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

// Configure DeepSeek model
const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || 'sk-1edd0944d3d24a76b3ded1aa0298e20f',
  baseURL: 'https://api.deepseek.com',
});

export const newsSummarizerAgent = new Agent({
  name: 'News Summarizer',
  instructions: `You are a professional news summarizer AI agent. Your role is to:

1. Fetch the latest news from reliable sources
2. Analyze and extract key information from news articles
3. Create concise, informative summaries
4. Categorize news by topics (Technology, Politics, Business, Sports, etc.)
5. Provide sentiment analysis for each article
6. Return structured data with headlines, summaries, categories, and metadata

Guidelines:
- Keep summaries between 2-3 sentences
- Maintain objectivity and avoid bias
- Include source information
- Highlight breaking news or urgent updates
- Use clear, professional language
- Provide accurate timestamps and publication dates
- Focus on factual information only`,

  model: deepseek('deepseek-chat'),
  
  tools: ['fetchNewsFromRss', 'summarizeNews'],
  
  outputSchema: z.object({
    summaries: z.array(z.object({
      title: z.string().describe('Original news article title'),
      summary: z.string().describe('2-3 sentence summary of the article'),
      category: z.enum(['Technology', 'Politics', 'Business', 'Sports', 'Entertainment', 'Science', 'Health', 'World', 'Other']).describe('News category'),
      sentiment: z.enum(['Positive', 'Negative', 'Neutral']).describe('Overall sentiment of the article'),
      source: z.string().describe('Source website or publication'),
      url: z.string().url().describe('Original article URL'),
      publishedAt: z.string().describe('Publication date and time'),
      keywords: z.array(z.string()).describe('Key topics or keywords extracted from the article'),
      importance: z.enum(['High', 'Medium', 'Low']).describe('Estimated importance/urgency of the news')
    })),
    totalArticles: z.number().describe('Total number of articles processed'),
    timestamp: z.string().describe('When this summary was generated'),
    sources: z.array(z.string()).describe('List of news sources used')
  }),

  maxRetries: 3,
  temperature: 0.3, // Lower temperature for more consistent, factual summaries
});
