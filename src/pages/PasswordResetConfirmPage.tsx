import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { passwordResetConfirmSchema } from '../lib/validation/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useNotification } from '../contexts/NotificationContext';
import { confirmPasswordReset } from '../api/authApi';

interface PasswordResetConfirmFormData {
  password: string;
  confirmPassword: string;
}

const PasswordResetConfirmPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const { register, handleSubmit, formState: { errors } } = useForm<PasswordResetConfirmFormData>({
    resolver: zodResolver(passwordResetConfirmSchema),
  });

  const onSubmit = async (data: PasswordResetConfirmFormData) => {
    if (!token) {
      showError('無効なトークンです');
      return;
    }

    try {
      setLoading(true);
      await confirmPasswordReset(token, data.password);
      success('パスワードが正常に更新されました');
      navigate('/login');
    } catch (err: any) {
      showError(err?.message || 'パスワードの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">
              無効なトークン
            </h2>
            <p className="mt-2 text-gray-600">
              このリンクは無効であるか、期限が切れています。
            </p>
            <div className="mt-4">
              <Link
                to="/password-reset"
                className="text-blue-600 hover:text-blue-500"
              >
                パスワードリセットを再度リクエスト
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900">
            新しいパスワードの設定
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            新しいパスワードを入力してください。
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              新しいパスワード
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              {...register('password')}
            />
            {errors.password && (
              <span className="text-sm text-red-600">{errors.password.message}</span>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              新しいパスワード（確認）
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <span className="text-sm text-red-600">{errors.confirmPassword.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'パスワードを更新'}
          </button>
        </form>

        <div className="text-center">
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            ログインページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirmPage;