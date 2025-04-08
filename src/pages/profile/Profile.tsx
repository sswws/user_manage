import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Button, Upload, message, Avatar, Row, Col, Divider, Space, Switch, List, Badge, Popconfirm } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, UploadOutlined, SaveOutlined, BellOutlined, SecurityScanOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import './Profile.css';

const { TabPane } = Tabs;

interface UserProfile {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  department?: string;
  position?: string;
  bio?: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  loginNotifications: boolean;
  activeDevices: Array<{
    id: string;
    deviceName: string;
    lastActive: string;
    location: string;
    current: boolean;
  }>;
}

interface NotificationSettings {
  emailNotifications: boolean;
  systemNotifications: boolean;
  securityAlerts: boolean;
  updates: boolean;
}

const Profile: React.FC = () => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  
  // 模拟用户数据
  const mockUserProfile: UserProfile = {
    id: 1,
    name: '管理员',
    username: 'admin',
    email: 'admin@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    phone: '13800138000',
    department: '技术部',
    position: '系统管理员',
    bio: '负责系统的日常管理和维护工作。'
  };
  
  const mockSecuritySettings: SecuritySettings = {
    twoFactorEnabled: false,
    lastPasswordChange: '2023-05-15',
    loginNotifications: true,
    activeDevices: [
      {
        id: 'd1',
        deviceName: 'Chrome on Windows',
        lastActive: '当前在线',
        location: '北京',
        current: true
      },
      {
        id: 'd2',
        deviceName: 'Safari on iPhone',
        lastActive: '2023-06-01 15:30',
        location: '上海',
        current: false
      },
      {
        id: 'd3',
        deviceName: 'Firefox on MacOS',
        lastActive: '2023-05-28 09:15',
        location: '广州',
        current: false
      }
    ]
  };
  
  const mockNotificationSettings: NotificationSettings = {
    emailNotifications: true,
    systemNotifications: true,
    securityAlerts: true,
    updates: false
  };
  
  // 初始化表单数据
  useEffect(() => {
    // 设置个人资料表单初始值
    profileForm.setFieldsValue(mockUserProfile);
    
    // 设置头像
    if (mockUserProfile.avatar) {
      setAvatarUrl(mockUserProfile.avatar);
      setFileList([{
        uid: '-1',
        name: 'avatar.png',
        status: 'done',
        url: mockUserProfile.avatar,
      }]);
    }
    
    // 设置通知设置表单初始值
    notificationForm.setFieldsValue(mockNotificationSettings);
  }, [profileForm, notificationForm]);
  
  // 处理头像上传
  const handleAvatarChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
    if (fileList.length > 0 && fileList[0].url) {
      setAvatarUrl(fileList[0].url);
    } else if (fileList.length > 0 && fileList[0].originFileObj) {
      // 在实际应用中，这里应该上传文件到服务器
      // 这里仅做演示，使用本地URL
      const url = URL.createObjectURL(fileList[0].originFileObj);
      setAvatarUrl(url);
    } else {
      setAvatarUrl(undefined);
    }
  };
  
  // 处理个人资料更新
  const handleProfileUpdate = async (values: UserProfile) => {
    setLoading(true);
    try {
      // 这里应该调用API更新个人资料
      console.log('更新个人资料:', values);
      message.success('个人资料更新成功');
    } catch (error) {
      console.error('更新个人资料失败:', error);
      message.error('更新个人资料失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 处理密码更新
  const handlePasswordUpdate = async (values: any) => {
    setLoading(true);
    try {
      // 这里应该调用API更新密码
      console.log('更新密码:', values);
      message.success('密码更新成功');
      passwordForm.resetFields();
    } catch (error) {
      console.error('更新密码失败:', error);
      message.error('更新密码失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 处理通知设置更新
  const handleNotificationUpdate = async (values: NotificationSettings) => {
    setLoading(true);
    try {
      // 这里应该调用API更新通知设置
      console.log('更新通知设置:', values);
      message.success('通知设置更新成功');
    } catch (error) {
      console.error('更新通知设置失败:', error);
      message.error('更新通知设置失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 处理设备移除
  const handleRemoveDevice = (deviceId: string) => {
    message.success('设备已移除');
    // 在实际应用中，这里应该调用API移除设备
  };
  
  // 渲染个人资料表单
  const renderProfileForm = () => (
    <div className="profile-section">
      <Row gutter={24}>
        <Col xs={24} md={8} className="avatar-section">
          <div className="avatar-container">
            <Avatar 
              size={120} 
              src={avatarUrl} 
              icon={<UserOutlined />} 
            />
            <div className="avatar-upload">
              <Upload
                listType="picture"
                maxCount={1}
                fileList={fileList}
                onChange={handleAvatarChange}
                beforeUpload={() => false}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>更换头像</Button>
              </Upload>
            </div>
          </div>
        </Col>
        <Col xs={24} md={16}>
          <Form
            form={profileForm}
            layout="vertical"
            onFinish={handleProfileUpdate}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="username"
                  label="用户名"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="请输入用户名" disabled />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="手机号"
                >
                  <Input placeholder="请输入手机号" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="department"
                  label="部门"
                >
                  <Input placeholder="请输入部门" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="position"
                  label="职位"
                >
                  <Input placeholder="请输入职位" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="bio"
              label="个人简介"
            >
              <Input.TextArea rows={4} placeholder="请输入个人简介" />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                保存修改
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
  
  // 渲染安全设置
  const renderSecuritySettings = () => (
    <div className="security-section">
      <div className="section-item">
        <div className="section-header">
          <h3>密码设置</h3>
          <p>上次密码修改时间: {mockSecuritySettings.lastPasswordChange}</p>
        </div>
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordUpdate}
        >
          <Form.Item
            name="currentPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入当前密码" />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '密码长度不能小于8个字符' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入新密码" />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请确认新密码" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              更新密码
            </Button>
          </Form.Item>
        </Form>
      </div>
      
      <Divider />
      
      <div className="section-item">
        <div className="section-header">
          <h3>两步验证</h3>
          <p>增强账户安全性，登录时需要额外验证</p>
        </div>
        <div className="section-content">
          <Space>
            <Switch 
              checked={mockSecuritySettings.twoFactorEnabled} 
              onChange={(checked) => message.info(`两步验证已${checked ? '启用' : '禁用'}`)} 
            />
            <span>{mockSecuritySettings.twoFactorEnabled ? '已启用' : '未启用'}</span>
          </Space>
        </div>
      </div>
      
      <Divider />
      
      <div className="section-item">
        <div className="section-header">
          <h3>登录通知</h3>
          <p>当账户在新设备上登录时接收通知</p>
        </div>
        <div className="section-content">
          <Space>
            <Switch 
              checked={mockSecuritySettings.loginNotifications} 
              onChange={(checked) => message.info(`登录通知已${checked ? '启用' : '禁用'}`)} 
            />
            <span>{mockSecuritySettings.loginNotifications ? '已启用' : '未启用'}</span>
          </Space>
        </div>
      </div>
      
      <Divider />
      
      <div className="section-item">
        <div className="section-header">
          <h3>当前登录设备</h3>
          <p>管理您的登录设备</p>
        </div>
        <List
          itemLayout="horizontal"
          dataSource={mockSecuritySettings.activeDevices}
          renderItem={item => (
            <List.Item
              actions={[
                !item.current && (
                  <Popconfirm
                    title="确定要移除此设备吗？"
                    onConfirm={() => handleRemoveDevice(item.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />}>
                      移除
                    </Button>
                  </Popconfirm>
                )
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    {item.deviceName}
                    {item.current && <Badge status="processing" text="当前设备" />}
                  </Space>
                }
                description={
                  <div>
                    <div>最后活动: {item.lastActive}</div>
                    <div>位置: {item.location}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
  
  // 渲染通知设置
  const renderNotificationSettings = () => (
    <div className="notification-section">
      <Form
        form={notificationForm}
        layout="vertical"
        onFinish={handleNotificationUpdate}
        initialValues={mockNotificationSettings}
      >
        <div className="section-header">
          <h3>通知设置</h3>
          <p>管理您接收的通知类型</p>
        </div>
        
        <Form.Item
          name="emailNotifications"
          valuePropName="checked"
          label="电子邮件通知"
        >
          <Switch />
        </Form.Item>
        
        <Form.Item
          name="systemNotifications"
          valuePropName="checked"
          label="系统通知"
        >
          <Switch />
        </Form.Item>
        
        <Form.Item
          name="securityAlerts"
          valuePropName="checked"
          label="安全警报"
        >
          <Switch />
        </Form.Item>
        
        <Form.Item
          name="updates"
          valuePropName="checked"
          label="系统更新通知"
        >
          <Switch />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
            保存设置
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
  
  return (
    <div className="profile-container">
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane 
            tab={<span><UserOutlined /> 个人资料</span>} 
            key="1"
          >
            {renderProfileForm()}
          </TabPane>
          <TabPane 
            tab={<span><SecurityScanOutlined /> 安全设置</span>} 
            key="2"
          >
            {renderSecuritySettings()}
          </TabPane>
          <TabPane 
            tab={<span><BellOutlined /> 通知设置</span>} 
            key="3"
          >
            {renderNotificationSettings()}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Profile;