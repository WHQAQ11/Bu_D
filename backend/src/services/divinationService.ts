/**
 * 占卜计算服务
 */

import { DivinationResult, HexagramInfo } from '../types/index.js';
import { getHexagramByNumber } from '../config/hexagrams.js';

export class DivinationService {
  /**
   * 执行占卜计算
   * 支持六爻、梅花易数等方法
   */
  static performDivination(
    method: 'liuyao' | 'meihua' | 'ai',
    question: string
  ): DivinationResult {
    console.log(`🎲 [DivinationService] 执行占卜: method=${method}, question=${question.substring(0, 30)}`);

    let result: DivinationResult;

    switch (method) {
      case 'liuyao':
        result = this.performLiuyaoDivination();
        break;
      case 'meihua':
        result = this.performMeihuaDivination();
        break;
      case 'ai':
        result = this.performAIDivination();
        break;
      default:
        result = this.performMeihuaDivination();
    }

    console.log(`✅ [DivinationService] 占卜完成:`, {
      benGua: result.benGuaInfo.name,
      bianGua: result.bianGuaInfo?.name,
      changingLines: result.changingLineIndexes,
    });

    return result;
  }

  /**
   * 六爻占卜
   * 模拟掷铜钱6次，每次产生一爻
   */
  private static performLiuyaoDivination(): DivinationResult {
    // 生成6条爻（从下到上）
    const yao: number[] = [];
    const changingLines: number[] = [];

    for (let i = 0; i < 6; i++) {
      const coin = Math.floor(Math.random() * 4); // 0-3
      // 0,1 = 阴爻(0), 2 = 阳爻(1), 3 = 动爻
      if (coin === 3) {
        yao.push(Math.random() > 0.5 ? 0 : 1);
        changingLines.push(i);
      } else {
        yao.push(coin > 1 ? 1 : 0);
      }
    }

    const originalHexagram = yao.join('');
    const benGuaNumber = this.hexagramStringToNumber(originalHexagram);
    const benGuaInfo = this.getHexagramInfo(benGuaNumber);

    // 如果有动爻，计算变卦
    let transformedHexagram: string | undefined;
    let bianGuaInfo: HexagramInfo | undefined;

    if (changingLines.length > 0) {
      const transformedYao = [...yao];
      changingLines.forEach((index) => {
        transformedYao[index] = transformedYao[index] === 0 ? 1 : 0;
      });
      transformedHexagram = transformedYao.join('');
      const bianGuaNumber = this.hexagramStringToNumber(transformedHexagram);
      bianGuaInfo = this.getHexagramInfo(bianGuaNumber);
    }

    return {
      originalHexagram,
      transformedHexagram,
      changingLineIndexes: changingLines,
      benGuaInfo,
      bianGuaInfo,
    };
  }

  /**
   * 梅花易数
   * 基于时间和数字的快速起卦
   */
  private static performMeihuaDivination(): DivinationResult {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();

    // 梅花易数计算方法
    const sum = year + month + day + hour;
    const upper = (sum % 8) || 8; // 上卦
    const lower = ((sum + hour) % 8) || 8; // 下卦
    const changing = ((sum + day) % 6) || 6; // 动爻

    // 八卦对应数字
    const trigrams = ['', '乾', '兑', '离', '震', '巽', '坎', '艮', '坤'];
    const upperTrigram = trigrams[upper];
    const lowerTrigram = trigrams[lower];

    // 根据上下卦计算卦号
    const benGuaNumber = (upper - 1) * 8 + lower;
    const benGuaInfo = this.getHexagramInfo(benGuaNumber);

    // 计算变卦
    const yao = Array(6).fill(0);
    yao[changing - 1] = 1;
    const transformedYao = [...yao];
    transformedYao[changing - 1] = 0;

    const transformedHexagram = transformedYao.join('');
    const bianGuaNumber = this.hexagramStringToNumber(transformedHexagram);
    const bianGuaInfo = this.getHexagramInfo(bianGuaNumber);

    return {
      originalHexagram: benGuaNumber.toString().padStart(2, '0'),
      transformedHexagram: bianGuaNumber.toString().padStart(2, '0'),
      changingLineIndexes: [changing - 1],
      benGuaInfo,
      bianGuaInfo,
    };
  }

  /**
   * AI占卜（随机生成）
   */
  private static performAIDivination(): DivinationResult {
    // 随机选择一个卦象
    const benGuaNumber = Math.floor(Math.random() * 64) + 1;
    const bianGuaNumber = Math.floor(Math.random() * 64) + 1;
    const changingLine = Math.floor(Math.random() * 6);

    const benGuaInfo = this.getHexagramInfo(benGuaNumber);
    const bianGuaInfo = this.getHexagramInfo(bianGuaNumber);

    return {
      originalHexagram: benGuaNumber.toString().padStart(2, '0'),
      transformedHexagram: bianGuaNumber.toString().padStart(2, '0'),
      changingLineIndexes: [changingLine],
      benGuaInfo,
      bianGuaInfo,
    };
  }

  /**
   * 获取卦象信息
   */
  private static getHexagramInfo(number: number): HexagramInfo {
    const hexagram = getHexagramByNumber(number);

    if (!hexagram) {
      return {
        name: '未知卦',
        number: 0,
        shang: '乾',
        xia: '乾',
        guaCi: '卦象信息暂未找到',
      };
    }

    return {
      name: hexagram.name,
      number: hexagram.number,
      shang: hexagram.upperTrigram,
      xia: hexagram.lowerTrigram,
      guaCi: hexagram.guaci,
      tuanCI: hexagram.tuanCI,
      xiangCI: hexagram.xiangCI,
    };
  }

  /**
   * 将卦象字符串转换为卦号
   * 例如: "111111" -> 1 (乾卦)
   */
  private static hexagramStringToNumber(hexStr: string): number {
    // 简化版本：直接返回随机卦号
    // 实际应该根据八卦对应关系计算
    return Math.floor(Math.random() * 64) + 1;
  }
}
