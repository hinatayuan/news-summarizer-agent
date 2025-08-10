"""
News Summarizer Agent Python 客户端示例
Python Client Examples for News Summarizer Agent API
"""

import requests
import json
from typing import Dict, List, Optional

# API 基础地址 - 替换为你的实际部署地址
# API Base URL - Replace with your actual deployment URL
API_BASE = 'https://yd-mastra-agent.your-subdomain.workers.dev'

class NewsSummarizerClient:
    """新闻摘要 API 客户端类"""
    
    def __init__(self, base_url: str = API_BASE):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'NewsSummarizerClient/1.0'
        })

    def check_health(self) -> Dict:
        """健康检查"""
        try:
            response = self.session.get(f'{self.base_url}/health')
            response.raise_for_status()
            data = response.json()
            print('✅ Health Check:', json.dumps(data, indent=2, ensure_ascii=False))
            return data
        except requests.RequestException as e:
            print(f'❌ Health Check Failed: {e}')
            raise

    def get_quick_news(self, category: str = 'technology', max_articles: int = 5) -> Dict:
        """获取快速新闻摘要"""
        try:
            params = {
                'category': category,
                'maxArticles': max_articles
            }
            response = self.session.get(f'{self.base_url}/api/news', params=params)
            response.raise_for_status()
            data = response.json()
            print('📰 Quick News:', json.dumps(data, indent=2, ensure_ascii=False))
            return data
        except requests.RequestException as e:
            print(f'❌ Quick News Failed: {e}')
            raise

    def get_detailed_analysis(
        self, 
        category: str = 'technology',
        max_articles: int = 10,
        summary_length: str = 'medium',
        focus_areas: Optional[List[str]] = None
    ) -> Dict:
        """获取详细新闻分析"""
        if focus_areas is None:
            focus_areas = ['AI', 'startups']
            
        payload = {
            'category': category,
            'maxArticles': max_articles,
            'summaryLength': summary_length,
            'focusAreas': focus_areas
        }
        
        try:
            response = self.session.post(
                f'{self.base_url}/api/summarize',
                json=payload
            )
            response.raise_for_status()
            data = response.json()
            print('🔍 Detailed Analysis:', json.dumps(data, indent=2, ensure_ascii=False))
            return data
        except requests.RequestException as e:
            print(f'❌ Detailed Analysis Failed: {e}')
            raise

    def get_api_docs(self) -> Dict:
        """获取 API 文档"""
        try:
            response = self.session.get(f'{self.base_url}/api/docs')
            response.raise_for_status()
            data = response.json()
            print('📋 API Documentation:', json.dumps(data, indent=2, ensure_ascii=False))
            return data
        except requests.RequestException as e:
            print(f'❌ API Docs Failed: {e}')
            raise

def run_examples():
    """运行示例"""
    client = NewsSummarizerClient()
    
    print('🚀 开始测试新闻摘要 API...')
    print('🚀 Starting News Summarizer API tests...\n')
    
    try:
        # 1. 健康检查
        print('1️⃣ 健康检查 / Health Check:')
        client.check_health()
        print()
        
        # 2. 获取快速科技新闻
        print('2️⃣ 快速科技新闻 / Quick Tech News:')
        client.get_quick_news(category='technology', max_articles=3)
        print()
        
        # 3. 获取详细 AI 新闻分析
        print('3️⃣ 详细 AI 新闻分析 / Detailed AI News Analysis:')
        client.get_detailed_analysis(
            category='AI',
            max_articles=5,
            summary_length='long',
            focus_areas=['machine learning', 'chatgpt', 'deepseek']
        )
        print()
        
        # 4. 获取商业新闻
        print('4️⃣ 商业新闻 / Business News:')
        client.get_quick_news(category='business', max_articles=3)
        print()
        
        # 5. 获取 API 文档
        print('5️⃣ API 文档 / API Documentation:')
        client.get_api_docs()
        
    except Exception as e:
        print(f'💥 测试失败 / Test Failed: {e}')

# 高级使用示例
def advanced_examples():
    """高级使用示例"""
    client = NewsSummarizerClient()
    
    print('🔬 高级使用示例 / Advanced Examples:\n')
    
    # 批量获取不同类别的新闻
    categories = ['technology', 'business', 'science', 'health']
    
    for category in categories:
        print(f'📂 获取 {category} 新闻...')
        try:
            news = client.get_quick_news(category=category, max_articles=2)
            if news.get('success'):
                summaries = news.get('data', {}).get('summaries', [])
                print(f'   ✅ 成功获取 {len(summaries)} 篇 {category} 新闻')
            else:
                print(f'   ❌ 获取 {category} 新闻失败')
        except Exception as e:
            print(f'   ❌ 错误: {e}')
        print()

# 异步版本示例（需要 aiohttp）
async_example = '''
# 异步版本示例 (需要安装 aiohttp)
# pip install aiohttp

import aiohttp
import asyncio

class AsyncNewsSummarizerClient:
    def __init__(self, base_url: str = API_BASE):
        self.base_url = base_url
    
    async def get_quick_news_async(self, session, category: str = 'technology'):
        async with session.get(f'{self.base_url}/api/news?category={category}&maxArticles=3') as response:
            return await response.json()
    
    async def get_multiple_categories_async(self):
        categories = ['technology', 'business', 'science']
        async with aiohttp.ClientSession() as session:
            tasks = [self.get_quick_news_async(session, cat) for cat in categories]
            results = await asyncio.gather(*tasks)
            return dict(zip(categories, results))

# 使用方法:
# client = AsyncNewsSummarizerClient()
# results = await client.get_multiple_categories_async()
'''

if __name__ == '__main__':
    # 运行基础示例
    run_examples()
    
    print('\n' + '='*50 + '\n')
    
    # 运行高级示例
    advanced_examples()
    
    print('\n' + '='*50 + '\n')
    print('📝 异步版本示例代码:')
    print(async_example)
