import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Card, message, Spin, notification } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockLogin } from '../../mock/users';
import { loginEvent } from '../../App';
import './Login.css';

interface LoginFormData {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [initLoading, setInitLoading] = useState(true);
    const [loginError, setLoginError] = useState<string | null>(null);
    const navigate = useNavigate();

    // 模拟页面加载效果
    useEffect(() => {
        const timer = setTimeout(() => {
            setInitLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const onFinish = (values: LoginFormData) => {
        setLoading(true);
        setLoginError(null); // 清除之前的错误信息
        
        // 使用mock服务进行登录验证
        mockLogin(values.username, values.password)
            .then(response => {
                if (response.success) {
                    message.success(response.message);
                    // 保存token和用户信息到localStorage
                    localStorage.setItem('userToken', response.token!);
                    localStorage.setItem('userName', response.user?.name || values.username);
                    // 可以保存更多用户信息
                    if (response.user) {
                        localStorage.setItem('userInfo', JSON.stringify(response.user));
                    }
                    // 触发登录状态变化事件
                    loginEvent.dispatchEvent(new Event('loginChange'));
                    // 登录成功后跳转到仪表盘
                    navigate('/dashboard');
                } else {
                    // 显示错误信息
                    notification.error({
                        message: '登录失败',
                        description: response.message || '用户名或密码错误',
                        duration: 3,
                        placement: 'top'
                    });
                    
                    // 添加message错误提示 - 简化配置
                    message.error(response.message || '用户名或密码错误');
                    
                    // 设置登录错误状态
                    setLoginError(response.message || '用户名或密码错误');
                }
            })
            .catch(error => {
                console.error('登录出错:', error);
                notification.error({
                    message: '登录失败',
                    description: '登录过程中发生错误，请稍后再试',
                    duration: 3,
                    placement: 'top'
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="login-container">
            {initLoading ? (
                <div className="login-loading">
                    <Spin size="large" tip="系统加载中..." />
                </div>
            ) : (
                <div className="login-content">
                    <Card className="login-card">
                        <div className="login-header">
                            <div className="login-logo">
                                <SafetyOutlined className="logo-icon" />
                            </div>
                            <h1>用户管理系统</h1>
                            <p>欢迎登录后台管理系统</p>
                        </div>

                        <Form
                            name="login"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            size="large"
                            layout="vertical"
                            className="login-form"
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    { required: true, message: '请输入用户名!' },
                                    { min: 3, message: '用户名至少需要3个字符' }
                                ]}
                                validateTrigger={['onChange', 'onBlur']}
                            >
                                <Input 
                                    prefix={<UserOutlined />} 
                                    placeholder="用户名: admin" 
                                    autoComplete="username"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: '请输入密码!' },
                                    { min: 6, message: '密码至少需要6个字符' }
                                ]}
                                validateTrigger={['onChange', 'onBlur']}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="密码: admin123"
                                    autoComplete="current-password"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-button"
                                    loading={loading}
                                    block
                                >
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                        <div className="login-footer">
                            <p>© {new Date().getFullYear()} 用户管理系统 - 版权所有</p>
                        </div>
                    </Card>
                </div>
            )}
            <div className="login-bubbles">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className={`bubble bubble-${index + 1}`}></div>
                ))}
            </div>
        </div>
    );
};

export default Login;