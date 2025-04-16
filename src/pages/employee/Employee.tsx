import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Input, Space, Modal, Form, Select, DatePicker, Tabs, Upload, message, Divider, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExportOutlined, ImportOutlined, SearchOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import type { UploadProps } from 'antd';
import dayjs from 'dayjs';
import './Employee.css';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface EmployeeRecord {
  id: number;
  name: string;
  gender: string;
  birthDate: string;
  idCard: string;
  phone: string;
  email: string;
  address: string;
  department: string;
  position: string;
  employeeType: string;
  entryDate: string;
  status: string;
  education: EducationRecord[];
  workExperience: WorkExperienceRecord[];
  emergencyContact: EmergencyContactRecord[];
}

interface EducationRecord {
  id: number;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
}

interface WorkExperienceRecord {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface EmergencyContactRecord {
  id: number;
  name: string;
  relationship: string;
  phone: string;
}

const Employee: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeRecord | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('1');

  // 模拟获取员工数据
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const mockData: EmployeeRecord[] = [
        {
          id: 1,
          name: '张三',
          gender: '男',
          birthDate: '1990-01-15',
          idCard: '110101199001150123',
          phone: '13800138001',
          email: 'zhangsan@example.com',
          address: '北京市朝阳区某街道1号',
          department: '技术部',
          position: '高级工程师',
          employeeType: '全职',
          entryDate: '2020-03-01',
          status: '在职',
          education: [
            {
              id: 1,
              school: '北京大学',
              major: '计算机科学',
              degree: '本科',
              startDate: '2008-09-01',
              endDate: '2012-07-01'
            },
            {
              id: 2,
              school: '清华大学',
              major: '软件工程',
              degree: '硕士',
              startDate: '2012-09-01',
              endDate: '2015-07-01'
            }
          ],
          workExperience: [
            {
              id: 1,
              company: 'ABC科技有限公司',
              position: '软件工程师',
              startDate: '2015-07-01',
              endDate: '2018-06-30',
              description: '负责企业内部系统开发'
            },
            {
              id: 2,
              company: 'XYZ信息技术有限公司',
              position: '高级工程师',
              startDate: '2018-07-01',
              endDate: '2020-02-28',
              description: '负责核心业务系统架构设计与开发'
            }
          ],
          emergencyContact: [
            {
              id: 1,
              name: '李四',
              relationship: '父亲',
              phone: '13900139001'
            }
          ]
        },
        {
          id: 2,
          name: '李四',
          gender: '女',
          birthDate: '1992-05-20',
          idCard: '110101199205200456',
          phone: '13800138002',
          email: 'lisi@example.com',
          address: '北京市海淀区某街道2号',
          department: '市场部',
          position: '市场经理',
          employeeType: '全职',
          entryDate: '2019-06-01',
          status: '在职',
          education: [
            {
              id: 3,
              school: '中国人民大学',
              major: '市场营销',
              degree: '本科',
              startDate: '2010-09-01',
              endDate: '2014-07-01'
            }
          ],
          workExperience: [
            {
              id: 3,
              company: 'DEF营销策划有限公司',
              position: '市场专员',
              startDate: '2014-07-01',
              endDate: '2017-05-30',
              description: '负责产品推广和市场活动策划'
            },
            {
              id: 4,
              company: 'GHI广告传媒有限公司',
              position: '市场主管',
              startDate: '2017-06-01',
              endDate: '2019-05-30',
              description: '负责市场团队管理和品牌推广'
            }
          ],
          emergencyContact: [
            {
              id: 2,
              name: '王五',
              relationship: '配偶',
              phone: '13900139002'
            }
          ]
        },
      ];

      setEmployees(mockData);
      setLoading(false);
    }, 500);
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
    // 这里可以添加搜索逻辑
  };

  // 打开新建员工档案模态框
  const handleAdd = () => {
    setCurrentEmployee(null);
    form.resetFields();
    setIsModalVisible(true);
    setActiveTab('1');
  };

  // 打开编辑员工档案模态框
  const handleEdit = (record: EmployeeRecord) => {
    setCurrentEmployee(record);
    form.setFieldsValue({
      ...record,
      birthDate: record.birthDate ? dayjs(record.birthDate) : undefined,
      entryDate: record.entryDate ? dayjs(record.entryDate) : undefined,
    });
    setIsModalVisible(true);
    setActiveTab('1');
  };

  // 处理删除
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条员工档案吗？',
      onOk() {
        // 模拟删除操作
        const updatedEmployees = employees.filter(item => item.id !== id);
        setEmployees(updatedEmployees);
        message.success('员工档案已删除');
      },
    });
  };

  // 提交表单
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const formData = {
        ...values,
        birthDate: values.birthDate?.format('YYYY-MM-DD'),
        entryDate: values.entryDate?.format('YYYY-MM-DD'),
      };

      if (currentEmployee) {
        // 更新员工档案
        const updatedEmployees = employees.map(emp => {
          if (emp.id === currentEmployee.id) {
            return { ...emp, ...formData };
          }
          return emp;
        });
        setEmployees(updatedEmployees);
        message.success('员工档案已更新');
      } else {
        // 新建员工档案
        const newEmployee = {
          ...formData,
          id: Math.max(...employees.map(e => e.id), 0) + 1,
          education: [],
          workExperience: [],
          emergencyContact: [],
        };
        setEmployees([...employees, newEmployee]);
        message.success('员工档案已创建');
      }

      setIsModalVisible(false);
    });
  };

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // 表格列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: EmployeeRecord, b: EmployeeRecord) => a.name.localeCompare(b.name),
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
      onFilter: (value: any, record: EmployeeRecord) => record.department === value,
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '入职日期',
      dataIndex: 'entryDate',
      key: 'entryDate',
      sorter: (a: EmployeeRecord, b: EmployeeRecord) => a.entryDate.localeCompare(b.entryDate),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        if (status === '离职') {
          color = 'volcano';
        } else if (status === '休假') {
          color = 'geekblue';
        } else if (status === '试用期') {
          color = 'orange';
        }
        return <Tag color={color}>{status}</Tag>;
      },
      filters: [
        { text: '在职', value: '在职' },
        { text: '离职', value: '离职' },
        { text: '休假', value: '休假' },
        { text: '试用期', value: '试用期' },
      ],
      onFilter: (value: any, record: EmployeeRecord) => record.status === value,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: EmployeeRecord) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  // 表单标签页
  const formTabs: TabsProps['items'] = [
    {
      key: '1',
      label: '基本信息',
      children: (
        <>
          <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="gender" label="性别" rules={[{ required: true, message: '请选择性别' }]}>
            <Select placeholder="请选择性别">
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </Form.Item>
          <Form.Item name="birthDate" label="出生日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="idCard" label="身份证号" rules={[{ required: true, message: '请输入身份证号' }]}>
            <Input placeholder="请输入身份证号" />
          </Form.Item>
          <Form.Item name="phone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item name="email" label="电子邮箱">
            <Input placeholder="请输入电子邮箱" />
          </Form.Item>
          <Form.Item name="address" label="住址">
            <TextArea rows={2} placeholder="请输入住址" />
          </Form.Item>
        </>
      ),
    },
    {
      key: '2',
      label: '工作信息',
      children: (
        <>
          <Form.Item name="department" label="部门" rules={[{ required: true, message: '请选择部门' }]}>
            <Select placeholder="请选择部门">
              <Option value="技术部">技术部</Option>
              <Option value="市场部">市场部</Option>
              <Option value="人力资源部">人力资源部</Option>
              <Option value="财务部">财务部</Option>
            </Select>
          </Form.Item>
          <Form.Item name="position" label="职位" rules={[{ required: true, message: '请输入职位' }]}>
            <Input placeholder="请输入职位" />
          </Form.Item>
          <Form.Item name="employeeType" label="员工类型">
            <Select placeholder="请选择员工类型">
              <Option value="全职">全职</Option>
              <Option value="兼职">兼职</Option>
              <Option value="实习">实习</Option>
              <Option value="劳务">劳务</Option>
            </Select>
          </Form.Item>
          <Form.Item name="entryDate" label="入职日期" rules={[{ required: true, message: '请选择入职日期' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态">
              <Option value="在职">在职</Option>
              <Option value="离职">离职</Option>
              <Option value="休假">休假</Option>
              <Option value="试用期">试用期</Option>
            </Select>
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <div className="employee-container">
      <Card title="员工档案管理" extra={
        <Space>
          <Input.Search
            placeholder="搜索员工"
            allowClear
            onSearch={handleSearch}
            style={{ width: 200 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新建档案</Button>
          <Button icon={<ImportOutlined />}>导入</Button>
          <Button icon={<ExportOutlined />}>导出</Button>
        </Space>
      }>
        <Table
          columns={columns}
          dataSource={employees}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={currentEmployee ? '编辑员工档案' : '新建员工档案'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: '在职', employeeType: '全职', gender: '男' }}
        >
          <Tabs activeKey={activeTab} onChange={handleTabChange} items={formTabs} />
        </Form>
      </Modal>
    </div>
  );
};

export default Employee;