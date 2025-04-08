// 模拟用户数据
export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  role: string;
  avatar?: string;
}

export const users: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: '管理员',
    role: 'admin',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    username: 'user',
    password: 'user123',
    name: '普通用户',
    role: 'user',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 3,
    username: 'guest',
    password: 'guest123',
    name: '访客',
    role: 'guest'
  }
];

// 模拟登录API
export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: Omit<User, 'password'>;
}

// 模拟用户操作响应
export interface UserResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const mockLogin = (username: string, password: string): Promise<LoginResponse> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      const user = users.find(u => u.username === username && u.password === password);
      
      if (user) {
        // 登录成功
        const { password, ...userWithoutPassword } = user;
        resolve({
          success: true,
          message: '登录成功',
          token: `mock-token-${user.id}-${Date.now()}`,
          user: userWithoutPassword
        });
      } else {
        // 登录失败
        resolve({
          success: false,
          message: '用户名或密码错误'
        });
      }
    }, 800); // 模拟800ms的网络延迟
  });
};

// 模拟获取所有用户
export const mockGetUsers = (): Promise<UserResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const usersWithoutPassword = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      resolve({
        success: true,
        message: '获取用户列表成功',
        data: usersWithoutPassword
      });
    }, 500);
  });
};

// 模拟删除用户
export const mockDeleteUser = (id: number): Promise<UserResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userIndex = users.findIndex(user => user.id === id);
      
      if (userIndex !== -1) {
        // 在实际应用中，这里会调用API删除用户
        // 这里我们只是从数组中移除
        users.splice(userIndex, 1);
        
        resolve({
          success: true,
          message: '用户删除成功'
        });
      } else {
        resolve({
          success: false,
          message: '用户不存在'
        });
      }
    }, 500);
  });
};

// 模拟添加或更新用户
export const mockSaveUser = (user: Partial<User>): Promise<UserResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (user.id) {
        // 更新用户
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...user };
          
          const { password, ...userWithoutPassword } = users[userIndex];
          
          resolve({
            success: true,
            message: '用户更新成功',
            data: userWithoutPassword
          });
        } else {
          resolve({
            success: false,
            message: '用户不存在'
          });
        }
      } else {
        // 添加新用户
        const newId = Math.max(...users.map(u => u.id)) + 1;
        const newUser = {
          id: newId,
          username: user.username || '',
          password: user.password || '123456', // 默认密码
          name: user.name || '',
          role: user.role || 'user',
          avatar: user.avatar
        };
        
        users.push(newUser);
        
        const { password, ...userWithoutPassword } = newUser;
        
        resolve({
          success: true,
          message: '用户添加成功',
          data: userWithoutPassword
        });
      }
    }, 500);
  });
};