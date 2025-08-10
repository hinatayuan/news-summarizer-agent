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
    // 使用硬编码值确保配置正确
    scope: '4f626c727482ce1b73d26bb9f9244d79',
    projectName: 'yd-mastra-agent',
    auth: {
      apiToken: 'nludYXBjgyYP4lQvfMiqb061Hk6juU9rwmWjs56q',
      apiEmail: process.env.CLOUDFLARE_EMAIL || 'Liuweiyuan0713@gmail.com',
    },
    env: {
      DEEPSEEK_API_KEY: 'sk-1edd0944d3d24a76b3ded1aa0298e20f',
      NODE_ENV: 'production',
    },
    kvNamespaces: [
      // KV 命名空间暂时注释掉，避免权限问题
      // {
      //   binding: 'NEWS_CACHE',
      //   id: process.env.CLOUDFLARE_KV_NAMESPACE_ID || '',
      // },
    ],
    routes: [
      // 自定义域名路由暂时注释掉
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
