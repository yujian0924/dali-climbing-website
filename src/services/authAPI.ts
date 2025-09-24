import { apiClient } from './api';
import { User, LoginForm, RegisterForm } from '@types/index';

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export const authAPI = {
  // 用户登录
  login: (credentials: LoginForm) => {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  // 用户注册
  register: (userData: RegisterForm) => {
    return apiClient.post<RegisterResponse>('/auth/register', userData);
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    return apiClient.get<User>('/auth/me');
  },

  // 更新用户资料
  updateProfile: (userData: Partial<User>) => {
    return apiClient.put<User>('/auth/profile', userData);
  },

  // 修改密码
  changePassword: (data: { currentPassword: string; newPassword: string }) => {
    return apiClient.put('/auth/change-password', data);
  },

  // 忘记密码
  forgotPassword: (email: string) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  // 重置密码
  resetPassword: (data: { token: string; newPassword: string }) => {
    return apiClient.post('/auth/reset-password', data);
  },

  // 验证邮箱
  verifyEmail: (token: string) => {
    return apiClient.post('/auth/verify-email', { token });
  },

  // 重新发送验证邮件
  resendVerificationEmail: () => {
    return apiClient.post('/auth/resend-verification');
  },

  // 用户登出
  logout: () => {
    return apiClient.post('/auth/logout');
  },

  // 刷新token
  refreshToken: () => {
    return apiClient.post<{ token: string }>('/auth/refresh');
  },

  // 删除账户
  deleteAccount: (password: string) => {
    return apiClient.delete('/auth/account', {
      data: { password }
    });
  },

  // 获取用户攀岩记录
  getClimbingRecords: (userId?: string) => {
    const url = userId ? `/auth/climbing-records/${userId}` : '/auth/climbing-records';
    return apiClient.get(url);
  },

  // 添加攀岩记录
  addClimbingRecord: (record: {
    route_id: string;
    completed: boolean;
    attempts: number;
    notes?: string;
    rating?: number;
  }) => {
    return apiClient.post('/auth/climbing-records', record);
  },

  // 更新攀岩记录
  updateClimbingRecord: (recordId: string, record: {
    completed?: boolean;
    attempts?: number;
    notes?: string;
    rating?: number;
  }) => {
    return apiClient.put(`/auth/climbing-records/${recordId}`, record);
  },

  // 删除攀岩记录
  deleteClimbingRecord: (recordId: string) => {
    return apiClient.delete(`/auth/climbing-records/${recordId}`);
  },

  // 获取用户统计信息
  getUserStats: (userId?: string) => {
    const url = userId ? `/auth/stats/${userId}` : '/auth/stats';
    return apiClient.get(url);
  },

  // 关注用户
  followUser: (userId: string) => {
    return apiClient.post(`/auth/follow/${userId}`);
  },

  // 取消关注用户
  unfollowUser: (userId: string) => {
    return apiClient.delete(`/auth/follow/${userId}`);
  },

  // 获取关注列表
  getFollowing: (userId?: string) => {
    const url = userId ? `/auth/following/${userId}` : '/auth/following';
    return apiClient.get(url);
  },

  // 获取粉丝列表
  getFollowers: (userId?: string) => {
    const url = userId ? `/auth/followers/${userId}` : '/auth/followers';
    return apiClient.get(url);
  },

  // 检查是否关注某用户
  checkFollowStatus: (userId: string) => {
    return apiClient.get(`/auth/follow-status/${userId}`);
  },
};