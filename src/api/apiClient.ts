import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getToken, removeToken } from '../lib/auth/tokenStorage';
import { ApiConfig, ApiResponse, ApiError } from '../types';

// API設定
const apiConfig: ApiConfig = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  maxRetries: 3,
};

// APIクライアントの作成
const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: apiConfig.baseURL,
    timeout: apiConfig.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // リクエストインターセプター
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();
      if (token && config.headers) {
        // トークンをヘッダーに追加
        config.headers.set('Authorization', `Bearer ${token.accessToken}`);
      }

      // CSRF対策（Cookie使用時）
      if (process.env.REACT_APP_AUTH_STORAGE === 'cookie' && apiConfig.csrfHeaderName) {
        const csrfToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1];

        if (csrfToken && config.headers) {
          config.headers.set(apiConfig.csrfHeaderName, csrfToken);
        }
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // レスポンスインターセプター
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError<ApiError>) => {
      const originalRequest = error.config;
      
      // 401エラー処理（認証エラー）
      if (error.response?.status === 401 && originalRequest) {
        // リフレッシュトークンの処理はトークン管理セクションで実装
        
        // トークンリフレッシュに失敗した場合
        removeToken();
        
        // ログインページへのリダイレクトをトリガー
        window.dispatchEvent(new CustomEvent('auth:logout-required'));
      }
      
      // APIエラーレスポンスの標準化
      const apiError: ApiError = {
        code: error.response?.data?.code || 'unknown_error',
        message: error.response?.data?.message || 'An unknown error occurred',
        details: error.response?.data?.details,
        timestamp: new Date().toISOString(),
      };
      
      return Promise.reject(apiError);
    }
  );

  return instance;
};

// シングルトンインスタンス
export const apiClient = createApiClient();

// APIリクエストメソッド
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.get(url, config).then(response => response.data),
    
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.post(url, data, config).then(response => response.data),
    
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.put(url, data, config).then(response => response.data),
    
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.patch(url, data, config).then(response => response.data),
    
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.delete(url, config).then(response => response.data),
};