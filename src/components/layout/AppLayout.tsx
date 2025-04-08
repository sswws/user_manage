import React from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { UserOutlined, DashboardOutlined, TeamOutlined, LogoutOutlined, SettingOutlined, FileTextOutlined, BarChartOutlined, ProfileOutlined } from '@ant-design/icons';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
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
    return ['dashboard'];
  };

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
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