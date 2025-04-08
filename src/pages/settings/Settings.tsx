import React, { useState } from 'react';
import { Card, Tabs, Form, Input, Button, Switch, Select, InputNumber, message, Space, Divider, Upload, Radio, TimePicker, Tooltip } from 'antd';
import { SaveOutlined, UploadOutlined, QuestionCircleOutlined, SecurityScanOutlined, ToolOutlined, GlobalOutlined, BellOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import './Settings.css';

const { TabPane } = Tabs;

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  logo: string;
  adminEmail: string;
  recordsPerPage: number;
  enableRegistration: boolean;
  theme: string;
  language: string;
}

interface SecuritySettings {
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSymbols: boolean;
  loginAttempts: number;
  sessionTimeout: number;
  enableTwoFactor: boolean;
  allowedIPs: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  userRegistrationNotify: boolean;
  loginFailureNotify: boolean;
  systemUpdatesNotify: boolean;
  emailServer: string;
  emailPort: number;
  emailUsername: string;
  emailPassword: string;
}

const Settings: React.FC = () => {
  const [systemForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');
  const [logoFile, setLogoFile] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  // 模拟初始设置数据
  const initialSystemSettings: SystemSettings = {
    siteName: '用户管理系统',
    siteDescription: '一个功能强大的用户管理系统',
    logo: '',
    adminEmail: 'admin@example.com',
    recordsPerPage: 10,
    enableRegistration: true,
    theme: 'light',
    language: 'zh_CN',
  };

  const initialSecuritySettings: SecuritySettings = {
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: false,
    loginAttempts: 5,
    sessionTimeout: 30,
    enableTwoFactor: false,
    allowedIPs: '*',
  };

  const initialNotificationSettings: NotificationSettings = {
    emailNotifications: false,
    userRegistrationNotify: true,
    loginFailureNotify: true,
    systemUpdatesNotify: true,
    emailServer: 'smtp.example.com',
    emailPort: 587,
    emailUsername: 'notifications@example.com',
    emailPassword: '',
  };

  // 初始化表单数据
  React.useEffect(() => {
    systemForm.setFieldsValue(initialSystemSettings);
    securityForm.setFieldsValue(initialSecuritySettings);
    notificationForm.setFieldsValue(initialNotificationSettings);
  }, [systemForm, securityForm, notificationForm]);

  // 处理系统设置保存
  const handleSystemSubmit = async (values: SystemSettings) => {
    setLoading(true);
    try {
      // 这里应该调用API保存设置
      console.log('保存系统设置:', values);
      message.success('系统设置保存成功');
    } catch (error) {
      console.error('保存系统设置失败:', error);
      message.error('保存系统设置失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理安全设置保存
  const handleSecuritySubmit = async (values: SecuritySettings) => {
    setLoading(true);
    try {
      // 这里应该调用API保存设置
      console.log('保存安全设置:', values);
      message.success('安全设置保存成功');
    } catch (error) {
      console.error('保存安全设置失败:', error);
      message.error('保存安全设置失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理通知设置保存
  const handleNotificationSubmit = async (values: NotificationSettings) => {
    setLoading(true);
    try {
      // 这里应该调用API保存设置
      console.log('保存通知设置:', values);
      message.success('通知设置保存成功');
    } catch (error) {
      console.error('保存通知设置失败:', error);
      message.error('保存通知设置失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理Logo上传
  const handleLogoChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setLogoFile(fileList);
  };

  // 渲染系统设置表单
  const renderSystemSettings = () => (
    <Form
      form={systemForm}
      layout="vertical"
      onFinish={handleSystemSubmit}
      initialValues={initialSystemSettings}
    >
      <Form.Item
        name="siteName"
        label="系统名称"
        rules={[{ required: true, message: '请输入系统名称' }]}
      >
        <Input placeholder="请输入系统名称" />
      </Form.Item>

      <Form.Item
        name="siteDescription"
        label="系统描述"
      >
        <Input.TextArea rows={3} placeholder="请输入系统描述" />
      </Form.Item>

      <Form.Item
        name="logo"
        label="系统Logo"
      >
        <Upload
          listType="picture"
          maxCount={1}
          fileList={logoFile}
          onChange={handleLogoChange}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>上传Logo</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="adminEmail"
        label="管理员邮箱"
        rules={[
          { required: true, message: '请输入管理员邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' }
        ]}
      >
        <Input placeholder="请输入管理员邮箱" />
      </Form.Item>

      <Form.Item
        name="recordsPerPage"
        label="每页记录数"
        rules={[{ required: true, message: '请输入每页记录数' }]}
      >
        <InputNumber min={5} max={100} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="enableRegistration"
        label="允许用户注册"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name="theme"
        label="系统主题"
      >
        <Radio.Group>
          <Radio.Button value="light">浅色</Radio.Button>
          <Radio.Button value="dark">深色</Radio.Button>
          <Radio.Button value="auto">自动</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="language"
        label="系统语言"
      >
        <Select>
          <Select.Option value="zh_CN">简体中文</Select.Option>
          <Select.Option value="en_US">English</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
          保存设置
        </Button>
      </Form.Item>
    </Form>
  );

  // 渲染安全设置表单
  const renderSecuritySettings = () => (
    <Form
      form={securityForm}
      layout="vertical"
      onFinish={handleSecuritySubmit}
      initialValues={initialSecuritySettings}
    >
      <Divider orientation="left">密码策略</Divider>

      <Form.Item
        name="passwordMinLength"
        label={
          <span>
            密码最小长度
            <Tooltip title="设置用户密码的最小长度要求">
              <QuestionCircleOutlined style={{ marginLeft: 4 }} />
            </Tooltip>
          </span>
        }
        rules={[{ required: true, message: '请输入密码最小长度' }]}
      >
        <InputNumber min={6} max={32} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="passwordRequireUppercase"
        label="要求包含大写字母"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name="passwordRequireNumbers"
        label="要求包含数字"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name="passwordRequireSymbols"
        label="要求包含特殊符号"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Divider orientation="left">登录安全</Divider>

      <Form.Item
        name="loginAttempts"
        label={
          <span>
            最大登录尝试次数
            <Tooltip title="超过此次数后账户将被临时锁定">
              <QuestionCircleOutlined style={{ marginLeft: 4 }} />
            </Tooltip>
          </span>
        }
        rules={[{ required: true, message: '请输入最大登录尝试次数' }]}
      >
        <InputNumber min={1} max={10} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="sessionTimeout"
        label="会话超时时间(分钟)"
        rules={[{ required: true, message: '请输入会话超时时间' }]}
      >
        <InputNumber min={5} max={1440} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="enableTwoFactor"
        label={
          <span>
            启用两因素认证
            <Tooltip title="启用后用户登录时需要额外验证">
              <QuestionCircleOutlined style={{ marginLeft: 4 }} />
            </Tooltip>
          </span>
        }
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name="allowedIPs"
        label={
          <span>
            允许的IP地址
            <Tooltip title="使用*表示允许所有IP，多个IP使用逗号分隔">
              <QuestionCircleOutlined style={{ marginLeft: 4 }} />
            </Tooltip>
          </span>
        }
      >
        <Input placeholder="例如: 192.168.1.*, 10.0.0.1" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
          保存设置
        </Button>
      </Form.Item>
    </Form>
  );

  // 渲染通知设置表单
  const renderNotificationSettings = () => (
    <Form
      form={notificationForm}
      layout="vertical"
      onFinish={handleNotificationSubmit}
      initialValues={initialNotificationSettings}
    >
      <Form.Item
        name="emailNotifications"
        label="启用邮件通知"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Divider orientation="left">通知事件</Divider>

      <Form.Item
        name="userRegistrationNotify"
        label="新用户注册"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name="loginFailureNotify"
        label="登录失败"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name="systemUpdatesNotify"
        label="系统更新"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Divider orientation="left">邮件服务器设置</Divider>

      <Form.Item
        name="emailServer"
        label="SMTP服务器"
        rules={[{ required: true, message: '请输入SMTP服务器地址' }]}
      >
        <Input placeholder="例如: smtp.example.com" />
      </Form.Item>

      <Form.Item
        name="emailPort"
        label="SMTP端口"
        rules={[{ required: true, message: '请输入SMTP端口' }]}
      >
        <InputNumber min={1} max={65535} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="emailUsername"
        label="邮箱用户名"
        rules={[{ required: true, message: '请输入邮箱用户名' }]}
      >
        <Input placeholder="请输入邮箱用户名" />
      </Form.Item>

      <Form.Item
        name="emailPassword"
        label="邮箱密码"
        rules={[{ required: true, message: '请输入邮箱密码' }]}
      >
        <Input.Password placeholder="请输入邮箱密码" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
            保存设置
          </Button>
          <Button onClick={() => message.info('测试邮件已发送，请检查收件箱')}>
            测试邮件发送
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return (
    <div className="settings-container">
      <Card>
        <h2>系统设置</h2>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={<span><ToolOutlined /> 基本设置</span>} 
            key="1"
          >
            {renderSystemSettings()}
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

export default Settings;