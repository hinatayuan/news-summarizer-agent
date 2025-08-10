import { Mastra } from '@mastra/core';
import { CloudflareDeployer } from '@mastra/deployer-cloudflare';
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
  deployer: new CloudflareDeployer({
    scope: process.env.CLOUDFLARE_ACCOUNT_ID || '4f626c727482ce1b73d26bb9f9244d79',
    projectName: process.env.CLOUDFLARE_PROJECT_NAME || 'yd-mastra-agent',
    auth: {
      apiToken: process.env.CLOUDFLARE_API_TOKEN || 'USSX7J_xBXhvmHzNsCOTd5aEOhYa7xodTexUiY3j',
      apiEmail: process.env.CLOUDFLARE_EMAIL || '', // 你的邮箱（可选）
    },
    env: {
      DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || 'sk-1edd0944d3d24a76b3ded1aa0298e20f',
      NODE_ENV: 'production',
    },
    kvNamespaces: [
      // 如果你创建了 KV 命名空间，取消注释并填入 ID
      // {
      //   binding: 'NEWS_CACHE',
      //   id: process.env.CLOUDFLARE_KV_NAMESPACE_ID || '',
      // },
    ],
    routes: [
      // 如果你有自定义域名，可以配置路由
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
