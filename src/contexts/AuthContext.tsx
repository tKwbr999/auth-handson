import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { User, LoginFormData, RegisterFormData } from '../types';
import { getToken, setToken, removeToken } from '../lib/auth/tokenStorage';
import { loginUser, logoutUser, fetchUserProfile, registerUser } from '../api/authApi';
import { useNotification } from './NotificationContext';
import { LoginResponse, RegisterResponse } from '../types/api';

// コンテキストの型
interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  socialLogin: (provider: string) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateProfile: (data: { displayName?: string; avatarUrl?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
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
  updateProfile: async () => {},
  changePassword: async () => {},
};

// コンテキストの作成
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// カスタムフック
export const useAuth = () => useContext(AuthContext);

// プロバイダーコンポーネント
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
  const handleSocialLogin = async (provider: string) => {
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

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { displayName?: string; avatarUrl?: string }) => {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('プロフィールの更新に失敗しました');
      }
      return response.json();
    },
    onSuccess: () => {
      refetchUser();
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      if (!response.ok) {
        throw new Error('パスワードの変更に失敗しました');
      }
      return response.json();
    }
  });

  // コンテキスト値
  const value: AuthContextType = {
    isAuthenticated,
    loading: userLoading,
    user: user ?? null,
    error,
    login: (email, password, rememberMe = false) => {
       loginMutation.mutateAsync({ email, password, rememberMe }).then(() => {});
       return Promise.resolve();
    },
    register: (data) => {
      registerMutation.mutateAsync(data).then(() => {});
      return Promise.resolve();
    },
    logout: () => logoutMutation.mutateAsync(),
    clearError,
    socialLogin: handleSocialLogin,
    updateProfile: (data) => updateProfileMutation.mutateAsync(data),
    changePassword: (currentPassword, newPassword) => 
      changePasswordMutation.mutateAsync({ currentPassword, newPassword }),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;