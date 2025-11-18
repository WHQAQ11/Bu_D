/**
 * 后端类型定义
 */

export type DivinationMethod = 'liuyao' | 'meihua' | 'ai';

export interface DivinationRequest {
  method: DivinationMethod;
  question: string;
  category?: string;
}

export interface HexagramInfo {
  name: string;
  number: number;
  shang: string; // 上卦
  xia: string; // 下卦
  guaCi: string; // 卦辞
  yaoCI?: string; // 爻辞
  tuanCI?: string; // 彖辞
  xiangCI?: string; // 象辞
  changingYao?: number; // 动爻位置
  analysis?: string; // 分析
}

export interface DivinationResult {
  originalHexagram: string; // 本卦的十六进制表示
  transformedHexagram?: string; // 变卦的十六进制表示
  changingLineIndexes: number[]; // 动爻位置数组
  benGuaInfo: HexagramInfo; // 本卦详细信息
  bianGuaInfo?: HexagramInfo; // 变卦详细信息
}

export interface AIInterpretationRequest {
  method: DivinationMethod;
  question: string;
  hexagram_name: string;
  hexagram_info: {
    upperTrigram?: string;
    lowerTrigram?: string;
    guaci?: string;
    yaoci?: string[];
    interpretation?: string;
    [key: string]: any;
  };
  style?: 'traditional' | 'modern' | 'detailed' | 'concise';
  focus?: string;
  language?: 'chinese' | 'bilingual';
  category?: string;
}

export interface AIInterpretationResponse {
  success: boolean;
  interpretation?: string;
  data?: {
    ai_interpretation: string;
    model_used?: string;
    processing_time?: number;
    token_usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    follow_up_questions?: string[];
  };
  error?: string;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}
