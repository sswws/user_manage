import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Input, Space, Modal, Form, Select, DatePicker, Tabs, message, Progress, Row, Col, Tag, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExportOutlined, SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import dayjs from 'dayjs';
import './Performance.css';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface PerformanceRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  department: string;
  position: string;
  period: string;
  evaluator: string;
  score: number;
  level: 'A' | 'B' | 'C' | 'D' | 'E';
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createTime: string;
  updateTime: string;
  comments?: string;
  goals: PerformanceGoal[];
}

interface PerformanceGoal {
  id: number;
  content: string;
  weight: number;
  score: number;
  achievement: number;
  comments?: string;
}

const Performance: React.FC = () => {
  const [records, setRecords] = useState<PerformanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<PerformanceRecord | null>(null);
  const [currentGoal, setCurrentGoal] = useState<PerformanceGoal | null>(null);
  const [form] = Form.useForm();
  const [goalForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('1');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2023-Q2');

  // 模拟获取绩效数据
  useEffect(() => {
    fetchPerformanceRecords();
  }, []);

  const fetchPerformanceRecords = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const mockData: PerformanceRecord[] = [
        {
          id: 1,
          employeeId: 1,
          employeeName: '张三',
          department: '技术部',
          position: '高级工程师',
          period: '2023-Q2',
          evaluator: '李经理',
          score: 92,
          level: 'A',
          status: 'approved',
          createTime: '2023-06-25 10:30:00',
          updateTime: '2023-07-05 14:20:00',
          comments: '表现优秀，能够高质量完成工作任务，具有良好的团队协作精神。',
          goals: [
            {
              id: 1,
              content: '完成新系统核心模块开发',
              weight: 40,
              score: 95,
              achievement: 100,
              comments: '按时高质量完成任务',
            },
            {
              id: 2,
              content: '优化系统性能，提升响应速度',
              weight: 30,
              score: 90,
              achievement: 90,
              comments: '系统响应速度提升了30%',
            },
            {
              id: 3,
              content: '指导新员工，提升团队技术水平',
              weight: 30,
              score: 90,
              achievement: 90,
              comments: '积极分享技术经验，帮助团队成员成长',
            },
          ],
        },
        {
          id: 2,
          employeeId: 2,
          employeeName: '李四',
          department: '市场部',
          position: '市场经理',
          period: '2023-Q2',
          evaluator: '王总监',
          score: 85,
          level: 'B',
          status: 'approved',
          createTime: '2023-06-26 09:15:00',
          updateTime: '2023-07-06 11:30:00',
          comments: '工作认真负责，市场推广活动策划有创意，但执行过程中还有提升空间。',
          goals: [
            {
              id: 4,
              content: '策划并执行Q2季度市场推广活动',
              weight: 50,
              score: 85,
              achievement: 90,
              comments: '活动创意好，但执行过程中有些延误',
            },
            {
              id: 5,
              content: '提升品牌知名度和用户增长',
              weight: 30,
              score: 80,
              achievement: 85,
              comments: '用户增长达到预期目标的85%',
            },
            {
              id: 6,
              content: '优化市场投放策略，提高ROI',
              weight: 20,
              score: 90,
              achievement: 95,
              comments: '有效控制了市场投放成本，ROI提升明显',
            },
          ],
        },
        {
          id: 3,
          employeeId: 3,
          employeeName: '王五',
          department: '人力资源部',
          position: 'HR专员',
          period: '2023-Q2',
          evaluator: '赵经理',
          score: 78,
          level: 'C',
          status: 'approved',
          createTime: '2023-06-27 14:00:00',
          updateTime: '2023-07-07 10:00:00',
          comments: '基本能完成本职工作，但在招聘效率和员工培训方面还需加强。',
          goals: [
            {
              id: 7,
              content: '完成Q2季度招聘计划',
              weight: 40,
              score: 75,
              achievement: 80,
              comments: '招聘进度有所延迟，但基本完成了招聘目标',
            },
            {
              id: 8,
              content: '组织员工培训活动',
              weight: 30,
              score: 80,
              achievement: 85,
              comments: '培训活动组织有序，但内容可以更加丰富',
            },
            {
              id: 9,
              content: '优化绩效考核流程',
              weight: 30,
              score: 80,
              achievement: 80,
              comments: '提出了一些改进建议，但实施效果一般',
            },
          ],
        },
        {
          id: 4,
          employeeId: 4,
          employeeName: '赵六',
          department: '财务部',
          position: '财务主管',
          period: '2023-Q2',
          evaluator: '钱总监',
          score: 0,
          level: 'A',
          status: 'draft',
          createTime: '2023-06-28 16:45:00',
          updateTime: '2023-06-28 16:45:00',
          goals: [
            {
              id: 10,
              content: '完成Q2季度财务报表',
              weight: 40,
              score: 0,
              achievement: 0,
              comments: '',
            },
            {
              id: 11,
              content: '优化财务流程，提高工作效率',
              weight: 30,
              score: 0,
              achievement: 0,
              comments: '',
            },
            {
              id: 12,
              content: '控制运营成本，提高资金使用效率',
              weight: 30,
              score: 0,
              achievement: 0,
              comments: '',
            },
          ],
        },
      ];

      setRecords(mockData);
      setLoading(false);
    }, 500);
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
    // 这里可以添加搜索逻辑
  };

  // 处理周期选择
  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    // 这里可以添加按周期筛选的逻辑
  };

  // 打开新建绩效记录模态框
  const handleAdd = () => {
    setCurrentRecord(null);
    form.resetFields();
    form.setFieldsValue({
      period: selectedPeriod,
      status: 'draft',
    });
    setIsModalVisible(true);
    setActiveTab('1');
  };

  // 打开编辑绩效记录模态框
  const handleEdit = (record: PerformanceRecord) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      ...record,
    });
    setIsModalVisible(true);
    setActiveTab('1');
  };

  // 打开目标编辑模态框
  const handleEditGoal = (record: PerformanceRecord, goal: PerformanceGoal | null) => {
    setCurrentRecord(record);
    setCurrentGoal(goal);
    
    if (goal) {
      goalForm.setFieldsValue({
        ...goal,
      });
    } else {
      goalForm.resetFields();
      goalForm.setFieldsValue({
        weight: 0,
        score: 0,
        achievement: 0,
      });
    }
    
    setIsGoalModalVisible(true);
  };

  // 处理删除
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条绩效记录吗？',
      onOk() {
        // 模拟删除操作
        const updatedRecords = records.filter(item => item.id !== id);
        setRecords(updatedRecords);
        message.success('绩效记录已删除');
      },
    });
  };

  // 处理提交审批
  const handleSubmit = (id: number) => {
    Modal.confirm({
      title: '确认提交',
      content: '确定要提交这条绩效记录进行审批吗？',
      onOk() {
        // 模拟提交操作
        const updatedRecords = records.map(item => {
          if (item.id === id) {
            return {
              ...item,
              status: 'submitted' as const,
              updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            };
          }
          return item;
        });
        setRecords(updatedRecords);
        message.success('绩效记录已提交审批');
      },
    });
  };

  // 处理审批
  const handleApprove = (id: number, approved: boolean) => {
    Modal.confirm({
      title: approved ? '确认通过' : '确认拒绝',
      content: approved ? '确定要通过这条绩效记录吗？' : '确定要拒绝这条绩效记录吗？',
      onOk() {
        // 模拟审批操作
        const updatedRecords = records.map(item => {
          if (item.id === id) {
            return {
              ...item,
              status: approved ? 'approved' as const : 'rejected' as const,
              updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            };
          }
          return item;
        });
        setRecords(updatedRecords);
        message.success(`绩效记录已${approved ? '通过' : '拒绝'}`);
      },
    });
  };

  // 提交绩效记录表单
  const handleFormSubmit = () => {
    form.validateFields().then(values => {
      const formData = {
        ...values,
      };

      if (currentRecord) {
        // 更新绩效记录
        const updatedRecords = records.map(record => {
          if (record.id === currentRecord.id) {
            return { 
              ...record, 
              ...formData,
              updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            };
          }
          return record;
        });
        setRecords(updatedRecords);
        message.success('绩效记录已更新');
      } else {
        // 新建绩效记录
        const newRecord = {
          ...formData,
          id: Math.max(...records.map(r => r.id), 0) + 1,
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          goals: [],
        };
        setRecords([...records, newRecord]);
        message.success('绩效记录已创建');
      }

      setIsModalVisible(false);
    });
  };

  // 提交目标表单
  const handleGoalSubmit = () => {
    goalForm.validateFields().then(values => {
      if (!currentRecord) return;
      
      const formData = {
        ...values,
      };

      const updatedRecords = records.map(record => {
        if (record.id === currentRecord.id) {
          let updatedGoals;
          
          if (currentGoal) {
            // 更新目标
            updatedGoals = record.goals.map(goal => {
              if (goal.id === currentGoal.id) {
                return { ...goal, ...formData };
              }
              return goal;
            });
          } else {
            // 新建目标
            const newGoal = {
              ...formData,
              id: Math.max(...record.goals.map(g => g.id), 0) + 1,
            };
            updatedGoals = [...record.goals, newGoal];
          }
          
          // 计算总分
          let totalScore = 0;
          let totalWeight = 0;
          
          updatedGoals.forEach(goal => {
            totalScore += goal.score * (goal.weight / 100);
            totalWeight += goal.weight;
          });
          
          // 根据总分确定等级
          let level: 'A' | 'B' | 'C' | 'D' | 'E' = 'C';
          if (totalScore >= 90) level = 'A';
          else if (totalScore >= 80) level = 'B';
          else if (totalScore >= 70) level = 'C';
          else if (totalScore >= 60) level = 'D';
          else level = 'E';
          
          return { 
            ...record, 
            goals: updatedGoals,
            score: totalWeight === 100 ? Math.round(totalScore) : record.score,
            level: totalWeight === 100 ? level : record.level,
            updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          };
        }
        return record;
      });
      
      setRecords(updatedRecords);
      message.success(currentGoal ? '绩效目标已更新' : '绩效目标已添加');
      setIsGoalModalVisible(false);
    });
  };

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'draft':
        return <Tag color="blue">草稿</Tag>;
      case 'submitted':
        return <Tag color="orange">已提交</Tag>;
      case 'approved':
        return <Tag color="green">已通过</Tag>;
      case 'rejected':
        return <Tag color="red">已拒绝</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 获取等级标签
  const getLevelTag = (level: string, score: number) => {
    if (score === 0) return <Tag>未评分</Tag>;
    
    switch (level) {
      case 'A':
        return <Tag color="#f50">A</Tag>;
      case 'B':
        return <Tag color="#87d068">B</Tag>;
      case 'C':
        return <Tag color="#2db7f5">C</Tag>;
      case 'D':
        return <Tag color="#108ee9">D</Tag>;
      case 'E':
        return <Tag color="#999">E</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '员工姓名',
      dataIndex: 'employeeName',
      key: 'employeeName',
      sorter: (a: PerformanceRecord, b: PerformanceRecord) => a.employeeName.localeCompare(b.employeeName),
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      filters: [
        { text: '技术部', value: '技术部' },
        { text: '市场部', value: '市场部' },
        { text: '人力资源部', value: '人力资源部' },
        { text: '财务部', value: '财务部' },
      ],
      onFilter: (value: any, record: PerformanceRecord) => record.department === value,
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '考核周期',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: '评分',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => {
        if (score === 0) return '未评分';
        return (
          <Tooltip title={`${score}分`}>
            <Progress
              percent={score}
              size="small"
              status={score >= 80 ? 'success' : score >= 60 ? 'normal' : 'exception'}
              format={() => `${score}`}
            />
          </Tooltip>
        );
      },
      sorter: (a: PerformanceRecord, b: PerformanceRecord) => a.score - b.score,
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      render: (level: string, record: PerformanceRecord) => getLevelTag(level, record.score),
      filters: [
        { text: 'A', value: 'A' },
        { text: 'B', value: 'B' },
        { text: 'C', value: 'C' },
        { text: 'D', value: 'D' },
        { text: 'E', value: 'E' },
      ],
      onFilter: (value: any, record: PerformanceRecord) => record.level === value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: '草稿', value: 'draft' },
        { text: '已提交', value: 'submitted' },
        { text: '已通过', value: 'approved' },
        { text: '已拒绝', value: 'rejected' },
      ],
      onFilter: (value: any, record: PerformanceRecord) => record.status === value,
    },
    {
      title: '评估人',
      dataIndex: 'evaluator',
      key: 'evaluator',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      sorter: (a: PerformanceRecord, b: PerformanceRecord) => a.updateTime.localeCompare(b.updateTime),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: PerformanceRecord) => {
        const actions = [];
        
        // 编辑按钮 - 草稿状态可编辑
        if (record.status === 'draft') {
          actions.push(
            <Button key="edit" type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          );
        }
        
        // 目标按钮 - 草稿状态可编辑目标
        if (record.status === 'draft') {
          actions.push(
            <Button key="goals" type="link" icon={<StarOutlined />} onClick={() => handleEditGoal(record, null)}>添加目标</Button>
          );
        }
        
        // 提交按钮 - 草稿状态可提交
        if (record.status === 'draft') {
          actions.push(
            <Button key="submit" type="link" icon={<CheckCircleOutlined />} onClick={() => handleSubmit(record.id)}>提交</Button>
          );
        }
        
        // 审批按钮 - 已提交状态可审批
        if (record.status === 'submitted') {
          actions.push(
            <Button key="approve" type="link" icon={<CheckCircleOutlined />} onClick={() => handleApprove(record.id, true)}>通过</Button>
          );
          actions.push(
            <Button key="reject" type="link" danger icon={<CloseCircleOutlined />} onClick={() => handleApprove(record.id, false)}>拒绝</Button>
          );
        }
        
        // 删除按钮 - 草稿状态可删除
        if (record.status === 'draft') {
          actions.push(
            <Button key="delete" type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
          );
        }
        
        return <Space size="middle">{actions}</Space>;
      },
    },
  ];

  // 表单标签页
  const formTabs: TabsProps['items'] = [
    {
      key: '1',
      label: '基本信息',
      children: (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="employeeId" label="员工ID" rules={[{ required: true, message: '请输入员工ID' }]}>
                <Input placeholder="请输入员工ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="employeeName" label="员工姓名" rules={[{ required: true, message: '请输入员工姓名' }]}>
                <Input placeholder="请输入员工姓名" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="department" label="部门" rules={[{ required: true, message: '请选择部门' }]}>
                <Select placeholder="请选择部门">
                  <Option value="技术部">技术部</Option>
                  <Option value="市场部">市场部</Option>
                  <Option value="人力资源部">人力资源部</Option>
                  <Option value="财务部">财务部</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="position" label="职位" rules={[{ required: true, message: '请输入职位' }]}>
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="period" label="考核周期" rules={[{ required: true, message: '请选择考核周期' }]}>
                <Select placeholder="请选择考核周期">
                  <Option value="2023-Q1">2023年第一季度</Option>
                  <Option value="2023-Q2">2023年第二季度</Option>
                  <Option value="2023-Q3">2023年第三季度</Option>
                  <Option value="2023-Q4">2023年第四季度</Option>
                  <Option value="2023-H1">2023年上半年</Option>
                  <Option value="2023-H2">2023年下半年</Option>
                  <Option value="2023">2023年全年</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="evaluator" label="评估人" rules={[{ required: true, message: '请输入评估人' }]}>
                <Input placeholder="请输入评估人" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
                <Select placeholder="请选择状态">
                  <Option value="draft">草稿</Option>
                  <Option value="submitted">已提交</Option>
                  <Option value="approved">已通过</Option>
                  <Option value="rejected">已拒绝</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="comments" label="评语">
            <TextArea rows={4} placeholder="请输入评语" />
          </Form.Item>
        </>
      ),
    },
    {
      key: '2',
      label: '绩效目标',
      children: currentRecord ? (
        <>
          <div className="performance-goals-header">
            <div className="performance-goals-title">绩效目标列表</div>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleEditGoal(currentRecord, null)}>添加目标</Button>
          </div>
          <Table
            dataSource={currentRecord.goals}
            rowKey="id"
            pagination={false}
            columns={[
              {
                title: '目标内容',
                dataIndex: 'content',
                key: 'content',
              },
              {
                title: '权重',
                dataIndex: 'weight',
                key: 'weight',
                render: (weight: number) => `${weight}%`,
              },
              {
                title: '完成度',
                dataIndex: 'achievement',
                key: 'achievement',
                render: (achievement: number) => `${achievement}%`,
              },
              {
                title: '得分',
                dataIndex: 'score',
                key: 'score',
              },
              {
                title: '操作',
                key: 'action',
                render: (_: any, goal: PerformanceGoal) => (
                  <Button type="link" icon={<EditOutlined />} onClick={() => handleEditGoal(currentRecord, goal)}>编辑</Button>
                ),
              },
            ]}
          />
        </>
      ) : (
        <div className="performance-goals-empty">
          请先保存基本信息后再添加绩效目标
        </div>
      ),
    },
  ];

  return (
    <div className="performance-container">
      <Card title="绩效考核管理" extra={
        <Space>
          <Select
            placeholder="选择考核周期"
            value={selectedPeriod}
            onChange={handlePeriodChange}
            style={{ width: 150 }}
          >
            <Option value="2023-Q1">2023年第一季度</Option>
            <Option value="2023-Q2">2023年第二季度</Option>
            <Option value="2023-Q3">2023年第三季度</Option>
            <Option value="2023-Q4">2023年第四季度</Option>
            <Option value="2023-H1">2023年上半年</Option>
            <Option value="2023-H2">2023年下半年</Option>
            <Option value="2023">2023年全年</Option>
          </Select>
          <Input.Search
            placeholder="搜索员工"
            allowClear
            onSearch={handleSearch}
            style={{ width: 200 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建绩效</Button>
          <Button icon={<ExportOutlined />}>导出</Button>
        </Space>
      }>
        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 绩效记录表单模态框 */}
      <Modal
        title={currentRecord ? '编辑绩效记录' : '新建绩效记录'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleFormSubmit}
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Tabs activeKey={activeTab} onChange={handleTabChange} items={formTabs} />
        </Form>
      </Modal>

      {/* 绩效目标表单模态框 */}
      <Modal
        title={currentGoal ? '编辑绩效目标' : '添加绩效目标'}
        open={isGoalModalVisible}
        onCancel={() => setIsGoalModalVisible(false)}
        onOk={handleGoalSubmit}
        width={600}
        destroyOnClose
      >
        <Form
          form={goalForm}
          layout="vertical"
        >
          <Form.Item name="content" label="目标内容" rules={[{ required: true, message: '请输入目标内容' }]}>
            <TextArea rows={3} placeholder="请输入目标内容" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="weight" label="权重(%)" rules={[{ required: true, message: '请输入权重' }]}>
                <Input type="number" min={0} max={100} placeholder="请输入权重" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="achievement" label="完成度(%)" rules={[{ required: true, message: '请输入完成度' }]}>
                <Input type="number" min={0} max={100} placeholder="请输入完成度" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="score" label="得分" rules={[{ required: true, message: '请输入得分' }]}>
                <Input type="number" min={0} max={100} placeholder="请输入得分" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="comments" label="评语">
            <TextArea rows={2} placeholder="请输入评语" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Performance;