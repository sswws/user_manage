import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Tabs, Alert, Badge, Timeline, Button, Spin, Tooltip } from 'antd';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined, SyncOutlined, WarningOutlined, ReloadOutlined, DashboardOutlined, CloudServerOutlined, ApiOutlined, DatabaseOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import './SystemMonitor.css';

interface SystemStatus {
  status: 'normal' | 'warning' | 'error';
  uptime: string;
  lastRestart: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeUsers: number;
  responseTime: number;
  errorRate: number;
}

interface PerformanceData {
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  activeUsers: number;
  responseTime: number;
}

interface ErrorLog {
  id: number;
  timestamp: string;
  type: string;
  message: string;
  source: string;
  status: 'resolved' | 'unresolved';
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  responseTime: number;
  lastChecked: string;
}

const SystemMonitor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus[]>([]);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(30000); // 30秒刷新一次

  // 模拟获取系统状态数据
  useEffect(() => {
    fetchSystemData();

    // 设置定时刷新
    if (refreshInterval) {
      const intervalId = setInterval(() => {
        fetchSystemData();
      }, refreshInterval);

      return () => clearInterval(intervalId);
    }
  }, [refreshInterval]);

  const fetchSystemData = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      // 系统状态数据
      const mockSystemStatus: SystemStatus = {
        status: 'normal',
        uptime: '15天6小时32分钟',
        lastRestart: '2023-06-15 03:00:00',
        cpuUsage: 35,
        memoryUsage: 42,
        diskUsage: 68,
        activeUsers: 127,
        responseTime: 230, // ms
        errorRate: 0.5, // %
      };
      setSystemStatus(mockSystemStatus);

      // 性能数据
      const mockPerformanceData: PerformanceData[] = [
        { timestamp: '00:00', cpuUsage: 20, memoryUsage: 35, activeUsers: 50, responseTime: 200 },
        { timestamp: '04:00', cpuUsage: 15, memoryUsage: 30, activeUsers: 30, responseTime: 180 },
        { timestamp: '08:00', cpuUsage: 40, memoryUsage: 45, activeUsers: 120, responseTime: 250 },
        { timestamp: '12:00', cpuUsage: 60, memoryUsage: 55, activeUsers: 200, responseTime: 300 },
        { timestamp: '16:00', cpuUsage: 45, memoryUsage: 50, activeUsers: 180, responseTime: 270 },
        { timestamp: '20:00', cpuUsage: 30, memoryUsage: 40, activeUsers: 100, responseTime: 220 },
        { timestamp: '现在', cpuUsage: 35, memoryUsage: 42, activeUsers: 127, responseTime: 230 },
      ];
      setPerformanceData(mockPerformanceData);

      // 错误日志
      const mockErrorLogs: ErrorLog[] = [
        { id: 1, timestamp: '2023-06-29 14:32:15', type: '数据库错误', message: '连接超时', source: '用户服务', status: 'resolved' },
        { id: 2, timestamp: '2023-06-29 10:15:22', type: 'API错误', message: '无效的请求参数', source: '认证服务', status: 'resolved' },
        { id: 3, timestamp: '2023-06-28 16:45:30', type: '系统错误', message: '内存溢出', source: '报表服务', status: 'resolved' },
        { id: 4, timestamp: '2023-06-28 09:20:11', type: '网络错误', message: '请求超时', source: '外部API', status: 'unresolved' },
        { id: 5, timestamp: '2023-06-27 22:10:45', type: '安全警告', message: '可疑登录尝试', source: '认证服务', status: 'unresolved' },
      ];
      setErrorLogs(mockErrorLogs);

      // 服务状态
      const mockServiceStatus: ServiceStatus[] = [
        { name: '用户服务', status: 'online', responseTime: 120, lastChecked: '2023-06-30 10:30:00' },
        { name: '认证服务', status: 'online', responseTime: 150, lastChecked: '2023-06-30 10:30:00' },
        { name: '数据库服务', status: 'online', responseTime: 80, lastChecked: '2023-06-30 10:30:00' },
        { name: '存储服务', status: 'degraded', responseTime: 350, lastChecked: '2023-06-30 10:30:00' },
        { name: '报表服务', status: 'online', responseTime: 200, lastChecked: '2023-06-30 10:30:00' },
        { name: '外部API集成', status: 'offline', responseTime: 0, lastChecked: '2023-06-30 10:30:00' },
      ];
      setServiceStatus(mockServiceStatus);

      setLoading(false);
    }, 1000);
  };

  // 手动刷新数据
  const handleRefresh = () => {
    fetchSystemData();
  };

  // 切换自动刷新
  const toggleAutoRefresh = () => {
    if (refreshInterval) {
      setRefreshInterval(null);
      message.info('已关闭自动刷新');
    } else {
      setRefreshInterval(30000);
      message.info('已开启自动刷新（30秒）');
    }
  };

  // 系统概览
  const SystemOverview = () => {
    if (!systemStatus) return <Spin size="large" />;

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'normal': return '#52c41a';
        case 'warning': return '#faad14';
        case 'error': return '#f5222d';
        default: return '#1890ff';
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'normal': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
        case 'warning': return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
        case 'error': return <WarningOutlined style={{ color: '#f5222d' }} />;
        default: return <CheckCircleOutlined style={{ color: '#1890ff' }} />;
      }
    };

    return (
      <div className="system-overview">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="系统状态" 
                value={systemStatus.status === 'normal' ? '正常' : systemStatus.status === 'warning' ? '警告' : '错误'} 
                valueStyle={{ color: getStatusColor(systemStatus.status) }}
                prefix={getStatusIcon(systemStatus.status)}
              />
              <div className="status-detail">
                <span>运行时间: {systemStatus.uptime}</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="CPU使用率" 
                value={systemStatus.cpuUsage} 
                suffix="%" 
                valueStyle={{ color: systemStatus.cpuUsage > 80 ? '#f5222d' : systemStatus.cpuUsage > 60 ? '#faad14' : '#52c41a' }}
              />
              <Progress 
                percent={systemStatus.cpuUsage} 
                status={systemStatus.cpuUsage > 80 ? 'exception' : systemStatus.cpuUsage > 60 ? 'normal' : 'success'}
                showInfo={false}
                strokeColor={systemStatus.cpuUsage > 80 ? '#f5222d' : systemStatus.cpuUsage > 60 ? '#faad14' : '#52c41a'}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="内存使用率" 
                value={systemStatus.memoryUsage} 
                suffix="%" 
                valueStyle={{ color: systemStatus.memoryUsage > 80 ? '#f5222d' : systemStatus.memoryUsage > 60 ? '#faad14' : '#52c41a' }}
              />
              <Progress 
                percent={systemStatus.memoryUsage} 
                status={systemStatus.memoryUsage > 80 ? 'exception' : systemStatus.memoryUsage > 60 ? 'normal' : 'success'}
                showInfo={false}
                strokeColor={systemStatus.memoryUsage > 80 ? '#f5222d' : systemStatus.memoryUsage > 60 ? '#faad14' : '#52c41a'}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="磁盘使用率" 
                value={systemStatus.diskUsage} 
                suffix="%" 
                valueStyle={{ color: systemStatus.diskUsage > 80 ? '#f5222d' : systemStatus.diskUsage > 60 ? '#faad14' : '#52c41a' }}
              />
              <Progress 
                percent={systemStatus.diskUsage} 
                status={systemStatus.diskUsage > 80 ? 'exception' : systemStatus.diskUsage > 60 ? 'normal' : 'success'}
                showInfo={false}
                strokeColor={systemStatus.diskUsage > 80 ? '#f5222d' : systemStatus.diskUsage > 60 ? '#faad14' : '#52c41a'}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="活跃用户" 
                value={systemStatus.activeUsers} 
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="响应时间" 
                value={systemStatus.responseTime} 
                suffix="ms" 
                valueStyle={{ color: systemStatus.responseTime > 500 ? '#f5222d' : systemStatus.responseTime > 300 ? '#faad14' : '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="错误率" 
                value={systemStatus.errorRate} 
                suffix="%" 
                precision={2}
                valueStyle={{ color: systemStatus.errorRate > 5 ? '#f5222d' : systemStatus.errorRate > 1 ? '#faad14' : '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="最后重启时间" 
                value={systemStatus.lastRestart} 
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  // 性能监控
  const PerformanceMonitor = () => {
    return (
      <div className="performance-monitor">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="CPU使用率趋势" className="chart-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cpuUsage" name="CPU使用率 (%)" stroke="#1890ff" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="内存使用率趋势" className="chart-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="memoryUsage" name="内存使用率 (%)" stroke="#52c41a" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="活跃用户趋势" className="chart-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="activeUsers" name="活跃用户数" stroke="#722ed1" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="响应时间趋势" className="chart-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="responseTime" name="响应时间 (ms)" stroke="#fa8c16" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  // 错误日志
  const ErrorLogView = () => {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '时间',
        dataIndex: 'timestamp',
        key: 'timestamp',
        sorter: (a: ErrorLog, b: ErrorLog) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        filters: [
          { text: '数据库错误', value: '数据库错误' },
          { text: 'API错误', value: 'API错误' },
          { text: '系统错误', value: '系统错误' },
          { text: '网络错误', value: '网络错误' },
          { text: '安全警告', value: '安全警告' },
        ],
        onFilter: (value: string, record: ErrorLog) => record.type.indexOf(value) === 0,
      },
      {
        title: '消息',
        dataIndex: 'message',
        key: 'message',
      },
      {
        title: '来源',
        dataIndex: 'source',
        key: 'source',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
          <Badge 
            status={status === 'resolved' ? 'success' : 'error'} 
            text={status === 'resolved' ? '已解决' : '未解决'} 
          />
        ),
        filters: [
          { text: '已解决', value: 'resolved' },
          { text: '未解决', value: 'unresolved' },
        ],
        onFilter: (value: string, record: ErrorLog) => record.status === value,
      },
    ];

    return (
      <div className="error-logs">
        <Card title="系统错误日志" extra={<Button type="primary" size="small" onClick={handleRefresh}>刷新</Button>}>
          <Table 
            columns={columns} 
            dataSource={errorLogs} 
            rowKey="id" 
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>
    );
  };

  // 服务状态
  const ServiceStatusView = () => {
    const getStatusBadge = (status: string) => {
      switch (status) {
        case 'online': return <Badge status="success" text="在线" />;
        case 'offline': return <Badge status="error" text="离线" />;
        case 'degraded': return <Badge status="warning" text="性能下降" />;
        default: return <Badge status="default" text="未知" />;
      }
    };

    const columns = [
      {
        title: '服务名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => getStatusBadge(status),
        filters: [
          { text: '在线', value: 'online' },
          { text: '离线', value: 'offline' },
          { text: '性能下降', value: 'degraded' },
        ],
        onFilter: (value: string, record: ServiceStatus) => record.status === value,
      },
      {
        title: '响应时间',
        dataIndex: 'responseTime',
        key: 'responseTime',
        render: (responseTime: number) => responseTime > 0 ? `${responseTime} ms` : '-',
        sorter: (a: ServiceStatus, b: ServiceStatus) => a.responseTime - b.responseTime,
      },
      {
        title: '最后检查时间',
        dataIndex: 'lastChecked',
        key: 'lastChecked',
      },
    ];

    // 计算服务状态统计
    const onlineCount = serviceStatus.filter(s => s.status === 'online').length;
    const offlineCount = serviceStatus.filter(s => s.status === 'offline').length;
    const degradedCount = serviceStatus.filter(s => s.status === 'degraded').length;
    const totalCount = serviceStatus.length;

    const pieData = [
      { name: '在线', value: onlineCount, color: '#52c41a' },
      { name: '性能下降', value: degradedCount, color: '#faad14' },
      { name: '离线', value: offlineCount, color: '#f5222d' },
    ];

    return (
      <div className="service-status">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="服务状态概览" className="chart-card">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Col>
                <Col span={12}>
                  <div className="service-stats">
                    <Statistic title="总服务数" value={totalCount} />
                    <Statistic 
                      title="在线服务" 
                      value={onlineCount} 
                      valueStyle={{ color: '#52c41a' }} 
                      suffix={`/ ${totalCount}`}
                    />
                    <Statistic 
                      title="性能下降" 
                      value={degradedCount} 
                      valueStyle={{ color: '#faad14' }} 
                      suffix={`/ ${totalCount}`}
                    />
                    <Statistic 
                      title="离线服务" 
                      value={offlineCount} 
                      valueStyle={{ color: '#f5222d' }} 
                      suffix={`/ ${totalCount}`}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="服务详细状态" extra={<Button type="primary" size="small" onClick={handleRefresh}>刷新</Button>}>
              <Table 
                columns={columns} 
                dataSource={serviceStatus} 
                rowKey="name" 
                loading={loading}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span>
          <DashboardOutlined />
          系统概览
        </span>
      ),
      children: <SystemOverview />,
    },
    {
      key: '2',
      label: (
        <span>
          <BarChartOutlined />
          性能监控
        </span>
      ),
      children: <PerformanceMonitor />,
    },
    {
      key: '3',
      label: (
        <span>
          <WarningOutlined />
          错误日志
        </span>
      ),
      children: <ErrorLogView />,
    },
    {
      key: '4',
      label: (
        <span>
          <CloudServerOutlined />
          服务状态
        </span>
      ),
      children: <ServiceStatusView />,
    },
  ];

  return (
    <div className="system-monitor-container">
      <div className="system-monitor-header">
        <h2>系统监控与健康状态</h2>
        <div className="system-monitor-actions">
          <Tooltip title={refreshInterval ? '关闭自动刷新' : '开启自动刷新'}>
            <Button 
              type={refreshInterval ? 'primary' : 'default'}
              icon={<SyncOutlined spin={refreshInterval !== null} />}
              onClick={toggleAutoRefresh}
              style={{ marginRight: 8 }}
            >
              {refreshInterval ? '自动刷新中' : '自动刷新'}
            </Button>
          </Tooltip>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
          >
            刷新数据
          </Button>
        </div>
      </div>
      
      {loading && !systemStatus ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <Tabs defaultActiveKey="1" items={items} />
      )}
    </div>
  );
};

export default SystemMonitor;