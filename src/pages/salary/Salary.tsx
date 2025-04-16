import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Input, Space, Modal, Form, Select, DatePicker, Tabs, message, Statistic, Row, Col, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExportOutlined, SearchOutlined, DollarOutlined, BarChartOutlined, FileTextOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import dayjs from 'dayjs';
import './Salary.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface SalaryRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  department: string;
  position: string;
  month: string;
  baseSalary: number;
  bonus: number;
  allowance: number;
  overtime: number;
  insurance: number;
  tax: number;
  totalSalary: number;
  status: 'pending' | 'paid' | 'error';
  payDate?: string;
  remark?: string;
}

interface SalaryStructure {
  employeeId: number;
  employeeName: string;
  baseSalary: number;
  allowanceRatio: number;
  bonusRatio: number;
  insuranceRatio: number;
  taxRatio: number;
  effectiveDate: string;
}

const Salary: React.FC = () => {
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isStructureModalVisible, setIsStructureModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<SalaryRecord | null>(null);
  const [currentStructure, setCurrentStructure] = useState<SalaryStructure | null>(null);
  const [form] = Form.useForm();
  const [structureForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('1');
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs>(dayjs());

  // 模拟获取薪资数据
  useEffect(() => {
    fetchSalaryRecords();
    fetchSalaryStructures();
  }, []);

  const fetchSalaryRecords = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const mockData: SalaryRecord[] = [
        {
          id: 1,
          employeeId: 1,
          employeeName: '张三',
          department: '技术部',
          position: '高级工程师',
          month: '2023-06',
          baseSalary: 15000,
          bonus: 3000,
          allowance: 2000,
          overtime: 1000,
          insurance: 2000,
          tax: 1500,
          totalSalary: 17500,
          status: 'paid',
          payDate: '2023-07-05',
        },
        {
          id: 2,
          employeeId: 2,
          employeeName: '李四',
          department: '市场部',
          position: '市场经理',
          month: '2023-06',
          baseSalary: 12000,
          bonus: 5000,
          allowance: 1500,
          overtime: 0,
          insurance: 1800,
          tax: 1200,
          totalSalary: 15500,
          status: 'paid',
          payDate: '2023-07-05',
        },
        {
          id: 3,
          employeeId: 3,
          employeeName: '王五',
          department: '人力资源部',
          position: 'HR专员',
          month: '2023-06',
          baseSalary: 10000,
          bonus: 1000,
          allowance: 1000,
          overtime: 500,
          insurance: 1500,
          tax: 800,
          totalSalary: 10200,
          status: 'paid',
          payDate: '2023-07-05',
        },
        {
          id: 4,
          employeeId: 1,
          employeeName: '张三',
          department: '技术部',
          position: '高级工程师',
          month: '2023-07',
          baseSalary: 15000,
          bonus: 2000,
          allowance: 2000,
          overtime: 1500,
          insurance: 2000,
          tax: 1500,
          totalSalary: 17000,
          status: 'pending',
        },
        {
          id: 5,
          employeeId: 2,
          employeeName: '李四',
          department: '市场部',
          position: '市场经理',
          month: '2023-07',
          baseSalary: 12000,
          bonus: 3000,
          allowance: 1500,
          overtime: 0,
          insurance: 1800,
          tax: 1000,
          totalSalary: 13700,
          status: 'pending',
        },
      ];

      setSalaryRecords(mockData);
      setLoading(false);
    }, 500);
  };

  const fetchSalaryStructures = () => {
    // 模拟API请求
    setTimeout(() => {
      const mockData: SalaryStructure[] = [
        {
          employeeId: 1,
          employeeName: '张三',
          baseSalary: 15000,
          allowanceRatio: 0.13,
          bonusRatio: 0.2,
          insuranceRatio: 0.13,
          taxRatio: 0.1,
          effectiveDate: '2023-01-01',
        },
        {
          employeeId: 2,
          employeeName: '李四',
          baseSalary: 12000,
          allowanceRatio: 0.12,
          bonusRatio: 0.25,
          insuranceRatio: 0.15,
          taxRatio: 0.1,
          effectiveDate: '2023-01-01',
        },
        {
          employeeId: 3,
          employeeName: '王五',
          baseSalary: 10000,
          allowanceRatio: 0.1,
          bonusRatio: 0.1,
          insuranceRatio: 0.15,
          taxRatio: 0.08,
          effectiveDate: '2023-01-01',
        },
      ];

      setSalaryStructures(mockData);
    }, 500);
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
    // 这里可以添加搜索逻辑
  };

  // 处理月份选择
  const handleMonthChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedMonth(date);
      // 这里可以添加按月份筛选的逻辑
    }
  };

  // 打开新建薪资记录模态框
  const handleAdd = () => {
    setCurrentRecord(null);
    form.resetFields();
    form.setFieldsValue({
      month: selectedMonth,
      status: 'pending',
    });
    setIsModalVisible(true);
  };

  // 打开编辑薪资记录模态框
  const handleEdit = (record: SalaryRecord) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      ...record,
      month: dayjs(record.month),
      payDate: record.payDate ? dayjs(record.payDate) : undefined,
    });
    setIsModalVisible(true);
  };

  // 打开薪资结构模态框
  const handleStructure = (employeeId: number, employeeName: string) => {
    const structure = salaryStructures.find(s => s.employeeId === employeeId);
    if (structure) {
      setCurrentStructure(structure);
      structureForm.setFieldsValue({
        ...structure,
        effectiveDate: dayjs(structure.effectiveDate),
      });
    } else {
      setCurrentStructure(null);
      structureForm.resetFields();
      structureForm.setFieldsValue({
        employeeId,
        employeeName,
        effectiveDate: dayjs(),
      });
    }
    setIsStructureModalVisible(true);
  };

  // 处理删除
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条薪资记录吗？',
      onOk() {
        // 模拟删除操作
        const updatedRecords = salaryRecords.filter(item => item.id !== id);
        setSalaryRecords(updatedRecords);
        message.success('薪资记录已删除');
      },
    });
  };

  // 处理薪资发放
  const handlePay = (id: number) => {
    Modal.confirm({
      title: '确认发放',
      content: '确定要发放这笔薪资吗？',
      onOk() {
        // 模拟发放操作
        const updatedRecords = salaryRecords.map(item => {
          if (item.id === id) {
            return {
              ...item,
              status: 'paid' as const,
              payDate: dayjs().format('YYYY-MM-DD'),
            };
          }
          return item;
        });
        setSalaryRecords(updatedRecords);
        message.success('薪资已发放');
      },
    });
  };

  // 提交薪资记录表单
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const formData = {
        ...values,
        month: values.month.format('YYYY-MM'),
        payDate: values.payDate?.format('YYYY-MM-DD'),
        totalSalary: values.baseSalary + values.bonus + values.allowance + values.overtime - values.insurance - values.tax,
      };

      if (currentRecord) {
        // 更新薪资记录
        const updatedRecords = salaryRecords.map(record => {
          if (record.id === currentRecord.id) {
            return { ...record, ...formData };
          }
          return record;
        });
        setSalaryRecords(updatedRecords);
        message.success('薪资记录已更新');
      } else {
        // 新建薪资记录
        const newRecord = {
          ...formData,
          id: Math.max(...salaryRecords.map(r => r.id), 0) + 1,
        };
        setSalaryRecords([...salaryRecords, newRecord]);
        message.success('薪资记录已创建');
      }

      setIsModalVisible(false);
    });
  };

  // 提交薪资结构表单
  const handleStructureSubmit = () => {
    structureForm.validateFields().then(values => {
      const formData = {
        ...values,
        effectiveDate: values.effectiveDate.format('YYYY-MM-DD'),
      };

      if (currentStructure) {
        // 更新薪资结构
        const updatedStructures = salaryStructures.map(structure => {
          if (structure.employeeId === currentStructure.employeeId) {
            return { ...structure, ...formData };
          }
          return structure;
        });
        setSalaryStructures(updatedStructures);
        message.success('薪资结构已更新');
      } else {
        // 新建薪资结构
        setSalaryStructures([...salaryStructures, formData]);
        message.success('薪资结构已创建');
      }

      setIsStructureModalVisible(false);
    });
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'paid':
        return <Tag color="green">已发放</Tag>;
      case 'pending':
        return <Tag color="orange">待发放</Tag>;
      case 'error':
        return <Tag color="red">异常</Tag>;
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
      sorter: (a: SalaryRecord, b: SalaryRecord) => a.employeeName.localeCompare(b.employeeName),
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
      onFilter: (value: any, record: SalaryRecord) => record.department === value,
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '月份',
      dataIndex: 'month',
      key: 'month',
      sorter: (a: SalaryRecord, b: SalaryRecord) => a.month.localeCompare(b.month),
    },
    {
      title: '基本工资',
      dataIndex: 'baseSalary',
      key: 'baseSalary',
      render: (value: number) => `¥${value.toFixed(2)}`,
      sorter: (a: SalaryRecord, b: SalaryRecord) => a.baseSalary - b.baseSalary,
    },
    {
      title: '奖金',
      dataIndex: 'bonus',
      key: 'bonus',
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
    {
      title: '津贴',
      dataIndex: 'allowance',
      key: 'allowance',
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
    {
      title: '加班费',
      dataIndex: 'overtime',
      key: 'overtime',
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
    {
      title: '社保',
      dataIndex: 'insurance',
      key: 'insurance',
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
    {
      title: '个税',
      dataIndex: 'tax',
      key: 'tax',
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
    {
      title: '实发工资',
      dataIndex: 'totalSalary',
      key: 'totalSalary',
      render: (value: number) => `¥${value.toFixed(2)}`,
      sorter: (a: SalaryRecord, b: SalaryRecord) => a.totalSalary - b.totalSalary,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: '已发放', value: 'paid' },
        { text: '待发放', value: 'pending' },
        { text: '异常', value: 'error' },
      ],
      onFilter: (value: any, record: SalaryRecord) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SalaryRecord) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          {record.status === 'pending' && (
            <Button type="link" icon={<DollarOutlined />} onClick={() => handlePay(record.id)}>发放</Button>
          )}
          <Button type="link" icon={<FileTextOutlined />} onClick={() => handleStructure(record.employeeId, record.employeeName)}>薪资结构</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  // 统计数据
  const currentMonthRecords = salaryRecords.filter(record => record.month === selectedMonth.format('YYYY-MM'));
  const totalSalary = currentMonthRecords.reduce((sum, record) => sum + record.totalSalary, 0);
  const paidCount = currentMonthRecords.filter(record => record.status === 'paid').length;
  const pendingCount = currentMonthRecords.filter(record => record.status === 'pending').length;

  return (
    <div className="salary-container">
      <Row gutter={[16, 16]} className="salary-stats">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="本月薪资总额"
              value={totalSalary}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="员工人数"
              value={currentMonthRecords.length}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="已发放"
              value={paidCount}
              valueStyle={{ color: '#52c41a' }}
              suffix={`/${currentMonthRecords.length}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="待发放"
              value={pendingCount}
              valueStyle={{ color: '#faad14' }}
              suffix={`/${currentMonthRecords.length}`}
            />
          </Card>
        </Col>
      </Row>

      <Card title="薪资管理" extra={
        <Space>
          <DatePicker
            picker="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            allowClear={false}
          />
          <Input.Search
            placeholder="搜索员工"
            allowClear
            onSearch={handleSearch}
            style={{ width: 200 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建薪资记录</Button>
          <Button icon={<ExportOutlined />}>导出</Button>
        </Space>
      }>
        <Table
          columns={columns}
          dataSource={salaryRecords}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 薪资记录表单模态框 */}
      <Modal
        title={currentRecord ? '编辑薪资记录' : '新建薪资记录'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
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
              <Form.Item name="month" label="月份" rules={[{ required: true, message: '请选择月份' }]}>
                <DatePicker picker="month" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
                <Select placeholder="请选择状态">
                  <Option value="pending">待发放</Option>
                  <Option value="paid">已发放</Option>
                  <Option value="error">异常</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="baseSalary" label="基本工资" rules={[{ required: true, message: '请输入基本工资' }]}>
                <Input type="number" prefix="¥" placeholder="请输入基本工资" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="bonus" label="奖金" rules={[{ required: true, message: '请输入奖金' }]}>
                <Input type="number" prefix="¥" placeholder="请输入奖金" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="allowance" label="津贴" rules={[{ required: true, message: '请输入津贴' }]}>
                <Input type="number" prefix="¥" placeholder="请输入津贴" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="overtime" label="加班费" rules={[{ required: true, message: '请输入加班费' }]}>
                <Input type="number" prefix="¥" placeholder="请输入加班费" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="insurance" label="社保" rules={[{ required: true, message: '请输入社保' }]}>
                <Input type="number" prefix="¥" placeholder="请输入社保" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tax" label="个税" rules={[{ required: true, message: '请输入个税' }]}>
                <Input type="number" prefix="¥" placeholder="请输入个税" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 薪资结构表单模态框 */}
      <Modal
        title="薪资结构设置"
        open={isStructureModalVisible}
        onCancel={() => setIsStructureModalVisible(false)}
        onOk={handleStructureSubmit}
        width={600}
        destroyOnClose
      >
        <Form
          form={structureForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="employeeId" label="员工ID" hidden>
                <Input />
              </Form.Item>
              <Form.Item name="employeeName" label="员工姓名">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="effectiveDate" label="生效日期" rules={[{ required: true, message: '请选择生效日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="baseSalary" label="基本工资" rules={[{ required: true, message: '请输入基本工资' }]}>
            <Input type="number" prefix="¥" placeholder="请输入基本工资" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="allowanceRatio" label="津贴比例" rules={[{ required: true, message: '请输入津贴比例' }]}>
                <Input type="number" suffix="%" placeholder="请输入津贴比例" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="bonusRatio" label="奖金比例" rules={[{ required: true, message: '请输入奖金比例' }]}>
                <Input type="number" suffix="%" placeholder="请输入奖金比例" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="insuranceRatio" label="社保比例" rules={[{ required: true, message: '请输入社保比例' }]}>
                <Input type="number" suffix="%" placeholder="请输入社保比例" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="taxRatio" label="个税比例" rules={[{ required: true, message: '请输入个税比例' }]}>
                <Input type="number" suffix="%" placeholder="请输入个税比例" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Salary;