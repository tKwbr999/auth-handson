import React, { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationList from '../ui/NotificationList';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                認証サンプルアプリ
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    ダッシュボード
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    プロフィール
                  </Link>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {user?.displayName || user?.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-500"
                    >
                      ログアウト
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    ログイン
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    新規登録
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} 認証サンプルアプリ All rights reserved.
          </p>
        </div>
      </footer>

      <NotificationList />
    </div>
  );
};

export default Layout;