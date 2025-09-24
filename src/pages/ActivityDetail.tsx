import React, { useEffect, useState } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Space,
  Tag,
  Image,
  Tabs,
  Avatar,
  Rate,
  Divider,
  Breadcrumb,
  BackTop,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  message,
  Tooltip,
  Badge,
  Progress,
  Timeline,
  List,
  Comment,
  Carousel,
  Statistic,
  Alert,
  Steps,
  Descriptions,
  Empty,
  Spin
} from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  SafetyOutlined,
  TrophyOutlined,
  StarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FireOutlined,
  EyeOutlined,
  MessageOutlined,
  LikeOutlined,
  DislikeOutlined,
  CameraOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  BookOutlined,
  WarningOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchActivityById } from '../store/slices/activitySlice';
import { Loading, ErrorBoundary } from '../components';
import { useResponsive, useAuth } from '../hooks';
import { Activity, Review, Participant } from '../types';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Step } = Steps;
const { Item } = Descriptions;

const PageContainer = styled.div`
  min-height: calc(100vh - 64px);
  background: #f5f5f5;
`;

const HeroSection = styled.div`
  background: white;
  padding: 0;
  
  .hero-carousel {
    height: 400px;
    
    .carousel-image {
      width: 100%;
      height: 400px;
      object-fit: cover;
    }
    
    .carousel-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      color: white;
      padding: 40px;
      
      .hero-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 16px;
        color: white;
      }
      
      .hero-meta {
        display: flex;
        gap: 24px;
        margin-bottom: 16px;
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
        }
      }
      
      .hero-actions {
        display: flex;
        gap: 12px;
      }
    }
  }
  
  @media (max-width: 768px) {
    .hero-carousel {
      height: 300px;
      
      .carousel-image {
        height: 300px;
      }
      
      .carousel-overlay {
        padding: 20px;
        
        .hero-title {
          font-size: 1.8rem;
        }
        
        .hero-meta {
          flex-direction: column;
          gap: 8px;
        }
        
        .hero-actions {
          flex-direction: column;
        }
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
    padding: 24px;
    margin-bottom: 24px;
  }
  
  .sidebar {
    .sidebar-card {
      margin-bottom: 24px;
      border-radius: 12px;
      
      .card-title {
        font-weight: 600;
        color: #52c41a;
        margin-bottom: 16px;
      }
    }
  }
`;

const StatusBadge = styled.div<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => {
    const colors: { [key: string]: string } = {
      '报名中': 'background: #f6ffed; color: #52c41a; border: 1px solid #b7eb8f;',
      '进行中': 'background: #e6f7ff; color: #1890ff; border: 1px solid #91d5ff;',
      '已结束': 'background: #f5f5f5; color: #8c8c8c; border: 1px solid #d9d9d9;',
      '已取消': 'background: #fff2f0; color: #ff4d4f; border: 1px solid #ffb3b3;'
    };
    return colors[props.status] || colors['报名中'];
  }}
`;

const ParticipantCard = styled(Card)`
  .participant-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .participant-details {
      flex: 1;
      
      .participant-name {
        font-weight: 600;
        margin-bottom: 4px;
      }
      
      .participant-meta {
        color: #666;
        font-size: 12px;
      }
    }
  }
`;

const ReviewCard = styled(Card)`
  margin-bottom: 16px;
  
  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    
    .reviewer-info {
      display: flex;
      gap: 12px;
      
      .reviewer-details {
        .reviewer-name {
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .review-date {
          color: #666;
          font-size: 12px;
        }
      }
    }
    
    .review-actions {
      display: flex;
      gap: 8px;
    }
  }
  
  .review-content {
    margin-bottom: 12px;
  }
  
  .review-images {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    
    .review-image {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      object-fit: cover;
    }
  }
  
  .review-stats {
    display: flex;
    gap: 16px;
    color: #666;
    font-size: 12px;
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      
      &:hover {
        color: #1890ff;
      }
    }
  }
`;

const ActivityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isMobile } = useResponsive();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [joinForm] = Form.useForm();
  const [reviewForm] = Form.useForm();
  
  const { currentActivity, loading } = useSelector((state: RootState) => state.activities);

  useEffect(() => {
    if (id) {
      dispatch(fetchActivityById(id) as any);
    }
  }, [id, dispatch]);

  const handleJoinActivity = async (values: any) => {
    try {
      console.log('Join activity:', values);
      message.success('报名成功！');
      setJoinModalVisible(false);
      setIsJoined(true);
      joinForm.resetFields();
    } catch (error) {
      message.error('报名失败');
    }
  };

  const handleSubmitReview = async (values: any) => {
    try {
      console.log('Submit review:', values);
      message.success('评价提交成功！');
      setReviewModalVisible(false);
      reviewForm.resetFields();
    } catch (error) {
      message.error('评价提交失败');
    }
  };

  const handleToggleFavorite = () => {
    if (!user) {
      message.warning('请先登录');
      return;
    }
    setIsFavorite(!isFavorite);
    message.success(isFavorite ? '已取消收藏' : '已收藏');
  };

  const handleShare = () => {
    setShareModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      '报名中': '#52c41a',
      '进行中': '#1890ff',
      '已结束': '#8c8c8c',
      '已取消': '#ff4d4f'
    };
    return colors[status] || '#1890ff';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      '报名中': <CheckCircleOutlined />,
      '进行中': <FireOutlined />,
      '已结束': <ClockCircleOutlined />,
      '已取消': <ExclamationCircleOutlined />
    };
    return icons[status] || <CheckCircleOutlined />;
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" tip="加载活动详情中..." />
        </div>
      </PageContainer>
    );
  }

  if (!currentActivity) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Empty description="活动不存在" />
        </div>
      </PageContainer>
    );
  }

  const mockParticipants: Participant[] = [
    {
      id: '1',
      name: '张三',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      level: '中级',
      joinDate: '2024-01-15',
      status: '已确认'
    },
    {
      id: '2',
      name: '李四',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      level: '初级',
      joinDate: '2024-01-16',
      status: '待确认'
    }
  ];

  const mockReviews: Review[] = [
    {
      id: '1',
      userId: '1',
      userName: '王五',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      rating: 5,
      content: '非常棒的活动！教练专业，路线设计合理，安全措施到位。强烈推荐！',
      images: [
        'https://images.unsplash.com/photo-1551524164-6cf2ac531fb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      ],
      date: '2024-01-10',
      likes: 12,
      replies: 3
    }
  ];

  const renderJoinModal = () => (
    <Modal
      title="报名参加活动"
      open={joinModalVisible}
      onCancel={() => setJoinModalVisible(false)}
      footer={null}
      width={600}
    >
      <Form
        form={joinForm}
        layout="vertical"
        onFinish={handleJoinActivity}
      >
        <Alert
          message="报名须知"
          description="请仔细阅读活动详情和安全提示，确保您具备参与条件。报名成功后请按时参加活动。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="请输入真实姓名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="联系电话"
              rules={[
                { required: true, message: '请输入联系电话' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
              ]}
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="level"
              label="攀岩水平"
              rules={[{ required: true, message: '请选择攀岩水平' }]}
            >
              <Select placeholder="选择您的攀岩水平">
                <Select.Option value="新手">新手</Select.Option>
                <Select.Option value="初级">初级</Select.Option>
                <Select.Option value="中级">中级</Select.Option>
                <Select.Option value="高级">高级</Select.Option>
                <Select.Option value="专家">专家</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="experience"
              label="攀岩经验 (年)"
              rules={[{ required: true, message: '请输入攀岩经验' }]}
            >
              <InputNumber min={0} max={50} style={{ width: '100%' }} placeholder="攀岩经验年数" />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="emergencyContact"
          label="紧急联系人"
          rules={[{ required: true, message: '请输入紧急联系人信息' }]}
        >
          <Input placeholder="姓名 + 联系电话" />
        </Form.Item>
        
        <Form.Item
          name="medicalInfo"
          label="健康状况说明"
        >
          <TextArea
            rows={3}
            placeholder="请说明是否有心脏病、高血压等不适合攀岩的疾病..."
          />
        </Form.Item>
        
        <Form.Item
          name="notes"
          label="备注"
        >
          <TextArea
            rows={2}
            placeholder="其他需要说明的信息..."
          />
        </Form.Item>
        
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" size="large">
              确认报名
            </Button>
            <Button onClick={() => setJoinModalVisible(false)} size="large">
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderReviewModal = () => (
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
          label="总体评分"
          rules={[{ required: true, message: '请给出评分' }]}
        >
          <Rate allowHalf />
        </Form.Item>
        
        <Form.Item
          name="content"
          label="评价内容"
          rules={[{ required: true, message: '请输入评价内容' }]}
        >
          <TextArea
            rows={4}
            placeholder="分享您的参与体验..."
            maxLength={500}
            showCount
          />
        </Form.Item>
        
        <Form.Item
          name="images"
          label="上传图片"
        >
          <Upload
            listType="picture-card"
            multiple
            maxCount={6}
            beforeUpload={() => false}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
          </Upload>
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
  );

  const renderShareModal = () => (
    <Modal
      title="分享活动"
      open={shareModalVisible}
      onCancel={() => setShareModalVisible(false)}
      footer={null}
      width={400}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button block icon={<MessageOutlined />}>
          分享到微信
        </Button>
        <Button block icon={<ShareAltOutlined />}>
          分享到微博
        </Button>
        <Button block icon={<GlobalOutlined />}>
          复制链接
        </Button>
      </Space>
    </Modal>
  );

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
                <Link to="/activities">攀岩活动</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{currentActivity.title}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* 英雄区域 */}
        <HeroSection>
          <div className="hero-carousel">
            <Carousel autoplay>
              {(currentActivity.images || [
                'https://images.unsplash.com/photo-1551524164-6cf2ac531fb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
              ]).map((image, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img src={image} alt={`${currentActivity.title} ${index + 1}`} className="carousel-image" />
                  {index === 0 && (
                    <div className="carousel-overlay">
                      <div className="hero-title">{currentActivity.title}</div>
                      <div className="hero-meta">
                        <div className="meta-item">
                          <StatusBadge status={currentActivity.status}>
                            {getStatusIcon(currentActivity.status)}
                            {currentActivity.status}
                          </StatusBadge>
                        </div>
                        <div className="meta-item">
                          <EnvironmentOutlined />
                          <span>{currentActivity.location}</span>
                        </div>
                        <div className="meta-item">
                          <CalendarOutlined />
                          <span>{dayjs(currentActivity.date).format('YYYY年MM月DD日 HH:mm')}</span>
                        </div>
                        <div className="meta-item">
                          <TeamOutlined />
                          <span>{currentActivity.currentParticipants}/{currentActivity.maxParticipants}人</span>
                        </div>
                      </div>
                      <div className="hero-actions">
                        {currentActivity.status === '报名中' && !isJoined && (
                          <Button 
                            type="primary" 
                            size="large" 
                            onClick={() => setJoinModalVisible(true)}
                            disabled={currentActivity.currentParticipants >= currentActivity.maxParticipants}
                          >
                            {currentActivity.currentParticipants >= currentActivity.maxParticipants ? '已满员' : '立即报名'}
                          </Button>
                        )}
                        {isJoined && (
                          <Button size="large" disabled>
                            <CheckCircleOutlined /> 已报名
                          </Button>
                        )}
                        <Button 
                          size="large" 
                          icon={isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                          onClick={handleToggleFavorite}
                        >
                          {isFavorite ? '已收藏' : '收藏'}
                        </Button>
                        <Button size="large" icon={<ShareAltOutlined />} onClick={handleShare}>
                          分享
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Carousel>
          </div>
        </HeroSection>

        {/* 内容区域 */}
        <ContentSection>
          <Row gutter={24}>
            <Col xs={24} lg={16}>
              <div className="main-content">
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                  <TabPane tab="活动概览" key="overview">
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                      <div>
                        <Title level={4}>活动介绍</Title>
                        <Paragraph>
                          {currentActivity.description || '这是一个精彩的攀岩活动，适合各个水平的攀岩爱好者参与。我们将提供专业的指导和安全保障，让您在享受攀岩乐趣的同时确保安全。'}
                        </Paragraph>
                      </div>
                      
                      <div>
                        <Title level={4}>活动详情</Title>
                        <Descriptions bordered column={isMobile ? 1 : 2}>
                          <Item label="活动类型">{currentActivity.type}</Item>
                          <Item label="难度等级">
                            <Tag color="orange">{currentActivity.difficulty}</Tag>
                          </Item>
                          <Item label="活动时间">
                            {dayjs(currentActivity.date).format('YYYY年MM月DD日 HH:mm')}
                          </Item>
                          <Item label="活动时长">{currentActivity.duration || 4}小时</Item>
                          <Item label="集合地点">{currentActivity.location}</Item>
                          <Item label="参与人数">
                            {currentActivity.currentParticipants}/{currentActivity.maxParticipants}人
                          </Item>
                          <Item label="活动费用">
                            {currentActivity.price === 0 ? (
                              <Tag color="green">免费</Tag>
                            ) : (
                              <span>¥{currentActivity.price}</span>
                            )}
                          </Item>
                          <Item label="组织者">{currentActivity.organizer}</Item>
                        </Descriptions>
                      </div>
                      
                      <div>
                        <Title level={4}>安全提示</Title>
                        <Alert
                          message="安全第一"
                          description={
                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                              <li>请确保身体健康，无心脏病、高血压等不适合攀岩的疾病</li>
                              <li>必须佩戴安全装备，听从教练指导</li>
                              <li>请穿着合适的运动服装和攀岩鞋</li>
                              <li>活动期间请保持通讯畅通</li>
                              <li>如遇恶劣天气，活动可能会延期或取消</li>
                            </ul>
                          }
                          type="warning"
                          showIcon
                        />
                      </div>
                    </Space>
                  </TabPane>
                  
                  <TabPane tab="参与者" key="participants">
                    <div>
                      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={4} style={{ margin: 0 }}>参与者列表</Title>
                        <Text type="secondary">
                          已报名 {mockParticipants.length} 人，还可报名 {currentActivity.maxParticipants - currentActivity.currentParticipants} 人
                        </Text>
                      </div>
                      
                      <Progress 
                        percent={(currentActivity.currentParticipants / currentActivity.maxParticipants) * 100}
                        strokeColor="#52c41a"
                        style={{ marginBottom: 24 }}
                      />
                      
                      <Row gutter={[16, 16]}>
                        {mockParticipants.map((participant) => (
                          <Col xs={24} sm={12} lg={8} key={participant.id}>
                            <ParticipantCard size="small">
                              <div className="participant-info">
                                <Avatar src={participant.avatar} size={48} />
                                <div className="participant-details">
                                  <div className="participant-name">{participant.name}</div>
                                  <div className="participant-meta">
                                    <Tag size="small" color="blue">{participant.level}</Tag>
                                    <span style={{ marginLeft: 8 }}>
                                      {dayjs(participant.joinDate).format('MM-DD')} 报名
                                    </span>
                                  </div>
                                </div>
                                <Badge 
                                  status={participant.status === '已确认' ? 'success' : 'processing'} 
                                  text={participant.status}
                                />
                              </div>
                            </ParticipantCard>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </TabPane>
                  
                  <TabPane tab="评价" key="reviews">
                    <div>
                      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <Title level={4} style={{ margin: 0 }}>用户评价</Title>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
                            <Rate disabled defaultValue={4.8} allowHalf />
                            <Text strong>4.8分</Text>
                            <Text type="secondary">({mockReviews.length}条评价)</Text>
                          </div>
                        </div>
                        {user && isJoined && (
                          <Button type="primary" icon={<EditOutlined />} onClick={() => setReviewModalVisible(true)}>
                            写评价
                          </Button>
                        )}
                      </div>
                      
                      {mockReviews.length === 0 ? (
                        <Empty description="暂无评价" />
                      ) : (
                        mockReviews.map((review) => (
                          <ReviewCard key={review.id} size="small">
                            <div className="review-header">
                              <div className="reviewer-info">
                                <Avatar src={review.userAvatar} size={40} />
                                <div className="reviewer-details">
                                  <div className="reviewer-name">{review.userName}</div>
                                  <div className="review-date">{dayjs(review.date).format('YYYY-MM-DD')}</div>
                                </div>
                              </div>
                              <Rate disabled value={review.rating} size="small" />
                            </div>
                            
                            <div className="review-content">
                              <Paragraph>{review.content}</Paragraph>
                            </div>
                            
                            {review.images && review.images.length > 0 && (
                              <div className="review-images">
                                {review.images.map((image, index) => (
                                  <Image
                                    key={index}
                                    src={image}
                                    className="review-image"
                                    preview={{ mask: <EyeOutlined /> }}
                                  />
                                ))}
                              </div>
                            )}
                            
                            <div className="review-stats">
                              <div className="stat-item">
                                <LikeOutlined />
                                <span>{review.likes}</span>
                              </div>
                              <div className="stat-item">
                                <MessageOutlined />
                                <span>{review.replies}</span>
                              </div>
                            </div>
                          </ReviewCard>
                        ))
                      )}
                    </div>
                  </TabPane>
                  
                  <TabPane tab="相册" key="photos">
                    <div>
                      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={4} style={{ margin: 0 }}>活动相册</Title>
                        {user && (
                          <Button icon={<UploadOutlined />}>
                            上传照片
                          </Button>
                        )}
                      </div>
                      
                      <Row gutter={[16, 16]}>
                        {(currentActivity.images || [
                          'https://images.unsplash.com/photo-1551524164-6cf2ac531fb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                          'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
                        ]).map((image, index) => (
                          <Col xs={12} sm={8} md={6} key={index}>
                            <Image
                              src={image}
                              style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 8 }}
                              preview={{ mask: <EyeOutlined /> }}
                            />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </Col>
            
            <Col xs={24} lg={8}>
              <div className="sidebar">
                {/* 快速操作 */}
                <Card className="sidebar-card">
                  <div className="card-title">快速操作</div>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {currentActivity.status === '报名中' && !isJoined && (
                      <Button 
                        type="primary" 
                        block 
                        size="large"
                        onClick={() => setJoinModalVisible(true)}
                        disabled={currentActivity.currentParticipants >= currentActivity.maxParticipants}
                      >
                        {currentActivity.currentParticipants >= currentActivity.maxParticipants ? '已满员' : '立即报名'}
                      </Button>
                    )}
                    {isJoined && (
                      <Button block size="large" disabled>
                        <CheckCircleOutlined /> 已报名
                      </Button>
                    )}
                    <Button 
                      block 
                      icon={isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                      onClick={handleToggleFavorite}
                    >
                      {isFavorite ? '已收藏' : '收藏活动'}
                    </Button>
                    <Button block icon={<ShareAltOutlined />} onClick={handleShare}>
                      分享活动
                    </Button>
                    {currentActivity.location && (
                      <Link to={`/locations/${currentActivity.locationId}`}>
                        <Button block icon={<EnvironmentOutlined />}>
                          查看地点
                        </Button>
                      </Link>
                    )}
                  </Space>
                </Card>
                
                {/* 活动统计 */}
                <Card className="sidebar-card">
                  <div className="card-title">活动统计</div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic title="浏览量" value={currentActivity.viewCount || 156} prefix={<EyeOutlined />} />
                    </Col>
                    <Col span={12}>
                      <Statistic title="收藏数" value={currentActivity.favoriteCount || 23} prefix={<HeartOutlined />} />
                    </Col>
                  </Row>
                  <Divider />
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic title="报名率" value={85} suffix="%" prefix={<TeamOutlined />} />
                    </Col>
                    <Col span={12}>
                      <Statistic title="评分" value={4.8} prefix={<StarOutlined />} />
                    </Col>
                  </Row>
                </Card>
                
                {/* 联系信息 */}
                <Card className="sidebar-card">
                  <div className="card-title">联系信息</div>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <UserOutlined />
                      <span>组织者：{currentActivity.organizer}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <PhoneOutlined />
                      <span>联系电话：138****8888</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MailOutlined />
                      <span>邮箱：contact@climbing.com</span>
                    </div>
                  </Space>
                </Card>
                
                {/* 相关推荐 */}
                <Card className="sidebar-card">
                  <div className="card-title">相关推荐</div>
                  <List
                    size="small"
                    dataSource={[
                      {
                        title: '苍山攀岩体验',
                        date: '2024-02-15',
                        participants: '12/20'
                      },
                      {
                        title: '洱海日出攀岩',
                        date: '2024-02-20',
                        participants: '8/15'
                      }
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <div style={{ width: '100%' }}>
                          <div style={{ fontWeight: 500, marginBottom: 4 }}>{item.title}</div>
                          <div style={{ fontSize: 12, color: '#666', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{item.date}</span>
                            <span>{item.participants}</span>
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

        {/* 报名弹窗 */}
        {renderJoinModal()}

        {/* 评价弹窗 */}
        {renderReviewModal()}

        {/* 分享弹窗 */}
        {renderShareModal()}

        <BackTop />
      </PageContainer>
    </ErrorBoundary>
  );
};

export default ActivityDetail;