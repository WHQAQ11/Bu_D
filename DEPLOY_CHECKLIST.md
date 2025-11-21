# ✅ 部署前检查清单

## 📋 部署前准备

### 1. 代码准备
- [x] Serverless Functions 已创建
- [x] 前端 API 调用已更新
- [x] 代码已格式化
- [ ] 代码已推送到 GitHub

### 2. 账号准备
- [ ] GitHub 账号已登录
- [ ] Vercel 账号已注册（用 GitHub 登录）
- [ ] Deepseek API Key 已获取

---

## 🚀 部署步骤（5分钟）

### 步骤 1: 推送代码到 GitHub

```bash
# 查看修改
git status

# 添加所有文件
git add .

# 提交
git commit -m "Deploy to Vercel with Serverless Functions"

# 推送
git push
```

---

### 步骤 2: 部署到 Vercel

#### 2.1 创建项目
1. 打开 https://vercel.com
2. 点击 **"New Project"**
3. 找到你的仓库，点击 **"Import"**

#### 2.2 配置项目
- **Framework Preset**: 选择 **Vite**
- **Root Directory**: 点击 Edit，输入 `frontend`，点击 Continue

#### 2.3 添加环境变量
点击 **"Environment Variables"**，添加：

**第一个变量**:
- Name: `DEEPSEEK_API_KEY`
- Value: `sk-你的密钥`（从 https://platform.deepseek.com 获取）

**第二个变量**:
- Name: `DEEPSEEK_MODEL`
- Value: `deepseek-chat`

#### 2.4 部署
- 点击 **"Deploy"**
- 等待 2-3 分钟

---

### 步骤 3: 测试应用

#### 3.1 访问应用
- 部署完成后，点击 **"Visit"** 或复制 URL
- 格式：`https://your-app-name.vercel.app`

#### 3.2 测试功能
1. ✅ 首页显示正常
2. ✅ 点击"诚心起卦"
3. ✅ 选择"事业发展"
4. ✅ 输入问题："我是否应该换工作？"
5. ✅ 点击"开始占卜"
6. ✅ 查看占卜结果
7. ✅ 点击"获取AI深度解读"
8. ✅ 查看 AI 解读

---

## 🎉 部署成功标志

当你看到以下情况，说明部署成功：

- ✅ Vercel 显示 "Ready"
- ✅ 访问 URL 能看到首页
- ✅ 占卜功能正常工作
- ✅ AI 解读正常显示
- ✅ 浏览器控制台无错误

---

## 🔧 如果遇到问题

### 问题 1: 部署失败
**检查**:
- Root Directory 是否设置为 `frontend`
- Framework 是否选择了 Vite

**解决**:
- 在 Vercel 项目设置中修改
- 重新部署

---

### 问题 2: AI 解读失败
**检查**:
- 环境变量 `DEEPSEEK_API_KEY` 是否正确
- API Key 是否有效

**解决**:
1. 访问 https://platform.deepseek.com
2. 检查 API Key 状态
3. 在 Vercel 项目设置中更新环境变量
4. 重新部署

---

### 问题 3: 页面 404
**检查**:
- `frontend/vercel.json` 文件是否存在

**解决**:
- 确认文件存在且内容正确
- 重新部署

---

## 📱 部署后操作

### 1. 保存 URL
- 复制你的 Vercel URL
- 分享给朋友测试

### 2. 配置自定义域名（可选）
- 在 Vercel 项目设置中添加域名
- 配置 DNS 记录

### 3. 启用 Analytics（可选）
- 在 Vercel 项目设置中启用
- 查看访问统计

---

## 🎯 下一步

### 立即可以做的
- ✅ 分享应用给朋友
- ✅ 收集用户反馈
- ✅ 测试不同的占卜问题

### 以后可以添加
- 📊 添加数据库（Supabase）
- 👤 实现用户系统
- 📝 保存占卜历史
- 🎨 自定义主题

---

## 💡 提示

- **首次部署**: 可能需要 3-5 分钟
- **后续更新**: 只需 `git push`，Vercel 自动部署
- **完全免费**: 无需信用卡，无隐藏费用
- **全球访问**: Vercel CDN 自动加速

---

**准备好了吗？开始部署吧！** 🚀

查看详细文档: [DEPLOY.md](./DEPLOY.md)
