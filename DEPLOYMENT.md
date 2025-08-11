# 🚀 部署指南

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

**⚠️ 重要：不要在代码中暴露真实的 API 密钥！**

```bash
# 复制环境变量模板
cp .env.example .env

# 设置 DeepSeek API 密钥（安全方式）
wrangler secret put DEEPSEEK_API_KEY
# 在提示时输入你的真实 DeepSeek API 密钥
```

### 3. 部署到 Cloudflare Workers

```bash
# 安装项目依赖
npm install

# 开发模式（本地测试）
npm run dev

# 部署到生产环境
npm run deploy

# 部署到特定环境
npm run deploy:production  # 生产环境
npm run deploy:staging     # 测试环境
```

### 4. 验证部署

```bash
# 检查部署状态
curl https://news-agent.your-subdomain.workers.dev/health

# 查看已设置的环境变量
npm run secrets:list
```

### 5. 管理环境变量

```bash
# 设置新的环境变量
wrangler secret put DEEPSEEK_API_KEY

# 列出所有环境变量
wrangler secret list

# 删除环境变量
wrangler secret delete DEEPSEEK_API_KEY
```

## 安全最佳实践

### 1. API 密钥管理
- ✅ 使用 `wrangler secret` 管理敏感信息
- ✅ 不要在代码中硬编码 API 密钥
- ✅ 定期轮换 API 密钥
- ✅ 使用不同环境的不同密钥

### 2. 访问控制
```toml
# wrangler.toml 中的安全配置
[env.production]
name = "news-agent-prod"

# 可以添加 IP 白名单或其他安全配置
```

### 3. 监控和日志
```bash
# 查看实时日志
wrangler tail

# 查看特定环境的日志
wrangler tail --env production
```

## 故障排除

### 常见问题

1. **部署失败：API 密钥未设置**
   ```bash
   # 解决方案：设置环境变量
   wrangler secret put DEEPSEEK_API_KEY
   ```

2. **部署失败：权限不足**
   ```bash
   # 解决方案：重新登录
   wrangler logout
   wrangler login
   ```

3. **运行时错误：模块未找到**
   ```bash
   # 解决方案：重新安装依赖
   rm -rf node_modules
   npm install
   npm run deploy
   ```

### 调试模式

```bash
# 本地开发时启用详细日志
export DEBUG=true
npm run dev

# 查看 Worker 日志
wrangler tail --format pretty
```

## 更新部署

### 代码更新
```bash
# 拉取最新代码
git pull origin main

# 重新部署
npm run deploy
```

### 依赖更新
```bash
# 更新 Mastra 依赖
npm update @mastra/core

# 重新部署
npm run deploy
```

## 回滚部署

```bash
# 查看部署历史
wrangler deployments list

# 回滚到特定版本
wrangler rollback [deployment-id]
```

## 性能优化

### 1. 缓存配置
```typescript
// 在 Worker 中启用缓存
const cache = caches.default;
```

### 2. 请求限制
```toml
# wrangler.toml 中配置
[limits]
cpu_ms = 50
```

### 3. 监控指标
- 响应时间
- 错误率
- CPU 使用率
- 内存使用量

## 下一步

- 📊 配置监控和告警
- 🔄 设置 CI/CD 自动部署
- 🛡️ 实施 API 速率限制
- 📈 优化性能和缓存策略
