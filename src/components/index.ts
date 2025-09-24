// 基础组件
export { default as Loading } from './Loading';
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as Header } from './Header';
export { default as Footer } from './Footer';
export { default as ProtectedRoute } from './ProtectedRoute';
export { default as NotFound } from './NotFound';
export { default as Navigation } from './Navigation';
export { default as AppLayout } from './AppLayout';

// 重新导出Loading和ErrorBoundary的额外导出
export { PageLoading, ContentLoading, ButtonLoading, ClimbingLoading } from './Loading';
export { withErrorBoundary, SimpleErrorBoundary } from './ErrorBoundary';

// 类型定义 - 只导出实际存在组件的类型
export type { LoadingProps } from './Loading';
export type { ErrorBoundaryProps } from './ErrorBoundary';
export type { HeaderProps } from './Header';
export type { FooterProps } from './Footer';
export type { ProtectedRouteProps } from './ProtectedRoute';
export type { AppLayoutProps } from './AppLayout';

// 布局组件
// export { default as Layout } from './Layout';
// export { default as Container } from './Container';
// export { default as Sidebar } from './Sidebar';

// 表单组件
// export { default as LoginForm } from './forms/LoginForm';
// export { default as RegisterForm } from './forms/RegisterForm';
// export { default as SearchForm } from './forms/SearchForm';
// export { default as FilterForm } from './forms/FilterForm';

// 卡片组件
// export { default as LocationCard } from './cards/LocationCard';
// export { default as RouteCard } from './cards/RouteCard';
// export { default as ActivityCard } from './cards/ActivityCard';
// export { default as PostCard } from './cards/PostCard';
// export { default as UserCard } from './cards/UserCard';

// 列表组件
// export { default as LocationList } from './lists/LocationList';
// export { default as RouteList } from './lists/RouteList';
// export { default as ActivityList } from './lists/ActivityList';
// export { default as PostList } from './lists/PostList';

// 地图组件
// export { default as Map } from './map/Map';
// export { default as LocationMarker } from './map/LocationMarker';
// export { default as RouteMarker } from './map/RouteMarker';

// 媒体组件
// export { default as ImageGallery } from './media/ImageGallery';
// export { default as VideoPlayer } from './media/VideoPlayer';
// export { default as ImageUpload } from './media/ImageUpload';
// export { default as FileUpload } from './media/FileUpload';

// 评分和评论组件
// export { default as Rating } from './rating/Rating';
// export { default as RatingDisplay } from './rating/RatingDisplay';
// export { default as CommentList } from './comments/CommentList';
// export { default as CommentForm } from './comments/CommentForm';

// 用户相关组件
// export { default as UserAvatar } from './user/UserAvatar';
// export { default as UserProfile } from './user/UserProfile';
// export { default as UserStats } from './user/UserStats';
// export { default as FollowButton } from './user/FollowButton';

// 搜索和筛选组件
// export { default as SearchBar } from './search/SearchBar';
// export { default as FilterPanel } from './search/FilterPanel';
// export { default as SortOptions } from './search/SortOptions';

// 通知和消息组件
// export { default as NotificationList } from './notifications/NotificationList';
// export { default as MessageList } from './messages/MessageList';
// export { default as ChatBox } from './messages/ChatBox';

// 统计和图表组件
// export { default as StatsCard } from './stats/StatsCard';
// export { default as Chart } from './charts/Chart';
// export { default as ProgressChart } from './charts/ProgressChart';

// 工具组件
// export { default as Pagination } from './common/Pagination';
// export { default as BackToTop } from './common/BackToTop';
// export { default as ShareButton } from './common/ShareButton';
// export { default as FavoriteButton } from './common/FavoriteButton';
// export { default as LikeButton } from './common/LikeButton';

// 模态框组件
// export { default as Modal } from './modals/Modal';
// export { default as ConfirmModal } from './modals/ConfirmModal';
// export { default as ImageModal } from './modals/ImageModal';
// export { default as VideoModal } from './modals/VideoModal';

// 特殊功能组件
// export { default as WeatherWidget } from './widgets/WeatherWidget';
// export { default as CalendarWidget } from './widgets/CalendarWidget';
// export { default as QRCodeGenerator } from './widgets/QRCodeGenerator';
// export { default as PrintButton } from './widgets/PrintButton';

// 类型定义
export type { ComponentProps, ModalProps } from '../types';

// 组件配置
export const COMPONENT_CONFIG = {
  // 主题配置
  theme: {
    primary: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1890ff'
  },
  
  // 断点配置
  breakpoints: {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600
  },
  
  // 动画配置
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out'
    }
  },
  
  // 尺寸配置
  sizes: {
    header: {
      height: 64
    },
    footer: {
      height: 200
    },
    sidebar: {
      width: 240,
      collapsedWidth: 80
    }
  }
};

// 工具函数
export const componentUtils = {
  // 获取响应式类名
  getResponsiveClassName: (breakpoint: string) => {
    return `responsive-${breakpoint}`;
  },
  
  // 获取主题类名
  getThemeClassName: (theme: 'light' | 'dark') => {
    return `theme-${theme}`;
  },
  
  // 合并类名
  mergeClassNames: (...classNames: (string | undefined)[]) => {
    return classNames.filter(Boolean).join(' ');
  }
};