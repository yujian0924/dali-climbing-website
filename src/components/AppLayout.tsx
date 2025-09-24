import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

const { Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledContent = styled(Content)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <StyledLayout>
      <Header />
      <StyledContent>
        {children}
      </StyledContent>
      <Footer />
    </StyledLayout>
  );
};

export default AppLayout;
export type { AppLayoutProps };