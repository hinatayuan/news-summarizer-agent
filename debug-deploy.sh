#!/bin/bash

echo "🔍 Mastra 部署调试脚本"
echo "=========================="

echo ""
echo "1️⃣ 检查环境..."
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

echo ""
echo "2️⃣ 检查 Mastra..."
if npx mastra --version &> /dev/null; then
    echo "✅ Mastra CLI 可用: $(npx mastra --version)"
else
    echo "❌ Mastra CLI 不可用"
    exit 1
fi

echo ""
echo "3️⃣ 检查项目依赖..."
if [ -f "package.json" ]; then
    echo "✅ package.json 存在"
    echo "Mastra core: $(npm list @mastra/core 2>/dev/null | grep @mastra/core || echo '未安装')"
    echo "Cloudflare deployer: $(npm list @mastra/deployer-cloudflare 2>/dev/null | grep @mastra/deployer-cloudflare || echo '未安装')"
else
    echo "❌ package.json 不存在"
    exit 1
fi

echo ""
echo "4️⃣ 检查配置文件..."
if [ -f "src/mastra/index.ts" ]; then
    echo "✅ Mastra 配置文件存在"
else
    echo "❌ Mastra 配置文件不存在"
    exit 1
fi

echo ""
echo "5️⃣ 检查 Cloudflare 连接..."
ACCOUNT_ID="4f626c727482ce1b73d26bb9f9244d79"
API_TOKEN="nludYXBjgyYP4lQvfMiqb061Hk6juU9rwmWjs56q"

echo "Account ID: $ACCOUNT_ID"
echo "Token (前8位): ${API_TOKEN:0:8}..."

# 测试 API Token
echo ""
echo "测试 Token 验证..."
VERIFY_RESULT=$(curl -s -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json")

if echo "$VERIFY_RESULT" | grep -q '"success":true'; then
    echo "✅ Token 验证成功"
else
    echo "❌ Token 验证失败"
    echo "$VERIFY_RESULT"
    exit 1
fi

# 测试账户访问
echo ""
echo "测试账户访问..."
ACCOUNT_RESULT=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json")

if echo "$ACCOUNT_RESULT" | grep -q '"success":true'; then
    echo "✅ 账户访问成功"
    ACCOUNT_NAME=$(echo "$ACCOUNT_RESULT" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    echo "账户名称: $ACCOUNT_NAME"
else
    echo "❌ 账户访问失败"
    echo "$ACCOUNT_RESULT"
    exit 1
fi

# 检查现有 Workers
echo ""
echo "检查现有 Workers..."
WORKERS_RESULT=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/scripts" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json")

if echo "$WORKERS_RESULT" | grep -q '"success":true'; then
    echo "✅ Workers API 访问成功"
    WORKER_COUNT=$(echo "$WORKERS_RESULT" | grep -o '"id":' | wc -l)
    echo "现有 Workers 数量: $WORKER_COUNT"
    
    if [ "$WORKER_COUNT" -gt 0 ]; then
        echo "Workers 列表:"
        echo "$WORKERS_RESULT" | grep -o '"id":"[^"]*"' | cut -d'"' -f4
    fi
else
    echo "❌ Workers API 访问失败"
    echo "$WORKERS_RESULT"
fi

echo ""
echo "6️⃣ 开始构建..."
if npx mastra build; then
    echo "✅ 构建成功"
    
    echo ""
    echo "构建输出文件:"
    if [ -d ".mastra" ]; then
        find .mastra -type f -name "*.js" -o -name "*.json" | head -10
    else
        echo "❌ .mastra 目录不存在"
    fi
else
    echo "❌ 构建失败"
    exit 1
fi

echo ""
echo "7️⃣ 开始部署..."
echo "执行命令: npx mastra deploy"
echo ""

# 实际部署
npx mastra deploy

DEPLOY_EXIT_CODE=$?

echo ""
if [ $DEPLOY_EXIT_CODE -eq 0 ]; then
    echo "🎉 部署成功！"
    
    echo ""
    echo "验证部署..."
    sleep 5
    
    # 尝试不同的 URL 格式
    URLS=(
        "https://yd-mastra-agent.workers.dev"
        "https://yd-mastra-agent.${ACCOUNT_NAME}.workers.dev"
        "https://yd-mastra-agent.liuweiyuan0713.workers.dev"
    )
    
    for url in "${URLS[@]}"; do
        echo "测试: $url/health"
        if curl -s --max-time 10 "$url/health" | grep -q "healthy"; then
            echo "✅ API 可访问: $url"
            break
        else
            echo "❌ API 不可访问: $url"
        fi
    done
    
else
    echo "❌ 部署失败，退出码: $DEPLOY_EXIT_CODE"
fi
