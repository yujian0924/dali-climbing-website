import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post, Comment } from '@types/index';
import { forumAPI } from '@services/forumAPI';

interface ForumState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  categories: string[];
  selectedCategory: string | null;
}

const initialState: ForumState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  categories: ['technique', 'equipment', 'route_sharing', 'activity_organization'],
  selectedCategory: null,
};

// 异步actions
export const fetchPosts = createAsyncThunk(
  'forum/fetchPosts',
  async (params: { page?: number; limit?: number; category?: string }, { rejectWithValue }) => {
    try {
      const response = await forumAPI.getPosts(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取帖子列表失败');
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'forum/fetchPostById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await forumAPI.getPostById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取帖子详情失败');
    }
  }
);

export const createPost = createAsyncThunk(
  'forum/createPost',
  async (postData: Omit<Post, '_id' | 'created_at' | 'updated_at' | 'likes' | 'comments' | 'views'>, { rejectWithValue }) => {
    try {
      const response = await forumAPI.createPost(postData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '创建帖子失败');
    }
  }
);

export const updatePost = createAsyncThunk(
  'forum/updatePost',
  async (params: { id: string; data: Partial<Post> }, { rejectWithValue }) => {
    try {
      const response = await forumAPI.updatePost(params.id, params.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '更新帖子失败');
    }
  }
);

export const deletePost = createAsyncThunk(
  'forum/deletePost',
  async (id: string, { rejectWithValue }) => {
    try {
      await forumAPI.deletePost(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '删除帖子失败');
    }
  }
);

export const likePost = createAsyncThunk(
  'forum/likePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await forumAPI.likePost(postId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '点赞失败');
    }
  }
);

export const unlikePost = createAsyncThunk(
  'forum/unlikePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await forumAPI.unlikePost(postId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '取消点赞失败');
    }
  }
);

export const addComment = createAsyncThunk(
  'forum/addComment',
  async (params: { postId: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await forumAPI.addComment(params.postId, params.content);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '添加评论失败');
    }
  }
);

export const searchPosts = createAsyncThunk(
  'forum/searchPosts',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await forumAPI.searchPosts(query);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '搜索帖子失败');
    }
  }
);

const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    setCurrentPost: (state, action: PayloadAction<Post | null>) => {
      state.currentPost = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    incrementViews: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      
      // 更新当前帖子的浏览量
      if (state.currentPost && state.currentPost._id === postId) {
        state.currentPost.views += 1;
      }
      
      // 更新帖子列表中的浏览量
      const postIndex = state.posts.findIndex(post => post._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].views += 1;
      }
    },
    updatePostLikes: (state, action: PayloadAction<{ postId: string; likes: string[] }>) => {
      const { postId, likes } = action.payload;
      
      // 更新当前帖子的点赞
      if (state.currentPost && state.currentPost._id === postId) {
        state.currentPost.likes = likes;
      }
      
      // 更新帖子列表中的点赞
      const postIndex = state.posts.findIndex(post => post._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].likes = likes;
      }
    },
    updatePostComments: (state, action: PayloadAction<{ postId: string; comments: Comment[] }>) => {
      const { postId, comments } = action.payload;
      
      // 更新当前帖子的评论
      if (state.currentPost && state.currentPost._id === postId) {
        state.currentPost.comments = comments;
      }
      
      // 更新帖子列表中的评论
      const postIndex = state.posts.findIndex(post => post._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].comments = comments;
      }
    },
  },
  extraReducers: (builder) => {
    // 获取帖子列表
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.items;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 获取帖子详情
    builder
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
        state.error = null;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 创建帖子
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 更新帖子
    builder
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPost = action.payload;
        
        // 更新当前帖子
        if (state.currentPost && state.currentPost._id === updatedPost._id) {
          state.currentPost = updatedPost;
        }
        
        // 更新帖子列表
        const postIndex = state.posts.findIndex(post => post._id === updatedPost._id);
        if (postIndex !== -1) {
          state.posts[postIndex] = updatedPost;
        }
        
        state.error = null;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 删除帖子
    builder
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        
        // 从帖子列表中移除
        state.posts = state.posts.filter(post => post._id !== deletedId);
        
        // 如果删除的是当前帖子，清空当前帖子
        if (state.currentPost && state.currentPost._id === deletedId) {
          state.currentPost = null;
        }
        
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 点赞帖子
    builder
      .addCase(likePost.fulfilled, (state, action) => {
        // 通过updatePostLikes action更新点赞状态
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // 取消点赞帖子
    builder
      .addCase(unlikePost.fulfilled, (state, action) => {
        // 通过updatePostLikes action更新点赞状态
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // 添加评论
    builder
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        // 通过updatePostComments action更新评论
        state.error = null;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 搜索帖子
    builder
      .addCase(searchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.items;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
        state.error = null;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentPost,
  setSelectedCategory,
  clearError,
  setPage,
  incrementViews,
  updatePostLikes,
  updatePostComments,
} = forumSlice.actions;

export default forumSlice.reducer;