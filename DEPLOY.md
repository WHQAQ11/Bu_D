# 🚀 部署指南

**部署模式**: 无状态 + 无数据库  
**预计时间**: 10-15 分钟  
**成本**: 完全免费

---

## 📋 准备工作

### 需要的账号
- GitHub 账号
- Railway 账号 - https://railway.app
- Vercel 账号 - https://vercel.com
- Deepseek API Key - https://platform.deepseek.com

### 需要配置的环境变量

**Railway (后端)**:
```env
DEEPSEEK_API_KEY=你的_deepseek_api_key
```

**Vercel (前端)**:
```env
VITE_BACKEND_URL=https://your-backend.railway.app
```

---

## 🎯 部署步骤

### 第一步：推送代码到 GitHub

```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

---

### 第二步：部署后端到 Railway

#### 1. 创建项目
1. 访问 https://railway.app
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 选择你的仓库

#### 2. 配置项目
**Settings → General**:
- Root Directory: `backend`
- Build Command: `npm run build`
- Start Command: `npm start`

#### 3. 添加环境变量
**Variables** 标签页:
```env
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
DEEPSEEK_MODEL=deepseek-chat
NODE_ENV=production
```

#### 4. 获取后端 URL
- 在 Settings → Domains 中找到域名
- 格式：`https://your-app-name.railway.app`
- 测试：访问 `/health` 端点应返回成功

---

### 第三步：部署前端到 Vercel

#### 1. 创建项目
1. 访问 https://vercel.com
2. 点击 "New Project"
3. 导入 GitHub 仓库

#### 2. 配置项目
- Framework Preset: **Vite**
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

#### 3. 添加环境变量
```env
VITE_BACKEND_URL=https://your-app-name.railway.app
```
（使用第二步获取的 Railway URL）

#### 4. 部署
点击 "Deploy" 等待完成

---

### 第四步：测试应用

1. 访问 Vercel URL
2. 点击"诚心起卦"
3. 选择问题分类
4. 输入问题并占卜
5. 查看结果
6. 测试 AI 解读

---

## 🔧 常见问题

### 前端显示"网络错误"
- 检查 Vercel 环境变量 `VITE_BACKEND_URL`
- 确认后端正在运行（访问 `/health`）
- 重新部署前端

### AI 解读失败
- 检查 Railway 环境变量 `DEEPSEEK_API_KEY`
- 确认 API Key 有效且有配额
- 查看 Railway 日志

### 页面刷新 404
- 确认 `frontend/vercel.json` 存在
- 重新部署前端

---

## 🔄 更新应用

```bash
git add .
git commit -m "Update: 描述修改"
git push
```

Railway 和 Vercel 会自动重新部署

---

## 💰 成本

完全免费！

- Railway: 每月 $5 免费额度
- Vercel: 100 GB 带宽/月
- Deepseek: 新用户有免费额度

---

## 📞 需要帮助？

查看 [README.md](./README.md) 或提交 Issue
