import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, SolutionOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  // 模拟数据
  const stats = {
    totalUsers: 256,
    activeUsers: 198,
    newUsers: 24,
    roles: 5,
  };

  return (
    <div className="dashboard-container">
      <h2>系统概览</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={stats.activeUsers}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="新增用户"
              value={stats.newUsers}
              prefix={<SolutionOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="角色数量"
              value={stats.roles}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <div className="dashboard-section">
        <h3>最近活动</h3>
        <Card>
          <p>• 管理员更新了用户权限设置 - 10分钟前</p>
          <p>• 新用户张三注册成功 - 2小时前</p>
          <p>• 系统完成了数据备份 - 6小时前</p>
          <p>• 李四修改了个人信息 - 1天前</p>
        </Card>
      </div>

      <div className="dashboard-section">
        <h3>系统公告</h3>
        <Card>
          <p>• 系统将于本周日凌晨2点-4点进行例行维护，请提前做好准备。</p>
          <p>• 新版本用户管理功能已上线，支持批量导入导出。</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;