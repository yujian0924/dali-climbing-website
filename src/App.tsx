import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';

// 懒加载页面组件
const Home = React.lazy(() => import('./pages/Home'));
const Locations = React.lazy(() => import('./pages/Locations'));
const LocationDetail = React.lazy(() => import('./pages/LocationDetail'));
const RoutesPage = React.lazy(() => import('./pages/Routes'));
const RouteDetail = React.lazy(() => import('./pages/RouteDetail'));
const Activities = React.lazy(() => import('./pages/Activities'));
const ActivityDetail = React.lazy(() => import('./pages/ActivityDetail'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Login = React.lazy(() => import('./pages/Login'));
const Safety = React.lazy(() => import('./pages/Safety'));
const Forum = React.lazy(() => import('./pages/Forum'));
const PostDetail = React.lazy(() => import('./pages/PostDetail'));

// 组件导入
import {
  ErrorBoundary,
  Loading,
  ProtectedRoute,
  NotFound,
  AppLayout
} from '@components/index';

// 上下文和状态管理
import { AuthProvider } from '@contexts/AuthContext';

// Redux store
import { store } from '@store/index';

// 样式
import { GlobalStyle, theme } from '@styles/index';

// 页面加载组件
const PageLoader: React.FC = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '50vh' 
  }}>
    <Loading size="large" />
  </div>
);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AuthProvider>
          <ConfigProvider locale={zhCN}>
            <ThemeProvider theme={theme}>
              <Router>
                <GlobalStyle />
                <AppLayout>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* 首页 */}
                      <Route path="/" element={<Home />} />
                      
                      {/* 攀岩地点 */}
                      <Route path="/locations" element={<Locations />} />
                      <Route path="/locations/:id" element={<LocationDetail />} />
                      
                      {/* 攀岩路线 */}
                      <Route path="/routes" element={<RoutesPage />} />
                      <Route path="/routes/:id" element={<RouteDetail />} />
                      
                      {/* 攀岩活动 */}
                      <Route path="/activities" element={<Activities />} />
                      <Route path="/activities/:id" element={<ActivityDetail />} />
                      
                      {/* 用户系统 */}
                      <Route path="/login" element={<Login />} />
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/profile/:id" 
                        element={<Profile />} 
                      />
                      
                      {/* 安全提示 */}
                      <Route path="/safety" element={<Safety />} />
                      
                      {/* 社区论坛 */}
                      <Route path="/forum" element={<Forum />} />
                      <Route path="/forum/post/:id" element={<PostDetail />} />
                      
                      {/* 重定向和404 */}
                      <Route path="/home" element={<Navigate to="/" replace />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </AppLayout>
              </Router>
            </ThemeProvider>
          </ConfigProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;