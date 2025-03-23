import { AuthProvider } from './auth';
import { User } from './user';
import { RegisterFormData, PasswordResetConfirmFormData, ProfileUpdateFormData, ChangePasswordFormData } from './forms';

/**
 * 認証コンテキストの値
 */
export interface AuthContextValue {
  /**
   * 認証状態
   */
  isAuthenticated: boolean;
  
  /**
   * 認証状態のローディング中かどうか
   */
  loading: boolean;
  
  /**
   * 認証済みユーザー情報
   */
  user: User | null;
  
  /**
   * 認証エラー
   */
  error: string | null;
  
  /**
   * ログイン関数
   */
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  
  /**
   * ソーシャルログイン関数
   */
  socialLogin: (provider: AuthProvider) => Promise<void>;
  
  /**
   * ユーザー登録関数
   */
  register: (data: RegisterFormData) => Promise<void>;
  
  /**
   * パスワードリセットリクエスト関数
   */
  requestPasswordReset: (email: string) => Promise<void>;
  
  /**
   * パスワードリセット確認関数
   */
  confirmPasswordReset: (data: PasswordResetConfirmFormData) => Promise<void>;
  
  /**
   * パスワード変更関数
   */
  changePassword: (data: ChangePasswordFormData) => Promise<void>;
  
  /**
   * プロファイル更新関数
   */
  updateProfile: (data: ProfileUpdateFormData) => Promise<void>;
  
  /**
   * ログアウト関数
   */
  logout: () => Promise<void>;
  
  /**
   * 認証エラーのクリア関数
   */
  clearError: () => void;
}

/**
 * 通知タイプ
 */
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

/**
 * 通知データ
 */
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

/**
 * 通知コンテキストの値
 */
export interface NotificationContextValue {
  /**
   * 現在の通知リスト
   */
  notifications: Notification[];
  
  /**
   * 情報通知の追加
   */
  info: (message: string, options?: Partial<Notification>) => void;
  
  /**
   * 成功通知の追加
   */
  success: (message: string, options?: Partial<Notification>) => void;
  
  /**
   * 警告通知の追加
   */
  warning: (message: string, options?: Partial<Notification>) => void;
  
  /**
   * エラー通知の追加
   */
  error: (message: string, options?: Partial<Notification>) => void;
  
  /**
   * 通知の削除
   */
  remove: (id: string) => void;
  
  /**
   * 全通知のクリア
   */
  clearAll: () => void;
}