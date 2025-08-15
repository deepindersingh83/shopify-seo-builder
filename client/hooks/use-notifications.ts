import { useState, useCallback } from "react";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export function useNotifications(): NotificationState {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newNotification: Notification = {
        ...notification,
        id,
        duration: notification.duration || 5000,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto-remove after duration
      if (newNotification.duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }
    },
    [],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };
}

// Global notification functions for easy use
let globalNotificationFn:
  | ((notification: Omit<Notification, "id">) => void)
  | null = null;

export function setGlobalNotificationFunction(
  fn: (notification: Omit<Notification, "id">) => void,
) {
  globalNotificationFn = fn;
}

export function showNotification(notification: Omit<Notification, "id">) {
  if (globalNotificationFn) {
    globalNotificationFn(notification);
  } else {
    // Fallback to console if notification system not initialized
    console.log(
      `[${notification.type.toUpperCase()}] ${notification.title}`,
      notification.message,
    );
  }
}

export function showSuccess(title: string, message?: string) {
  showNotification({ type: "success", title, message });
}

export function showError(
  title: string,
  message?: string,
  action?: Notification["action"],
) {
  showNotification({ type: "error", title, message, action, duration: 7000 });
}

export function showWarning(title: string, message?: string) {
  showNotification({ type: "warning", title, message, duration: 6000 });
}

export function showInfo(title: string, message?: string) {
  showNotification({ type: "info", title, message });
}
