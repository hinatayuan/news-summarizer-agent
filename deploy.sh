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

# 检查 Node.js 版本
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="20.0.0"
if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "⚠️  警告: 建议使用 Node.js 20.0+ 版本"
    echo "⚠️  Warning: Node.js 20.0+ is recommended"
fi

# 检查是否存在 .env 文件
if [ ! -f ".env" ]; then
    echo "📝 创建 .env 文件..."
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件，请根据需要编辑配置"
    echo "✅ .env file created, please edit the configuration as needed"
fi

# 清理和安装依赖
echo "🧹 清理旧的依赖..."
echo "🧹 Cleaning old dependencies..."
rm -rf node_modules package-lock.json .mastra

echo "📦 安装依赖..."
echo "📦 Installing dependencies..."
npm cache clean --force
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败，尝试使用 yarn..."
    echo "❌ npm install failed, trying with yarn..."
    
    if command -v yarn &> /dev/null; then
        yarn install
        if [ $? -ne 0 ]; then
            echo "❌ yarn 安装也失败了"
            echo "❌ yarn install also failed"
            exit 1
        fi
    else
        echo "❌ 请安装 yarn 或修复 npm 问题"
        echo "❌ Please install yarn or fix npm issues"
        exit 1
    fi
fi

# 检查 mastra 是否可用（不需要单独安装 CLI）
echo "🔍 检查 Mastra 命令..."
echo "🔍 Checking Mastra command..."

# 构建项目
echo "🔨 构建项目..."
echo "🔨 Building project..."

# 尝试多种方式运行 mastra build
if npx mastra --version &> /dev/null; then
    echo "✅ 使用 npx mastra 命令..."
    npx mastra build
elif command -v mastra &> /dev/null; then
    echo "✅ 使用全局 mastra 命令..."
    mastra build
else
    echo "📥 安装 mastra 包..."
    npm install -g mastra@latest
    
    if command -v mastra &> /dev/null; then
        echo "✅ mastra 安装成功，开始构建..."
        mastra build
    else
        echo "⚠️  mastra 全局安装失败，使用 npx..."
        npx mastra build
    fi
fi

BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -ne 0 ]; then
    echo "❌ 构建失败"
    echo "❌ Build failed"
    echo ""
    echo "🔍 故障排除步骤："
    echo "🔍 Troubleshooting steps:"
    echo "1. 检查 Node.js 版本: node -v (需要 20.0+)"
    echo "2. 清理缓存: npm cache clean --force"
    echo "3. 重新安装: rm -rf node_modules && npm install"
    echo "4. 手动安装 Mastra: npm install -g mastra@latest"
    echo "5. 使用 npx: npx mastra build"
    exit 1
fi

# 部署到 Cloudflare Workers
echo "🌍 部署到 Cloudflare Workers..."
echo "🌍 Deploying to Cloudflare Workers..."

# 尝试多种方式运行 mastra deploy
if command -v mastra &> /dev/null; then
    echo "✅ 使用全局 mastra 命令部署..."
    mastra deploy
elif npx mastra --version &> /dev/null; then
    echo "✅ 使用 npx mastra 命令部署..."
    npx mastra deploy
else
    echo "❌ 无法找到 mastra 部署命令"
    echo "❌ Cannot find mastra deploy command"
    echo ""
    echo "📝 手动部署步骤："
    echo "📝 Manual deployment steps:"
    echo "1. npm install -g mastra@latest"
    echo "2. mastra deploy"
    echo "3. 或者 npx mastra deploy"
    echo "4. 或者查看 docs/MANUAL_DEPLOY.md 了解详细步骤"
    exit 1
fi

DEPLOY_EXIT_CODE=$?

if [ $DEPLOY_EXIT_CODE -eq 0 ]; then
    echo ""
    echo "🎉 部署成功！"
    echo "🎉 Deployment successful!"
    echo ""
    echo "📋 你的 API 端点："
    echo "📋 Your API endpoints:"
    echo "   健康检查 / Health: https://yd-mastra-agent.YOUR-SUBDOMAIN.workers.dev/health"
    echo "   快速新闻 / Quick News: https://yd-mastra-agent.YOUR-SUBDOMAIN.workers.dev/api/news"
    echo "   详细分析 / Analysis: https://yd-mastra-agent.YOUR-SUBDOMAIN.workers.dev/api/summarize"
    echo "   API 文档 / Docs: https://yd-mastra-agent.YOUR-SUBDOMAIN.workers.dev/api/docs"
    echo ""
    echo "🧪 测试部署："
    echo "🧪 Test deployment:"
    echo "   curl https://yd-mastra-agent.YOUR-SUBDOMAIN.workers.dev/health"
    echo ""
    echo "📖 更多使用示例请查看 examples/ 目录"
    echo "📖 Check examples/ directory for more usage examples"
else
    echo "❌ 部署失败"
    echo "❌ Deployment failed"
    echo ""
    echo "🔍 可能的解决方案："
    echo "🔍 Possible solutions:"
    echo "1. 检查网络连接"
    echo "2. 验证 Cloudflare 凭据"
    echo "3. 查看 .env 文件配置"
    echo "4. 参考 docs/MANUAL_DEPLOY.md"
    exit 1
fi
