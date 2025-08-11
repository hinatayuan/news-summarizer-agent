# 🚀 部署指南

## 架构说明

本项目采用 **CloudflareDeployer + Wrangler** 的组合架构：

- **CloudflareDeployer** - 在 Mastra 中配置 Cloudflare Workers 环境
- **Wrangler** - 执行实际的部署和管理操作

## 后端部署 (Cloudflare Workers)

### 1. 准备工作

确保你已经安装了必要的工具：

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login
```

### 2. 环境配置

**方式一：使用 Wrangler Secrets（推荐用于敏感信息）**

```bash
# 设置敏感的 API 密钥
wrangler secret put DEEPSEEK_API_KEY
# 在提示时输入你的真实 DeepSeek API 密钥

# 设置 Cloudflare 配置（敏感信息）
wrangler secret put CLOUDFLARE_API_TOKEN
wrangler secret put CLOUDFLARE_ACCOUNT_ID
```

**方式二：使用环境变量文件（用于非敏感配置）**

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，设置非敏感的配置项
# 如：CLOUDFLARE_PROJECT_NAME, NODE_ENV 等
```

### 3. 部署流程

```bash
# 1. 安装项目依赖
npm install

# 2. Mastra 构建（CloudflareDeployer 生成配置）
npm run build

# 3. 本地开发测试（可选）
npm run dev

# 4. Wrangler 执行部署
npm run deploy

# 5. 部署到特定环境
npm run deploy:production  # 生产环境
npm run deploy:staging     # 测试环境
```

### 4. 验证部署

```bash
# 检查部署状态
curl https://news-agent.your-subdomain.workers.dev/health

# 查看已设置的环境变量
npm run secrets:list

# 查看实时日志
wrangler tail
```

## 双重配置系统

### CloudflareDeployer 配置（在 Mastra 中）

```typescript
// src/mastra/index.ts
deployer: new CloudflareDeployer({
  scope: process.env.CLOUDFLARE_ACCOUNT_ID,
  projectName: process.env.CLOUDFLARE_PROJECT_NAME || 'news-agent',
  auth: {
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    apiEmail: process.env.CLOUDFLARE_EMAIL,
  },
  env: {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    NODE_ENV: 'production',
  }
})
```

### Wrangler 配置（wrangler.toml）

```toml
name = "news-agent"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.production]
name = "news-agent-prod"

[env.staging]
name = "news-agent-staging"
```

## 环境变量管理策略

### 敏感信息（使用 Wrangler Secrets）
- `DEEPSEEK_API_KEY` - DeepSeek API 密钥
- `CLOUDFLARE_API_TOKEN` - Cloudflare API 令牌
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare 账户 ID

### 普通配置（使用 .env 文件）
- `CLOUDFLARE_PROJECT_NAME` - 项目名称
- `CLOUDFLARE_EMAIL` - Cloudflare 邮箱
- `NODE_ENV` - 环境模式

## 部署脚本说明

```json
{
  "scripts": {
    "dev": "wrangler dev",                    // 本地开发服务器
    "build": "mastra build",                  // Mastra 构建和配置生成
    "deploy": "wrangler deploy",              // Wrangler 执行部署
    "deploy:production": "wrangler deploy --env production",
    "deploy:staging": "wrangler deploy --env staging",
    "secrets:set": "wrangler secret put DEEPSEEK_API_KEY",
    "secrets:list": "wrangler secret list"
  }
}
```

## 故障排除

### 常见问题

1. **部署失败：API 密钥未设置**
   ```bash
   # 解决方案：设置环境变量
   wrangler secret put DEEPSEEK_API_KEY
   wrangler secret put CLOUDFLARE_API_TOKEN
   ```

2. **部署失败：权限不足**
   ```bash
   # 解决方案：重新登录
   wrangler logout
   wrangler login
   ```

3. **CloudflareDeployer 配置错误**
   ```bash
   # 解决方案：检查环境变量
   echo $CLOUDFLARE_ACCOUNT_ID
   echo $CLOUDFLARE_PROJECT_NAME
   ```

4. **构建失败**
   ```bash
   # 解决方案：重新安装依赖
   rm -rf node_modules
   npm install
   npm run build
   ```

### 调试模式

```bash
# 本地开发时启用详细日志
export DEBUG=true
npm run dev

# 查看 Worker 日志
wrangler tail --format pretty

# 检查构建输出
npm run build -- --verbose
```

## 工作流程总结

```
1. 开发 → 本地编写 Mastra 应用
2. 配置 → CloudflareDeployer 定义部署配置
3. 构建 → mastra build 生成部署资源
4. 部署 → wrangler deploy 执行实际部署
5. 管理 → wrangler 管理密钥、日志、版本
```

## 安全最佳实践

### 1. 密钥管理
- ✅ 敏感信息使用 `wrangler secret`
- ✅ 普通配置使用环境变量文件
- ✅ 不要在代码中硬编码密钥
- ✅ 定期轮换 API 密钥

### 2. 部署安全
- ✅ 使用不同环境的不同密钥
- ✅ 生产环境使用 `--env production`
- ✅ 限制 API 令牌权限
- ✅ 监控部署日志

### 3. 访问控制
```toml
# wrangler.toml 中的安全配置
[env.production]
name = "news-agent-prod"
# 可以添加 IP 白名单或其他安全配置
```

## 下一步

- 📊 配置监控和告警
- 🔄 设置 CI/CD 自动部署
- 🛡️ 实施 API 速率限制
- 📈 优化性能和缓存策略
