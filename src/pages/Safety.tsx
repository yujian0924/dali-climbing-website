import React, { useState } from 'react';
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
  Collapse,
  Alert,
  Steps,
  Timeline,
  Image,
  Divider,
  Anchor,
  BackTop,
  Breadcrumb,
  Modal,
  Form,
  Input,
  Select,
  Rate,
  message,
  Tooltip,
  Progress,
  Statistic,
  Badge,
  Empty
} from 'antd';
import {
  SafetyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BookOutlined,
  VideoCameraOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  HeartOutlined,
  StarOutlined,
  EyeOutlined,
  CommentOutlined,
  LikeOutlined,
  DislikeOutlined,
  FlagOutlined,
  BulbOutlined,
  ThunderboltOutlined,
  FireOutlined,
  SafetyOutlined,
  ToolOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  GlobalOutlined,
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useResponsive } from '../hooks';
import { Loading, ErrorBoundary } from '../components';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

const PageContainer = styled.div`
  min-height: calc(100vh - 64px);
  background: #f5f5f5;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  padding: 80px 0;
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
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 48px;
      margin-top: 48px;
      
      .stat-item {
        text-align: center;
        
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
    padding: 48px 0;
    
    .hero-content {
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-subtitle {
        font-size: 1rem;
      }
      
      .hero-stats {
        flex-direction: column;
        gap: 24px;
        
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
  padding: 48px 24px;
`;

const SafetyCard = styled(Card)`
  border-radius: 12px;
  margin-bottom: 24px;
  
  .safety-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    
    .safety-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      
      &.danger {
        background: #ff4d4f;
        color: white;
      }
      
      &.warning {
        background: #faad14;
        color: white;
      }
      
      &.info {
        background: #1890ff;
        color: white;
      }
      
      &.success {
        background: #52c41a;
        color: white;
      }
    }
    
    .safety-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }
  }
  
  .safety-content {
    .safety-list {
      margin: 0;
      padding-left: 20px;
      
      li {
        margin-bottom: 8px;
        line-height: 1.6;
      }
    }
  }
`;

const EquipmentCard = styled(Card)`
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  .equipment-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 16px;
  }
  
  .equipment-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    
    .equipment-title {
      font-weight: 600;
      margin: 0;
    }
    
    .equipment-rating {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #faad14;
    }
  }
  
  .equipment-meta {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }
  
  .equipment-desc {
    color: #666;
    margin-bottom: 16px;
    line-height: 1.6;
  }
  
  .equipment-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .equipment-price {
      font-size: 18px;
      font-weight: 600;
      color: #ff4d4f;
    }
  }
`;

const EmergencyCard = styled(Card)`
  border: 2px solid #ff4d4f;
  border-radius: 12px;
  background: #fff2f0;
  
  .emergency-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    
    .emergency-icon {
      width: 48px;
      height: 48px;
      background: #ff4d4f;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    
    .emergency-title {
      font-size: 20px;
      font-weight: 700;
      color: #ff4d4f;
      margin: 0;
    }
  }
  
  .emergency-contacts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    
    .contact-item {
      background: white;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #ffccc7;
      
      .contact-name {
        font-weight: 600;
        margin-bottom: 8px;
      }
      
      .contact-phone {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #ff4d4f;
        font-weight: 600;
        font-size: 16px;
      }
      
      .contact-desc {
        color: #666;
        font-size: 12px;
        margin-top: 4px;
      }
    }
  }
`;

const Safety: React.FC = () => {
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState('knowledge');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackForm] = Form.useForm();
  
  // 模拟安全知识数据
  const safetyKnowledge = [
    {
      id: '1',
      category: 'basic',
      title: '攀岩基础安全知识',
      icon: <SafetyOutlined />,
      type: 'success',
      content: [
        '始终佩戴合格的安全头盔',
        '检查所有装备的完整性和有效期',
        '确保绳索系统正确连接',
        '与攀岩伙伴保持有效沟通',
        '了解攀岩路线的难度和风险',
        '在恶劣天气条件下避免攀岩'
      ]
    },
    {
      id: '2',
      category: 'equipment',
      title: '装备使用注意事项',
      icon: <ToolOutlined />,
      type: 'info',
      content: [
        '定期检查绳索是否有磨损或损坏',
        '确保安全带正确穿戴和调节',
        '检查快挂和保护器的工作状态',
        '使用前测试所有金属装备的强度',
        '保持装备清洁和干燥',
        '及时更换过期或损坏的装备'
      ]
    },
    {
      id: '3',
      category: 'emergency',
      title: '紧急情况处理',
      icon: <ExclamationCircleOutlined />,
      type: 'danger',
      content: [
        '立即停止攀岩活动',
        '评估伤情严重程度',
        '拨打紧急救援电话',
        '保持伤者温暖和稳定',
        '记录事故发生的详细情况',
        '等待专业救援人员到达'
      ]
    },
    {
      id: '4',
      category: 'weather',
      title: '天气安全指南',
      icon: <ThunderboltOutlined />,
      type: 'warning',
      content: [
        '雷雨天气严禁攀岩',
        '大风天气增加攀岩难度和风险',
        '雨后岩石湿滑，需等待干燥',
        '高温天气注意防暑降温',
        '低温环境下保持身体温暖',
        '关注天气预报，提前做好准备'
      ]
    }
  ];
  
  // 模拟装备数据
  const equipmentData = [
    {
      id: '1',
      name: '动力绳',
      category: 'rope',
      image: 'https://images.unsplash.com/photo-1551524164-6cf2ac531fb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      price: '¥580-1200',
      description: '攀岩专用动力绳，具有良好的延展性和抗冲击能力，是攀岩安全的重要保障。',
      features: ['直径9.5-11mm', '长度50-80m', 'UIAA认证', '抗冲击性强'],
      usage: '适用于运动攀、传统攀等各种攀岩形式'
    },
    {
      id: '2',
      name: '安全头盔',
      category: 'helmet',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      price: '¥280-680',
      description: '轻量化攀岩头盔，提供全方位头部保护，透气性好，佩戴舒适。',
      features: ['重量轻', '透气性好', 'CE认证', '可调节尺寸'],
      usage: '所有攀岩活动必备，特别是传统攀和多段攀'
    },
    {
      id: '3',
      name: '安全带',
      category: 'harness',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      price: '¥380-880',
      description: '专业攀岩安全带，腰带和腿环可调节，装备环分布合理，穿戴舒适。',
      features: ['可调节腰带', '舒适腿环', '多个装备环', '快速扣设计'],
      usage: '所有绳索攀岩活动必备装备'
    },
    {
      id: '4',
      name: '保护器',
      category: 'belay',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.6,
      price: '¥180-450',
      description: '多功能保护器，适用于保护和下降，操作简单，制动力强。',
      features: ['多功能设计', '制动力强', '操作简单', '适配多种绳径'],
      usage: '用于保护攀岩者和控制下降速度'
    },
    {
      id: '5',
      name: '快挂',
      category: 'quickdraw',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.5,
      price: '¥80-180',
      description: '轻量化快挂，连接保护点和绳索，减少绳索阻力，提高攀岩效率。',
      features: ['轻量化设计', '开口大', '操作顺畅', '耐用性强'],
      usage: '运动攀必备，用于连接保护点'
    },
    {
      id: '6',
      name: '攀岩鞋',
      category: 'shoes',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.4,
      price: '¥480-1200',
      description: '专业攀岩鞋，橡胶鞋底提供优异抓地力，鞋型贴合脚部，提升攀岩表现。',
      features: ['优质橡胶底', '贴合脚型', '良好抓地力', '耐磨性强'],
      usage: '所有攀岩活动推荐使用'
    }
  ];
  
  // 模拟紧急联系人数据
  const emergencyContacts = [
    {
      name: '紧急救援',
      phone: '120',
      description: '医疗急救服务'
    },
    {
      name: '山地救援',
      phone: '110',
      description: '公安部门救援'
    },
    {
      name: '大理消防',
      phone: '119',
      description: '消防救援服务'
    },
    {
      name: '苍山管理处',
      phone: '0872-2329888',
      description: '苍山景区管理'
    },
    {
      name: '攀岩协会',
      phone: '0872-2345678',
      description: '大理攀岩协会'
    },
    {
      name: '当地向导',
      phone: '138-8888-8888',
      description: '专业攀岩向导'
    }
  ];
  
  const handleFeedback = async (values: any) => {
    try {
      setLoading(true);
      console.log('Safety feedback:', values);
      message.success('反馈提交成功，感谢您的建议！');
      setFeedbackModalVisible(false);
      feedbackForm.resetFields();
    } catch (error) {
      message.error('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredKnowledge = safetyKnowledge.filter(item => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchKeyword = !searchKeyword || 
      item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.content.some(content => content.toLowerCase().includes(searchKeyword.toLowerCase()));
    return matchCategory && matchKeyword;
  });
  
  const filteredEquipment = equipmentData.filter(item => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchKeyword = !searchKeyword || 
      item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.description.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchCategory && matchKeyword;
  });
  
  const renderFeedbackModal = () => (
    <Modal
      title="安全建议反馈"
      open={feedbackModalVisible}
      onCancel={() => setFeedbackModalVisible(false)}
      footer={null}
      width={600}
    >
      <Form
        form={feedbackForm}
        layout="vertical"
        onFinish={handleFeedback}
      >
        <Form.Item
          name="type"
          label="反馈类型"
          rules={[{ required: true, message: '请选择反馈类型' }]}
        >
          <Select placeholder="选择反馈类型">
            <Option value="knowledge">安全知识补充</Option>
            <Option value="equipment">装备建议</Option>
            <Option value="emergency">紧急联系方式</Option>
            <Option value="experience">安全经验分享</Option>
            <Option value="other">其他建议</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="简要描述您的建议" />
        </Form.Item>
        
        <Form.Item
          name="content"
          label="详细内容"
          rules={[{ required: true, message: '请输入详细内容' }]}
        >
          <TextArea
            rows={6}
            placeholder="请详细描述您的安全建议或经验分享..."
            maxLength={1000}
            showCount
          />
        </Form.Item>
        
        <Form.Item
          name="contact"
          label="联系方式（可选）"
        >
          <Input placeholder="如需回复，请留下联系方式" />
        </Form.Item>
        
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交反馈
            </Button>
            <Button onClick={() => setFeedbackModalVisible(false)}>
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
              <Breadcrumb.Item>安全提示</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {/* 英雄区域 */}
        <HeroSection>
          <div className="hero-content">
            <h1 className="hero-title">安全第一</h1>
            <p className="hero-subtitle">
              攀岩是一项充满挑战的运动，安全永远是第一位的。
              掌握正确的安全知识，使用合适的装备，享受安全的攀岩体验。
            </p>
            
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">100+</span>
                <span className="stat-label">安全知识点</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">专业装备</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">紧急救援</span>
              </div>
            </div>
          </div>
        </HeroSection>

        {/* 内容区域 */}
        <ContentSection>
          <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
            <TabPane tab="安全知识" key="knowledge">
              <div style={{ marginBottom: 24 }}>
                <Row gutter={16} align="middle">
                  <Col flex="auto">
                    <Input.Search
                      placeholder="搜索安全知识..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      style={{ maxWidth: 400 }}
                      allowClear
                    />
                  </Col>
                  <Col>
                    <Select
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      style={{ width: 150 }}
                    >
                      <Option value="all">全部分类</Option>
                      <Option value="basic">基础知识</Option>
                      <Option value="equipment">装备使用</Option>
                      <Option value="emergency">紧急处理</Option>
                      <Option value="weather">天气安全</Option>
                    </Select>
                  </Col>
                  <Col>
                    <Button 
                      type="primary" 
                      icon={<CommentOutlined />}
                      onClick={() => setFeedbackModalVisible(true)}
                    >
                      反馈建议
                    </Button>
                  </Col>
                </Row>
              </div>
              
              <Row gutter={[24, 24]}>
                {filteredKnowledge.map((item) => (
                  <Col xs={24} lg={12} key={item.id}>
                    <SafetyCard>
                      <div className="safety-header">
                        <div className={`safety-icon ${item.type}`}>
                          {item.icon}
                        </div>
                        <h3 className="safety-title">{item.title}</h3>
                      </div>
                      <div className="safety-content">
                        <ul className="safety-list">
                          {item.content.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </SafetyCard>
                  </Col>
                ))}
              </Row>
              
              {filteredKnowledge.length === 0 && (
                <Empty description="没有找到相关安全知识" />
              )}
            </TabPane>
            
            <TabPane tab="装备介绍" key="equipment">
              <div style={{ marginBottom: 24 }}>
                <Row gutter={16} align="middle">
                  <Col flex="auto">
                    <Input.Search
                      placeholder="搜索攀岩装备..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      style={{ maxWidth: 400 }}
                      allowClear
                    />
                  </Col>
                  <Col>
                    <Select
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      style={{ width: 150 }}
                    >
                      <Option value="all">全部装备</Option>
                      <Option value="rope">绳索</Option>
                      <Option value="helmet">头盔</Option>
                      <Option value="harness">安全带</Option>
                      <Option value="belay">保护器</Option>
                      <Option value="quickdraw">快挂</Option>
                      <Option value="shoes">攀岩鞋</Option>
                    </Select>
                  </Col>
                </Row>
              </div>
              
              <Row gutter={[24, 24]}>
                {filteredEquipment.map((item) => (
                  <Col xs={24} sm={12} lg={8} key={item.id}>
                    <EquipmentCard hoverable>
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="equipment-image"
                        preview={{ mask: <EyeOutlined /> }}
                      />
                      
                      <div className="equipment-header">
                        <h3 className="equipment-title">{item.name}</h3>
                        <div className="equipment-rating">
                          <StarOutlined />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                      
                      <div className="equipment-meta">
                        {item.features.map((feature, index) => (
                          <Tag key={index} color="blue">{feature}</Tag>
                        ))}
                      </div>
                      
                      <div className="equipment-desc">
                        {item.description}
                      </div>
                      
                      <div className="equipment-actions">
                        <div className="equipment-price">{item.price}</div>
                        <Space>
                          <Tooltip title="查看详情">
                            <Button type="text" icon={<EyeOutlined />} />
                          </Tooltip>
                          <Tooltip title="收藏">
                            <Button type="text" icon={<HeartOutlined />} />
                          </Tooltip>
                          <Tooltip title="分享">
                            <Button type="text" icon={<ShareAltOutlined />} />
                          </Tooltip>
                        </Space>
                      </div>
                    </EquipmentCard>
                  </Col>
                ))}
              </Row>
              
              {filteredEquipment.length === 0 && (
                <Empty description="没有找到相关装备" />
              )}
            </TabPane>
            
            <TabPane tab="紧急联系" key="emergency">
              <EmergencyCard>
                <div className="emergency-header">
                  <div className="emergency-icon">
                    <PhoneOutlined />
                  </div>
                  <h2 className="emergency-title">紧急联系方式</h2>
                </div>
                
                <Alert
                  message="重要提醒"
                  description="遇到紧急情况时，请保持冷静，立即拨打相应的救援电话。在等待救援期间，不要随意移动伤者，保持现场安全。"
                  type="warning"
                  showIcon
                  style={{ marginBottom: 24 }}
                />
                
                <div className="emergency-contacts">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="contact-item">
                      <div className="contact-name">{contact.name}</div>
                      <div className="contact-phone">
                        <PhoneOutlined />
                        <span>{contact.phone}</span>
                      </div>
                      <div className="contact-desc">{contact.description}</div>
                    </div>
                  ))}
                </div>
              </EmergencyCard>
              
              <Card title="急救步骤" style={{ marginTop: 24 }}>
                <Steps direction="vertical">
                  <Step
                    title="评估现场安全"
                    description="确保现场环境安全，避免二次伤害"
                    icon={<SafetyOutlined />}
                  />
                  <Step
                    title="检查伤者状况"
                    description="检查意识、呼吸、脉搏等生命体征"
                    icon={<MedicineBoxOutlined />}
                  />
                  <Step
                    title="拨打救援电话"
                    description="根据情况拨打120、110或119"
                    icon={<PhoneOutlined />}
                  />
                  <Step
                    title="实施急救措施"
                    description="在专业指导下进行必要的急救处理"
                    icon={<UserOutlined />}
                  />
                  <Step
                    title="等待专业救援"
                    description="保持伤者稳定，等待救援人员到达"
                    icon={<TeamOutlined />}
                  />
                </Steps>
              </Card>
            </TabPane>
            
            <TabPane tab="安全检查" key="checklist">
              <Card title="攀岩前安全检查清单">
                <Collapse>
                  <Panel header="个人装备检查" key="personal">
                    <List
                      dataSource={[
                        '头盔：检查外壳是否有裂纹，调节系统是否正常',
                        '安全带：检查织带是否磨损，扣具是否正常工作',
                        '攀岩鞋：检查鞋底是否磨损过度，鞋面是否完整',
                        '手套：检查是否有破损，抓握是否舒适',
                        '服装：选择合适的攀岩服装，避免过于宽松'
                      ]}
                      renderItem={(item, index) => (
                        <List.Item>
                          <Checkbox>{item}</Checkbox>
                        </List.Item>
                      )}
                    />
                  </Panel>
                  
                  <Panel header="绳索系统检查" key="rope">
                    <List
                      dataSource={[
                        '动力绳：检查绳索外皮是否完整，绳芯是否外露',
                        '保护器：检查制动功能是否正常，磨损程度',
                        '快挂：检查主锁和快挂门是否正常开合',
                        '主锁：检查锁门是否正常，螺纹是否顺畅',
                        '绳结：确保所有绳结正确打结并检查'
                      ]}
                      renderItem={(item, index) => (
                        <List.Item>
                          <Checkbox>{item}</Checkbox>
                        </List.Item>
                      )}
                    />
                  </Panel>
                  
                  <Panel header="环境条件检查" key="environment">
                    <List
                      dataSource={[
                        '天气状况：确认天气适合攀岩，无雷雨大风',
                        '岩壁状况：检查岩石是否稳固，有无松动石块',
                        '保护点：检查固定保护点是否牢固可靠',
                        '下降路线：确认下降路线安全可行',
                        '紧急撤退：制定紧急情况下的撤退计划'
                      ]}
                      renderItem={(item, index) => (
                        <List.Item>
                          <Checkbox>{item}</Checkbox>
                        </List.Item>
                      )}
                    />
                  </Panel>
                  
                  <Panel header="团队沟通检查" key="team">
                    <List
                      dataSource={[
                        '角色分工：明确攀登者、保护者的职责',
                        '信号约定：确认攀登和保护的沟通信号',
                        '紧急预案：讨论可能的紧急情况处理方案',
                        '技能水平：确认团队成员的技能匹配度',
                        '联系方式：确保所有人都有紧急联系方式'
                      ]}
                      renderItem={(item, index) => (
                        <List.Item>
                          <Checkbox>{item}</Checkbox>
                        </List.Item>
                      )}
                    />
                  </Panel>
                </Collapse>
              </Card>
            </TabPane>
          </Tabs>
        </ContentSection>

        {/* 反馈弹窗 */}
        {renderFeedbackModal()}

        <BackTop />
      </PageContainer>
    </ErrorBoundary>
  );
};

export default Safety;