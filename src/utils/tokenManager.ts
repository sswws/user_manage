/**
 * Token管理器
 * 提供token的存储、验证和刷新功能
 */

import { loginEvent } from '../App';

// Token信息接口
export interface TokenInfo {
  token: string;
  expiration: number; // 过期时间戳
  refreshToken?: string;
}

// 默认过期时间（7天）
const DEFAULT_EXPIRATION_DAYS = 7;

/**
 * 保存token到localStorage
 * @param token 用户token
 * @param expirationDays token有效期（天数）
 */
export const saveToken = (token: string, expirationDays: number = DEFAULT_EXPIRATION_DAYS): void => {
  try {
    // 计算过期时间
    const expirationTime = new Date().getTime() + expirationDays * 24 * 60 * 60 * 1000;
    
    // 创建token信息对象
    const tokenInfo: TokenInfo = {
      token,
      expiration: expirationTime,
    };
    
    // 保存到localStorage
    localStorage.setItem('userToken', token);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
    localStorage.setItem('tokenInfo', JSON.stringify(tokenInfo));
    
    // 触发登录状态变化事件
    loginEvent.dispatchEvent(new Event('loginChange'));
  } catch (error) {
    console.error('保存token失败:', error);
  }
};

/**
 * 获取当前token
 * @returns token字符串或null
 */
export const getToken = (): string | null => {
  return localStorage.getItem('userToken');
};

/**
 * 检查token是否有效
 * @returns 是否有效
 */
export const isTokenValid = (): boolean => {
  try {
    const token = localStorage.getItem('userToken');
    const expirationStr = localStorage.getItem('tokenExpiration');
    
    if (!token || !expirationStr) {
      return false;
    }
    
    const expiration = parseInt(expirationStr, 10);
    const currentTime = new Date().getTime();
    
    return currentTime < expiration;
  } catch (error) {
    console.error('检查token有效性失败:', error);
    return false;
  }
};

/**
 * 清除token
 */
export const clearToken = (): void => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('tokenExpiration');
  localStorage.removeItem('tokenInfo');
  
  // 触发登录状态变化事件
  loginEvent.dispatchEvent(new Event('loginChange'));
};

/**
 * 刷新token有效期
 * @param expirationDays 新的有效期（天数）
 */
export const refreshTokenExpiration = (expirationDays: number = DEFAULT_EXPIRATION_DAYS): void => {
  try {
    const token = localStorage.getItem('userToken');
    
    if (token) {
      // 重新设置过期时间
      const expirationTime = new Date().getTime() + expirationDays * 24 * 60 * 60 * 1000;
      localStorage.setItem('tokenExpiration', expirationTime.toString());
      
      // 更新tokenInfo
      const tokenInfoStr = localStorage.getItem('tokenInfo');
      if (tokenInfoStr) {
        const tokenInfo: TokenInfo = JSON.parse(tokenInfoStr);
        tokenInfo.expiration = expirationTime;
        localStorage.setItem('tokenInfo', JSON.stringify(tokenInfo));
      }
    }
  } catch (error) {
    console.error('刷新token有效期失败:', error);
  }
};

/**
 * 初始化token管理器
 */
export const initTokenManager = (): void => {
  // 检查token有效性
  if (!isTokenValid()) {
    clearToken();
  } else {
    // 如果token有效，触发登录状态变化事件，确保应用知道用户已登录
    loginEvent.dispatchEvent(new Event('loginChange'));
  }
  
  // 设置定期检查
  setInterval(() => {
    if (!isTokenValid()) {
      clearToken();
    }
  }, 5 * 60 * 1000); // 每5分钟检查一次
};