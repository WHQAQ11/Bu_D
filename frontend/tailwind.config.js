/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主色调 - 深邃神秘的紫蓝色系 - 增强对比度
        primary: {
          50: '#f3f0ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // 神秘金色系 - 增强对比度
        golden: {
          50: '#fffef5',
          100: '#fffbeb',
          200: '#fef3c7',
          300: '#fde047',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // 深邃夜空色系 - 加深背景
        midnight: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#0f172a',
          900: '#050a15',
        },
        // 卦象色彩 - 使用传统颜色
        trigram: {
          yang: '#000000', // 阳 - 黑色 (传统颜色)
          yin: '#ffffff',  // 阴 - 白色 (传统颜色)
          changing: '#dc2626', // 变爻 - 红色
        },
        // 占卜元素色系 - 增强对比度
        mystical: {
          purple: '#a855f7',   // 神秘紫 - 更亮
          indigo: '#6366f1',   // 靛蓝 - 更亮
          teal: '#14b8a6',     // 青绿
          rose: '#ec4899',     // 玫瑰红 - 更亮
        }
      },
      fontFamily: {
        sans: ['"Microsoft YaHei"', '"PingFang SC"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        serif: ['"Noto Serif SC"', '"SimSun"', 'serif'],
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(ellipse at top, #3d2463 0%, #1a0f3d 50%, #0a0520 100%)',
        'mystical-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'golden-gradient': 'linear-gradient(135deg, #fde047 0%, #eab308 100%)',
        'divination-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a78bfa' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'rotate-slow': 'rotate 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'coin-flip-3d': 'coinFlip3D var(--duration) linear',
        'coin-toss-arc': 'coinTossArc var(--duration) ease-in-out',
        'coin-glow': 'coinGlow var(--duration) ease-in-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'glow-breathe': 'glowBreathe 6s ease-in-out infinite',
        'glow-move': 'glowMove 15s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.7)',
            transform: 'scale(1)'
          },
          '50%': {
            boxShadow: '0 0 40px rgba(168, 85, 247, 0.9)',
            transform: 'scale(1.05)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // 铜钱翻转动画 - 支持CSS变量
        coinFlip3D: {
          '0%': {
            transform: 'rotateX(0deg) rotateY(0deg)',
            opacity: '1'
          },
          '100%': {
            transform: 'rotateX(var(--rx-end)) rotateY(0deg)',
            opacity: '1'
          }
        },
        // 简化抛物线轨迹
        coinTossArc: {
          '0%': {
            transform: 'translateY(0px) translateX(0px)',
            opacity: '1'
          },
          '50%': {
            transform: 'translateY(-120px) translateX(40px)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateY(0px) translateX(0px)',
            opacity: '1'
          }
        },
        // 落地弹跳效果
        coinBounce: {
          '0%': {
            transform: 'translateY(0px) scale(1)',
          },
          '20%': {
            transform: 'translateY(-8px) scale(1.02, 0.98)',
          },
          '40%': {
            transform: 'translateY(-12px) scale(1.01, 0.99)',
          },
          '60%': {
            transform: 'translateY(-6px) scale(1.005, 0.995)',
          },
          '80%': {
            transform: 'translateY(-2px) scale(1.002, 0.998)',
          },
          '100%': {
            transform: 'translateY(0px) scale(1)',
          }
        },
        // 简化光晕脉动
        glowPulse: {
          '0%, 100%': {
            filter: 'brightness(1) drop-shadow(0 0 20px rgba(251, 191, 36, 0.8))',
          },
          '50%': {
            filter: 'brightness(1.3) drop-shadow(0 0 30px rgba(251, 191, 36, 1))',
          }
        },
        // 铜钱光晕动画
        coinGlow: {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(251, 191, 36, 0)'
          },
          '50%': {
            boxShadow: '0 0 30px 10px rgba(251, 191, 36, 0.8)'
          }
        },
        // 光晕呼吸动画
        glowBreathe: {
          '0%, 100%': {
            opacity: '0.4'
          },
          '50%': {
            opacity: '0.8'
          }
        },
        // 光晕移动动画
        glowMove: {
          '0%': {
            transform: 'translate(0, 0)'
          },
          '25%': {
            transform: 'translate(30px, -30px)'
          },
          '50%': {
            transform: 'translate(0, 0)'
          },
          '75%': {
            transform: 'translate(-30px, 30px)'
          },
          '100%': {
            transform: 'translate(0, 0)'
          }
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(168, 85, 247, 0.5)',
        'glow-lg': '0 0 40px rgba(168, 85, 247, 0.7)',
        'mystical': '0 4px 20px rgba(168, 85, 247, 0.4)',
        'golden': '0 4px 20px rgba(251, 191, 36, 0.5)',
      },
    },
  },
  plugins: [],
}
