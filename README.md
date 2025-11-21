# 六爻问卜 - AI 易经占卜应用

融合中华传统智慧与现代 AI 技术的六爻占卜应用。采用传统掷币起卦方法，结合 Deepseek AI 智能解读，为用户提供深度的人生指引。

## ✨ 功能特性

- 🔮 **六爻占卜** - 传统六爻掷币占卜，细致入微，适合复杂问题
- 🤖 **AI 智能解读** - 由小算 AI 助手提供温柔、专业的卦象解读
- 📊 **每日运势** - 每日更新的幸运数字、幸运色和运势指引
- 🎨 **禅意设计** - 宣纸白、松烟黑、朱砂红的古典配色
- ⚡ **无需登录** - 即开即用，无需注册

## 🚀 快速部署

**查看详细部署指南**: [DEPLOY.md](./DEPLOY.md)

### 一键部署
- **前端**: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
- **后端**: [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

### 部署要求
- Deepseek API Key（必需）
- Railway 账号（后端，免费）
- Vercel 账号（前端，免费）

**预计时间**: 10-15 分钟 | **成本**: 完全免费

---

## 💻 技术栈

### 前端
- React 18 + TypeScript
- Tailwind CSS（禅意设计）
- Vite（构建工具）
- Axios（API 调用）

### 后端
- Node.js + Express
- TypeScript
- Deepseek API（AI 解读）

## 🛠️ 本地开发

### 前置要求
- Node.js 18+
- npm 或 yarn
- Deepseek API Key

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd Bu_D
```

### 2. 安装依赖
```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 3. 配置环境变量

**后端** (`backend/.env`):
```env
PORT=3001
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_MODEL=deepseek-chat
```

**前端** (`frontend/.env.local`):
```env
VITE_BACKEND_URL=http://localhost:3001
```

### 4. 启动服务

```bash
# 启动后端（在 backend 目录）
npm run dev

# 启动前端（在 frontend 目录，新终端）
npm run dev
```

访问 `http://localhost:3000` 查看应用

## 项目结构

```
.
├── frontend/                 # 前端应用
│   ├── src/
│   │   ├── components/      # React 组件
│   │   ├── pages/           # 页面
│   │   ├── services/        # API 服务
│   │   ├── types/           # TypeScript 类型
│   │   └── utils/           # 工具函数
│   └── package.json
│
└── backend/                  # 后端应用
    ├── src/
    │   ├── routes/          # API 路由
    │   ├── services/        # 业务逻辑
    │   ├── config/          # 配置文件
    │   ├── types/           # TypeScript 类型
    │   └── index.ts         # 入口文件
    └── package.json
```

## 📖 使用说明

### 占卜流程
1. 点击"诚心起卦"进入占卜页面
2. 选择问题分类（事业、感情、健康、财运、学业、家庭）
3. 选择占卜方法（六爻占卜）
4. 详细描述你的问题
5. 观看掷币动画，生成卦象
6. 查看卦辞、爻辞解读
7. 点击"获取AI深度解读"获得个性化分析

### AI 解读特点
- 📊 **四步分析法**: 诊断现状 → 深层分析 → 具体建议 → 追问引导
- 🎯 **分类定制**: 根据问题类型提供针对性解读
- 💬 **温柔表达**: 小算 AI 助手的温暖、专业风格
- 🔍 **深度洞察**: 结合传统智慧与现代心理学

---

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题或建议，欢迎通过 Issue 联系。
