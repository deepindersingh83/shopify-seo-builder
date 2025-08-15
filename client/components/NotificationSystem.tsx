import React, { useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNotifications, setGlobalNotificationFunction, type Notification } from '@/hooks/use-notifications';

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

function NotificationItem({ notification, onRemove }: NotificationItemProps) {
  const { id, type, title, message, action } = notification;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'info':
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <Card className={`mb-3 border-l-4 ${getBorderColor()} shadow-lg`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {getIcon()}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
              {message && (
                <p className="text-sm text-gray-600 mt-1">{message}</p>
              )}
              {action && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 h-auto p-1"
            onClick={() => onRemove(id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function NotificationSystem() {
  const { notifications, addNotification, removeNotification, clearAll } = useNotifications();

  // Set up global notification function
  useEffect(() => {
    setGlobalNotificationFunction(addNotification);
    return () => setGlobalNotificationFunction(() => {});
  }, [addNotification]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className="space-y-2">
        {notifications.length > 3 && (
          <div className="flex justify-end mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="text-xs"
            >
              Clear All ({notifications.length})
            </Button>
          </div>
        )}
        
        {notifications.slice(-5).map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
        
        {notifications.length > 5 && (
          <Card className="border-dashed">
            <CardContent className="p-3 text-center">
              <p className="text-sm text-gray-500">
                {notifications.length - 5} more notifications...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
