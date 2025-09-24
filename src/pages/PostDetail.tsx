import React, { useState, useEffect } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Typography,
  Space,
  Avatar,
  Tag,
  Divider,
  Form,
  Input,
  Rate,
  Modal,
  message,
  Alert,
  Dropdown,
  Menu,
  Tooltip,
  Image,
  BackTop,
  Breadcrumb,
  Affix,
  List,
  Pagination,
  Empty,
  Badge,
  Progress,
  Statistic,
  Timeline
} from 'antd';
import {
  LikeOutlined,
  DislikeOutlined,
  ShareAltOutlined,
  EyeOutlined,
  CommentOutlined,
  HeartOutlined,
  FlagOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  SendOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  TagOutlined,
  StarOutlined,
  MessageOutlined,
  BulbOutlined,
  SafetyOutlined,
  TeamOutlined,
  FireOutlined,
  TrophyOutlined,
  CrownOutlined,
  ThunderboltOutlined,
  BookOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useResponsive, useAuth } from '../hooks';
import { Loading, ErrorBoundary } from '../components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const PageContainer = styled.div`
  min-height: calc(100vh - 64px);
  background: #f5f5f5;
`;

const PostContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  
  .post-main {
    display: flex;
    gap: 24px;
    
    .post-content {
      flex: 1;
    }
    
    .post-sidebar {
      width: 300px;
    }
  }
  
  @media (max-width: 992px) {
    .post-main {
      flex-direction: column;
      
      .post-sidebar {
        width: 100%;
      }
    }
  }
`;

const PostCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 12px;
  
  .post-header {
    .post-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
      line-height: 1.4;
    }
    
    .post-meta {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 16px;
      
      .meta-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #666;
        
        .author-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      }
    }
    
    .post-tags {
      margin-bottom: 16px;
      
      .ant-tag {
        margin-bottom: 8px;
      }
    }
    
    .post-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-top: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
      
      .actions-left {
        display: flex;
        gap: 16px;
        
        .action-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &:hover {
            background: #f5f5f5;
          }
          
          &.liked {
            color: #ff4d4f;
            background: #fff2f0;
          }
          
          &.favorited {
            color: #faad14;
            background: #fffbe6;
          }
        }
      }
      
      .actions-right {
        display: flex;
        gap: 8px;
      }
    }
  }
  
  .post-body {
    .post-content {
      font-size: 16px;
      line-height: 1.8;
      color: #333;
      margin-bottom: 24px;
      
      p {
        margin-bottom: 16px;
      }
      
      img {
        max-width: 100%;
        border-radius: 8px;
        margin: 16px 0;
      }
    }
    
    .post-images {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
      
      .post-image {
        border-radius: 8px;
        overflow: hidden;
        aspect-ratio: 4/3;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
`;

const CommentSection = styled.div`
  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    .comment-title {
      font-size: 18px;
      font-weight: 600;
    }
    
    .comment-sort {
      display: flex;
      gap: 8px;
    }
  }
  
  .comment-form {
    margin-bottom: 32px;
    
    .comment-input {
      margin-bottom: 12px;
    }
    
    .comment-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .comment-tools {
        display: flex;
        gap: 8px;
      }
    }
  }
  
  .comment-list {
    .ant-comment {
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 16px;
      margin-bottom: 16px;
      
      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      
      .comment-actions {
        display: flex;
        gap: 16px;
        
        .action-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #666;
          cursor: pointer;
          transition: color 0.3s ease;
          
          &:hover {
            color: #1890ff;
          }
          
          &.liked {
            color: #ff4d4f;
          }
        }
      }
    }
  }
`;

const SidebarCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 12px;
  
  .sidebar-item {
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
    
    .item-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f0f0;
      color: #666;
    }
    
    .item-info {
      flex: 1;
      
      .item-title {
        font-weight: 600;
        margin-bottom: 2px;
      }
      
      .item-desc {
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
  author: {
    id: string;
    username: string;
    avatar: string;
    level: string;
    reputation: number;
  };
  category: string;
  tags: string[];
  images?: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  dislikes: number;
  comments: number;
  favorites: number;
  isLiked: boolean;
  isDisliked: boolean;
  isFavorited: boolean;
  isPinned: boolean;
  isHot: boolean;
}

interface CommentItem {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar: string;
    level: string;
  };
  createdAt: string;
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
  replies?: CommentItem[];
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isMobile } = useResponsive();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentSort, setCommentSort] = useState('latest');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // 模拟帖子数据
  const mockPost: Post = {
    id: '1',
    title: '苍山攀岩路线推荐 - 适合新手的经典路线详细攻略',
    content: `最近去苍山攀岩，发现了几条非常适合新手的路线，想和大家分享一下经验。

## 路线介绍

### 1. 初学者天堂 (5.6)
这条路线位于苍山西坡，是我见过最适合新手的路线之一。路线长度约30米，坡度适中，手点脚点都很明显。

**特点：**
- 难度适中，技术要求不高
- 保护点充足，安全性好
- 风景优美，可以俯瞰洱海

### 2. 云海之路 (5.7)
稍微有一定挑战性的路线，适合有一定基础的攀岩者。

**注意事项：**
- 中段有一个小难点，需要注意脚法
- 建议带足够的快挂
- 最好有经验丰富的攀岩者带领

## 装备建议

1. **安全装备**：头盔、安全带、攀岩鞋
2. **保护装备**：动力绳、快挂、保护器
3. **其他装备**：粉袋、手套、急救包

## 最佳攀岩时间

- **春季（3-5月）**：天气温和，是攀岩的黄金季节
- **秋季（9-11月）**：气候宜人，风景最美
- **避免夏季**：温度过高，不适合户外攀岩

希望这些信息对大家有帮助，欢迎有经验的朋友补充！`,
    author: {
      id: '1',
      username: '攀岩新手',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      level: '初级',
      reputation: 156
    },
    category: 'location',
    tags: ['苍山', '新手', '路线推荐', '攀岩攻略'],
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    views: 1256,
    likes: 89,
    dislikes: 3,
    comments: 23,
    favorites: 45,
    isLiked: false,
    isDisliked: false,
    isFavorited: false,
    isPinned: true,
    isHot: true
  };
  
  // 模拟评论数据
  const mockComments: CommentItem[] = [
    {
      id: '1',
      content: '非常详细的攻略！作为新手，这些信息对我很有帮助。请问楼主，苍山的交通方便吗？',
      author: {
        id: '2',
        username: '攀岩小白',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        level: '新手'
      },
      createdAt: '2024-01-15T11:30:00Z',
      likes: 12,
      dislikes: 0,
      isLiked: false,
      isDisliked: false,
      replies: [
        {
          id: '1-1',
          content: '交通还是比较方便的，可以坐公交到苍山脚下，然后步行约20分钟就能到达攀岩点。',
          author: {
            id: '1',
            username: '攀岩新手',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
            level: '初级'
          },
          createdAt: '2024-01-15T12:00:00Z',
          likes: 5,
          dislikes: 0,
          isLiked: false,
          isDisliked: false
        }
      ]
    },
    {
      id: '2',
      content: '楼主推荐的路线我都爬过，确实很适合新手。特别是初学者天堂这条线，我第一次去就成功完成了！',
      author: {
        id: '3',
        username: '技术流',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        level: '高级'
      },
      createdAt: '2024-01-15T14:20:00Z',
      likes: 8,
      dislikes: 0,
      isLiked: true,
      isDisliked: false
    },
    {
      id: '3',
      content: '感谢分享！想问一下，这些路线需要提前预约吗？还有就是装备可以在当地租赁吗？',
      author: {
        id: '4',
        username: '装备达人',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        level: '中级'
      },
      createdAt: '2024-01-15T16:45:00Z',
      likes: 3,
      dislikes: 0,
      isLiked: false,
      isDisliked: false
    }
  ];
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPost(mockPost);
        setComments(mockComments);
      } catch (error) {
        message.error('加载帖子失败');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPost();
    }
  }, [id]);
  
  const handleLike = () => {
    if (!post) return;
    
    setPost({
      ...post,
      isLiked: !post.isLiked,
      isDisliked: false,
      likes: post.isLiked ? post.likes - 1 : post.likes + 1,
      dislikes: post.isDisliked ? post.dislikes - 1 : post.dislikes
    });
  };
  
  const handleDislike = () => {
    if (!post) return;
    
    setPost({
      ...post,
      isDisliked: !post.isDisliked,
      isLiked: false,
      dislikes: post.isDisliked ? post.dislikes - 1 : post.dislikes + 1,
      likes: post.isLiked ? post.likes - 1 : post.likes
    });
  };
  
  const handleFavorite = () => {
    if (!post) return;
    
    setPost({
      ...post,
      isFavorited: !post.isFavorited,
      favorites: post.isFavorited ? post.favorites - 1 : post.favorites + 1
    });
    
    message.success(post.isFavorited ? '已取消收藏' : '已收藏');
  };
  
  const handleComment = async () => {
    if (!commentText.trim()) {
      message.warning('请输入评论内容');
      return;
    }
    
    try {
      setCommentLoading(true);
      
      const newComment: CommentItem = {
        id: Date.now().toString(),
        content: commentText,
        author: {
          id: user?.id || '0',
          username: user?.username || '匿名用户',
          avatar: user?.avatar || '',
          level: user?.level || '新手'
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        isLiked: false,
        isDisliked: false
      };
      
      setComments([newComment, ...comments]);
      setCommentText('');
      message.success('评论发布成功');
      
      if (post) {
        setPost({ ...post, comments: post.comments + 1 });
      }
    } catch (error) {
      message.error('评论发布失败');
    } finally {
      setCommentLoading(false);
    }
  };
  
  const handleCommentLike = (commentId: string) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
            }
          : comment
      )
    );
  };
  
  const handleShare = () => {
    setShareModalVisible(true);
  };
  
  const handleReport = () => {
    setReportModalVisible(true);
  };
  
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
  
  const getCategoryName = (category: string) => {
    const nameMap: { [key: string]: string } = {
      general: '综合讨论',
      technique: '技巧分享',
      equipment: '装备讨论',
      location: '地点推荐',
      safety: '安全提醒',
      activity: '活动召集'
    };
    return nameMap[category] || '综合讨论';
  };
  
  const sortedComments = [...comments].sort((a, b) => {
    switch (commentSort) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'likes':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });
  
  const paginatedComments = sortedComments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  if (loading) {
    return <Loading />;
  }
  
  if (!post) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Empty description="帖子不存在" />
          <Button type="primary" onClick={() => navigate('/forum')}>
            返回论坛
          </Button>
        </div>
      </PageContainer>
    );
  }
  
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
                <Link to="/forum">社区论坛</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to={`/forum?category=${post.category}`}>
                  {getCategoryName(post.category)}
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{post.title}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <PostContainer>
          <div className="post-main">
            <div className="post-content">
              {/* 帖子内容 */}
              <PostCard>
                <div className="post-header">
                  <div className="post-title">
                    {post.isPinned && <Tag color="red" style={{ marginRight: 8 }}>置顶</Tag>}
                    {post.isHot && <Tag color="orange" style={{ marginRight: 8 }}>热门</Tag>}
                    {post.title}
                  </div>
                  
                  <div className="post-meta">
                    <div className="meta-item">
                      <div className="author-info">
                        <Avatar src={post.author.avatar} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{post.author.username}</div>
                          <div style={{ fontSize: 12, color: '#666' }}>
                            <Tag size="small" color="blue">{post.author.level}</Tag>
                            声望: {post.author.reputation}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="meta-item">
                      <ClockCircleOutlined />
                      <span>发布于 {dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                    </div>
                    
                    <div className="meta-item">
                      {getCategoryIcon(post.category)}
                      <span>{getCategoryName(post.category)}</span>
                    </div>
                    
                    <div className="meta-item">
                      <EyeOutlined />
                      <span>{post.views} 浏览</span>
                    </div>
                  </div>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="post-tags">
                      {post.tags.map((tag, index) => (
                        <Tag key={index} color="blue">{tag}</Tag>
                      ))}
                    </div>
                  )}
                  
                  <div className="post-actions">
                    <div className="actions-left">
                      <div 
                        className={`action-btn ${post.isLiked ? 'liked' : ''}`}
                        onClick={handleLike}
                      >
                        <LikeOutlined />
                        <span>{post.likes}</span>
                      </div>
                      
                      <div 
                        className="action-btn"
                        onClick={handleDislike}
                      >
                        <DislikeOutlined />
                        <span>{post.dislikes}</span>
                      </div>
                      
                      <div 
                        className={`action-btn ${post.isFavorited ? 'favorited' : ''}`}
                        onClick={handleFavorite}
                      >
                        <HeartOutlined />
                        <span>{post.favorites}</span>
                      </div>
                      
                      <div className="action-btn" onClick={handleShare}>
                        <ShareAltOutlined />
                        <span>分享</span>
                      </div>
                    </div>
                    
                    <div className="actions-right">
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item key="report" icon={<FlagOutlined />} onClick={handleReport}>
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
                </div>
                
                <div className="post-body">
                  <div className="post-content">
                    {post.content.split('\n').map((paragraph, index) => {
                      if (paragraph.startsWith('## ')) {
                        return <h2 key={index}>{paragraph.substring(3)}</h2>;
                      } else if (paragraph.startsWith('### ')) {
                        return <h3 key={index}>{paragraph.substring(4)}</h3>;
                      } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return <p key={index}><strong>{paragraph.slice(2, -2)}</strong></p>;
                      } else if (paragraph.trim()) {
                        return <p key={index}>{paragraph}</p>;
                      }
                      return <br key={index} />;
                    })}
                  </div>
                  
                  {post.images && post.images.length > 0 && (
                    <div className="post-images">
                      {post.images.map((image, index) => (
                        <div key={index} className="post-image">
                          <Image src={image} alt={`Post image ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </PostCard>
              
              {/* 评论区 */}
              <Card>
                <CommentSection>
                  <div className="comment-header">
                    <div className="comment-title">
                      评论 ({comments.length})
                    </div>
                    
                    <div className="comment-sort">
                      <Button.Group>
                        <Button 
                          type={commentSort === 'latest' ? 'primary' : 'default'}
                          size="small"
                          onClick={() => setCommentSort('latest')}
                        >
                          最新
                        </Button>
                        <Button 
                          type={commentSort === 'oldest' ? 'primary' : 'default'}
                          size="small"
                          onClick={() => setCommentSort('oldest')}
                        >
                          最早
                        </Button>
                        <Button 
                          type={commentSort === 'likes' ? 'primary' : 'default'}
                          size="small"
                          onClick={() => setCommentSort('likes')}
                        >
                          最赞
                        </Button>
                      </Button.Group>
                    </div>
                  </div>
                  
                  {/* 评论表单 */}
                  {user ? (
                    <div className="comment-form">
                      <TextArea
                        className="comment-input"
                        rows={4}
                        placeholder="写下您的评论..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        maxLength={1000}
                        showCount
                      />
                      
                      <div className="comment-actions">
                        <div className="comment-tools">
                          <Tooltip title="插入图片">
                            <Button type="text" icon={<PictureOutlined />} />
                          </Tooltip>
                          <Tooltip title="插入链接">
                            <Button type="text" icon={<LinkOutlined />} />
                          </Tooltip>
                        </div>
                        
                        <Space>
                          <Button onClick={() => setCommentText('')}>
                            取消
                          </Button>
                          <Button 
                            type="primary" 
                            icon={<SendOutlined />}
                            loading={commentLoading}
                            onClick={handleComment}
                          >
                            发布评论
                          </Button>
                        </Space>
                      </div>
                    </div>
                  ) : (
                    <Alert
                      message="请登录后发表评论"
                      type="info"
                      action={
                        <Button size="small" type="primary" onClick={() => navigate('/login')}>
                          立即登录
                        </Button>
                      }
                      style={{ marginBottom: 24 }}
                    />
                  )}
                  
                  {/* 评论列表 */}
                  <div className="comment-list">
                    {paginatedComments.length === 0 ? (
                      <Empty description="暂无评论" />
                    ) : (
                      paginatedComments.map((comment) => (
                        <List.Item
                          key={comment.id}
                          actions={[
                            <div key="actions" className="comment-actions">
                              <div 
                                className={`action-btn ${comment.isLiked ? 'liked' : ''}`}
                                onClick={() => handleCommentLike(comment.id)}
                              >
                                <LikeOutlined />
                                <span>{comment.likes}</span>
                              </div>
                              <div className="action-btn">
                                <DislikeOutlined />
                                <span>{comment.dislikes}</span>
                              </div>
                              <div 
                                className="action-btn"
                                onClick={() => setReplyingTo(comment.id)}
                              >
                                <CommentOutlined />
                                <span>回复</span>
                              </div>
                            </div>
                          ]}
                        >
                          <List.Item.Meta
                            avatar={<Avatar src={comment.author.avatar} />}
                            title={comment.author.username}
                            description={
                              <>
                                <p>{comment.content}</p>
                                <Tooltip title={dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                                  <span style={{ color: '#999', fontSize: '12px' }}>{dayjs(comment.createdAt).fromNow()}</span>
                                </Tooltip>
                              </>
                            }
                          />
                          {comment.replies && comment.replies.map((reply) => (
                            <div key={reply.id} style={{ marginLeft: '48px', marginTop: '16px' }}>
                              <List.Item
                                actions={[
                                  <div key="actions" className="comment-actions">
                                    <div className="action-btn">
                                      <LikeOutlined />
                                      <span>{reply.likes}</span>
                                    </div>
                                    <div className="action-btn">
                                      <DislikeOutlined />
                                      <span>{reply.dislikes}</span>
                                    </div>
                                  </div>
                                ]}
                              >
                                <List.Item.Meta
                                  avatar={<Avatar src={reply.author.avatar} />}
                                  title={reply.author.username}
                                  description={
                                    <>
                                      <p>{reply.content}</p>
                                      <Tooltip title={dayjs(reply.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                                        <span style={{ color: '#999', fontSize: '12px' }}>{dayjs(reply.createdAt).fromNow()}</span>
                                      </Tooltip>
                                    </>
                                  }
                                />
                              </List.Item>
                            </div>
                          ))}
                        </List.Item>
                      ))
                    )}
                    
                    {/* 分页 */}
                    {sortedComments.length > pageSize && (
                      <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <Pagination
                          current={currentPage}
                          pageSize={pageSize}
                          total={sortedComments.length}
                          onChange={setCurrentPage}
                          showSizeChanger={false}
                          showQuickJumper
                          showTotal={(total, range) => 
                            `第 ${range[0]}-${range[1]} 条，共 ${total} 条评论`
                          }
                        />
                      </div>
                    )}
                  </div>
                </CommentSection>
              </Card>
            </div>
            
            {/* 侧边栏 */}
            <div className="post-sidebar">
              {/* 作者信息 */}
              <SidebarCard title="作者信息">
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <Avatar size={64} src={post.author.avatar} />
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>
                      {post.author.username}
                    </div>
                    <Tag color="blue" style={{ marginTop: 4 }}>
                      {post.author.level}
                    </Tag>
                  </div>
                  
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={12}>
                      <Statistic title="声望" value={post.author.reputation} />
                    </Col>
                    <Col span={12}>
                      <Statistic title="帖子" value={156} />
                    </Col>
                  </Row>
                  
                  <Button type="primary" style={{ marginTop: 16 }} block>
                    关注作者
                  </Button>
                </div>
              </SidebarCard>
              
              {/* 相关推荐 */}
              <SidebarCard title="相关推荐">
                <List
                  size="small"
                  dataSource={[
                    {
                      title: '洱海攀岩指南 - 水上攀岩新体验',
                      views: 234,
                      comments: 12
                    },
                    {
                      title: '攀岩装备选购完全指南',
                      views: 456,
                      comments: 23
                    },
                    {
                      title: '大理攀岩活动召集',
                      views: 123,
                      comments: 8
                    }
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <div style={{ width: '100%' }}>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>
                          {item.title}
                        </div>
                        <div style={{ color: '#666', fontSize: 12 }}>
                          {item.views} 浏览 · {item.comments} 评论
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </SidebarCard>
              
              {/* 帖子统计 */}
              <SidebarCard title="帖子统计">
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic title="浏览" value={post.views} prefix={<EyeOutlined />} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="点赞" value={post.likes} prefix={<LikeOutlined />} />
                  </Col>
                </Row>
                <Divider />
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic title="评论" value={post.comments} prefix={<CommentOutlined />} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="收藏" value={post.favorites} prefix={<HeartOutlined />} />
                  </Col>
                </Row>
              </SidebarCard>
            </div>
          </div>
        </PostContainer>

        {/* 分享弹窗 */}
        <Modal
          title="分享帖子"
          open={shareModalVisible}
          onCancel={() => setShareModalVisible(false)}
          footer={null}
        >
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Space size="large">
              <Button type="primary" icon={<LinkOutlined />}>
                复制链接
              </Button>
              <Button icon={<MessageOutlined />}>
                微信分享
              </Button>
              <Button icon={<ShareAltOutlined />}>
                QQ分享
              </Button>
            </Space>
          </div>
        </Modal>

        {/* 举报弹窗 */}
        <Modal
          title="举报帖子"
          open={reportModalVisible}
          onCancel={() => setReportModalVisible(false)}
          onOk={() => {
            message.success('举报已提交');
            setReportModalVisible(false);
          }}
        >
          <Form layout="vertical">
            <Form.Item label="举报原因" required>
              <Select placeholder="请选择举报原因">
                <Select.Option value="spam">垃圾信息</Select.Option>
                <Select.Option value="inappropriate">内容不当</Select.Option>
                <Select.Option value="harassment">骚扰他人</Select.Option>
                <Select.Option value="copyright">版权问题</Select.Option>
                <Select.Option value="other">其他</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="详细说明">
              <TextArea rows={4} placeholder="请详细说明举报原因..." />
            </Form.Item>
          </Form>
        </Modal>

        <BackTop />
      </PageContainer>
    </ErrorBoundary>
  );
};

export default PostDetail;