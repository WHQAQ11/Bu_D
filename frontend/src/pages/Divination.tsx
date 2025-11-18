import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Stars, MysticalAura } from "@/components/ui/TrigramSymbol";
import { ClassicTaiJi } from "@/components/ui/ClassicBagua";
import DivinationAnimation from "@/components/ui/DivinationAnimation";
import type { DivinationResult } from "@/types/divination";
import { DivinationService } from "@/services/divination";

interface QuestionCategory {
  id: string;
  name: string;
  icon: string;
  examples: string[];
  gradient: string;
}

interface DivinationMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  gradient: string;
  timeRequired: string;
  difficulty: "easy" | "medium" | "hard";
}

const Divination: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  // 状态管理
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);

  // ✨ 新增：保存真实占卜数据和加载状态
  const [isLoadingDivination, setIsLoadingDivination] = useState(false);
  const [realDivinationData, setRealDivinationData] = useState<any>(null);

  // 从URL参数获取预设的占卜方法
  useEffect(() => {
    const method = searchParams.get("method");
    if (method) {
      setSelectedMethod(method);
      setCurrentStep(2); // 直接跳到问题输入步骤
    }
  }, [searchParams]);

  // 问题分类 - 包含详细的输入提示
  interface CategoryWithPrompts extends QuestionCategory {
    prompts: string[];
    tips: string[];
  }

  const questionCategories: CategoryWithPrompts[] = [
    {
      id: "career",
      name: "事业发展",
      icon: "💼",
      examples: [],
      gradient: "from-blue-500 to-purple-600",
      prompts: [
        "您目前的职位和工作年限是多少？",
        "这个决定的紧迫程度如何？",
        "您的核心竞争力是什么？",
        "市场环境和行业前景如何？",
        "您的长期职业规划是什么？"
      ],
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
      examples: [],
      gradient: "from-pink-500 to-rose-600",
      prompts: [
        "您们认识多久了？目前的关系状态如何？",
        "对方对这段关系的态度如何？",
        "您最担心的是什么？",
        "您期望的发展方向是什么？",
        "是否有其他影响因素（家庭、工作等）？"
      ],
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
      examples: [],
      gradient: "from-green-500 to-teal-600",
      prompts: [
        "您目前的身体状况如何？有什么主要症状或困扰吗？",
        "您的生活方式如何？（作息、饮食、运动等）",
        "是否有既往病史或家族遗传因素？",
        "您的工作压力和心理状态如何？",
        "您对健康的期望和目标是什么？"
      ],
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
      examples: [],
      gradient: "from-yellow-500 to-orange-600",
      prompts: [
        "您目前的财务状况如何？（储蓄、负债、投资经验）",
        "这笔投资的金额占您总资产的比例是多少？",
        "您的风险承受能力如何？",
        "投资的时间周期是多久？",
        "您对这个投资领域的了解程度如何？"
      ],
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
      examples: [],
      gradient: "from-indigo-500 to-purple-600",
      prompts: [
        "您目前的学习阶段和成绩水平如何？",
        "这次考试对您有多重要？",
        "您的学习方法和复习进度如何？",
        "您在哪些科目或知识点上感到困难？",
        "您的心理状态和压力程度如何？"
      ],
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
      examples: [],
      gradient: "from-cyan-500 to-blue-600",
      prompts: [
        "这个问题涉及哪些家庭成员？他们的关系如何？",
        "问题的根源是什么？已经持续多久了？",
        "各方的期望和需求是什么？",
        "之前尝试过什么解决方法？效果如何？",
        "您最希望看到什么样的改变？"
      ],
      tips: [
        "👨‍👩‍👧‍👦 详细描述家庭成员和他们之间的关系",
        "👨‍👩‍👧‍👦 说明问题的具体表现和影响",
        "👨‍👩‍👧‍👦 表达您的感受和期望",
        "👨‍👩‍👧‍👦 提供相关的家庭背景信息"
      ]
    },
  ];

  // 占卜方法
  const divinationMethods: DivinationMethod[] = [
    {
      id: "liuyao",
      name: "六爻占卜",
      icon: "🔮",
      description: "传统六爻掷币占卜，细致入微，适合复杂问题",
      gradient: "from-mystical-purple to-mystical-indigo",
      timeRequired: "10-15分钟",
      difficulty: "medium",
    },
    // {
    //   id: "meihua",
    //   name: "梅花易数",
    //   icon: "✨",
    //   description: "快速数字起卦，简单直观，适合日常决策",
    //   gradient: "from-golden-400 to-golden-600",
    //   timeRequired: "3-5分钟",
    //   difficulty: "easy",
    // },
    // {
    //   id: "ai",
    //   name: "AI智能解卦",
    //   icon: "🧠",
    //   description: "结合传统智慧与AI技术，深度个性化分析",
    //   gradient: "from-mystical-teal to-mystical-rose",
    //   timeRequired: "5-8分钟",
    //   difficulty: "easy",
    // },
  ];

  // 处理分类选择
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentStep(2);
  };

  // 处理方法选择
  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setCurrentStep(3);
  };

  // 处理问题提交
  const handleQuestionSubmit = async () => {
    if (!question.trim() || !selectedMethod) return;

    // 注释掉登录检查，允许未登录用户进行占卜
    // if (!isAuthenticated) {
    //   navigate("/login", {
    //     state: {
    //       message: "请先登录后再进行占卜",
    //       redirectTo: `/divination?method=${selectedMethod}`,
    //       question: question.trim(),
    //     },
    //   });
    //   return;
    // }

    // ✨ 关键改变：先调用API获取真实卦象
    setIsLoadingDivination(true);

    try {
      console.log("📡 [Divination] 正在调用真实占卜API获取卦象...");
      const result = await DivinationService.performRealDivination(
        selectedMethod as "liuyao" | "meihua" | "ai",
        question.trim()
      );

      if (result.success && result.data?.result) {
        console.log("✅ [Divination] 获得真实卦象:", result.data.result);

        // 🔄 数据格式转换：后端的originalGua→benGuaInfo, changedGua→bianGuaInfo
        const divResult = result.data.result as DivinationResult;
        const transformedData = {
          ...result.data,
          result: divResult

































        };

        console.log("✅ [Divination] 转换后的数据:", transformedData.result.benGuaInfo);

        // 将转换后的真实占卜数据保存到状态
        setRealDivinationData({
          originalHexagram: divResult.originalHexagram,
          originalHexagramArray: divResult.originalHexagramArray,
          transformedHexagram: divResult.transformedHexagram,
          transformedHexagramArray: divResult.transformedHexagramArray,
          benGuaInfo: divResult.benGuaInfo,
          bianGuaInfo: divResult.bianGuaInfo,
          changingLineIndexes: divResult.changingLineIndexes || [],
        });

        // 现在再显示动画，动画会使用真实数据
        setShowAnimation(true);
        console.log("✅ [Divination] 动画已设置为显示");
      } else {
        const errorMsg = result.message || "获取占卜结果失败";
        console.error("❌ [Divination] API返回失败:", errorMsg);
        console.error("占卜错误:", errorMsg);
        alert("获取占卜结果失败，请重试");
      }
    } catch (error: any) {
      console.error("❌ [Divination] API调用异常:", error);
      const errorMsg = error.message || "网络连接失败，请检查网络后重试";
      console.error("占卜错误:", errorMsg);
      alert(errorMsg);
    } finally {
      setIsLoadingDivination(false);
    }
  };

  // 处理动画完成
  const handleAnimationComplete = async (result: DivinationResult) => {
    setShowAnimation(false);

    console.log("🎯 [Divination] 动画完成，收到结果:", result);

    // ✨ 改进：因为已经有真实数据，动画返回的就是真实结果
    const completeResultData = {
      method: result.method,
      question: result.question,
      category: result.category,
      originalHexagram: result.originalHexagram,
      transformedHexagram: result.transformedHexagram,
      changingLineIndexes: result.changingLineIndexes || [],
      benGuaInfo: result.benGuaInfo,
      bianGuaInfo: result.bianGuaInfo,
      isRealResult: true, // ✅ 始终标记为真实结果
    };

    console.log("🚀 [Divination] 传递真实结果到结果页面:", completeResultData);

    // 跳转到占卜结果页面
    navigate("/divination/result", {
      state: completeResultData,
    });
  };

  // 关闭动画
  const handleCloseAnimation = () => {
    setShowAnimation(false);
  };

  // 渲染步骤指示器
  const renderStepIndicator = () => (
    <div className="flex justify-center items-center space-x-4 mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
              step <= currentStep
                ? "bg-gradient-to-r from-mystical-purple to-mystical-indigo text-white shadow-glow"
                : "bg-midnight-700 text-midnight-400"
            }`}
          >
            {step < currentStep ? "✓" : step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 transition-all duration-300 ${
                step < currentStep
                  ? "bg-gradient-to-r from-mystical-purple to-mystical-indigo"
                  : "bg-midnight-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  // 渲染分类选择
  const renderCategorySelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-midnight-100 mb-4">
          选择问题类型
        </h2>
        <p className="text-midnight-300">
          选择最符合您问题的分类，有助于获得更准确的解读
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questionCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className="cursor-pointer group"
          >
            <MysticalAura
              className={`h-full bg-midnight-800/40 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 ${
                selectedCategory === category.id
                  ? "border-golden-400 shadow-glow-lg"
                  : "border-primary-500/20 hover:border-primary-500/40 transform hover:scale-105"
              }`}
            >
              <div className="text-center space-y-4">
                <div
                  className={`w-16 h-16 mx-auto bg-gradient-to-br ${category.gradient} rounded-full flex items-center justify-center text-3xl shadow-lg`}
                >
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-midnight-100">
                  {category.name}
                </h3>
                <div className="space-y-2">
                  {category.examples.slice(0, 2).map((example, index) => (
                    <p key={index} className="text-sm text-midnight-400 italic">
                      "{example}"
                    </p>
                  ))}
                </div>
              </div>
            </MysticalAura>
          </div>
        ))}
      </div>
    </div>
  );

  // 渲染方法选择
  const renderMethodSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-midnight-100 mb-4">
          选择占卜方法
        </h2>
        <p className="text-midnight-300">不同的方法适合不同的问题和需求</p>
      </div>

      <div className="flex justify-center max-w-5xl mx-auto">
        {divinationMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => handleMethodSelect(method.id)}
            className="cursor-pointer"
          >
            <MysticalAura
              className={`h-full bg-midnight-800/40 backdrop-blur-sm rounded-2xl p-8 border-2 transition-all duration-300 ${
                selectedMethod === method.id
                  ? "border-golden-400 shadow-glow-lg transform scale-105"
                  : "border-primary-500/20 hover:border-primary-500/40 transform hover:scale-102"
              }`}
            >
              <div className="text-center space-y-6">
                <div
                  className={`w-20 h-20 mx-auto bg-gradient-to-br ${method.gradient} rounded-full flex items-center justify-center text-4xl shadow-lg`}
                >
                  {method.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-midnight-100">
                    {method.name}
                  </h3>
                  <p className="text-midnight-300 leading-relaxed">
                    {method.description}
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-midnight-400">时间:</span>
                    <span className="text-golden-400 font-medium">
                      {method.timeRequired}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-midnight-400">难度:</span>
                    <div className="flex space-x-1">
                      {["easy", "medium", "hard"].map((level) => (
                        <div
                          key={level}
                          className={`w-2 h-2 rounded-full ${
                            method.difficulty === level
                              ? "bg-golden-400"
                              : "bg-midnight-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {selectedMethod === method.id && (
                  <div className="flex items-center justify-center text-golden-400">
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">已选择</span>
                  </div>
                )}
              </div>
            </MysticalAura>
          </div>
        ))}
      </div>
    </div>
  );

  // 渲染问题输入
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
                        <span className="text-lg">
                          {currentCategory?.icon}
                        </span>
                        <span className="text-sm text-midnight-200">
                          {currentCategory?.name}
                        </span>
                      </div>
                    )}
                    {selectedMethod && (
                      <div className="flex items-center space-x-2 px-4 py-2 bg-mystical-purple/20 rounded-full">
                        <span className="text-lg">
                          {
                            divinationMethods.find((m) => m.id === selectedMethod)
                              ?.icon
                          }
                        </span>
                        <span className="text-sm text-midnight-200">
                          {
                            divinationMethods.find((m) => m.id === selectedMethod)
                              ?.name
                          }
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* 问题输入框 */}
                <div className="space-y-4">
                  <label
                    htmlFor="question"
                    className="block text-lg font-medium text-midnight-100"
                  >
                    您的问题
                  </label>
                  <textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="请详细描述您想要占卜的问题，包括背景、现状和期望..."
                    className="w-full h-40 px-4 py-3 bg-midnight-900/50 border border-primary-500/30 rounded-xl text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-golden-400 focus:ring-2 focus:ring-golden-400/20 transition-all duration-300 resize-none"
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
                    disabled={!question.trim() || isLoadingDivination}
                    className="px-8 py-4 bg-gradient-to-r from-mystical-purple to-mystical-indigo text-white font-semibold rounded-full shadow-glow-lg hover:shadow-glow transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-3"
                  >
                    {isLoadingDivination ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>正在获取占卜数据...</span>
                      </>
                    ) : (
                      <>
                        <span>开始占卜</span>
                        <ClassicTaiJi size={20} className="animate-spin-slow" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </MysticalAura>
          </div>

          {/* 右侧：输入提示 */}
          {currentCategory && (
            <div className="space-y-6">
              {/* 需要的信息 */}
              <MysticalAura className="bg-mystical-purple/10 backdrop-blur-sm rounded-2xl p-6 border border-mystical-purple/30">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-midnight-100 flex items-center space-x-2">
                    <span>📋</span>
                    <span>需要的信息</span>
                  </h3>
                  <div className="space-y-3">
                    {currentCategory.prompts.map((prompt, index) => (
                      <div
                        key={index}
                        className="flex space-x-3 text-sm text-midnight-300"
                      >
                        <span className="text-golden-400 font-bold flex-shrink-0">
                          {index + 1}.
                        </span>
                        <span>{prompt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </MysticalAura>

              {/* 输入建议 */}
              <MysticalAura className="bg-mystical-teal/10 backdrop-blur-sm rounded-2xl p-6 border border-mystical-teal/30">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-midnight-100 flex items-center space-x-2">
                    <span>✨</span>
                    <span>输入建议</span>
                  </h3>
                  <div className="space-y-3">
                    {currentCategory.tips.map((tip, index) => (
                      <div
                        key={index}
                        className="flex space-x-3 text-sm text-midnight-300"
                      >
                        <span className="flex-shrink-0">{tip.split(" ")[0]}</span>
                        <span>{tip.split(" ").slice(1).join(" ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </MysticalAura>

              {/* 小算的提示 */}
              <MysticalAura className="bg-golden-400/10 backdrop-blur-sm rounded-2xl p-6 border border-golden-400/30">
                <div className="space-y-3">
                  <p className="text-sm text-midnight-200 leading-relaxed">
                    <span className="text-lg">✨</span> 亲爱的朋友，我是小算。详细的信息能帮助我给你更精准的解读。请不要担心表达不够完美，只需真诚地分享你的想法和困惑。
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

  return (
    <div className="min-h-screen bg-cosmic-gradient relative overflow-hidden">
      {/* 星空背景 */}
      <Stars count={40} />

      {/* 主要内容 */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* 步骤指示器 */}
        {renderStepIndicator()}

        {/* 根据当前步骤渲染不同内容 */}
        <div className="animate-fadeIn">
          {currentStep === 1 && renderCategorySelection()}
          {currentStep === 2 && renderMethodSelection()}
          {currentStep === 3 && renderQuestionInput()}
        </div>

        {/* 返回按钮 */}
        {currentStep > 1 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="text-midnight-400 hover:text-golden-400 transition-colors duration-300 flex items-center space-x-2 mx-auto"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>返回上一步</span>
            </button>
          </div>
        )}
      </div>

      {/* 占卜动画 */}
      {showAnimation && selectedMethod && realDivinationData && (
        <DivinationAnimation
          isOpen={showAnimation}
          onClose={handleCloseAnimation}
          onComplete={handleAnimationComplete}
          question={question.trim()}
          method={selectedMethod as "liuyao" | "meihua" | "ai"}
          category={selectedCategory || undefined}
          realDivinationData={realDivinationData} // ✨ 传递真实占卜数据
        />
      )}
    </div>
  );
};

export default Divination;
