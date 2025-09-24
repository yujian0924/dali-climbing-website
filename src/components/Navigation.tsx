import React, { useState, useEffect } from 'react';
import { Menu, Layout, Button, Drawer, Badge } from 'antd';
import {
  HomeOutlined,
  EnvironmentOutlined,
  ApartmentOutlined,
  SafetyOutlined,
  CalendarOutlined,
  MessageOutlined,
  UserOutlined,
  InfoCircleOutlined,
  MenuOutlined,
  CloseOutlined,
  FireOutlined,
  TrophyOutlined,
  TeamOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useResponsive } from '../hooks';

const { Sider } = Layout;
const { SubMenu } = Menu;

interface NavigationProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  theme?: 'light' | 'dark';
  className?: string;
}

const StyledSider = styled(Sider)<{ theme: 'light' | 'dark' }>`
  .ant-layout-sider-trigger {
    background: ${props => props.theme === 'dark' ? '#002140' : '#f0f0f0'};
    color: ${props => props.theme === 'dark' ? '#fff' : '#000'};
    border-top: 1px solid ${props => props.theme === 'dark' ? '#303030' : '#d9d9d9'};
    
    &:hover {
      background: ${props => props.theme === 'dark' ? '#1890ff' : '#e6f7ff'};
    }
  }
  
  .ant-menu {
    border-right: none;
  }
  
  .ant-menu-item {
    margin: 4px 8px;
    border-radius: 6px;
    
    &.ant-menu-item-selected {
      background: #e6f7ff;
      border-radius: 6px;
      
      &::after {
        display: none;
      }
    }
  }
  
  .ant-menu-submenu {
    .ant-menu-submenu-title {
      margin: 4px 8px;
      border-radius: 6px;
      
      &:hover {
        background: ${props => props.theme === 'dark' ? '#1890ff' : '#f0f0f0'};
      }
    }
  }
  
  .menu-logo {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme === 'dark' ? '#001529' : '#fff'};
    border-bottom: 1px solid ${props => props.theme === 'dark' ? '#303030' : '#f0f0f0'};
    
    .logo-text {
      font-size: 18px;
      font-weight: bold;
      color: ${props => props.theme === 'dark' ? '#fff' : '#1890ff'};
      margin-left: 8px;
    }
    
    .logo-icon {
      font-size: 24px;
      color: #1890ff;
    }
  }
`;

const MobileDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: 0;
  }
  
  .mobile-menu-header {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    border-bottom: 1px solid #f0f0f0;
    
    .logo {
      display: flex;
      align-items: center;
      
      .logo-icon {
        font-size: 24px;
        color: #1890ff;
        margin-right: 8px;
      }
      
      .logo-text {
        font-size: 18px;
        font-weight: bold;
        color: #1890ff;
      }
    }
  }
`;

const Navigation: React.FC<NavigationProps> = ({
  collapsed = false,
  onCollapse,
  theme = 'light',
  className
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const [mobileVisible, setMobileVisible] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // 根据当前路径设置选中的菜单项
  useEffect(() => {
    const path = location.pathname;
    setSelectedKeys([path]);
    
    // 设置展开的子菜单
    if (path.startsWith('/locations')) {
      setOpenKeys(['locations']);
    } else if (path.startsWith('/routes')) {
      setOpenKeys(['routes']);
    } else if (path.startsWith('/activities')) {
      setOpenKeys(['activities']);
    } else if (path.startsWith('/forum')) {
      setOpenKeys(['forum']);
    } else if (path.startsWith('/user')) {
      setOpenKeys(['user']);
    }
  }, [location.pathname]);

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页'
    },
    {
      key: 'locations',
      icon: <EnvironmentOutlined />,
      label: '攀岩地点',
      children: [
        {
          key: '/locations',
          label: '地点列表'
        },
        {
          key: '/locations/map',
          label: '地图浏览'
        },
        {
          key: '/locations/popular',
          icon: <FireOutlined />,
          label: '热门地点'
        },
        {
          key: '/locations/nearby',
          label: '附近地点'
        }
      ]
    },
    {
        key: 'routes',
        icon: <ApartmentOutlined />,
        label: '路线指南',
        children: [
        {
          key: '/routes',
          label: '路线列表'
        },
        {
          key: '/routes/difficulty',
          label: '难度分级'
        },
        {
          key: '/routes/recommended',
          icon: <TrophyOutlined />,
          label: '推荐路线'
        },
        {
          key: '/routes/new',
          label: '最新路线'
        }
      ]
    },
    {
      key: '/safety',
      icon: <SafetyOutlined />,
      label: '安全提示'
    },
    {
      key: 'activities',
      icon: <CalendarOutlined />,
      label: '活动组织',
      children: [
        {
          key: '/activities',
          label: '活动列表'
        },
        {
          key: '/activities/create',
          label: '发布活动'
        },
        {
          key: '/activities/my',
          label: '我的活动'
        },
        {
          key: '/activities/calendar',
          label: '活动日历'
        }
      ]
    },
    {
      key: 'forum',
      icon: <MessageOutlined />,
      label: '社区论坛',
      children: [
        {
          key: '/forum',
          label: '论坛首页'
        },
        {
          key: '/forum/discussions',
          label: '讨论区'
        },
        {
          key: '/forum/guides',
          icon: <BookOutlined />,
          label: '攀岩指南'
        },
        {
          key: '/forum/gear',
          label: '装备交流'
        }
      ]
    },
    {
      key: 'user',
      icon: <UserOutlined />,
      label: '个人中心',
      children: [
        {
          key: '/user/profile',
          label: '个人资料'
        },
        {
          key: '/user/records',
          label: '攀岩记录'
        },
        {
          key: '/user/favorites',
          label: '我的收藏'
        },
        {
          key: '/user/following',
          icon: <TeamOutlined />,
          label: '关注的人'
        }
      ]
    },
    {
      key: '/about',
      icon: <InfoCircleOutlined />,
      label: '关于我们'
    }
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    if (isMobile) {
      setMobileVisible(false);
    }
  };

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const renderMenu = () => (
    <Menu
      theme={theme}
      mode="inline"
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onOpenChange={handleOpenChange}
      onClick={handleMenuClick}
      items={menuItems}
    />
  );

  // 移动端显示抽屉菜单
  if (isMobile) {
    return (
      <>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileVisible(true)}
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)'
          }}
        />
        
        <MobileDrawer
          title={null}
          placement="left"
          closable={false}
          onClose={() => setMobileVisible(false)}
          open={mobileVisible}
          width={280}
          bodyStyle={{ padding: 0 }}
        >
          <div className="mobile-menu-header">
            <div className="logo">
              <span className="logo-icon">🧗‍♂️</span>
              <span className="logo-text">大理攀岩</span>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setMobileVisible(false)}
            />
          </div>
          {renderMenu()}
        </MobileDrawer>
      </>
    );
  }

  // 桌面端显示侧边栏
  return (
    <StyledSider
      theme={theme}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={240}
      collapsedWidth={80}
      className={className}
      trigger={null}
    >
      <div className="menu-logo">
        {!collapsed ? (
          <>
            <span className="logo-icon">🧗‍♂️</span>
            <span className="logo-text">大理攀岩</span>
          </>
        ) : (
          <span className="logo-icon">🧗‍♂️</span>
        )}
      </div>
      
      {renderMenu()}
      
      {/* 自定义折叠按钮 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          textAlign: 'center',
          padding: '16px 0',
          borderTop: `1px solid ${theme === 'dark' ? '#303030' : '#f0f0f0'}`
        }}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuOutlined /> : <CloseOutlined />}
          onClick={() => onCollapse?.(!collapsed)}
          style={{
            color: theme === 'dark' ? '#fff' : '#000'
          }}
        />
      </div>
    </StyledSider>
  );
};

export default Navigation;