import React, { useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { UserOutlined, DashboardOutlined, TeamOutlined, LogoutOutlined, SettingOutlined, FileTextOutlined, BarChartOutlined, ProfileOutlined, CalendarOutlined, ScheduleOutlined, DollarOutlined, StarOutlined } from '@ant-design/icons';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { loginEvent } from '../../App';
import './AppLayout.css';

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('userName') || 'Admin';

  // 获取当前选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return ['dashboard'];
    if (path.includes('/users')) return ['users'];
    if (path.includes('/roles')) return ['roles'];
    if (path.includes('/logs')) return ['logs'];
    if (path.includes('/statistics')) return ['statistics'];
    if (path.includes('/settings')) return ['settings'];
    if (path.includes('/profile')) return ['profile'];
    if (path.includes('/attendance')) return ['attendance'];
    if (path.includes('/leave')) return ['leave'];
    return ['dashboard'];
  };

  // 检查token是否过期
  useEffect(() => {
    const checkTokenExpiration = () => {
      // 使用tokenManager检查token有效性
      import('../../utils/tokenManager').then(({ isTokenValid }) => {
        if (!isTokenValid()) {
          handleLogout();
        }
      });
    };
    
    // 延迟初始检查，避免页面刷新时立即登出
    const initialCheckTimeout = setTimeout(checkTokenExpiration, 1000);
    
    // 定期检查token有效性（每10分钟检查一次）
    const intervalId = setInterval(checkTokenExpiration, 10 * 60 * 1000);
    
    return () => {
      clearTimeout(initialCheckTimeout);
      clearInterval(intervalId);
    };
  }, []);

  // 处理登出
  const handleLogout = () => {
    // 使用tokenManager清除token
    import('../../utils/tokenManager').then(({ clearToken }) => {
      clearToken();
    });
    
    // 清除其他用户相关信息
    localStorage.removeItem('userName');
    localStorage.removeItem('userInfo');
    
    // 跳转到登录页面
    navigate('/login');
  };

  const userMenu = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="logo">用户管理系统</div>
        <div className="user-info">
          <Dropdown menu={{ items: userMenu }} placement="bottomRight">
            <span className="user-dropdown">
              <Avatar icon={<UserOutlined />} />
              <span className="username">{userName}</span>
            </span>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="app-sider">
          <Menu
            mode="inline"
            selectedKeys={getSelectedKey()}
            style={{ height: '100%', borderRight: 0 }}
            items={[
              {
                key: 'dashboard',
                icon: <DashboardOutlined />,
                label: <Link to="/dashboard">控制台</Link>,
              },
              {
                key: 'users',
                icon: <TeamOutlined />,
                label: <Link to="/users">用户管理</Link>,
              },
              {
                key: 'roles',
                icon: <TeamOutlined />,
                label: <Link to="/roles">角色管理</Link>,
              },
              {
                type: 'divider',
              },
              {
                key: 'hr',
                icon: <TeamOutlined />,
                label: '人力资源',
                children: [
                  {
                    key: 'attendance',
                    icon: <CalendarOutlined />,
                    label: <Link to="/attendance">考勤管理</Link>,
                  },
                  {
                    key: 'leave',
                    icon: <ScheduleOutlined />,
                    label: <Link to="/leave">请假管理</Link>,
                  },
                  {
                    key: 'employee',
                    icon: <UserOutlined />,
                    label: <Link to="/employee">员工档案</Link>,
                  },
                  {
                    key: 'salary',
                    icon: <DollarOutlined />,
                    label: <Link to="/salary">薪资管理</Link>,
                  },
                  {
                    key: 'performance',
                    icon: <StarOutlined />,
                    label: <Link to="/performance">绩效考核</Link>,
                  },
                ],
              },
              {
                type: 'divider',
              },
              {
                key: 'logs',
                icon: <FileTextOutlined />,
                label: <Link to="/logs">日志审计</Link>,
              },
              {
                key: 'statistics',
                icon: <BarChartOutlined />,
                label: <Link to="/statistics">数据统计</Link>,
              },
              {
                key: 'settings',
                icon: <SettingOutlined />,
                label: <Link to="/settings">系统设置</Link>,
              },
              {
                key: 'profile',
                icon: <ProfileOutlined />,
                label: <Link to="/profile">个人资料</Link>,
              },
            ]}
          />
        </Sider>
        <Layout className="site-layout">
          <Content className="site-content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;