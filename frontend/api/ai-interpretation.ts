/**
 * Vercel Serverless Function: AI 解读
 * API: /api/ai-interpretation
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

// 提示词模板（简化版）
const PROMPT_TEMPLATES: Record<string, string> = {
  career: '你是一位温柔、专业的易经占卜师"小算"。请根据卦象为用户的事业问题提供指引。',
  relationship: '你是一位温柔、专业的易经占卜师"小算"。请根据卦象为用户的感情问题提供指引。',
  health: '你是一位温柔、专业的易经占卜师"小算"。请根据卦象为用户的健康问题提供指引。',
  wealth: '你是一位温柔、专业的易经占卜师"小算"。请根据卦象为用户的财运问题提供指引。',
  study: '你是一位温柔、专业的易经占卜师"小算"。请根据卦象为用户的学业问题提供指引。',
  family: '你是一位温柔、专业的易经占卜师"小算"。请根据卦象为用户的家庭问题提供指引。',
  default: '你是一位温柔、专业的易经占卜师"小算"。请根据卦象为用户提供指引。',
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { question, hexagram_name, hexagram_info, category } = req.body;

    if (!question || !hexagram_name) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数: question 和 hexagram_name',
      });
    }

    console.log(`📡 [AI API] 收到 AI 解读请求: ${hexagram_name}`);

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY 未配置');
    }

    // 构建提示词
    const systemPrompt = PROMPT_TEMPLATES[category || 'default'] || PROMPT_TEMPLATES.default;
    const userPrompt = `
用户问题：${question}

卦象信息：
- 卦名：${hexagram_name}
- 上卦：${hexagram_info.upperTrigram || '乾'}
- 下卦：${hexagram_info.lowerTrigram || '乾'}
- 卦辞：${hexagram_info.guaci || '元亨利贞'}

请按照以下格式提供解读：

📊 **现状诊断**
（分析当前情况）

🔍 **深层分析**
（深入解读卦象含义）

💡 **具体建议**
（提供可行的建议）

❓ **追问引导**
（提出2-3个帮助用户深入思考的问题）
`;

    // 调用 Deepseek API
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
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
        timeout: 60000,
      }
    );

    const interpretation = response.data.choices[0]?.message?.content;

    if (!interpretation) {
      throw new Error('AI 返回空响应');
    }

    console.log(`✅ [AI API] AI 解读完成`);

    return res.status(200).json({
      success: true,
      data: {
        ai_interpretation: interpretation,
        model_used: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        token_usage: {
          prompt_tokens: response.data.usage?.prompt_tokens || 0,
          completion_tokens: response.data.usage?.completion_tokens || 0,
          total_tokens: response.data.usage?.total_tokens || 0,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ [AI API] 错误:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: `AI 解读失败: ${error.message}`,
      timestamp: new Date().toISOString(),
    });
  }
}
