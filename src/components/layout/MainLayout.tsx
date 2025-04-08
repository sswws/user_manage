import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  TeamOutlined,
  DashboardOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="logo" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={[
            {
              key: '/dashboard',
              icon: <DashboardOutlined />,
              label: '仪表盘',
              onClick: () => handleMenuClick('/dashboard'),
            },
            {
              key: '/users',
              icon: <UserOutlined />,
              label: '用户管理',
              onClick: () => handleMenuClick('/users'),
            },
            {
              key: '/roles',
              icon: <TeamOutlined />,
              label: '角色管理',
              onClick: () => handleMenuClick('/roles'),
            },
            {
              key: '/logout',
              icon: <LogoutOutlined />,
              label: '退出登录',
              onClick: () => {
                // 处理登出逻辑
                navigate('/login');
              },
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          用户管理系统 ©{new Date().getFullYear()} Created by Admin
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;