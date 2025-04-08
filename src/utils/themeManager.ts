/**
 * 主题管理器
 * 提供主题切换和界面个性化设置功能
 */

import { message } from 'antd';

// 主题类型
export enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark',
  CUSTOM = 'custom',
}

// 主题配置接口
export interface ThemeConfig {
  type: ThemeType;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  borderRadius: number;
  compact: boolean;
  customCss?: string;
}

// 默认主题配置
export const defaultLightTheme: ThemeConfig = {
  type: ThemeType.LIGHT,
  primaryColor: '#1890ff',
  secondaryColor: '#52c41a',
  backgroundColor: '#f0f2f5',
  textColor: '#000000',
  fontSize: 14,
  borderRadius: 4,
  compact: false,
};

export const defaultDarkTheme: ThemeConfig = {
  type: ThemeType.DARK,
  primaryColor: '#177ddc',
  secondaryColor: '#49aa19',
  backgroundColor: '#141414',
  textColor: '#ffffff',
  fontSize: 14,
  borderRadius: 4,
  compact: false,
};

// 存储当前主题配置
let currentTheme: ThemeConfig = { ...defaultLightTheme };

// 主题变化监听器
type ThemeChangeListener = (theme: ThemeConfig) => void;
const themeChangeListeners: ThemeChangeListener[] = [];

/**
 * 初始化主题管理器
 */
export const initThemeManager = (): void => {
  // 尝试从本地存储加载主题设置
  try {
    const savedTheme = localStorage.getItem('userTheme');
    if (savedTheme) {
      currentTheme = JSON.parse(savedTheme);
      applyTheme(currentTheme);
    } else {
      // 检查系统是否为暗色模式
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme(defaultDarkTheme);
      } else {
        setTheme(defaultLightTheme);
      }
    }
  } catch (error) {
    console.error('加载主题设置失败:', error);
    setTheme(defaultLightTheme);
  }
  
  // 监听系统主题变化
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (currentTheme.type !== ThemeType.CUSTOM) {
        setTheme(e.matches ? defaultDarkTheme : defaultLightTheme);
      }
    });
  }
};

/**
 * 设置主题
 * @param theme 主题配置
 */
export const setTheme = (theme: Partial<ThemeConfig>): void => {
  currentTheme = { ...currentTheme, ...theme };
  
  // 保存到本地存储
  localStorage.setItem('userTheme', JSON.stringify(currentTheme));
  
  // 应用主题
  applyTheme(currentTheme);
  
  // 通知监听器
  notifyThemeChangeListeners();
};

/**
 * 应用主题到DOM
 * @param theme 主题配置
 */
const applyTheme = (theme: ThemeConfig): void => {
  const root = document.documentElement;
  
  // 设置CSS变量
  root.style.setProperty('--primary-color', theme.primaryColor);
  root.style.setProperty('--secondary-color', theme.secondaryColor);
  root.style.setProperty('--background-color', theme.backgroundColor);
  root.style.setProperty('--text-color', theme.textColor);
  root.style.setProperty('--font-size', `${theme.fontSize}px`);
  root.style.setProperty('--border-radius', `${theme.borderRadius}px`);
  
  // 设置主题类型
  document.body.className = document.body.className
    .replace(/theme-(light|dark|custom)/g, '')
    .trim();
  document.body.classList.add(`theme-${theme.type}`);
  
  // 设置紧凑模式
  if (theme.compact) {
    document.body.classList.add('compact-mode');
  } else {
    document.body.classList.remove('compact-mode');
  }
  
  // 应用自定义CSS
  let customStyleElement = document.getElementById('custom-theme-style');
  if (!customStyleElement) {
    customStyleElement = document.createElement('style');
    customStyleElement.id = 'custom-theme-style';
    document.head.appendChild(customStyleElement);
  }
  
  customStyleElement.textContent = theme.customCss || '';
};

/**
 * 获取当前主题
 * @returns 当前主题配置
 */
export const getCurrentTheme = (): ThemeConfig => {
  return { ...currentTheme };
};

/**
 * 重置为默认主题
 * @param themeType 主题类型
 */
export const resetToDefaultTheme = (themeType: ThemeType = ThemeType.LIGHT): void => {
  if (themeType === ThemeType.DARK) {
    setTheme(defaultDarkTheme);
  } else {
    setTheme(defaultLightTheme);
  }
  message.success('主题已重置为默认设置');
};

/**
 * 注册主题变化监听器
 * @param listener 监听器函数
 */
export const registerThemeChangeListener = (listener: ThemeChangeListener): void => {
  themeChangeListeners.push(listener);
};

/**
 * 注销主题变化监听器
 * @param listener 监听器函数
 */
export const unregisterThemeChangeListener = (listener: ThemeChangeListener): void => {
  const index = themeChangeListeners.indexOf(listener);
  if (index !== -1) {
    themeChangeListeners.splice(index, 1);
  }
};

/**
 * 通知所有主题变化监听器
 */
const notifyThemeChangeListeners = (): void => {
  themeChangeListeners.forEach(listener => {
    try {
      listener(currentTheme);
    } catch (error) {
      console.error('主题变化监听器执行失败:', error);
    }
  });
};