import { Mastra } from '@mastra/core';
import { CloudflareDeployer } from '@mastra/deployer-cloudflare';
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
  // CloudflareDeployer 负责配置 Workers 环境
  deployer: new CloudflareDeployer({
    // 从环境变量获取配置，避免硬编码
    scope: process.env.CLOUDFLARE_ACCOUNT_ID || '',
    projectName: process.env.CLOUDFLARE_PROJECT_NAME || 'news-agent',
    auth: {
      apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
      apiEmail: process.env.CLOUDFLARE_EMAIL || '',
    },
    env: {
      // 生产环境变量配置
      DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || '',
      NODE_ENV: 'production',
    },
    kvNamespaces: [
      // 可选：添加 KV 存储命名空间
      // {
      //   binding: 'NEWS_CACHE',
      //   id: process.env.CLOUDFLARE_KV_NAMESPACE_ID || '',
      // },
    ],
    routes: [
      // 可选：自定义域名路由
      // {
      //   pattern: 'news-api.yourdomain.com/*',
      //   zone_name: 'yourdomain.com',
      //   custom_domain: true,
      // },
    ],
  }),
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
