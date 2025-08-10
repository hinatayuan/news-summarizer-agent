/**
 * News Summarizer Agent 客户端调用示例
 * Client Examples for News Summarizer Agent API
 */

// API 基础地址 - 替换为你的实际部署地址
// API Base URL - Replace with your actual deployment URL
const API_BASE = 'https://yd-mastra-agent.your-subdomain.workers.dev';

/**
 * 新闻摘要 API 客户端类
 * News Summarizer API Client Class
 */
class NewsSummarizerClient {
  constructor(baseUrl = API_BASE) {
    this.baseUrl = baseUrl;
  }

  /**
   * 健康检查
   * Health Check
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      console.log('✅ Health Check:', data);
      return data;
    } catch (error) {
      console.error('❌ Health Check Failed:', error);
      throw error;
    }
  }

  /**
   * 获取快速新闻摘要
   * Get Quick News Summary
   */
  async getQuickNews(options = {}) {
    const {
      category = 'technology',
      maxArticles = 5
    } = options;

    try {
      const url = `${this.baseUrl}/api/news?category=${category}&maxArticles=${maxArticles}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📰 Quick News:', data);
      return data;
    } catch (error) {
      console.error('❌ Quick News Failed:', error);
      throw error;
    }
  }

  /**
   * 获取详细新闻分析
   * Get Detailed News Analysis
   */
  async getDetailedAnalysis(options = {}) {
    const {
      category = 'technology',
      maxArticles = 10,
      summaryLength = 'medium',
      focusAreas = ['AI', 'startups']
    } = options;

    try {
      const response = await fetch(`${this.baseUrl}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          maxArticles,
          summaryLength,
          focusAreas
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('🔍 Detailed Analysis:', data);
      return data;
    } catch (error) {
      console.error('❌ Detailed Analysis Failed:', error);
      throw error;
    }
  }

  /**
   * 获取 API 文档
   * Get API Documentation
   */
  async getApiDocs() {
    try {
      const response = await fetch(`${this.baseUrl}/api/docs`);
      const data = await response.json();
      console.log('📋 API Documentation:', data);
      return data;
    } catch (error) {
      console.error('❌ API Docs Failed:', error);
      throw error;
    }
  }
}

// 使用示例 - Usage Examples
async function examples() {
  const client = new NewsSummarizerClient();

  console.log('🚀 开始测试新闻摘要 API...');
  console.log('🚀 Starting News Summarizer API tests...\n');

  try {
    // 1. 健康检查
    console.log('1️⃣ 健康检查 / Health Check:');
    await client.checkHealth();
    console.log('');

    // 2. 获取快速科技新闻
    console.log('2️⃣ 快速科技新闻 / Quick Tech News:');
    await client.getQuickNews({
      category: 'technology',
      maxArticles: 3
    });
    console.log('');

    // 3. 获取详细 AI 新闻分析
    console.log('3️⃣ 详细 AI 新闻分析 / Detailed AI News Analysis:');
    await client.getDetailedAnalysis({
      category: 'AI',
      maxArticles: 5,
      summaryLength: 'long',
      focusAreas: ['machine learning', 'chatgpt', 'deepseek']
    });
    console.log('');

    // 4. 获取商业新闻
    console.log('4️⃣ 商业新闻 / Business News:');
    await client.getQuickNews({
      category: 'business',
      maxArticles: 3
    });
    console.log('');

    // 5. 获取 API 文档
    console.log('5️⃣ API 文档 / API Documentation:');
    await client.getApiDocs();

  } catch (error) {
    console.error('💥 测试失败 / Test Failed:', error);
  }
}

// Node.js 环境中使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NewsSummarizerClient, examples };
}

// 浏览器环境中使用
if (typeof window !== 'undefined') {
  window.NewsSummarizerClient = NewsSummarizerClient;
  window.newsApiExamples = examples;
}

// 自动运行示例（如果直接执行此文件）
if (typeof require !== 'undefined' && require.main === module) {
  examples();
}
