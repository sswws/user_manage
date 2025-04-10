import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, App as AntdApp, message } from 'antd'
import './App.css'

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
import AppLayout from './components/layout/AppLayout'

// 创建自定义事件，用于通知登录状态变化
export const loginEvent = new EventTarget();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // 检查用户是否已登录
    const token = localStorage.getItem('userToken')
    setIsAuthenticated(!!token)
    
    // 监听登录状态变化事件
    const handleLoginChange = () => {
      const token = localStorage.getItem('userToken')
      setIsAuthenticated(!!token)
    }
    
    loginEvent.addEventListener('loginChange', handleLoginChange)
    
    return () => {
      loginEvent.removeEventListener('loginChange', handleLoginChange)
    }
  }, [])

  // 初始化主题管理器
  useEffect(() => {
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
            </Route>
          </Routes>
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
