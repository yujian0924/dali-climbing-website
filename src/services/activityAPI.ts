import { apiClient, PaginatedResponse } from './api';
import { Activity, Participant } from '@types/index';

export const activityAPI = {
  // 获取活动列表
  getActivities: (params?: {
    page?: number;
    limit?: number;
    status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    type?: string;
    location?: string;
    date_from?: string;
    date_to?: string;
  }) => {
    return apiClient.get<PaginatedResponse<Activity>>('/activities', { params });
  },

  // 根据ID获取活动详情
  getActivityById: (id: string) => {
    return apiClient.get<Activity>(`/activities/${id}`);
  },

  // 创建新活动
  createActivity: (activityData: Omit<Activity, '_id' | 'created_at' | 'updated_at' | 'participants'>) => {
    return apiClient.post<Activity>('/activities', activityData);
  },

  // 更新活动信息
  updateActivity: (id: string, activityData: Partial<Activity>) => {
    return apiClient.put<Activity>(`/activities/${id}`, activityData);
  },

  // 删除活动
  deleteActivity: (id: string) => {
    return apiClient.delete(`/activities/${id}`);
  },

  // 参加活动
  joinActivity: (activityId: string, participantData?: {
    message?: string;
    emergency_contact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  }) => {
    return apiClient.post<Participant>(`/activities/${activityId}/join`, participantData);
  },

  // 退出活动
  leaveActivity: (activityId: string, reason?: string) => {
    return apiClient.delete(`/activities/${activityId}/leave`, {
      data: { reason }
    });
  },

  // 获取活动参与者列表
  getActivityParticipants: (activityId: string, params?: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'confirmed' | 'cancelled';
  }) => {
    return apiClient.get<PaginatedResponse<Participant>>(`/activities/${activityId}/participants`, { params });
  },

  // 更新参与状态（活动组织者）
  updateParticipantStatus: (activityId: string, participantId: string, status: 'confirmed' | 'cancelled', reason?: string) => {
    return apiClient.put(`/activities/${activityId}/participants/${participantId}`, {
      status,
      reason
    });
  },

  // 获取用户参与的活动
  getUserActivities: (params?: {
    page?: number;
    limit?: number;
    status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    role?: 'organizer' | 'participant';
  }) => {
    return apiClient.get<PaginatedResponse<Activity>>('/activities/my-activities', { params });
  },

  // 搜索活动
  searchActivities: (query: string, params?: {
    page?: number;
    limit?: number;
    type?: string;
    location?: string;
  }) => {
    return apiClient.get<PaginatedResponse<Activity>>('/activities/search', {
      params: { q: query, ...params }
    });
  },

  // 获取热门活动
  getPopularActivities: (params?: {
    limit?: number;
    timeRange?: 'week' | 'month' | 'year';
  }) => {
    return apiClient.get<Activity[]>('/activities/popular', { params });
  },

  // 获取推荐活动
  getRecommendedActivities: (params?: {
    limit?: number;
    user_preferences?: string[];
  }) => {
    return apiClient.get<Activity[]>('/activities/recommended', { params });
  },

  // 获取即将开始的活动
  getUpcomingActivities: (params?: {
    limit?: number;
    days?: number; // 未来几天内的活动
  }) => {
    return apiClient.get<Activity[]>('/activities/upcoming', { params });
  },

  // 收藏活动
  favoriteActivity: (activityId: string) => {
    return apiClient.post(`/activities/${activityId}/favorite`);
  },

  // 取消收藏活动
  unfavoriteActivity: (activityId: string) => {
    return apiClient.delete(`/activities/${activityId}/favorite`);
  },

  // 获取收藏的活动
  getFavoriteActivities: (params?: {
    page?: number;
    limit?: number;
  }) => {
    return apiClient.get<PaginatedResponse<Activity>>('/activities/favorites', { params });
  },

  // 检查活动是否已收藏
  checkFavoriteStatus: (activityId: string) => {
    return apiClient.get<{ isFavorite: boolean }>(`/activities/${activityId}/favorite-status`);
  },

  // 检查参与状态
  checkParticipationStatus: (activityId: string) => {
    return apiClient.get<{ isParticipant: boolean; status?: string }>(`/activities/${activityId}/participation-status`);
  },

  // 获取活动统计信息
  getActivityStats: (activityId: string) => {
    return apiClient.get(`/activities/${activityId}/stats`);
  },

  // 发送活动通知（组织者）
  sendActivityNotification: (activityId: string, notification: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'urgent';
    recipients?: 'all' | 'confirmed' | 'pending';
  }) => {
    return apiClient.post(`/activities/${activityId}/notifications`, notification);
  },

  // 获取活动通知
  getActivityNotifications: (activityId: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    return apiClient.get(`/activities/${activityId}/notifications`, { params });
  },

  // 标记活动为已完成
  completeActivity: (activityId: string, summary?: {
    description?: string;
    photos?: string[];
    achievements?: string[];
  }) => {
    return apiClient.post(`/activities/${activityId}/complete`, summary);
  },

  // 取消活动
  cancelActivity: (activityId: string, reason: string) => {
    return apiClient.post(`/activities/${activityId}/cancel`, { reason });
  },

  // 获取活动评价
  getActivityReviews: (activityId: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    return apiClient.get(`/activities/${activityId}/reviews`, { params });
  },

  // 添加活动评价
  addActivityReview: (activityId: string, review: {
    rating: number;
    comment?: string;
    organization_rating?: number;
    safety_rating?: number;
  }) => {
    return apiClient.post(`/activities/${activityId}/reviews`, review);
  },

  // 更新活动评价
  updateActivityReview: (activityId: string, reviewId: string, review: {
    rating?: number;
    comment?: string;
    organization_rating?: number;
    safety_rating?: number;
  }) => {
    return apiClient.put(`/activities/${activityId}/reviews/${reviewId}`, review);
  },

  // 删除活动评价
  deleteActivityReview: (activityId: string, reviewId: string) => {
    return apiClient.delete(`/activities/${activityId}/reviews/${reviewId}`);
  },

  // 获取活动日历数据
  getActivityCalendar: (params: {
    year: number;
    month: number;
    type?: string;
    location?: string;
  }) => {
    return apiClient.get('/activities/calendar', { params });
  },

  // 导出活动参与者名单
  exportParticipants: (activityId: string, format: 'csv' | 'excel') => {
    return apiClient.get(`/activities/${activityId}/export-participants`, {
      params: { format },
      responseType: 'blob'
    });
  },
};