#!/bin/bash

# 新闻摘要 Agent 一键部署脚本
# Quick deploy script for News Summarizer Agent

echo "🚀 开始部署新闻摘要 Agent 到 Cloudflare Workers..."
echo "🚀 Deploying News Summarizer Agent to Cloudflare Workers..."

# 检查是否安装了必要的依赖
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 请先安装 Node.js 和 npm"
    echo "❌ Error: Please install Node.js and npm first"
    exit 1
fi

# 检查是否存在 .env 文件
if [ ! -f ".env" ]; then
    echo "📝 创建 .env 文件..."
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件，请根据需要编辑配置"
    echo "✅ .env file created, please edit the configuration as needed"
fi

# 安装依赖
echo "📦 安装依赖..."
echo "📦 Installing dependencies..."
npm install

# 构建项目
echo "🔨 构建项目..."
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    echo "❌ Build failed"
    exit 1
fi

# 部署到 Cloudflare Workers
echo "🌍 部署到 Cloudflare Workers..."
echo "🌍 Deploying to Cloudflare Workers..."
npm run deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 部署成功！"
    echo "🎉 Deployment successful!"
    echo ""
    echo "📋 你的 API 端点："
    echo "📋 Your API endpoints:"
    echo "   健康检查 / Health: https://yd-mastra-agent.your-subdomain.workers.dev/health"
    echo "   快速新闻 / Quick News: https://yd-mastra-agent.your-subdomain.workers.dev/api/news"
    echo "   详细分析 / Analysis: https://yd-mastra-agent.your-subdomain.workers.dev/api/summarize"
    echo "   API 文档 / Docs: https://yd-mastra-agent.your-subdomain.workers.dev/api/docs"
    echo ""
    echo "🧪 测试部署："
    echo "🧪 Test deployment:"
    echo "   curl https://yd-mastra-agent.your-subdomain.workers.dev/health"
    echo ""
else
    echo "❌ 部署失败，请检查配置和网络连接"
    echo "❌ Deployment failed, please check configuration and network connection"
    exit 1
fi
