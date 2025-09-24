import React from 'react';
import { Layout, Row, Col, Space, Divider } from 'antd';
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  WechatOutlined,
  QqOutlined,
  WeiboOutlined,
  GithubOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const { Footer: AntFooter } = Layout;

const StyledFooter = styled(AntFooter)`
  background: #001529;
  color: rgba(255, 255, 255, 0.85);
  padding: 48px 24px 24px;
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .footer-section {
    margin-bottom: 32px;
    
    h3 {
      color: #fff;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    
    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        margin-bottom: 8px;
        
        a {
          color: rgba(255, 255, 255, 0.65);
          text-decoration: none;
          transition: color 0.3s;
          
          &:hover {
            color: #1890ff;
          }
        }
      }
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      color: rgba(255, 255, 255, 0.65);
      
      .anticon {
        margin-right: 8px;
        color: #1890ff;
      }
    }
    
    .social-links {
      display: flex;
      gap: 16px;
      
      .social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.65);
        text-decoration: none;
        transition: all 0.3s;
        
        &:hover {
          background: #1890ff;
          color: #fff;
          transform: translateY(-2px);
        }
      }
    }
  }
  
  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 24px;
    text-align: center;
    color: rgba(255, 255, 255, 0.45);
    
    .footer-links-inline {
      margin-bottom: 16px;
      
      a {
        color: rgba(255, 255, 255, 0.45);
        text-decoration: none;
        margin: 0 16px;
        
        &:hover {
          color: #1890ff;
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    padding: 32px 16px 16px;
    
    .footer-section {
      margin-bottom: 24px;
      text-align: center;
      
      .social-links {
        justify-content: center;
      }
    }
    
    .footer-bottom {
      .footer-links-inline {
        a {
          display: block;
          margin: 8px 0;
        }
      }
    }
  }
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <StyledFooter>
      <div className="footer-content">
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <h3>🧗‍♂️ 大理攀岩</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.6' }}>
                专业的攀岩信息平台，为攀岩爱好者提供全面的路线指南、安全提示和社区交流服务。
              </p>
              <div className="social-links">
                <a href="#" className="social-link" title="微信">
                  <WechatOutlined />
                </a>
                <a href="#" className="social-link" title="QQ">
                  <QqOutlined />
                </a>
                <a href="#" className="social-link" title="微博">
                  <WeiboOutlined />
                </a>
                <a href="#" className="social-link" title="GitHub">
                  <GithubOutlined />
                </a>
              </div>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <h3>快速导航</h3>
              <ul className="footer-links">
                <li><Link to="/locations">攀岩地点</Link></li>
                <li><Link to="/routes">路线指南</Link></li>
                <li><Link to="/safety">安全提示</Link></li>
                <li><Link to="/activities">活动组织</Link></li>
                <li><Link to="/forum">社区论坛</Link></li>
                <li><Link to="/about">关于我们</Link></li>
              </ul>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <h3>用户服务</h3>
              <ul className="footer-links">
                <li><Link to="/help">帮助中心</Link></li>
                <li><Link to="/guide">新手指南</Link></li>
                <li><Link to="/equipment">装备推荐</Link></li>
                <li><Link to="/training">训练计划</Link></li>
                <li><Link to="/weather">天气预报</Link></li>
                <li><Link to="/emergency">紧急联系</Link></li>
              </ul>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <h3>联系我们</h3>
              <div className="contact-item">
                <EnvironmentOutlined />
                <span>云南省大理白族自治州</span>
              </div>
              <div className="contact-item">
                <PhoneOutlined />
                <span>400-123-4567</span>
              </div>
              <div className="contact-item">
                <MailOutlined />
                <span>info@dalipanyan.com</span>
              </div>
              <div className="contact-item">
                <WechatOutlined />
                <span>dalipanyan2024</span>
              </div>
            </div>
          </Col>
        </Row>
        
        <div className="footer-bottom">
          <div className="footer-links-inline">
            <Link to="/privacy">隐私政策</Link>
            <Link to="/terms">服务条款</Link>
            <Link to="/sitemap">网站地图</Link>
            <Link to="/feedback">意见反馈</Link>
          </div>
          
          <div>
            <p>
              © {currentYear} 大理攀岩网站 (dalipanyan.com) 版权所有
              <Divider type="vertical" />
              <a 
                href="https://beian.miit.gov.cn/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'rgba(255, 255, 255, 0.45)' }}
              >
                滇ICP备2024000000号
              </a>
            </p>
            <p style={{ marginTop: '8px', fontSize: '12px' }}>
              本网站致力于推广攀岩运动，请在专业指导下进行攀岩活动，注意安全
            </p>
          </div>
        </div>
      </div>
    </StyledFooter>
  );
};

export default Footer;