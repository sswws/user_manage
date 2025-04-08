/**
 * 安全管理器
 * 提供密码策略验证和账户锁定机制
 */

import { message } from 'antd';

// 密码策略配置接口
export interface PasswordPolicy {
  minLength: number;           // 最小长度
  requireUppercase: boolean;    // 是否需要大写字母
  requireLowercase: boolean;    // 是否需要小写字母
  requireNumbers: boolean;      // 是否需要数字
  requireSymbols: boolean;      // 是否需要特殊符号
  maxRepeatedChars: number;     // 最大重复字符数
  preventCommonPasswords: boolean; // 是否禁止常见密码
  preventUserInfoInPassword: boolean; // 是否禁止使用用户信息作为密码
  passwordHistoryCount: number; // 密码历史记录数量
  expirationDays: number;       // 密码过期天数
}

// 账户锁定策略配置接口
export interface AccountLockPolicy {
  maxLoginAttempts: number;     // 最大登录尝试次数
  lockDuration: number;         // 锁定时长（分钟）
  resetAttemptsAfter: number;   // 重置尝试次数的时间（分钟）
  notifyUserOnLock: boolean;    // 锁定时是否通知用户
  allowAdminUnlock: boolean;    // 是否允许管理员解锁
  preventCommonUsernames: boolean; // 是否禁止常见用户名
}

// 默认密码策略
export const defaultPasswordPolicy: PasswordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: false,
  maxRepeatedChars: 3,
  preventCommonPasswords: true,
  preventUserInfoInPassword: true,
  passwordHistoryCount: 5,
  expirationDays: 90
};

// 默认账户锁定策略
export const defaultAccountLockPolicy: AccountLockPolicy = {
  maxLoginAttempts: 5,
  lockDuration: 30,
  resetAttemptsAfter: 15,
  notifyUserOnLock: true,
  allowAdminUnlock: true,
  preventCommonUsernames: true
};

// 当前策略
let currentPasswordPolicy: PasswordPolicy = { ...defaultPasswordPolicy };
let currentAccountLockPolicy: AccountLockPolicy = { ...defaultAccountLockPolicy };

// 常见密码列表（示例）
const commonPasswords = [
  'password', 'password123', '123456', '12345678', 'qwerty',
  'admin', 'admin123', 'welcome', 'welcome123', 'letmein'
];

// 登录尝试记录
interface LoginAttemptRecord {
  username: string;
  attempts: number;
  lastAttemptTime: number;
  lockedUntil: number | null;
}

const loginAttempts: Record<string, LoginAttemptRecord> = {};

/**
 * 初始化安全管理器
 */
export const initSecurityManager = (): void => {
  // 从本地存储加载策略设置
  try {
    const savedPasswordPolicy = localStorage.getItem('passwordPolicy');
    if (savedPasswordPolicy) {
      currentPasswordPolicy = { ...currentPasswordPolicy, ...JSON.parse(savedPasswordPolicy) };
    }
    
    const savedAccountLockPolicy = localStorage.getItem('accountLockPolicy');
    if (savedAccountLockPolicy) {
      currentAccountLockPolicy = { ...currentAccountLockPolicy, ...JSON.parse(savedAccountLockPolicy) };
    }
  } catch (error) {
    console.error('加载安全策略设置失败:', error);
  }
};

/**
 * 设置密码策略
 * @param policy 密码策略配置
 */
export const setPasswordPolicy = (policy: Partial<PasswordPolicy>): void => {
  currentPasswordPolicy = { ...currentPasswordPolicy, ...policy };
  localStorage.setItem('passwordPolicy', JSON.stringify(currentPasswordPolicy));
};

/**
 * 设置账户锁定策略
 * @param policy 账户锁定策略配置
 */
export const setAccountLockPolicy = (policy: Partial<AccountLockPolicy>): void => {
  currentAccountLockPolicy = { ...currentAccountLockPolicy, ...policy };
  localStorage.setItem('accountLockPolicy', JSON.stringify(currentAccountLockPolicy));
};

/**
 * 获取当前密码策略
 * @returns 当前密码策略
 */
export const getPasswordPolicy = (): PasswordPolicy => {
  return { ...currentPasswordPolicy };
};

/**
 * 获取当前账户锁定策略
 * @returns 当前账户锁定策略
 */
export const getAccountLockPolicy = (): AccountLockPolicy => {
  return { ...currentAccountLockPolicy };
};

/**
 * 验证密码是否符合策略
 * @param password 密码
 * @param userInfo 用户信息（用于检查密码中是否包含用户信息）
 * @returns 验证结果，包含是否通过和错误信息
 */
export const validatePassword = (password: string, userInfo?: { username?: string; name?: string; email?: string }): { valid: boolean; message: string } => {
  const policy = currentPasswordPolicy;
  
  // 检查密码长度
  if (password.length < policy.minLength) {
    return { valid: false, message: `密码长度必须至少为${policy.minLength}个字符` };
  }
  
  // 检查是否包含大写字母
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    return { valid: false, message: '密码必须包含至少一个大写字母' };
  }
  
  // 检查是否包含小写字母
  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    return { valid: false, message: '密码必须包含至少一个小写字母' };
  }
  
  // 检查是否包含数字
  if (policy.requireNumbers && !/[0-9]/.test(password)) {
    return { valid: false, message: '密码必须包含至少一个数字' };
  }
  
  // 检查是否包含特殊符号
  if (policy.requireSymbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: '密码必须包含至少一个特殊符号' };
  }
  
  // 检查重复字符
  if (policy.maxRepeatedChars > 0) {
    const repeatedCharsRegex = new RegExp(`(.)\\1{${policy.maxRepeatedChars},}`);
    if (repeatedCharsRegex.test(password)) {
      return { valid: false, message: `密码不能包含${policy.maxRepeatedChars + 1}个或更多连续重复的字符` };
    }
  }
  
  // 检查常见密码
  if (policy.preventCommonPasswords && commonPasswords.includes(password.toLowerCase())) {
    return { valid: false, message: '密码过于简单，请使用更复杂的密码' };
  }
  
  // 检查是否包含用户信息
  if (policy.preventUserInfoInPassword && userInfo) {
    const userInfoValues = Object.values(userInfo).filter(Boolean).map(value => value!.toLowerCase());
    for (const value of userInfoValues) {
      if (value.length > 3 && password.toLowerCase().includes(value)) {
        return { valid: false, message: '密码不能包含用户名、姓名或邮箱信息' };
      }
    }
  }
  
  return { valid: true, message: '密码符合要求' };
};

/**
 * 记录登录尝试
 * @param username 用户名
 * @param success 是否登录成功
 * @returns 账户状态信息
 */
export const recordLoginAttempt = (username: string, success: boolean): { locked: boolean; remainingAttempts: number; lockDuration: number | null } => {
  const now = Date.now();
  const policy = currentAccountLockPolicy;
  
  // 初始化或获取登录尝试记录
  if (!loginAttempts[username]) {
    loginAttempts[username] = {
      username,
      attempts: 0,
      lastAttemptTime: now,
      lockedUntil: null
    };
  }
  
  const record = loginAttempts[username];
  
  // 检查是否已锁定
  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingLockTime = Math.ceil((record.lockedUntil - now) / 60000); // 转换为分钟
    return { locked: true, remainingAttempts: 0, lockDuration: remainingLockTime };
  }
  
  // 检查是否需要重置尝试次数
  if (record.lastAttemptTime && (now - record.lastAttemptTime) > policy.resetAttemptsAfter * 60000) {
    record.attempts = 0;
    record.lockedUntil = null;
  }
  
  // 更新记录
  record.lastAttemptTime = now;
  
  if (success) {
    // 登录成功，重置尝试次数
    record.attempts = 0;
    record.lockedUntil = null;
    return { locked: false, remainingAttempts: policy.maxLoginAttempts, lockDuration: null };
  } else {
    // 登录失败，增加尝试次数
    record.attempts += 1;
    
    // 检查是否需要锁定账户
    if (record.attempts >= policy.maxLoginAttempts) {
      record.lockedUntil = now + policy.lockDuration * 60000; // 锁定时间（毫秒）
      
      // 如果配置了通知用户，这里可以添加通知逻辑
      if (policy.notifyUserOnLock) {
        console.log(`账户 ${username} 已被锁定，持续时间: ${policy.lockDuration}分钟`);
        // 在实际应用中，这里可以发送邮件或其他通知
      }
      
      return { locked: true, remainingAttempts: 0, lockDuration: policy.lockDuration };
    }
    
    return { 
      locked: false, 
      remainingAttempts: policy.maxLoginAttempts - record.attempts,
      lockDuration: null
    };
  }
};

/**
 * 检查账户是否被锁定
 * @param username 用户名
 * @returns 锁定状态信息
 */
export const checkAccountLockStatus = (username: string): { locked: boolean; remainingLockTime: number | null } => {
  const record = loginAttempts[username];
  const now = Date.now();
  
  if (!record || !record.lockedUntil) {
    return { locked: false, remainingLockTime: null };
  }
  
  if (record.lockedUntil > now) {
    const remainingTime = Math.ceil((record.lockedUntil - now) / 60000); // 转换为分钟
    return { locked: true, remainingLockTime: remainingTime };
  }
  
  // 锁定已过期
  record.lockedUntil = null;
  return { locked: false, remainingLockTime: null };
};

/**
 * 管理员解锁账户
 * @param username 用户名
 * @returns 是否成功解锁
 */
export const adminUnlockAccount = (username: string): boolean => {
  const record = loginAttempts[username];
  
  if (!record) {
    return false;
  }
  
  if (!currentAccountLockPolicy.allowAdminUnlock) {
    return false;
  }
  
  record.attempts = 0;
  record.lockedUntil = null;
  return true;
};

/**
 * 获取密码强度评分（0-100）
 * @param password 密码
 * @returns 密码强度评分和描述
 */
export const getPasswordStrength = (password: string): { score: number; level: string; color: string } => {
  if (!password) {
    return { score: 0, level: '无', color: '#ff4d4f' };
  }
  
  let score = 0;
  
  // 基础长度分数
  score += Math.min(password.length * 4, 40);
  
  // 字符类型多样性加分
  if (/[A-Z]/.test(password)) score += 10; // 大写字母
  if (/[a-z]/.test(password)) score += 10; // 小写字母
  if (/[0-9]/.test(password)) score += 10; // 数字
  if (/[^A-Za-z0-9]/.test(password)) score += 15; // 特殊字符
  
  // 字符分布加分
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  
  const typesCount = [hasLowercase, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;
  score += (typesCount - 1) * 5;
  
  // 重复字符扣分
  const repeats = password.match(/(.+)\1+/g);
  if (repeats) {
    score -= repeats.length * 5;
  }
  
  // 连续字符扣分（如abc, 123）
  let consecutiveCount = 0;
  for (let i = 0; i < password.length - 1; i++) {
    if (password.charCodeAt(i + 1) - password.charCodeAt(i) === 1) {
      consecutiveCount++;
    }
  }
  score -= consecutiveCount * 2;
  
  // 确保分数在0-100范围内
  score = Math.max(0, Math.min(100, score));
  
  // 确定强度级别
  let level: string;
  let color: string;
  
  if (score < 30) {
    level = '非常弱';
    color = '#ff4d4f';
  } else if (score < 50) {
    level = '弱';
    color = '#faad14';
  } else if (score < 70) {
    level = '中等';
    color = '#1890ff';
  } else if (score < 90) {
    level = '强';
    color = '#52c41a';
  } else {
    level = '非常强';
    color = '#13c2c2';
  }
  
  return { score, level, color };
};