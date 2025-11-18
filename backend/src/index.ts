/**
 * 后端主入口
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import divinationRoutes from './routes/divination.js';
import { AIService } from './services/aiService.js';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 请求日志中间件（放在最前面，确保捕获所有请求）
app.use((req, res, next) => {
  const logMsg = `\n📨 [${new Date().toISOString()}] ${req.method} ${req.path}`;
  console.log(logMsg);
  process.stdout.write(logMsg + '\n');
  if (Object.keys(req.body).length > 0) {
    console.log(`   Body:`, JSON.stringify(req.body).substring(0, 200));
  }
  next();
});

// 路由
app.use('/api/divination', divinationRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ [Error Handler]', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
});

// 启动服务器
const server = app.listen(PORT, async () => {
  console.log(`\n🚀 [Server] 后端服务启动成功`);
  console.log(`📍 [Server] 监听地址: http://localhost:${PORT}`);
  console.log(`📍 [Server] API 文档: http://localhost:${PORT}/api/divination/health`);
  console.log(`\n🔧 [Server] 环境配置:`);
  console.log(`   - NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   - DEEPSEEK_MODEL: ${process.env.DEEPSEEK_MODEL || 'deepseek-chat'}`);
  console.log(`   - DEEPSEEK_API_KEY: ${process.env.DEEPSEEK_API_KEY ? '✅ 已配置' : '❌ 未配置'}`);

  // 测试 Deepseek 连接
  console.log(`\n🔍 [Server] 测试 Deepseek API 连接...`);
  const connected = await AIService.testConnection();
  if (connected) {
    console.log(`✅ [Server] Deepseek API 连接成功`);
  } else {
    console.log(`⚠️  [Server] Deepseek API 连接失败，AI 功能将不可用`);
  }

  console.log(`\n✨ [Server] 后端服务已就绪！\n`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('\n📛 [Server] 收到 SIGTERM 信号，正在关闭...');
  server.close(() => {
    console.log('✅ [Server] 服务已关闭');
    process.exit(0);
  });
});

export default app;
