// 优化后的占卜页面 - 核心改进说明
// 
// 主要优化：
// 1. 移除了预先调用API的逻辑
// 2. 简化了状态管理（移除realDivinationData和isLoadingDivination）
// 3. 动画过程中实时生成卦象，展示真实的占卜过程
// 4. 优化了输入提示，根据分类动态显示占位符
//
// 使用方法：
// 1. 备份当前的 Divination.tsx
// 2. 将此文件重命名为 Divination.tsx
// 3. 测试占卜流程

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Stars, MysticalAura } from "@/components/ui/TrigramSymbol";
import { ClassicTaiJi } from "@/components/ui/ClassicBagua";
import DivinationAnimation from "@/components/ui/DivinationAnimation";
import type { DivinationResult } from "@/types/divination";

// ... 接口定义保持不变 ...
interface QuestionCategory {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  tips: string[];
  placeholder: string; // 新增：动态占位符
}

const Divination: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 简化后的状态管理
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);

  // 问题分类 - 添加动态占位符
  const questionCategories: QuestionCategory[] = [
    {
      id: "career",
      name: "事业发展",
      icon: "💼",
      gradient: "from-blue-500 to-purple-600",
      placeholder: "例如：我目前在一家互联网公司担任产品经理已3年，最近收到了另一家公司的offer，薪资提升30%但需要换城市。我很纠结是否应该跳槽，希望了解这个决定对我未来发展的影响...",
      tips: [
        "💡 详细描述您的工作现状和面临的具体问题",
        "💡 说明您最关心的是升职、跳槽还是其他方面",
        "💡 提供相关的背景信息，如行业、公司规模等",
        "💡 表达您的期望和目标"
      ]
    },
    {
      id: "relationship",
      name: "感情婚姻",
      icon: "💕",
      gradient: "from-pink-500 to-rose-600",
      placeholder: "例如：我和男/女朋友交往2年了，感情一直很好，但最近因为工作压力大，我们经常因为小事争吵。我很担心这段关系会不会走到尽头，想知道我们的未来会怎样...",
      tips: [
        "💕 真诚表达您的感受和困惑",
        "💕 描述您们之间的互动和沟通方式",
        "💕 说明您最希望看到什么样的结果",
        "💕 提供相关的背景信息，如年龄、婚姻状态等"
      ]
    },
    {
      id: "health",
      name: "健康养生",
      icon: "🏥",
      gradient: "from-green-500 to-teal-600",
      placeholder: "例如：最近半年我经常感到疲劳，睡眠质量也不好，工作压力很大。体检报告显示一切正常，但我总觉得身体状态不如从前。想了解如何调理身体，恢复健康状态...",
      tips: [
        "🏥 详细描述您的身体状况和症状",
        "🏥 说明您的生活习惯和作息规律",
        "🏥 提供医学背景信息（如有）",
        "🏥 表达您对健康的期望和改善方向"
      ]
    },
    {
      id: "wealth",
      name: "财运投资",
      icon: "💰",
      gradient: "from-yellow-500 to-orange-600",
      placeholder: "例如：我手上有20万积蓄，朋友邀请我投资他的创业项目，预计回报率很高但也有风险。我不确定是否应该投资，还是继续稳健理财。希望了解这个投资决策的前景...",
      tips: [
        "💰 说明您的财务基础和投资经验",
        "💰 描述具体的投资项目或财务决策",
        "💰 表达您的风险偏好和期望收益",
        "💰 提供相关的市场信息和背景"
      ]
    },
    {
      id: "study",
      name: "学业考试",
      icon: "📚",
      gradient: "from-indigo-500 to-purple-600",
      placeholder: "例如：我正在准备研究生考试，还有3个月就要考试了，但复习进度不理想，数学和英语是我的弱项。我很担心能否考上理想的学校，想了解我的考试运势如何...",
      tips: [
        "📚 说明您的学习阶段和目标",
        "📚 描述您面临的具体学习困难",
        "📚 表达您对考试的期望和目标",
        "📚 提供您的学习进度和准备情况"
      ]
    },
    {
      id: "family",
      name: "家庭亲情",
      icon: "👨‍👩‍👧‍👦",
      gradient: "from-cyan-500 to-blue-600",
      placeholder: "例如：我和父母因为工作选择产生了分歧，他们希望我回老家发展，但我想留在大城市打拼。这个矛盾已经持续了半年，家庭氛围很紧张。我该如何处理这个问题...",
      tips: [
        "👨‍👩‍👧‍👦 详细描述家庭成员和他们之间的关系",
        "👨‍👩‍👧‍👦 说明问题的具体表现和影响",
        "👨‍👩‍👧‍👦 表达您的感受和期望",
        "👨‍👩‍👧‍👦 提供相关的家庭背景信息"
      ]
    },
  ];

  // 占卜方法
  const divinationMethods = [
    {
      id: "liuyao",
      name: "六爻占卜",
      icon: "🔮",
      description: "传统六爻掷币占卜，细致入微，适合复杂问题",
      gradient: "from-mystical-purple to-mystical-indigo",
      timeRequired: "10-15分钟",
      difficulty: "medium" as const,
    },
  ];

  // 处理问题提交 - 优化：直接进入动画
  const handleQuestionSubmit = () => {
    if (!question.trim() || !selectedMethod) return;
    
    // 直接显示动画，动画过程中会实时生成卦象
    // 这样动画展示的就是真实的占卜过程
    setShowAnimation(true);
  };

  // 处理动画完成
  const handleAnimationComplete = (result: DivinationResult) => {
    setShowAnimation(false);

    // 跳转到占卜结果页面
    navigate("/divination/result", {
      state: {
        method: result.method,
        question: result.question,
        category: result.category,
        originalHexagram: result.originalHexagram,
        transformedHexagram: result.transformedHexagram,
        changingLineIndexes: result.changingLineIndexes || [],
        benGuaInfo: result.benGuaInfo,
        bianGuaInfo: result.bianGuaInfo,
      },
    });
  };

  // 获取当前分类的占位符
  const getCurrentPlaceholder = () => {
    const category = questionCategories.find(c => c.id === selectedCategory);
    return category?.placeholder || "请详细描述您想要占卜的问题，包括背景、现状和期望...";
  };

  // 渲染问题输入 - 优化版
  const renderQuestionInput = () => {
    const currentCategory = questionCategories.find(
      (c) => c.id === selectedCategory
    );

    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-midnight-100 mb-4">
            请详细描述您的问题
          </h2>
          <p className="text-midnight-300">
            越详细的信息，越能获得精准的解读。小算会用心为您分析。✨
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左侧：输入框 */}
          <div className="lg:col-span-2 space-y-6">
            <MysticalAura className="bg-midnight-800/40 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/20">
              <div className="space-y-6">
                {/* 选中的信息展示 */}
                {(selectedCategory || selectedMethod) && (
                  <div className="flex flex-wrap gap-3 pb-6 border-b border-midnight-700">
                    {selectedCategory && (
                      <div className="flex items-center space-x-2 px-4 py-2 bg-primary-500/20 rounded-full">
                        <span className="text-lg">{currentCategory?.icon}</span>
                        <span className="text-sm text-midnight-200">{currentCategory?.name}</span>
                      </div>
                    )}
                    {selectedMethod && (
                      <div className="flex items-center space-x-2 px-4 py-2 bg-mystical-purple/20 rounded-full">
                        <span className="text-lg">🔮</span>
                        <span className="text-sm text-midnight-200">六爻占卜</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 问题输入框 - 使用动态占位符 */}
                <div className="space-y-4">
                  <label htmlFor="question" className="block text-lg font-medium text-midnight-100">
                    您的问题
                  </label>
                  <textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={getCurrentPlaceholder()}
                    className="w-full h-48 px-4 py-3 bg-midnight-900/50 border border-primary-500/30 rounded-xl text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-golden-400 focus:ring-2 focus:ring-golden-400/20 transition-all duration-300 resize-none text-sm leading-relaxed"
                    maxLength={500}
                  />
                  <div className="text-right">
                    <span className="text-sm text-midnight-400">
                      {question.length}/500
                    </span>
                  </div>
                </div>

                {/* 提交按钮 */}
                <div className="flex justify-center pt-6">
                  <button
                    onClick={handleQuestionSubmit}
                    disabled={!question.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-mystical-purple to-mystical-indigo text-white font-semibold rounded-full shadow-glow-lg hover:shadow-glow transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-3"
                  >
                    <span>开始占卜</span>
                    <ClassicTaiJi size={20} className="animate-spin-slow" />
                  </button>
                </div>
              </div>
            </MysticalAura>
          </div>

          {/* 右侧：输入提示 */}
          {currentCategory && (
            <div className="space-y-6">
              {/* 输入建议 */}
              <MysticalAura className="bg-mystical-teal/10 backdrop-blur-sm rounded-2xl p-6 border border-mystical-teal/30">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-midnight-100 flex items-center space-x-2">
                    <span>✨</span>
                    <span>输入建议</span>
                  </h3>
                  <div className="space-y-3">
                    {currentCategory.tips.map((tip, index) => (
                      <div key={index} className="flex space-x-3 text-sm text-midnight-300">
                        <span className="flex-shrink-0">{tip.split(" ")[0]}</span>
                        <span>{tip.split(" ").slice(1).join(" ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </MysticalAura>

              {/* 小算的鼓励 - 优化版 */}
              <MysticalAura className="bg-golden-400/10 backdrop-blur-sm rounded-2xl p-6 border border-golden-400/30">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">✨</span>
                    <span className="text-lg font-bold text-golden-400">小算的话</span>
                  </div>
                  <p className="text-sm text-midnight-200 leading-relaxed">
                    亲爱的朋友，我是小算。如果能告诉我您的<span className="text-golden-400 font-medium">具体情况</span>、
                    <span className="text-golden-400 font-medium">面临的选择</span>和
                    <span className="text-golden-400 font-medium">期望的结果</span>，
                    我能给您更精准的指引哦~ 请不要担心表达不够完美，只需真诚地分享您的想法和困惑。💫
                  </p>
                </div>
              </MysticalAura>
            </div>
          )}
        </div>

        {/* 占卜须知 */}
        <div className="text-center space-y-2 text-sm text-midnight-400">
          <p>💫 占卜前请保持内心平静，专注思考您的问题</p>
          <p>💫 占卜结果仅供参考，重要决策请理性思考</p>
        </div>
      </div>
    );
  };

  // ... 其他渲染函数保持不变 ...

  return (
    <div className="min-h-screen bg-cosmic-gradient relative overflow-hidden">
      <Stars count={40} />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* 步骤指示器等UI保持不变 */}
        {/* ... */}
        
        {currentStep === 3 && renderQuestionInput()}
      </div>

      {/* 占卜动画 - 不再传递realDivinationData */}
      {showAnimation && selectedMethod && (
        <DivinationAnimation
          isOpen={showAnimation}
          onClose={() => setShowAnimation(false)}
          onComplete={handleAnimationComplete}
          question={question.trim()}
          method={selectedMethod as "liuyao" | "meihua" | "ai"}
          category={selectedCategory || undefined}
        />
      )}
    </div>
  );
};

export default Divination;
