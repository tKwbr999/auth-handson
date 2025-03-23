import { User } from './user';

/**
 * 認証トークンペア
 */
export interface AuthTokens {
  /**
   * アクセストークン（APIリクエスト認証用）
   */
  accessToken: string;
  
  /**
   * リフレッシュトークン（アクセストークン更新用）
   */
  refreshToken: string;
  
  /**
   * アクセストークンの有効期限（Unix timestamp）
   */
  expiresAt: number;
}

/**
 * JWTトークンのペイロード
 */
export interface JwtPayload {
  /**
   * ユーザーID
   */
  sub: string;
  
  /**
   * ユーザーEmail
   */
  email: string;
  
  /**
   * ユーザーの権限（オプション）
   */
  roles?: string[];
  
  /**
   * トークン発行時刻（Unix timestamp）
   */
  iat: number;
  
  /**
   * トークン有効期限（Unix timestamp）
   */
  exp: number;
}

/**
 * アプリケーションの認証状態
 */
export interface AuthState {
  /**
   * 認証済みかどうか
   */
  isAuthenticated: boolean;
  
  /**
   * 認証状態のローディング中かどうか
   */
  loading: boolean;
  
  /**
   * 認証済みユーザー情報（未認証の場合はnull）
   */
  user: User | null;
  
  /**
   * 最後に発生したエラー（なければnull）
   */
  error: string | null;
}