import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Table, Tabs, Statistic, Divider, Progress, message } from 'antd';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { FileExcelOutlined, FilePdfOutlined, TeamOutlined, ClockCircleOutlined, DollarOutlined, AuditOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import './Reports.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface DepartmentData {
  name: string;
  count: number;
  male: number;
  female: number;
}

interface AttendanceData {
  month: string;
  normal: number;
  late: number;
  early: number;
  absent: number;
}

interface LeaveData {
  type: string;
  count: number;
  days: number;
  color: string;
}

interface SalaryData {
  department: string;
  average: number;
  min: number;
  max: number;
}

interface PerformanceData {
  level: string;
  count: number;
  percentage: number;
  color: string;
}

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [leaveData, setLeaveData] = useState<LeaveData[]>([]);
  const [salaryData, setSalaryData] = useState<SalaryData[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<[string, string]>(['2023-01-01', '2023-12-31']);

  // 模拟获取报表数据
  useEffect(() => {
    fetchReportData();
  }, [selectedDepartment, selectedDateRange]);

  const fetchReportData = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      // 部门人员分布数据
      const mockDepartmentData: DepartmentData[] = [
        { name: '技术部', count: 42, male: 30, female: 12 },
        { name: '市场部', count: 28, male: 15, female: 13 },
        { name: '销售部', count: 35, male: 20, female: 15 },
        { name: '人力资源部', count: 15, male: 5, female: 10 },
        { name: '财务部', count: 12, male: 4, female: 8 },
        { name: '行政部', count: 8, male: 3, female: 5 },
      ];
      setDepartmentData(mockDepartmentData);

      // 考勤数据
      const mockAttendanceData: AttendanceData[] = [
        { month: '1月', normal: 92, late: 5, early: 2, absent: 1 },
        { month: '2月', normal: 90, late: 6, early: 3, absent: 1 },
        { month: '3月', normal: 93, late: 4, early: 2, absent: 1 },
        { month: '4月', normal: 91, late: 5, early: 3, absent: 1 },
        { month: '5月', normal: 94, late: 3, early: 2, absent: 1 },
        { month: '6月', normal: 92, late: 4, early: 3, absent: 1 },
      ];
      setAttendanceData(mockAttendanceData);

      // 请假数据
      const mockLeaveData: LeaveData[] = [
        { type: '年假', count: 120, days: 360, color: '#1890ff' },
        { type: '病假', count: 45, days: 90, color: '#13c2c2' },
        { type: '事假', count: 60, days: 120, color: '#faad14' },
        { type: '婚假', count: 5, days: 50, color: '#722ed1' },
        { type: '产假', count: 3, days: 270, color: '#eb2f96' },
        { type: '丧假', count: 2, days: 6, color: '#52c41a' },
      ];
      setLeaveData(mockLeaveData);

      // 薪资数据
      const mockSalaryData: SalaryData[] = [
        { department: '技术部', average: 15000, min: 8000, max: 30000 },
        { department: '市场部', average: 12000, min: 7000, max: 25000 },
        { department: '销售部', average: 13000, min: 6000, max: 28000 },
        { department: '人力资源部', average: 10000, min: 6000, max: 18000 },
        { department: '财务部', average: 11000, min: 7000, max: 20000 },
        { department: '行政部', average: 9000, min: 5000, max: 15000 },
      ];
      setSalaryData(mockSalaryData);

      // 绩效数据
      const mockPerformanceData: PerformanceData[] = [
        { level: 'A', count: 25, percentage: 18, color: '#52c41a' },
        { level: 'B', count: 65, percentage: 46, color: '#1890ff' },
        { level: 'C', count: 40, percentage: 28, color: '#faad14' },
        { level: 'D', count: 10, percentage: 7, color: '#ff4d4f' },
        { level: 'E', count: 1, percentage: 1, color: '#595959' },
      ];
      setPerformanceData(mockPerformanceData);

      setLoading(false);
    }, 500);
  };

  // 处理部门选择变化
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
  };

  // 处理日期范围变化
  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setSelectedDateRange([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]);
    }
  };

  // 导出报表
  const handleExportExcel = () => {
    setLoading(true);
    try {
      // 在实际应用中，这里应该调用API或使用库来生成Excel文件
      // 模拟导出过程
      setTimeout(() => {
        setLoading(false);
        message.success('报表已成功导出为Excel文件');
      }, 1000);
      
      // 示例：如何使用实际库导出Excel
      // 1. 收集当前视图的数据
      // 2. 使用xlsx或其他库格式化数据
      // 3. 生成并下载文件
      // const worksheet = XLSX.utils.json_to_sheet(data);
      // const workbook = XLSX.utils.book_new();
      // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      // XLSX.writeFile(workbook, `报表_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      setLoading(false);
      message.error('导出Excel失败，请重试');
      console.error('导出Excel错误:', error);
    }
  };

  // 导出PDF
  const handleExportPDF = () => {
    setLoading(true);
    try {
      // 在实际应用中，这里应该调用API或使用库来生成PDF文件
      // 模拟导出过程
      setTimeout(() => {
        setLoading(false);
        message.success('报表已成功导出为PDF文件');
      }, 1000);
      
      // 示例：如何使用实际库导出PDF
      // 1. 收集当前视图的数据
      // 2. 使用jspdf或其他库格式化数据
      // 3. 生成并下载文件
      // const doc = new jsPDF();
      // doc.text('报表数据', 10, 10);
      // doc.save(`报表_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      setLoading(false);
      message.error('导出PDF失败，请重试');
      console.error('导出PDF错误:', error);
    }
  };

  // 员工分布报表
  const EmployeeDistributionReport = () => {
    const departmentColumns = [
      {
        title: '部门',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '人数',
        dataIndex: 'count',
        key: 'count',
        sorter: (a: DepartmentData, b: DepartmentData) => a.count - b.count,
      },
      {
        title: '男性',
        dataIndex: 'male',
        key: 'male',
      },
      {
        title: '女性',
        dataIndex: 'female',
        key: 'female',
      },
      {
        title: '性别比例',
        key: 'ratio',
        render: (text: string, record: DepartmentData) => {
          const total = record.male + record.female;
          const malePercent = Math.round((record.male / total) * 100);
          return (
            <div style={{ width: '200px' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: malePercent, backgroundColor: '#1890ff', height: '20px' }}></div>
                <div style={{ flex: 100 - malePercent, backgroundColor: '#eb2f96', height: '20px' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>男: {malePercent}%</span>
                <span>女: {100 - malePercent}%</span>
              </div>
            </div>
          );
        },
      },
    ];

    return (
      <div className="report-section">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="部门人员分布" className="report-card">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="male" name="男性" fill="#1890ff" />
                  <Bar dataKey="female" name="女性" fill="#eb2f96" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="员工性别分布" className="report-card">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[{ name: '男性', value: departmentData.reduce((sum, item) => sum + item.male, 0) }, { name: '女性', value: departmentData.reduce((sum, item) => sum + item.female, 0) }]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#1890ff" />
                    <Cell fill="#eb2f96" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24}>
            <Card title="部门详细数据" className="report-card">
              <Table 
                columns={departmentColumns} 
                dataSource={departmentData} 
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

  // 考勤报表
  const AttendanceReport = () => {
    return (
      <div className="report-section">
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card title="月度考勤统计" className="report-card">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="normal" name="正常" fill="#52c41a" />
                  <Bar dataKey="late" name="迟到" fill="#faad14" />
                  <Bar dataKey="early" name="早退" fill="#1890ff" />
                  <Bar dataKey="absent" name="缺勤" fill="#ff4d4f" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="考勤率统计" className="report-card">
              <Row gutter={[16, 16]}>
                {attendanceData.map((item, index) => {
                  const total = item.normal + item.late + item.early + item.absent;
                  const rate = Math.round((item.normal / total) * 100);
                  return (
                    <Col xs={24} sm={12} key={index}>
                      <Statistic 
                        title={`${item.month}考勤率`}
                        value={rate}
                        suffix="%"
                        valueStyle={{ color: rate > 90 ? '#52c41a' : rate > 80 ? '#faad14' : '#ff4d4f' }}
                      />
                      <Progress 
                        percent={rate} 
                        status={rate > 90 ? 'success' : rate > 80 ? 'normal' : 'exception'} 
                        size="small" 
                      />
                    </Col>
                  );
                })}
              </Row>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="考勤异常分析" className="report-card">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: '迟到', value: attendanceData.reduce((sum, item) => sum + item.late, 0) },
                      { name: '早退', value: attendanceData.reduce((sum, item) => sum + item.early, 0) },
                      { name: '缺勤', value: attendanceData.reduce((sum, item) => sum + item.absent, 0) }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#faad14" />
                    <Cell fill="#1890ff" />
                    <Cell fill="#ff4d4f" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  // 请假报表
  const LeaveReport = () => {
    const leaveColumns = [
      {
        title: '请假类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '申请次数',
        dataIndex: 'count',
        key: 'count',
        sorter: (a: LeaveData, b: LeaveData) => a.count - b.count,
      },
      {
        title: '请假天数',
        dataIndex: 'days',
        key: 'days',
        sorter: (a: LeaveData, b: LeaveData) => a.days - b.days,
      },
      {
        title: '占比',
        key: 'percentage',
        render: (text: string, record: LeaveData) => {
          const totalDays = leaveData.reduce((sum, item) => sum + item.days, 0);
          const percentage = Math.round((record.days / totalDays) * 100);
          return (
            <div>
              <Progress 
                percent={percentage} 
                size="small" 
                strokeColor={record.color}
              />
            </div>
          );
        },
      },
    ];

    return (
      <div className="report-section">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="请假类型分布" className="report-card">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leaveData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="days"
                    nameKey="type"
                    label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {leaveData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="请假申请次数" className="report-card">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={leaveData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="申请次数">
                    {leaveData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24}>
            <Card title="请假详细数据" className="report-card">
              <Table 
                columns={leaveColumns} 
                dataSource={leaveData} 
                rowKey="type" 
                loading={loading}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  // 薪资报表
  const SalaryReport = () => {
    const salaryColumns = [
      {
        title: '部门',
        dataIndex: 'department',
        key: 'department',
      },
      {
        title: '平均薪资',
        dataIndex: 'average',
        key: 'average',
        sorter: (a: SalaryData, b: SalaryData) => a.average - b.average,
        render: (value: number) => `¥${value.toLocaleString()}`,
      },
      {
        title: '最低薪资',
        dataIndex: 'min',
        key: 'min',
        render: (value: number) => `¥${value.toLocaleString()}`,
      },
      {
        title: '最高薪资',
        dataIndex: 'max',
        key: 'max',
        render: (value: number) => `¥${value.toLocaleString()}`,
      },
      {
        title: '薪资范围',
        key: 'range',
        render: (text: string, record: SalaryData) => {
          const range = record.max - record.min;
          const midPoint = (record.min + record.average) / 2;
          const highPoint = (record.average + record.max) / 2;
          return (
            <div style={{ width: '200px' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: record.average - record.min, backgroundColor: '#52c41a', height: '20px' }}></div>
                <div style={{ flex: record.max - record.average, backgroundColor: '#1890ff', height: '20px' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>¥{record.min.toLocaleString()}</span>
                <span>¥{record.average.toLocaleString()}</span>
                <span>¥{record.max.toLocaleString()}</span>
              </div>
            </div>
          );
        },
      },
    ];

    return (
      <div className="report-section">
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card title="部门平均薪资对比" className="report-card">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="average" name="平均薪资" fill="#1890ff" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24}>
            <Card title="部门薪资范围" className="report-card">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salaryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="department" type="category" />
                  <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="min" name="最低薪资" fill="#52c41a" />
                  <Bar dataKey="average" name="平均薪资" fill="#1890ff" />
                  <Bar dataKey="max" name="最高薪资" fill="#faad14" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24}>
            <Card title="薪资详细数据" className="report-card">
              <Table 
                columns={salaryColumns} 
                dataSource={salaryData} 
                rowKey="department" 
                loading={loading}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  // 绩效报表
  const PerformanceReport = () => {
    return (
      <div className="report-section">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="绩效等级分布" className="report-card">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="level"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="绩效等级统计" className="report-card">
              <div className="performance-stats">
                {performanceData.map((item, index) => (
                  <div key={index} className="performance-stat-item">
                    <div className="performance-level" style={{ backgroundColor: item.color }}>{item.level}</div>
                    <div className="performance-bar">
                      <Progress 
                        percent={item.percentage} 
                        strokeColor={item.color}
                        showInfo={false}
                      />
                    </div>
                    <div className="performance-count">{item.count}人</div>
                    <div className="performance-percentage">{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
          <Col xs={24}>
            <Card title="绩效分析" className="report-card">
              <div className="performance-analysis">
                <div className="analysis-item">
                  <Statistic 
                    title="优秀率(A)" 
                    value={performanceData.find(item => item.level === 'A')?.percentage || 0} 
                    suffix="%" 
                    valueStyle={{ color: '#52c41a' }}
                  />
                </div>
                <div className="analysis-item">
                  <Statistic 
                    title="良好率(B)" 
                    value={performanceData.find(item => item.level === 'B')?.percentage || 0} 
                    suffix="%" 
                    valueStyle={{ color: '#1890ff' }}
                  />
                </div>
                <div className="analysis-item">
                  <Statistic 
                    title="达标率(C)" 
                    value={performanceData.find(item => item.level === 'C')?.percentage || 0} 
                    suffix="%" 
                    valueStyle={{ color: '#faad14' }}
                  />
                </div>
                <div className="analysis-item">
                  <Statistic 
                    title="不达标率(D+E)" 
                    value={
                      (performanceData.find(item => item.level === 'D')?.percentage || 0) +
                      (performanceData.find(item => item.level === 'E')?.percentage || 0)
                    } 
                    suffix="%" 
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </div>
              </div>
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
          <TeamOutlined />
          员工分布
        </span>
      ),
      children: <EmployeeDistributionReport />,
    },
    {
      key: '2',
      label: (
        <span>
          <ClockCircleOutlined />
          考勤统计
        </span>
      ),
      children: <AttendanceReport />,
    },
    {
      key: '3',
      label: (
        <span>
          <AuditOutlined />
          请假分析
        </span>
      ),
      children: <LeaveReport />,
    },
    {
      key: '4',
      label: (
        <span>
          <DollarOutlined />
          薪资分析
        </span>
      ),
      children: <SalaryReport />,
    },
    {
      key: '5',
      label: (
        <span>
          <AuditOutlined />
          绩效分析
        </span>
      ),
      children: <PerformanceReport />,
    },
  ];

  return (
    <div className="reports-container">
      <h2>报表中心</h2>
      
      <div className="reports-header">
        <div className="reports-filters">
          <Select 
            style={{ width: 200, marginRight: 16 }} 
            placeholder="选择部门" 
            defaultValue="all"
            onChange={handleDepartmentChange}
          >
            <Option value="all">全部部门</Option>
            <Option value="tech">技术部</Option>
            <Option value="marketing">市场部</Option>
            <Option value="sales">销售部</Option>
            <Option value="hr">人力资源部</Option>
            <Option value="finance">财务部</Option>
            <Option value="admin">行政部</Option>
          </Select>
          
          <RangePicker 
            style={{ marginRight: 16 }}
            onChange={handleDateRangeChange}
            defaultValue={[dayjs('2023-01-01'), dayjs('2023-12-31')]}
          />
        </div>
        
        <div className="reports-actions">
          <Button 
            type="primary" 
            icon={<FileExcelOutlined />} 
            onClick={handleExportExcel}
            style={{ marginRight: 8 }}
          >
            导出Excel
          </Button>
          <Button 
            icon={<FilePdfOutlined />} 
            onClick={handleExportPDF}
          >
            导出PDF
          </Button>
        </div>
      </div>
      
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default Reports;