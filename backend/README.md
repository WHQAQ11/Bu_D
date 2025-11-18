# I Ching Divination Backend

本地 Node.js + Express 后端服务，用于支持易经占卜应用的核心功能。

## 功能特性

- ✅ 占卜计算（六爻、梅花易数、AI）
- ✅ 分类特定的 AI 解卦提示词
- ✅ OpenAI API 集成
- ✅ RESTful API 接口
- ✅ 便于迁移到 Supabase

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，并填入你的配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入 Deepseek API Key：

```env
PORT=3001
NODE_ENV=development

# Deepseek API 配置（必需）
# 从 https://platform.deepseek.com 获取 API Key
DEEPSEEK_API_KEY=sk-your-api-key-here
DEEPSEEK_MODEL=deepseek-chat

# 日志级别
LOG_LEVEL=debug
```

### 3. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:3001` 启动。

### 4. 测试 API

```bash
# 健康检查
curl http://localhost:3001/health

# 执行占卜
curl -X POST http://localhost:3001/api/divination/perform \
  -H "Content-Type: application/json" \
  -d '{
    "method": "meihua",
    "question": "我的事业发展如何？",
    "category": "career"
  }'

# 获取 AI 解卦（使用 Deepseek）
curl -X POST http://localhost:3001/api/divination/ai-interpretation \
  -H "Content-Type: application/json" \
  -d '{
    "method": "meihua",
    "question": "我的事业发展如何？",
    "hexagram_name": "乾",
    "hexagram_info": {
      "upperTrigram": "乾",
      "lowerTrigram": "乾",
      "guaci": "乾：元，亨，利，贞。"
    },
    "category": "career"
  }'
```

## API 文档

### 1. 执行占卜

**请求**

```
POST /api/divination/perform
Content-Type: application/json

{
  "method": "liuyao" | "meihua" | "ai",
  "question": "你的问题",
  "category": "wealth" | "relationship" | "career" | "health" | "study" | "family"
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "result": {
      "originalHexagram": "01",
      "transformedHexagram": "02",
      "changingLineIndexes": [0],
      "benGuaInfo": {
        "name": "乾",
        "number": 1,
        "shang": "乾",
        "xia": "乾",
        "guaCi": "乾：元，亨，利，贞。"
      },
      "bianGuaInfo": {
        "name": "坤",
        "number": 2,
        "shang": "坤",
        "xia": "坤",
        "guaCi": "坤：元，亨，利牝马之贞。"
      }
    },
    "log_id": "log_1234567890"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. 获取 AI 解卦

**请求**

```
POST /api/divination/ai-interpretation
Content-Type: application/json

{
  "method": "meihua",
  "question": "我的事业发展如何？",
  "hexagram_name": "乾",
  "hexagram_info": {
    "upperTrigram": "乾",
    "lowerTrigram": "乾",
    "guaci": "乾：元，亨，利，贞。"
  },
  "category": "career",
  "style": "detailed",
  "focus": "career",
  "language": "chinese"
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "ai_interpretation": "根据乾卦的分析...",
    "model_used": "gpt-4-turbo-preview",
    "token_usage": {
      "prompt_tokens": 150,
      "completion_tokens": 500,
      "total_tokens": 650
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 分类特定的提示词

后端为每个问题分类都配置了特定的提示词模板，确保 AI 生成的解卦结果针对性强：

- **财运投资** (`wealth`) - 关注财运趋势、投资建议、收入机遇
- **感情婚姻** (`relationship`) - 关注感情发展、缘分、沟通建议
- **事业发展** (`career`) - 关注职业机遇、发展方向、能力提升
- **健康养生** (`health`) - 关注身心健康、养生建议、调理方向
- **学业考试** (`study`) - 关注学业进展、考试前景、学习方法
- **家庭亲情** (`family`) - 关注家庭关系、亲情互动、和谐建议

## 项目结构

```
backend/
├── src/
│   ├── config/
│   │   ├── prompts.ts          # 分类特定的提示词配置
│   │   └── hexagrams.ts        # 易经64卦象数据
│   ├── services/
│   │   ├── divinationService.ts # 占卜计算服务
│   │   └── aiService.ts         # AI 解卦服务
│   ├── routes/
│   │   └── divination.ts        # 占卜相关路由
│   ├── types/
│   │   └── index.ts             # TypeScript 类型定义
│   └── index.ts                 # 主入口
├── .env.example                 # 环境变量示例
├── package.json
├── tsconfig.json
└── README.md
```

## 开发指南

### 添加新的问题分类

1. 在 `src/config/prompts.ts` 中添加新的分类：

```typescript
export const DIVINATION_PROMPTS: Record<string, PromptTemplate> = {
  // ... 其他分类
  
  // 新分类
  newCategory: {
    systemPrompt: `你是一位...`,
    userPromptTemplate: `用户问题：{question}\n...`,
    focus: ['关键词1', '关键词2'],
    keywords: ['关键词1', '关键词2'],
  },
};
```

2. 前端在选择问题类型时就可以使用新分类

### 修改占卜算法

占卜计算逻辑在 `src/services/divinationService.ts` 中：

- `performLiuyaoDivination()` - 六爻占卜
- `performMeihuaDivination()` - 梅花易数
- `performAIDivination()` - AI 占卜

### 扩展卦象数据

易经64卦象数据在 `src/config/hexagrams.ts` 中，可以添加更多卦象信息。

## 迁移到 Supabase

当你准备上线时，可以按以下步骤迁移到 Supabase：

1. **创建 Supabase 项目** - 在 supabase.com 创建新项目
2. **创建数据库表** - 创建占卜记录表
3. **创建边缘函数** - 将 `aiService.ts` 迁移为 Supabase 边缘函数
4. **更新前端配置** - 改为调用 Supabase API
5. **部署** - 部署到 Supabase 或其他云平台

详见 `MIGRATION_GUIDE.md`（后期编写）

## 故障排除

### Deepseek API 连接失败

- 检查 `DEEPSEEK_API_KEY` 是否正确配置
- 检查 API Key 是否有效（访问 https://platform.deepseek.com 验证）
- 检查网络连接
- 查看服务器日志获取详细错误信息

### 占卜结果为空

- 检查卦象数据是否完整
- 查看服务器日志

### 前端无法连接后端

- 确保后端服务正在运行
- 检查 `VITE_BACKEND_URL` 是否正确
- 检查 CORS 配置

## 许可证

MIT

## 支持

如有问题，请查看日志或联系开发者。
