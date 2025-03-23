import React, { createContext, useContext, useState, ReactNode } from 'react';

// 通知タイプ
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

// 通知データ
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

// 通知コンテキストの値
export interface NotificationContextValue {
  notifications: Notification[];
  info: (message: string, options?: Partial<Notification>) => void;
  success: (message: string, options?: Partial<Notification>) => void;
  warning: (message: string, options?: Partial<Notification>) => void;
  error: (message: string, options?: Partial<Notification>) => void;
  remove: (id: string) => void;
  clearAll: () => void;
}

// デフォルト値
const defaultNotificationContext: NotificationContextValue = {
  notifications: [],
  info: () => {},
  success: () => {},
  warning: () => {},
  error: () => {},
  remove: () => {},
  clearAll: () => {},
};

// コンテキストの作成
const NotificationContext = createContext<NotificationContextValue>(defaultNotificationContext);

// カスタムフック
export const useNotification = () => useContext(NotificationContext);

// プロバイダーコンポーネント
const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (type: NotificationType, message: string, options: Partial<Notification> = {}) => {
    const id = Math.random().toString(36).substring(2, 15);
    const newNotification: Notification = {
      id,
      type,
      message,
      autoClose: options.autoClose !== undefined ? options.autoClose : true,
      duration: options.duration || 3000,
    };
    setNotifications([...notifications, newNotification]);

    if (newNotification.autoClose) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value: NotificationContextValue = {
    notifications,
    info: (message, options) => addNotification(NotificationType.INFO, message, options),
    success: (message, options) => addNotification(NotificationType.SUCCESS, message, options),
    warning: (message, options) => addNotification(NotificationType.WARNING, message, options),
    error: (message, options) => addNotification(NotificationType.ERROR, message, options),
    remove: removeNotification,
    clearAll: clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;