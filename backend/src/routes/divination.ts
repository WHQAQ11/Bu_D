/**
 * 占卜相关路由
 */

import { Router, Request, Response } from 'express';
import { DivinationService } from '../services/divinationService.js';
import { AIService } from '../services/aiService.js';
import { ApiResponse, DivinationRequest, AIInterpretationRequest } from '../types/index.js';

const router = Router();

/**
 * POST /api/divination/perform
 * 执行占卜
 */
router.post('/perform', async (req: Request, res: Response) => {
  try {
    const { method, question, category } = req.body as DivinationRequest;

    if (!method || !question) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数: method 和 question',
        timestamp: new Date().toISOString(),
      } as ApiResponse);
    }

    console.log(`📡 [POST /api/divination/perform] 收到占卜请求:`, {
      method,
      question: question.substring(0, 30),
      category,
    });

    // 执行占卜计算
    const result = DivinationService.performDivination(method, question);

    console.log(`✅ [POST /api/divination/perform] 占卜完成`);

    return res.json({
      success: true,
      data: {
        result,
        log_id: `log_${Date.now()}`, // 本地模拟 ID，后期迁移到 Supabase 时会真实生成
      },
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  } catch (error: any) {
    console.error('❌ [POST /api/divination/perform] 错误:', error.message);

    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }
});

/**
 * POST /api/divination/ai-interpretation
 * 获取 AI 解卦
 */
router.post('/ai-interpretation', async (req: Request, res: Response) => {
  try {
    const request = req.body as AIInterpretationRequest;

    if (!request.question || !request.hexagram_name) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数: question 和 hexagram_name',
        timestamp: new Date().toISOString(),
      } as ApiResponse);
    }

    console.log(`📡 [POST /api/divination/ai-interpretation] 收到 AI 解卦请求:`, {
      question: request.question.substring(0, 30),
      hexagram: request.hexagram_name,
      category: request.category,
    });

    // 调用 AI 服务
    const result = await AIService.getInterpretation(request);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
        message: result.message,
        timestamp: new Date().toISOString(),
      } as ApiResponse);
    }

    console.log(`✅ [POST /api/divination/ai-interpretation] AI 解卦完成`);

    return res.json({
      success: true,
      data: result.data,
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  } catch (error: any) {
    console.error('❌ [POST /api/divination/ai-interpretation] 错误:', error.message);

    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }
});

/**
 * GET /api/divination/health
 * 健康检查
 */
router.get('/health', (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  } as ApiResponse);
});

export default router;
