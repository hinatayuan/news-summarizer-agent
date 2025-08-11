import { Mastra } from '@mastra/core';
import { createOpenAI } from '@ai-sdk/openai';
import { newsSummarizerAgent } from './agents/news-summarizer';
import { fetchNewsFromRss } from './tools/news-fetcher';
import { summarizeNews } from './tools/news-summarizer';

// 安全的 DeepSeek API 配置 - 从环境变量获取密钥
const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
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
  // 移除 CloudflareDeployer，使用 Wrangler 部署
  server: {
    port: 4111,
    timeout: 30000,
    cors: {
      origin: '*',
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
      credentials: false,
    },
  },
});
