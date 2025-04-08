import React, { useState, useEffect } from 'react';
import { Card, Form, Switch, Slider, Input, Button, Select, Row, Col, Space, Divider, message, Tooltip, Radio } from 'antd';
import { UndoOutlined, CheckOutlined, CloseOutlined, QuestionCircleOutlined, BgColorsOutlined } from '@ant-design/icons';
import { ThemeType, getCurrentTheme, setTheme, resetToDefaultTheme } from '../../utils/themeManager';

const { Option } = Select;

interface ThemeSettingsProps {
  onThemeChange?: () => void;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ onThemeChange }) => {
  const [form] = Form.useForm();
  const [themeType, setThemeType] = useState<ThemeType>(ThemeType.LIGHT);
  const [customEnabled, setCustomEnabled] = useState(false);
  
  // 初始化表单数据
  useEffect(() => {
    const currentTheme = getCurrentTheme();
    form.setFieldsValue(currentTheme);
    setThemeType(currentTheme.type);
    setCustomEnabled(currentTheme.type === ThemeType.CUSTOM);
  }, [form]);
  
  // 处理主题类型变更
  const handleThemeTypeChange = (value: ThemeType) => {
    setThemeType(value);
    setCustomEnabled(value === ThemeType.CUSTOM);
    
    if (value !== ThemeType.CUSTOM) {
      // 重置为默认主题
      resetToDefaultTheme(value);
      // 重新加载表单数据
      const currentTheme = getCurrentTheme();
      form.setFieldsValue(currentTheme);
      
      if (onThemeChange) {
        onThemeChange();
      }
    }
  };
  
  // 处理表单提交
  const handleSubmit = (values: any) => {
    try {
      setTheme({
        ...values,
        type: themeType
      });
      message.success('主题设置已保存');
      
      if (onThemeChange) {
        onThemeChange();
      }
    } catch (error) {
      console.error('保存主题设置失败:', error);
      message.error('保存主题设置失败');
    }
  };
  
  // 重置为默认设置
  const handleReset = () => {
    resetToDefaultTheme(themeType);
    const currentTheme = getCurrentTheme();
    form.setFieldsValue(currentTheme);
    message.success('已重置为默认设置');
    
    if (onThemeChange) {
      onThemeChange();
    }
  };
  
  return (
    <Card title="主题与界面设置" className="settings-card">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={getCurrentTheme()}
      >
        <Form.Item
          label="主题模式"
          name="type"
          rules={[{ required: true, message: '请选择主题模式' }]}
        >
          <Radio.Group onChange={(e) => handleThemeTypeChange(e.target.value)} value={themeType}>
            <Radio.Button value={ThemeType.LIGHT}>
              <Space>
                <BgColorsOutlined />
                浅色模式
              </Space>
            </Radio.Button>
            <Radio.Button value={ThemeType.DARK}>
              <Space>
                <BgColorsOutlined />
                深色模式
              </Space>
            </Radio.Button>
            <Radio.Button value={ThemeType.CUSTOM}>
              <Space>
                <BgColorsOutlined />
                自定义
              </Space>
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        
        <Divider orientation="left">颜色设置</Divider>
        
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="主色调"
              name="primaryColor"
              rules={[{ required: true, message: '请选择主色调' }]}
            >
              <Input 
                type="color" 
                disabled={!customEnabled}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="次要色调"
              name="secondaryColor"
              rules={[{ required: true, message: '请选择次要色调' }]}
            >
              <Input 
                type="color" 
                disabled={!customEnabled}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="背景色"
              name="backgroundColor"
              rules={[{ required: true, message: '请选择背景色' }]}
            >
              <Input 
                type="color" 
                disabled={!customEnabled}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="文本颜色"
              name="textColor"
              rules={[{ required: true, message: '请选择文本颜色' }]}
            >
              <Input 
                type="color" 
                disabled={!customEnabled}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Divider orientation="left">界面设置</Divider>
        
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={
                <span>
                  字体大小
                  <Tooltip title="设置界面的基础字体大小（像素）">
                    <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                  </Tooltip>
                </span>
              }
              name="fontSize"
              rules={[{ required: true, message: '请设置字体大小' }]}
            >
              <Slider
                min={12}
                max={20}
                step={1}
                disabled={!customEnabled}
                marks={{
                  12: '12',
                  14: '14',
                  16: '16',
                  18: '18',
                  20: '20'
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label={
                <span>
                  圆角大小
                  <Tooltip title="设置界面元素的圆角大小（像素）">
                    <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                  </Tooltip>
                </span>
              }
              name="borderRadius"
              rules={[{ required: true, message: '请设置圆角大小' }]}
            >
              <Slider
                min={0}
                max={16}
                step={1}
                disabled={!customEnabled}
                marks={{
                  0: '0',
                  4: '4',
                  8: '8',
                  12: '12',
                  16: '16'
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          label={
            <span>
              紧凑模式
              <Tooltip title="启用紧凑模式可以减少界面元素之间的间距，显示更多内容">
                <QuestionCircleOutlined style={{ marginLeft: 4 }} />
              </Tooltip>
            </span>
          }
          name="compact"
          valuePropName="checked"
        >
          <Switch 
            disabled={!customEnabled}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
        </Form.Item>
        
        <Form.Item
          label={
            <span>
              自定义CSS
              <Tooltip title="高级用户可以添加自定义CSS来进一步定制界面">
                <QuestionCircleOutlined style={{ marginLeft: 4 }} />
              </Tooltip>
            </span>
          }
          name="customCss"
        >
          <Input.TextArea
            rows={4}
            disabled={!customEnabled}
            placeholder="/* 在这里添加自定义CSS */\n.custom-class { color: red; }\n"
          />
        </Form.Item>
        
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" disabled={!customEnabled}>
              保存设置
            </Button>
            <Button icon={<UndoOutlined />} onClick={handleReset}>
              重置为默认
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ThemeSettings;