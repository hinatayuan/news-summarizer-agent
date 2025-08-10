// Cloudflare Workers 入口文件
// Entry point for Cloudflare Workers

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

// 配置 DeepSeek API
const deepseek = createOpenAI({
  apiKey: 'sk-1edd0944d3d24a76b3ded1aa0298e20f',
  baseURL: 'https://api.deepseek.com',
});

// 简单的新闻数据（演示用）
const mockNewsData = [
  {
    title: "AI Breakthrough: DeepSeek R1 Shows Remarkable Reasoning Capabilities",
    summary: "DeepSeek's latest model demonstrates advanced reasoning abilities comparable to leading AI systems.",
    category: "Technology",
    sentiment: "Positive",
    source: "TechNews",
    url: "https://example.com/deepseek-r1",
    publishedAt: new Date().toISOString(),
    keywords: ["AI", "DeepSeek", "reasoning", "breakthrough"],
    importance: "High"
  },
  {
    title: "Cloudflare Workers Adoption Continues to Grow",
    summary: "More developers are choosing Cloudflare Workers for edge computing applications.",
    category: "Technology", 
    sentiment: "Positive",
    source: "CloudNews",
    url: "https://example.com/cloudflare-growth",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    keywords: ["Cloudflare", "edge computing", "developers"],
    importance: "Medium"
  },
  {
    title: "TypeScript Framework Mastra Gains Developer Interest",
    summary: "The new TypeScript AI agent framework is attracting attention from the developer community.",
    category: "Technology",
    sentiment: "Positive", 
    source: "DevDaily",
    url: "https://example.com/mastra-framework",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    keywords: ["TypeScript", "Mastra", "AI", "framework"],
    importance: "Medium"
  }
];

// CORS 头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 使用 DeepSeek 分析新闻
async function analyzeNewsWithAI(articles, options = {}) {
  const {
    summaryLength = 'medium',
    focusAreas = [],
    category = ''
  } = options;

  try {
    const prompt = `
请分析以下新闻文章并提供智能摘要：

文章列表：
${articles.map((article, index) => `
${index + 1}. 标题: ${article.title}
   描述: ${article.summary}
   来源: ${article.source}
   发布时间: ${article.publishedAt}
`).join('\n')}

分析要求：
- 摘要长度: ${summaryLength}
- 关注领域: ${focusAreas.join(', ') || '通用新闻'}
- 类别筛选: ${category || '所有类别'}

请提供：
1. 每篇文章的智能摘要（2-3句话）
2. 整体趋势分析
3. 重要程度评估

以JSON格式返回结果。
`;

    const result = await generateText({
      model: deepseek('deepseek-chat'),
      prompt,
      temperature: 0.3,
      maxTokens: 1000,
    });

    return {
      summaries: articles.map((article, index) => ({
        ...article,
        aiSummary: `AI分析: ${article.summary}`,
        analysisConfidence: 'High'
      })),
      aiInsights: result.text,
      totalArticles: articles.length,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('AI 分析失败:', error);
    return {
      summaries: articles.map(article => ({
        ...article,
        aiSummary: article.summary,
        analysisConfidence: 'Low'
      })),
      aiInsights: 'AI 分析服务暂时不可用',
      totalArticles: articles.length,
      timestamp: new Date().toISOString(),
      error: 'AI 服务错误'
    };
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    try {
      // 健康检查
      if (url.pathname === '/health') {
        return new Response(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'News Summarizer Agent',
          version: '1.0.0',
          powered_by: 'DeepSeek + Cloudflare Workers'
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // 快速新闻端点
      if (url.pathname === '/api/news' && request.method === 'GET') {
        const category = url.searchParams.get('category') || '';
        const maxArticles = parseInt(url.searchParams.get('maxArticles') || '5');

        let filteredNews = mockNewsData;
        
        // 按类别筛选
        if (category) {
          filteredNews = mockNewsData.filter(article => 
            article.category.toLowerCase().includes(category.toLowerCase()) ||
            article.keywords.some(keyword => keyword.toLowerCase().includes(category.toLowerCase()))
          );
        }

        // 限制数量
        filteredNews = filteredNews.slice(0, maxArticles);

        return new Response(JSON.stringify({
          success: true,
          data: {
            summaries: filteredNews,
            totalArticles: filteredNews.length,
            timestamp: new Date().toISOString(),
            sources: [...new Set(filteredNews.map(a => a.source))],
            category: category || 'all'
          }
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // 详细分析端点
      if (url.pathname === '/api/summarize' && request.method === 'POST') {
        const body = await request.json();
        const {
          category = '',
          maxArticles = 10,
          summaryLength = 'medium',
          focusAreas = []
        } = body;

        let articles = mockNewsData;
        
        // 按类别筛选
        if (category) {
          articles = articles.filter(article => 
            article.category.toLowerCase().includes(category.toLowerCase()) ||
            article.keywords.some(keyword => keyword.toLowerCase().includes(category.toLowerCase()))
          );
        }

        // 限制数量
        articles = articles.slice(0, maxArticles);

        // 使用 AI 分析
        const analysis = await analyzeNewsWithAI(articles, {
          summaryLength,
          focusAreas,
          category
        });

        return new Response(JSON.stringify({
          success: true,
          data: analysis
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // API 文档
      if (url.pathname === '/api/docs' || url.pathname === '/') {
        const docs = {
          title: 'News Summarizer Agent API',
          description: 'Real-time news summarization powered by DeepSeek AI on Cloudflare Workers',
          version: '1.0.0',
          base_url: request.url.replace(url.pathname, ''),
          endpoints: {
            'GET /health': {
              description: 'Health check endpoint',
              example: `${request.url.replace(url.pathname, '')}/health`
            },
            'GET /api/news': {
              description: 'Get quick news summaries',
              parameters: {
                category: 'News category (optional)',
                maxArticles: 'Maximum articles (default: 5)'
              },
              example: `${request.url.replace(url.pathname, '')}/api/news?category=AI&maxArticles=3`
            },
            'POST /api/summarize': {
              description: 'Get detailed AI analysis',
              body: {
                category: 'News category',
                maxArticles: 'Max articles to analyze',
                summaryLength: 'short/medium/long',
                focusAreas: 'Array of focus topics'
              },
              example: 'POST with JSON body'
            }
          },
          powered_by: {
            ai_model: 'DeepSeek V3',
            platform: 'Cloudflare Workers',
            framework: 'Mastra AI (modified)'
          }
        };

        return new Response(JSON.stringify(docs, null, 2), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // 404 处理
      return new Response(JSON.stringify({
        error: 'Endpoint not found',
        available_endpoints: ['/health', '/api/news', '/api/summarize', '/api/docs'],
        message: 'Visit /api/docs for API documentation'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });

    } catch (error) {
      console.error('请求处理错误:', error);
      
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error.message || 'Unknown error occurred',
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },
};
