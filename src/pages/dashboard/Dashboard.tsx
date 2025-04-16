import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Tabs, Progress, Button, Tooltip, Spin } from 'antd';
import { UserOutlined, TeamOutlined, SolutionOutlined, ClockCircleOutlined, ReloadOutlined, BarChartOutlined, LineChartOutlined, PieChartOutlined, DashboardOutlined } from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<[string, string]>(['最近7天', '现在']);
  
  // 模拟数据
  const stats = {
    totalUsers: 256,
    activeUsers: 198,
    newUsers: 24,
    roles: 5,
    onlineUsers: 87,
    totalLogins: 1256,
    avgSessionTime: '18分钟',
  };
  
  // 用户活跃度趋势数据
  const userActivityData = [
    { date: '周一', 活跃用户: 120, 新注册: 5, 登录次数: 156 },
    { date: '周二', 活跃用户: 132, 新注册: 8, 登录次数: 187 },
    { date: '周三', 活跃用户: 101, 新注册: 3, 登录次数: 143 },
    { date: '周四', 活跃用户: 134, 新注册: 7, 登录次数: 178 },
    { date: '周五', 活跃用户: 190, 新注册: 12, 登录次数: 223 },
    { date: '周六', 活跃用户: 160, 新注册: 9, 登录次数: 190 },
    { date: '周日', 活跃用户: 120, 新注册: 4, 登录次数: 160 },
  ];
  
  // 系统资源使用数据
  const systemResourceData = [
    { time: '00:00', CPU使用率: 25, 内存使用率: 40, 磁盘使用率: 62 },
    { time: '04:00', CPU使用率: 15, 内存使用率: 35, 磁盘使用率: 62 },
    { time: '08:00', CPU使用率: 35, 内存使用率: 45, 磁盘使用率: 63 },
    { time: '12:00', CPU使用率: 45, 内存使用率: 52, 磁盘使用率: 64 },
    { time: '16:00', CPU使用率: 55, 内存使用率: 58, 磁盘使用率: 65 },
    { time: '20:00', CPU使用率: 40, 内存使用率: 50, 磁盘使用率: 65 },
    { time: '现在', CPU使用率: 35, 内存使用率: 48, 磁盘使用率: 66 },
  ];
  
  // 用户分布数据
  const userDistributionData = [
    { name: '管理员', value: 5 },
    { name: '普通用户', value: 180 },
    { name: '高级用户', value: 50 },
    { name: '访客', value: 21 },
  ];
  
  // 最近活动数据
  const recentActivities = [
    { id: 1, user: '管理员', action: '更新了用户权限设置', time: '10分钟前', type: '系统操作' },
    { id: 2, user: '张三', action: '注册成功', time: '2小时前', type: '用户操作' },
    { id: 3, user: '系统', action: '完成了数据备份', time: '6小时前', type: '系统操作' },
    { id: 4, user: '李四', action: '修改了个人信息', time: '1天前', type: '用户操作' },
    { id: 5, user: '王五', action: '重置了密码', time: '1天前', type: '用户操作' },
    { id: 6, user: '系统', action: '执行了定时任务', time: '2天前', type: '系统操作' },
  ];
  
  // 模拟数据加载
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2><DashboardOutlined /> 系统概览</h2>
        <div className="dashboard-actions">
          <Tooltip title="刷新数据">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={refreshData} 
              loading={loading}
              style={{ marginRight: 8 }}
            >
              刷新
            </Button>
          </Tooltip>
          <RangePicker style={{ marginLeft: 8 }} />
        </div>
      </div>
      
      <Spin spinning={loading}>
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
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="当前在线用户"
                value={stats.onlineUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
              <Progress percent={Math.round((stats.onlineUsers / stats.totalUsers) * 100)} showInfo={false} strokeColor="#52c41a" />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="本月总登录次数"
                value={stats.totalLogins}
                prefix={<LineChartOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card>
              <Statistic
                title="平均会话时长"
                value={stats.avgSessionTime}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        <div className="dashboard-section">
          <h3><BarChartOutlined /> 数据分析</h3>
          <Tabs defaultActiveKey="1">
            <TabPane tab="用户活跃度趋势" key="1">
              <Card className="chart-card">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="活跃用户" stroke="#1890ff" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="新注册" stroke="#52c41a" />
                    <Line type="monotone" dataKey="登录次数" stroke="#fa8c16" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </TabPane>
            <TabPane tab="系统资源使用" key="2">
              <Card className="chart-card">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={systemResourceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="CPU使用率" stroke="#1890ff" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="内存使用率" stroke="#52c41a" />
                    <Line type="monotone" dataKey="磁盘使用率" stroke="#fa8c16" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </TabPane>
            <TabPane tab="用户分布" key="3">
              <Card className="chart-card">
                <Row>
                  <Col xs={24} md={12}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={userDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {userDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#1890ff', '#52c41a', '#fa8c16', '#722ed1'][index % 4]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Col>
                  <Col xs={24} md={12}>
                    <div style={{ padding: '20px' }}>
                      <h4>用户类型分布</h4>
                      {userDistributionData.map((item, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{item.name}</span>
                            <span>{item.value} 人</span>
                          </div>
                          <Progress 
                            percent={Math.round((item.value / stats.totalUsers) * 100)} 
                            strokeColor={['#1890ff', '#52c41a', '#fa8c16', '#722ed1'][index % 4]} 
                          />
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              </Card>
            </TabPane>
          </Tabs>
        </div>

        <div className="dashboard-section">
          <h3><LineChartOutlined /> 最近活动</h3>
          <Card>
            <Table 
              dataSource={recentActivities} 
              rowKey="id"
              pagination={false}
              size="small"
            >
              <Table.Column title="用户" dataIndex="user" key="user" />
              <Table.Column title="操作" dataIndex="action" key="action" />
              <Table.Column title="类型" dataIndex="type" key="type" 
                render={(text) => (
                  <span style={{ 
                    color: text === '系统操作' ? '#1890ff' : '#52c41a',
                    backgroundColor: text === '系统操作' ? 'rgba(24, 144, 255, 0.1)' : 'rgba(82, 196, 26, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {text}
                  </span>
                )}
              />
              <Table.Column title="时间" dataIndex="time" key="time" />
            </Table>
          </Card>
        </div>

        <div className="dashboard-section">
          <h3><PieChartOutlined /> 系统公告</h3>
          <Card>
            <p>• 系统将于本周日凌晨2点-4点进行例行维护，请提前做好准备。</p>
            <p>• 新版本用户管理功能已上线，支持批量导入导出。</p>
            <p>• 系统性能监控模块已升级，提供更详细的资源使用分析。</p>
          </Card>
        </div>
      </Spin>
    </div>
  );
};

export default Dashboard;