import React, { useState, useEffect } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Space,
  Tabs,
  List,
  Avatar,
  Tag,
  Input,
  Select,
  Pagination,
  Divider,
  Badge,
  Tooltip,
  Modal,
  Form,
  Upload,
  message,
  Alert,
  Dropdown,
  Menu,
  Rate,
  Progress,
  Statistic,
  Timeline,
  Comment,
  BackTop,
  Breadcrumb,
  Empty,
  Affix
} from 'antd';
import {
  MessageOutlined,
  LikeOutlined,
  DislikeOutlined,
  ShareAltOutlined,
  EyeOutlined,
  CommentOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  FireOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  TagOutlined,
  StarOutlined,
  HeartOutlined,
  FlagOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  SendOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  CrownOutlined,
  ThunderboltOutlined,
  BookOutlined,
  TeamOutlined,
  SafetyOutlined,
  BulbOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useResponsive, useAuth } from '../hooks';
import { Loading, ErrorBoundary } from '../components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const PageContainer = styled.div`
  min-height: calc(100vh - 64px);
  background: #f5f5f5;
`;

const ForumHeader = styled.div`
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
  padding: 48px 0;
  
  .forum-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    
    .forum-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      color: white;
    }
    
    .forum-subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin-bottom: 32px;
    }
    
    .forum-stats {
      display: flex;
      gap: 48px;
      
      .stat-item {
        text-align: center;
        
        .stat-number {
          font-size: 1.8rem;
          font-weight: 700;
          display: block;
          margin-bottom: 4px;
        }
        
        .stat-label {
          opacity: 0.8;
          font-size: 14px;
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    padding: 32px 0;
    
    .forum-content {
      .forum-title {
        font-size: 1.8rem;
      }
      
      .forum-stats {
        flex-direction: column;
        gap: 16px;
        
        .stat-item {
          .stat-number {
            font-size: 1.5rem;
          }
        }
      }
    }
  }
`;

const ContentSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  
  .forum-main {
    display: flex;
    gap: 24px;
    
    .forum-content {
      flex: 1;
    }
    
    .forum-sidebar {
      width: 300px;
    }
  }
  
  @media (max-width: 992px) {
    .forum-main {
      flex-direction: column;
      
      .forum-sidebar {
        width: 100%;
      }
    }
  }
`;

const PostCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    
    .post-info {
      flex: 1;
      
      .post-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 8px;
        color: #1890ff;
        cursor: pointer;
        
        &:hover {
          color: #40a9ff;
        }
      }
      
      .post-meta {
        display: flex;
        align-items: center;
        gap: 16px;
        color: #666;
        font-size: 12px;
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
    
    .post-actions {
      display: flex;
      gap: 8px;
    }
  }
  
  .post-content {
    margin-bottom: 12px;
    
    .post-excerpt {
      color: #666;
      line-height: 1.6;
    }
    
    .post-tags {
      margin-top: 8px;
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }
  }
  
  .post-images {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    
    .post-image {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      object-fit: cover;
      cursor: pointer;
    }
  }
  
  .post-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
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
        cursor: pointer;
        
        &:hover {
          color: #1890ff;
        }
        
        &.liked {
          color: #ff4d4f;
        }
      }
    }
    
    .stats-right {
      color: #666;
      font-size: 12px;
    }
  }
`;

const CategoryCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 12px;
  
  .category-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: #f5f5f5;
      border-radius: 8px;
      padding-left: 8px;
    }
    
    .category-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      
      &.general {
        background: #1890ff;
        color: white;
      }
      
      &.technique {
        background: #52c41a;
        color: white;
      }
      
      &.equipment {
        background: #faad14;
        color: white;
      }
      
      &.location {
        background: #722ed1;
        color: white;
      }
      
      &.safety {
        background: #ff4d4f;
        color: white;
      }
      
      &.activity {
        background: #13c2c2;
        color: white;
      }
    }
    
    .category-info {
      flex: 1;
      
      .category-name {
        font-weight: 600;
        margin-bottom: 2px;
      }
      
      .category-desc {
        color: #666;
        font-size: 12px;
      }
    }
    
    .category-count {
      color: #666;
      font-size: 12px;
    }
  }
`;

const UserCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 12px;
  
  .user-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    
    .user-info {
      flex: 1;
      
      .user-name {
        font-weight: 600;
        margin-bottom: 2px;
      }
      
      .user-level {
        color: #666;
        font-size: 12px;
      }
    }
    
    .user-stats {
      text-align: right;
      
      .user-posts {
        font-weight: 600;
        color: #1890ff;
      }
      
      .user-label {
        color: #666;
        font-size: 12px;
      }
    }
  }
`;

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    username: string;
    avatar: string;
    level: string;
  };
  category: string;
  tags: string[];
  images?: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  comments: number;
  isLiked: boolean;
  isPinned: boolean;
  isHot: boolean;
}

const Forum: React.FC = () => {
  const { user } = useAuth();
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [postForm] = Form.useForm();
  
  // 模拟帖子数据
  const mockPosts: Post[] = [
    {
      id: '1',
      title: '苍山攀岩路线推荐 - 适合新手的经典路线',
      content: '最近去苍山攀岩，发现了几条非常适合新手的路线...',
      excerpt: '最近去苍山攀岩，发现了几条非常适合新手的路线，难度适中，风景优美，特别推荐给刚入门的朋友们。',
      author: {
        id: '1',
        username: '攀岩新手',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        level: '初级'
      },
      category: 'location',
      tags: ['苍山', '新手', '路线推荐'],
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      ],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      views: 156,
      likes: 23,
      comments: 8,
      isLiked: false,
      isPinned: true,
      isHot: true
    },
    {
      id: '2',
      title: '攀岩装备选购指南 - 新手必看',
      content: '作为一个攀岩了5年的老手，想分享一些装备选购的经验...',
      excerpt: '作为一个攀岩了5年的老手，想分享一些装备选购的经验，希望能帮助新手朋友们避免踩坑。',
      author: {
        id: '2',
        username: '装备达人',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        level: '高级'
      },
      category: 'equipment',
      tags: ['装备', '选购', '新手指南'],
      createdAt: '2024-01-14T15:20:00Z',
      updatedAt: '2024-01-14T15:20:00Z',
      views: 234,
      likes: 45,
      comments: 12,
      isLiked: true,
      isPinned: false,
      isHot: true
    },
    {
      id: '3',
      title: '攀岩技巧分享 - 如何提高抓握力',
      content: '抓握力是攀岩的基础，今天分享几个训练方法...',
      excerpt: '抓握力是攀岩的基础，今天分享几个训练方法，坚持练习一定会有明显提升。',
      author: {
        id: '3',
        username: '技术流',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        level: '专家'
      },
      category: 'technique',
      tags: ['技巧', '训练', '抓握力'],
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T09:15:00Z',
      views: 189,
      likes: 31,
      comments: 6,
      isLiked: false,
      isPinned: false,
      isHot: false
    },
    {
      id: '4',
      title: '大理攀岩活动召集 - 本周末苍山行',
      content: '计划本周末去苍山攀岩，欢迎有兴趣的朋友一起...',
      excerpt: '计划本周末去苍山攀岩，欢迎有兴趣的朋友一起，有经验的老手带队，新手也可以参加。',
      author: {
        id: '4',
        username: '组织者',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        level: '中级'
      },
      category: 'activity',
      tags: ['活动', '苍山', '周末'],
      createdAt: '2024-01-12T14:45:00Z',
      updatedAt: '2024-01-12T14:45:00Z',
      views: 98,
      likes: 15,
      comments: 4,
      isLiked: false,
      isPinned: false,
      isHot: false
    },
    {
      id: '5',
      title: '攀岩安全事故案例分析',
      content: '最近看到一些攀岩事故的报道，想和大家分析一下原因...',
      excerpt: '最近看到一些攀岩事故的报道，想和大家分析一下原因，提醒大家注意安全。',
      author: {
        id: '5',
        username: '安全专家',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        level: '专家'
      },
      category: 'safety',
      tags: ['安全', '事故分析', '预防'],
      createdAt: '2024-01-11T11:30:00Z',
      updatedAt: '2024-01-11T11:30:00Z',
      views: 267,
      likes: 52,
      comments: 18,
      isLiked: false,
      isPinned: false,
      isHot: true
    }
  ];
  
  // 分类数据
  const categories = [
    {
      key: 'all',
      name: '全部',
      icon: 'general',
      description: '所有帖子',
      count: 156
    },
    {
      key: 'general',
      name: '综合讨论',
      icon: 'general',
      description: '攀岩相关话题',
      count: 45
    },
    {
      key: 'technique',
      name: '技巧分享',
      icon: 'technique',
      description: '攀岩技巧交流',
      count: 32
    },
    {
      key: 'equipment',
      name: '装备讨论',
      icon: 'equipment',
      description: '装备选购使用',
      count: 28
    },
    {
      key: 'location',
      name: '地点推荐',
      icon: 'location',
      description: '攀岩地点分享',
      count: 24
    },
    {
      key: 'safety',
      name: '安全提醒',
      icon: 'safety',
      description: '安全知识分享',
      count: 18
    },
    {
      key: 'activity',
      name: '活动召集',
      icon: 'activity',
      description: '攀岩活动组织',
      count: 9
    }
  ];
  
  // 活跃用户数据
  const activeUsers = [
    {
      id: '1',
      username: '攀岩大师',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      level: '专家',
      posts: 156
    },
    {
      id: '2',
      username: '技术流',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      level: '高级',
      posts: 89
    },
    {
      id: '3',
      username: '装备达人',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      level: '高级',
      posts: 67
    },
    {
      id: '4',
      username: '安全专家',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      level: '专家',
      posts: 45
    }
  ];
  
  useEffect(() => {
    setPosts(mockPosts);
  }, []);
  
  const handleCreatePost = async (values: any) => {
    try {
      setLoading(true);
      console.log('Create post:', values);
      message.success('帖子发布成功！');
      setPostModalVisible(false);
      postForm.resetFields();
    } catch (error) {
      message.error('发布失败，请重试');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLikePost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };
  
  const filteredPosts = posts.filter(post => {
    const matchCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchKeyword = !searchKeyword || 
      post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      post.content.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchTab = activeTab === 'all' || 
      (activeTab === 'hot' && post.isHot) ||
      (activeTab === 'pinned' && post.isPinned);
    return matchCategory && matchKeyword && matchTab;
  });
  
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return b.likes - a.likes;
      case 'views':
        return b.views - a.views;
      case 'comments':
        return b.comments - a.comments;
      default:
        return 0;
    }
  });
  
  const paginatedPosts = sortedPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  const renderPostModal = () => (
    <Modal
      title="发布新帖"
      open={postModalVisible}
      onCancel={() => setPostModalVisible(false)}
      footer={null}
      width={800}
    >
      <Form
        form={postForm}
        layout="vertical"
        onFinish={handleCreatePost}
      >
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入帖子标题' }]}
        >
          <Input placeholder="输入帖子标题" maxLength={100} showCount />
        </Form.Item>
        
        <Form.Item
          name="category"
          label="分类"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select placeholder="选择分类">
            {categories.filter(cat => cat.key !== 'all').map(category => (
              <Option key={category.key} value={category.key}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="tags"
          label="标签"
        >
          <Select
            mode="tags"
            placeholder="添加标签（回车确认）"
            maxTagCount={5}
          />
        </Form.Item>
        
        <Form.Item
          name="content"
          label="内容"
          rules={[{ required: true, message: '请输入帖子内容' }]}
        >
          <TextArea
            rows={12}
            placeholder="分享您的攀岩经验、技巧或问题..."
            maxLength={5000}
            showCount
          />
        </Form.Item>
        
        <Form.Item
          name="images"
          label="图片"
        >
          <Upload
            listType="picture-card"
            multiple
            maxCount={9}
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
            <Button type="primary" htmlType="submit" loading={loading}>
              发布帖子
            </Button>
            <Button onClick={() => setPostModalVisible(false)}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
  
  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      general: <MessageOutlined />,
      technique: <BulbOutlined />,
      equipment: <ToolOutlined />,
      location: <EnvironmentOutlined />,
      safety: <SafetyOutlined />,
      activity: <TeamOutlined />
    };
    return iconMap[category] || <MessageOutlined />;
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
              <Breadcrumb.Item>社区论坛</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* 论坛头部 */}
        <ForumHeader>
          <div className="forum-content">
            <h1 className="forum-title">攀岩社区</h1>
            <p className="forum-subtitle">
              分享攀岩经验，交流技巧心得，结识志同道合的朋友
            </p>
            
            <div className="forum-stats">
              <div className="stat-item">
                <span className="stat-number">1,234</span>
                <span className="stat-label">总帖子数</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">567</span>
                <span className="stat-label">活跃用户</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">89</span>
                <span className="stat-label">今日新帖</span>
              </div>
            </div>
          </div>
        </ForumHeader>

        {/* 内容区域 */}
        <ContentSection>
          <div className="forum-main">
            <div className="forum-content">
              {/* 操作栏 */}
              <Card style={{ marginBottom: 24 }}>
                <Row gutter={16} align="middle">
                  <Col flex="auto">
                    <Space size="middle">
                      <Input.Search
                        placeholder="搜索帖子..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        style={{ width: 300 }}
                        allowClear
                      />
                      <Select
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        style={{ width: 120 }}
                      >
                        {categories.map(category => (
                          <Option key={category.key} value={category.key}>
                            {category.name}
                          </Option>
                        ))}
                      </Select>
                      <Select
                        value={sortBy}
                        onChange={setSortBy}
                        style={{ width: 120 }}
                      >
                        <Option value="latest">最新</Option>
                        <Option value="popular">最热</Option>
                        <Option value="views">浏览量</Option>
                        <Option value="comments">回复数</Option>
                      </Select>
                    </Space>
                  </Col>
                  <Col>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={() => setPostModalVisible(true)}
                      disabled={!user}
                    >
                      发布新帖
                    </Button>
                  </Col>
                </Row>
              </Card>
              
              {/* 帖子标签页 */}
              <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: 24 }}>
                <TabPane tab="全部" key="all" />
                <TabPane 
                  tab={
                    <Badge count={sortedPosts.filter(p => p.isHot).length} size="small">
                      <span>热门</span>
                    </Badge>
                  } 
                  key="hot" 
                />
                <TabPane 
                  tab={
                    <Badge count={sortedPosts.filter(p => p.isPinned).length} size="small">
                      <span>置顶</span>
                    </Badge>
                  } 
                  key="pinned" 
                />
              </Tabs>
              
              {/* 帖子列表 */}
              {paginatedPosts.length === 0 ? (
                <Empty description="暂无帖子" />
              ) : (
                <>
                  {paginatedPosts.map((post) => (
                    <PostCard key={post.id}>
                      <div className="post-header">
                        <div className="post-info">
                          <div className="post-title">
                            {post.isPinned && <Tag color="red" style={{ marginRight: 8 }}>置顶</Tag>}
                            {post.isHot && <Tag color="orange" style={{ marginRight: 8 }}>热门</Tag>}
                            <Link to={`/forum/post/${post.id}`}>{post.title}</Link>
                          </div>
                          <div className="post-meta">
                            <div className="meta-item">
                              <Avatar size={20} src={post.author.avatar} />
                              <span>{post.author.username}</span>
                              <Tag size="small" color="blue">{post.author.level}</Tag>
                            </div>
                            <div className="meta-item">
                              <ClockCircleOutlined />
                              <span>{dayjs(post.createdAt).fromNow()}</span>
                            </div>
                            <div className="meta-item">
                              {getCategoryIcon(post.category)}
                              <span>{categories.find(c => c.key === post.category)?.name}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="post-actions">
                          <Dropdown
                            overlay={
                              <Menu>
                                <Menu.Item key="share" icon={<ShareAltOutlined />}>
                                  分享
                                </Menu.Item>
                                <Menu.Item key="report" icon={<FlagOutlined />}>
                                  举报
                                </Menu.Item>
                                {user?.id === post.author.id && (
                                  <>
                                    <Menu.Item key="edit" icon={<EditOutlined />}>
                                      编辑
                                    </Menu.Item>
                                    <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
                                      删除
                                    </Menu.Item>
                                  </>
                                )}
                              </Menu>
                            }
                            trigger={['click']}
                          >
                            <Button type="text" icon={<MoreOutlined />} />
                          </Dropdown>
                        </div>
                      </div>
                      
                      <div className="post-content">
                        <div className="post-excerpt">
                          {post.excerpt}
                        </div>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="post-tags">
                            {post.tags.map((tag, index) => (
                              <Tag key={index} color="blue">{tag}</Tag>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {post.images && post.images.length > 0 && (
                        <div className="post-images">
                          {post.images.slice(0, 3).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Post image ${index + 1}`}
                              className="post-image"
                            />
                          ))}
                          {post.images.length > 3 && (
                            <div className="post-image" style={{ 
                              background: '#f0f0f0', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              color: '#666'
                            }}>
                              +{post.images.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="post-stats">
                        <div className="stats-left">
                          <div 
                            className={`stat-item ${post.isLiked ? 'liked' : ''}`}
                            onClick={() => handleLikePost(post.id)}
                          >
                            <LikeOutlined />
                            <span>{post.likes}</span>
                          </div>
                          <div className="stat-item">
                            <CommentOutlined />
                            <span>{post.comments}</span>
                          </div>
                          <div className="stat-item">
                            <EyeOutlined />
                            <span>{post.views}</span>
                          </div>
                        </div>
                        
                        <div className="stats-right">
                          最后回复：{dayjs(post.updatedAt).fromNow()}
                        </div>
                      </div>
                    </PostCard>
                  ))}
                  
                  {/* 分页 */}
                  <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={sortedPosts.length}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                      showQuickJumper
                      showTotal={(total, range) => 
                        `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                      }
                    />
                  </div>
                </>
              )}
            </div>
            
            {/* 侧边栏 */}
            <div className="forum-sidebar">
              {/* 分类导航 */}
              <CategoryCard title="版块导航">
                {categories.map((category) => (
                  <div 
                    key={category.key}
                    className="category-item"
                    onClick={() => setSelectedCategory(category.key)}
                  >
                    <div className={`category-icon ${category.icon}`}>
                      {getCategoryIcon(category.key)}
                    </div>
                    <div className="category-info">
                      <div className="category-name">{category.name}</div>
                      <div className="category-desc">{category.description}</div>
                    </div>
                    <div className="category-count">{category.count}</div>
                  </div>
                ))}
              </CategoryCard>
              
              {/* 活跃用户 */}
              <UserCard title="活跃用户">
                {activeUsers.map((user, index) => (
                  <div key={user.id} className="user-item">
                    <Badge count={index + 1} size="small" color="gold">
                      <Avatar src={user.avatar} />
                    </Badge>
                    <div className="user-info">
                      <div className="user-name">{user.username}</div>
                      <div className="user-level">{user.level}</div>
                    </div>
                    <div className="user-stats">
                      <div className="user-posts">{user.posts}</div>
                      <div className="user-label">帖子</div>
                    </div>
                  </div>
                ))}
              </UserCard>
              
              {/* 论坛公告 */}
              <Card title="论坛公告" style={{ marginBottom: 16 }}>
                <Timeline size="small">
                  <Timeline.Item color="red">
                    <Text strong>重要通知</Text>
                    <br />
                    <Text type="secondary">请遵守社区规则，文明发言</Text>
                  </Timeline.Item>
                  <Timeline.Item color="blue">
                    <Text strong>功能更新</Text>
                    <br />
                    <Text type="secondary">新增图片上传功能</Text>
                  </Timeline.Item>
                  <Timeline.Item color="green">
                    <Text strong>活动预告</Text>
                    <br />
                    <Text type="secondary">本月攀岩活动即将开始</Text>
                  </Timeline.Item>
                </Timeline>
              </Card>
              
              {/* 论坛统计 */}
              <Card title="论坛统计">
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic title="今日新帖" value={23} prefix={<FireOutlined />} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="在线用户" value={156} prefix={<UserOutlined />} />
                  </Col>
                </Row>
                <Divider />
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic title="总帖子数" value={1234} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="总用户数" value={567} />
                  </Col>
                </Row>
              </Card>
            </div>
          </div>
        </ContentSection>

        {/* 发帖弹窗 */}
        {renderPostModal()}

        <BackTop />
      </PageContainer>
    </ErrorBoundary>
  );
};

export default Forum;