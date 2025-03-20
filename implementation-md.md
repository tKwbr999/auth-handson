# 実装ガイドライン

このドキュメントでは、React Authentication Sample Appの主要なコンポーネントの実装ガイドラインを提供します。各コンポーネントの目的、実装の詳細、およびベストプラクティスについて説明します。

## 目次

1. [コアモジュール](#コアモジュール)
2. [認証コンテキスト](#認証コンテキスト)
3. [APIクライアント](#apiクライアント)
4. [トークン管理](#トークン管理)
5. [ルーティング](#ルーティング)
6. [フォームコンポーネント](#フォームコンポーネント)
7. [保護されたコンポーネント](#保護されたコンポーネント)
8. [テスト実装](#テスト実装)
9. [パフォーマンス最適化](#パフォーマンス最適化)

## コアモジュール

### アプリケーションのエントリーポイント

```typescript
// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import App from './App';
import './index.css';

// React QueryクライアントインスタンスLの作成
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5分
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NotificationProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </NotificationProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
```

### アプリルート

```typescript
// src/App.tsx

import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';

// 遅延ロードするページコンポーネント
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PasswordResetPage = lazy(() => import('./pages/PasswordResetPage'));
const PasswordResetConfirmPage = lazy(() => import('./pages/PasswordResetConfirmPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const App: React.FC = () => {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* 公開ルート */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/password-reset" element={<PasswordResetPage />} />
          <Route path="/password-reset/:token" element={<PasswordResetConfirmPage />} />
          
          {/* 保護されたルート */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          
          {/* 404ページ */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
```

## 認証コンテキスト

認証状態を管理するコンテキストを実装します。

```typescript
// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { User, LoginFormData, RegisterFormData, AuthProvider } from '../types';
import { getToken, setToken, removeToken } from '../lib/auth/tokenStorage';
import { loginUser, logoutUser, fetchUserProfile, registerUser } from '../api/authApi';
import { useNotification } from './NotificationContext';

// コンテキストの型
interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  socialLogin: (provider: AuthProvider) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// デフォルト値
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null,
  login: async () => {},
  socialLogin: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
};

// コンテキストの作成
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// カスタムフック
export const useAuth = () => useContext(AuthContext);

// プロバイダーコンポーネント
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { error: showError } = useNotification();

  // ユーザープロファイルの取得
  const { 
    data: user, 
    isLoading: userLoading,
    refetch: refetchUser
  } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserProfile,
    enabled: !!getToken(), // トークンが存在する場合のみ実行
    retry: false,
    onSuccess: () => {
      setIsAuthenticated(true);
    },
    onError: () => {
      setIsAuthenticated(false);
      removeToken();
    }
  });

  // ログインミューテーション
  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => loginUser(data),
    onSuccess: (data) => {
      setToken(data.tokens);
      setIsAuthenticated(true);
      refetchUser();
      navigate('/dashboard');
    },
    onError: (err: any) => {
      const message = err?.message || 'ログインに失敗しました';
      setError(message);
      showError(message);
    }
  });

  // 登録ミューテーション
  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => registerUser(data),
    onSuccess: () => {
      navigate('/login');
    },
    onError: (err: any) => {
      const message = err?.message || 'ユーザー登録に失敗しました';
      setError(message);
      showError(message);
    }
  });

  // ログアウトミューテーション
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      removeToken();
      setIsAuthenticated(false);
      navigate('/');
    },
    onError: () => {
      // エラーが発生してもトークンを削除し、認証状態をリセット
      removeToken();
      setIsAuthenticated(false);
      navigate('/');
    }
  });

  // ソーシャルログイン
  const handleSocialLogin = async (provider: AuthProvider) => {
    try {
      // 実装詳細はソーシャルログインの章を参照
    } catch (err: any) {
      setError(err?.message || 'ソーシャルログインに失敗しました');
      showError(err?.message || 'ソーシャルログインに失敗しました');
    }
  };

  // エラークリア
  const clearError = () => {
    setError(null);
  };

  // 認証状態の初期チェック
  useEffect(() => {
    const token = getToken();
    if (token) {
      refetchUser();
    } else {
      setIsAuthenticated(false);
    }
  }, [refetchUser]);

  // コンテキスト値
  const value: AuthContextType = {
    isAuthenticated,
    loading: userLoading,
    user: user || null,
    error,
    login: (email, password, rememberMe = false) => 
      loginMutation.mutateAsync({ email, password, rememberMe }),
    socialLogin: handleSocialLogin,
    register: (data) => registerMutation.mutateAsync(data),
    logout: () => logoutMutation.mutateAsync(),
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

## APIクライアント

APIとの通信を処理するクライアントを実装します。

```typescript
// src/api/apiClient.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
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
    (config: AxiosRequestConfig) => {
      const token = getToken();
      if (token && config.headers) {
        // トークンをヘッダーに追加
        config.headers.Authorization = `Bearer ${token.accessToken}`;
      }

      // CSRF対策（Cookie使用時）
      if (process.env.REACT_APP_AUTH_STORAGE === 'cookie' && apiConfig.csrfHeaderName) {
        const csrfToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1];

        if (csrfToken && config.headers) {
          config.headers[apiConfig.csrfHeaderName] = csrfToken;
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
    async (error: AxiosError) => {
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
```

### 認証API

認証関連のAPIエンドポイントを実装します。

```typescript
// src/api/authApi.ts

import { api } from './apiClient';
import { LoginFormData, RegisterFormData, LoginResponse, RegisterResponse, User } from '../types';
import { ApiEndpoints } from '../types/api';

/**
 * ユーザーログイン
 */
export const loginUser = async (data: LoginFormData): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(ApiEndpoints.LOGIN, data);
  return response.data;
};

/**
 * ユーザー登録
 */
export const registerUser = async (data: RegisterFormData): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>(ApiEndpoints.REGISTER, data);
  return response.data;
};

/**
 * ユーザーログアウト
 */
export const logoutUser = async (): Promise<void> => {
  await api.post<void>(ApiEndpoints.LOGOUT);
};

/**
 * ユーザープロファイル取得
 */
export const fetchUserProfile = async (): Promise<User> => {
  const response = await api.get<User>(ApiEndpoints.USER_PROFILE);
  return response.data;
};

/**
 * パスワードリセットリクエスト
 */
export const requestPasswordReset = async (email: string): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(
    ApiEndpoints.PASSWORD_RESET_REQUEST,
    { email }
  );
  return response.data;
};

/**
 * パスワードリセット確認
 */
export const confirmPasswordReset = async (
  token: string,
  password: string
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(
    ApiEndpoints.PASSWORD_RESET_CONFIRM,
    { token, password }
  );
  return response.data;
};

/**
 * トークンリフレッシュ
 */
export const refreshToken = async (): Promise<{ accessToken: string; expiresAt: number }> => {
  const response = await api.post<{ accessToken: string; expiresAt: number }>(
    ApiEndpoints.REFRESH_TOKEN
  );
  return response.data;
};
```

## トークン管理

認証トークンの管理を実装します。

```typescript
// src/lib/auth/tokenStorage.ts

import { AuthTokens, StorageType } from '../../types';
import { jwtDecode } from 'jwt-decode';

// 設定
const config = {
  type: (process.env.REACT_APP_AUTH_STORAGE || 'localStorage') as StorageType,
  accessTokenKey: 'accessToken',
  refreshTokenKey: 'refreshToken',
  tokenExpiryKey: 'tokenExpiry',
};

/**
 * トークンを保存
 */
export const setToken = (tokens: AuthTokens): void => {
  if (config.type === StorageType.LOCAL_STORAGE) {
    localStorage.setItem(config.accessTokenKey, tokens.accessToken);
    localStorage.setItem(config.tokenExpiryKey, tokens.expiresAt.toString());
    
    if (tokens.refreshToken) {
      localStorage.setItem(config.refreshTokenKey, tokens.refreshToken);
    }
  } else {
    // HTTPOnlyのCookieを設定するためにバックエンドAPIを呼び出す
    // 直接フロントからCookieを操作することはセキュリティ上避ける
    // トークンはすでにレスポンスのCookieに含まれている
  }
};

/**
 * トークンを取得
 */
export const getToken = (): AuthTokens | null => {
  if (config.type === StorageType.LOCAL_STORAGE) {
    const accessToken = localStorage.getItem(config.accessTokenKey);
    const refreshToken = localStorage.getItem(config.refreshTokenKey);
    const expiresAt = localStorage.getItem(config.tokenExpiryKey);
    
    if (!accessToken) return null;
    
    return {
      accessToken,
      refreshToken: refreshToken || '',
      expiresAt: expiresAt ? parseInt(expiresAt) : 0,
    };
  } else {
    // CookieはHTTPOnly設定なのでJavaScriptからは直接読み取れない
    // ここではCookieが自動的にリクエストに付与される前提で、
    // トークンの存在確認のみを行う（実際のトークンは取得できない）
    const hasCookie = document.cookie.includes('auth_session=');
    if (!hasCookie) return null;
    
    return {
      accessToken: 'httponlycookie',
      refreshToken: '',
      expiresAt: 0,
    };
  }
};

/**
 * トークンを削除
 */
export const removeToken = (): void => {
  if (config.type === StorageType.LOCAL_STORAGE) {
    localStorage.removeItem(config.accessTokenKey);
    localStorage.removeItem(config.refreshTokenKey);
    localStorage.removeItem(config.tokenExpiryKey);
  } else {
    // HTTPOnlyのCookieを削除するためにバックエンドAPIを呼び出す
    // 直接フロントからCookieを操作することはセキュリティ上避ける
  }
};

/**
 * トークンが有効期限切れかチェック
 */
export const isTokenExpired = (): boolean => {
  const token = getToken();
  if (!token) return true;
  
  // ローカルストレージの場合は保存されたexpiry時間を使用
  if (config.type === StorageType.LOCAL_STORAGE && token.expiresAt) {
    return Date.now() >= token.expiresAt;
  }
  
  // Cookie使用時またはexpiry時間がない場合はJWTのデコード
  try {
    const decoded: any = jwtDecode(token.accessToken);
    const expiryTime = decoded.exp * 1000; // Unix timestamp（ミリ秒）
    
    // 期限切れの10秒前から更新と判断
    return Date.now() >= expiryTime - 10000;
  } catch (error) {
    // デコード失敗時は期限切れと判断
    return true;
  }
};

/**