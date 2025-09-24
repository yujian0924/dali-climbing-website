import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // 处理401未授权错误
    if (error.response?.status === 401) {
      // 清除本地存储的token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 重定向到登录页面
      window.location.href = '/login';
    }
    
    // 处理网络错误
    if (!error.response) {
      error.message = '网络连接失败，请检查网络设置';
    }
    
    return Promise.reject(error);
  }
);

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  code?: number;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 通用API方法
export const apiClient = {
  // GET请求
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.get(url, config);
  },
  
  // POST请求
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.post(url, data, config);
  },
  
  // PUT请求
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.put(url, data, config);
  },
  
  // DELETE请求
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.delete(url, config);
  },
  
  // PATCH请求
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return api.patch(url, data, config);
  },
};

// 文件上传方法
export const uploadFile = (file: File, onProgress?: (progress: number) => void): Promise<AxiosResponse<ApiResponse<{ url: string }>>> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
};

// 批量文件上传
export const uploadFiles = (files: File[], onProgress?: (progress: number) => void): Promise<AxiosResponse<ApiResponse<{ urls: string[] }>>> => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`files`, file);
  });
  
  return api.post('/upload/batch', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
};

// 导出默认实例
export default api;