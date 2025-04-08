import React, { useState, useEffect } from 'react';
import { Card, Form, Switch, InputNumber, Button, Space, Divider, Alert, Tooltip, Slider, Row, Col } from 'antd';
import { SaveOutlined, UndoOutlined, QuestionCircleOutlined, LockOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { 
  getPasswordPolicy, 
  setPasswordPolicy, 
  getAccountLockPolicy, 
  setAccountLockPolicy,
  defaultPasswordPolicy,
  defaultAccountLockPolicy
} from '../../utils/securityManager';
import { confirmAction, RiskLevel } from '../../utils/confirmAction';

interface SecuritySettingsProps {
  onSettingsChange?: () => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onSettingsChange }) => {
  const [passwordForm] = Form.useForm();
  const [accountForm] = Form.useForm();
  const [passwordStrengthPreview, setPasswordStrengthPreview] = useState<number>(0);
  
  // 初始化表单数据
  useEffect(() => {
    const passwordPolicy = getPasswordPolicy();
    const accountLockPolicy = getAccountLockPolicy();
    
    passwordForm.setFieldsValue(passwordPolicy);
    accountForm.setFieldsValue(accountLockPolicy);
    
    // 计算密码强度预览
    calculatePasswordStrengthPreview(passwordPolicy);
  }, [passwordForm, accountForm]);
  
  // 计算密码强度预览
  const calculatePasswordStrengthPreview = (policy: any) => {
    let strength = 0;
    
    // 基础分数：最小长度
    strength += Math.min(policy.minLength * 4, 40);
    
    // 额外要求加分
    if (policy.requireUppercase) strength += 10;
    if (policy.requireLowercase) strength += 10;
    if (policy.requireNumbers) strength += 10;
    if (policy.requireSymbols) strength += 15;
    
    // 防止常见密码和用户信息
    if (policy.preventCommonPasswords) strength += 10;
    if (policy.preventUserInfoInPassword) strength += 5;
    
    // 确保分数在0-100范围内
    strength = Math.max(0, Math.min(100, strength));
    
    setPasswordStrengthPreview(strength);
  };
  
  // 处理密码策略保存
  const handlePasswordSubmit = async (values: any) => {
    try {
      // 确认操作
      await confirmAction({
        title: '确认修改密码策略',
        content: '修改密码策略可能会影响所有用户的密码验证规则。确定要继续吗？',
        riskLevel: RiskLevel.MEDIUM
      });
      
      setPasswordPolicy(values);
      calculatePasswordStrengthPreview(values);
      
      if (onSettingsChange) {
        onSettingsChange();
      }
    } catch (error) {
      console.error('保存密码策略失败:', error);
    }
  };
  
  // 处理账户锁定策略保存
  const handleAccountSubmit = async (values: any) => {
    try {
      // 确认操作
      await confirmAction({
        title: '确认修改账户锁定策略',
        content: '修改账户锁定策略可能会影响所有用户的登录行为。确定要继续吗？',
        riskLevel: RiskLevel.MEDIUM
      });
      
      setAccountLockPolicy(values);
      
      if (onSettingsChange) {
        onSettingsChange();
      }
    } catch (error) {
      console.error('保存账户锁定策略失败:', error);
    }
  };
  
  // 重置密码策略
  const resetPasswordPolicy = () => {
    passwordForm.setFieldsValue(defaultPasswordPolicy);
    calculatePasswordStrengthPreview(defaultPasswordPolicy);
  };
  
  // 重置账户锁定策略
  const resetAccountLockPolicy = () => {
    accountForm.setFieldsValue(defaultAccountLockPolicy);
  };
  
  // 获取密码强度颜色
  const getStrengthColor = (strength: number) => {
    if (strength < 30) return '#ff4d4f';
    if (strength < 50) return '#faad14';
    if (strength < 70) return '#1890ff';
    if (strength < 90) return '#52c41a';
    return '#13c2c2';
  };
  
  // 获取密码强度描述
  const getStrengthDescription = (strength: number) => {
    if (strength < 30) return '非常弱';
    if (strength < 50) return '弱';
    if (strength < 70) return '中等';
    if (strength < 90) return '强';
    return '非常强';
  };
  
  return (
    <>
      <Card 
        title={
          <Space>
            <LockOutlined />
            密码策略设置
          </Space>
        } 
        className="settings-card"
      >
        <Alert
          message="密码强度预览"
          description={
            <div>
              <div style={{ marginBottom: 8 }}>
                根据当前设置，用户密码强度要求为：
                <span style={{ color: getStrengthColor(passwordStrengthPreview), fontWeight: 'bold' }}>
                  {getStrengthDescription(passwordStrengthPreview)}
                </span>
              </div>
              <div 
                style={{ 
                  height: 8, 
                  background: '#f0f0f0', 
                  borderRadius: 4, 
                  overflow: 'hidden' 
                }}
              >
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${passwordStrengthPreview}%`, 
                    background: getStrengthColor(passwordStrengthPreview),
                    transition: 'all 0.3s'
                  }}
                />
              </div>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
        
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordSubmit}
          initialValues={getPasswordPolicy()}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    最小密码长度
                    <Tooltip title="设置密码的最小字符数">
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                }
                name="minLength"
                rules={[{ required: true, message: '请设置最小密码长度' }]}
              >
                <Slider
                  min={6}
                  max={16}
                  step={1}
                  marks={{
                    6: '6',
                    8: '8',
                    10: '10',
                    12: '12',
                    16: '16'
                  }}
                  onChange={() => calculatePasswordStrengthPreview(passwordForm.getFieldsValue())}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    密码过期天数
                    <Tooltip title="设置密码过期的天数，0表示永不过期">
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                }
                name="expirationDays"
                rules={[{ required: true, message: '请设置密码过期天数' }]}
              >
                <InputNumber min={0} max={365} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    密码历史记录数量
                    <Tooltip title="记录用户最近使用的密码数量，防止重复使用">
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                }
                name="passwordHistoryCount"
                rules={[{ required: true, message: '请设置密码历史记录数量' }]}
              >
                <InputNumber min={0} max={20} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    最大重复字符数
                    <Tooltip title="允许的最大连续重复字符数，0表示不限制">
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                }
                name="maxRepeatedChars"
                rules={[{ required: true, message: '请设置最大重复字符数' }]}
              >
                <InputNumber min={0} max={10} style={{ width: '100%' }} onChange={() => calculatePasswordStrengthPreview(passwordForm.getFieldsValue())} />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">密码复杂度要求</Divider>
          
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="要求包含大写字母"
                name="requireUppercase"
                valuePropName="checked"
              >
                <Switch onChange={() => calculatePasswordStrengthPreview(passwordForm.getFieldsValue())} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="要求包含小写字母"
                name="requireLowercase"
                valuePropName="checked"
              >
                <Switch onChange={() => calculatePasswordStrengthPreview(passwordForm.getFieldsValue())} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="要求包含数字"
                name="requireNumbers"
                valuePropName="checked"
              >
                <Switch onChange={() => calculatePasswordStrengthPreview(passwordForm.getFieldsValue())} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="要求包含特殊符号"
                name="requireSymbols"
                valuePropName="checked"
              >
                <Switch onChange={() => calculatePasswordStrengthPreview(passwordForm.getFieldsValue())} />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">安全增强选项</Divider>
          
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    禁止常见密码
                    <Tooltip title="禁止使用常见的简单密码，如'password123'">
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                }
                name="preventCommonPasswords"
                valuePropName="checked"
              >
                <Switch onChange={() => calculatePasswordStrengthPreview(passwordForm.getFieldsValue())} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    禁止使用用户信息作为密码
                    <Tooltip title="禁止在密码中包含用户名、姓名等个人信息">
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                }
                name="preventUserInfoInPassword"
                valuePropName="checked"
              >
                <Switch onChange={() => calculatePasswordStrengthPreview(passwordForm.getFieldsValue())} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                保存密码策略
              </Button>
              <Button icon={<UndoOutlined />} onClick={resetPasswordPolicy}>
                重置为默认
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      
      <Card 
        title={
          <Space>
            <SecurityScanOutlined />
            账户锁定策略
          </Space>
        } 
        className="settings-card"
        style={{ marginTop: 24 }}
      >
        <Form
          form={accountForm}
          layout="vertical"
          onFinish={handleAccountSubmit}
          initialValues={getAccountLockPolicy()}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    最大登录尝试次数
                    <Tooltip title="超过此次数将锁定账户">
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                }
                name="maxLoginAttempts"
                rules={[{ required: true, message: '请设置最大登录尝试次数' }]}
              >
                <InputNumber min={1} max={10} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    账户锁定时长（分钟）
                    <Tooltip title="账户锁定的持续时间">
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                }
                name="lockDuration"
                rules={[{ required: true, message: '请设置账户锁定时长' }]}
              >
                <InputNumber min={5} max={1440} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    重置尝试次数的时间（分钟）
                    <Tooltip title="多长时间后重置登录尝试次数">
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                }
                name="resetAttemptsAfter"
                rules={[{ required: true, message: '请设置重置时间' }]}
              >
                <InputNumber min={1} max={1440} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    禁止常见用户名
                    <Tooltip title="禁止使用常见的简单用户名，如'admin'">
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                }
                name="preventCommonUsernames"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="锁定时通知用户"
                name="notifyUserOnLock"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="允许管理员解锁"
                name="allowAdminUnlock"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                保存锁定策略
              </Button>
              <Button icon={<UndoOutlined />} onClick={resetAccountLockPolicy}>
                重置为默认
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default SecuritySettings;