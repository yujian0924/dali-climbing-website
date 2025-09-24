import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 20px;
`;

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <NotFoundContainer>
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在。"
        extra={[
          <Button type="primary" key="home" onClick={handleGoHome}>
            返回首页
          </Button>,
          <Button key="back" onClick={handleGoBack}>
            返回上页
          </Button>,
        ]}
      />
    </NotFoundContainer>
  );
};

export default NotFound;