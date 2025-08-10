# Cloudflare 部署指南

使用 Mastra CloudflareDeployer 一键部署新闻摘要 Agent 到 Cloudflare Workers。

## 📋 需要提供的信息

### 必需信息

1. **Cloudflare Account ID** (账户ID)
   - 获取方式：登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → 右侧边栏查看 Account ID

2. **Cloudflare API Token** (API令牌)
   - 获取方式：前往 [API 令牌页面](https://dash.cloudflare.com/profile/api-tokens)
   - 点击 "创建令牌" → 选择 "自定义令牌"
   - 设置权限：
     - `Account: Cloudflare Workers:Edit`
     - `Zone: Zone:Read` (如果使用自定义域名)

3. **Cloudflare Email** (注册邮箱)
   - 你的 Cloudflare 账户邮箱地址

### 可选信息

4. **KV Namespace ID** (KV 命名空间ID - 用于缓存)
   - 获取方式：前往 [Workers KV](https://dash.cloudflare.com/workers/kv/namespaces)
   - 创建新命名空间 `NEWS_CACHE` → 复制 Namespace ID

5. **自定义域名配置** (如果需要自定义域名)

## 🚀 部署步骤

### 步骤 1: 克隆和安装
```bash
git clone https://github.com/hinatayuan/news-summarizer-agent.git
cd news-summarizer-agent
npm install
```

### 步骤 2: 配置环境变量
```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的信息：
```bash
# DeepSeek API (已提供)
DEEPSEEK_API_KEY=sk-1edd0944d3d24a76b3ded1aa0298e20f

# Cloudflare 配置 (你需要提供)
CLOUDFLARE_ACCOUNT_ID=你的账户ID
CLOUDFLARE_API_TOKEN=你的API令牌
CLOUDFLARE_EMAIL=你的邮箱@example.com

# 可选：KV缓存
CLOUDFLARE_KV_NAMESPACE_ID=你的KV命名空间ID
```

### 步骤 3: 构建和部署
```bash
# 构建项目
npm run build

# 一键部署到 Cloudflare Workers
npm run deploy
```

部署成功后，你会看到类似输出：
```
✅ Successfully deployed to Cloudflare Workers!
🌍 Your API is available at: https://news-summarizer-agent.your-subdomain.workers.dev
```

## 🔧 Cloudflare 配置详解

### API Token 权限设置

创建 API Token 时，请确保包含以下权限：

**账户权限：**
- `Cloudflare Workers:Edit` - 部署和管理 Workers

**区域权限（如果使用自定义域名）：**
- `Zone:Read` - 读取域名配置
- `Zone:Edit` - 编辑域名路由（可选）

**资源范围：**
- 包括所有账户资源
- 包括所有区域资源（或指定特定域名）

### KV 命名空间设置

如果要启用缓存功能：

1. 前往 [Cloudflare Workers KV](https://dash.cloudflare.com/workers/kv/namespaces)
2. 点击 "Create namespace"
3. 命名空间名称：`NEWS_CACHE`
4. 创建后复制 Namespace ID
5. 将 ID 添加到 `.env` 文件中的 `CLOUDFLARE_KV_NAMESPACE_ID`

### 自定义域名配置

如果要使用自定义域名（如 `news-api.yourdomain.com`），需要：

1. 在 Cloudflare 中管理你的域名
2. 更新 `src/mastra/index.ts` 中的路由配置：
```typescript
routes: [
  {
    pattern: 'news-api.yourdomain.com/*',
    zone_name: 'yourdomain.com',
    custom_domain: true,
  },
],
```

## 🎯 测试部署

部署完成后，可以测试以下端点：

### 健康检查
```bash
curl https://your-worker.workers.dev/health
```

### 获取新闻摘要
```bash
curl "https://your-worker.workers.dev/api/news?category=technology&maxArticles=5"
```

### 详细分析
```bash
curl -X POST "https://your-worker.workers.dev/api/summarize" \
  -H "Content-Type: application/json" \
  -d '{"category": "AI", "maxArticles": 10, "summaryLength": "medium"}'
```

## 🔍 故障排除

### 常见问题

1. **部署失败：权限错误**
   - 检查 API Token 权限设置
   - 确认 Account ID 正确

2. **部署失败：令牌无效**
   - 重新生成 API Token
   - 检查令牌是否过期

3. **API 调用失败**
   - 验证 DeepSeek API Key 是否有效
   - 检查环境变量是否正确设置

4. **KV 存储错误**
   - 确认 KV Namespace ID 正确
   - 检查命名空间是否存在

### 调试技巧

1. **查看构建日志**
   ```bash
   npm run build
   ```

2. **本地测试**
   ```bash
   npm run dev
   # 访问 http://localhost:4111
   ```

3. **检查 Cloudflare Workers 日志**
   - 前往 Cloudflare Dashboard
   - Workers & Pages → 你的 Worker → Logs

## 💰 成本估算

**Cloudflare Workers 免费套餐：**
- 每天 100,000 次请求
- 1000 个 Workers 脚本
- 10ms CPU 时间/请求

**付费套餐 ($5/月)：**
- 每月 10,000,000 次请求
- 无限 Workers 脚本
- 50ms CPU 时间/请求

**DeepSeek API：**
- 成本极低的 AI 模型
- 按使用量付费

## 📞 获取支持

如果在部署过程中遇到问题：

1. 检查 [Mastra 文档](https://mastra.ai/docs)
2. 查看 [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
3. 在项目 GitHub 页面提交 Issue

---

## 总结

配置 Mastra CloudflareDeployer 你需要提供：

✅ **Cloudflare Account ID**  
✅ **Cloudflare API Token**  
✅ **Cloudflare Email**  
🔧 **KV Namespace ID (可选)**  
🌐 **自定义域名 (可选)**  

提供这些信息后，只需要 `npm run deploy` 就可以一键部署！
