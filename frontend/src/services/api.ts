/**
 * API 调用服务
 * 使用 Vercel Serverless Functions
 */

import axios from 'axios';

// Vercel Serverless Functions 使用相对路径
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

console.log(`🔗 [API] 后端模式: ${BACKEND_URL ? '外部后端' : 'Vercel Serverless'}`);

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 60000, // Serverless 可能需要更长时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    console.log(`📤 [API] 请求: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ [API] 请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.log(`📥 [API] 响应: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ [API] 响应错误:', error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
