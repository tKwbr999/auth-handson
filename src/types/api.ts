import { DateString } from './common';
import { User } from './user';
import { AuthTokens } from './auth';

/**
 * API基本レスポンス
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: DateString;
}

/**
 * APIエラーレスポンス
 */
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: DateString;
}

/**
 * ページネーションメタデータ
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/**
 * ページネーション付きレスポンス
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

/**
 * ログインレスポンス
 */
export interface LoginResponse {
  tokens: AuthTokens;
  user: User;
}

/**
 * ユーザー登録レスポンス
 */
export interface RegisterResponse {
  user: User;
  message: string;
}

/**
 * APIエンドポイント定義
 */
export enum ApiEndpoints {
  LOGIN = '/auth/login',
  LOGOUT = '/auth/logout',
  REGISTER = '/auth/register',
  REFRESH_TOKEN = '/auth/refresh',
  PASSWORD_RESET_REQUEST = '/auth/password-reset-request',
  PASSWORD_RESET_CONFIRM = '/auth/password-reset-confirm',
  CHANGE_PASSWORD = '/auth/change-password',
  USER_PROFILE = '/users/me',
  UPDATE_PROFILE = '/users/me',
  SOCIAL_LOGIN_GOOGLE = '/auth/social/google',
  SOCIAL_LOGIN_GITHUB = '/auth/social/github',
}