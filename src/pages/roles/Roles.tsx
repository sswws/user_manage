import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Switch, message, Popconfirm, Tag, Tooltip, Card, Row, Col, Tree, Checkbox, Divider } from 'antd';
import { TeamOutlined, EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, ReloadOutlined, ExclamationCircleOutlined, LockOutlined } from '@ant-design/icons';
import './Roles.css';

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  status: string;
  createTime?: string;
  userCount?: number;
}

// 模拟权限数据
const mockPermissions: Permission[] = [
  { id: 'user:view', name: '查看用户', description: '允许查看用户列表和详情', module: '用户管理' },
  { id: 'user:create', name: '创建用户', description: '允许创建新用户', module: '用户管理' },
  { id: 'user:edit', name: '编辑用户', description: '允许编辑用户信息', module: '用户管理' },
  { id: 'user:delete', name: '删除用户', description: '允许删除用户', module: '用户管理' },
  { id: 'role:view', name: '查看角色', description: '允许查看角色列表和详情', module: '角色管理' },
  { id: 'role:create', name: '创建角色', description: '允许创建新角色', module: '角色管理' },
  { id: 'role:edit', name: '编辑角色', description: '允许编辑角色信息', module: '角色管理' },
  { id: 'role:delete', name: '删除角色', description: '允许删除角色', module: '角色管理' },
  { id: 'log:view', name: '查看日志', description: '允许查看系统日志', module: '日志管理' },
  { id: 'setting:edit', name: '修改设置', description: '允许修改系统设置', module: '系统设置' },
  { id: 'dashboard:view', name: '查看仪表盘', description: '允许查看系统仪表盘', module: '仪表盘' },
  { id: 'stats:view', name: '查看统计', description: '允许查看数据统计', module: '数据统计' },
];

// 模拟角色数据
const mockRoles: Role[] = [
  {
    id: 1,
    name: '超级管理员',
    description: '拥有系统所有权限',
    permissions: mockPermissions.map(p => p.id),
    status: 'active',
    createTime: '2023-01-01',
    userCount: 1
  },
  {
    id: 2,
    name: '普通管理员',
    description: '拥有大部分管理权限，但无法管理角色',
    permissions: ['user:view', 'user:create', 'user:edit', 'user:delete', 'log:view', 'dashboard:view', 'stats:view'],
    status: 'active',
    createTime: '2023-01-15',
    userCount: 3
  },
  {
    id: 3,
    name: '普通用户',
    description: '只有基本的查看权限',
    permissions: ['user:view', 'dashboard:view'],
    status: 'active',
    createTime: '2023-02-01',
    userCount: 10
  },
  {
    id: 4,
    name: '访客',
    description: '仅有仪表盘查看权限',
    permissions: ['dashboard:view'],
    status: 'active',
    createTime: '2023-03-01',
    userCount: 5
  },
  {
    id: 5,
    name: '已禁用角色',
    description: '测试禁用状态',
    permissions: [],
    status: 'inactive',
    createTime: '2023-04-01',
    userCount: 0
  }
];

// 模拟API调用
const mockGetRoles = (): Promise<Role[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockRoles]);
    }, 500);
  });
};

const mockSaveRole = (role: Role): Promise<{success: boolean, message: string}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (role.id) {
        // 更新角色
        resolve({success: true, message: '角色更新成功'});
      } else {
        // 创建角色
        resolve({success: true, message: '角色创建成功'});
      }
    }, 500);
  });
};

const mockDeleteRole = (id: number): Promise<{success: boolean, message: string}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({success: true, message: '角色删除成功'});
    }, 500);
  });
};

// 将权限按模块分组
const getPermissionsByModule = () => {
  const modules: {[key: string]: Permission[]} = {};
  
  mockPermissions.forEach(permission => {
    if (!modules[permission.module]) {
      modules[permission.module] = [];
    }
    modules[permission.module].push(permission);
  });
  
  return modules;
};

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // 初始化加载角色数据
  useEffect(() => {
    fetchRoles();
  }, []);

  // 获取角色列表
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await mockGetRoles();
      setRoles(data);
    } catch (error) {
      console.error('获取角色列表失败:', error);
      message.error('获取角色列表失败');
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
      sorter: (a: Role, b: Role) => a.id - b.id,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span><TeamOutlined /> {text}</span>,
      sorter: (a: Role, b: Role) => a.name.localeCompare(b.name),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value: string, record: Role) => {
        return record.name.toLowerCase().includes(value.toLowerCase()) ||
          record.description.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '权限数量',
      key: 'permissionCount',
      render: (_: unknown, record: Role) => (
        <Tag color="blue">{record.permissions.length}</Tag>
      ),
      sorter: (a: Role, b: Role) => a.permissions.length - b.permissions.length,
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
      sorter: (a: Role, b: Role) => (a.userCount || 0) - (b.userCount || 0),
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
      onFilter: (value: string, record: Role) => record.status === value,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a: Role, b: Role) => a.createTime?.localeCompare(b.createTime || '') || 0,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Role) => (
        <Space size="middle">
          <Tooltip title="编辑角色">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除角色">
            <Popconfirm
              title="确认删除"
              description="确定要删除这个角色吗？此操作不可恢复。"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
              icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
              disabled={record.userCount! > 0}
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                disabled={record.userCount! > 0}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 处理编辑角色
  const handleEdit = (role: Role) => {
    setEditingRole(role);
    form.setFieldsValue({
      ...role,
      permissions: role.permissions
    });
    setIsModalVisible(true);
  };

  // 处理删除角色
  const handleDelete = async (id: number) => {
    try {
      const response = await mockDeleteRole(id);
      if (response.success) {
        setRoles(roles.filter(role => role.id !== id));
        message.success(response.message);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('删除角色失败:', error);
      message.error('删除角色失败，请稍后再试');
    }
  };

  // 处理批量删除角色
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '批量删除角色',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${selectedRowKeys.length} 个角色吗？此操作不可恢复。`,
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
            const role = roles.find(r => r.id === id);
            if (role && role.userCount === 0) {
              const response = await mockDeleteRole(id);
              if (response.success) {
                successCount++;
              }
            }
          }
          
          // 更新角色列表
          await fetchRoles();
          setSelectedRowKeys([]);
          
          message.success(`成功删除 ${successCount} 个角色`);
        } catch (error) {
          console.error('批量删除角色失败:', error);
          message.error('批量删除角色失败，请稍后再试');
        }
      },
    });
  };

  // 处理添加新角色
  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    form.setFieldsValue({
      status: 'active',
      permissions: []
    });
    setIsModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 准备角色数据
      const roleData: Role = editingRole 
        ? { ...values, id: editingRole.id } 
        : { ...values, id: Math.max(...roles.map(r => r.id)) + 1 };
      
      // 调用保存角色API
      const response = await mockSaveRole(roleData);
      
      if (response.success) {
        message.success(response.message);
        setIsModalVisible(false);
        fetchRoles(); // 重新加载角色列表
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('保存角色失败:', error);
      message.error('表单验证失败或保存过程中出错');
    }
  };

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: Role) => ({
      disabled: record.userCount! > 0, // 如果角色有关联用户，则不允许选择
    }),
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // 重置所有筛选和排序
  const handleReset = () => {
    setSearchText('');
    fetchRoles();
  };

  // 渲染权限选择器
  const renderPermissionSelector = () => {
    const modules = getPermissionsByModule();
    
    return (
      <div className="permission-selector">
        {Object.entries(modules).map(([module, permissions]) => (
          <div key={module} className="permission-module">
            <Divider orientation="left">{module}</Divider>
            <Row>
              {permissions.map(permission => (
                <Col span={8} key={permission.id}>
                  <Form.Item
                    name={['permissions']}
                    valuePropName="checked"
                    noStyle
                  >
                    <Checkbox 
                      value={permission.id}
                      style={{ marginBottom: 8 }}
                    >
                      {permission.name}
                      <Tooltip title={permission.description}>
                        <span className="permission-info">ⓘ</span>
                      </Tooltip>
                    </Checkbox>
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="roles-container">
      <Card>
        <div className="roles-header">
          <h2>角色管理</h2>
          <Space>
            <Input.Search 
              placeholder="搜索角色" 
              allowClear 
              onSearch={handleSearch} 
              style={{ width: 250 }} 
            />
            <Tooltip title="刷新数据">
              <Button icon={<ReloadOutlined />} onClick={handleReset} />
            </Tooltip>
          </Space>
        </div>

        <div className="roles-toolbar">
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAdd}
            >
              添加角色
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
          dataSource={roles} 
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

      {/* 角色表单模态框 */}
      <Modal
        title={editingRole ? '编辑角色' : '添加角色'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active', permissions: [] }}
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input prefix={<TeamOutlined />} placeholder="请输入角色名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="角色描述"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input.TextArea placeholder="请输入角色描述" rows={2} />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="正常" 
              unCheckedChildren="禁用" 
              defaultChecked 
              onChange={(checked) => form.setFieldValue('status', checked ? 'active' : 'inactive')}
            />
          </Form.Item>
          
          <Divider orientation="left">权限设置</Divider>
          
          <Form.Item
            name="permissions"
            label=""
          >
            <Checkbox.Group style={{ width: '100%' }}>
              {renderPermissionSelector()}
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Roles;