import React, { useState, useEffect } from 'react';
import { Table, Card, Button, DatePicker, Tag, Space, Modal, Form, Input, Select, message, Tabs, Row, Col, Progress } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import dayjs from 'dayjs';
import './Leave.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

interface LeaveRequest {
  id: number;
  userId: number;
  userName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approver?: string;
  approveTime?: string;
  approveRemark?: string;
  createTime: string;
}

interface LeaveBalance {
  userId: number;
  userName: string;
  annual: number;
  sick: number;
  personal: number;
  marriage: number;
  maternity: number;
  bereavement: number;
  annualUsed: number;
  sickUsed: number;
  personalUsed: number;
  marriageUsed: number;
  maternityUsed: number;
  bereavementUsed: number;
}

const Leave: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<LeaveRequest | null>(null);
  const [form] = Form.useForm();
  const [approveForm] = Form.useForm();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);

  // 模拟获取请假数据
  useEffect(() => {
    fetchLeaveRequests();
    fetchLeaveBalance();
  }, []);

  const fetchLeaveRequests = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const mockData: LeaveRequest[] = [
        {
          id: 1,
          userId: 1,
          userName: '管理员',
          type: 'annual',
          startDate: '2023-06-10',
          endDate: '2023-06-12',
          days: 3,
          reason: '家庭旅行',
          status: 'approved',
          approver: '系统管理员',
          approveTime: '2023-06-05 14:30:00',
          approveRemark: '批准',
          createTime: '2023-06-01 10:15:00',
        },
        {
          id: 2,
          userId: 2,
          userName: '普通用户',
          type: 'sick',
          startDate: '2023-06-05',
          endDate: '2023-06-06',
          days: 2,
          reason: '感冒发烧',
          status: 'approved',
          approver: '管理员',
          approveTime: '2023-06-04 09:20:00',
          createTime: '2023-06-03 18:45:00',
        },
        {
          id: 3,
          userId: 3,
          userName: '访客',
          type: 'personal',
          startDate: '2023-06-15',
          endDate: '2023-06-15',
          days: 1,
          reason: '个人事务',
          status: 'pending',
          createTime: '2023-06-08 11:30:00',
        },
        {
          id: 4,
          userId: 2,
          userName: '普通用户',
          type: 'annual',
          startDate: '2023-07-01',
          endDate: '2023-07-05',
          days: 5,
          reason: '暑期休假',
          status: 'pending',
          createTime: '2023-06-10 16:20:00',
        },
        {
          id: 5,
          userId: 1,
          userName: '管理员',
          type: 'sick',
          startDate: '2023-05-20',
          endDate: '2023-05-21',
          days: 2,
          reason: '牙疼',
          status: 'rejected',
          approver: '系统管理员',
          approveTime: '2023-05-19 10:10:00',
          approveRemark: '近期工作繁忙，建议调整时间',
          createTime: '2023-05-18 14:25:00',
        },
      ];

      setRequests(mockData);
      setLoading(false);
    }, 500);
  };

  // 模拟获取假期余额
  const fetchLeaveBalance = () => {
    // 模拟API请求
    setTimeout(() => {
      const mockBalance: LeaveBalance = {
        userId: 1,
        userName: '管理员',
        annual: 15,
        sick: 10,
        personal: 5,
        marriage: 10,
        maternity: 90,
        bereavement: 3,
        annualUsed: 3,
        sickUsed: 2,
        personalUsed: 0,
        marriageUsed: 0,
        maternityUsed: 0,
        bereavementUsed: 0,
      };

      setLeaveBalance(mockBalance);
    }, 500);
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

  // 打开新建请假申请模态框
  const handleAdd = () => {
    setCurrentRequest(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 打开编辑请假申请模态框
  const handleEdit = (record: LeaveRequest) => {
    setCurrentRequest(record);
    form.setFieldsValue({
      ...record,
      dateRange: [dayjs(record.startDate), dayjs(record.endDate)],
    });
    setIsModalVisible(true);
  };

  // 打开审批模态框
  const handleApprove = (record: LeaveRequest) => {
    setCurrentRequest(record);
    approveForm.resetFields();
    setIsApproveModalVisible(true);
  };

  // 提交请假申请表单
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const { dateRange, ...rest } = values;
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      const days = dateRange[1].diff(dateRange[0], 'day') + 1;

      // 模拟API请求
      setTimeout(() => {
        if (currentRequest) {
          // 更新请假申请
          const updatedRequests = requests.map(request => {
            if (request.id === currentRequest.id) {
              return {
                ...request,
                ...rest,
                startDate,
                endDate,
                days,
                status: 'pending', // 修改后重新审批
                approver: undefined,
                approveTime: undefined,
                approveRemark: undefined,
              };
            }
            return request;
          });
          setRequests(updatedRequests);
          message.success('请假申请已更新，等待审批');
        } else {
          // 创建新请假申请
          const newRequest: LeaveRequest = {
            id: requests.length + 1,
            userId: 1, // 假设当前用户ID为1
            userName: '管理员', // 假设当前用户名为管理员
            startDate,
            endDate,
            days,
            status: 'pending',
            createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            ...rest,
          };
          setRequests([...requests, newRequest]);
          message.success('请假申请已提交，等待审批');
        }
        setIsModalVisible(false);
      }, 500);
    });
  };

  // 提交审批表单
  const handleApproveSubmit = () => {
    approveForm.validateFields().then(values => {
      // 模拟API请求
      setTimeout(() => {
        const updatedRequests = requests.map(request => {
          if (request.id === currentRequest?.id) {
            return {
              ...request,
              status: values.status,
              approver: '管理员', // 假设当前审批人为管理员
              approveTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              approveRemark: values.approveRemark,
            };
          }
          return request;
        });
        setRequests(updatedRequests);
        setIsApproveModalVisible(false);
        message.success(`请假申请已${values.status === 'approved' ? '批准' : '拒绝'}`);
      }, 500);
    });
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'pending':
        return <Tag color="blue"><ClockCircleOutlined /> 待审批</Tag>;
      case 'approved':
        return <Tag color="green"><CheckCircleOutlined /> 已批准</Tag>;
      case 'rejected':
        return <Tag color="red"><CloseCircleOutlined /> 已拒绝</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 获取请假类型显示文本
  const getLeaveTypeText = (type: string) => {
    switch (type) {
      case 'annual': return '年假';
      case 'sick': return '病假';
      case 'personal': return '事假';
      case 'marriage': return '婚假';
      case 'maternity': return '产假';
      case 'bereavement': return '丧假';
      default: return '未知';
    }
  };

  const columns = [
    {
      title: '申请人',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '请假类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getLeaveTypeText(type),
      filters: [
        { text: '年假', value: 'annual' },
        { text: '病假', value: 'sick' },
        { text: '事假', value: 'personal' },
        { text: '婚假', value: 'marriage' },
        { text: '产假', value: 'maternity' },
        { text: '丧假', value: 'bereavement' },
      ],
      onFilter: (value: any, record: LeaveRequest) => record.type === value,
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: (a: LeaveRequest, b: LeaveRequest) => a.startDate.localeCompare(b.startDate),
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: '天数',
      dataIndex: 'days',
      key: 'days',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: '待审批', value: 'pending' },
        { text: '已批准', value: 'approved' },
        { text: '已拒绝', value: 'rejected' },
      ],
      onFilter: (value: any, record: LeaveRequest) => record.status === value,
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a: LeaveRequest, b: LeaveRequest) => a.createTime.localeCompare(b.createTime),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: LeaveRequest) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          )}
          {record.status === 'pending' && (
            <Button type="link" onClick={() => handleApprove(record)}>审批</Button>
          )}
          <Button type="link" onClick={() => showDetails(record)}>详情</Button>
        </Space>
      ),
    },
  ];

  // 显示请假详情
  const showDetails = (record: LeaveRequest) => {
    Modal.info({
      title: '请假详情',
      width: 600,
      content: (
        <div className="leave-details">
          <p><strong>申请人：</strong> {record.userName}</p>
          <p><strong>请假类型：</strong> {getLeaveTypeText(record.type)}</p>
          <p><strong>开始日期：</strong> {record.startDate}</p>
          <p><strong>结束日期：</strong> {record.endDate}</p>
          <p><strong>天数：</strong> {record.days}</p>
          <p><strong>请假原因：</strong> {record.reason}</p>
          <p><strong>申请时间：</strong> {record.createTime}</p>
          <p><strong>状态：</strong> {getStatusTag(record.status)}</p>
          {record.approver && <p><strong>审批人：</strong> {record.approver}</p>}
          {record.approveTime && <p><strong>审批时间：</strong> {record.approveTime}</p>}
          {record.approveRemark && <p><strong>审批备注：</strong> {record.approveRemark}</p>}
        </div>
      ),
      okText: '关闭',
    });
  };

  // 假期余额组件
  const LeaveBalanceCard = () => {
    if (!leaveBalance) return null;
    
    const balanceItems = [
      { type: 'annual', label: '年假', total: leaveBalance.annual, used: leaveBalance.annualUsed },
      { type: 'sick', label: '病假', total: leaveBalance.sick, used: leaveBalance.sickUsed },
      { type: 'personal', label: '事假', total: leaveBalance.personal, used: leaveBalance.personalUsed },
      { type: 'marriage', label: '婚假', total: leaveBalance.marriage, used: leaveBalance.marriageUsed },
      { type: 'maternity', label: '产假', total: leaveBalance.maternity, used: leaveBalance.maternityUsed },
      { type: 'bereavement', label: '丧假', total: leaveBalance.bereavement, used: leaveBalance.bereavementUsed },
    ];
    
    return (
      <div className="leave-balance-container">
        <Row gutter={[16, 16]}>
          {balanceItems.map(item => (
            <Col xs={24} sm={12} md={8} key={item.type}>
              <Card className="leave-balance-card">
                <h3>{item.label}</h3>
                <Progress 
                  type="circle" 
                  percent={Math.round((item.used / item.total) * 100)} 
                  format={() => `${item.used}/${item.total}`}
                  status={item.used >= item.total ? 'exception' : 'normal'}
                />
                <p className="balance-text">剩余: {item.total - item.used} 天</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  // 请假日历组件（简化版）
  const LeaveCalendar = () => {
    return (
      <div className="leave-calendar-container">
        <Card>
          <h3><CalendarOutlined /> 请假日历</h3>
          <p className="calendar-placeholder">此处将显示团队成员的请假日历视图，可以直观地看到每个人的请假安排。</p>
          <p className="calendar-placeholder">可以按月、周、日查看，并支持筛选特定部门或人员。</p>
        </Card>
      </div>
    );
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '请假申请',
      children: (
        <>
          <div className="leave-header">
            <Button type="primary" onClick={handleAdd}>
              申请请假
            </Button>
            <div className="leave-filters">
              <RangePicker onChange={handleDateRangeChange} />
            </div>
          </div>
          <Table 
            columns={columns} 
            dataSource={requests} 
            rowKey="id" 
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </>
      ),
    },
    {
      key: '2',
      label: '假期余额',
      children: <LeaveBalanceCard />,
    },
    {
      key: '3',
      label: '请假日历',
      children: <LeaveCalendar />,
    },
  ];

  return (
    <div className="leave-container">
      <h2>请假管理</h2>
      
      <Tabs defaultActiveKey="1" items={items} />

      {/* 请假申请表单 */}
      <Modal
        title={currentRequest ? "编辑请假申请" : "新建请假申请"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="提交"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="type" label="请假类型" rules={[{ required: true, message: '请选择请假类型' }]}>
            <Select>
              <Option value="annual">年假</Option>
              <Option value="sick">病假</Option>
              <Option value="personal">事假</Option>
              <Option value="marriage">婚假</Option>
              <Option value="maternity">产假</Option>
              <Option value="bereavement">丧假</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="请假日期" rules={[{ required: true, message: '请选择请假日期' }]}>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="reason" label="请假原因" rules={[{ required: true, message: '请填写请假原因' }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 审批表单 */}
      <Modal
        title="请假审批"
        open={isApproveModalVisible}
        onOk={handleApproveSubmit}
        onCancel={() => setIsApproveModalVisible(false)}
        okText="提交"
        cancelText="取消"
      >
        <Form form={approveForm} layout="vertical">
          {currentRequest && (
            <div className="approve-info">
              <p><strong>申请人：</strong> {currentRequest.userName}</p>
              <p><strong>请假类型：</strong> {getLeaveTypeText(currentRequest.type)}</p>
              <p><strong>请假日期：</strong> {currentRequest.startDate} 至 {currentRequest.endDate}</p>
              <p><strong>天数：</strong> {currentRequest.days} 天</p>
              <p><strong>请假原因：</strong> {currentRequest.reason}</p>
            </div>
          )}
          <Form.Item name="status" label="审批结果" rules={[{ required: true, message: '请选择审批结果' }]}>
            <Select>
              <Option value="approved">批准</Option>
              <Option value="rejected">拒绝</Option>
            </Select>
          </Form.Item>
          <Form.Item name="approveRemark" label="审批备注">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Leave;