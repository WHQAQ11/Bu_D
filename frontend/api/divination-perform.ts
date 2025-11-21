/**
 * Vercel Serverless Function: 执行占卜
 * API: /api/divination-perform
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// 卦象数据（简化版，只包含前8卦）
const HEXAGRAMS = [
  { number: 1, name: '乾', upperTrigram: '乾', lowerTrigram: '乾', guaci: '乾：元，亨，利，贞。' },
  { number: 2, name: '坤', upperTrigram: '坤', lowerTrigram: '坤', guaci: '坤：元，亨，利牝马之贞。' },
  { number: 3, name: '屯', upperTrigram: '坎', lowerTrigram: '震', guaci: '屯：元，亨，利，贞。勿用有攸往，利建侯。' },
  { number: 4, name: '蒙', upperTrigram: '艮', lowerTrigram: '坎', guaci: '蒙：亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。' },
  { number: 5, name: '需', upperTrigram: '坎', lowerTrigram: '乾', guaci: '需：有孚，光亨，贞吉。利涉大川。' },
  { number: 6, name: '讼', upperTrigram: '乾', lowerTrigram: '坎', guaci: '讼：有孚，窒。惕中吉。终凶。利见大人，不利涉大川。' },
  { number: 7, name: '师', upperTrigram: '坤', lowerTrigram: '坎', guaci: '师：贞，丈人吉，无咎。' },
  { number: 8, name: '比', upperTrigram: '坎', lowerTrigram: '坤', guaci: '比：吉。原筮元永贞，无咎。不宁方来，后夫凶。' },
];

function getHexagramByNumber(number: number) {
  return HEXAGRAMS.find(h => h.number === number) || HEXAGRAMS[0];
}

function performLiuyaoDivination() {
  const yao: number[] = [];
  const changingLines: number[] = [];

  for (let i = 0; i < 6; i++) {
    const coin = Math.floor(Math.random() * 4);
    if (coin === 3) {
      yao.push(Math.random() > 0.5 ? 0 : 1);
      changingLines.push(i);
    } else {
      yao.push(coin > 1 ? 1 : 0);
    }
  }

  const originalHexagram = yao.join('');
  const benGuaNumber = Math.floor(Math.random() * 8) + 1;
  const benGuaData = getHexagramByNumber(benGuaNumber);

  let transformedHexagram: string | undefined;
  let bianGuaData;

  if (changingLines.length > 0) {
    const transformedYao = [...yao];
    changingLines.forEach((index) => {
      transformedYao[index] = transformedYao[index] === 0 ? 1 : 0;
    });
    transformedHexagram = transformedYao.join('');
    const bianGuaNumber = Math.floor(Math.random() * 8) + 1;
    bianGuaData = getHexagramByNumber(bianGuaNumber);
  }

  return {
    originalHexagram,
    transformedHexagram,
    changingLineIndexes: changingLines,
    benGuaInfo: {
      name: benGuaData.name,
      number: benGuaData.number,
      shang: benGuaData.upperTrigram,
      xia: benGuaData.lowerTrigram,
      guaCi: benGuaData.guaci,
    },
    bianGuaInfo: bianGuaData ? {
      name: bianGuaData.name,
      number: bianGuaData.number,
      shang: bianGuaData.upperTrigram,
      xia: bianGuaData.lowerTrigram,
      guaCi: bianGuaData.guaci,
    } : undefined,
  };
}

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
    const { method, question, category } = req.body;

    if (!method || !question) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数: method 和 question',
      });
    }

    console.log(`📡 [Divination API] 收到占卜请求: ${method}`);

    const result = performLiuyaoDivination();

    return res.status(200).json({
      success: true,
      data: {
        result,
        log_id: `log_${Date.now()}`,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ [Divination API] 错误:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
