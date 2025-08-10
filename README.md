# News Summarizer Agent

A real-time news summarization service built with **Mastra AI** framework and **DeepSeek API**, ready to deploy on **Cloudflare Workers**.

## 🚀 Quick Deploy (已配置/Pre-configured)

项目已配置完成，可以直接部署！  
*Project is pre-configured and ready to deploy!*

### Option 1: 一键部署脚本 (One-Click Script)

```bash
git clone https://github.com/hinatayuan/news-summarizer-agent.git
cd news-summarizer-agent
chmod +x deploy.sh
./deploy.sh
```

### Option 2: 手动部署 (Manual Deploy)

```bash
git clone https://github.com/hinatayuan/news-summarizer-agent.git
cd news-summarizer-agent
npm install
npm run build
npm run deploy
```

部署成功后，你的 API 将在以下地址可用：
*After deployment, your API will be available at:*

```
https://yd-mastra-agent.your-subdomain.workers.dev
```

## ✅ 已配置信息 (Pre-configured)

- **DeepSeek API**: `sk-1edd0944d3d24a76b3ded1aa0298e20f`
- **Cloudflare Account ID**: `4f626c727482ce1b73d26bb9f9244d79`
- **Project Name**: `yd-mastra-agent`
- **Deployment**: Mastra CloudflareDeployer

## 🧪 测试 API (Test API)

部署完成后，测试以下端点：

### 健康检查 (Health Check)
```bash
curl https://yd-mastra-agent.your-subdomain.workers.dev/health
```

### 快速新闻摘要 (Quick News)
```bash
curl "https://yd-mastra-agent.your-subdomain.workers.dev/api/news?category=technology&maxArticles=5"
```

### 详细分析 (Detailed Analysis)
```bash
curl -X POST "https://yd-mastra-agent.your-subdomain.workers.dev/api/summarize" \
  -H "Content-Type: application/json" \
  -d '{"category": "AI", "maxArticles": 10, "summaryLength": "medium"}'
```

### API 文档 (API Documentation)
```bash
curl https://yd-mastra-agent.your-subdomain.workers.dev/api/docs
```

## Features

🤖 **AI-Powered Summarization**: Uses DeepSeek V3 for intelligent news analysis  
📰 **Multi-Source News**: Fetches from multiple RSS feeds and news sources  
🏷️ **Smart Categorization**: Automatically categorizes news by topic  
📊 **Sentiment Analysis**: Analyzes sentiment of each article  
🔗 **Keyword Extraction**: Extracts relevant keywords and topics  
⚡ **Real-Time Processing**: Fast response times with edge deployment  
🌍 **Global CDN**: Deployed on Cloudflare Workers for worldwide access  
🚀 **One-Command Deploy**: Deploy with `npm run deploy` using Mastra CloudflareDeployer  

## API Endpoints

### Health Check
```
GET /health
```

### Quick News Summary
```
GET /api/news?category=technology&maxArticles=5
```

### Comprehensive Analysis
```
POST /api/summarize
Content-Type: application/json

{
  "category": "technology",
  "maxArticles": 10,
  "summaryLength": "medium",
  "focusAreas": ["AI", "startups", "crypto"]
}
```

### API Documentation
```
GET /api/docs
```

## Response Format

```json
{
  "success": true,
  "data": {
    "summaries": [
      {
        "title": "AI Breakthrough in Language Models",
        "summary": "New research shows significant improvements in AI reasoning capabilities...",
        "category": "Technology",
        "sentiment": "Positive",
        "source": "TechNews",
        "url": "https://example.com/article",
        "publishedAt": "2025-08-10T13:00:00Z",
        "keywords": ["AI", "language models", "research"],
        "importance": "High"
      }
    ],
    "totalArticles": 5,
    "timestamp": "2025-08-10T13:30:00Z",
    "sources": ["TechNews", "HackerNews"],
    "insights": {
      "categoriesFound": ["Technology", "Business"],
      "sentimentBreakdown": {"Positive": 3, "Neutral": 2},
      "highImportanceNews": 1
    }
  }
}
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server with Mastra playground
npm run dev

# Open playground at http://localhost:4111
```

## Tech Stack

- **Framework**: [Mastra AI](https://mastra.ai) - TypeScript agent framework
- **AI Model**: [DeepSeek V3](https://deepseek.com) - Advanced language model
- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com) - Edge computing platform
- **Deployer**: Mastra CloudflareDeployer - One-command deployment
- **Language**: TypeScript

## Advanced Configuration

### Custom Environment Variables

If you want to use custom environment variables, create a `.env` file:

```bash
cp .env.example .env
# Edit .env with your custom settings
```

### KV Caching (Optional)

To enable caching:

1. Create a KV namespace in Cloudflare Dashboard
2. Update `CLOUDFLARE_KV_NAMESPACE_ID` in `.env`
3. Uncomment KV configuration in `src/mastra/index.ts`

### Custom Domains (Optional)

To use a custom domain, update the routes configuration in `src/mastra/index.ts`.

## Usage Examples

### Using JavaScript

```javascript
const apiBase = 'https://yd-mastra-agent.your-subdomain.workers.dev';

// Quick news fetch
const response = await fetch(`${apiBase}/api/news?category=business&maxArticles=5`);
const news = await response.json();

// Detailed analysis
const analysis = await fetch(`${apiBase}/api/summarize`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    category: 'technology',
    summaryLength: 'medium',
    focusAreas: ['AI', 'blockchain']
  })
});
```

## Project Structure

```
news-summarizer-agent/
├── src/mastra/
│   ├── index.ts              # 主配置 + CloudflareDeployer
│   ├── agents/
│   │   └── news-summarizer.ts # AI Agent
│   └── tools/
│       ├── news-fetcher.ts    # 新闻获取工具
│       └── news-summarizer.ts # 新闻摘要工具
├── docs/
│   └── CLOUDFLARE_DEPLOY.md   # 详细部署指南
├── deploy.sh                  # 一键部署脚本
├── .env.example               # 环境变量模板
└── README.md                  # 项目文档
```

## Troubleshooting

### Common Issues

1. **Deploy fails**: Check your internet connection and Cloudflare credentials
2. **API errors**: Verify your DeepSeek API key is valid
3. **CORS issues**: The app includes CORS headers by default
4. **Rate limits**: Consider implementing caching with KV

### Support

- 📖 [Mastra Documentation](https://mastra.ai/docs)
- 🤖 [DeepSeek API Docs](https://platform.deepseek.com/docs)
- ⚡ [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- 📋 [Deployment Guide](docs/CLOUDFLARE_DEPLOY.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Deploy and test with `npm run deploy`
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Powered By

- [Mastra AI](https://mastra.ai) - TypeScript agent framework
- [DeepSeek](https://deepseek.com) - Advanced AI reasoning
- [Cloudflare Workers](https://workers.cloudflare.com) - Edge computing

---

Built with ❤️ using Mastra AI framework and DeepSeek API  
**Ready to deploy with one command: `./deploy.sh`** 🚀
