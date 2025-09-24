import React, { useEffect, useState } from 'react';
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
  Tabs,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  message,
  Divider,
  Statistic,
  Progress,
  Timeline,
  List,
  Badge,
  Modal,
  Rate,
  Image,
  Table,
  Tooltip,
  Switch,
  Slider,
  Radio,
  Checkbox,
  Alert,
  Empty,
  Spin,
  Breadcrumb,
  BackTop
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  CameraOutlined,
  SettingOutlined,
  TrophyOutlined,
  CalendarOutlined,
  HeartOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  StarOutlined,
  FireOutlined,
  SafetyOutlined,
  BookOutlined,
  MessageOutlined,
  BellOutlined,
  EyeOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  GiftOutlined,
  CrownOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { Loading, ErrorBoundary } from '../components';
import { useResponsive, useAuth } from '../hooks';
import { ClimbingRecord, Activity, Route, Location } from '../types';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const PageContainer = styled.div`
  min-height: calc(100vh - 64px);
  background: #f5f5f5;
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  color: white;
  padding: 40px 0;
  
  .profile-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    
    .profile-main {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 32px;
      
      .avatar-section {
        position: relative;
        
        .avatar-upload {
          position: absolute;
          bottom: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          padding: 8px;
          cursor: pointer;
          
          &:hover {
            background: rgba(0, 0, 0, 0.7);
          }
        }
      }
      
      .profile-info {
        flex: 1;
        
        .username {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: white;
        }
        
        .user-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
          
          .meta-item {
            display: flex;
            align-items: center;
            gap: 4px;
            opacity: 0.9;
          }
        }
        
        .user-tags {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .profile-actions {
          display: flex;
          gap: 12px;
        }
      }
    }
    
    .profile-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 24px;
      
      .stat-card {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        backdrop-filter: blur(10px);
        
        .stat-number {
          font-size: 2rem;
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
    padding: 24px 0;
    
    .profile-content {
      .profile-main {
        flex-direction: column;
        text-align: center;
        
        .profile-info {
          .username {
            font-size: 1.5rem;
          }
          
          .user-meta {
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .profile-actions {
            justify-content: center;
            flex-wrap: wrap;
          }
        }
      }
      
      .profile-stats {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        
        .stat-card {
          padding: 16px;
          
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
  
  .profile-tabs {
    background: white;
    border-radius: 12px;
    padding: 24px;
    
    .tab-content {
      margin-top: 24px;
    }
  }
`;

const RecordCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 12px;
  
  .record-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    
    .record-info {
      flex: 1;
      
      .record-title {
        font-weight: 600;
        margin-bottom: 4px;
        color: #1890ff;
      }
      
      .record-meta {
        display: flex;
        gap: 16px;
        color: #666;
        font-size: 14px;
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
    
    .record-actions {
      display: flex;
      gap: 8px;
    }
  }
  
  .record-content {
    margin-bottom: 12px;
  }
  
  .record-images {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    
    .record-image {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      object-fit: cover;
    }
  }
  
  .record-stats {
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
      }
    }
  }
`;

const AchievementCard = styled(Card)`
  text-align: center;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  .achievement-icon {
    font-size: 3rem;
    margin-bottom: 12px;
    
    &.gold {
      color: #faad14;
    }
    
    &.silver {
      color: #8c8c8c;
    }
    
    &.bronze {
      color: #d4b106;
    }
  }
  
  .achievement-title {
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .achievement-desc {
    color: #666;
    font-size: 12px;
  }
`;

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState('records');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editForm] = Form.useForm();
  const [recordForm] = Form.useForm();
  const [settingsForm] = Form.useForm();
  
  // 模拟用户数据
  const mockUser = {
    id: '1',
    username: '攀岩达人',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    email: 'climber@example.com',
    phone: '138****8888',
    location: '云南大理',
    joinDate: '2023-06-15',
    level: '高级',
    bio: '热爱攀岩，享受挑战自我的过程。已攀登过多个经典路线，希望能与更多朋友分享攀岩的乐趣。',
    stats: {
      totalClimbs: 156,
      totalRoutes: 89,
      totalActivities: 23,
      followers: 234,
      following: 156,
      achievements: 12
    }
  };
  
  // 模拟攀岩记录
  const mockRecords: ClimbingRecord[] = [
    {
      id: '1',
      routeId: '1',
      routeName: '苍山飞鹰',
      locationName: '苍山',
      difficulty: '5.10a',
      type: '运动攀',
      date: '2024-01-15',
      duration: 180,
      attempts: 3,
      completed: true,
      rating: 5,
      notes: '非常棒的路线！风景优美，技术性强。',
      images: [
        'https://images.unsplash.com/photo-1551524164-6cf2ac531fb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      ],
      weather: '晴朗',
      partners: ['张三', '李四']
    },
    {
      id: '2',
      routeId: '2',
      routeName: '洱海之光',
      locationName: '洱海',
      difficulty: '5.9',
      type: '传统攀',
      date: '2024-01-10',
      duration: 240,
      attempts: 2,
      completed: true,
      rating: 4,
      notes: '传统攀岩的经典路线，需要良好的保护技巧。',
      images: [],
      weather: '多云',
      partners: ['王五']
    }
  ];
  
  // 模拟成就
  const mockAchievements = [
    {
      id: '1',
      title: '百攀达成',
      description: '完成100次攀岩',
      icon: <TrophyOutlined className="achievement-icon gold" />,
      unlocked: true,
      unlockedDate: '2024-01-01'
    },
    {
      id: '2',
      title: '路线探索者',
      description: '攀登50条不同路线',
      icon: <EnvironmentOutlined className="achievement-icon silver" />,
      unlocked: true,
      unlockedDate: '2023-12-15'
    },
    {
      id: '3',
      title: '社交达人',
      description: '参与20次团体活动',
      icon: <TeamOutlined className="achievement-icon bronze" />,
      unlocked: true,
      unlockedDate: '2023-11-20'
    },
    {
      id: '4',
      title: '攀岩大师',
      description: '完成5.12难度路线',
      icon: <CrownOutlined className="achievement-icon" />,
      unlocked: false
    }
  ];
  
  const handleEditProfile = async (values: any) => {
    try {
      setLoading(true);
      console.log('Update profile:', values);
      message.success('个人资料更新成功！');
      setEditModalVisible(false);
    } catch (error) {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddRecord = async (values: any) => {
    try {
      setLoading(true);
      console.log('Add record:', values);
      message.success('攀岩记录添加成功！');
      setRecordModalVisible(false);
      recordForm.resetFields();
    } catch (error) {
      message.error('添加失败');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateSettings = async (values: any) => {
    try {
      setLoading(true);
      console.log('Update settings:', values);
      message.success('设置更新成功！');
      setSettingsModalVisible(false);
    } catch (error) {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };
  
  const renderEditModal = () => (
    <Modal
      title="编辑个人资料"
      open={editModalVisible}
      onCancel={() => setEditModalVisible(false)}
      footer={null}
      width={600}
    >
      <Form
        form={editForm}
        layout="vertical"
        onFinish={handleEditProfile}
        initialValues={mockUser}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="输入用户名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="level"
              label="攀岩水平"
              rules={[{ required: true, message: '请选择攀岩水平' }]}
            >
              <Select placeholder="选择攀岩水平">
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
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入正确的邮箱格式' }
              ]}
            >
              <Input placeholder="输入邮箱" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="手机号"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
              ]}
            >
              <Input placeholder="输入手机号" />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="location"
          label="所在地"
        >
          <Input placeholder="输入所在地" />
        </Form.Item>
        
        <Form.Item
          name="bio"
          label="个人简介"
        >
          <TextArea
            rows={4}
            placeholder="介绍一下自己..."
            maxLength={200}
            showCount
          />
        </Form.Item>
        
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存
            </Button>
            <Button onClick={() => setEditModalVisible(false)}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
  
  const renderRecordModal = () => (
    <Modal
      title="添加攀岩记录"
      open={recordModalVisible}
      onCancel={() => setRecordModalVisible(false)}
      footer={null}
      width={800}
    >
      <Form
        form={recordForm}
        layout="vertical"
        onFinish={handleAddRecord}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="routeName"
              label="路线名称"
              rules={[{ required: true, message: '请输入路线名称' }]}
            >
              <Input placeholder="输入路线名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="locationName"
              label="攀岩地点"
              rules={[{ required: true, message: '请输入攀岩地点' }]}
            >
              <Input placeholder="输入攀岩地点" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="difficulty"
              label="难度等级"
              rules={[{ required: true, message: '请输入难度等级' }]}
            >
              <Input placeholder="如：5.10a" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="type"
              label="攀岩类型"
              rules={[{ required: true, message: '请选择攀岩类型' }]}
            >
              <Select placeholder="选择攀岩类型">
                <Option value="运动攀">运动攀</Option>
                <Option value="传统攀">传统攀</Option>
                <Option value="抱石">抱石</Option>
                <Option value="人工岩壁">人工岩壁</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="date"
              label="攀岩日期"
              rules={[{ required: true, message: '请选择攀岩日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="duration"
              label="用时 (分钟)"
              rules={[{ required: true, message: '请输入用时' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="attempts"
              label="尝试次数"
              rules={[{ required: true, message: '请输入尝试次数' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="completed"
              label="是否完成"
              rules={[{ required: true, message: '请选择是否完成' }]}
            >
              <Radio.Group>
                <Radio value={true}>完成</Radio>
                <Radio value={false}>未完成</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="rating"
              label="路线评分"
            >
              <Rate allowHalf />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="weather"
              label="天气情况"
            >
              <Select placeholder="选择天气情况">
                <Option value="晴朗">晴朗</Option>
                <Option value="多云">多云</Option>
                <Option value="阴天">阴天</Option>
                <Option value="小雨">小雨</Option>
                <Option value="大风">大风</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="partners"
          label="攀岩伙伴"
        >
          <Input placeholder="输入攀岩伙伴姓名，多个用逗号分隔" />
        </Form.Item>
        
        <Form.Item
          name="notes"
          label="攀岩笔记"
        >
          <TextArea
            rows={4}
            placeholder="记录攀岩过程、感受、技巧等..."
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
            <Button type="primary" htmlType="submit" loading={loading}>
              添加记录
            </Button>
            <Button onClick={() => setRecordModalVisible(false)}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
  
  const renderSettingsModal = () => (
    <Modal
      title="账户设置"
      open={settingsModalVisible}
      onCancel={() => setSettingsModalVisible(false)}
      footer={null}
      width={600}
    >
      <Form
        form={settingsForm}
        layout="vertical"
        onFinish={handleUpdateSettings}
      >
        <Title level={5}>隐私设置</Title>
        <Form.Item
          name="profilePublic"
          label="公开个人资料"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        
        <Form.Item
          name="recordsPublic"
          label="公开攀岩记录"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        
        <Form.Item
          name="allowFollow"
          label="允许他人关注"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        
        <Divider />
        
        <Title level={5}>通知设置</Title>
        <Form.Item
          name="emailNotifications"
          label="邮件通知"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        
        <Form.Item
          name="activityNotifications"
          label="活动通知"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        
        <Form.Item
          name="followNotifications"
          label="关注通知"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        
        <Divider />
        
        <Title level={5}>安全设置</Title>
        <Form.Item>
          <Button type="link" style={{ padding: 0 }}>
            修改密码
          </Button>
        </Form.Item>
        
        <Form.Item>
          <Button type="link" style={{ padding: 0 }}>
            绑定手机号
          </Button>
        </Form.Item>
        
        <Form.Item>
          <Button type="link" style={{ padding: 0 }}>
            绑定邮箱
          </Button>
        </Form.Item>
        
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存设置
            </Button>
            <Button onClick={() => setSettingsModalVisible(false)}>
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
              <Breadcrumb.Item>个人中心</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* 个人资料头部 */}
        <ProfileHeader>
          <div className="profile-content">
            <div className="profile-main">
              <div className="avatar-section">
                <Avatar size={120} src={mockUser.avatar} icon={<UserOutlined />} />
                <div className="avatar-upload">
                  <CameraOutlined style={{ color: 'white' }} />
                </div>
              </div>
              
              <div className="profile-info">
                <h1 className="username">{mockUser.username}</h1>
                <div className="user-meta">
                  <div className="meta-item">
                    <EnvironmentOutlined />
                    <span>{mockUser.location}</span>
                  </div>
                  <div className="meta-item">
                    <CalendarOutlined />
                    <span>加入于 {dayjs(mockUser.joinDate).format('YYYY年MM月')}</span>
                  </div>
                  <div className="meta-item">
                    <TrophyOutlined />
                    <span>{mockUser.level}</span>
                  </div>
                </div>
                
                <div className="user-tags">
                  <Tag color="gold" icon={<CrownOutlined />}>VIP会员</Tag>
                  <Tag color="blue" icon={<StarOutlined />}>活跃用户</Tag>
                  <Tag color="green" icon={<SafetyOutlined />}>安全认证</Tag>
                </div>
                
                <div className="profile-actions">
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />} 
                    onClick={() => setEditModalVisible(true)}
                  >
                    编辑资料
                  </Button>
                  <Button 
                    icon={<SettingOutlined />} 
                    onClick={() => setSettingsModalVisible(true)}
                  >
                    设置
                  </Button>
                  <Button icon={<ShareAltOutlined />}>
                    分享
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="profile-stats">
              <div className="stat-card">
                <span className="stat-number">{mockUser.stats.totalClimbs}</span>
                <span className="stat-label">总攀登次数</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{mockUser.stats.totalRoutes}</span>
                <span className="stat-label">攀登路线</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{mockUser.stats.totalActivities}</span>
                <span className="stat-label">参与活动</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{mockUser.stats.followers}</span>
                <span className="stat-label">粉丝</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{mockUser.stats.following}</span>
                <span className="stat-label">关注</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{mockUser.stats.achievements}</span>
                <span className="stat-label">成就</span>
              </div>
            </div>
          </div>
        </ProfileHeader>

        {/* 内容区域 */}
        <ContentSection>
          <div className="profile-tabs">
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="攀岩记录" key="records">
                <div className="tab-content">
                  <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={4} style={{ margin: 0 }}>我的攀岩记录</Title>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={() => setRecordModalVisible(true)}
                    >
                      添加记录
                    </Button>
                  </div>
                  
                  {mockRecords.length === 0 ? (
                    <Empty description="暂无攀岩记录" />
                  ) : (
                    mockRecords.map((record) => (
                      <RecordCard key={record.id} size="small">
                        <div className="record-header">
                          <div className="record-info">
                            <div className="record-title">{record.routeName}</div>
                            <div className="record-meta">
                              <div className="meta-item">
                                <EnvironmentOutlined />
                                <span>{record.locationName}</span>
                              </div>
                              <div className="meta-item">
                                <CalendarOutlined />
                                <span>{dayjs(record.date).format('YYYY-MM-DD')}</span>
                              </div>
                              <div className="meta-item">
                                <ClockCircleOutlined />
                                <span>{Math.floor(record.duration / 60)}h {record.duration % 60}m</span>
                              </div>
                              <div className="meta-item">
                                <Tag color={record.completed ? 'green' : 'orange'}>
                                  {record.completed ? '已完成' : '未完成'}
                                </Tag>
                              </div>
                            </div>
                          </div>
                          <div className="record-actions">
                            <Tooltip title="编辑">
                              <Button type="text" size="small" icon={<EditOutlined />} />
                            </Tooltip>
                            <Tooltip title="删除">
                              <Button type="text" size="small" icon={<DeleteOutlined />} danger />
                            </Tooltip>
                          </div>
                        </div>
                        
                        <div className="record-content">
                          <div style={{ marginBottom: 8 }}>
                            <Tag color="blue">{record.type}</Tag>
                            <Tag color="orange">{record.difficulty}</Tag>
                            <Tag>{record.weather}</Tag>
                          </div>
                          
                          {record.notes && (
                            <Paragraph ellipsis={{ rows: 2, expandable: true }}>
                              {record.notes}
                            </Paragraph>
                          )}
                        </div>
                        
                        {record.images && record.images.length > 0 && (
                          <div className="record-images">
                            {record.images.map((image, index) => (
                              <Image
                                key={index}
                                src={image}
                                className="record-image"
                                preview={{ mask: <EyeOutlined /> }}
                              />
                            ))}
                          </div>
                        )}
                        
                        <div className="record-stats">
                          <div className="stats-left">
                            <div className="stat-item">
                              <ThunderboltOutlined />
                              <span>{record.attempts} 次尝试</span>
                            </div>
                            {record.partners && record.partners.length > 0 && (
                              <div className="stat-item">
                                <TeamOutlined />
                                <span>与 {record.partners.join(', ')} 同行</span>
                              </div>
                            )}
                            {record.rating && (
                              <div className="stat-item">
                                <Rate disabled value={record.rating} size="small" />
                              </div>
                            )}
                          </div>
                        </div>
                      </RecordCard>
                    ))
                  )}
                </div>
              </TabPane>
              
              <TabPane tab="成就徽章" key="achievements">
                <div className="tab-content">
                  <Title level={4}>我的成就</Title>
                  <Paragraph type="secondary">
                    通过攀岩活动获得各种成就徽章，展示您的攀岩历程和技能水平。
                  </Paragraph>
                  
                  <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                    {mockAchievements.map((achievement) => (
                      <Col xs={12} sm={8} md={6} key={achievement.id}>
                        <AchievementCard
                          hoverable={achievement.unlocked}
                          style={{ 
                            opacity: achievement.unlocked ? 1 : 0.5,
                            border: achievement.unlocked ? '2px solid #52c41a' : '1px solid #d9d9d9'
                          }}
                        >
                          {achievement.icon}
                          <div className="achievement-title">{achievement.title}</div>
                          <div className="achievement-desc">{achievement.description}</div>
                          {achievement.unlocked && achievement.unlockedDate && (
                            <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>
                              {dayjs(achievement.unlockedDate).format('YYYY-MM-DD')} 获得
                            </div>
                          )}
                          {!achievement.unlocked && (
                            <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
                              未解锁
                            </div>
                          )}
                        </AchievementCard>
                      </Col>
                    ))}
                  </Row>
                </div>
              </TabPane>
              
              <TabPane tab="收藏" key="favorites">
                <div className="tab-content">
                  <Title level={4}>我的收藏</Title>
                  
                  <Tabs defaultActiveKey="routes">
                    <TabPane tab="路线" key="routes">
                      <Empty description="暂无收藏的路线" />
                    </TabPane>
                    <TabPane tab="地点" key="locations">
                      <Empty description="暂无收藏的地点" />
                    </TabPane>
                    <TabPane tab="活动" key="activities">
                      <Empty description="暂无收藏的活动" />
                    </TabPane>
                  </Tabs>
                </div>
              </TabPane>
              
              <TabPane tab="关注" key="following">
                <div className="tab-content">
                  <Title level={4}>我的关注</Title>
                  
                  <Tabs defaultActiveKey="users">
                    <TabPane tab="用户" key="users">
                      <Empty description="暂无关注的用户" />
                    </TabPane>
                    <TabPane tab="粉丝" key="followers">
                      <Empty description="暂无粉丝" />
                    </TabPane>
                  </Tabs>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </ContentSection>

        {/* 编辑资料弹窗 */}
        {renderEditModal()}

        {/* 添加记录弹窗 */}
        {renderRecordModal()}

        {/* 设置弹窗 */}
        {renderSettingsModal()}

        <BackTop />
      </PageContainer>
    </ErrorBoundary>
  );
};

export default Profile;