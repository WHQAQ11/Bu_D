import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TaiJi,
  BaGua,
  Stars,
  MysticalAura,
  SmallBaguaIcon,
} from "@/components/ui/TrigramSymbol";
import { ClassicBaguaDiagram } from "@/components/ui/ClassicBagua";

const Home: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  // 六爻占卜特色
  const liuyaoFeatures = [
    {
      icon: "📖",
      title: "传统正宗",
      description: "遵循古法，源自《周易》，代代相传的智慧结晶",
    },
    {
      icon: "🔍",
      title: "细致入微",
      description: "六爻成卦，层层递进，洞察事物的深层本质",
    },
    {
      icon: "⏰",
      title: "时机把握",
      description: "动爻变爻，时空交织，把握最佳决策时机",
    },
  ];

  // 用户评价数据
  const testimonials = [
    {
      name: "李明",
      role: "创业者",
      content:
        "通过六爻占卜，我在关键时刻做出了正确的商业决策，避免了重大损失。",
      rating: 5,
      method: "六爻占卜",
    },
    {
      name: "王晓华",
      role: "设计师",
      content: "梅花易数帮我快速理清了职业发展方向的困惑，现在工作更有动力了。",
      rating: 5,
      method: "梅花易数",
    },
    {
      name: "张静",
      role: "教师",
      content: "AI解卦的分析非常深入，给出的建议既传统又现代，很有指导意义。",
      rating: 5,
      method: "AI解卦",
    },
  ];

  // 今日运势推荐 - 根据日期动态生成
  const generateDailyFortune = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const seed = dayOfYear; // 使用日期作为种子，确保同一天显示相同内容

    // 运势文案库
    const fortunes = [
      "今天适合进行重要的决策和规划，贵人运旺盛，宜积极进取。",
      "静观其变，顺势而为。今日宜休养生息，积蓄力量。",
      "机遇与挑战并存，需要谨慎应对。保持警觉，把握时机。",
      "人和运势俱佳，适合开展新的合作项目。团队协作效果显著。",
      "内心平和，外物不扰。今日宜修身养性，反思总结。",
      "运势上升，诸事顺利。宜主动出击，把握机遇。",
      "需要耐心等待，不可急功近利。稳步前行，方能成功。",
      "创意迸发，灵感充足。适合进行创意工作和学习。",
    ];

    // 幸运数字库
    const luckyNumberSets = [
      [3, 8, 21],
      [1, 6, 9],
      [2, 7, 15],
      [5, 10, 18],
      [4, 12, 20],
      [6, 11, 19],
      [8, 13, 22],
      [3, 9, 17],
    ];

    // 幸运色库
    const luckyColors = ["紫", "金", "青", "红", "白", "黑", "绿", "蓝"];

    // 根据种子选择
    const fortuneIndex = seed % fortunes.length;
    const numberIndex = seed % luckyNumberSets.length;
    const colorIndex = seed % luckyColors.length;

    return {
      date: today.toLocaleDateString("zh-CN", {
        month: "long",
        day: "numeric",
      }),
      luckyNumbers: luckyNumberSets[numberIndex],
      luckyColor: luckyColors[colorIndex],
      fortune: fortunes[fortuneIndex],
    };
  };

  const dailyFortune = generateDailyFortune();

  // 轮播逻辑
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // 滚动监听 - 触发元素进入动画
  useEffect(() => {
    // 初始化 header 为可见
    setVisibleSections(new Set(["header"]));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section-id");
            if (id) {
              setVisibleSections((prev) => new Set([...prev, id]));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[data-section-id]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-cosmic-gradient relative overflow-hidden">
      {/* 星空背景 */}
      <Stars count={50} />

      {/* 主要内容 */}
      <div className="relative z-10 container mx-auto px-4 py-16 min-h-screen flex flex-col justify-center">
        <div className="text-center space-y-8">
          {/* 太极图和标题组合 */}
          <MysticalAura
            className="inline-block transform transition-all duration-700"
            style={{
              opacity: visibleSections.has("header") ? 1 : 0,
              transform: visibleSections.has("header")
                ? "scale(1) translateY(0)"
                : "scale(0.9) translateY(-20px)",
            }}
          >
            <div className="flex flex-col items-center space-y-6">
              <ClassicBaguaDiagram size="md" className="mx-auto" />

              <div className="space-y-2">
                <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-golden-400 via-golden-500 to-golden-600 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                  每日一卦
                </h1>
                <div className="flex justify-center space-x-4">
                  {(() => {
                    const trigrams = ["乾", "坤", "震", "巽", "坎", "离", "艮", "兑"];
                    const today = new Date();
                    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
                    const selectedTrigrams = [
                      trigrams[dayOfYear % trigrams.length],
                      trigrams[(dayOfYear + 1) % trigrams.length],
                      trigrams[(dayOfYear + 2) % trigrams.length],
                    ];
                    return selectedTrigrams.map((trigram, index) => (
                      <BaGua key={index} trigram={trigram} size="sm" className="text-golden-400" />
                    ));
                  })()}
                </div>
              </div>
            </div>
          </MysticalAura>

          {/* 副标题 */}
          <div
            className="max-w-3xl mx-auto space-y-4 transform transition-all duration-700"
            style={{
              opacity: visibleSections.has("header") ? 1 : 0,
              transform: visibleSections.has("header")
                ? "translateY(0)"
                : "translateY(10px)",
              transitionDelay: "150ms",
            }}
          >
            <p className="text-xl md:text-2xl text-midnight-100 font-light leading-relaxed">
              融合中华古老智慧与现代AI技术
            </p>
            <p className="text-lg text-midnight-200 font-serif italic">
              为您的人生指点迷津，探索命运的奥秘
            </p>
          </div>

          {/* 主要行动按钮 */}
          <div
            className="pt-8 transform transition-all duration-700"
            style={{
              opacity: visibleSections.has("header") ? 1 : 0,
              transform: visibleSections.has("header")
                ? "translateY(0)"
                : "translateY(10px)",
              transitionDelay: "300ms",
            }}
          >
            <Link
              to="/divination"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`
                inline-flex items-center space-x-3 px-8 py-4 text-lg font-semibold
                bg-gradient-to-r from-mystical-purple to-mystical-indigo
                text-white rounded-full
                shadow-gold-lg hover:shadow-glow
                transform transition-all duration-500
                ${isHovered ? "scale-105 -translate-y-1" : "scale-100"}
                animate-float
              `}
            >
              <span>聆听古老的智慧</span>
              <SmallBaguaIcon className={isHovered ? "animate-spin" : ""} />
            </Link>
          </div>

          {/* 今日运势推荐 */}
          <div
            className="max-w-2xl mx-auto pt-12 transform transition-all duration-700"
            data-section-id="daily-fortune"
            style={{
              opacity: visibleSections.has("daily-fortune") ? 1 : 0,
              transform: visibleSections.has("daily-fortune")
                ? "translateY(0)"
                : "translateY(20px)",
            }}
          >
            <MysticalAura className="bg-gradient-to-r from-mystical-purple/20 to-mystical-indigo/20 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/30 hover:border-primary-500/50 hover:shadow-glow-lg transition-all duration-300">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">📅</span>
                  <h3 className="text-2xl font-bold text-golden-400">今日运势</h3>
                </div>
                <p className="text-sm text-midnight-300">{dailyFortune.date}</p>
                <p className="text-lg text-midnight-100 leading-relaxed">
                  {dailyFortune.fortune}
                </p>
                <div className="flex justify-center items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-midnight-400">幸运数字:</span>
                    <div className="flex space-x-1">
                      {dailyFortune.luckyNumbers.map((num, index) => (
                        <span
                          key={index}
                          className="w-6 h-6 bg-golden-400/20 text-golden-400 rounded-full flex items-center justify-center text-xs font-semibold"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-midnight-400">幸运色:</span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold">
                      {dailyFortune.luckyColor}
                    </span>
                  </div>
                </div>
              </div>
            </MysticalAura>
          </div>

          {/* 六爻占卜特色介绍 */}
          <div
            className="max-w-5xl mx-auto pt-16"
            data-section-id="liuyao-features"
          >
            <h2 className="text-3xl font-bold text-center text-midnight-100 mb-12">
              六爻占卜的魅力
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {liuyaoFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`transform transition-all duration-700 ${
                    visibleSections.has("liuyao-features")
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    transitionDelay: `${index * 150}ms`,
                  }}
                >
                  <MysticalAura className="h-full bg-midnight-800/40 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/20 hover:border-primary-500/40 transition-all duration-300 group hover:shadow-glow-lg hover:-translate-y-2">
                    <div className="text-center space-y-4">
                      {/* 图标 */}
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-mystical-purple to-mystical-indigo rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl">{feature.icon}</span>
                      </div>

                      {/* 标题 */}
                      <h3 className="text-xl font-bold text-midnight-100 group-hover:text-golden-400 transition-colors duration-300">
                        {feature.title}
                      </h3>

                      {/* 描述 */}
                      <p className="text-midnight-300 leading-relaxed text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </MysticalAura>
                </div>
              ))}
            </div>
          </div>

          {/* 用户评价轮播 */}
          <div
            className="pt-20 max-w-4xl mx-auto transform transition-all duration-700"
            data-section-id="testimonials"
            style={{
              opacity: visibleSections.has("testimonials") ? 1 : 0,
              transform: visibleSections.has("testimonials")
                ? "translateY(0)"
                : "translateY(20px)",
            }}
          >
            <h2 className="text-3xl font-bold text-center text-midnight-100 mb-12">
              用户见证
            </h2>
            <div className="relative">
              <MysticalAura className="bg-midnight-800/30 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/20 hover:border-primary-500/40 hover:shadow-glow-lg transition-all duration-300">
                <div className="text-center space-y-6">
                  {/* 评分显示 */}
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className="w-6 h-6 text-golden-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* 评价内容 */}
                  <blockquote className="text-lg text-midnight-100 leading-relaxed italic">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>

                  {/* 用户信息 */}
                  <div className="space-y-2">
                    <p className="font-semibold text-midnight-100">
                      {testimonials[currentTestimonial].name}
                    </p>
                    <p className="text-sm text-midnight-300">
                      {testimonials[currentTestimonial].role} · 使用
                      {testimonials[currentTestimonial].method}
                    </p>
                  </div>

                  {/* 轮播指示器 */}
                  <div className="flex justify-center space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentTestimonial
                            ? "w-8 bg-golden-400"
                            : "bg-midnight-600 hover:bg-midnight-500"
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </MysticalAura>
            </div>
          </div>

          {/* 诗经引用 */}
          <div
            className="pt-16 max-w-2xl mx-auto transform transition-all duration-700"
            data-section-id="quote"
            style={{
              opacity: visibleSections.has("quote") ? 1 : 0,
              transform: visibleSections.has("quote")
                ? "translateY(0)"
                : "translateY(20px)",
            }}
          >
            <MysticalAura className="text-center space-y-2 hover:shadow-glow-lg transition-all duration-300">
              <p className="text-lg text-midnight-200 font-serif italic">
                "天行健，君子以自强不息"
              </p>
              <p className="text-sm text-midnight-400">——《周易·乾卦》</p>
            </MysticalAura>
          </div>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-midnight-900 to-transparent"></div>
    </div>
  );
};

export default Home;
