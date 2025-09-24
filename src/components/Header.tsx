import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, Avatar, Badge, Space, Drawer } from 'antd';
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
  BellOutlined,
  SettingOutlined,
  HeartOutlined,
  CalendarOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useAuth, useResponsive } from '@hooks/index';
import { logout } from '@store/slices/authSlice';
import styled from 'styled-components';

const { Header: AntHeader } = Layout;

const StyledHeader = styled(AntHeader)`
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 1000;
  
  .logo {
    float: left;
    width: 200px;
    height: 64px;
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    color: #1890ff;
    text-decoration: none;
    
    &:hover {
      color: #40a9ff;
    }
  }
  
  .nav-menu {
    line-height: 64px;
    border-bottom: none;
    
    .ant-menu-item {
      &:hover {
        color: #1890ff;
      }
    }
    
    .ant-menu-item-selected {
      color: #1890ff;
      border-bottom-color: #1890ff;
    }
  }
  
  .user-actions {
    float: right;
    height: 64px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .mobile-menu-trigger {
    display: none;
    float: right;
    line-height: 64px;
    padding: 0 16px;
    cursor: pointer;
    transition: color 0.3s;
    
    &:hover {
      color: #1890ff;
    }
  }
  
  @media (max-width: 768px) {
    .nav-menu {
      display: none;
    }
    
    .mobile-menu-trigger {
      display: block;
    }
    
    .user-actions {
      margin-right: 48px;
    }
  }
`;

const MobileDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: 0;
  }
  
  .mobile-menu {
    border-right: none;
    
    .ant-menu-item {
      margin: 0;
      width: 100%;
    }
  }
`;

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, dispatch } = useAuth();
  const { isMobile } = useResponsive();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  // 导航菜单项
  const menuItems = [
    {
      key: '/',
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/locations',
      label: <Link to="/locations">攀岩地点</Link>,
    },
    {
      key: '/routes',
      label: <Link to="/routes">路线指南</Link>,
    },
    {
      key: '/safety',
      label: <Link to="/safety">安全提示</Link>,
    },
    {
      key: '/activities',
      label: <Link to="/activities">活动组织</Link>,
    },
    {
      key: '/forum',
      label: <Link to="/forum">社区论坛</Link>,
    },
    {
      key: '/about',
      label: <Link to="/about">关于我们</Link>,
    },
  ];

  // 用户菜单项
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'favorites',
      icon: <HeartOutlined />,
      label: '我的收藏',
      onClick: () => navigate('/profile/favorites'),
    },
    {
      key: 'activities',
      icon: <CalendarOutlined />,
      label: '我的活动',
      onClick: () => navigate('/profile/activities'),
    },
    {
      key: 'messages',
      icon: <MessageOutlined />,
      label: '消息中心',
      onClick: () => navigate('/profile/messages'),
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => navigate('/profile/settings'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        dispatch(logout());
        navigate('/');
      },
    },
  ];

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const closeMobileMenu = () => {
    setMobileMenuVisible(false);
  };

  return (
    <StyledHeader>
      <Link to="/" className="logo">
        🧗‍♂️ 大理攀岩
      </Link>
      
      {!isMobile && (
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="nav-menu"
          style={{ flex: 1, minWidth: 0 }}
        />
      )}
      
      <div className="user-actions">
        {isAuthenticated ? (
          <Space size="middle">
            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                onClick={() => navigate('/notifications')}
              />
            </Badge>
            
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  size="small"
                  src={user?.avatar}
                  icon={<UserOutlined />}
                />
                <span>{user?.username}</span>
              </Space>
            </Dropdown>
          </Space>
        ) : (
          <Space>
            <Button type="text" onClick={handleLogin}>
              <LoginOutlined /> 登录
            </Button>
            <Button type="primary" onClick={handleRegister}>
              注册
            </Button>
          </Space>
        )}
      </div>
      
      {isMobile && (
        <div className="mobile-menu-trigger" onClick={toggleMobileMenu}>
          <MenuOutlined />
        </div>
      )}
      
      <MobileDrawer
        title="导航菜单"
        placement="right"
        onClose={closeMobileMenu}
        open={mobileMenuVisible}
        width={280}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="mobile-menu"
          onClick={closeMobileMenu}
        />
        
        {isAuthenticated ? (
          <Menu
            mode="vertical"
            items={[
              { type: 'divider' },
              ...userMenuItems
            ]}
            className="mobile-menu"
            onClick={closeMobileMenu}
          />
        ) : (
          <div style={{ padding: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" block onClick={handleLogin}>
                <LoginOutlined /> 登录
              </Button>
              <Button block onClick={handleRegister}>
                注册
              </Button>
            </Space>
          </div>
        )}
      </MobileDrawer>
    </StyledHeader>
  );
};

export default Header;