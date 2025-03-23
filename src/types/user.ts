import { ID, DateString } from './common';
import { AuthProvider } from './auth';

/**
 * ユーザープロファイル
 */
export interface User {
  /**
   * ユーザーID
   */
  id: ID;
  
  /**
   * メールアドレス
   */
  email: string;
  
  /**
   * 表示名
   */
  displayName: string;
  
  /**
   * プロフィール画像URL
   */
  avatarUrl?: string;
  
  /**
   * 最終ログイン日時
   */
  lastLoginAt?: DateString;
  
  /**
   * ユーザーの権限
   */
  roles: string[];
  
  /**
   * アカウント作成日時
   */
  createdAt: DateString;
  
  /**
   * アカウント更新日時
   */
  updatedAt: DateString;
}

/**
 * ユーザープロファイル更新データ
 */
export interface UserProfileUpdate {
  displayName?: string;
  avatarUrl?: string;
}

/**
 * ユーザーの認証方法情報
 */
export interface UserAuthInfo {
  /**
   * 主認証プロバイダー
   */
  primaryProvider: AuthProvider;
  
  /**
   * 接続済み認証プロバイダー
   */
  connectedProviders: AuthProvider[];
  
  /**
   * パスワード設定済みかどうか
   */
  hasPassword: boolean;
  
  /**
   * 二要素認証有効かどうか
   */
  twoFactorEnabled: boolean;
}