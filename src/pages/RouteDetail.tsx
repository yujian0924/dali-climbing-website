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
  Tooltip,
  Progress,
  Badge,
  Steps,
  Collapse
} from 'antd';
import {
  EnvironmentOutlined,
  StarOutlined,
  StarFilled,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CompassOutlined,
  SafetyOutlined,
  CameraOutlined,
  EditOutlined,
  PlusOutlined,
  TrophyOutlined,
  FireOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  BookOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  RiseOutlined,
  FallOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchRouteById } from '../store/slices/routeSlice';
import { Loading, ErrorBoundary } from '../components';
import { useResponsive, useAuth } from '../hooks';
import { Route, ClimbingRecord } from '../types';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Step } = Steps;
const { Panel } = Collapse;

const PageContainer = styled.div`
  min-height: calc(100vh - 64px);
  background: #f5f5f5;
`;

const HeroSection = styled.div`
  position: relative;
  height: 500px;
  overflow: hidden;
  
  .hero-carousel {
    height: 100%;
    
    .ant-carousel .slick-slide {
      height: 500px;
      
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
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    color: white;
    padding: 60px 24px 24px;
    
    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      
      .route-title {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 12px;
        color: white;
      }
      
      .route-subtitle {
        font-size: 1.3rem;
        opacity: 0.9;
        margin-bottom: 20px;
      }
      
      .route-meta {
        display: flex;
        align-items: center;
        gap: 32px;
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
    height: 350px;
    
    .hero-carousel {
      height: 350px;
      
      .ant-carousel .slick-slide {
        height: 350px;
      }
    }
    
    .hero-overlay {
      .route-title {
        font-size: 2rem;
      }
      
      .route-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
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

const RouteInfoCard = styled(Card)`
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    
    .info-item {
      display: flex;
      align-items: center;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      
      .info-icon {
        color: #1890ff;
        margin-right: 12px;
        font-size: 18px;
      }
      
      .info-content {
        .info-label {
          font-size: 12px;
          color: #666;
          display: block;
        }
        
        .info-value {
          font-weight: 600;
          font-size: 16px;
        }
      }
    }
  }
`;

const ClimbingGuideCard = styled(Card)`
  .guide-section {
    margin-bottom: 24px;
    
    .section-title {
      font-weight: 600;
      color: #1890ff;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .guide-steps {
      .ant-steps-item-title {
        font-size: 14px !important;
      }
    }
  }
`;

const RecordCard = styled(Card)`
  margin-bottom: 16px;
  
  .record-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .climber-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .climber-meta {
      .climber-name {
        font-weight: 500;
      }
      
      .climb-date {
        color: #666;
        font-size: 12px;
      }
    }
  }
  
  .record-stats {
    display: flex;
    gap: 24px;
    margin-top: 12px;
    
    .stat-item {
      text-align: center;
      
      .stat-value {
        font-weight: 600;
        font-size: 18px;
        display: block;
      }
      
      .stat-label {
        font-size: 12px;
        color: #666;
      }
    }
  }
`;

const RouteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isMobile } = useResponsive();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorited, setIsFavorited] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [reviewForm] = Form.useForm();
  const [recordForm] = Form.useForm();
  
  const { currentRoute, loading } = useSelector((state: RootState) => state.routes);

  useEffect(() => {
    if (id) {
      dispatch(fetchRouteById(id) as any);
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
        title: currentRoute?.name,
        text: currentRoute?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      message.success('链接已复制到剪贴板');
    }
  };

  const handleSubmitReview = async (values: any) => {
    try {
      console.log('Submit review:', values);
      message.success('评价提交成功');
      setReviewModalVisible(false);
      reviewForm.resetFields();
    } catch (error) {
      message.error('评价提交失败');
    }
  };

  const handleSubmitRecord = async (values: any) => {
    try {
      console.log('Submit record:', values);
      message.success('攀登记录提交成功');
      setRecordModalVisible(false);
      recordForm.resetFields();
    } catch (error) {
      message.error('记录提交失败');
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

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      '运动攀': <ThunderboltOutlined />,
      '传统攀': <CompassOutlined />,
      '抱石': <FireOutlined />,
      '多段攀': <TrophyOutlined />
    };
    return icons[type] || <CompassOutlined />;
  };

  if (loading || !currentRoute) {
    return <Loading type="fullscreen" tip="加载路线详情中..." />;
  }

  const mockRecords: ClimbingRecord[] = [
    {
      id: '1',
      user: { name: '攀岩高手', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' },
      date: '2024-01-15',
      attempts: 3,
      success: true,
      time: '45分钟',
      difficulty: '5.11a',
      notes: '路线很有挑战性，关键点在第三段的横移。建议多练习手指力量。',
      rating: 5
    },
    {
      id: '2',
      user: { name: '新手小白', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80' },
      date: '2024-01-10',
      attempts: 8,
      success: false,
      time: '1小时20分钟',
      difficulty: '5.11a',
      notes: '还需要更多练习，第二段就卡住了。',
      rating: 4
    }
  ];

  const climbingGuide = {
    approach: [
      '从停车场沿小径向北走约15分钟',
      '经过小溪后继续向上',
      '看到标志牌后左转',
      '到达岩壁底部'
    ],
    preparation: [
      '检查装备：安全带、头盔、攀岩鞋',
      '准备绳索和快挂',
      '确认保护员准备就绪',
      '热身和拉伸'
    ],
    technique: [
      '起步段注意脚点选择',
      '中段有一个关键的横移动作',
      '顶部需要良好的手指力量',
      '下降时注意控制速度'
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
                <Link to="/routes">攀岩路线</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{currentRoute.name}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* 英雄区域 */}
        <HeroSection>
          <div className="hero-carousel">
            <Carousel autoplay>
              {currentRoute.images?.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`${currentRoute.name} ${index + 1}`} className="hero-image" />
                </div>
              )) || [
                <div key="default">
                  <img 
                    src="https://images.unsplash.com/photo-1551524164-6cf2ac531fb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                    alt={currentRoute.name} 
                    className="hero-image" 
                  />
                </div>
              ]}
            </Carousel>
          </div>
          
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="route-title">{currentRoute.name}</h1>
              <div className="route-subtitle">
                <EnvironmentOutlined /> {currentRoute.location}
              </div>
              <div className="route-meta">
                <Space size="large">
                  <Tag 
                    color={getDifficultyColor(currentRoute.difficulty)}
                    style={{ fontSize: 16, padding: '4px 12px', fontWeight: 600 }}
                  >
                    {currentRoute.difficulty}
                  </Tag>
                  <Tag 
                    icon={getTypeIcon(currentRoute.type)}
                    style={{ fontSize: 16, padding: '4px 12px' }}
                  >
                    {currentRoute.type}
                  </Tag>
                  {currentRoute.length && (
                    <Tag style={{ fontSize: 16, padding: '4px 12px' }}>
                      {currentRoute.length}m
                    </Tag>
                  )}
                </Space>
                <Space>
                  <Rate disabled defaultValue={currentRoute.rating} style={{ color: '#faad14' }} />
                  <Text style={{ color: 'white', fontSize: 16 }}>({currentRoute.reviewCount || 0} 条评价)</Text>
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
            <Tooltip title="记录攀登">
              <button className="action-btn" onClick={() => setRecordModalVisible(true)}>
                <TrophyOutlined />
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
                  <TabPane tab="路线概览" key="overview">
                    <div style={{ padding: 24 }}>
                      <Title level={3}>路线描述</Title>
                      <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                        {currentRoute.description || '这是一条经典的攀岩路线，具有良好的岩质和多样化的动作。路线设计合理，既有技术性挑战，也有体能要求，是提升攀岩技能的绝佳选择。'}
                      </Paragraph>
                      
                      <Divider />
                      
                      <RouteInfoCard title="路线信息">
                        <div className="info-grid">
                          <div className="info-item">
                            <CompassOutlined className="info-icon" />
                            <div className="info-content">
                              <span className="info-label">难度等级</span>
                              <span className="info-value">{currentRoute.difficulty}</span>
                            </div>
                          </div>
                          <div className="info-item">
                            <RiseOutlined className="info-icon" />
                            <div className="info-content">
                              <span className="info-label">路线长度</span>
                              <span className="info-value">{currentRoute.length || 25}m</span>
                            </div>
                          </div>
                          <div className="info-item">
                            <ThunderboltOutlined className="info-icon" />
                            <div className="info-content">
                              <span className="info-label">攀岩类型</span>
                              <span className="info-value">{currentRoute.type}</span>
                            </div>
                          </div>
                          <div className="info-item">
                            <UserOutlined className="info-icon" />
                            <div className="info-content">
                              <span className="info-label">首攀者</span>
                              <span className="info-value">{currentRoute.author || '未知'}</span>
                            </div>
                          </div>
                          <div className="info-item">
                            <ClockCircleOutlined className="info-icon" />
                            <div className="info-content">
                              <span className="info-label">建议时间</span>
                              <span className="info-value">1-2小时</span>
                            </div>
                          </div>
                          <div className="info-item">
                            <StarOutlined className="info-icon" />
                            <div className="info-content">
                              <span className="info-label">推荐指数</span>
                              <span className="info-value">{currentRoute.rating}/5</span>
                            </div>
                          </div>
                        </div>
                      </RouteInfoCard>
                      
                      <Divider />
                      
                      <Alert
                        message="安全提醒"
                        description={
                          <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                            <li>请确保使用合适的安全装备</li>
                            <li>建议有经验的攀岩者陪同</li>
                            <li>注意天气条件，避免雨天攀岩</li>
                            <li>检查岩点稳固性，注意落石风险</li>
                          </ul>
                        }
                        type="warning"
                        showIcon
                      />
                    </div>
                  </TabPane>
                  
                  <TabPane tab="攀登指南" key="guide">
                    <div style={{ padding: 24 }}>
                      <ClimbingGuideCard title="详细攀登指南">
                        <div className="guide-section">
                          <div className="section-title">
                            <CompassOutlined />
                            接近路线
                          </div>
                          <Steps direction="vertical" size="small" className="guide-steps">
                            {climbingGuide.approach.map((step, index) => (
                              <Step key={index} title={`步骤 ${index + 1}`} description={step} />
                            ))}
                          </Steps>
                        </div>
                        
                        <div className="guide-section">
                          <div className="section-title">
                            <SafetyOutlined />
                            准备工作
                          </div>
                          <Steps direction="vertical" size="small" className="guide-steps">
                            {climbingGuide.preparation.map((step, index) => (
                              <Step key={index} title={`准备 ${index + 1}`} description={step} />
                            ))}
                          </Steps>
                        </div>
                        
                        <div className="guide-section">
                          <div className="section-title">
                            <TrophyOutlined />
                            攀登技巧
                          </div>
                          <Collapse ghost>
                            {climbingGuide.technique.map((tip, index) => (
                              <Panel 
                                key={index} 
                                header={`技巧要点 ${index + 1}`}
                                extra={<InfoCircleOutlined />}
                              >
                                <p>{tip}</p>
                              </Panel>
                            ))}
                          </Collapse>
                        </div>
                      </ClimbingGuideCard>
                    </div>
                  </TabPane>
                  
                  <TabPane tab={`攀登记录 (${mockRecords.length})`} key="records">
                    <div style={{ padding: 24 }}>
                      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={3} style={{ margin: 0 }}>攀登记录</Title>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setRecordModalVisible(true)}>
                          添加记录
                        </Button>
                      </div>
                      
                      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                        <Col span={6}>
                          <Statistic title="总攀登次数" value={mockRecords.length} />
                        </Col>
                        <Col span={6}>
                          <Statistic 
                            title="成功率" 
                            value={mockRecords.filter(r => r.success).length / mockRecords.length * 100} 
                            precision={0}
                            suffix="%"
                          />
                        </Col>
                        <Col span={6}>
                          <Statistic title="平均尝试次数" value={mockRecords.reduce((acc, r) => acc + r.attempts, 0) / mockRecords.length} precision={1} />
                        </Col>
                        <Col span={6}>
                          <Statistic title="平均评分" value={mockRecords.reduce((acc, r) => acc + r.rating, 0) / mockRecords.length} precision={1} suffix="/5" />
                        </Col>
                      </Row>
                      
                      <Divider />
                      
                      {mockRecords.map((record) => (
                        <RecordCard key={record.id} size="small">
                          <div className="record-header">
                            <div className="climber-info">
                              <Avatar src={record.user.avatar} />
                              <div className="climber-meta">
                                <div className="climber-name">{record.user.name}</div>
                                <div className="climb-date">{record.date}</div>
                              </div>
                            </div>
                            <Space>
                              <Badge 
                                status={record.success ? 'success' : 'error'} 
                                text={record.success ? '成功' : '失败'}
                              />
                              <Rate disabled defaultValue={record.rating} size="small" />
                            </Space>
                          </div>
                          
                          <div className="record-stats">
                            <div className="stat-item">
                              <span className="stat-value">{record.attempts}</span>
                              <span className="stat-label">尝试次数</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-value">{record.time}</span>
                              <span className="stat-label">用时</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-value">{record.difficulty}</span>
                              <span className="stat-label">完成难度</span>
                            </div>
                          </div>
                          
                          {record.notes && (
                            <>
                              <Divider style={{ margin: '12px 0' }} />
                              <Paragraph style={{ margin: 0 }}>
                                <Text type="secondary">备注：</Text>
                                {record.notes}
                              </Paragraph>
                            </>
                          )}
                        </RecordCard>
                      ))}
                    </div>
                  </TabPane>
                  
                  <TabPane tab="照片视频" key="media">
                    <div style={{ padding: 24 }}>
                      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={3} style={{ margin: 0 }}>媒体资料</Title>
                        <Button type="primary" icon={<CameraOutlined />}>
                          上传媒体
                        </Button>
                      </div>
                      
                      <Row gutter={[16, 16]}>
                        {currentRoute.images?.map((image, index) => (
                          <Col xs={12} sm={8} md={6} key={index}>
                            <Image
                              src={image}
                              alt={`${currentRoute.name} ${index + 1}`}
                              style={{ borderRadius: 8 }}
                            />
                          </Col>
                        )) || (
                          <Col span={24}>
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                              <Text type="secondary">暂无媒体资料</Text>
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
                {/* 快速操作 */}
                <Card className="sidebar-card" title="快速操作">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button type="primary" block icon={<TrophyOutlined />} onClick={() => setRecordModalVisible(true)}>
                      记录攀登
                    </Button>
                    <Button block icon={<EditOutlined />} onClick={() => setReviewModalVisible(true)}>
                      写评价
                    </Button>
                    <Button block icon={<ShareAltOutlined />} onClick={handleShare}>
                      分享路线
                    </Button>
                    <Button block icon={<BookOutlined />}>
                      <Link to={`/locations/${currentRoute.locationId}`}>查看地点</Link>
                    </Button>
                  </Space>
                </Card>
                
                {/* 统计信息 */}
                <Card className="sidebar-card" title="路线统计">
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Statistic title="攀登次数" value={mockRecords.length} />
                    </Col>
                    <Col span={12}>
                      <Statistic title="收藏数" value={156} />
                    </Col>
                    <Col span={12}>
                      <Statistic title="浏览量" value={currentRoute.viewCount || 1234} />
                    </Col>
                    <Col span={12}>
                      <Statistic title="成功率" value={75} suffix="%" />
                    </Col>
                  </Row>
                </Card>
                
                {/* 装备建议 */}
                <Card className="sidebar-card" title="推荐装备">
                  <List
                    size="small"
                    dataSource={[
                      { name: '动力绳', spec: '10.2mm x 70m', essential: true },
                      { name: '快挂', spec: '12把', essential: true },
                      { name: '安全带', spec: '运动攀专用', essential: true },
                      { name: '攀岩鞋', spec: '紧身型', essential: true },
                      { name: '头盔', spec: '轻量化', essential: false },
                      { name: '镁粉袋', spec: '腰挂式', essential: false }
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 500 }}>{item.name}</span>
                            {item.essential && <Badge status="error" text="必需" />}
                          </div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {item.spec}
                          </Text>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
                
                {/* 相关路线 */}
                <Card className="sidebar-card" title="相关路线">
                  <List
                    size="small"
                    dataSource={[
                      { name: '天梯', difficulty: '5.10c', rating: 4.2, location: '苍山' },
                      { name: '飞檐走壁', difficulty: '5.11a', rating: 4.5, location: '苍山' },
                      { name: '云中漫步', difficulty: '5.10d', rating: 4.0, location: '苍山' }
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 500 }}>{item.name}</span>
                            <Tag color={getDifficultyColor(item.difficulty)} size="small">
                              {item.difficulty}
                            </Tag>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {item.location}
                            </Text>
                            <Rate disabled defaultValue={item.rating} size="small" />
                          </div>
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
                placeholder="分享你的攀岩体验和技巧建议..."
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

        {/* 攀登记录弹窗 */}
        <Modal
          title="记录攀登"
          open={recordModalVisible}
          onCancel={() => setRecordModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={recordForm}
            layout="vertical"
            onFinish={handleSubmitRecord}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="attempts"
                  label="尝试次数"
                  rules={[{ required: true, message: '请输入尝试次数' }]}
                >
                  <Input type="number" min={1} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="success"
                  label="是否成功"
                  rules={[{ required: true, message: '请选择是否成功' }]}
                >
                  <Select>
                    <Option value={true}>成功</Option>
                    <Option value={false}>失败</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="time"
                  label="用时"
                  rules={[{ required: true, message: '请输入用时' }]}
                >
                  <Input placeholder="例如：45分钟" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="rating"
                  label="评分"
                  rules={[{ required: true, message: '请给出评分' }]}
                >
                  <Rate />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="notes"
              label="备注"
            >
              <TextArea
                rows={3}
                placeholder="记录你的攀登体验、技巧心得或改进建议..."
                maxLength={300}
                showCount
              />
            </Form.Item>
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  保存记录
                </Button>
                <Button onClick={() => setRecordModalVisible(false)}>
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

export default RouteDetail;