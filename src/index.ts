import { mastra } from './mastra';

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // Enable CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    try {
      // Health check endpoint
      if (url.pathname === '/health') {
        return new Response(JSON.stringify({ 
          status: 'healthy', 
          timestamp: new Date().toISOString(),
          service: 'News Summarizer Agent'
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // News summary endpoint
      if (url.pathname === '/api/summarize' && request.method === 'POST') {
        const body = await request.json() as { 
          category?: string; 
          maxArticles?: number; 
          summaryLength?: 'short' | 'medium' | 'long';
          focusAreas?: string[];
        };

        const agent = await mastra.getAgent('newsSummarizer');
        
        const prompt = `Please fetch the latest news${body.category ? ` about ${body.category}` : ''} and provide comprehensive summaries. 
        
        Parameters:
        - Maximum articles: ${body.maxArticles || 10}
        - Summary length: ${body.summaryLength || 'medium'}
        - Focus areas: ${body.focusAreas?.join(', ') || 'general news'}
        
        Use the fetchNewsFromRss tool to get the latest articles, then use the summarizeNews tool to create intelligent summaries with categorization, sentiment analysis, and keyword extraction.`;

        const result = await agent.generate(prompt);

        return new Response(JSON.stringify({
          success: true,
          data: result.object || result.text,
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // Quick news endpoint (GET)
      if (url.pathname === '/api/news' && request.method === 'GET') {
        const category = url.searchParams.get('category');
        const maxArticles = parseInt(url.searchParams.get('maxArticles') || '5');
        
        const agent = await mastra.getAgent('newsSummarizer');
        
        const prompt = `Fetch ${maxArticles} latest news articles${category ? ` about ${category}` : ''} and provide brief summaries.`;

        const result = await agent.generate(prompt);

        return new Response(JSON.stringify({
          success: true,
          data: result.object || result.text,
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // API documentation endpoint
      if (url.pathname === '/api/docs' || url.pathname === '/') {
        const docs = {
          title: 'News Summarizer Agent API',
          description: 'Real-time news summarization powered by Mastra and DeepSeek AI',
          version: '1.0.0',
          endpoints: {
            'GET /health': {
              description: 'Health check endpoint',
              response: 'Service status and timestamp'
            },
            'GET /api/news': {
              description: 'Quick news summaries',
              parameters: {
                category: 'News category filter (optional)',
                maxArticles: 'Maximum number of articles (default: 5)'
              }
            },
            'POST /api/summarize': {
              description: 'Comprehensive news analysis and summarization',
              body: {
                category: 'News category to focus on (optional)',
                maxArticles: 'Maximum articles to process (default: 10)',
                summaryLength: 'Length of summaries: short, medium, long (default: medium)',
                focusAreas: 'Array of topics to focus on (optional)'
              }
            },
            'GET /api/docs': {
              description: 'This API documentation'
            }
          },
          examples: {
            'Quick Tech News': 'GET /api/news?category=technology&maxArticles=3',
            'Detailed Analysis': 'POST /api/summarize with {"category": "business", "summaryLength": "long", "focusAreas": ["AI", "startups"]}'
          },
          powered_by: {
            framework: 'Mastra AI',
            model: 'DeepSeek V3',
            deployment: 'Cloudflare Workers'
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

      // 404 for unknown endpoints
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
      console.error('Error processing request:', error);
      
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
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
