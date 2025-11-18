/**
 * AI 解卦服务
 * 调用 Deepseek API 进行智能解读
 */

import axios from 'axios';
import { AIInterpretationRequest, AIInterpretationResponse } from '../types/index.js';
import { getPromptTemplate, buildAIPrompt, getFollowUpQuestions } from '../config/prompts.js';

export class AIService {
  private static apiUrl = 'https://api.deepseek.com/chat/completions';

  /**
   * 获取 API Key（动态读取）
   */
  private static getApiKey(): string {
    return process.env.DEEPSEEK_API_KEY || '';
  }

  /**
   * 获取模型名称（动态读取）
   */
  private static getModel(): string {
    return process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  }

  /**
   * 获取 AI 解卦
   */
  static async getInterpretation(
    request: AIInterpretationRequest
  ): Promise<AIInterpretationResponse> {
    try {
      console.log(`🤖 [AIService] 开始 AI 解卦:`, {
        question: request.question.substring(0, 30),
        hexagram: request.hexagram_name,
        category: request.category,
      });

      const apiKey = this.getApiKey();
      if (!apiKey) {
        throw new Error('DEEPSEEK_API_KEY 未配置');
      }

      // 获取分类特定的提示词模板
      const template = getPromptTemplate(request.category);

      // 构建完整的提示词
      const { systemPrompt, userPrompt } = buildAIPrompt(template, {
        question: request.question,
        benGuaName: request.hexagram_name,
        benGuaNumber: 1, // 这里应该从 hexagram_info 获取
        upperTrigram: request.hexagram_info.upperTrigram || '乾',
        lowerTrigram: request.hexagram_info.lowerTrigram || '乾',
        guaci: request.hexagram_info.guaci || '卦辞',
        changingYao: undefined,
        yaoCI: request.hexagram_info.yaoci?.[0],
      });

      console.log(`📝 [AIService] 构建提示词完成，准备调用 Deepseek API`);
      console.log(`📝 [AIService] 系统提示词长度: ${systemPrompt.length}, 用户提示词长度: ${userPrompt.length}`);

      // 调用 Deepseek API
      console.log(`🌐 [AIService] 正在连接 Deepseek API...`);
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.getModel(),
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
          top_p: 0.9,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000, // 增加到 60 秒
        }
      );

      console.log(`📥 [AIService] 收到 Deepseek 响应`);

      const interpretation = response.data.choices[0]?.message?.content;

      if (!interpretation) {
        throw new Error('AI 返回空响应');
      }

      console.log(`✅ [AIService] AI 解卦完成`);

      // 获取该分类的追问问题
      const followUpQuestions = getFollowUpQuestions(request.category);

      return {
        success: true,
        interpretation,
        data: {
          ai_interpretation: interpretation,
          model_used: this.getModel(),
          processing_time: response.data.usage?.total_tokens || 0,
          token_usage: {
            prompt_tokens: response.data.usage?.prompt_tokens || 0,
            completion_tokens: response.data.usage?.completion_tokens || 0,
            total_tokens: response.data.usage?.total_tokens || 0,
          },
          follow_up_questions: followUpQuestions,
        },
      };
    } catch (error: any) {
      console.error(`❌ [AIService] AI 解卦失败:`, {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });

      return {
        success: false,
        error: error.message,
        message: `AI 解卦失败: ${error.message}`,
      };
    }
  }

  /**
   * 测试 API 连接
   */
  static async testConnection(): Promise<boolean> {
    try {
      const apiKey = this.getApiKey();
      if (!apiKey) {
        console.warn('⚠️ [AIService] DEEPSEEK_API_KEY 未配置');
        return false;
      }

      console.log('🔍 [AIService] 测试 Deepseek API 连接...');

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.getModel(),
          messages: [
            {
              role: 'user',
              content: 'Hello',
            },
          ],
          max_tokens: 10,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 增加到 30 秒
        }
      );

      console.log('✅ [AIService] Deepseek API 连接成功');
      return true;
    } catch (error: any) {
      console.error('❌ [AIService] Deepseek API 连接失败:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
      });
      return false;
    }
  }
}
