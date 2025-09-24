import React, { useState } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Divider,
  Checkbox,
  message,
  Alert,
  Tabs,
  Modal,
  Steps,
  Result
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  WechatOutlined,
  AlipayOutlined,
  QqOutlined,
  GithubOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks';
import { Loading } from '../components';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Step } = Steps;

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover;
    opacity: 0.1;
    z-index: 0;
  }
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  position: relative;
  z-index: 1;
  
  .ant-card-body {
    padding: 40px;
  }
  
  .login-header {
    text-align: center;
    margin-bottom: 32px;
    
    .logo {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 24px;
      color: white;
    }
    
    .title {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 8px;
    }
    
    .subtitle {
      color: #666;
      font-size: 14px;
    }
  }
  
  .social-login {
    margin-top: 24px;
    
    .social-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
      
      .social-btn {
        flex: 1;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.wechat {
          background: #07c160;
          border-color: #07c160;
          color: white;
          
          &:hover {
            background: #06ad56;
            border-color: #06ad56;
          }
        }
        
        &.qq {
          background: #1677ff;
          border-color: #1677ff;
          color: white;
          
          &:hover {
            background: #0958d9;
            border-color: #0958d9;
          }
        }
        
        &.github {
          background: #24292e;
          border-color: #24292e;
          color: white;
          
          &:hover {
            background: #1a1e22;
            border-color: #1a1e22;
          }
        }
      }
    }
  }
  
  @media (max-width: 480px) {
    margin: 0;
    border-radius: 0;
    height: 100vh;
    
    .ant-card-body {
      padding: 24px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
`;

const RegisterCard = styled(LoginCard)`
  max-width: 500px;
`;

const ForgotPasswordCard = styled(LoginCard)`
  max-width: 450px;
`;

interface LoginFormData {
  username: string;
  password: string;
  remember: boolean;
}

interface RegisterFormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreement: boolean;
  verificationCode: string;
}

interface ForgotPasswordFormData {
  email: string;
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [registerStep, setRegisterStep] = useState(0);
  const [forgotStep, setForgotStep] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [forgotForm] = Form.useForm();
  
  // 获取重定向路径
  const from = (location.state as any)?.from?.pathname || '/';
  
  // 倒计时
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);
  
  const handleLogin = async (values: LoginFormData) => {
    try {
      setLoading(true);
      
      // 模拟登录API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟登录成功
      const mockUser = {
        id: '1',
        username: values.username,
        email: 'user@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        level: '中级',
        token: 'mock-jwt-token'
      };
      
      login(mockUser);
      message.success('登录成功！');
      navigate(from, { replace: true });
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (values: RegisterFormData) => {
    try {
      setLoading(true);
      
      if (registerStep === 0) {
        // 第一步：验证基本信息
        await new Promise(resolve => setTimeout(resolve, 500));
        setRegisterStep(1);
        message.success('信息验证成功，请验证邮箱');
      } else if (registerStep === 1) {
        // 第二步：验证邮箱
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRegisterStep(2);
        message.success('注册成功！');
        
        setTimeout(() => {
          setActiveTab('login');
          setRegisterStep(0);
          registerForm.resetFields();
        }, 2000);
      }
    } catch (error) {
      message.error('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };
  
  const handleForgotPassword = async (values: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      
      if (forgotStep === 0) {
        // 第一步：发送验证码
        await new Promise(resolve => setTimeout(resolve, 500));
        setForgotStep(1);
        setCountdown(60);
        message.success('验证码已发送到您的邮箱');
      } else if (forgotStep === 1) {
        // 第二步：重置密码
        await new Promise(resolve => setTimeout(resolve, 1000));
        setForgotStep(2);
        message.success('密码重置成功！');
        
        setTimeout(() => {
          setActiveTab('login');
          setForgotStep(0);
          forgotForm.resetFields();
        }, 2000);
      }
    } catch (error) {
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };
  
  const sendVerificationCode = async (email: string) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setCountdown(60);
      message.success('验证码已发送');
    } catch (error) {
      message.error('发送失败，请重试');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSocialLogin = (platform: string) => {
    message.info(`${platform}登录功能开发中...`);
  };
  
  const renderLoginForm = () => (
    <LoginCard>
      <div className="login-header">
        <div className="logo">
          <SafetyOutlined />
        </div>
        <div className="title">欢迎回来</div>
        <div className="subtitle">登录您的攀岩账户</div>
      </div>
      
      <Form
        form={loginForm}
        onFinish={handleLogin}
        size="large"
        autoComplete="off"
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: '请输入用户名或邮箱' },
            { min: 3, message: '用户名至少3个字符' }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="用户名或邮箱"
            autoComplete="username"
          />
        </Form.Item>
        
        <Form.Item
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少6个字符' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码"
            autoComplete="current-password"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>
        
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <Button type="link" onClick={() => setActiveTab('forgot')} style={{ padding: 0 }}>
              忘记密码？
            </Button>
          </div>
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            登录
          </Button>
        </Form.Item>
        
        <Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">还没有账户？</Text>
            <Button type="link" onClick={() => setActiveTab('register')} style={{ padding: '0 4px' }}>
              立即注册
            </Button>
          </div>
        </Form.Item>
      </Form>
      
      <div className="social-login">
        <Divider>
          <Text type="secondary">或使用以下方式登录</Text>
        </Divider>
        
        <div className="social-buttons">
          <Button 
            className="social-btn wechat" 
            icon={<WechatOutlined />}
            onClick={() => handleSocialLogin('微信')}
          />
          <Button 
            className="social-btn qq" 
            icon={<QqOutlined />}
            onClick={() => handleSocialLogin('QQ')}
          />
          <Button 
            className="social-btn github" 
            icon={<GithubOutlined />}
            onClick={() => handleSocialLogin('GitHub')}
          />
        </div>
      </div>
    </LoginCard>
  );
  
  const renderRegisterForm = () => (
    <RegisterCard>
      <div className="login-header">
        <div className="logo">
          <SafetyOutlined />
        </div>
        <div className="title">创建账户</div>
        <div className="subtitle">加入攀岩社区</div>
      </div>
      
      <Steps current={registerStep} size="small" style={{ marginBottom: 32 }}>
        <Step title="基本信息" />
        <Step title="邮箱验证" />
        <Step title="注册成功" />
      </Steps>
      
      {registerStep === 0 && (
        <Form
          form={registerForm}
          onFinish={handleRegister}
          size="large"
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 20, message: '用户名长度为3-20个字符' },
              { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '用户名只能包含字母、数字、下划线和中文' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              autoComplete="username"
            />
          </Form.Item>
          
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="邮箱地址"
              autoComplete="email"
            />
          </Form.Item>
          
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="手机号码"
              autoComplete="tel"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/, message: '密码必须包含大小写字母和数字' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              autoComplete="new-password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
              autoComplete="new-password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('请同意用户协议')) }
            ]}
          >
            <Checkbox>
              我已阅读并同意
              <Button type="link" style={{ padding: 0, height: 'auto' }}>《用户协议》</Button>
              和
              <Button type="link" style={{ padding: 0, height: 'auto' }}>《隐私政策》</Button>
            </Checkbox>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              下一步
            </Button>
          </Form.Item>
        </Form>
      )}
      
      {registerStep === 1 && (
        <Form
          form={registerForm}
          onFinish={handleRegister}
          size="large"
        >
          <Alert
            message="邮箱验证"
            description={`验证码已发送到 ${registerForm.getFieldValue('email')}，请查收邮件并输入验证码。`}
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          
          <Form.Item
            name="verificationCode"
            rules={[
              { required: true, message: '请输入验证码' },
              { len: 6, message: '验证码为6位数字' }
            ]}
          >
            <Input
              placeholder="请输入6位验证码"
              maxLength={6}
              style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '4px' }}
            />
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button onClick={() => setRegisterStep(0)} style={{ flex: 1 }}>
                上一步
              </Button>
              <Button type="primary" htmlType="submit" loading={loading} style={{ flex: 2 }}>
                完成注册
              </Button>
            </div>
          </Form.Item>
          
          <Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">没有收到验证码？</Text>
              <Button 
                type="link" 
                disabled={countdown > 0}
                onClick={() => sendVerificationCode(registerForm.getFieldValue('email'))}
                style={{ padding: '0 4px' }}
              >
                {countdown > 0 ? `${countdown}秒后重发` : '重新发送'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      )}
      
      {registerStep === 2 && (
        <Result
          status="success"
          title="注册成功！"
          subTitle="欢迎加入攀岩社区，即将跳转到登录页面..."
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
        />
      )}
      
      {registerStep === 0 && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text type="secondary">已有账户？</Text>
          <Button type="link" onClick={() => setActiveTab('login')} style={{ padding: '0 4px' }}>
            立即登录
          </Button>
        </div>
      )}
    </RegisterCard>
  );
  
  const renderForgotPasswordForm = () => (
    <ForgotPasswordCard>
      <div className="login-header">
        <div className="logo">
          <SafetyOutlined />
        </div>
        <div className="title">重置密码</div>
        <div className="subtitle">找回您的账户</div>
      </div>
      
      <Steps current={forgotStep} size="small" style={{ marginBottom: 32 }}>
        <Step title="验证邮箱" />
        <Step title="重置密码" />
        <Step title="重置成功" />
      </Steps>
      
      {forgotStep === 0 && (
        <Form
          form={forgotForm}
          onFinish={handleForgotPassword}
          size="large"
        >
          <Alert
            message="找回密码"
            description="请输入您注册时使用的邮箱地址，我们将发送验证码到您的邮箱。"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="注册邮箱地址"
              autoComplete="email"
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              发送验证码
            </Button>
          </Form.Item>
        </Form>
      )}
      
      {forgotStep === 1 && (
        <Form
          form={forgotForm}
          onFinish={handleForgotPassword}
          size="large"
        >
          <Alert
            message="验证码已发送"
            description={`验证码已发送到 ${forgotForm.getFieldValue('email')}，请查收邮件。`}
            type="success"
            showIcon
            style={{ marginBottom: 24 }}
          />
          
          <Form.Item
            name="verificationCode"
            rules={[
              { required: true, message: '请输入验证码' },
              { len: 6, message: '验证码为6位数字' }
            ]}
          >
            <Input
              placeholder="请输入6位验证码"
              maxLength={6}
              style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '4px' }}
            />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6个字符' },
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/, message: '密码必须包含大小写字母和数字' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="新密码"
              autoComplete="new-password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
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
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认新密码"
              autoComplete="new-password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button onClick={() => setForgotStep(0)} style={{ flex: 1 }}>
                上一步
              </Button>
              <Button type="primary" htmlType="submit" loading={loading} style={{ flex: 2 }}>
                重置密码
              </Button>
            </div>
          </Form.Item>
          
          <Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">没有收到验证码？</Text>
              <Button 
                type="link" 
                disabled={countdown > 0}
                onClick={() => sendVerificationCode(forgotForm.getFieldValue('email'))}
                style={{ padding: '0 4px' }}
              >
                {countdown > 0 ? `${countdown}秒后重发` : '重新发送'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      )}
      
      {forgotStep === 2 && (
        <Result
          status="success"
          title="密码重置成功！"
          subTitle="您的密码已成功重置，即将跳转到登录页面..."
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
        />
      )}
      
      {forgotStep === 0 && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text type="secondary">想起密码了？</Text>
          <Button type="link" onClick={() => setActiveTab('login')} style={{ padding: '0 4px' }}>
            返回登录
          </Button>
        </div>
      )}
    </ForgotPasswordCard>
  );
  
  return (
    <LoginContainer>
      {activeTab === 'login' && renderLoginForm()}
      {activeTab === 'register' && renderRegisterForm()}
      {activeTab === 'forgot' && renderForgotPasswordForm()}
    </LoginContainer>
  );
};

export default Login;