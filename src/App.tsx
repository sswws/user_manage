import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { ConfigProvider, App as AntdApp, message } from 'antd'
import './App.css'
import { isTokenValid, initTokenManager } from './utils/tokenManager'

// 配置全局message，确保消息显示在页面顶部
message.config({
  top: 65,
  duration: 2,
  maxCount: 3
})

// 导入组件
import Login from './pages/login/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Users from './pages/users/Users'
import Roles from './pages/roles/Roles'
import Logs from './pages/logs/Logs'
import Statistics from './pages/statistics/Statistics'
import Settings from './pages/settings/Settings'
import Profile from './pages/profile/Profile'
import Attendance from './pages/attendance/Attendance'
import Leave from './pages/leave/Leave'
import Employee from './pages/employee/Employee'
import Salary from './pages/salary/Salary'
import Performance from './pages/performance/Performance'
import AppLayout from './components/layout/AppLayout'

// 创建自定义事件，用于通知登录状态变化
export const loginEvent = new EventTarget();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // 检查用户是否已登录
    const checkAuthStatus = () => {
      // 使用tokenManager检查token是否有效
      const isValid = isTokenValid();
      setIsAuthenticated(isValid);
    }
    
    // 初始检查登录状态
    checkAuthStatus()
    
    // 监听登录状态变化事件
    const handleLoginChange = () => {
      checkAuthStatus()
    }
    
    // 监听页面可见性变化，当用户从其他标签页回来时重新检查登录状态
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuthStatus()
      }
    }
    
    // 监听页面刷新前的状态保存
    const handleBeforeUnload = () => {
      // 确保token在localStorage中已经保存，这里不需要额外操作
      // localStorage是持久化的，刷新页面不会丢失数据
    }
    
    // 添加各种事件监听器
    loginEvent.addEventListener('loginChange', handleLoginChange)
    window.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    // 定期检查token有效性（每分钟检查一次）
    const intervalId = setInterval(checkAuthStatus, 60 * 1000);
    
    return () => {
      // 清理事件监听器
      loginEvent.removeEventListener('loginChange', handleLoginChange)
      window.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      clearInterval(intervalId)
    }
  }, [])

  // 初始化主题管理器
  useEffect(() => {
    // 初始化主题管理器
    import('./utils/themeManager').then(({ initThemeManager }) => {
      initThemeManager();
    });
    
    // 初始化安全管理器
    import('./utils/securityManager').then(({ initSecurityManager }) => {
      initSecurityManager();
    });
    
    // 初始化通知管理器
    import('./utils/notificationManager').then(({ initNotificationManager }) => {
      initNotificationManager();
    });
    
    // 初始化token管理器
    initTokenManager();
  }, []);
  
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <AntdApp>
        <BrowserRouter>
          {/* 添加AuthChecker组件检查登录状态并处理重定向 */}
          <AuthChecker />
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* 受保护的路由 */}
            <Route path="/" element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" />}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="roles" element={<Roles />} />
              <Route path="logs" element={<Logs />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="leave" element={<Leave />} />
              <Route path="employee" element={<Employee />} />
              <Route path="salary" element={<Salary />} />
              <Route path="performance" element={<Performance />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  )
}

// 创建一个组件来使用useNavigate钩子
const AuthChecker = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // 检查token是否有效，如果有效且在登录页则重定向到仪表盘
    if (isTokenValid() && window.location.pathname === '/login') {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  return null;
};

export default App
