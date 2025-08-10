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

## Tech Stack

- **Framework**: [Mastra AI](https://mastra.ai) - TypeScript agent framework
- **AI Model**: [DeepSeek V3](https://deepseek.com) - Advanced language model
- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com) - Edge computing platform
- **Language**: TypeScript
- **Build Tool**: Wrangler

## Local Development

### Prerequisites

- Node.js 20.0+
- npm or yarn
- DeepSeek API key

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/hinatayuan/news-summarizer-agent.git
   cd news-summarizer-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your DeepSeek API key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open Mastra playground**
   ```
   http://localhost:4111
   ```

## Deployment to Cloudflare Workers

### Prerequisites

- Cloudflare account
- Wrangler CLI installed

### Deploy Steps

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Create KV Namespace (optional, for caching)**
   ```bash
   wrangler kv:namespace create "NEWS_CACHE"
   wrangler kv:namespace create "NEWS_CACHE" --preview
   ```

4. **Update wrangler.toml**
   - Update the KV namespace IDs in `wrangler.toml`

5. **Set environment variables**
   ```bash
   wrangler secret put DEEPSEEK_API_KEY
   # Enter your DeepSeek API key when prompted
   ```

6. **Deploy**
   ```bash
   npm run build
   npm run deploy
   ```

### Cloudflare Configuration

You'll need to configure these in your Cloudflare Workers dashboard:

**Environment Variables:**
- `DEEPSEEK_API_KEY`: Your DeepSeek API key
- `NODE_ENV`: Set to "production"

**KV Namespaces (Optional):**
- `NEWS_CACHE`: For caching news articles and reducing API calls

**Worker Settings:**
- **CPU Limits**: Standard (sufficient for most use cases)
- **Memory**: 128MB minimum
- **Timeout**: 30 seconds for news processing

## Usage Examples

### Using curl

**Get quick tech news:**
```bash
curl "https://your-worker.your-subdomain.workers.dev/api/news?category=technology&maxArticles=3"
```

**Detailed analysis:**
```bash
curl -X POST "https://your-worker.your-subdomain.workers.dev/api/summarize" \
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

## Configuration

### News Sources

The agent fetches news from multiple sources:
- Hacker News API
- Public RSS feeds
- Mock data for testing

You can customize sources by modifying `src/mastra/tools/news-fetcher.ts`.

### Summary Settings

- **Length**: `short` (1-2 sentences), `medium` (2-3 sentences), `long` (3-4 sentences)
- **Categories**: Technology, Politics, Business, Sports, Entertainment, Science, Health, World, Other
- **Sentiment**: Positive, Negative, Neutral
- **Importance**: High, Medium, Low

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📖 [Mastra Documentation](https://mastra.ai/docs)
- 🤖 [DeepSeek API Docs](https://platform.deepseek.com/docs)
- ⚡ [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)

## Powered By

- [Mastra AI](https://mastra.ai) - TypeScript agent framework
- [DeepSeek](https://deepseek.com) - Advanced AI reasoning
- [Cloudflare Workers](https://workers.cloudflare.com) - Edge computing

---

Built with ❤️ using Mastra AI framework and DeepSeek API
