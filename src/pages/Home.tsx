import React, { useEffect, useState } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Space,
  Carousel,
  Statistic,
  List,
  Avatar,
  Tag,
  Rate,
  Image,
  Divider
} from 'antd';
import {
  EnvironmentOutlined,
  ApartmentOutlined,
  CalendarOutlined,
  UserOutlined,
  FireOutlined,
  TrophyOutlined,
  SafetyOutlined,
  RightOutlined,
  StarOutlined,
  EyeOutlined,
  MessageOutlined,
  TeamOutlined,
  BranchesOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchLocations } from '../store/slices/locationSlice';
import { fetchRoutes } from '../store/slices/routeSlice';
import { fetchActivities } from '../store/slices/activitySlice';
import { fetchPosts } from '../store/slices/forumSlice';
import { Loading, ErrorBoundary } from '../components';
import { useResponsive } from '../hooks';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;

const HeroSection = styled.div`
  position: relative;
  height: 600px;
  background: linear-gradient(
    135deg,
    rgba(24, 144, 255, 0.8) 0%,
    rgba(114, 46, 209, 0.8) 100%
  ),
  url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  
  .hero-content {
    max-width: 800px;
    padding: 0 20px;
    
    h1 {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 24px;
      color: white;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    .hero-subtitle {
      font-size: 1.5rem;
      margin-bottom: 32px;
      color: rgba(255, 255, 255, 0.9);
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    .hero-actions {
      .ant-btn {
        height: 48px;
        padding: 0 32px;
        font-size: 16px;
        margin: 0 8px;
        border-radius: 24px;
      }
    }
  }
  
  @media (max-width: 768px) {
    height: 500px;
    
    .hero-content {
      h1 {
        font-size: 2.5rem;
      }
      
      .hero-subtitle {
        font-size: 1.2rem;
      }
      
      .hero-actions {
        .ant-btn {
          display: block;
          width: 200px;
          margin: 8px auto;
        }
      }
    }
  }
`;

const StatsSection = styled.div`
  background: #f8f9fa;
  padding: 80px 0;
  
  .stats-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .stat-card {
    text-align: center;
    background: white;
    border-radius: 12px;
    padding: 32px 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-4px);
    }
    
    .stat-icon {
      font-size: 48px;
      color: #1890ff;
      margin-bottom: 16px;
    }
    
    .ant-statistic {
      .ant-statistic-content {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1890ff;
      }
    }
    
    .stat-label {
      font-size: 16px;
      color: #666;
      margin-top: 8px;
    }
  }
`;

const SectionContainer = styled.div`
  padding: 80px 0;
  
  .section-header {
    text-align: center;
    margin-bottom: 48px;
    
    h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      color: #1890ff;
    }
    
    .section-subtitle {
      font-size: 1.2rem;
      color: #666;
      max-width: 600px;
      margin: 0 auto;
    }
  }
  
  .section-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
`;

const FeatureCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  .ant-card-cover {
    height: 200px;
    overflow: hidden;
    
    img {
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    &:hover img {
      transform: scale(1.05);
    }
  }
  
  .feature-icon {
    font-size: 48px;
    color: #1890ff;
    margin-bottom: 16px;
    text-align: center;
    display: block;
  }
  
  .ant-card-meta-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1890ff;
  }
`;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isMobile } = useResponsive();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    locations: 0,
    routes: 0,
    activities: 0,
    users: 0
  });
  
  const { locations } = useSelector((state: RootState) => state.location);
  const { routes } = useSelector((state: RootState) => state.route);
  const { activities } = useSelector((state: RootState) => state.activity);
  const { posts } = useSelector((state: RootState) => state.forum);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 加载首页数据
        await Promise.all([
          dispatch(fetchLocations({ page: 1, limit: 6 }) as any),
          dispatch(fetchRoutes({ page: 1, limit: 6 }) as any),
          dispatch(fetchActivities({ page: 1, limit: 6 }) as any),
          dispatch(fetchPosts({ page: 1, limit: 6 }) as any)
        ]);
        
        // 模拟统计数据
        setStats({
          locations: 156,
          routes: 892,
          activities: 234,
          users: 1567
        });
      } catch (error) {
        console.error('Failed to load home data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  const features = [
    {
      icon: <EnvironmentOutlined />,
      title: '攀岩地点',
      description: '发现大理及周边最佳攀岩地点，详细的路线信息和实用攻略',
      link: '/locations',
      image: 'https://images.unsplash.com/photo-1551524164-6cf2ac531fb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      icon: <ApartmentOutlined />,
      title: '路线指南',
      description: '从入门到专业，涵盖各种难度等级的攀岩路线详细指南',
      link: '/routes',
      image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      icon: <SafetyOutlined />,
      title: '安全提示',
      description: '专业的安全知识、装备介绍和紧急情况处理指南',
      link: '/safety',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      icon: <CalendarOutlined />,
      title: '活动组织',
      description: '参加或组织攀岩活动，结识志同道合的攀岩伙伴',
      link: '/activities',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      icon: <MessageOutlined />,
      title: '社区论坛',
      description: '分享攀岩经验，交流技巧心得，建立攀岩社交网络',
      link: '/forum',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      icon: <UserOutlined />,
      title: '个人中心',
      description: '记录攀岩历程，管理个人资料，追踪攀岩成就',
      link: '/user/profile',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
  ];

  const popularLocations = locations.slice(0, 3);
  const featuredRoutes = routes.slice(0, 3);
  const upcomingActivities = activities.slice(0, 3);
  const latestPosts = posts.slice(0, 4);

  if (loading) {
    return <Loading type="fullscreen" tip="加载首页数据中..." />;
  }

  return (
    <ErrorBoundary>
      <Content>
        {/* 英雄区域 */}
        <HeroSection>
          <div className="hero-content">
            <h1>🧗‍♂️ 大理攀岩</h1>
            <div className="hero-subtitle">
              探索苍山洱海间的攀岩天堂，体验极限运动的魅力
            </div>
            <div className="hero-actions">
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate('/locations')}
              >
                探索地点
              </Button>
              <Button 
                size="large" 
                style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
                onClick={() => navigate('/routes')}
              >
                查看路线
              </Button>
            </div>
          </div>
        </HeroSection>

        {/* 统计数据 */}
        <StatsSection>
          <div className="stats-container">
            <Row gutter={[32, 32]}>
              <Col xs={12} sm={6}>
                <div className="stat-card">
                  <EnvironmentOutlined className="stat-icon" />
                  <Statistic value={stats.locations} />
                  <div className="stat-label">攀岩地点</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="stat-card">
                  <BranchesOutlined className="stat-icon" />
                  <Statistic value={stats.routes} />
                  <div className="stat-label">攀岩路线</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="stat-card">
                  <CalendarOutlined className="stat-icon" />
                  <Statistic value={stats.activities} />
                  <div className="stat-label">活动组织</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="stat-card">
                  <TeamOutlined className="stat-icon" />
                  <Statistic value={stats.users} />
                  <div className="stat-label">注册用户</div>
                </div>
              </Col>
            </Row>
          </div>
        </StatsSection>

        {/* 功能特色 */}
        <SectionContainer>
          <div className="section-header">
            <h2>功能特色</h2>
            <div className="section-subtitle">
              为攀岩爱好者提供全方位的信息服务和社交平台
            </div>
          </div>
          <div className="section-content">
            <Row gutter={[24, 24]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <FeatureCard
                    hoverable
                    cover={
                      <Image
                        alt={feature.title}
                        src={feature.image}
                        preview={false}
                      />
                    }
                    actions={[
                      <Link to={feature.link}>
                        <Button type="link" icon={<RightOutlined />}>
                          了解更多
                        </Button>
                      </Link>
                    ]}
                  >
                    <Meta
                      avatar={<div className="feature-icon">{feature.icon}</div>}
                      title={feature.title}
                      description={feature.description}
                    />
                  </FeatureCard>
                </Col>
              ))}
            </Row>
          </div>
        </SectionContainer>

        {/* 热门地点 */}
        <SectionContainer style={{ background: '#f8f9fa' }}>
          <div className="section-header">
            <h2>热门地点</h2>
            <div className="section-subtitle">
              最受欢迎的攀岩地点推荐
            </div>
          </div>
          <div className="section-content">
            <Row gutter={[24, 24]}>
              {popularLocations.map((location) => (
                <Col xs={24} sm={12} lg={8} key={location.id}>
                  <Card
                    hoverable
                    cover={
                      <Image
                        alt={location.name}
                        src={location.images?.[0] || 'https://images.unsplash.com/photo-1551524164-6cf2ac531fb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
                        height={200}
                        preview={false}
                      />
                    }
                    actions={[
                      <Link to={`/locations/${location.id}`}>
                        <Button type="link">查看详情</Button>
                      </Link>
                    ]}
                  >
                    <Meta
                      title={
                        <Space>
                          <FireOutlined style={{ color: '#ff4d4f' }} />
                          {location.name}
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Text type="secondary">
                            <EnvironmentOutlined /> {location.address}
                          </Text>
                          <div>
                            <Rate disabled defaultValue={location.rating} size="small" />
                            <Text type="secondary" style={{ marginLeft: 8 }}>
                              ({location.reviewCount || 0}条评价)
                            </Text>
                          </div>
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Button type="primary" size="large" onClick={() => navigate('/locations')}>
                查看更多地点
              </Button>
            </div>
          </div>
        </SectionContainer>

        {/* 最新活动 */}
        <SectionContainer>
          <div className="section-header">
            <h2>即将开始的活动</h2>
            <div className="section-subtitle">
              参加攀岩活动，结识更多攀岩伙伴
            </div>
          </div>
          <div className="section-content">
            <List
              itemLayout="horizontal"
              dataSource={upcomingActivities}
              renderItem={(activity) => (
                <List.Item
                  actions={[
                    <Link to={`/activities/${activity.id}`}>
                      <Button type="link">查看详情</Button>
                    </Link>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        size={64} 
                        src={activity.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'}
                      />
                    }
                    title={
                      <Space>
                        <CalendarOutlined />
                        {activity.title}
                        <Tag color="blue">{activity.status}</Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <Text type="secondary">
                          <EnvironmentOutlined /> {activity.location}
                        </Text>
                        <Text type="secondary">
                          时间: {new Date(activity.startTime).toLocaleDateString()}
                        </Text>
                        <Text type="secondary">
                          <TeamOutlined /> {activity.participants?.length || 0}/{activity.maxParticipants} 人
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Button type="primary" size="large" onClick={() => navigate('/activities')}>
                查看更多活动
              </Button>
            </div>
          </div>
        </SectionContainer>

        {/* 社区动态 */}
        <SectionContainer style={{ background: '#f8f9fa' }}>
          <div className="section-header">
            <h2>社区动态</h2>
            <div className="section-subtitle">
              最新的攀岩资讯和经验分享
            </div>
          </div>
          <div className="section-content">
            <Row gutter={[24, 24]}>
              {latestPosts.map((post) => (
                <Col xs={24} sm={12} key={post.id}>
                  <Card
                    hoverable
                    actions={[
                      <Space>
                        <EyeOutlined /> {post.views || 0}
                      </Space>,
                      <Space>
                        <MessageOutlined /> {post.comments?.length || 0}
                      </Space>,
                      <Space>
                        <StarOutlined /> {post.likes || 0}
                      </Space>
                    ]}
                  >
                    <Meta
                      avatar={
                        <Avatar 
                          src={post.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80'}
                        />
                      }
                      title={
                        <Link to={`/forum/posts/${post.id}`}>
                          {post.title}
                        </Link>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Text type="secondary">
                            {post.author?.username} · {new Date(post.createdAt).toLocaleDateString()}
                          </Text>
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {post.content}
                          </Paragraph>
                          <div>
                            {post.tags?.map((tag) => (
                              <Tag key={tag} size="small">{tag}</Tag>
                            ))}
                          </div>
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Button type="primary" size="large" onClick={() => navigate('/forum')}>
                进入社区论坛
              </Button>
            </div>
          </div>
        </SectionContainer>
      </Content>
    </ErrorBoundary>
  );
};

export default Home;