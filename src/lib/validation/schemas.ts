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

/**
 * パスワードリセットリクエストフォームのバリデーションスキーマ
 */
export const passwordResetSchema = z.object({
  email: z.string()
    .email('有効なメールアドレスを入力してください')
    .min(1, 'メールアドレスは必須です'),
});

/**
 * パスワードリセット確認フォームのバリデーションスキーマ
 */
export const passwordResetConfirmSchema = z.object({
  password: z.string()
    .min(8, 'パスワードは8文字以上である必要があります')
    .regex(/[A-Z]/, 'パスワードには少なくとも1つの大文字が必要です')
    .regex(/[a-z]/, 'パスワードには少なくとも1つの小文字が必要です')
    .regex(/[0-9]/, 'パスワードには少なくとも1つの数字が必要です'),
  confirmPassword: z.string()
    .min(1, 'パスワード（確認）は必須です'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});