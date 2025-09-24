import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button, Typography, Card, Space, Collapse } from 'antd';
import { 
  BugOutlined, 
  ReloadOutlined, 
  HomeOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import styled from 'styled-components';

const { Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

const ErrorContainer = styled.div`
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: #fafafa;
  
  .error-content {
    max-width: 600px;
    width: 100%;
    text-align: center;
  }
  
  .error-icon {
    font-size: 72px;
    color: #ff4d4f;
    margin-bottom: 24px;
  }
  
  .error-actions {
    margin-top: 32px;
    
    .ant-btn {
      margin: 0 8px;
    }
  }
  
  .error-details {
    margin-top: 24px;
    text-align: left;
    
    .ant-collapse {
      background: #fff;
      border: 1px solid #d9d9d9;
      
      .ant-collapse-header {
        background: #fafafa;
      }
    }
    
    .error-stack {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.4;
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 300px;
      overflow-y: auto;
    }
  }
  
  @media (max-width: 768px) {
    padding: 20px 16px;
    
    .error-icon {
      font-size: 48px;
    }
    
    .error-actions {
      .ant-btn {
        display: block;
        width: 100%;
        margin: 8px 0;
      }
    }
  }
`;

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误信息
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // 调用外部错误处理函数
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 发送错误报告到监控服务
    this.reportError(error, errorInfo);
  }

  reportError = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // 这里可以集成错误监控服务，如 Sentry、Bugsnag 等
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        errorId: this.state.errorId
      };

      // 发送到后端或第三方服务
      console.log('Error Report:', errorReport);
      
      // 示例：发送到后端
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // }).catch(console.error);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义的 fallback UI，则使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认的错误 UI
      return (
        <ErrorContainer>
          <div className="error-content">
            <div className="error-icon">
              <BugOutlined />
            </div>
            
            <Result
              status="error"
              title="页面出现了错误"
              subTitle={`错误ID: ${this.state.errorId}`}
              extra={
                <div className="error-actions">
                  <Space wrap>
                    <Button 
                      type="primary" 
                      icon={<ReloadOutlined />}
                      onClick={this.handleRetry}
                    >
                      重试
                    </Button>
                    <Button 
                      icon={<ReloadOutlined />}
                      onClick={this.handleReload}
                    >
                      刷新页面
                    </Button>
                    <Button 
                      icon={<HomeOutlined />}
                      onClick={this.handleGoHome}
                    >
                      返回首页
                    </Button>
                  </Space>
                </div>
              }
            />
            
            <Card className="error-details">
              <Paragraph>
                <Text type="secondary">
                  很抱歉，页面遇到了意外错误。我们已经记录了这个问题，
                  技术团队会尽快修复。您可以尝试刷新页面或返回首页。
                </Text>
              </Paragraph>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Collapse ghost>
                  <Panel 
                    header={
                      <Space>
                        <ExclamationCircleOutlined />
                        <Text strong>错误详情 (开发模式)</Text>
                      </Space>
                    } 
                    key="error-details"
                  >
                    <div className="error-stack">
                      <Text strong>错误信息:</Text>
                      <br />
                      {this.state.error.message}
                      <br /><br />
                      
                      <Text strong>错误堆栈:</Text>
                      <br />
                      {this.state.error.stack}
                      
                      {this.state.errorInfo && (
                        <>
                          <br /><br />
                          <Text strong>组件堆栈:</Text>
                          <br />
                          {this.state.errorInfo.componentStack}
                        </>
                      )}
                    </div>
                  </Panel>
                </Collapse>
              )}
            </Card>
          </div>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// 高阶组件，用于包装其他组件
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// 简化的错误边界组件，用于小型组件
export const SimpleErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: '#ff4d4f',
          background: '#fff2f0',
          border: '1px solid #ffccc7',
          borderRadius: '6px',
          margin: '16px 0'
        }}>
          <ExclamationCircleOutlined style={{ marginRight: '8px' }} />
          组件加载失败，请刷新页面重试
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;