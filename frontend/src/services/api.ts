/**
 * 本地后端 API 调用服务
 * 用于与本地 Node.js 后端通信
 */

import axios, { AxiosInstance } from 'axios';

// 获取后端 URL（从环境变量或默认值）
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

console.log(`🔗 [API] 后端地址: ${BACKEND_URL}`);

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
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
