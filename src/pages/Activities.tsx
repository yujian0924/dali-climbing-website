import React, { useEffect, useState } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Space,
  Input,
  Select,
  Rate,
  Tag,
  Image,
  Pagination,
  Drawer,
  DatePicker,
  Slider,
  Empty,
  Spin,
  Avatar,
  Tooltip,
  Badge,
  Divider,
  Breadcrumb,
  BackTop,
  Calendar,
  Modal,
  Form,
  InputNumber,
  message
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  HeartOutlined,
  HeartFilled,
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  FireOutlined,
  TrophyOutlined,
  PlusOutlined,
  EyeOutlined,
  ShareAltOutlined,
  BookOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchActivities } from '../store/slices/activitySlice';
import { Loading, ErrorBoundary } from '../components';
import { useResponsive, useAuth, useDebounce } from '../hooks';
import { Activity } from '../types';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const PageContainer = styled.div`
  min-height: calc(100vh - 64px);
  background: #f5f5f5;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  color: white;
  padding: 60px 0;
  text-align: center;
  
  .hero-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    
    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 16px;
      color: white;
    }
    
    .hero-subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
      margin-bottom: 32px;
    }
    
    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 32px;
    }
    
    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 48px;
      margin-top: 32px;
      
      .stat-item {
        text-align: center;
        
        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          display: block;
        }
        
        .stat-label {
          opacity: 0.8;
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    padding: 40px 0;
    
    .hero-content {
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-actions {
        flex-direction: column;
        align-items: center;
      }
      
      .hero-stats {
        flex-direction: column;
        gap: 16px;
        
        .stat-item .stat-number {
          font-size: 1.5rem;
        }
      }
    }
  }
`;

const SearchSection = styled.div`
  background: white;
  padding: 24px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .search-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    
    .search-bar {
      margin-bottom: 16px;
    }
    
    .filter-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      
      .filter-tag {
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
        }
      }
    }
  }
`;

const ContentSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  
  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    .result-info {
      color: #666;
    }
    
    .view-options {
      display: flex;
      gap: 8px;
    }
  }
`;

const ActivityCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  .activity-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .activity-content {
    padding: 16px;
    
    .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      
      .activity-title {
        font-size: 18px;
        font-weight: 600;
        color: #1890ff;
        margin-bottom: 4px;
      }
      
      .activity-status {
        flex-shrink: 0;
      }
    }
    
    .activity-meta {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
      color: #666;
      font-size: 14px;
      
      .meta-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
    
    .activity-tags {
      margin-bottom: 12px;
    }
    
    .activity-stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #f0f0f0;
      
      .stats-left {
        display: flex;
        gap: 16px;
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #666;
          font-size: 12px;
        }
      }
      
      .activity-actions {
        display: flex;
        gap: 8px;
      }
    }
  }
  
  @media (max-width: 768px) {
    .activity-content {
      .activity-header {
        flex-direction: column;
        gap: 12px;
      }
      
      .activity-meta {
        flex-direction: column;
        gap: 8px;
      }
      
      .activity-stats {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }
    }
  }
`;

const FilterDrawer = styled(Drawer)`
  .filter-section {
    margin-bottom: 24px;
    
    .filter-title {
      font-weight: 600;
      margin-bottom: 12px;
      color: #52c41a;
    }
  }
`;

const Activities: React.FC = () => {
  const dispatch = useDispatch();
  const { isMobile } = useResponsive();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: [],
    difficulty: [],
    location: '',
    dateRange: null,
    priceRange: [0, 1000],
    status: 'all'
  });
  const [sortBy, setSortBy] = useState('upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [createForm] = Form.useForm();
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const { activities, loading, total } = useSelector((state: RootState) => state.activities);

  useEffect(() => {
    dispatch(fetchActivities({
      query: debouncedSearchTerm,
      filters,
      sortBy,
      page: currentPage,
      pageSize
    }) as any);
  }, [debouncedSearchTerm, filters, sortBy, currentPage, pageSize, dispatch]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleToggleFavorite = (activityId: string) => {
    if (!user) {
      message.warning('请先登录');
      return;
    }
    
    setFavorites(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleJoinActivity = (activityId: string) => {
    if (!user) {
      message.warning('请先登录');
      return;
    }
    
    message.success('报名成功！');
  };

  const handleCreateActivity = async (values: any) => {
    try {
      console.log('Create activity:', values);
      message.success('活动创建成功！');
      setCreateModalVisible(false);
      createForm.resetFields();
    } catch (error) {
      message.error('活动创建失败');
    }
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

  const quickFilters = [
    { label: '即将开始', key: 'upcoming', icon: <CalendarOutlined /> },
    { label: '热门活动', key: 'popular', icon: <FireOutlined /> },
    { label: '新手友好', key: 'beginner', icon: <SafetyOutlined /> },
    { label: '免费活动', key: 'free', icon: <StarOutlined /> }
  ];

  const renderFilterDrawer = () => (
    <FilterDrawer
      title="筛选条件"
      placement="right"
      onClose={() => setFilterDrawerVisible(false)}
      open={filterDrawerVisible}
      width={320}
    >
      <div className="filter-section">
        <div className="filter-title">活动类型</div>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="选择活动类型"
          value={filters.type}
          onChange={(value) => handleFilterChange('type', value)}
        >
          <Option value="攀岩体验">攀岩体验</Option>
          <Option value="技能培训">技能培训</Option>
          <Option value="比赛竞技">比赛竞技</Option>
          <Option value="户外探险">户外探险</Option>
          <Option value="社交聚会">社交聚会</Option>
        </Select>
      </div>
      
      <div className="filter-section">
        <div className="filter-title">难度等级</div>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="选择难度等级"
          value={filters.difficulty}
          onChange={(value) => handleFilterChange('difficulty', value)}
        >
          <Option value="新手">新手</Option>
          <Option value="初级">初级</Option>
          <Option value="中级">中级</Option>
          <Option value="高级">高级</Option>
          <Option value="专家">专家</Option>
        </Select>
      </div>
      
      <div className="filter-section">
        <div className="filter-title">地点</div>
        <Select
          style={{ width: '100%' }}
          placeholder="选择地点"
          value={filters.location}
          onChange={(value) => handleFilterChange('location', value)}
          allowClear
        >
          <Option value="苍山">苍山</Option>
          <Option value="洱海">洱海</Option>
          <Option value="剑川">剑川</Option>
          <Option value="鹤庆">鹤庆</Option>
          <Option value="室内岩馆">室内岩馆</Option>
        </Select>
      </div>
      
      <div className="filter-section">
        <div className="filter-title">活动时间</div>
        <RangePicker
          style={{ width: '100%' }}
          value={filters.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
        />
      </div>
      
      <div className="filter-section">
        <div className="filter-title">价格范围 (元)</div>
        <Slider
          range
          min={0}
          max={1000}
          value={filters.priceRange}
          onChange={(value) => handleFilterChange('priceRange', value)}
          marks={{
            0: '免费',
            500: '500',
            1000: '1000+'
          }}
        />
      </div>
      
      <div className="filter-section">
        <div className="filter-title">活动状态</div>
        <Select
          style={{ width: '100%' }}
          value={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
        >
          <Option value="all">全部</Option>
          <Option value="报名中">报名中</Option>
          <Option value="进行中">进行中</Option>
          <Option value="已结束">已结束</Option>
        </Select>
      </div>
      
      <div style={{ marginTop: 24 }}>
        <Button 
          block 
          onClick={() => {
            setFilters({
              type: [],
              difficulty: [],
              location: '',
              dateRange: null,
              priceRange: [0, 1000],
              status: 'all'
            });
          }}
        >
          重置筛选
        </Button>
      </div>
    </FilterDrawer>
  );

  const renderCreateModal = () => (
    <Modal
      title="创建活动"
      open={createModalVisible}
      onCancel={() => setCreateModalVisible(false)}
      footer={null}
      width={800}
    >
      <Form
        form={createForm}
        layout="vertical"
        onFinish={handleCreateActivity}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="活动标题"
              rules={[{ required: true, message: '请输入活动标题' }]}
            >
              <Input placeholder="输入活动标题" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              label="活动类型"
              rules={[{ required: true, message: '请选择活动类型' }]}
            >
              <Select placeholder="选择活动类型">
                <Option value="攀岩体验">攀岩体验</Option>
                <Option value="技能培训">技能培训</Option>
                <Option value="比赛竞技">比赛竞技</Option>
                <Option value="户外探险">户外探险</Option>
                <Option value="社交聚会">社交聚会</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="location"
              label="活动地点"
              rules={[{ required: true, message: '请输入活动地点' }]}
            >
              <Input placeholder="输入活动地点" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="difficulty"
              label="难度等级"
              rules={[{ required: true, message: '请选择难度等级' }]}
            >
              <Select placeholder="选择难度等级">
                <Option value="新手">新手</Option>
                <Option value="初级">初级</Option>
                <Option value="中级">中级</Option>
                <Option value="高级">高级</Option>
                <Option value="专家">专家</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dateTime"
              label="活动时间"
              rules={[{ required: true, message: '请选择活动时间' }]}
            >
              <DatePicker 
                showTime 
                style={{ width: '100%' }}
                placeholder="选择活动时间"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="duration"
              label="活动时长 (小时)"
              rules={[{ required: true, message: '请输入活动时长' }]}
            >
              <InputNumber min={1} max={24} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="maxParticipants"
              label="最大参与人数"
              rules={[{ required: true, message: '请输入最大参与人数' }]}
            >
              <InputNumber min={1} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="price"
              label="活动费用 (元)"
              rules={[{ required: true, message: '请输入活动费用' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="description"
          label="活动描述"
          rules={[{ required: true, message: '请输入活动描述' }]}
        >
          <TextArea
            rows={4}
            placeholder="详细描述活动内容、要求和注意事项..."
            maxLength={1000}
            showCount
          />
        </Form.Item>
        
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              创建活动
            </Button>
            <Button onClick={() => setCreateModalVisible(false)}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
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
              <Breadcrumb.Item>攀岩活动</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* 英雄区域 */}
        <HeroSection>
          <div className="hero-content">
            <h1 className="hero-title">攀岩活动</h1>
            <p className="hero-subtitle">
              加入我们的攀岩社区，参与各种精彩活动，结识志同道合的朋友
            </p>
            
            <div className="hero-actions">
              <Button 
                type="primary" 
                size="large" 
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
              >
                创建活动
              </Button>
              <Button 
                size="large" 
                icon={<CalendarOutlined />}
                onClick={() => setCalendarVisible(true)}
              >
                活动日历
              </Button>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">本月活动</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1200+</span>
                <span className="stat-label">参与人次</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4.9</span>
                <span className="stat-label">平均评分</span>
              </div>
            </div>
          </div>
        </HeroSection>

        {/* 搜索区域 */}
        <SearchSection>
          <div className="search-container">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={18}>
                <Search
                  className="search-bar"
                  placeholder="搜索活动名称、地点或描述..."
                  size="large"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onSearch={handleSearch}
                  enterButton={<SearchOutlined />}
                />
              </Col>
              <Col xs={24} md={6}>
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Select
                    value={sortBy}
                    onChange={setSortBy}
                    style={{ width: 120 }}
                  >
                    <Option value="upcoming">即将开始</Option>
                    <Option value="popular">最热门</Option>
                    <Option value="newest">最新发布</Option>
                    <Option value="price">价格</Option>
                  </Select>
                  <Button 
                    icon={<FilterOutlined />} 
                    onClick={() => setFilterDrawerVisible(true)}
                  >
                    筛选
                  </Button>
                </Space>
              </Col>
            </Row>
            
            <div className="filter-tags">
              {quickFilters.map((filter) => (
                <Tag
                  key={filter.key}
                  className="filter-tag"
                  icon={filter.icon}
                  color={sortBy === filter.key ? 'green' : 'default'}
                  onClick={() => setSortBy(filter.key)}
                >
                  {filter.label}
                </Tag>
              ))}
            </div>
          </div>
        </SearchSection>

        {/* 内容区域 */}
        <ContentSection>
          <div className="content-header">
            <div className="result-info">
              共找到 {total} 个活动
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" tip="加载活动中..." />
            </div>
          ) : activities.length === 0 ? (
            <Empty
              description="暂无活动数据"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <>
              <Row gutter={[24, 24]}>
                {activities.map((activity: Activity) => (
                  <Col xs={24} sm={12} lg={8} key={activity.id}>
                    <ActivityCard
                      hoverable
                      cover={
                        <div style={{ position: 'relative' }}>
                          <Image
                            src={activity.image || 'https://images.unsplash.com/photo-1551524164-6cf2ac531fb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                            alt={activity.title}
                            className="activity-image"
                            preview={false}
                          />
                          <div style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: 'rgba(0, 0, 0, 0.5)',
                            borderRadius: '50%',
                            padding: 8
                          }}>
                            <Tooltip title={favorites.includes(activity.id) ? '取消收藏' : '收藏'}>
                              <Button
                                type="text"
                                icon={favorites.includes(activity.id) ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined style={{ color: 'white' }} />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFavorite(activity.id);
                                }}
                                style={{ border: 'none', padding: 0 }}
                              />
                            </Tooltip>
                          </div>
                          <div style={{
                            position: 'absolute',
                            top: 12,
                            left: 12
                          }}>
                            <Tag 
                              color={getStatusColor(activity.status)}
                              icon={getStatusIcon(activity.status)}
                            >
                              {activity.status}
                            </Tag>
                          </div>
                        </div>
                      }
                    >
                      <div className="activity-content">
                        <div className="activity-header">
                          <div>
                            <Link to={`/activities/${activity.id}`}>
                              <div className="activity-title">{activity.title}</div>
                            </Link>
                            <div className="activity-meta">
                              <div className="meta-item">
                                <EnvironmentOutlined />
                                <span>{activity.location}</span>
                              </div>
                              <div className="meta-item">
                                <CalendarOutlined />
                                <span>{dayjs(activity.date).format('MM-DD HH:mm')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="activity-tags">
                          <Tag color="blue">{activity.type}</Tag>
                          <Tag color="orange">{activity.difficulty}</Tag>
                          {activity.price === 0 ? (
                            <Tag color="green">免费</Tag>
                          ) : (
                            <Tag icon={<DollarOutlined />}>¥{activity.price}</Tag>
                          )}
                        </div>
                        
                        <Paragraph ellipsis={{ rows: 2 }} style={{ margin: '12px 0' }}>
                          {activity.description}
                        </Paragraph>
                        
                        <div className="activity-stats">
                          <div className="stats-left">
                            <div className="stat-item">
                              <TeamOutlined />
                              <span>{activity.currentParticipants}/{activity.maxParticipants}</span>
                            </div>
                            <div className="stat-item">
                              <UserOutlined />
                              <span>{activity.organizer}</span>
                            </div>
                            <div className="stat-item">
                              <EyeOutlined />
                              <span>{activity.viewCount || 0}</span>
                            </div>
                          </div>
                          <div className="activity-actions">
                            <Tooltip title="分享">
                              <Button type="text" size="small" icon={<ShareAltOutlined />} />
                            </Tooltip>
                            {activity.status === '报名中' && (
                              <Button 
                                type="primary" 
                                size="small"
                                onClick={() => handleJoinActivity(activity.id)}
                                disabled={activity.currentParticipants >= activity.maxParticipants}
                              >
                                {activity.currentParticipants >= activity.maxParticipants ? '已满员' : '立即报名'}
                              </Button>
                            )}
                            <Link to={`/activities/${activity.id}`}>
                              <Button type="default" size="small" icon={<BookOutlined />}>
                                查看详情
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </ActivityCard>
                  </Col>
                ))}
              </Row>
              
              {/* 分页 */}
              <div style={{ textAlign: 'center', marginTop: 48 }}>
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
                />
              </div>
            </>
          )}
        </ContentSection>

        {/* 筛选抽屉 */}
        {renderFilterDrawer()}

        {/* 创建活动弹窗 */}
        {renderCreateModal()}

        {/* 活动日历弹窗 */}
        <Modal
          title="活动日历"
          open={calendarVisible}
          onCancel={() => setCalendarVisible(false)}
          footer={null}
          width={800}
        >
          <Calendar
            onSelect={(date) => {
              console.log('Selected date:', date.format('YYYY-MM-DD'));
            }}
            dateCellRender={(date) => {
              // 这里可以渲染当天的活动数量
              const dayActivities = activities.filter(activity => 
                dayjs(activity.date).isSame(date, 'day')
              );
              
              if (dayActivities.length > 0) {
                return (
                  <div style={{ fontSize: 12, color: '#52c41a' }}>
                    {dayActivities.length} 个活动
                  </div>
                );
              }
              return null;
            }}
          />
        </Modal>

        <BackTop />
      </PageContainer>
    </ErrorBoundary>
  );
};

export default Activities;