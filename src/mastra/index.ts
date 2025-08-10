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
    scope: process.env.CLOUDFLARE_ACCOUNT_ID || '', // 你的 Cloudflare Account ID
    projectName: 'news-summarizer-agent',
    auth: {
      apiToken: process.env.CLOUDFLARE_API_TOKEN || '', // 你的 Cloudflare API Token
      apiEmail: process.env.CLOUDFLARE_EMAIL || '', // 你的 Cloudflare 邮箱（可选）
    },
    env: {
      DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || 'sk-1edd0944d3d24a76b3ded1aa0298e20f',
      NODE_ENV: 'production',
    },
    kvNamespaces: [
      {
        binding: 'NEWS_CACHE',
        id: process.env.CLOUDFLARE_KV_NAMESPACE_ID || '', // KV Namespace ID（可选）
      },
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
