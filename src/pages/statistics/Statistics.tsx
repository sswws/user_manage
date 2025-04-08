import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Spin, Tabs, Radio, Tooltip } from 'antd';
import { ReloadOutlined, QuestionCircleOutlined, UserOutlined, TeamOutlined, LoginOutlined, FieldTimeOutlined } from '@ant-design/icons';
import './Statistics.css';

// 由于这是一个模拟项目，我们使用简单的div来模拟图表
// 在实际项目中，你可以使用Ant Design Charts、Echarts、Recharts等图表库
const ChartPlaceholder: React.FC<{title: string, height: number, color: string}> = ({ title, height, color }) => (
  <div 
    className="chart-placeholder" 
    style={{ height: `${height}px`, backgroundColor: color }}
  >
    <div className="chart-title">{title}</div>
    <div className="chart-content">
      {/* 这里只是一个占位符，实际项目中应该使用真实的图表组件 */}
      <div className="chart-bars">
        {Array.from({ length: 7 }).map((_, index) => (
          <div 
            key={index} 
            className="chart-bar" 
            style={{ 
              height: `${Math.random() * 80 + 20}%`,
              backgroundColor: color
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const Statistics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<string>('week');
  const [chartType, setChartType] = useState<string>('bar');
  
  // 模拟加载数据
  useEffect(() => {
    loadData();
  }, [timeRange]);
  
  const loadData = () => {
    setLoading(true);
    // 模拟API请求延迟
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  const handleRefresh = () => {
    loadData();
  };
  
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };
  
  const handleChartTypeChange = (e: any) => {
    setChartType(e.target.value);
  };
  
  return (
    <div className="statistics-container">
      <Card>
        <div className="statistics-header">
          <h2>数据统计分析</h2>
          <div className="statistics-controls">
            <Select 
              defaultValue="week" 
              style={{ width: 120, marginRight: 16 }} 
              onChange={handleTimeRangeChange}
            >
              <Select.Option value="today">今日</Select.Option>
              <Select.Option value="week">本周</Select.Option>
              <Select.Option value="month">本月</Select.Option>
              <Select.Option value="quarter">本季度</Select.Option>
              <Select.Option value="year">本年</Select.Option>
            </Select>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
              loading={loading}
            >
              刷新数据
            </Button>
          </div>
        </div>
        
        <div className="statistics-summary">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card className="summary-card">
                <div className="summary-icon" style={{ backgroundColor: '#1890ff' }}>
                  <UserOutlined />
                </div>
                <div className="summary-content">
                  <div className="summary-title">总用户数</div>
                  <div className="summary-value">256</div>
                  <div className="summary-trend positive">↑ 5.2%</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="summary-card">
                <div className="summary-icon" style={{ backgroundColor: '#52c41a' }}>
                  <UserOutlined />
                </div>
                <div className="summary-content">
                  <div className="summary-title">新增用户</div>
                  <div className="summary-value">32</div>
                  <div className="summary-trend positive">↑ 12.7%</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="summary-card">
                <div className="summary-icon" style={{ backgroundColor: '#722ed1' }}>
                  <LoginOutlined />
                </div>
                <div className="summary-content">
                  <div className="summary-title">登录次数</div>
                  <div className="summary-value">1,024</div>
                  <div className="summary-trend positive">↑ 8.3%</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="summary-card">
                <div className="summary-icon" style={{ backgroundColor: '#fa8c16' }}>
                  <FieldTimeOutlined />
                </div>
                <div className="summary-content">
                  <div className="summary-title">平均在线时长</div>
                  <div className="summary-value">32分钟</div>
                  <div className="summary-trend negative">↓ 2.1%</div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        
        <div className="statistics-charts">
          <div className="chart-controls">
            <Radio.Group value={chartType} onChange={handleChartTypeChange}>
              <Radio.Button value="bar">柱状图</Radio.Button>
              <Radio.Button value="line">折线图</Radio.Button>
              <Radio.Button value="pie">饼图</Radio.Button>
            </Radio.Group>
          </div>
          
          <Tabs defaultActiveKey="1">
            <TabPane 
              tab={
                <span>
                  <UserOutlined />
                  用户统计
                  <Tooltip title="展示用户增长和活跃情况">
                    <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                  </Tooltip>
                </span>
              } 
              key="1"
            >
              <Spin spinning={loading}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card title="用户增长趋势" className="chart-card">
                      <ChartPlaceholder title="用户增长趋势图" height={300} color="#1890ff" />
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="用户活跃度" className="chart-card">
                      <ChartPlaceholder title="用户活跃度图" height={300} color="#52c41a" />
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="用户地域分布" className="chart-card">
                      <ChartPlaceholder title="用户地域分布图" height={300} color="#722ed1" />
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="用户设备分布" className="chart-card">
                      <ChartPlaceholder title="用户设备分布图" height={300} color="#fa8c16" />
                    </Card>
                  </Col>
                </Row>
              </Spin>
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <TeamOutlined />
                  角色统计
                </span>
              } 
              key="2"
            >
              <Spin spinning={loading}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card title="角色分布" className="chart-card">
                      <ChartPlaceholder title="角色分布图" height={300} color="#fa541c" />
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="角色权限分布" className="chart-card">
                      <ChartPlaceholder title="角色权限分布图" height={300} color="#13c2c2" />
                    </Card>
                  </Col>
                </Row>
              </Spin>
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <LoginOutlined />
                  登录统计
                </span>
              } 
              key="3"
            >
              <Spin spinning={loading}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card title="登录趋势" className="chart-card">
                      <ChartPlaceholder title="登录趋势图" height={300} color="#eb2f96" />
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="登录时段分布" className="chart-card">
                      <ChartPlaceholder title="登录时段分布图" height={300} color="#faad14" />
                    </Card>
                  </Col>
                  <Col xs={24}>
                    <Card title="登录异常分析" className="chart-card">
                      <ChartPlaceholder title="登录异常分析图" height={300} color="#f5222d" />
                    </Card>
                  </Col>
                </Row>
              </Spin>
            </TabPane>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default Statistics;