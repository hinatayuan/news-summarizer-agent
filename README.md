# News Summarizer Agent

A real-time news summarization service built with **Mastra AI** framework and **DeepSeek API**, deployed on **Cloudflare Workers**.

## Features

🤖 **AI-Powered Summarization**: Uses DeepSeek V3 for intelligent news analysis  
📰 **Multi-Source News**: Fetches from multiple RSS feeds and news sources  
🏷️ **Smart Categorization**: Automatically categorizes news by topic  
📊 **Sentiment Analysis**: Analyzes sentiment of each article  
🔗 **Keyword Extraction**: Extracts relevant keywords and topics  
⚡ **Real-Time Processing**: Fast response times with edge deployment  
🌍 **Global CDN**: Deployed on Cloudflare Workers for worldwide access  
🚀 **One-Command Deploy**: Deploy with `npm run deploy` using Mastra CloudflareDeployer  

## Quick Start

### Prerequisites

- Node.js 20.0+
- Cloudflare account
- DeepSeek API key

### Setup & Deploy

1. **Clone and install**
   ```bash
   git clone https://github.com/hinatayuan/news-summarizer-agent.git
   cd news-summarizer-agent
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials (see configuration section)
   ```

3. **Deploy to Cloudflare Workers**
   ```bash
   npm run build
   npm run deploy
   ```

That's it! Your news summarizer agent is now live on Cloudflare Workers.

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```bash
# Required: DeepSeek API
DEEPSEEK_API_KEY=sk-1edd0944d3d24a76b3ded1aa0298e20f

# Required: Cloudflare Configuration
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_EMAIL=your-email@example.com

# Optional: KV Namespace for caching
CLOUDFLARE_KV_NAMESPACE_ID=your-kv-namespace-id
```

### Getting Cloudflare Credentials

#### 1. Cloudflare Account ID
- Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
- Select any domain or go to the right sidebar
- Copy your **Account ID** from the right sidebar

#### 2. Cloudflare API Token
- Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
- Click "Create Token"
- Use "Custom token" template with these permissions:
  - **Account**: `Cloudflare Workers:Edit`
  - **Zone**: `Zone:Read` (if using custom domains)
  - **Zone Resources**: Include all zones or specific zones

#### 3. KV Namespace (Optional)
- Go to [Workers KV](https://dash.cloudflare.com/workers/kv/namespaces)
- Click "Create namespace"
- Name it `NEWS_CACHE`
- Copy the Namespace ID

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

## Deployment Process

The project uses **Mastra CloudflareDeployer** for seamless deployment:

1. **Build**: `npm run build` - Mastra packages your application
2. **Deploy**: `npm run deploy` - Automatically deploys to Cloudflare Workers
3. **Access**: Your API is live at `https://news-summarizer-agent.your-subdomain.workers.dev`

### Deployment Features

✅ **Automatic Configuration**: Mastra generates optimized Cloudflare Workers config  
✅ **Environment Management**: Secure handling of API keys and secrets  
✅ **Edge Optimization**: Code is optimized for Cloudflare's edge runtime  
✅ **Route Management**: Automatic API route configuration  
✅ **KV Integration**: Optional caching with Cloudflare KV  

## Tech Stack

- **Framework**: [Mastra AI](https://mastra.ai) - TypeScript agent framework
- **AI Model**: [DeepSeek V3](https://deepseek.com) - Advanced language model
- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com) - Edge computing platform
- **Deployer**: Mastra CloudflareDeployer - One-command deployment
- **Language**: TypeScript

## Advanced Configuration

### Custom Domains

To use a custom domain, update `src/mastra/index.ts`:

```typescript
deployer: new CloudflareDeployer({
  // ... other config
  routes: [
    {
      pattern: 'news-api.yourdomain.com/*',
      zone_name: 'yourdomain.com',
      custom_domain: true,
    },
  ],
}),
```

### KV Caching

Enable caching by setting `CLOUDFLARE_KV_NAMESPACE_ID` in your environment variables. The application will automatically cache news articles to reduce API calls.

### News Sources

Customize news sources by modifying `src/mastra/tools/news-fetcher.ts`.

## Usage Examples

### Using curl

**Get quick tech news:**
```bash
curl "https://your-worker.workers.dev/api/news?category=technology&maxArticles=3"
```

**Detailed analysis:**
```bash
curl -X POST "https://your-worker.workers.dev/api/summarize" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "AI",
    "summaryLength": "long",
    "maxArticles": 10,
    "focusAreas": ["machine learning", "startups"]
  }'
```

### Using JavaScript

```javascript
// Quick news fetch
const response = await fetch('/api/news?category=business&maxArticles=5');
const news = await response.json();

// Detailed analysis
const analysis = await fetch('/api/summarize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    category: 'technology',
    summaryLength: 'medium',
    focusAreas: ['AI', 'blockchain']
  })
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Deploy and test with `npm run deploy`
6. Submit a pull request

## Cost Estimation

**Cloudflare Workers:**
- Free tier: 100,000 requests/day
- Paid: $5/month for 10M requests

**DeepSeek API:**
- Extremely cost-effective compared to other LLMs
- Pay per token usage

## Troubleshooting

### Common Issues

1. **Deploy fails**: Check your Cloudflare credentials in `.env`
2. **API errors**: Verify your DeepSeek API key
3. **CORS issues**: The app includes CORS headers by default
4. **Rate limits**: Consider implementing caching with KV

### Support

- 📖 [Mastra Documentation](https://mastra.ai/docs)
- 🤖 [DeepSeek API Docs](https://platform.deepseek.com/docs)
- ⚡ [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Powered By

- [Mastra AI](https://mastra.ai) - TypeScript agent framework
- [DeepSeek](https://deepseek.com) - Advanced AI reasoning
- [Cloudflare Workers](https://workers.cloudflare.com) - Edge computing

---

Built with ❤️ using Mastra AI framework and DeepSeek API  
Deploy with one command: `npm run deploy`
