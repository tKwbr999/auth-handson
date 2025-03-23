import { api } from './apiClient';
import { LoginFormData, RegisterFormData } from '../types/forms';
import { LoginResponse, RegisterResponse } from '../types/api';
import { User } from '../types/user';
import { ApiEndpoints } from '../types/api';
import { UserProfileUpdate } from '../types/user';

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
 * ユーザープロファイル更新
 */
export const updateUserProfile = async (data: UserProfileUpdate): Promise<User> => {
  const response = await api.patch<User>(ApiEndpoints.UPDATE_PROFILE, data);
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