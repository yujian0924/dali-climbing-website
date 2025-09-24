import { apiClient, PaginatedResponse } from './api';
import { Route, RouteFilter, Rating } from '@types/index';

export const routeAPI = {
  // 获取路线列表
  getRoutes: (params?: {
    page?: number;
    limit?: number;
    filter?: RouteFilter;
  }) => {
    return apiClient.get<PaginatedResponse<Route>>('/routes', { params });
  },

  // 根据ID获取路线详情
  getRouteById: (id: string) => {
    return apiClient.get<Route>(`/routes/${id}`);
  },

  // 根据地点获取路线
  getRoutesByLocation: (locationId: string, params?: {
    page?: number;
    limit?: number;
    difficulty?: string;
    type?: string;
  }) => {
    return apiClient.get<PaginatedResponse<Route>>(`/routes/location/${locationId}`, { params });
  },

  // 搜索路线
  searchRoutes: (query: string, params?: {
    page?: number;
    limit?: number;
    filter?: RouteFilter;
  }) => {
    return apiClient.get<PaginatedResponse<Route>>('/routes/search', {
      params: { q: query, ...params }
    });
  },

  // 创建新路线（管理员功能）
  createRoute: (routeData: Omit<Route, '_id' | 'created_at' | 'updated_at' | 'ratings'>) => {
    return apiClient.post<Route>('/routes', routeData);
  },

  // 更新路线信息（管理员功能）
  updateRoute: (id: string, routeData: Partial<Route>) => {
    return apiClient.put<Route>(`/routes/${id}`, routeData);
  },

  // 删除路线（管理员功能）
  deleteRoute: (id: string) => {
    return apiClient.delete(`/routes/${id}`);
  },

  // 为路线添加评分
  addRouteRating: (routeId: string, rating: {
    difficulty_rating: number;
    quality_rating: number;
    comment?: string;
  }) => {
    return apiClient.post<Rating>(`/routes/${routeId}/ratings`, rating);
  },

  // 获取路线评分列表
  getRouteRatings: (routeId: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    return apiClient.get<PaginatedResponse<Rating>>(`/routes/${routeId}/ratings`, { params });
  },

  // 更新路线评分
  updateRouteRating: (routeId: string, ratingId: string, rating: {
    difficulty_rating?: number;
    quality_rating?: number;
    comment?: string;
  }) => {
    return apiClient.put<Rating>(`/routes/${routeId}/ratings/${ratingId}`, rating);
  },

  // 删除路线评分
  deleteRouteRating: (routeId: string, ratingId: string) => {
    return apiClient.delete(`/routes/${routeId}/ratings/${ratingId}`);
  },

  // 收藏路线
  favoriteRoute: (routeId: string) => {
    return apiClient.post(`/routes/${routeId}/favorite`);
  },

  // 取消收藏路线
  unfavoriteRoute: (routeId: string) => {
    return apiClient.delete(`/routes/${routeId}/favorite`);
  },

  // 获取用户收藏的路线
  getFavoriteRoutes: (params?: {
    page?: number;
    limit?: number;
  }) => {
    return apiClient.get<PaginatedResponse<Route>>('/routes/favorites', { params });
  },

  // 检查路线是否已收藏
  checkFavoriteStatus: (routeId: string) => {
    return apiClient.get<{ isFavorite: boolean }>(`/routes/${routeId}/favorite-status`);
  },

  // 记录路线完成情况
  recordRouteCompletion: (routeId: string, record: {
    completed: boolean;
    attempts: number;
    notes?: string;
    send_type?: 'onsight' | 'flash' | 'redpoint' | 'attempt';
    date?: string;
  }) => {
    return apiClient.post(`/routes/${routeId}/completions`, record);
  },

  // 获取路线完成记录
  getRouteCompletions: (routeId: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    return apiClient.get(`/routes/${routeId}/completions`, { params });
  },

  // 更新路线完成记录
  updateRouteCompletion: (routeId: string, completionId: string, record: {
    completed?: boolean;
    attempts?: number;
    notes?: string;
    send_type?: 'onsight' | 'flash' | 'redpoint' | 'attempt';
  }) => {
    return apiClient.put(`/routes/${routeId}/completions/${completionId}`, record);
  },

  // 删除路线完成记录
  deleteRouteCompletion: (routeId: string, completionId: string) => {
    return apiClient.delete(`/routes/${routeId}/completions/${completionId}`);
  },

  // 获取热门路线
  getPopularRoutes: (params?: {
    limit?: number;
    timeRange?: 'week' | 'month' | 'year' | 'all';
    difficulty?: string;
  }) => {
    return apiClient.get<Route[]>('/routes/popular', { params });
  },

  // 获取最新添加的路线
  getRecentRoutes: (params?: {
    limit?: number;
  }) => {
    return apiClient.get<Route[]>('/routes/recent', { params });
  },

  // 获取推荐路线
  getRecommendedRoutes: (params?: {
    limit?: number;
    difficulty_range?: string;
    user_preferences?: string[];
  }) => {
    return apiClient.get<Route[]>('/routes/recommended', { params });
  },

  // 获取路线统计信息
  getRouteStats: (routeId: string) => {
    return apiClient.get(`/routes/${routeId}/stats`);
  },

  // 报告路线问题
  reportRouteIssue: (routeId: string, issue: {
    type: 'safety' | 'access' | 'description' | 'other';
    description: string;
    severity: 'low' | 'medium' | 'high';
  }) => {
    return apiClient.post(`/routes/${routeId}/report`, issue);
  },

  // 获取路线图片
  getRoutePhotos: (routeId: string) => {
    return apiClient.get(`/routes/${routeId}/photos`);
  },

  // 上传路线图片
  uploadRoutePhoto: (routeId: string, photoData: {
    file: File;
    description?: string;
    is_topo?: boolean;
  }) => {
    const formData = new FormData();
    formData.append('photo', photoData.file);
    if (photoData.description) {
      formData.append('description', photoData.description);
    }
    if (photoData.is_topo !== undefined) {
      formData.append('is_topo', photoData.is_topo.toString());
    }
    
    return apiClient.post(`/routes/${routeId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 删除路线图片
  deleteRoutePhoto: (routeId: string, photoId: string) => {
    return apiClient.delete(`/routes/${routeId}/photos/${photoId}`);
  },

  // 获取路线视频
  getRouteVideos: (routeId: string) => {
    return apiClient.get(`/routes/${routeId}/videos`);
  },

  // 添加路线视频链接
  addRouteVideo: (routeId: string, videoData: {
    url: string;
    title?: string;
    description?: string;
  }) => {
    return apiClient.post(`/routes/${routeId}/videos`, videoData);
  },

  // 删除路线视频
  deleteRouteVideo: (routeId: string, videoId: string) => {
    return apiClient.delete(`/routes/${routeId}/videos/${videoId}`);
  },
};