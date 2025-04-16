import React, { useState, useEffect } from 'react';
import { Table, Card, Button, DatePicker, Tag, Space, Modal, Form, Input, Select, message, Tabs } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import dayjs from 'dayjs';
import './Attendance.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface AttendanceRecord {
  id: number;
  userId: number;
  userName: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: 'normal' | 'late' | 'early' | 'absent' | 'exception';
  remark?: string;
}

interface AttendanceStats {
  totalDays: number;
  normalDays: number;
  lateDays: number;
  earlyDays: number;
  absentDays: number;
  exceptionDays: number;
}

const Attendance: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<AttendanceRecord | null>(null);
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [stats, setStats] = useState<AttendanceStats>({
    totalDays: 0,
    normalDays: 0,
    lateDays: 0,
    earlyDays: 0,
    absentDays: 0,
    exceptionDays: 0
  });

  // 模拟获取考勤数据
  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const mockData: AttendanceRecord[] = [
        {
          id: 1,
          userId: 1,
          userName: '管理员',
          date: '2023-06-01',
          checkInTime: '08:55:00',
          checkOutTime: '18:05:00',
          status: 'normal',
        },
        {
          id: 2,
          userId: 1,
          userName: '管理员',
          date: '2023-06-02',
          checkInTime: '09:15:00',
          checkOutTime: '18:00:00',
          status: 'late',
          remark: '交通拥堵',
        },
        {
          id: 3,
          userId: 2,
          userName: '普通用户',
          date: '2023-06-01',
          checkInTime: '08:50:00',
          checkOutTime: '17:30:00',
          status: 'early',
          remark: '有事提前离开',
        },
        {
          id: 4,
          userId: 2,
          userName: '普通用户',
          date: '2023-06-02',
          checkInTime: '',
          checkOutTime: '',
          status: 'absent',
          remark: '请假',
        },
        {
          id: 5,
          userId: 3,
          userName: '访客',
          date: '2023-06-01',
          checkInTime: '08:45:00',
          checkOutTime: '18:15:00',
          status: 'normal',
        },
      ];

      setRecords(mockData);
      updateStats(mockData);
      setLoading(false);
    }, 500);
  };

  // 更新统计数据
  const updateStats = (data: AttendanceRecord[]) => {
    const stats = {
      totalDays: data.length,
      normalDays: data.filter(r => r.status === 'normal').length,
      lateDays: data.filter(r => r.status === 'late').length,
      earlyDays: data.filter(r => r.status === 'early').length,
      absentDays: data.filter(r => r.status === 'absent').length,
      exceptionDays: data.filter(r => r.status === 'exception').length,
    };
    setStats(stats);
  };

  // 处理日期范围变化
  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setDateRange([dates[0], dates[1]]);
      // 这里可以添加按日期筛选的逻辑
    } else {
      setDateRange(null);
    }
  };

  // 打开编辑模态框
  const handleEdit = (record: AttendanceRecord) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date),
    });
    setIsModalVisible(true);
  };

  // 提交表单
  const handleSubmit = () => {
    form.validateFields().then(values => {
      // 模拟API请求
      setTimeout(() => {
        const updatedRecords = records.map(record => {
          if (record.id === currentRecord?.id) {
            return {
              ...record,
              ...values,
              date: values.date.format('YYYY-MM-DD'),
            };
          }
          return record;
        });
        setRecords(updatedRecords);
        updateStats(updatedRecords);
        setIsModalVisible(false);
        message.success('考勤记录已更新');
      }, 500);
    });
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'normal':
        return <Tag color="green"><CheckCircleOutlined /> 正常</Tag>;
      case 'late':
        return <Tag color="orange"><ClockCircleOutlined /> 迟到</Tag>;
      case 'early':
        return <Tag color="blue"><ClockCircleOutlined /> 早退</Tag>;
      case 'absent':
        return <Tag color="red"><CloseCircleOutlined /> 缺勤</Tag>;
      case 'exception':
        return <Tag color="purple"><ExclamationCircleOutlined /> 异常</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  const columns = [
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: AttendanceRecord, b: AttendanceRecord) => a.date.localeCompare(b.date),
    },
    {
      title: '签到时间',
      dataIndex: 'checkInTime',
      key: 'checkInTime',
      render: (text: string) => text || '-',
    },
    {
      title: '签退时间',
      dataIndex: 'checkOutTime',
      key: 'checkOutTime',
      render: (text: string) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: '正常', value: 'normal' },
        { text: '迟到', value: 'late' },
        { text: '早退', value: 'early' },
        { text: '缺勤', value: 'absent' },
        { text: '异常', value: 'exception' },
      ],
      onFilter: (value: any, record: AttendanceRecord) => record.status === value,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (text: string) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AttendanceRecord) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
        </Space>
      ),
    },
  ];

  // 考勤统计卡片
  const StatisticCards = () => (
    <div className="attendance-stats">
      <Card className="stat-card">
        <div className="stat-value">{stats.totalDays}</div>
        <div className="stat-label">总考勤天数</div>
      </Card>
      <Card className="stat-card normal">
        <div className="stat-value">{stats.normalDays}</div>
        <div className="stat-label">正常出勤</div>
      </Card>
      <Card className="stat-card late">
        <div className="stat-value">{stats.lateDays}</div>
        <div className="stat-label">迟到</div>
      </Card>
      <Card className="stat-card early">
        <div className="stat-value">{stats.earlyDays}</div>
        <div className="stat-label">早退</div>
      </Card>
      <Card className="stat-card absent">
        <div className="stat-value">{stats.absentDays}</div>
        <div className="stat-label">缺勤</div>
      </Card>
      <Card className="stat-card exception">
        <div className="stat-value">{stats.exceptionDays}</div>
        <div className="stat-label">异常</div>
      </Card>
    </div>
  );

  // 考勤打卡组件
  const CheckInOut = () => {
    const [checkInLoading, setCheckInLoading] = useState(false);
    const [checkOutLoading, setCheckOutLoading] = useState(false);
    const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);

    useEffect(() => {
      // 模拟获取今日打卡记录
      const today = dayjs().format('YYYY-MM-DD');
      const record = records.find(r => r.date === today && r.userId === 1);
      setTodayRecord(record || null);
    }, [records]);

    const handleCheckIn = () => {
      setCheckInLoading(true);
      // 模拟打卡请求
      setTimeout(() => {
        const now = dayjs().format('HH:mm:ss');
        const today = dayjs().format('YYYY-MM-DD');
        const newRecord: AttendanceRecord = {
          id: records.length + 1,
          userId: 1,
          userName: '管理员',
          date: today,
          checkInTime: now,
          checkOutTime: '',
          status: dayjs(now, 'HH:mm:ss').isAfter(dayjs('09:00:00', 'HH:mm:ss')) ? 'late' : 'normal',
        };
        
        setRecords([...records, newRecord]);
        setTodayRecord(newRecord);
        setCheckInLoading(false);
        message.success(`签到成功，时间: ${now}`);
      }, 1000);
    };

    const handleCheckOut = () => {
      setCheckOutLoading(true);
      // 模拟打卡请求
      setTimeout(() => {
        const now = dayjs().format('HH:mm:ss');
        const updatedRecords = records.map(record => {
          if (record.id === todayRecord?.id) {
            const status = dayjs(now, 'HH:mm:ss').isBefore(dayjs('18:00:00', 'HH:mm:ss')) 
              ? 'early' 
              : record.status === 'late' ? 'late' : 'normal';
            
            return {
              ...record,
              checkOutTime: now,
              status,
            };
          }
          return record;
        });
        
        setRecords(updatedRecords as AttendanceRecord[]);
        const updatedRecord = updatedRecords.find(r => r.id === todayRecord?.id);
        setTodayRecord(updatedRecord as AttendanceRecord | null);
        updateStats(updatedRecords as AttendanceRecord[]);
        setCheckOutLoading(false);
        message.success(`签退成功，时间: ${now}`);
      }, 1000);
    };

    return (
      <Card className="check-in-out-card">
        <h3>今日打卡</h3>
        <div className="current-time">
          <ClockCircleOutlined /> {dayjs().format('YYYY-MM-DD HH:mm:ss')}
        </div>
        <div className="check-buttons">
          <Button 
            type="primary" 
            size="large" 
            onClick={handleCheckIn} 
            loading={checkInLoading}
            disabled={!!todayRecord?.checkInTime}
          >
            签到
          </Button>
          <Button 
            type="primary" 
            size="large" 
            onClick={handleCheckOut} 
            loading={checkOutLoading}
            disabled={!todayRecord?.checkInTime || !!todayRecord?.checkOutTime}
          >
            签退
          </Button>
        </div>
        {todayRecord && (
          <div className="today-record">
            <p>签到时间: {todayRecord.checkInTime || '未签到'}</p>
            <p>签退时间: {todayRecord.checkOutTime || '未签退'}</p>
            <p>状态: {getStatusTag(todayRecord.status)}</p>
          </div>
        )}
      </Card>
    );
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '考勤记录',
      children: (
        <>
          <div className="attendance-header">
            <div className="attendance-filters">
              <RangePicker onChange={handleDateRangeChange} />
            </div>
          </div>
          <Table 
            columns={columns}
            dataSource={records} 
            rowKey="id" 
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </>
      ),
    },
    {
      key: '2',
      label: '考勤统计',
      children: <StatisticCards />,
    },
    {
      key: '3',
      label: '打卡',
      children: <CheckInOut />,
    },
  ];

  return (
    <div className="attendance-container">
      <h2>考勤管理</h2>
      
      <Tabs defaultActiveKey="1" items={items} />

      <Modal
        title="编辑考勤记录"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="userName" label="用户" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="date" label="日期" rules={[{ required: true }]}>
            <DatePicker disabled />
          </Form.Item>
          <Form.Item name="checkInTime" label="签到时间">
            <Input />
          </Form.Item>
          <Form.Item name="checkOutTime" label="签退时间">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select>
              <Option value="normal">正常</Option>
              <Option value="late">迟到</Option>
              <Option value="early">早退</Option>
              <Option value="absent">缺勤</Option>
              <Option value="exception">异常</Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Attendance;