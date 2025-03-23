import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { profileUpdateSchema, changePasswordSchema } from '../lib/validation/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileUpdateFormData, ChangePasswordFormData } from '../types';

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { user, loading: authLoading, updateProfile, changePassword } = useAuth();
  const { success, error: showError } = useNotification();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting }
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      avatarUrl: user?.avatarUrl || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPasswordForm,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onProfileSubmit = async (data: ProfileUpdateFormData) => {
    try {
      await updateProfile(data);
      success('プロフィールが更新されました');
      setIsEditing(false);
    } catch (err: any) {
      showError(err?.message || 'プロフィールの更新に失敗しました');
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword(data.currentPassword, data.newPassword);
      success('パスワードが更新されました');
      setIsChangingPassword(false);
      resetPasswordForm();
    } catch (err: any) {
      showError(err?.message || 'パスワードの更新に失敗しました');
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* プロフィール情報 */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">プロフィール</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-600 hover:text-blue-500"
            >
              {isEditing ? 'キャンセル' : '編集'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                  表示名
                </label>
                <input
                  type="text"
                  id="displayName"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  {...registerProfile('displayName')}
                />
                {profileErrors.displayName && (
                  <span className="text-sm text-red-600">{profileErrors.displayName.message}</span>
                )}
              </div>

              <div>
                <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700">
                  アバターURL
                </label>
                <input
                  type="text"
                  id="avatarUrl"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  {...registerProfile('avatarUrl')}
                />
                {profileErrors.avatarUrl && (
                  <span className="text-sm text-red-600">{profileErrors.avatarUrl.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isProfileSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                {isProfileSubmitting ? <LoadingSpinner size="sm" /> : '保存'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">表示名</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.displayName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">メールアドレス</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
              </div>
              {user?.avatarUrl && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">アバター画像</dt>
                  <dd className="mt-1">
                    <img
                      src={user.avatarUrl}
                      alt="アバター"
                      className="h-20 w-20 rounded-full"
                    />
                  </dd>
                </div>
              )}
            </div>
          )}
        </div>

        {/* パスワード変更 */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">パスワード変更</h2>
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="text-blue-600 hover:text-blue-500"
            >
              {isChangingPassword ? 'キャンセル' : '変更'}
            </button>
          </div>

          {isChangingPassword && (
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  現在のパスワード
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  {...registerPassword('currentPassword')}
                />
                {passwordErrors.currentPassword && (
                  <span className="text-sm text-red-600">{passwordErrors.currentPassword.message}</span>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  新しいパスワード
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  {...registerPassword('newPassword')}
                />
                {passwordErrors.newPassword && (
                  <span className="text-sm text-red-600">{passwordErrors.newPassword.message}</span>
                )}
              </div>

              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                  新しいパスワード（確認）
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  {...registerPassword('confirmNewPassword')}
                />
                {passwordErrors.confirmNewPassword && (
                  <span className="text-sm text-red-600">
                    {passwordErrors.confirmNewPassword.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isPasswordSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                {isPasswordSubmitting ? <LoadingSpinner size="sm" /> : 'パスワードを変更'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;