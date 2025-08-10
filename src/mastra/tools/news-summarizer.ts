import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Configure DeepSeek for summarization
const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || 'sk-1edd0944d3d24a76b3ded1aa0298e20f',
  baseURL: 'https://api.deepseek.com',
});

export const summarizeNews = createTool({
  id: 'summarizeNews',
  description: 'Analyzes and summarizes news articles using AI',
  
  inputSchema: z.object({
    articles: z.array(z.object({
      title: z.string(),
      url: z.string(),
      source: z.string(),
      publishedAt: z.string(),
      description: z.string(),
      category: z.string().optional()
    })).describe('Array of news articles to summarize'),
    
    summaryLength: z.enum(['short', 'medium', 'long']).optional().default('medium').describe('Length of summary'),
    
    focusAreas: z.array(z.string()).optional().default([]).describe('Specific topics to focus on in summaries')
  }),

  async execute({ articles, summaryLength, focusAreas }) {
    const summaries = [];
    
    const lengthInstructions = {
      short: '1-2 sentences maximum',
      medium: '2-3 sentences',
      long: '3-4 sentences with additional context'
    };

    try {
      for (const article of articles) {
        try {
          const focusInstruction = focusAreas.length > 0 
            ? `Pay special attention to these topics: ${focusAreas.join(', ')}.` 
            : '';

          const prompt = `
Please analyze and summarize the following news article:

Title: ${article.title}
Source: ${article.source}
Description: ${article.description}
Published: ${article.publishedAt}

Instructions:
1. Create a concise summary (${lengthInstructions[summaryLength]})
2. Determine the news category (Technology, Politics, Business, Sports, Entertainment, Science, Health, World, Other)
3. Assess the sentiment (Positive, Negative, Neutral)
4. Extract 3-5 key keywords
5. Rate the importance/urgency (High, Medium, Low)
6. ${focusInstruction}

Respond with a JSON object containing:
{
  "summary": "your summary here",
  "category": "category name",
  "sentiment": "sentiment assessment",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "importance": "importance level",
  "confidence": "confidence level in analysis (High/Medium/Low)"
}
`;

          const result = await generateText({
            model: deepseek('deepseek-chat'),
            prompt,
            temperature: 0.3,
            maxTokens: 500,
          });

          // Try to parse the JSON response
          let analysisResult;
          try {
            // Extract JSON from the response (in case there's additional text)
            const jsonMatch = result.text.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : result.text;
            analysisResult = JSON.parse(jsonString);
          } catch (parseError) {
            // Fallback if JSON parsing fails
            console.warn('Failed to parse AI response as JSON, using fallback:', parseError);
            analysisResult = {
              summary: result.text.slice(0, 200) + '...',
              category: article.category || 'Other',
              sentiment: 'Neutral',
              keywords: [article.title.split(' ')[0], article.source],
              importance: 'Medium',
              confidence: 'Low'
            };
          }

          const processedSummary = {
            title: article.title,
            summary: analysisResult.summary || 'Summary not available',
            category: analysisResult.category || article.category || 'Other',
            sentiment: analysisResult.sentiment || 'Neutral',
            source: article.source,
            url: article.url,
            publishedAt: article.publishedAt,
            keywords: analysisResult.keywords || [],
            importance: analysisResult.importance || 'Medium',
            confidence: analysisResult.confidence || 'Medium'
          };

          summaries.push(processedSummary);

        } catch (error) {
          console.error(`Error summarizing article "${article.title}":`, error);
          
          // Add fallback summary for failed articles
          summaries.push({
            title: article.title,
            summary: `Failed to generate AI summary. Original description: ${article.description.slice(0, 200)}...`,
            category: article.category || 'Other',
            sentiment: 'Neutral',
            source: article.source,
            url: article.url,
            publishedAt: article.publishedAt,
            keywords: [article.title.split(' ')[0], article.source],
            importance: 'Medium',
            confidence: 'Low'
          });
        }
      }

      // Generate overall insights
      const categories = [...new Set(summaries.map(s => s.category))];
      const sentimentCounts = summaries.reduce((acc, s) => {
        acc[s.sentiment] = (acc[s.sentiment] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const highImportanceCount = summaries.filter(s => s.importance === 'High').length;
      
      return {
        summaries,
        totalArticles: summaries.length,
        timestamp: new Date().toISOString(),
        sources: [...new Set(summaries.map(s => s.source))],
        insights: {
          categoriesFound: categories,
          sentimentBreakdown: sentimentCounts,
          highImportanceNews: highImportanceCount,
          averageConfidence: summaries.reduce((acc, s) => {
            const confidence = s.confidence === 'High' ? 3 : s.confidence === 'Medium' ? 2 : 1;
            return acc + confidence;
          }, 0) / summaries.length
        }
      };

    } catch (error) {
      console.error('Error in summarizeNews tool:', error);
      
      // Return fallback response
      return {
        summaries: articles.map(article => ({
          title: article.title,
          summary: `Summary generation failed. Original: ${article.description.slice(0, 100)}...`,
          category: article.category || 'Other',
          sentiment: 'Neutral',
          source: article.source,
          url: article.url,
          publishedAt: article.publishedAt,
          keywords: [article.title.split(' ')[0]],
          importance: 'Medium',
          confidence: 'Low'
        })),
        totalArticles: articles.length,
        timestamp: new Date().toISOString(),
        sources: [...new Set(articles.map(a => a.source))],
        error: 'AI summarization service temporarily unavailable',
        insights: {
          categoriesFound: ['Other'],
          sentimentBreakdown: { 'Neutral': articles.length },
          highImportanceNews: 0,
          averageConfidence: 1
        }
      };
    }
  }
});
