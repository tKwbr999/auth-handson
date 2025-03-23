import React from 'react';
import { useNotification, NotificationType } from '../../contexts/NotificationContext';

const NotificationList: React.FC = () => {
  const { notifications, remove } = useNotification();

  const getBackgroundColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return 'bg-green-50';
      case NotificationType.ERROR:
        return 'bg-red-50';
      case NotificationType.WARNING:
        return 'bg-yellow-50';
      default:
        return 'bg-blue-50';
    }
  };

  const getTextColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return 'text-green-800';
      case NotificationType.ERROR:
        return 'text-red-800';
      case NotificationType.WARNING:
        return 'text-yellow-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBackgroundColor(notification.type)} p-4 rounded-lg shadow-lg max-w-md transform transition-all duration-300 ease-in-out`}
          role="alert"
        >
          <div className="flex items-start">
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className={`text-sm font-medium ${getTextColor(notification.type)}`}>
                {notification.message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className={`${getTextColor(notification.type)} hover:opacity-75 focus:outline-none`}
                onClick={() => remove(notification.id)}
              >
                <span className="sr-only">閉じる</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;