import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { message } from 'antd';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { login as loginAction, register as registerAction, logout as logoutAction, getCurrentUser } from '@store/slices/authSlice';
import { User } from '@types/index';

// 认证上下文类型
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// 注册数据类型
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  nickname?: string;
  phone?: string;
}



// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider 组件
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, token, loading, error } = useAppSelector((state) => state.auth);

  // 检查本地存储的token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // 验证token并获取用户信息
      validateToken(token);
    }
  }, []);

  // 验证token
  const validateToken = async (token: string) => {
    try {
      await dispatch(getCurrentUser()).unwrap();
    } catch (error) {
      localStorage.removeItem('token');
      dispatch(logoutAction());
    }
  };

  // 登录
  const login = async (email: string, password: string) => {
    try {
      await dispatch(loginAction({ email, password })).unwrap();
      message.success('登录成功！');
    } catch (error: any) {
      message.error(error.message || '登录失败');
    }
  };

  // 注册
  const register = async (userData: RegisterData) => {
    try {
      await dispatch(registerAction(userData)).unwrap();
      message.success('注册成功！');
    } catch (error: any) {
      message.error(error.message || '注册失败');
    }
  };

  // 登出
  const logout = () => {
    dispatch(logoutAction());
    message.success('已退出登录');
  };

  // 清除错误
  const clearError = () => {
    // Redux中的错误清除逻辑 - 可以调用相应的action
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;