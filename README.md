# 易经占卜应用 - 完整项目

一个支持分类特定 AI 解卦的易经占卜应用，采用前后端分离架构，支持本地开发和后期迁移到 Supabase。

## 🎯 核心功能

- ✅ 多种占卜方法（六爻、梅花易数、AI）
- ✅ 6 个问题分类（财运、感情、事业、健康、学业、家庭）
- ✅ 分类特定的 AI 提示词模板
- ✅ 个性化的 AI 解卦结果
- ✅ 本地开发环境（Deepseek API）
- ✅ 便于迁移到 Supabase

## 📚 文档导航

### 快速开始

- **[QUICK_START.md](./QUICK_START.md)** - 5 分钟快速启动指南
- **[DEEPSEEK_SETUP_GUIDE.md](./DEEPSEEK_SETUP_GUIDE.md)** - Deepseek API 配置指南

### 深入了解

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - 项目架构设计详解
- **[DIVINATION_ALGORITHM_EXPLAINED.md](./DIVINATION_ALGORITHM_EXPLAINED.md)** - 占卜算法详解
- **[backend/README.md](./backend/README.md)** - 后端详细文档

## 🚀 快速开始

### 前置要求

- Node.js >= 16
- npm >= 8
- OpenAI API Key

### 1. 启动后端

```bash
cd backend
npm install
cp .env.example .env
# 编辑 .env，填入 OPENAI_API_KEY
npm run dev
```

### 2. 启动前端

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### 3. 打开浏览器

访问 `http://localhost:5173`

## 📁 项目结构

```
.
├── backend/                    # Node.js + Express 后端
│   ├── src/
│   │   ├── config/            # 配置（提示词、卦象数据）
│   │   ├── services/          # 业务逻辑（占卜、AI）
│   │   ├── routes/            # API 路由
│   │   ├── types/             # TypeScript 类型
│   │   └── index.ts           # 主入口
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/                   # React 前端应用
│   ├── src/
│   │   ├── services/          # API 调用服务
│   │   ├── pages/             # 页面组件
│   │   ├── types/             # 类型定义
│   │   └── ...
│   ├── .env.example
│   └── package.json
│
├── QUICK_START.md             # 快速启动指南
├── ARCHITECTURE.md            # 架构设计文档
├── IMPLEMENTATION_SUMMARY.md  # 实现总结
├── SETUP_CHECKLIST.md         # 设置检查清单
├── PROJECT_SUMMARY.md         # 项目完成总结
└── README.md                  # 本文件
```

## 🎓 核心概念

### 分类特定的提示词

每个问题分类都有独立的 AI 提示词模板：

| 分类 | 关键词 | 关注点 |
|------|--------|--------|
| 💰 财运投资 | 财富、投资、收益 | 财运趋势、投资建议、收入机遇 |
| 💕 感情婚姻 | 爱情、婚姻、缘分 | 感情发展、缘分、沟通建议 |
| 💼 事业发展 | 工作、职业、升职 | 职业机遇、发展方向、能力提升 |
| 🏥 健康养生 | 健康、身体、养生 | 身心健康、养生建议、调理方向 |
| 📚 学业考试 | 学习、考试、成绩 | 学业进展、考试前景、学习方法 |
| 👨‍👩‍👧‍👦 家庭亲情 | 家庭、亲情、关系 | 家庭关系、亲情互动、和谐建议 |

### 工作流程

```
用户选择分类 → 选择占卜方法 → 输入问题
    ↓
后端执行占卜计算 → 返回卦象信息
    ↓
前端显示占卜结果
    ↓
用户点击 AI 解读 → 后端根据分类生成提示词
    ↓
调用 OpenAI API → 返回个性化解卦结果
```

## 🔌 API 文档

### 执行占卜

```bash
POST /api/divination/perform

{
  "method": "meihua",
  "question": "我的财运如何？",
  "category": "wealth"
}
```

### 获取 AI 解卦

```bash
POST /api/divination/ai-interpretation

{
  "method": "meihua",
  "question": "我的财运如何？",
  "hexagram_name": "乾",
  "hexagram_info": { ... },
  "category": "wealth"
}
```

详见 [backend/README.md](./backend/README.md)

## 🛠️ 开发指南

### 修改占卜算法

编辑 `backend/src/services/divinationService.ts`

### 修改 AI 提示词

编辑 `backend/src/config/prompts.ts`

### 添加新的问题分类

1. 在 `backend/src/config/prompts.ts` 中添加新分类
2. 在 `frontend/src/pages/Divination.tsx` 中添加新分类选项

### 迁移到 Supabase

详见后期编写的 `MIGRATION_GUIDE.md`

## 🔍 故障排除

### 后端无法启动

- 检查 Node.js 版本 >= 16
- 检查 npm 版本 >= 8
- 删除 `node_modules`，重新安装

### OpenAI API 连接失败

- 检查 `OPENAI_API_KEY` 是否正确
- 检查 API Key 是否有效
- 检查网络连接

### 前端无法连接后端

- 确保后端服务正在运行
- 检查 `VITE_BACKEND_URL` 是否为 `http://localhost:3001`
- 查看浏览器控制台的错误信息

详见 [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)

## 📊 项目统计

- **后端文件**: 12 个
- **前端修改**: 4 个文件
- **文档**: 6 个
- **代码行数**: ~2000 行
- **支持分类**: 6 个
- **支持占卜方法**: 3 个

## ✨ 项目亮点

✅ **分类特定的提示词** - 确保 AI 解读针对性强
✅ **前后端分离** - 便于独立开发和测试
✅ **本地开发环境** - 快速迭代，无需云服务
✅ **便于迁移** - 代码结构清晰，易于转换
✅ **完整文档** - 详细的文档和指南
✅ **清晰的代码** - 易于理解和维护
✅ **TypeScript** - 类型安全，减少错误

## 🎯 下一步

1. **阅读文档**
   - 从 [QUICK_START.md](./QUICK_START.md) 开始
   - 了解 [ARCHITECTURE.md](./ARCHITECTURE.md)

2. **启动项目**
   - 按照 [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) 进行设置
   - 测试占卜功能

3. **自定义开发**
   - 修改提示词
   - 添加新的问题分类
   - 优化占卜算法

4. **准备上线**
   - 准备迁移到 Supabase
   - 配置生产环境
   - 部署应用

## 📞 获取帮助

- 查看相关 README 文件
- 查看后端日志
- 查看浏览器控制台
- 查看网络请求（F12 -> Network）

## 📄 许可证

MIT

## 🙏 致谢

感谢使用本项目！

---

**版本**: 1.0.0
**最后更新**: 2024 年
**状态**: ✅ 完成

**快速链接**:
- [快速开始](./QUICK_START.md)
- [架构设计](./ARCHITECTURE.md)
- [后端文档](./backend/README.md)
- [设置检查](./SETUP_CHECKLIST.md)
