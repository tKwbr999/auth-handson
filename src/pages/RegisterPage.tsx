import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RegisterFormData } from '../types';
import { registerSchema } from '../lib/validation/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const RegisterPage: React.FC = () => {
  const { register: registerUser, loading, error, clearError } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    await registerUser(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900">アカウント登録</h1>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              {...register('email')}
            />
            {errors.email && (
              <span className="text-sm text-red-600">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              パスワード
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
              パスワード（確認）
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

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
              表示名
            </label>
            <input
              type="text"
              id="displayName"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              {...register('displayName')}
            />
            {errors.displayName && (
              <span className="text-sm text-red-600">{errors.displayName.message}</span>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeToTerms"
              className="h-4 w-4 rounded border-gray-300"
              {...register('agreeToTerms')}
            />
            <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
              <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                利用規約
              </Link>
              に同意する
            </label>
          </div>
          {errors.agreeToTerms && (
            <span className="text-sm text-red-600 block">{errors.agreeToTerms.message}</span>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {loading ? <LoadingSpinner size="sm" /> : '登録'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          すでにアカウントをお持ちの方は{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;