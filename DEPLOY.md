# 🚀 部署指南（Vercel 全栈部署）

**部署模式**: Vercel Serverless Functions（前后端一体）  
**预计时间**: 5-10 分钟  
**成本**: 完全免费（无需信用卡）

---

## 📋 准备工作

### 需要的账号
- ✅ GitHub 账号
- ✅ Vercel 账号 - https://vercel.com
- ✅ Deepseek API Key - https://platform.deepseek.com

### 需要配置的环境变量

**Vercel (前后端一体)**:
```env
DEEPSEEK_API_KEY=你的_deepseek_api_key
DEEPSEEK_MODEL=deepseek-chat
```

---

## 🎯 部署步骤

### 第一步：推送代码到 GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

---

### 第二步：部署到 Vercel

#### 1. 创建项目
1. 访问 https://vercel.com
2. 点击 **"New Project"**
3. 导入你的 GitHub 仓库
4. 点击 **"Import"**

#### 2. 配置项目

**Framework Preset**: 
- 选择 **"Vite"**

**Root Directory**: 
- 点击 **"Edit"**
- 输入 `frontend`
- 点击 **"Continue"**

**Build and Output Settings**:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

#### 3. 添加环境变量

在 **"Environment Variables"** 部分添加：

```env
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
DEEPSEEK_MODEL=deepseek-chat
```

> 💡 **获取 Deepseek API Key**:
> 1. 访问 https://platform.deepseek.com
> 2. 注册/登录
> 3. 进入 API Keys 页面
> 4. 创建新 Key（以 `sk-` 开头）

#### 4. 部署

- 点击 **"Deploy"**
- 等待部署完成（约 2-3 分钟）

#### 5. 获取应用 URL

- 部署完成后会显示你的应用 URL
- 格式：`https://your-app-name.vercel.app`

---

### 第三步：测试应用

#### 1. 访问应用
打开浏览器，访问你的 Vercel URL

#### 2. 测试占卜功能
1. ✅ 首页正常显示
2. ✅ 点击 **"诚心起卦"**
3. ✅ 选择问题分类
4. ✅ 输入问题
5. ✅ 点击 **"开始占卜"**
6. ✅ 查看占卜结果

#### 3. 测试 AI 解读
1. ✅ 在结果页面点击 **"获取AI深度解读"**
2. ✅ 等待 AI 分析（约 5-10 秒）
3. ✅ 查看 AI 解读内容

---

## 🎉 部署成功！

如果以上测试都通过，恭喜你！应用已经成功部署！

### 你的应用地址
- **应用**: `https://your-app-name.vercel.app`
- **API**: `https://your-app-name.vercel.app/api/*`

### 分享给朋友
直接分享应用 URL 即可！

---

## 🔧 常见问题

### 问题 1: AI 解读失败

**可能原因**:
- Deepseek API Key 无效
- API Key 配额用完

**解决方案**:
1. 检查 Vercel 环境变量 `DEEPSEEK_API_KEY` 是否正确
2. 访问 Deepseek 平台检查 API Key 状态
3. 查看 Vercel 函数日志：
   - 进入 Vercel 项目
   - 点击 **"Functions"** 标签
   - 查看错误信息

---

### 问题 2: 页面刷新后 404

**原因**: `vercel.json` 配置问题

**解决方案**:
1. 确认 `frontend/vercel.json` 文件存在
2. 确认内容正确：
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
3. 重新部署

---

### 问题 3: 修改环境变量后不生效

**解决方案**:
- 进入 Vercel 项目页面
- 点击 **"Deployments"** 标签
- 点击最新部署右侧的 **"..."** 菜单
- 选择 **"Redeploy"**

---

## 🔄 更新应用

### 更新代码

```bash
# 修改代码后
git add .
git commit -m "Update: 描述你的修改"
git push
```

### 自动部署

- Vercel 会自动检测代码更新
- 自动触发重新部署
- 约 2-3 分钟后更新生效

---

## 💰 成本说明

### 完全免费，无需信用卡！

**Vercel 免费额度**:
- ✅ 无限部署
- ✅ 100 GB 带宽/月
- ✅ 100 GB-小时 Serverless 执行时间
- ✅ 无限 API 请求

**Deepseek API**:
- ✅ 新用户有免费额度
- ✅ 价格便宜（约 ¥0.001/千tokens）

---

## 📈 性能优化

### 1. 启用 Vercel Analytics（可选）
- 进入 Vercel 项目设置
- 启用 Analytics
- 查看访问统计

### 2. 配置自定义域名（可选）
- 在 Vercel 项目设置中添加域名
- 配置 DNS 记录

### 3. 监控函数性能
- 查看 **Functions** 标签
- 监控执行时间和错误率

---

## 🎯 架构说明

### Vercel Serverless Functions

你的后端 API 现在运行在 Vercel Serverless Functions 上：

- `/api/divination-perform` - 执行占卜
- `/api/ai-interpretation` - AI 解读

### 优点

- ✅ 完全免费，无需信用卡
- ✅ 自动扩展，无需管理服务器
- ✅ 全球 CDN 加速
- ✅ 不会休眠，响应快速
- ✅ 前后端统一部署，管理方便

---

## 📞 需要帮助？

- 查看 [README.md](./README.md)
- 提交 GitHub Issue
- Vercel 文档: https://vercel.com/docs
- Vercel Functions 文档: https://vercel.com/docs/functions

---

**部署愉快！🚀**
