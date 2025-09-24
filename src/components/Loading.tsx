import React from 'react';
import { Spin, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';

interface LoadingProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  spinning?: boolean;
  children?: React.ReactNode;
  type?: 'default' | 'fullscreen' | 'inline' | 'custom';
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
`;

const climb = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(-5deg);
  }
  50% {
    transform: translateY(-20px) rotate(0deg);
  }
  75% {
    transform: translateY(-10px) rotate(5deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
`;

const FullscreenLoading = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const InlineLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const CustomLoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  animation: ${fadeIn} 0.3s ease-in-out;
  
  .climbing-icon {
    font-size: 48px;
    color: #1890ff;
    animation: ${climb} 2s ease-in-out infinite;
    margin-bottom: 16px;
  }
  
  .loading-text {
    font-size: 16px;
    color: #666;
    margin-top: 16px;
  }
  
  .loading-dots {
    display: flex;
    gap: 4px;
    margin-top: 8px;
    
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #1890ff;
      animation: ${bounce} 1.4s ease-in-out infinite both;
      
      &:nth-child(1) {
        animation-delay: -0.32s;
      }
      
      &:nth-child(2) {
        animation-delay: -0.16s;
      }
      
      &:nth-child(3) {
        animation-delay: 0s;
      }
    }
  }
`;

const SpinContainer = styled.div<{ spinning: boolean }>`
  position: relative;
  
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    animation: ${fadeIn} 0.3s ease-in-out;
  }
  
  .content {
    opacity: ${props => props.spinning ? 0.5 : 1};
    pointer-events: ${props => props.spinning ? 'none' : 'auto'};
    transition: opacity 0.3s ease;
  }
`;

const customSpinIcon = (
  <LoadingOutlined 
    style={{ 
      fontSize: 24, 
      color: '#1890ff',
      animation: 'spin 1s linear infinite'
    }} 
    spin 
  />
);

const Loading: React.FC<LoadingProps> = ({
  size = 'default',
  tip = '加载中...',
  spinning = true,
  children,
  type = 'default'
}) => {
  if (!spinning && children) {
    return <>{children}</>;
  }

  if (type === 'fullscreen') {
    return (
      <FullscreenLoading>
        <Space direction="vertical" align="center">
          <Spin size={size} indicator={customSpinIcon} />
          <div style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
            {tip}
          </div>
        </Space>
      </FullscreenLoading>
    );
  }

  if (type === 'inline') {
    return (
      <InlineLoading>
        <Spin size={size} tip={tip} indicator={customSpinIcon} />
      </InlineLoading>
    );
  }

  if (type === 'custom') {
    return (
      <CustomLoadingContainer>
        <div className="climbing-icon">🧗‍♂️</div>
        <div className="loading-text">{tip}</div>
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </CustomLoadingContainer>
    );
  }

  // Default type with children
  if (children) {
    return (
      <SpinContainer spinning={spinning}>
        {spinning && (
          <div className="loading-overlay">
            <Spin size={size} tip={tip} indicator={customSpinIcon} />
          </div>
        )}
        <div className="content">
          {children}
        </div>
      </SpinContainer>
    );
  }

  // Default standalone loading
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Spin size={size} tip={tip} indicator={customSpinIcon} />
    </div>
  );
};

// 页面级加载组件
export const PageLoading: React.FC<{ tip?: string }> = ({ tip = '页面加载中...' }) => {
  return <Loading type="fullscreen" tip={tip} size="large" />;
};

// 内容区域加载组件
export const ContentLoading: React.FC<{ tip?: string; children?: React.ReactNode }> = ({ 
  tip = '内容加载中...', 
  children 
}) => {
  return (
    <Loading type="default" tip={tip} spinning={true}>
      {children}
    </Loading>
  );
};

// 按钮加载组件
export const ButtonLoading: React.FC<{ loading: boolean; children: React.ReactNode }> = ({ 
  loading, 
  children 
}) => {
  return (
    <Loading type="inline" spinning={loading} size="small">
      {children}
    </Loading>
  );
};

// 自定义攀岩主题加载组件
export const ClimbingLoading: React.FC<{ tip?: string }> = ({ tip = '正在加载攀岩数据...' }) => {
  return <Loading type="custom" tip={tip} />;
};

export default Loading;