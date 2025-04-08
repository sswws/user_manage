/**
 * 通知管理器
 * 提供系统通知和消息中心功能
 */

import { message, notification } from 'antd';

// 通知类型
export enum NotificationType {
  SYSTEM = 'system',       // 系统通知
  USER = 'user',           // 用户相关通知
  SECURITY = 'security',   // 安全相关通知
  TASK = 'task',           // 任务相关通知
  INFO = 'info',           // 一般信息
  WARNING = 'warning',     // 警告信息
  ERROR = 'error',         // 错误信息
  SUCCESS = 'success'      // 成功信息
}

// 通知优先级
export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

// 通知项接口
export interface NotificationItem {
  id: string;                     // 通知ID
  title: string;                  // 通知标题
  content: string;                // 通知内容
  type: NotificationType;         // 通知类型
  priority: NotificationPriority; // 通知优先级
  timestamp: number;              // 创建时间戳
  read: boolean;                  // 是否已读
  sender?: string;                // 发送者
  link?: string;                  // 相关链接
  actions?: NotificationAction[]; // 可执行的操作
  expireAt?: number;              // 过期时间
}

// 通知操作接口
export interface NotificationAction {
  text: string;                   // 操作文本
  action: () => void;             // 操作函数
  type?: 'default' | 'primary' | 'danger'; // 操作类型
}

// 通知过滤器接口
export interface NotificationFilter {
  type?: NotificationType | NotificationType[];
  priority?: NotificationPriority | NotificationPriority[];
  read?: boolean;
  startTime?: number;
  endTime?: number;
  search?: string;
}

// 通知设置接口
export interface NotificationSettings {
  enableDesktopNotifications: boolean; // 是否启用桌面通知
  enableSoundNotifications: boolean;   // 是否启用声音通知
  enableEmailNotifications: boolean;   // 是否启用邮件通知
  autoDeleteAfterDays: number;         // 自动删除已读通知的天数
  showUnreadBadge: boolean;            // 是否显示未读徽章
  notificationDisplayTime: number;     // 通知显示时间（秒）
  groupSimilarNotifications: boolean;  // 是否分组类似通知
  disabledTypes: NotificationType[];   // 禁用的通知类型
}

// 默认通知设置
const defaultNotificationSettings: NotificationSettings = {
  enableDesktopNotifications: true,
  enableSoundNotifications: true,
  enableEmailNotifications: false,
  autoDeleteAfterDays: 30,
  showUnreadBadge: true,
  notificationDisplayTime: 5,
  groupSimilarNotifications: true,
  disabledTypes: []
};

// 存储通知列表
let notifications: NotificationItem[] = [];

// 存储通知设置
let notificationSettings: NotificationSettings = { ...defaultNotificationSettings };

// 通知变化监听器
type NotificationChangeListener = (notifications: NotificationItem[]) => void;
const notificationChangeListeners: NotificationChangeListener[] = [];

/**
 * 初始化通知管理器
 */
export const initNotificationManager = (): void => {
  // 从本地存储加载通知
  try {
    const savedNotifications = localStorage.getItem('userNotifications');
    if (savedNotifications) {
      notifications = JSON.parse(savedNotifications);
    }
    
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      notificationSettings = { ...notificationSettings, ...JSON.parse(savedSettings) };
    }
    
    // 清理过期通知
    cleanExpiredNotifications();
  } catch (error) {
    console.error('加载通知数据失败:', error);
  }
  
  // 请求桌面通知权限
  if (notificationSettings.enableDesktopNotifications && 'Notification' in window) {
    Notification.requestPermission();
  }
};

/**
 * 添加通知
 * @param notification 通知项
 * @param showPopup 是否显示弹出通知
 * @returns 添加的通知ID
 */
export const addNotification = (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>, showPopup: boolean = true): string => {
  const id = generateId();
  const timestamp = Date.now();
  
  const newNotification: NotificationItem = {
    ...notification,
    id,
    timestamp,
    read: false
  };
  
  notifications.unshift(newNotification);
  saveNotifications();
  
  // 显示弹出通知
  if (showPopup && !notificationSettings.disabledTypes.includes(notification.type)) {
    showNotificationPopup(newNotification);
  }
  
  // 通知监听器
  notifyChangeListeners();
  
  return id;
};

/**
 * 标记通知为已读
 * @param id 通知ID
 * @returns 是否成功标记
 */
export const markAsRead = (id: string): boolean => {
  const notification = notifications.find(n => n.id === id);
  if (!notification) return false;
  
  notification.read = true;
  saveNotifications();
  notifyChangeListeners();
  
  return true;
};

/**
 * 标记所有通知为已读
 */
export const markAllAsRead = (): void => {
  let changed = false;
  
  notifications.forEach(notification => {
    if (!notification.read) {
      notification.read = true;
      changed = true;
    }
  });
  
  if (changed) {
    saveNotifications();
    notifyChangeListeners();
  }
};

/**
 * 删除通知
 * @param id 通知ID
 * @returns 是否成功删除
 */
export const deleteNotification = (id: string): boolean => {
  const index = notifications.findIndex(n => n.id === id);
  if (index === -1) return false;
  
  notifications.splice(index, 1);
  saveNotifications();
  notifyChangeListeners();
  
  return true;
};

/**
 * 删除所有通知
 * @param onlyRead 是否只删除已读通知
 */
export const deleteAllNotifications = (onlyRead: boolean = false): void => {
  if (onlyRead) {
    notifications = notifications.filter(n => !n.read);
  } else {
    notifications = [];
  }
  
  saveNotifications();
  notifyChangeListeners();
};

/**
 * 获取通知列表
 * @param filter 过滤条件
 * @returns 过滤后的通知列表
 */
export const getNotifications = (filter?: NotificationFilter): NotificationItem[] => {
  if (!filter) return [...notifications];
  
  return notifications.filter(notification => {
    // 按类型过滤
    if (filter.type) {
      if (Array.isArray(filter.type)) {
        if (!filter.type.includes(notification.type)) return false;
      } else if (notification.type !== filter.type) {
        return false;
      }
    }
    
    // 按优先级过滤
    if (filter.priority) {
      if (Array.isArray(filter.priority)) {
        if (!filter.priority.includes(notification.priority)) return false;
      } else if (notification.priority !== filter.priority) {
        return false;
      }
    }
    
    // 按已读状态过滤
    if (filter.read !== undefined && notification.read !== filter.read) {
      return false;
    }
    
    // 按时间范围过滤
    if (filter.startTime && notification.timestamp < filter.startTime) {
      return false;
    }
    
    if (filter.endTime && notification.timestamp > filter.endTime) {
      return false;
    }
    
    // 按搜索文本过滤
    if (filter.search) {
      const searchText = filter.search.toLowerCase();
      return (
        notification.title.toLowerCase().includes(searchText) ||
        notification.content.toLowerCase().includes(searchText)
      );
    }
    
    return true;
  });
};

/**
 * 获取未读通知数量
 * @param type 可选的通知类型过滤
 * @returns 未读通知数量
 */
export const getUnreadCount = (type?: NotificationType | NotificationType[]): number => {
  if (!type) {
    return notifications.filter(n => !n.read).length;
  }
  
  if (Array.isArray(type)) {
    return notifications.filter(n => !n.read && type.includes(n.type)).length;
  }
  
  return notifications.filter(n => !n.read && n.type === type).length;
};

/**
 * 设置通知设置
 * @param settings 新的通知设置
 */
export const setNotificationSettings = (settings: Partial<NotificationSettings>): void => {
  notificationSettings = { ...notificationSettings, ...settings };
  localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
  
  // 如果启用了桌面通知，请求权限
  if (notificationSettings.enableDesktopNotifications && 'Notification' in window) {
    Notification.requestPermission();
  }
};

/**
 * 获取当前通知设置
 * @returns 当前通知设置
 */
export const getNotificationSettings = (): NotificationSettings => {
  return { ...notificationSettings };
};

/**
 * 注册通知变化监听器
 * @param listener 监听器函数
 */
export const registerNotificationChangeListener = (listener: NotificationChangeListener): void => {
  notificationChangeListeners.push(listener);
};

/**
 * 注销通知变化监听器
 * @param listener 监听器函数
 */
export const unregisterNotificationChangeListener = (listener: NotificationChangeListener): void => {
  const index = notificationChangeListeners.indexOf(listener);
  if (index !== -1) {
    notificationChangeListeners.splice(index, 1);
  }
};

/**
 * 显示通知弹窗
 * @param notificationItem 通知项
 */
const showNotificationPopup = (notificationItem: NotificationItem): void => {
  // 使用Ant Design通知组件
  let notificationType: any = 'info';
  
  switch (notificationItem.type) {
    case NotificationType.SUCCESS:
      notificationType = 'success';
      break;
    case NotificationType.WARNING:
      notificationType = 'warning';
      break;
    case NotificationType.ERROR:
      notificationType = 'error';
      break;
    default:
      notificationType = 'info';
  }
  
  // 显示Ant Design通知
  (notification as any)[notificationType]({
    message: notificationItem.title,
    description: notificationItem.content,
    duration: notificationSettings.notificationDisplayTime,
    onClick: () => {
      // 点击通知时标记为已读
      markAsRead(notificationItem.id);
      
      // 如果有链接，跳转到链接
      if (notificationItem.link) {
        window.location.href = notificationItem.link;
      }
    }
  });
  
  // 如果启用了桌面通知，显示桌面通知
  if (notificationSettings.enableDesktopNotifications && 'Notification' in window && Notification.permission === 'granted') {
    const desktopNotification = new Notification(notificationItem.title, {
      body: notificationItem.content,
      icon: '/favicon.ico' // 可以替换为应用图标
    });
    
    desktopNotification.onclick = () => {
      window.focus();
      markAsRead(notificationItem.id);
      
      if (notificationItem.link) {
        window.location.href = notificationItem.link;
      }
      
      desktopNotification.close();
    };
  }
  
  // 如果启用了声音通知，播放声音
  if (notificationSettings.enableSoundNotifications) {
    playNotificationSound(notificationItem.priority);
  }
};

/**
 * 播放通知声音
 * @param priority 通知优先级
 */
const playNotificationSound = (priority: NotificationPriority): void => {
  // 在实际应用中，这里可以根据不同优先级播放不同的声音
  // 这里只是一个简单的示例
  try {
    const audio = new Audio();
    
    switch (priority) {
      case NotificationPriority.URGENT:
        audio.src = '/sounds/urgent.mp3';
        break;
      case NotificationPriority.HIGH:
        audio.src = '/sounds/high.mp3';
        break;
      default:
        audio.src = '/sounds/notification.mp3';
    }
    
    audio.play().catch(error => {
      console.error('播放通知声音失败:', error);
    });
  } catch (error) {
    console.error('播放通知声音失败:', error);
  }
};

/**
 * 保存通知到本地存储
 */
const saveNotifications = (): void => {
  try {
    localStorage.setItem('userNotifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('保存通知数据失败:', error);
  }
};

/**
 * 清理过期通知
 */
const cleanExpiredNotifications = (): void => {
  const now = Date.now();
  let changed = false;
  
  // 清理过期的通知
  notifications = notifications.filter(notification => {
    if (notification.expireAt && notification.expireAt < now) {
      changed = true;
      return false;
    }
    return true;
  });
  
  // 清理超过自动删除天数的已读通知
  if (notificationSettings.autoDeleteAfterDays > 0) {
    const cutoffTime = now - (notificationSettings.autoDeleteAfterDays * 24 * 60 * 60 * 1000);
    
    const oldLength = notifications.length;
    notifications = notifications.filter(notification => {
      return !notification.read || notification.timestamp >= cutoffTime;
    });
    
    if (oldLength !== notifications.length) {
      changed = true;
    }
  }
  
  if (changed) {
    saveNotifications();
  }
};

/**
 * 生成唯一ID
 * @returns 唯一ID
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * 通知所有监听器
 */
const notifyChangeListeners = (): void => {
  notificationChangeListeners.forEach(listener => {
    try {
      listener([...notifications]);
    } catch (error) {
      console.error('通知变化监听器执行失败:', error);
    }
  });
};

/**
 * 创建系统通知
 * @param title 通知标题
 * @param content 通知内容
 * @param priority 通知优先级
 * @param link 可选的链接
 * @returns 通知ID
 */
export const createSystemNotification = (
  title: string,
  content: string,
  priority: NotificationPriority = NotificationPriority.NORMAL,
  link?: string
): string => {
  return addNotification({
    title,
    content,
    type: NotificationType.SYSTEM,
    priority,
    link
  });
};

/**
 * 创建用户相关通知
 * @param title 通知标题
 * @param content 通知内容
 * @param priority 通知优先级
 * @param link 可选的链接
 * @returns 通知ID
 */
export const createUserNotification = (
  title: string,
  content: string,
  priority: NotificationPriority = NotificationPriority.NORMAL,
  link?: string
): string => {
  return addNotification({
    title,
    content,
    type: NotificationType.USER,
    priority,
    link
  });
};

/**
 * 创建安全相关通知
 * @param title 通知标题
 * @param content 通知内容
 * @param priority 通知优先级
 * @param link 可选的链接
 * @returns 通知ID
 */
export const createSecurityNotification = (
  title: string,
  content: string,
  priority: NotificationPriority = NotificationPriority.HIGH,
  link?: string
): string => {
  return addNotification({
    title,
    content,
    type: NotificationType.SECURITY,
    priority,
    link
  });
};