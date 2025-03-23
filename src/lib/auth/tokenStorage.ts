import { AuthTokens, StorageType } from '../types';
import { jwtDecode } from 'jwt-decode';

// 設定
const config = {
  type: (process.env.REACT_APP_AUTH_STORAGE || 'localStorage') as StorageType,
  accessTokenKey: 'accessToken',
  refreshTokenKey: 'refreshToken',
  tokenExpiryKey: 'tokenExpiry',
};

/**
 * トークンを保存
 */
export const setToken = (tokens: AuthTokens): void => {
  if (config.type === StorageType.LOCAL_STORAGE) {
    localStorage.setItem(config.accessTokenKey, tokens.accessToken);
    localStorage.setItem(config.tokenExpiryKey, String(tokens.expiresAt));
    
    if (tokens.refreshToken) {
      localStorage.setItem(config.refreshTokenKey, tokens.refreshToken);
    }
  } else {
    // HTTPOnlyのCookieを設定するためにバックエンドAPIを呼び出す
    // 直接フロントからCookieを操作することはセキュリティ上避ける
    // トークンはすでにレスポンスのCookieに含まれている
  }
};

/**
 * トークンを取得
 */
export const getToken = (): AuthTokens | null => {
  if (config.type === StorageType.LOCAL_STORAGE) {
    const accessToken = localStorage.getItem(config.accessTokenKey);
    const refreshToken = localStorage.getItem(config.refreshTokenKey);
    const expiresAt = localStorage.getItem(config.tokenExpiryKey);
    
    if (!accessToken) return null;
    
    return {
      accessToken,
      refreshToken: refreshToken || '',
      expiresAt: expiresAt ? parseInt(expiresAt, 10) : 0,
    };
  } else {
    // CookieはHTTPOnly設定なのでJavaScriptからは直接読み取れない
    // ここではCookieが自動的にリクエストに付与される前提で、
    // トークンの存在確認のみを行う（実際のトークンは取得できない）
    const hasCookie = document.cookie.includes('auth_session=');
    if (!hasCookie) return null;
    
    return {
      accessToken: 'httponlycookie',
      refreshToken: '',
      expiresAt: 0,
    };
  }
};

/**
 * トークンを削除
 */
export const removeToken = (): void => {
  if (config.type === StorageType.LOCAL_STORAGE) {
    localStorage.removeItem(config.accessTokenKey);
    localStorage.removeItem(config.refreshTokenKey);
    localStorage.removeItem(config.tokenExpiryKey);
  } else {
    // HTTPOnlyのCookieを削除するためにバックエンドAPIを呼び出す
    // 直接フロントからCookieを操作することはセキュリティ上避ける
  }
};

/**
 * トークンが有効期限切れかチェック
 */
export const isTokenExpired = (): boolean => {
  const token = getToken();
  if (!token) return true;
  
  // ローカルストレージの場合は保存されたexpiry時間を使用
  if (config.type === StorageType.LOCAL_STORAGE && token.expiresAt) {
    return Date.now() >= token.expiresAt;
  }
  
  // Cookie使用時またはexpiry時間がない場合はJWTのデコード
  try {
    const decoded: any = jwtDecode(token.accessToken);
    const expiryTime = decoded.exp * 1000; // Unix timestamp（ミリ秒）
    
    // 期限切れの10秒前から更新と判断
    return Date.now() >= expiryTime - 10000;
  } catch (error) {
    // デコード失敗時は期限切れと判断
    return true;
  }
};