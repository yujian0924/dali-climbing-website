import React, { useEffect, useState } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Rate,
  Tag,
  Image,
  Pagination,
  Drawer,
  Slider,
  Checkbox,
  Radio,
  Empty,
  Spin,
  message
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  EnvironmentOutlined,
  StarOutlined,
  EyeOutlined,
  HeartOutlined,
  HeartFilled,
  CompassOutlined,
  CarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  fetchLocations,
  searchLocations,
  setFilters,
  clearFilters,
  setPage
} from '../store/slices/locationSlice';
import { Loading, ErrorBoundary } from '../components';
import { useResponsive, useDebounce } from '../hooks';
import { Location } from '../types';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;
const { Option } = Select;

const PageContainer = styled.div`
  min-height: calc(100vh - 64px);
  background: #f5f5f5;
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  color: white;
  padding: 48px 0;
  text-align: center;
  
  h1 {
    color: white;
    font-size: 2.5rem;
    margin-bottom: 16px;
  }
  
  .subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const FilterSection = styled.div`
  background: white;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  
  .filter-row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    
    .search-input {
      flex: 1;
      min-width: 300px;
    }
    
    .filter-select {
      min-width: 120px;
    }
  }
  
  @media (max-width: 768px) {
    .filter-row {
      flex-direction: column;
      align-items: stretch;
      
      .search-input,
      .filter-select {
        width: 100%;
        min-width: auto;
      }
    }
  }
`;

const ContentSection = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const LocationCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  .ant-card-cover {
    height: 240px;
    overflow: hidden;
    position: relative;
    
    img {
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    &:hover img {
      transform: scale(1.05);
    }
    
    .location-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }
    
    .favorite-btn {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
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
  
  .location-info {
    .location-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: #1890ff;
    }
    
    .location-address {
      color: #666;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .location-stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      .rating-section {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .stats-section {
        display: flex;
        gap: 16px;
        color: #666;
        font-size: 12px;
      }
    }
    
    .location-tags {
      margin-bottom: 12px;
      
      .ant-tag {
        margin-bottom: 4px;
      }
    }
    
    .location-features {
      display: flex;
      gap: 12px;
      color: #666;
      font-size: 12px;
      
      .feature-item {
        display: flex;
        align-items: center;
        gap: 4px;
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

const Locations: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isMobile } = useResponsive();
  
  const [searchText, setSearchText] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const debouncedSearchText = useDebounce(searchText, 500);
  
  const {
    locations,
    loading,
    error,
    total,
    currentPage,
    filters
  } = useSelector((state: RootState) => state.locations);

  // 从URL参数初始化搜索和筛选条件
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const type = searchParams.get('type') || '';
    const region = searchParams.get('region') || '';
    const page = parseInt(searchParams.get('page') || '1');
    
    setSearchText(search);
    dispatch(setFilters({ difficulty, type, region }));
    dispatch(setPage(page));
  }, [searchParams, dispatch]);

  // 搜索和筛选
  useEffect(() => {
    const params = {
      search: debouncedSearchText,
      page: currentPage,
      limit: 12,
      ...filters
    };
    
    if (debouncedSearchText) {
      dispatch(searchLocations(params) as any);
    } else {
      dispatch(fetchLocations(params) as any);
    }
    
    // 更新URL参数
    const newSearchParams = new URLSearchParams();
    if (debouncedSearchText) newSearchParams.set('search', debouncedSearchText);
    if (filters.difficulty) newSearchParams.set('difficulty', filters.difficulty);
    if (filters.type) newSearchParams.set('type', filters.type);
    if (filters.region) newSearchParams.set('region', filters.region);
    if (currentPage > 1) newSearchParams.set('page', currentPage.toString());
    
    setSearchParams(newSearchParams);
  }, [debouncedSearchText, currentPage, filters, dispatch, setSearchParams]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    dispatch(setPage(1));
  };

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ ...filters, [key]: value }));
    dispatch(setPage(1));
  };

  const handleClearFilters = () => {
    setSearchText('');
    dispatch(clearFilters());
    dispatch(setCurrentPage(1));
    setSearchParams({});
  };

  const handlePageChange = (page: number) => {
      dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (locationId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(locationId)) {
      newFavorites.delete(locationId);
      message.success('已取消收藏');
    } else {
      newFavorites.add(locationId);
      message.success('已添加到收藏');
    }
    setFavorites(newFavorites);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      '初级': '#52c41a',
      '中级': '#faad14',
      '高级': '#ff4d4f',
      '专家': '#722ed1'
    };
    return colors[difficulty] || '#1890ff';
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      '运动攀': <CompassOutlined />,
      '传统攀': <StarOutlined />,
      '抱石': <EnvironmentOutlined />
    };
    return icons[type] || <EnvironmentOutlined />;
  };

  const filterContent = (
    <div>
      <div className="filter-section">
        <div className="filter-title">难度等级</div>
        <Radio.Group
          value={filters.difficulty}
          onChange={(e) => handleFilterChange('difficulty', e.target.value)}
        >
          <Radio value="">全部</Radio>
          <Radio value="初级">初级</Radio>
          <Radio value="中级">中级</Radio>
          <Radio value="高级">高级</Radio>
          <Radio value="专家">专家</Radio>
        </Radio.Group>
      </div>
      
      <div className="filter-section">
        <div className="filter-title">攀岩类型</div>
        <Checkbox.Group
          value={filters.type ? [filters.type] : []}
          onChange={(values) => handleFilterChange('type', values[0] || '')}
        >
          <Checkbox value="运动攀">运动攀</Checkbox>
          <Checkbox value="传统攀">传统攀</Checkbox>
          <Checkbox value="抱石">抱石</Checkbox>
        </Checkbox.Group>
      </div>
      
      <div className="filter-section">
        <div className="filter-title">地区</div>
        <Select
          style={{ width: '100%' }}
          placeholder="选择地区"
          value={filters.region}
          onChange={(value) => handleFilterChange('region', value)}
          allowClear
        >
          <Option value="大理古城">大理古城</Option>
          <Option value="苍山">苍山</Option>
          <Option value="洱海">洱海</Option>
          <Option value="剑川">剑川</Option>
          <Option value="鹤庆">鹤庆</Option>
        </Select>
      </div>
      
      <div className="filter-section">
        <div className="filter-title">评分</div>
        <Slider
          range
          min={0}
          max={5}
          step={0.5}
          defaultValue={[0, 5]}
          marks={{
            0: '0',
            2.5: '2.5',
            5: '5'
          }}
        />
      </div>
      
      <Space>
        <Button type="primary" onClick={() => setFilterVisible(false)}>
          应用筛选
        </Button>
        <Button onClick={handleClearFilters}>
          清除筛选
        </Button>
      </Space>
    </div>
  );

  return (
    <ErrorBoundary>
      <PageContainer>
        {/* 页面头部 */}
        <HeaderSection>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <h1>🧗‍♂️ 攀岩地点</h1>
            <div className="subtitle">
              探索大理及周边最佳攀岩地点，发现属于你的攀岩天堂
            </div>
          </div>
        </HeaderSection>

        {/* 搜索和筛选 */}
        <FilterSection>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="filter-row">
              <Input.Search
                className="search-input"
                placeholder="搜索地点名称、地址或特色..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
                size="large"
              />
              
              {!isMobile && (
                <>
                  <Select
                    className="filter-select"
                    placeholder="难度等级"
                    value={filters.difficulty}
                    onChange={(value) => handleFilterChange('difficulty', value)}
                    allowClear
                  >
                    <Option value="初级">初级</Option>
                    <Option value="中级">中级</Option>
                    <Option value="高级">高级</Option>
                    <Option value="专家">专家</Option>
                  </Select>
                  
                  <Select
                    className="filter-select"
                    placeholder="攀岩类型"
                    value={filters.type}
                    onChange={(value) => handleFilterChange('type', value)}
                    allowClear
                  >
                    <Option value="运动攀">运动攀</Option>
                    <Option value="传统攀">传统攀</Option>
                    <Option value="抱石">抱石</Option>
                  </Select>
                  
                  <Select
                    className="filter-select"
                    placeholder="地区"
                    value={filters.region}
                    onChange={(value) => handleFilterChange('region', value)}
                    allowClear
                  >
                    <Option value="大理古城">大理古城</Option>
                    <Option value="苍山">苍山</Option>
                    <Option value="洱海">洱海</Option>
                    <Option value="剑川">剑川</Option>
                    <Option value="鹤庆">鹤庆</Option>
                  </Select>
                </>
              )}
              
              {isMobile && (
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => setFilterVisible(true)}
                >
                  筛选
                </Button>
              )}
              
              <Button
                icon={<ReloadOutlined />}
                onClick={handleClearFilters}
              >
                重置
              </Button>
            </div>
          </div>
        </FilterSection>

        {/* 内容区域 */}
        <ContentSection>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" tip="加载地点数据中..." />
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Text type="danger">加载失败: {error}</Text>
              <br />
              <Button 
                type="primary" 
                style={{ marginTop: 16 }}
                onClick={() => dispatch(fetchLocations({ page: 1, limit: 12 }) as any)}
              >
                重新加载
              </Button>
            </div>
          ) : locations.length === 0 ? (
            <Empty
              description="暂无符合条件的攀岩地点"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={handleClearFilters}>
                清除筛选条件
              </Button>
            </Empty>
          ) : (
            <>
              {/* 结果统计 */}
              <div style={{ marginBottom: 24, color: '#666' }}>
                找到 {total} 个攀岩地点
                {(searchText || Object.values(filters).some(v => v)) && (
                  <Button 
                    type="link" 
                    size="small"
                    onClick={handleClearFilters}
                  >
                    清除筛选
                  </Button>
                )}
              </div>
              
              {/* 地点列表 */}
              <Row gutter={[24, 24]}>
                {locations.map((location: Location) => (
                  <Col xs={24} sm={12} lg={8} key={location.id}>
                    <LocationCard
                      hoverable
                      cover={
                        <div>
                          <Image
                            alt={location.name}
                            src={location.images?.[0] || 'https://images.unsplash.com/photo-1551524164-6cf2ac531fb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
                            preview={false}
                          />
                          <div className="location-badge">
                            {location.routeCount || 0} 条路线
                          </div>
                          <button
                            className={`favorite-btn ${favorites.has(location.id) ? 'favorited' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleToggleFavorite(location.id);
                            }}
                          >
                            {favorites.has(location.id) ? <HeartFilled /> : <HeartOutlined />}
                          </button>
                        </div>
                      }
                      actions={[
                        <Link to={`/locations/${location.id}`}>
                          <Button type="link">查看详情</Button>
                        </Link>
                      ]}
                    >
                      <div className="location-info">
                        <div className="location-title">{location.name}</div>
                        
                        <div className="location-address">
                          <EnvironmentOutlined />
                          <Text type="secondary">{location.address}</Text>
                        </div>
                        
                        <div className="location-stats">
                          <div className="rating-section">
                            <Rate disabled defaultValue={location.rating} size="small" />
                            <Text type="secondary">({location.reviewCount || 0})</Text>
                          </div>
                          <div className="stats-section">
                            <span><EyeOutlined /> {location.views || 0}</span>
                            <span><UserOutlined /> {location.visitors || 0}</span>
                          </div>
                        </div>
                        
                        <div className="location-tags">
                          {location.difficulty && (
                            <Tag color={getDifficultyColor(location.difficulty)}>
                              {location.difficulty}
                            </Tag>
                          )}
                          {location.type && (
                            <Tag icon={getTypeIcon(location.type)}>
                              {location.type}
                            </Tag>
                          )}
                          {location.tags?.slice(0, 2).map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </div>
                        
                        <div className="location-features">
                          {location.hasParking && (
                            <div className="feature-item">
                              <CarOutlined />
                              <span>停车场</span>
                            </div>
                          )}
                          {location.openTime && (
                            <div className="feature-item">
                              <ClockCircleOutlined />
                              <span>{location.openTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </LocationCard>
                  </Col>
                ))}
              </Row>
              
              {/* 分页 */}
              {total > 12 && (
                <div style={{ textAlign: 'center', marginTop: 48 }}>
                  <Pagination
                    current={currentPage}
                    total={total}
                    pageSize={12}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) => 
                      `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                    }
                  />
                </div>
              )}
            </>
          )}
        </ContentSection>

        {/* 移动端筛选抽屉 */}
        <FilterDrawer
          title="筛选条件"
          placement="right"
          onClose={() => setFilterVisible(false)}
          open={filterVisible}
          width={320}
        >
          {filterContent}
        </FilterDrawer>
      </PageContainer>
    </ErrorBoundary>
  );
};

export default Locations;