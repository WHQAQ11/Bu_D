# 每日一卦 - 六爻占卜应用

一个融合中华古老智慧与现代 AI 技术的六爻占卜应用。通过传统的掷币占卜方法，结合 AI 智能解读，为用户提供深度的人生指引。

## 功能特性

- 🔮 **六爻占卜** - 传统六爻掷币占卜，细致入微，适合复杂问题
- 🤖 **AI 智能解读** - 由小算 AI 助手提供温柔、专业的卦象解读
- 📊 **动态运势** - 每日更新的幸运数字、幸运色和运势指引
- 💾 **占卜历史** - 保存和查看历史占卜记录
- 🎨 **精美界面** - 融合易经元素的现代化设计

## 技术栈

### 前端
- React 18
- TypeScript
- Tailwind CSS
- Vite

### 后端
- Node.js + Express
- TypeScript
- Deepseek API（AI 解读）

## 快速开始

### 前置要求
- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
# 前端
cd frontend
npm install

# 后端
cd ../backend
npm install
```

### 环境配置

#### 前端配置 (`frontend/.env.local`)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_BACKEND_URL=http://localhost:3002
```

#### 后端配置 (`backend/.env`)
```
PORT=3002
NODE_ENV=development
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_MODEL=deepseek-chat
```

### 启动应用

```bash
# 启动后端（在 backend 目录）
npm run dev

# 启动前端（在 frontend 目录）
npm run dev
```

前端访问地址：`http://localhost:3000`
后端 API 地址：`http://localhost:3002`

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

## 核心功能说明

### 六爻占卜流程
1. 选择问题分类（事业、感情、财运等）
2. 输入具体问题
3. 系统进行占卜计算
4. 显示卦象结果
5. 获取 AI 智能解读

### AI 解读特点
- 采用"诊断-分析-建议-追问"的四步法
- 根据问题分类提供针对性的解读
- 提出有针对性的追问问题，引导用户补充信息
- 温柔、专业的表达风格

## 使用建议

- 占卜前保持内心平静，专注思考问题
- 占卜结果仅供参考，重要决策请理性思考
- 补充详细信息可获得更精准的 AI 解读

## 许可证

MIT

## 联系方式

如有问题或建议，欢迎提交 Issue 或 Pull Request。
