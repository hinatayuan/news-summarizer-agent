import { Mastra } from '@mastra/core';
import { createOpenAI } from '@ai-sdk/openai';
import { newsSummarizerAgent } from './agents/news-summarizer';
import { fetchNewsFromRss } from './tools/news-fetcher';
import { summarizeNews } from './tools/news-summarizer';

// Configure DeepSeek API using OpenAI-compatible interface
const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || 'sk-1edd0944d3d24a76b3ded1aa0298e20f',
  baseURL: 'https://api.deepseek.com',
});

export const mastra = new Mastra({
  agents: {
    newsSummarizer: newsSummarizerAgent,
  },
  tools: {
    fetchNewsFromRss,
    summarizeNews,
  },
  models: {
    deepseekV3: deepseek('deepseek-chat'),
    deepseekR1: deepseek('deepseek-reasoner'),
  },
});
