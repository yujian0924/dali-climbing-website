import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 14px;
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
      'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol';
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }

  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
    transition: background 0.3s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  /* 链接样式 */
  a {
    color: #1890ff;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a:hover {
    color: #40a9ff;
  }

  /* 按钮样式重置 */
  button {
    border: none;
    outline: none;
    cursor: pointer;
  }

  /* 输入框样式重置 */
  input, textarea {
    outline: none;
  }

  /* 图片样式 */
  img {
    max-width: 100%;
    height: auto;
  }

  /* 响应式断点 */
  @media (max-width: 768px) {
    html {
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    html {
      font-size: 11px;
    }
  }

  /* Ant Design 组件样式覆盖 */
  .ant-layout {
    background: #fff;
  }

  .ant-layout-content {
    min-height: calc(100vh - 64px - 70px); /* 减去header和footer高度 */
  }

  .ant-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.3s ease;
  }

  .ant-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  .ant-btn {
    border-radius: 6px;
    font-weight: 500;
  }

  .ant-input, .ant-input-password {
    border-radius: 6px;
  }

  .ant-select .ant-select-selector {
    border-radius: 6px;
  }

  .ant-pagination {
    text-align: center;
    margin-top: 24px;
  }

  /* 自定义工具类 */
  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .flex {
    display: flex;
  }

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .flex-column {
    display: flex;
    flex-direction: column;
  }

  .w-full {
    width: 100%;
  }

  .h-full {
    height: 100%;
  }

  .mb-0 {
    margin-bottom: 0 !important;
  }

  .mb-1 {
    margin-bottom: 8px;
  }

  .mb-2 {
    margin-bottom: 16px;
  }

  .mb-3 {
    margin-bottom: 24px;
  }

  .mt-0 {
    margin-top: 0 !important;
  }

  .mt-1 {
    margin-top: 8px;
  }

  .mt-2 {
    margin-top: 16px;
  }

  .mt-3 {
    margin-top: 24px;
  }

  .p-0 {
    padding: 0 !important;
  }

  .p-1 {
    padding: 8px;
  }

  .p-2 {
    padding: 16px;
  }

  .p-3 {
    padding: 24px;
  }

  /* 动画效果 */
  .fade-in {
    animation: fadeIn 0.3s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .slide-up {
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* 加载状态 */
  .loading-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;