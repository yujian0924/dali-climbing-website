import { apiClient, PaginatedResponse } from './api';
import { Post, Comment } from '@types/index';

export const forumAPI = {
  // 获取帖子列表
  getPosts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    sort?: 'latest' | 'popular' | 'most_liked' | 'most_commented';
    timeRange?: 'day' | 'week' | 'month' | 'year' | 'all';
  }) => {
    return apiClient.get<PaginatedResponse<Post>>('/forum/posts', { params });
  },

  // 根据ID获取帖子详情
  getPostById: (id: string) => {
    return apiClient.get<Post>(`/forum/posts/${id}`);
  },

  // 创建新帖子
  createPost: (postData: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
    images?: string[];
  }) => {
    return apiClient.post<Post>('/forum/posts', postData);
  },

  // 更新帖子
  updatePost: (id: string, postData: {
    title?: string;
    content?: string;
    category?: string;
    tags?: string[];
    images?: string[];
  }) => {
    return apiClient.put<Post>(`/forum/posts/${id}`, postData);
  },

  // 删除帖子
  deletePost: (id: string) => {
    return apiClient.delete(`/forum/posts/${id}`);
  },

  // 点赞帖子
  likePost: (postId: string) => {
    return apiClient.post<{ likes: string[] }>(`/forum/posts/${postId}/like`);
  },

  // 取消点赞帖子
  unlikePost: (postId: string) => {
    return apiClient.delete<{ likes: string[] }>(`/forum/posts/${postId}/like`);
  },

  // 收藏帖子
  favoritePost: (postId: string) => {
    return apiClient.post(`/forum/posts/${postId}/favorite`);
  },

  // 取消收藏帖子
  unfavoritePost: (postId: string) => {
    return apiClient.delete(`/forum/posts/${postId}/favorite`);
  },

  // 获取收藏的帖子
  getFavoritePosts: (params?: {
    page?: number;
    limit?: number;
  }) => {
    return apiClient.get<PaginatedResponse<Post>>('/forum/posts/favorites', { params });
  },

  // 检查帖子收藏状态
  checkFavoriteStatus: (postId: string) => {
    return apiClient.get<{ isFavorite: boolean }>(`/forum/posts/${postId}/favorite-status`);
  },

  // 搜索帖子
  searchPosts: (query: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
    tags?: string[];
  }) => {
    return apiClient.get<PaginatedResponse<Post>>('/forum/posts/search', {
      params: { q: query, ...params }
    });
  },

  // 获取热门帖子
  getPopularPosts: (params?: {
    limit?: number;
    timeRange?: 'day' | 'week' | 'month' | 'year';
    category?: string;
  }) => {
    return apiClient.get<Post[]>('/forum/posts/popular', { params });
  },

  // 获取推荐帖子
  getRecommendedPosts: (params?: {
    limit?: number;
    user_preferences?: string[];
  }) => {
    return apiClient.get<Post[]>('/forum/posts/recommended', { params });
  },

  // 获取用户的帖子
  getUserPosts: (userId?: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    const url = userId ? `/forum/posts/user/${userId}` : '/forum/posts/my-posts';
    return apiClient.get<PaginatedResponse<Post>>(url, { params });
  },

  // 添加评论
  addComment: (postId: string, content: string, parentId?: string) => {
    return apiClient.post<Comment>(`/forum/posts/${postId}/comments`, {
      content,
      parent_id: parentId
    });
  },

  // 获取帖子评论
  getPostComments: (postId: string, params?: {
    page?: number;
    limit?: number;
    sort?: 'latest' | 'oldest' | 'most_liked';
  }) => {
    return apiClient.get<PaginatedResponse<Comment>>(`/forum/posts/${postId}/comments`, { params });
  },

  // 更新评论
  updateComment: (postId: string, commentId: string, content: string) => {
    return apiClient.put<Comment>(`/forum/posts/${postId}/comments/${commentId}`, {
      content
    });
  },

  // 删除评论
  deleteComment: (postId: string, commentId: string) => {
    return apiClient.delete(`/forum/posts/${postId}/comments/${commentId}`);
  },

  // 点赞评论
  likeComment: (postId: string, commentId: string) => {
    return apiClient.post<{ likes: string[] }>(`/forum/posts/${postId}/comments/${commentId}/like`);
  },

  // 取消点赞评论
  unlikeComment: (postId: string, commentId: string) => {
    return apiClient.delete<{ likes: string[] }>(`/forum/posts/${postId}/comments/${commentId}/like`);
  },

  // 举报帖子
  reportPost: (postId: string, report: {
    reason: 'spam' | 'inappropriate' | 'harassment' | 'misinformation' | 'other';
    description?: string;
  }) => {
    return apiClient.post(`/forum/posts/${postId}/report`, report);
  },

  // 举报评论
  reportComment: (postId: string, commentId: string, report: {
    reason: 'spam' | 'inappropriate' | 'harassment' | 'misinformation' | 'other';
    description?: string;
  }) => {
    return apiClient.post(`/forum/posts/${postId}/comments/${commentId}/report`, report);
  },

  // 获取论坛分类
  getCategories: () => {
    return apiClient.get<Array<{
      id: string;
      name: string;
      description: string;
      post_count: number;
    }>>('/forum/categories');
  },

  // 获取热门标签
  getPopularTags: (params?: {
    limit?: number;
    timeRange?: 'day' | 'week' | 'month' | 'year';
  }) => {
    return apiClient.get<Array<{
      tag: string;
      count: number;
    }>>('/forum/tags/popular', { params });
  },

  // 根据标签获取帖子
  getPostsByTag: (tag: string, params?: {
    page?: number;
    limit?: number;
  }) => {
    return apiClient.get<PaginatedResponse<Post>>(`/forum/tags/${tag}/posts`, { params });
  },

  // 获取论坛统计信息
  getForumStats: () => {
    return apiClient.get<{
      total_posts: number;
      total_comments: number;
      total_users: number;
      active_users_today: number;
      popular_categories: Array<{
        category: string;
        post_count: number;
      }>;
    }>('/forum/stats');
  },

  // 获取用户在论坛的活动
  getUserForumActivity: (userId?: string, params?: {
    page?: number;
    limit?: number;
    type?: 'posts' | 'comments' | 'likes' | 'all';
  }) => {
    const url = userId ? `/forum/activity/user/${userId}` : '/forum/activity/my-activity';
    return apiClient.get(url, { params });
  },

  // 关注用户
  followUser: (userId: string) => {
    return apiClient.post(`/forum/users/${userId}/follow`);
  },

  // 取消关注用户
  unfollowUser: (userId: string) => {
    return apiClient.delete(`/forum/users/${userId}/follow`);
  },

  // 获取关注的用户的帖子
  getFollowingPosts: (params?: {
    page?: number;
    limit?: number;
  }) => {
    return apiClient.get<PaginatedResponse<Post>>('/forum/posts/following', { params });
  },

  // 获取通知
  getNotifications: (params?: {
    page?: number;
    limit?: number;
    type?: 'like' | 'comment' | 'follow' | 'mention' | 'all';
    unread_only?: boolean;
  }) => {
    return apiClient.get('/forum/notifications', { params });
  },

  // 标记通知为已读
  markNotificationAsRead: (notificationId: string) => {
    return apiClient.put(`/forum/notifications/${notificationId}/read`);
  },

  // 标记所有通知为已读
  markAllNotificationsAsRead: () => {
    return apiClient.put('/forum/notifications/read-all');
  },

  // 获取未读通知数量
  getUnreadNotificationCount: () => {
    return apiClient.get<{ count: number }>('/forum/notifications/unread-count');
  },
};