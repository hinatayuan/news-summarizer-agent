# 修复的部署指南 / Fixed Deployment Guide

## 🔧 正确的 Mastra 安装方法

问题：`@mastra/cli` 包不存在。正确的做法是：

### ✅ 正确的命令

```bash
# 不要使用这个（错误）：
# npm install -g @mastra/cli@latest

# 使用这些正确的命令：
npm install -g mastra@latest

# 或者使用 npx（推荐，不需要全局安装）：
npx mastra --version
```

## 🚀 立即解决方案

### 1. 清理和重新安装

```bash
cd news-summarizer-agent

# 清理
rm -rf node_modules package-lock.json .mastra
npm cache clean --force

# 重新安装项目依赖
npm install
```

### 2. 安装 Mastra

选择以下任一方式：

#### 方式 A：全局安装 mastra 包
```bash
npm install -g mastra@latest
```

#### 方式 B：使用 npx（推荐）
```bash
# 不需要安装，直接使用
npx mastra --version
```

### 3. 构建和部署

```bash
# 获取最新的脚本
git pull

# 运行更新后的部署脚本
./deploy.sh
```

### 4. 手动步骤（如果脚本仍然失败）

```bash
# 构建
npx mastra build

# 部署
npx mastra deploy
```

## 🧪 验证 Mastra 安装

```bash
# 检查 mastra 是否可用
npx mastra --version

# 或者如果全局安装了
mastra --version
```

## 📋 完整的手动部署流程

如果自动脚本仍然有问题，按照这个完整流程：

### 1. 环境准备
```bash
# 确保 Node.js 20.0+
node -v

# 克隆最新代码
git clone https://github.com/hinatayuan/news-summarizer-agent.git
cd news-summarizer-agent
```

### 2. 清理和安装
```bash
# 完全清理
rm -rf node_modules package-lock.json .mastra

# 清理 npm 缓存
npm cache clean --force

# 重新安装依赖
npm install
```

### 3. 验证 Mastra
```bash
# 测试 npx mastra
npx mastra --version

# 如果上面失败，全局安装
npm install -g mastra@latest
mastra --version
```

### 4. 配置环境变量
```bash
# 复制配置（已经预设了你的 Cloudflare 信息）
cp .env.example .env

# 查看配置
cat .env
```

### 5. 构建项目
```bash
# 使用 npx（推荐）
npx mastra build

# 或者使用全局命令
mastra build
```

### 6. 部署到 Cloudflare
```bash
# 部署
npx mastra deploy

# 或者
mastra deploy
```

## 🎯 预期的部署输出

成功部署后，你应该看到类似这样的输出：

```
✅ Successfully deployed to Cloudflare Workers!
🌍 Your worker is available at: https://yd-mastra-agent.your-subdomain.workers.dev

API Endpoints:
  - Health: https://yd-mastra-agent.your-subdomain.workers.dev/health
  - News: https://yd-mastra-agent.your-subdomain.workers.dev/api/news
  - Analyze: https://yd-mastra-agent.your-subdomain.workers.dev/api/summarize
  - Docs: https://yd-mastra-agent.your-subdomain.workers.dev/api/docs
```

## 🧪 测试部署

```bash
# 替换为你的实际 URL
API_URL="https://yd-mastra-agent.your-subdomain.workers.dev"

# 测试健康检查
curl $API_URL/health

# 测试新闻 API
curl "$API_URL/api/news?category=technology&maxArticles=3"

# 测试详细分析
curl -X POST "$API_URL/api/summarize" \
  -H "Content-Type: application/json" \
  -d '{"category": "AI", "maxArticles": 5}'
```

## 🔍 常见错误和解决方案

### 错误 1: `@mastra/cli` not found
```bash
# 解决：不要安装 @mastra/cli，使用 mastra
npm install -g mastra@latest
```

### 错误 2: `mastra command not found`
```bash
# 解决：使用 npx
npx mastra --version
npx mastra build
npx mastra deploy
```

### 错误 3: npm install 失败
```bash
# 解决：清理缓存
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 错误 4: 部署失败
```bash
# 检查环境变量
cat .env | grep CLOUDFLARE

# 验证网络
ping cloudflare.com

# 详细日志
npx mastra deploy --verbose
```

## ✅ 成功标志

部署成功后：

1. **API 可访问**：健康检查返回 200 状态
2. **新闻功能正常**：能够获取和分析新闻
3. **DeepSeek 集成**：AI 摘要功能工作正常

## 📱 客户端使用

部署成功后，可以使用：

- **JavaScript**: `examples/client-examples.js`
- **Python**: `examples/client-examples.py`
- **curl**: 直接命令行调用

记得在客户端代码中更新你的实际 API 地址！
