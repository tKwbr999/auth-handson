# データモデル設計

このドキュメントでは、React Authentication Sample Appで使用されるデータモデルについて説明します。フロントエンドアプリケーションとバックエンドAPIの間でやり取りされるデータ構造を定義し、型安全なアプリケーション開発を支援します。

## 目次

1. [基本データ型](#基本データ型)
2. [認証関連モデル](#認証関連モデル)
3. [ユーザー関連モデル](#ユーザー関連モデル)
4. [API応答モデル](#api応答モデル)
5. [フォーム入力モデル](#フォーム入力モデル)
6. [状態管理モデル](#状態管理モデル)
7. [ストレージモデル](#ストレージモデル)

## 基本データ型

アプリケーション全体で使用される基本的なデータ型を定義します。

### ID型

```typescript
// src/types/common.ts

/**
 * システム内で使用されるユニークID
 */
export type ID = string;

/**
 * タイムスタンプ（ミリ秒）
 */
export type Timestamp = number;

/**
 * ISO8601形式の日付文字列
 */
export type DateString = string;
```

### 基本レスポンス型

```typescript
// src/types/api.ts

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
```

## 認証関連モデル

認証プロセスで使用されるデータモデルを定義します。

### トークンモデル

```typescript
// src/types/auth.ts

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
```

### 認証状態モデル

```typescript
// src/types/auth.ts

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
```

## ユーザー関連モデル

ユーザー情報に関するデータモデルを定義します。

### ユーザーモデル

```typescript
// src/types/user.ts

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
 * 認証プロバイダータイプ
 */
export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  GITHUB = 'github',
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
```

## API応答モデル

バックエンドAPIからの応答データモデルを定義します。

### 認証API応答

```typescript
// src/types/api.ts

/**
 * ログインレスポンス
 */
export interface LoginResponse {
  tokens: AuthTokens;
  user: User;
}

/**
 * トークンリフレッシュレスポンス
 */
export interface RefreshTokenResponse {
  accessToken: string;
  expiresAt: number;
}

/**
 * ユーザー登録レスポンス
 */
export interface RegisterResponse {
  user: User;
  message: string;
}

/**
 * パスワードリセットリクエストレスポンス
 */
export interface PasswordResetRequestResponse {
  message: string;
  expiresIn: number; // パスワードリセットリンクの有効期間（秒）
}

/**
 * ソーシャルログインURLレスポンス
 */
export interface SocialLoginUrlResponse {
  authUrl: string;
}
```

## フォーム入力モデル

ユーザー入力フォームで使用されるデータモデルを定義します。

### 認証フォーム

```typescript
// src/types/forms.ts

/**
 * ログインフォーム入力
 */
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * ユーザー登録フォーム入力
 */
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  agreeToTerms: boolean;
}

/**
 * パスワードリセットリクエストフォーム
 */
export interface PasswordResetRequestFormData {
  email: string;
}

/**
 * パスワードリセット確認フォーム
 */
export interface PasswordResetConfirmFormData {
  password: string;
  confirmPassword: string;
  token: string;
}

/**
 * プロファイル更新フォーム
 */
export interface ProfileUpdateFormData {
  displayName: string;
  avatarUrl?: string;
}

/**
 * パスワード変更フォーム
 */
export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
```

## 状態管理モデル

アプリケーションの状態管理に使用されるモデルを定義します。

### 認証コンテキスト

```typescript
// src/types/context.ts

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
```

### 通知コンテキスト

```typescript
// src/types/context.ts

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
```

## ストレージモデル

ローカルストレージやCookieに保存されるデータのモデルを定義します。

### トークンストレージ

```typescript
// src/types/storage.ts

/**
 * ストレージタイプ
 */
export enum StorageType {
  LOCAL_STORAGE = 'localStorage',
  COOKIE = 'cookie',
}

/**
 * トークンストレージ設定
 */
export interface TokenStorageConfig {
  /**
   * ストレージタイプ
   */
  type: StorageType;
  
  /**
   * アクセストークンのキー名
   */
  accessTokenKey: string;
  
  /**
   * リフレッシュトークンのキー名
   */
  refreshTokenKey: string;
  
  /**
   * Cookie使用時のオプション
   */
  cookieOptions?: {
    /**
     * Cookieのパス
     */
    path: string;
    
    /**
     * Cookieの有効期限（日数）
     */
    maxAge?: number;
    
    /**
     * Secure属性（HTTPS限定）
     */
    secure: boolean;
    
    /**
     * SameSite属性
     */
    sameSite: 'strict' | 'lax' | 'none';
  };
}

/**
 * ローカルストレージに保存されるユーザー設定
 */
export interface UserPreferences {
  /**
   * ダークモード設定
   */
  darkMode: boolean;
  
  /**
   * 言語設定
   */
  language: string;
  
  /**
   * お知らせメール設定
   */
  emailNotifications: boolean;
  
  /**
   * UI設定
   */
  uiSettings: {
    /**
     * コンパクトビュー
     */
    compactView: boolean;
    
    /**
     * フォントサイズ
     */
    fontSize: 'small' | 'medium' | 'large';
    
    /**
     * アニメーション設定
     */
    animations: boolean;
  };
}
```

### セッション管理

```typescript
// src/types/storage.ts

/**
 * セッション情報
 */
export interface SessionInfo {
  /**
   * セッション開始時間
   */
  startedAt: number;
  
  /**
   * 最終アクティブ時間
   */
  lastActiveAt: number;
  
  /**
   * デバイス情報
   */
  device: {
    /**
     * ブラウザ名
     */
    browser: string;
    
    /**
     * OS名
     */
    os: string;
    
    /**
     * デバイスタイプ
     */
    type: 'mobile' | 'tablet' | 'desktop';
  };
  
  /**
   * セッションID
   */
  sessionId: string;
}

/**
 * セキュリティログエントリ
 */
export interface SecurityLogEntry {
  /**
   * イベントタイプ
   */
  eventType: 'login' | 'logout' | 'password_change' | 'profile_update' | 'token_refresh';
  
  /**
   * タイムスタンプ
   */
  timestamp: number;
  
  /**
   * IPアドレス（マスク済み）
   */
  ipAddress?: string;
  
  /**
   * 場所情報（国・地域）
   */
  location?: string;
  
  /**
   * デバイス情報
   */
  device?: string;
  
  /**
   * イベント固有データ
   */
  metadata?: Record<string, unknown>;
}
```

## 概念モデル

以下は、主要データモデル間の関係を示す概念モデル図です：

```
+----------------+                   +----------------+
|      User      |                   |   AuthTokens   |
+----------------+                   +----------------+
| id             |<------------------| sub (user id)  |
| email          |                   | accessToken    |
| displayName    |                   | refreshToken   |
| avatarUrl      |                   | expiresAt      |
| lastLoginAt    |                   +----------------+
| roles          |                           ^
| createdAt      |                           |
| updatedAt      |                           |
+----------------+                   +----------------+
        ^                            |  AuthContext   |
        |                            +----------------+
        |                            | isAuthenticated|
        |                            | loading        |
        |                            | user           |
        |                            | error          |
        |                            | login()        |
        |                            | logout()       |
        |                            | register()     |
        |                            +----------------+
        |
        |
+----------------+                   +----------------+
| UserAuthInfo   |                   | SecurityLog    |
+----------------+                   +----------------+
| primaryProvider|                   | eventType      |
| connectedProv. |                   | timestamp      |
| hasPassword    |                   | ipAddress      |
| twoFactorEnabled                   | location       |
+----------------+                   | device         |
                                     | metadata       |
                                     +----------------+
```

## Zodバリデーションスキーマ

TypeScriptの型に加えて、実行時の入力検証のためにZodスキーマを使用します。

```typescript
// src/lib/validation/schemas.ts
import { z } from 'zod';

/**
 * ログインフォームのバリデーションスキーマ
 */
export const loginSchema = z.object({
  email: z.string()
    .email('有効なメールアドレスを入力してください')
    .min(1, 'メールアドレスは必須です'),
  password: z.string()
    .min(1, 'パスワードは必須です'),
  rememberMe: z.boolean().optional().default(false),
});

/**
 * ユーザー登録フォームのバリデーションスキーマ
 */
export const registerSchema = z.object({
  email: z.string()
    .email('有効なメールアドレスを入力してください')
    .min(1, 'メールアドレスは必須です'),
  password: z.string()
    .min(8, 'パスワードは8文字以上である必要があります')
    .regex(/[A-Z]/, 'パスワードには少なくとも1つの大文字が必要です')
    .regex(/[a-z]/, 'パスワードには少なくとも1つの小文字が必要です')
    .regex(/[0-9]/, 'パスワードには少なくとも1つの数字が必要です'),
  confirmPassword: z.string()
    .min(1, 'パスワード（確認）は必須です'),
  displayName: z.string()
    .min(2, '表示名は2文字以上である必要があります')
    .max(50, '表示名は50文字以下である必要があります'),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: '利用規約に同意してください' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

/**
 * プロフィール更新フォームのバリデーションスキーマ
 */
export const profileUpdateSchema = z.object({
  displayName: z.string()
    .min(2, '表示名は2文字以上である必要があります')
    .max(50, '表示名は50文字以下である必要があります'),
  avatarUrl: z.string().url('有効なURLを入力してください').optional().nullable(),
});

/**
 * パスワード変更フォームのバリデーションスキーマ
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, '現在のパスワードは必須です'),
  newPassword: z.string()
    .min(8, 'パスワードは8文字以上である必要があります')
    .regex(/[A-Z]/, 'パスワードには少なくとも1つの大文字が必要です')
    .regex(/[a-z]/, 'パスワードには少なくとも1つの小文字が必要です')
    .regex(/[0-9]/, 'パスワードには少なくとも1つの数字が必要です'),
  confirmNewPassword: z.string()
    .min(1, 'パスワード（確認）は必須です'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmNewPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: '新しいパスワードは現在のパスワードと異なる必要があります',
  path: ['newPassword'],
});
```

## サーバー通信モデル

サーバーとの通信に使用されるモデルを定義します。

```typescript
// src/types/api.ts

/**
 * API設定
 */
export interface ApiConfig {
  /**
   * ベースURL
   */
  baseURL: string;
  
  /**
   * タイムアウト（ミリ秒）
   */
  timeout: number;
  
  /**
   * リトライ回数
   */
  maxRetries: number;
  
  /**
   * CSRFトークンヘッダー名
   */
  csrfHeaderName?: string;
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
```

## まとめ

このデータモデル設計は、React Authentication Sample Appの主要な機能をサポートするために必要なデータ構造を定義しています。TypeScriptの型システムとZodスキーマを組み合わせることで、コンパイル時と実行時の両方でデータの整合性を確保します。

データモデルは以下の利点を提供します：

1. **型安全性**: TypeScriptの型システムによるコンパイル時のエラー検出
2. **ドキュメンテーション**: コードベース内の一貫したデータ構造の定義
3. **入力検証**: Zodスキーマによる実行時のデータ検証
4. **API契約**: フロントエンドとバックエンドの間の明確なデータ契約

これらのデータモデルは、アプリケーションの拡張に合わせて更新できるように設計されており、新しい機能やデータ要件を容易に統合できます。