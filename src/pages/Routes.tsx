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
  Slider,
  Checkbox,
  Empty,
  Spin,
  Avatar,
  Tooltip,
  Badge,
  Divider,
  Breadcrumb,
  BackTop
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  HeartOutlined,
  HeartFilled,
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  StarOutlined,
  CompassOutlined,
  SafetyOutlined,
  TrophyOutlined,
  FireOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  ShareAltOutlined,
  BookOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchRoutes, searchRoutes } from '../store/slices/routeSlice';
import { Loading, ErrorBoundary } from '../components';
import { useResponsive, useAuth, useDebounce } from '../hooks';
import { Route } from '../types';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const PageContainer = styled.div`
  min-height: calc(100vh - 64px);
  background: #f5f5f5;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
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

const RouteCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  .route-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .route-content {
    padding: 16px;
    
    .route-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      
      .route-title {
        font-size: 18px;
        font-weight: 600;
        color: #1890ff;
        margin-bottom: 4px;
      }
      
      .route-actions {
        display: flex;
        gap: 8px;
      }
    }
    
    .route-meta {
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
    
    .route-tags {
      margin-bottom: 12px;
      
      .difficulty-tag {
        font-weight: 600;
      }
    }
    
    .route-stats {
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
    }
  }
  
  @media (max-width: 768px) {
    .route-content {
      .route-header {
        flex-direction: column;
        gap: 12px;
      }
      
      .route-meta {
        flex-direction: column;
        gap: 8px;
      }
      
      .route-stats {
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
      color: #1890ff;
    }
  }
`;

const Routes: React.FC = () => {
  const dispatch = useDispatch();
  const { isMobile } = useResponsive();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    difficulty: [],
    type: [],
    location: '',
    rating: [0, 5],
    length: [0, 100]
  });
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const { routes, loading, total } = useSelector((state: RootState) => state.routes);

  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(searchRoutes({
        query: debouncedSearchTerm,
        filters,
        sortBy,
        page: currentPage,
        pageSize
      }) as any);
    } else {
      dispatch(fetchRoutes({
        filters,
        sortBy,
        page: currentPage,
        pageSize
      }) as any);
    }
  }, [debouncedSearchTerm, filters, sortBy, currentPage, pageSize, dispatch]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleToggleFavorite = (routeId: string) => {
    if (!user) {
      message.warning('请先登录');
      return;
    }
    
    setFavorites(prev => 
      prev.includes(routeId) 
        ? prev.filter(id => id !== routeId)
        : [...prev, routeId]
    );
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

  const quickFilters = [
    { label: '热门路线', key: 'popular', icon: <FireOutlined /> },
    { label: '新手友好', key: 'beginner', icon: <SafetyOutlined /> },
    { label: '高难度', key: 'advanced', icon: <TrophyOutlined /> },
    { label: '经典路线', key: 'classic', icon: <StarOutlined /> }
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
        <div className="filter-title">难度等级</div>
        <Checkbox.Group
          value={filters.difficulty}
          onChange={(value) => handleFilterChange('difficulty', value)}
        >
          <Row>
            <Col span={24}><Checkbox value="5.6-5.8">5.6-5.8 (初级)</Checkbox></Col>
            <Col span={24}><Checkbox value="5.9-5.10">5.9-5.10 (中级)</Checkbox></Col>
            <Col span={24}><Checkbox value="5.11-5.12">5.11-5.12 (高级)</Checkbox></Col>
            <Col span={24}><Checkbox value="5.13+">5.13+ (专家)</Checkbox></Col>
          </Row>
        </Checkbox.Group>
      </div>
      
      <div className="filter-section">
        <div className="filter-title">攀岩类型</div>
        <Checkbox.Group
          value={filters.type}
          onChange={(value) => handleFilterChange('type', value)}
        >
          <Row>
            <Col span={24}><Checkbox value="运动攀">运动攀</Checkbox></Col>
            <Col span={24}><Checkbox value="传统攀">传统攀</Checkbox></Col>
            <Col span={24}><Checkbox value="抱石">抱石</Checkbox></Col>
            <Col span={24}><Checkbox value="多段攀">多段攀</Checkbox></Col>
          </Row>
        </Checkbox.Group>
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
        </Select>
      </div>
      
      <div className="filter-section">
        <div className="filter-title">评分范围</div>
        <Slider
          range
          min={0}
          max={5}
          step={0.5}
          value={filters.rating}
          onChange={(value) => handleFilterChange('rating', value)}
          marks={{
            0: '0',
            2.5: '2.5',
            5: '5'
          }}
        />
      </div>
      
      <div className="filter-section">
        <div className="filter-title">路线长度 (米)</div>
        <Slider
          range
          min={0}
          max={100}
          value={filters.length}
          onChange={(value) => handleFilterChange('length', value)}
          marks={{
            0: '0m',
            50: '50m',
            100: '100m+'
          }}
        />
      </div>
      
      <div style={{ marginTop: 24 }}>
        <Button 
          block 
          onClick={() => {
            setFilters({
              difficulty: [],
              type: [],
              location: '',
              rating: [0, 5],
              length: [0, 100]
            });
          }}
        >
          重置筛选
        </Button>
      </div>
    </FilterDrawer>
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
              <Breadcrumb.Item>攀岩路线</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* 英雄区域 */}
        <HeroSection>
          <div className="hero-content">
            <h1 className="hero-title">攀岩路线指南</h1>
            <p className="hero-subtitle">
              发现大理最佳攀岩路线，从新手友好到专家挑战，总有适合你的路线
            </p>
            
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">200+</span>
                <span className="stat-label">条路线</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">15</span>
                <span className="stat-label">个地点</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4.8</span>
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
                  placeholder="搜索路线名称、地点或描述..."
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
                    <Option value="popular">最热门</Option>
                    <Option value="rating">最高分</Option>
                    <Option value="difficulty">难度</Option>
                    <Option value="newest">最新</Option>
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
                  color={sortBy === filter.key ? 'blue' : 'default'}
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
              共找到 {total} 条路线
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" tip="加载路线中..." />
            </div>
          ) : routes.length === 0 ? (
            <Empty
              description="暂无路线数据"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <>
              <Row gutter={[24, 24]}>
                {routes.map((route: Route) => (
                  <Col xs={24} sm={12} lg={8} key={route.id}>
                    <RouteCard
                      hoverable
                      cover={
                        <div style={{ position: 'relative' }}>
                          <Image
                            src={route.image || 'https://images.unsplash.com/photo-1551524164-6cf2ac531fb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                            alt={route.name}
                            className="route-image"
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
                            <Tooltip title={favorites.includes(route.id) ? '取消收藏' : '收藏'}>
                              <Button
                                type="text"
                                icon={favorites.includes(route.id) ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined style={{ color: 'white' }} />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFavorite(route.id);
                                }}
                                style={{ border: 'none', padding: 0 }}
                              />
                            </Tooltip>
                          </div>
                        </div>
                      }
                    >
                      <div className="route-content">
                        <div className="route-header">
                          <div>
                            <Link to={`/routes/${route.id}`}>
                              <div className="route-title">{route.name}</div>
                            </Link>
                            <div className="route-meta">
                              <div className="meta-item">
                                <EnvironmentOutlined />
                                <span>{route.location}</span>
                              </div>
                              <div className="meta-item">
                                <UserOutlined />
                                <span>{route.author}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="route-tags">
                          <Tag 
                            className="difficulty-tag"
                            color={getDifficultyColor(route.difficulty)}
                          >
                            {route.difficulty}
                          </Tag>
                          <Tag icon={getTypeIcon(route.type)}>
                            {route.type}
                          </Tag>
                          {route.length && (
                            <Tag>
                              {route.length}m
                            </Tag>
                          )}
                        </div>
                        
                        <Paragraph ellipsis={{ rows: 2 }} style={{ margin: '12px 0' }}>
                          {route.description}
                        </Paragraph>
                        
                        <div className="route-stats">
                          <div className="stats-left">
                            <div className="stat-item">
                              <Rate disabled defaultValue={route.rating} size="small" />
                              <span>({route.reviewCount || 0})</span>
                            </div>
                            <div className="stat-item">
                              <EyeOutlined />
                              <span>{route.viewCount || 0}</span>
                            </div>
                            <div className="stat-item">
                              <ClockCircleOutlined />
                              <span>{route.createdAt}</span>
                            </div>
                          </div>
                          <Space>
                            <Tooltip title="分享">
                              <Button type="text" size="small" icon={<ShareAltOutlined />} />
                            </Tooltip>
                            <Link to={`/routes/${route.id}`}>
                              <Button type="primary" size="small" icon={<BookOutlined />}>
                                查看详情
                              </Button>
                            </Link>
                          </Space>
                        </div>
                      </div>
                    </RouteCard>
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

        <BackTop />
      </PageContainer>
    </ErrorBoundary>
  );
};

export default Routes;