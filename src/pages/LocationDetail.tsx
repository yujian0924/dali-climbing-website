import React, { useEffect, useState } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Space,
  Rate,
  Tag,
  Image,
  Tabs,
  List,
  Avatar,
  Divider,
  Breadcrumb,
  Affix,
  BackTop,
  Modal,
  Form,
  Input,
  message,
  Carousel,
  Statistic,
  Timeline,
  Alert,
  Tooltip
} from 'antd';
import {
  EnvironmentOutlined,
  StarOutlined,
  StarFilled,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  CarOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  GlobalOutlined,
  CloudOutlined,
  CompassOutlined,
  SafetyOutlined,
  CameraOutlined,
  EditOutlined,
  PlusOutlined,
  LeftOutlined,
  RightOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchLocationById } from '../store/slices/locationSlice';
import { fetchRoutesByLocation } from '../store/slices/routeSlice';
import { Loading, ErrorBoundary } from '../components';
import { useResponsive, useAuth } from '../hooks';
import { Location, Route, Rating as RatingType } from '../types';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const PageContainer = styled.div`
  min-height: calc(100vh - 64px);
  background: #f5f5f5;
`;

const HeroSection = styled.div`
  position: relative;
  height: 400px;
  overflow: hidden;
  
  .hero-carousel {
    height: 100%;
    
    .ant-carousel .slick-slide {
      height: 400px;
      
      > div {
        height: 100%;
      }
    }
    
    .hero-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .hero-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    color: white;
    padding: 40px 24px 24px;
    
    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      
      .location-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 8px;
        color: white;
      }
      
      .location-subtitle {
        font-size: 1.2rem;
        opacity: 0.9;
        margin-bottom: 16px;
      }
      
      .location-meta {
        display: flex;
        align-items: center;
        gap: 24px;
        flex-wrap: wrap;
      }
    }
  }
  
  .hero-actions {
    position: absolute;
    top: 24px;
    right: 24px;
    display: flex;
    gap: 12px;
    
    .action-btn {
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: white;
        transform: scale(1.1);
      }
      
      &.favorited {
        color: #ff4d4f;
      }
    }
  }
  
  @media (max-width: 768px) {
    height: 300px;
    
    .hero-carousel {
      height: 300px;
      
      .ant-carousel .slick-slide {
        height: 300px;
      }
    }
    
    .hero-overlay {
      .location-title {
        font-size: 1.8rem;
      }
      
      .location-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  }
`;

const ContentSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  
  .main-content {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar {
    .sidebar-card {
      margin-bottom: 24px;
      border-radius: 12px;
      
      .card-title {
        font-weight: 600;
        color: #1890ff;
        margin-bottom: 16px;
      }
    }
  }
`;

const InfoCard = styled(Card)`
  .info-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    
    .info-icon {
      color: #1890ff;
      margin-right: 8px;
      width: 16px;
    }
    
    .info-label {
      font-weight: 500;
      margin-right: 8px;
      min-width: 80px;
    }
  }
`;

const RouteCard = styled(Card)`
  margin-bottom: 16px;
  
  .route-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .route-name {
      font-weight: 600;
      color: #1890ff;
    }
    
    .route-difficulty {
      font-weight: 600;
    }
  }
  
  .route-meta {
    display: flex;
    gap: 16px;
    color: #666;
    font-size: 12px;
    margin-bottom: 8px;
  }
`;

const ReviewCard = styled(Card)`
  margin-bottom: 16px;
  
  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .reviewer-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .reviewer-meta {
      .reviewer-name {
        font-weight: 500;
      }
      
      .review-date {
        color: #666;
        font-size: 12px;
      }
    }
  }
`;

const LocationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isMobile } = useResponsive();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorited, setIsFavorited] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewForm] = Form.useForm();
  
  const { currentLocation, loading } = useSelector((state: RootState) => state.locations);
  const { routes } = useSelector((state: RootState) => state.routes);

  useEffect(() => {
    if (id) {
      dispatch(fetchLocationById(id) as any);
      dispatch(fetchRoutesByLocation(id) as any);
    }
  }, [id, dispatch]);

  const handleToggleFavorite = () => {
    if (!user) {
      message.warning('请先登录');
      return;
    }
    
    setIsFavorited(!isFavorited);
    message.success(isFavorited ? '已取消收藏' : '已添加到收藏');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentLocation?.name,
        text: currentLocation?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      message.success('链接已复制到剪贴板');
    }
  };

  const handleSubmitReview = async (values: any) => {
    try {
      // 提交评价逻辑
      console.log('Submit review:', values);
      message.success('评价提交成功');
      setReviewModalVisible(false);
      reviewForm.resetFields();
    } catch (error) {
      message.error('评价提交失败');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      '5.6-5.8': '#52c41a',
      '5.9-5.10': '#faad14',
      '5.11-5.12': '#ff4d4f',
      '5.13+': '#722ed1'
    };
    return colors[difficulty] || '#1890ff';
  };

  if (loading || !currentLocation) {
    return <Loading type="fullscreen" tip="加载地点详情中..." />;
  }

  const mockReviews = [
    {
      id: '1',
      user: { name: '攀岩达人', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' },
      rating: 5,
      content: '这里的路线非常棒，风景优美，设施完善。强烈推荐给所有攀岩爱好者！',
      date: '2024-01-15',
      helpful: 12
    },
    {
      id: '2',
      user: { name: '山野行者', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' },
      rating: 4,
      content: '地点不错，但是停车位有点紧张，建议早点到达。',
      date: '2024-01-10',
      helpful: 8
    }
  ];

  const weatherData = {
    current: { temp: 22, condition: '晴朗', humidity: 45, wind: '微风' },
    forecast: [
      { date: '今天', temp: '18-25°C', condition: '晴' },
      { date: '明天', temp: '16-23°C', condition: '多云' },
      { date: '后天', temp: '19-26°C', condition: '晴' }
    ]
  };

  return (
    <ErrorBoundary>
      <PageContainer>
        {/* 面包屑导航 */}
        <div style={{ background: 'white', padding: '12px 24px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/">首页</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/locations">攀岩地点</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{currentLocation.name}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* 英雄区域 */}
        <HeroSection>
          <div className="hero-carousel">
            <Carousel autoplay>
              {currentLocation.images?.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`${currentLocation.name} ${index + 1}`} className="hero-image" />
                </div>
              )) || [
                <div key="default">
                  <img 
                    src="https://images.unsplash.com/photo-1551524164-6cf2ac531fb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                    alt={currentLocation.name} 
                    className="hero-image" 
                  />
                </div>
              ]}
            </Carousel>
          </div>
          
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="location-title">{currentLocation.name}</h1>
              <div className="location-subtitle">
                <EnvironmentOutlined /> {currentLocation.address}
              </div>
              <div className="location-meta">
                <Space>
                  <Rate disabled defaultValue={currentLocation.rating} />
                  <Text style={{ color: 'white' }}>({currentLocation.reviewCount || 0} 条评价)</Text>
                </Space>
                <Space>
                  {currentLocation.difficulty && (
                    <Tag color={getDifficultyColor(currentLocation.difficulty)}>
                      {currentLocation.difficulty}
                    </Tag>
                  )}
                  {currentLocation.type && (
                    <Tag>{currentLocation.type}</Tag>
                  )}
                </Space>
              </div>
            </div>
          </div>
          
          <div className="hero-actions">
            <Tooltip title={isFavorited ? '取消收藏' : '收藏'}>
              <button 
                className={`action-btn ${isFavorited ? 'favorited' : ''}`}
                onClick={handleToggleFavorite}
              >
                {isFavorited ? <HeartFilled /> : <HeartOutlined />}
              </button>
            </Tooltip>
            <Tooltip title="分享">
              <button className="action-btn" onClick={handleShare}>
                <ShareAltOutlined />
              </button>
            </Tooltip>
            <Tooltip title="写评价">
              <button className="action-btn" onClick={() => setReviewModalVisible(true)}>
                <EditOutlined />
              </button>
            </Tooltip>
          </div>
        </HeroSection>

        {/* 内容区域 */}
        <ContentSection>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <div className="main-content">
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                  <TabPane tab="概览" key="overview">
                    <div style={{ padding: 24 }}>
                      <Title level={3}>地点介绍</Title>
                      <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                        {currentLocation.description || '这是一个优秀的攀岩地点，拥有多条不同难度的路线，适合各个水平的攀岩爱好者。地理位置优越，交通便利，是进行攀岩运动的理想选择。'}
                      </Paragraph>
                      
                      <Divider />
                      
                      <Title level={4}>特色亮点</Title>
                      <Row gutter={[16, 16]}>
                        <Col span={8}>
                          <Card size="small" style={{ textAlign: 'center' }}>
                            <CompassOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
                            <div>多样路线</div>
                            <Text type="secondary">{currentLocation.routeCount || 0} 条路线</Text>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card size="small" style={{ textAlign: 'center' }}>
                            <SafetyOutlined style={{ fontSize: 24, color: '#52c41a', marginBottom: 8 }} />
                            <div>安全保障</div>
                            <Text type="secondary">专业指导</Text>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card size="small" style={{ textAlign: 'center' }}>
                            <EnvironmentOutlined style={{ fontSize: 24, color: '#faad14', marginBottom: 8 }} />
                            <div>风景优美</div>
                            <Text type="secondary">绝佳视野</Text>
                          </Card>
                        </Col>
                      </Row>
                      
                      <Divider />
                      
                      <Title level={4}>安全提示</Title>
                      <Alert
                        message="安全第一"
                        description={
                          <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                            <li>请佩戴专业攀岩装备</li>
                            <li>建议在专业教练指导下进行</li>
                            <li>注意天气变化，避免恶劣天气攀岩</li>
                            <li>与同伴保持联系，不要单独攀岩</li>
                          </ul>
                        }
                        type="warning"
                        showIcon
                      />
                    </div>
                  </TabPane>
                  
                  <TabPane tab={`路线 (${routes.length})`} key="routes">
                    <div style={{ padding: 24 }}>
                      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={3} style={{ margin: 0 }}>攀岩路线</Title>
                        <Button type="primary" icon={<PlusOutlined />}>
                          添加路线
                        </Button>
                      </div>
                      
                      {routes.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                          <Text type="secondary">暂无路线信息</Text>
                        </div>
                      ) : (
                        routes.map((route: Route) => (
                          <RouteCard key={route.id} size="small">
                            <div className="route-header">
                              <div className="route-name">{route.name}</div>
                              <Tag color={getDifficultyColor(route.difficulty)}>
                                {route.difficulty}
                              </Tag>
                            </div>
                            <div className="route-meta">
                              <span>类型: {route.type}</span>
                              <span>长度: {route.length}m</span>
                              <span>评分: <Rate disabled defaultValue={route.rating} size="small" /></span>
                            </div>
                            <Paragraph ellipsis={{ rows: 2 }}>
                              {route.description}
                            </Paragraph>
                            <div style={{ textAlign: 'right' }}>
                              <Link to={`/routes/${route.id}`}>
                                <Button type="link" size="small">查看详情</Button>
                              </Link>
                            </div>
                          </RouteCard>
                        ))
                      )}
                    </div>
                  </TabPane>
                  
                  <TabPane tab={`评价 (${mockReviews.length})`} key="reviews">
                    <div style={{ padding: 24 }}>
                      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={3} style={{ margin: 0 }}>用户评价</Title>
                        <Button type="primary" onClick={() => setReviewModalVisible(true)}>
                          写评价
                        </Button>
                      </div>
                      
                      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                        <Col span={8}>
                          <Statistic 
                            title="平均评分" 
                            value={currentLocation.rating} 
                            precision={1}
                            suffix="/ 5"
                          />
                        </Col>
                        <Col span={8}>
                          <Statistic title="评价数量" value={mockReviews.length} />
                        </Col>
                        <Col span={8}>
                          <Statistic title="推荐率" value={85} suffix="%" />
                        </Col>
                      </Row>
                      
                      <Divider />
                      
                      {mockReviews.map((review) => (
                        <ReviewCard key={review.id} size="small">
                          <div className="review-header">
                            <div className="reviewer-info">
                              <Avatar src={review.user.avatar} />
                              <div className="reviewer-meta">
                                <div className="reviewer-name">{review.user.name}</div>
                                <div className="review-date">{review.date}</div>
                              </div>
                            </div>
                            <Rate disabled defaultValue={review.rating} size="small" />
                          </div>
                          <Paragraph>{review.content}</Paragraph>
                          <div style={{ textAlign: 'right', color: '#666', fontSize: 12 }}>
                            {review.helpful} 人觉得有用
                          </div>
                        </ReviewCard>
                      ))}
                    </div>
                  </TabPane>
                  
                  <TabPane tab="照片" key="photos">
                    <div style={{ padding: 24 }}>
                      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={3} style={{ margin: 0 }}>照片集</Title>
                        <Button type="primary" icon={<CameraOutlined />}>
                          上传照片
                        </Button>
                      </div>
                      
                      <Row gutter={[16, 16]}>
                        {currentLocation.images?.map((image, index) => (
                          <Col xs={12} sm={8} md={6} key={index}>
                            <Image
                              src={image}
                              alt={`${currentLocation.name} ${index + 1}`}
                              style={{ borderRadius: 8 }}
                            />
                          </Col>
                        )) || (
                          <Col span={24}>
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                              <Text type="secondary">暂无照片</Text>
                            </div>
                          </Col>
                        )}
                      </Row>
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </Col>
            
            <Col xs={24} lg={8}>
              <div className="sidebar">
                {/* 基本信息 */}
                <InfoCard className="sidebar-card" title="基本信息">
                  <div className="info-item">
                    <EnvironmentOutlined className="info-icon" />
                    <span className="info-label">地址:</span>
                    <span>{currentLocation.address}</span>
                  </div>
                  <div className="info-item">
                    <ClockCircleOutlined className="info-icon" />
                    <span className="info-label">开放时间:</span>
                    <span>{currentLocation.openTime || '全天开放'}</span>
                  </div>
                  <div className="info-item">
                    <CarOutlined className="info-icon" />
                    <span className="info-label">停车:</span>
                    <span>{currentLocation.hasParking ? '有停车场' : '无停车场'}</span>
                  </div>
                  <div className="info-item">
                    <PhoneOutlined className="info-icon" />
                    <span className="info-label">联系电话:</span>
                    <span>{currentLocation.contact || '暂无'}</span>
                  </div>
                  <div className="info-item">
                    <GlobalOutlined className="info-icon" />
                    <span className="info-label">官网:</span>
                    <span>{currentLocation.website || '暂无'}</span>
                  </div>
                </InfoCard>
                
                {/* 天气信息 */}
                <Card className="sidebar-card" title="天气预报">
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <CloudOutlined style={{ fontSize: 32, color: '#faad14' }} />
                    <div style={{ fontSize: 24, fontWeight: 'bold', margin: '8px 0' }}>
                      {weatherData.current.temp}°C
                    </div>
                    <div>{weatherData.current.condition}</div>
                  </div>
                  
                  <Divider />
                  
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>{day.date}</span>
                      <span>{day.temp}</span>
                      <span>{day.condition}</span>
                    </div>
                  ))}
                </Card>
                
                {/* 交通指南 */}
                <Card className="sidebar-card" title="交通指南">
                  <Timeline size="small">
                    <Timeline.Item color="blue">
                      <strong>自驾路线</strong>
                      <br />
                      从大理古城出发，沿214国道向北行驶约30公里
                    </Timeline.Item>
                    <Timeline.Item color="green">
                      <strong>公共交通</strong>
                      <br />
                      乘坐8路公交车至终点站，步行10分钟
                    </Timeline.Item>
                    <Timeline.Item color="orange">
                      <strong>注意事项</strong>
                      <br />
                      山路较窄，请小心驾驶
                    </Timeline.Item>
                  </Timeline>
                </Card>
                
                {/* 相关推荐 */}
                <Card className="sidebar-card" title="相关推荐">
                  <List
                    size="small"
                    dataSource={[
                      { name: '苍山攀岩基地', distance: '5km', rating: 4.5 },
                      { name: '洱海岩壁', distance: '12km', rating: 4.2 },
                      { name: '剑川石林', distance: '25km', rating: 4.8 }
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 500 }}>{item.name}</span>
                            <Rate disabled defaultValue={item.rating} size="small" />
                          </div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            距离 {item.distance}
                          </Text>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </div>
            </Col>
          </Row>
        </ContentSection>

        {/* 评价弹窗 */}
        <Modal
          title="写评价"
          open={reviewModalVisible}
          onCancel={() => setReviewModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={reviewForm}
            layout="vertical"
            onFinish={handleSubmitReview}
          >
            <Form.Item
              name="rating"
              label="评分"
              rules={[{ required: true, message: '请给出评分' }]}
            >
              <Rate />
            </Form.Item>
            
            <Form.Item
              name="content"
              label="评价内容"
              rules={[{ required: true, message: '请输入评价内容' }]}
            >
              <TextArea
                rows={4}
                placeholder="分享你的攀岩体验..."
                maxLength={500}
                showCount
              />
            </Form.Item>
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  提交评价
                </Button>
                <Button onClick={() => setReviewModalVisible(false)}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <BackTop />
      </PageContainer>
    </ErrorBoundary>
  );
};

export default LocationDetail;