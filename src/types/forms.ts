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