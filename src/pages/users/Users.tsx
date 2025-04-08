import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm, Tag, Tooltip, Card, Row, Col, Drawer, Spin, Avatar, Divider } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, EyeOutlined, ReloadOutlined, ExclamationCircleOutlined, FilterOutlined } from '@ant-design/icons';
import { mockDeleteUser, mockGetUsers, mockSaveUser } from '../../mock/users';
import './Users.css';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  createTime?: string;
  lastLogin?: string;
}

const Users: React.FC = () => {
  // 状态管理
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // 初始化加载用户数据
  useEffect(() => {
    fetchUsers();
  }, []);

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await mockGetUsers();
      if (response.success) {
        // 为了兼容现有数据结构，添加一些模拟数据
        const enhancedUsers = response.data.map((user: any) => ({
          ...user,
          email: `${user.username}@example.com`,
          status: Math.random() > 0.3 ? 'active' : 'inactive',
          createTime: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
          lastLogin: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString().split('T')[0],
        }));
        setUsers(enhancedUsers);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 表格列定义
  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: User, b: User) => a.id - b.id,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: User) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <span>{text}</span>
        </Space>
      ),
      sorter: (a: User, b: User) => a.name.localeCompare(b.name),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value: string, record: User) => {
        return record.name.toLowerCase().includes(value.toLowerCase()) ||
          record.username.toLowerCase().includes(value.toLowerCase()) ||
          record.email.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'blue' : role === 'guest' ? 'orange' : 'green'}>
          {role === 'admin' ? '管理员' : role === 'guest' ? '访客' : '普通用户'}
        </Tag>
      ),
      filters: [
        { text: '管理员', value: 'admin' },
        { text: '普通用户', value: 'user' },
        { text: '访客', value: 'guest' },
      ],
      onFilter: (value: string, record: User) => record.role === value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag className={`status-tag ${status}`}>
          {status === 'active' ? '正常' : '禁用'}
        </Tag>
      ),
      filters: [
        { text: '正常', value: 'active' },
        { text: '禁用', value: 'inactive' },
      ],
      onFilter: (value: string, record: User) => record.status === value,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a: User, b: User) => a.createTime?.localeCompare(b.createTime || '') || 0,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="编辑用户">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除用户">
            <Popconfirm
              title="确认删除"
              description="确定要删除这个用户吗？此操作不可恢复。"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
              icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 处理查看用户详情
  const handleViewDetails = (user: User) => {
    setViewingUser(user);
    setIsDetailVisible(true);
  };

  // 处理编辑用户
  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  // 处理删除用户
  const handleDelete = async (id: number) => {
    try {
      const response = await mockDeleteUser(id);
      if (response.success) {
        setUsers(users.filter(user => user.id !== id));
        message.success(response.message);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('删除用户失败:', error);
      message.error('删除用户失败，请稍后再试');
    }
  };

  // 处理批量删除用户
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '批量删除用户',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${selectedRowKeys.length} 个用户吗？此操作不可恢复。`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        try {
          // 在实际应用中，这里应该调用批量删除API
          // 这里我们模拟一个一个删除
          let successCount = 0;
          for (const key of selectedRowKeys) {
            const id = Number(key);
            const response = await mockDeleteUser(id);
            if (response.success) {
              successCount++;
            }
          }
          
          // 更新用户列表
          await fetchUsers();
          setSelectedRowKeys([]);
          
          message.success(`成功删除 ${successCount} 个用户`);
        } catch (error) {
          console.error('批量删除用户失败:', error);
          message.error('批量删除用户失败，请稍后再试');
        }
      },
    });
  };

  // 处理添加新用户
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 准备用户数据
      const userData = editingUser ? { ...values, id: editingUser.id } : values;
      
      // 调用保存用户API
      const response = await mockSaveUser(userData);
      
      if (response.success) {
        message.success(response.message);
        setIsModalVisible(false);
        fetchUsers(); // 重新加载用户列表
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('保存用户失败:', error);
      message.error('表单验证失败或保存过程中出错');
    }
  };

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // 重置所有筛选和排序
  const handleReset = () => {
    setSearchText('');
    fetchUsers();
  };

  return (
    <div className="users-container">
      <Card>
        <div className="users-header">
          <h2>用户管理</h2>
          <Space>
            <Input.Search 
              placeholder="搜索用户" 
              allowClear 
              onSearch={handleSearch} 
              style={{ width: 250 }} 
            />
            <Tooltip title="刷新数据">
              <Button icon={<ReloadOutlined />} onClick={handleReset} />
            </Tooltip>
            <Tooltip title="筛选">
              <Button icon={<FilterOutlined />} />
            </Tooltip>
          </Space>
        </div>

        <div className="users-toolbar">
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAdd}
            >
              添加用户
            </Button>
            {selectedRowKeys.length > 0 && (
              <Button 
                danger 
                icon={<DeleteOutlined />} 
                onClick={handleBatchDelete}
              >
                批量删除 ({selectedRowKeys.length})
              </Button>
            )}
          </Space>
        </div>
        
        <Table 
          rowSelection={rowSelection}
          columns={columns} 
          dataSource={users} 
          rowKey="id" 
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          loading={loading}
        />
      </Card>

      {/* 用户表单模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ role: 'user', status: 'active' }}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
          </Form.Item>
          
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          
          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}
          
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select>
              <Select.Option value="admin">管理员</Select.Option>
              <Select.Option value="user">普通用户</Select.Option>
              <Select.Option value="guest">访客</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Select.Option value="active">正常</Select.Option>
              <Select.Option value="inactive">禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 用户详情抽屉 */}
      <Drawer
        title="用户详情"
        placement="right"
        onClose={() => setIsDetailVisible(false)}
        open={isDetailVisible}
        width={400}
      >
        {viewingUser && (
          <div className="user-detail">
            <div className="user-detail-header">
              <Avatar 
                size={64} 
                src={viewingUser.avatar} 
                icon={<UserOutlined />} 
              />
              <h3>{viewingUser.name}</h3>
              <p>{viewingUser.email}</p>
            </div>
            
            <Divider />
            
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="detail-item">
                  <div className="detail-label">用户ID</div>
                  <div className="detail-value">{viewingUser.id}</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="detail-item">
                  <div className="detail-label">用户名</div>
                  <div className="detail-value">{viewingUser.username}</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="detail-item">
                  <div className="detail-label">角色</div>
                  <div className="detail-value">
                    <Tag color={viewingUser.role === 'admin' ? 'blue' : viewingUser.role === 'guest' ? 'orange' : 'green'}>
                      {viewingUser.role === 'admin' ? '管理员' : viewingUser.role === 'guest' ? '访客' : '普通用户'}
                    </Tag>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="detail-item">
                  <div className="detail-label">状态</div>
                  <div className="detail-value">
                    <Tag className={`status-tag ${viewingUser.status}`}>
                      {viewingUser.status === 'active' ? '正常' : '禁用'}
                    </Tag>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="detail-item">
                  <div className="detail-label">创建时间</div>
                  <div className="detail-value">{viewingUser.createTime}</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="detail-item">
                  <div className="detail-label">最后登录</div>
                  <div className="detail-value">{viewingUser.lastLogin}</div>
                </div>
              </Col>
            </Row>
            
            <Divider />
            
            <Space>
              <Button type="primary" icon={<EditOutlined />} onClick={() => {
                setIsDetailVisible(false);
                handleEdit(viewingUser);
              }}>
                编辑用户
              </Button>
              <Popconfirm
                title="确认删除"
                description="确定要删除这个用户吗？此操作不可恢复。"
                onConfirm={() => {
                  handleDelete(viewingUser.id);
                  setIsDetailVisible(false);
                }}
                okText="确定"
                cancelText="取消"
                icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
              >
                <Button danger icon={<DeleteOutlined />}>
                  删除用户
                </Button>
              </Popconfirm>
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Users;