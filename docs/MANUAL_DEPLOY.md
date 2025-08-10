# 手动部署指南 / Manual Deployment Guide

如果自动部署脚本遇到问题，请按照以下步骤手动部署：

## 🔧 解决常见问题

### 问题 1: npm 安装失败

```bash
# 清理 npm 缓存
npm cache clean --force

# 删除旧的依赖
rm -rf node_modules package-lock.json

# 重新安装依赖
npm install
```

### 问题 2: mastra 命令未找到

```bash
# 全局安装 Mastra CLI
npm install -g @mastra/cli@latest

# 或者使用 npx 运行（推荐）
npx @mastra/cli@latest --version
```

## 📋 手动部署步骤

### 1. 准备环境

```bash
# 确保 Node.js 版本 20.0+
node -v

# 克隆项目
git clone https://github.com/hinatayuan/news-summarizer-agent.git
cd news-summarizer-agent
```

### 2. 清理和安装依赖

```bash
# 清理
rm -rf node_modules package-lock.json .mastra

# 重新安装
npm cache clean --force
npm install
```

### 3. 安装 Mastra CLI

选择以下任一方式：

#### 方式 A: 全局安装（推荐）
```bash
npm install -g @mastra/cli@latest
```

#### 方式 B: 使用 npx（如果全局安装失败）
```bash
# 不需要安装，直接使用 npx
npx @mastra/cli@latest --version
```

### 4. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件（已经预配置了 Cloudflare 信息）
cat .env
```

### 5. 构建项目

#### 使用 Mastra（推荐）
```bash
# 如果全局安装了 mastra
mastra build

# 或者使用 npx
npx @mastra/cli@latest build
```

#### 备选方案：使用 TypeScript 编译器
```bash
# 如果 mastra build 失败，使用 tsc
npx tsc --outDir dist --module commonjs --target es2020
```

### 6. 部署到 Cloudflare Workers

```bash
# 使用 Mastra 部署
mastra deploy

# 或者使用 npx
npx @mastra/cli@latest deploy
```

## 🧪 验证部署

部署成功后，测试以下端点：

```bash
# 替换 YOUR-SUBDOMAIN 为实际的子域名
BASE_URL="https://yd-mastra-agent.YOUR-SUBDOMAIN.workers.dev"

# 健康检查
curl $BASE_URL/health

# 快速新闻
curl "$BASE_URL/api/news?category=technology&maxArticles=3"

# API 文档
curl $BASE_URL/api/docs
```

## 🔍 故障排除

### 如果 npm install 仍然失败

```bash
# 尝试不同的包管理器
npm install -g yarn
yarn install

# 或者使用 pnpm
npm install -g pnpm
pnpm install
```

### 如果 mastra 命令仍然不工作

```bash
# 检查全局包
npm list -g @mastra/cli

# 重新安装
npm uninstall -g @mastra/cli
npm install -g @mastra/cli@latest

# 检查 PATH
echo $PATH
which mastra
```

### 如果部署失败

1. **检查 Cloudflare 凭据**：
   ```bash
   cat .env | grep CLOUDFLARE
   ```

2. **验证网络连接**：
   ```bash
   ping cloudflare.com
   ```

3. **查看详细错误**：
   ```bash
   mastra deploy --verbose
   ```

### 如果所有方法都失败

使用备选部署方法：

1. **手动创建 Cloudflare Worker**：
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 前往 Workers & Pages
   - 创建新的 Worker
   - 复制 `src/index.ts` 的内容
   - 设置环境变量

2. **使用 Wrangler CLI**：
   ```bash
   npm install -g wrangler
   wrangler login
   wrangler deploy
   ```

## 📞 获取帮助

如果仍然遇到问题：

1. 检查 [Mastra 文档](https://mastra.ai/docs)
2. 查看 [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
3. 在项目 GitHub 页面提交 Issue

## ✅ 成功部署后

你的 API 将在以下地址可用：
```
https://yd-mastra-agent.YOUR-SUBDOMAIN.workers.dev
```

使用示例代码测试：
- JavaScript: `examples/client-examples.js`
- Python: `examples/client-examples.py`
