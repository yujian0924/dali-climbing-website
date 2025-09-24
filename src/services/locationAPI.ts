import { apiClient, PaginatedResponse } from './api';
import { Location, LocationFilter } from '@types/index';

export const locationAPI = {
  // 获取地点列表
  getLocations: (params?: {
    page?: number;
    limit?: number;
    filter?: LocationFilter;
  }) => {
    return apiClient.get<PaginatedResponse<Location>>('/locations', { params });
  },

  // 根据ID获取地点详情
  getLocationById: (id: string) => {
    return apiClient.get<Location>(`/locations/${id}`);
  },

  // 搜索地点
  searchLocations: (query: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    return apiClient.get<PaginatedResponse<Location>>('/locations/search', {
      params: { q: query, ...params }
    });
  },

  // 获取附近的地点
  getNearbyLocations: (params: {
    latitude: number;
    longitude: number;
    radius?: number; // 半径，单位：公里
    limit?: number;
  }) => {
    return apiClient.get<Location[]>('/locations/nearby', { params });
  },

  // 创建新地点（管理员功能）
  createLocation: (locationData: Omit<Location, '_id' | 'created_at' | 'updated_at' | 'routes'>) => {
    return apiClient.post<Location>('/locations', locationData);
  },

  // 更新地点信息（管理员功能）
  updateLocation: (id: string, locationData: Partial<Location>) => {
    return apiClient.put<Location>(`/locations/${id}`, locationData);
  },

  // 删除地点（管理员功能）
  deleteLocation: (id: string) => {
    return apiClient.delete(`/locations/${id}`);
  },

  // 获取地点的路线列表
  getLocationRoutes: (locationId: string, params?: {
    page?: number;
    limit?: number;
    difficulty?: string;
    type?: string;
  }) => {
    return apiClient.get(`/locations/${locationId}/routes`, { params });
  },

  // 为地点添加评分
  rateLocation: (locationId: string, rating: {
    score: number;
    comment?: string;
  }) => {
    return apiClient.post(`/locations/${locationId}/ratings`, rating);
  },

  // 获取地点评分列表
  getLocationRatings: (locationId: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    return apiClient.get(`/locations/${locationId}/ratings`, { params });
  },

  // 更新地点评分
  updateLocationRating: (locationId: string, ratingId: string, rating: {
    score: number;
    comment?: string;
  }) => {
    return apiClient.put(`/locations/${locationId}/ratings/${ratingId}`, rating);
  },

  // 删除地点评分
  deleteLocationRating: (locationId: string, ratingId: string) => {
    return apiClient.delete(`/locations/${locationId}/ratings/${ratingId}`);
  },

  // 收藏地点
  favoriteLocation: (locationId: string) => {
    return apiClient.post(`/locations/${locationId}/favorite`);
  },

  // 取消收藏地点
  unfavoriteLocation: (locationId: string) => {
    return apiClient.delete(`/locations/${locationId}/favorite`);
  },

  // 获取用户收藏的地点
  getFavoriteLocations: (params?: {
    page?: number;
    limit?: number;
  }) => {
    return apiClient.get<PaginatedResponse<Location>>('/locations/favorites', { params });
  },

  // 检查地点是否已收藏
  checkFavoriteStatus: (locationId: string) => {
    return apiClient.get<{ isFavorite: boolean }>(`/locations/${locationId}/favorite-status`);
  },

  // 获取热门地点
  getPopularLocations: (params?: {
    limit?: number;
    timeRange?: 'week' | 'month' | 'year' | 'all';
  }) => {
    return apiClient.get<Location[]>('/locations/popular', { params });
  },

  // 获取最新添加的地点
  getRecentLocations: (params?: {
    limit?: number;
  }) => {
    return apiClient.get<Location[]>('/locations/recent', { params });
  },

  // 获取地点统计信息
  getLocationStats: (locationId: string) => {
    return apiClient.get(`/locations/${locationId}/stats`);
  },

  // 报告地点问题
  reportLocationIssue: (locationId: string, issue: {
    type: 'access' | 'safety' | 'environmental' | 'other';
    description: string;
    severity: 'low' | 'medium' | 'high';
  }) => {
    return apiClient.post(`/locations/${locationId}/report`, issue);
  },

  // 获取地点天气信息
  getLocationWeather: (locationId: string) => {
    return apiClient.get(`/locations/${locationId}/weather`);
  },

  // 获取地点访问信息
  getLocationAccess: (locationId: string) => {
    return apiClient.get(`/locations/${locationId}/access`);
  },

  // 更新地点访问信息（管理员功能）
  updateLocationAccess: (locationId: string, accessInfo: {
    transportation?: string;
    parking?: string;
    fees?: string;
    restrictions?: string;
    best_time?: string;
  }) => {
    return apiClient.put(`/locations/${locationId}/access`, accessInfo);
  },
};