// 优化后的占卜结果页面
//
// 主要优化：
// 1. 自动加载AI解读（无需手动点击）
// 2. 优化信息展示层次
// 3. 添加阅读进度提示
// 4. 改进加载状态提示
//
// 使用方法：
// 1. 备份当前的 DivinationResult.tsx
// 2. 将此文件重命名为 DivinationResult.tsx
// 3. 测试结果展示流程

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Stars, MysticalAura } from "@/components/ui/TrigramSymbol";
import { ClassicBaguaDiagram } from "@/components/ui/ClassicBagua";
import { DivinationService } from "@/services/divination";
import type { DivinationResult, AIInterpretationRequest } from "@/types/divination";

const DivinationResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [isGettingAIInterpretation, setIsGettingAIInterpretation] = useState(false);
  const [aiInterpretationError, setAIInterpretationError] = useState<string | null>(null);

  // 从路由状态获取占卜信息
  const { method, question, category, benGuaInfo, bianGuaInfo } = location.state || {};

  // 初始化结果数据
  useEffect(() => {
    if (!method || !question) {
      navigate("/divination");
      return;
    }

    if (benGuaInfo) {
      setResult({
        method,
        question,
        category,
        originalHexagram: '',
        changingLineIndexes: [],
        benGuaInfo,
        bianGuaInfo,
        timestamp: new Date().toISOString(),
      });
    }
  }, [method, question, category, benGuaInfo, bianGuaInfo, navigate]);

  // 自动获取AI解读 - 核心优化
  useEffect(() => {
    if (result && !result.aiInterpretation && !isGettingAIInterpretation && !aiInterpretationError) {
      // 延迟1秒后自动开始AI解读，让用户先看到卦象
      const timer = setTimeout(() => {
        getAIInterpretation();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [result]);

  // 获取AI解读
  const getAIInterpretation = async () => {
    if (!result) return;

    setIsGettingAIInterpretation(true);
    setAIInterpretationError(null);

    try {
      const hexagramName = result.benGuaInfo?.name;
      const upperTrigram = result.benGuaInfo?.shang;
      const lowerTrigram = result.benGuaInfo?.xia;
      const guaci = result.benGuaInfo?.guaCi;
      const yaoci = result.benGuaInfo?.yaoCI;
      const shiyi = result.benGuaInfo?.tuanCI;
      const analysis = result.benGuaInfo?.analysis;

      const requestData: AIInterpretationRequest = {
        method: result.method,
        question: result.question,
        hexagram_name: hexagramName || '未知卦',
        hexagram_info: {
          upperTrigram: upperTrigram || '乾',
          lowerTrigram: lowerTrigram || '乾',
          changingYao: result.benGuaInfo?.changingYao,
          guaci: guaci || '元亨利贞',
          yaoci: Array.isArray(yaoci) ? yaoci : yaoci ? [yaoci] : undefined,
          interpretation: shiyi || analysis || '占卜解读',
        },
        focus: result.category as any || 'general',
        style: 'detailed',
        language: 'chinese',
        log_id: `temp_${Date.now()}`,
        category: result.category,
      };

      const response = await DivinationService.getAIInterpretation(requestData);

      if (response.success && response.data?.ai_interpretation) {
        let fullInterpretation = response.data.ai_interpretation;
        
        if (response.data.follow_up_questions && Array.isArray(response.data.follow_up_questions)) {
          fullInterpretation += '\n\n---\n\n💭 **如果您能补充以下信息，我可以提供更深入的解读：**\n';
          response.data.follow_up_questions.forEach((q: string, index: number) => {
            fullInterpretation += `\n${index + 1}. ${q}`;
          });
        }
        
        setResult({ ...result, aiInterpretation: fullInterpretation });
      } else {
        throw new Error(response.message || "AI解析失败");
      }
    } catch (error: any) {
      console.error("获取AI解读失败:", error);
      setAIInterpretationError(error.message || "AI解析暂时不可用，请稍后重试");
    } finally {
      setIsGettingAIInterpretation(false);
    }
  };

  // 获取分类名称
  const getCategoryName = (categoryId?: string): string => {
    const categories: { [key: string]: string } = {
      career: "事业发展",
      relationship: "感情婚姻",
      health: "健康养生",
      wealth: "财运投资",
      study: "学业考试",
      family: "家庭亲情",
    };
    return categories[categoryId || ""] || "生活问题";
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-cosmic-gradient relative overflow-hidden">
        <Stars count={30} />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <ClassicBaguaDiagram size="md" className="animate-spin-slow mx-auto" />
            <h2 className="text-2xl font-bold text-midnight-100">正在加载结果...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-gradient relative overflow-hidden">
      <Stars count={40} />

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* 头部信息 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-golden-400 to-golden-600 bg-clip-text text-transparent mb-4">
            占卜结果
          </h1>
          <div className="flex items-center justify-center space-x-6 text-midnight-300">
            <span className="flex items-center space-x-2">
              <span>🔮</span>
              <span>六爻占卜</span>
            </span>
            <span className="flex items-center space-x-2">
              <span>📅</span>
              <span>{new Date(result.timestamp).toLocaleDateString("zh-CN")}</span>
            </span>
          </div>
        </div>

        {/* 阅读进度提示 - 新增 */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400">卦象</span>
            </div>
            <div className="w-12 h-px bg-midnight-700"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400">传统解读</span>
            </div>
            <div className="w-12 h-px bg-midnight-700"></div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${result.aiInterpretation ? 'bg-green-400' : isGettingAIInterpretation ? 'bg-yellow-400 animate-pulse' : 'bg-midnight-600'}`}></div>
              <span className={result.aiInterpretation ? 'text-green-400' : isGettingAIInterpretation ? 'text-yellow-400' : 'text-midnight-400'}>
                AI解读
              </span>
            </div>
          </div>
        </div>

        {/* 问题显示 */}
        <div className="max-w-4xl mx-auto mb-8">
          <MysticalAura className="bg-midnight-800/40 backdrop-blur-sm rounded-2xl p-6 border border-primary-500/20">
            <div className="text-center space-y-3">
              <p className="text-sm text-midnight-400">您的问题</p>
              <p className="text-xl text-midnight-100 font-medium">"{result.question}"</p>
              {category && (
                <p className="text-sm text-golden-400">{getCategoryName(category)}</p>
              )}
            </div>
          </MysticalAura>
        </div>

        {/* 卦象展示 */}
        <div className="max-w-4xl mx-auto mb-8">
          <MysticalAura className="bg-gradient-to-br from-mystical-purple/20 to-mystical-indigo/20 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/30">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* 左侧：卦象符号 */}
              <div className="text-center space-y-6">
                <div className="relative">
                  <ClassicBaguaDiagram size="sm" className="mx-auto animate-spin-slow" />
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-midnight-900/80 px-4 py-2 rounded-full border border-golden-400/30">
                      <span className="text-golden-400 font-bold text-xl">
                        {result.benGuaInfo?.name}卦
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-midnight-300">第 {result.benGuaInfo?.number} 卦</p>
                  <div className="flex justify-center items-center space-x-4 text-2xl">
                    <span>{result.benGuaInfo?.shang}</span>
                    <span className="text-midnight-500">上</span>
                    <span className="text-midnight-500">下</span>
                    <span>{result.benGuaInfo?.xia}</span>
                  </div>
                  {result.benGuaInfo?.changingYao && (
                    <p className="text-golden-400">第 {result.benGuaInfo?.changingYao} 爻动</p>
                  )}
                </div>
              </div>

              {/* 右侧：卦辞解读 */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-midnight-100 mb-3">卦辞</h3>
                  <p className="text-lg text-midnight-200 leading-relaxed font-serif">
                    {result.benGuaInfo?.guaCi}
                  </p>
                </div>

                {result.benGuaInfo?.yaoCI && (
                  <div>
                    <h4 className="text-lg font-semibold text-midnight-100 mb-2">爻辞</h4>
                    <p className="text-midnight-200 leading-relaxed">
                      {typeof result.benGuaInfo?.yaoCI === 'string'
                        ? result.benGuaInfo?.yaoCI
                        : result.benGuaInfo?.yaoCI?.[0]}
                    </p>
                  </div>
                )}

                {result.benGuaInfo?.tuanCI && (
                  <div>
                    <h4 className="text-lg font-semibold text-midnight-100 mb-2">彖辞</h4>
                    <p className="text-midnight-200 leading-relaxed">
                      {result.benGuaInfo?.tuanCI}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </MysticalAura>
        </div>

        {/* AI解读区域 - 优化版 */}
        <div className="max-w-4xl mx-auto mb-8">
          {isGettingAIInterpretation && (
            <MysticalAura className="bg-gradient-to-br from-mystical-teal/10 to-mystical-rose/10 backdrop-blur-sm rounded-2xl p-8 border border-mystical-teal/30">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-8 h-8 border-3 border-mystical-teal/30 border-t-mystical-teal rounded-full animate-spin"></div>
                  <span className="text-xl font-bold text-midnight-100">AI正在为您深度解读...</span>
                </div>
                <p className="text-midnight-300">
                  小算正在结合传统智慧与现代AI技术，为您提供个性化的解读
                </p>
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-mystical-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-mystical-teal rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 bg-mystical-teal rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            </MysticalAura>
          )}

          {aiInterpretationError && !result.aiInterpretation && (
            <MysticalAura className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30">
              <div className="text-center space-y-4">
                <div className="text-4xl">⚠️</div>
                <h3 className="text-xl font-bold text-red-400">AI解读暂时不可用</h3>
                <p className="text-midnight-300">{aiInterpretationError}</p>
                <button
                  onClick={getAIInterpretation}
                  className="px-6 py-3 bg-gradient-to-r from-mystical-teal to-mystical-rose text-white rounded-full font-medium hover:shadow-glow transition-all duration-300"
                >
                  重试
                </button>
              </div>
            </MysticalAura>
          )}

          {result.aiInterpretation && (
            <MysticalAura className="bg-gradient-to-br from-mystical-teal/10 to-mystical-rose/10 backdrop-blur-sm rounded-2xl p-8 border border-mystical-teal/30 animate-fadeIn">
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">🤖</span>
                  <h3 className="text-2xl font-bold text-midnight-100">AI智能解读</h3>
                  <span className="px-3 py-1 bg-mystical-teal/20 text-mystical-teal rounded-full text-sm font-medium">
                    已完成
                  </span>
                </div>
                <div className="prose prose-invert max-w-none">
                  <div className="text-midnight-200 leading-relaxed whitespace-pre-line">
                    {result.aiInterpretation}
                  </div>
                </div>
              </div>
            </MysticalAura>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => navigate("/divination")}
              className="px-6 py-3 bg-gradient-to-r from-mystical-purple to-mystical-indigo text-white rounded-full font-medium shadow-glow hover:shadow-glow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>再次占卜</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-midnight-700 hover:bg-midnight-600 text-midnight-100 rounded-full font-medium transition-colors duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>分享结果</span>
            </button>
          </div>
        </div>

        {/* 免责声明 */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="text-center space-y-2 text-sm text-midnight-400">
            <p>占卜结果仅供参考，不构成任何决策建议</p>
            <p>重要决策请理性思考，结合实际情况做出判断</p>
            <p>保持积极心态，相信自己的判断能力</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DivinationResult;
