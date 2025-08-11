import { Agent } from '@mastra/core/agent';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

// 安全的 DeepSeek 模型配置 - 从环境变量获取
const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
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
- Focus on factual information only
- Support streaming responses for real-time updates
- Provide contextual analysis based on user intent`,

  model: deepseek('deepseek-chat'),
  
  tools: ['fetchNewsFromRss', 'summarizeNews'],
  
  // 启用流式响应
  enableStreaming: true,
  
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
      importance: z.enum(['High', 'Medium', 'Low']).describe('Estimated importance/urgency of the news'),
      aiSummary: z.string().optional().describe('AI-generated detailed analysis'),
      analysisConfidence: z.string().optional().describe('Confidence level of the analysis')
    })),
    totalArticles: z.number().describe('Total number of articles processed'),
    timestamp: z.string().describe('When this summary was generated'),
    sources: z.array(z.string()).describe('List of news sources used'),
    insights: z.object({
      categoriesFound: z.array(z.string()).describe('Categories of news found'),
      sentimentBreakdown: z.record(z.number()).describe('Sentiment distribution'),
      highImportanceNews: z.number().describe('Number of high importance articles'),
      averageConfidence: z.number().optional().describe('Average analysis confidence')
    }).optional().describe('Additional insights and analytics'),
    aiInsights: z.string().optional().describe('AI-generated insights about trends and patterns')
  }),

  maxRetries: 3,
  temperature: 0.3, // Lower temperature for more consistent, factual summaries
  
  // 预处理用户意图和参数
  async beforeRun(context) {
    const { intent, category, maxArticles } = context;
    return {
      ...context,
      processedIntent: intent,
      targetCategory: category,
      articleLimit: maxArticles || 5,
      streamingEnabled: true
    };
  },
  
  // 后处理结果，确保返回格式正确
  async afterRun(result, context) {
    return {
      ...result,
      metadata: {
        processedAt: new Date().toISOString(),
        intent: context.processedIntent,
        category: context.targetCategory,
        streamingMode: context.streamingEnabled
      }
    };
  }
});
