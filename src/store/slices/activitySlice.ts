import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Activity } from '@types/index';
import { activityAPI } from '@services/activityAPI';

interface ActivityState {
  activities: Activity[];
  currentActivity: Activity | null;
  myActivities: Activity[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: ActivityState = {
  activities: [],
  currentActivity: null,
  myActivities: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  },
};

// 异步actions
export const fetchActivities = createAsyncThunk(
  'activity/fetchActivities',
  async (params: { page?: number; limit?: number; filters?: any }, { rejectWithValue }) => {
    try {
      const response = await activityAPI.getActivities(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取活动列表失败');
    }
  }
);

export const fetchActivityById = createAsyncThunk(
  'activity/fetchActivityById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await activityAPI.getActivityById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取活动详情失败');
    }
  }
);

export const createActivity = createAsyncThunk(
  'activity/createActivity',
  async (activityData: Omit<Activity, '_id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      const response = await activityAPI.createActivity(activityData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '创建活动失败');
    }
  }
);

export const joinActivity = createAsyncThunk(
  'activity/joinActivity',
  async (activityId: string, { rejectWithValue }) => {
    try {
      const response = await activityAPI.joinActivity(activityId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '报名活动失败');
    }
  }
);

export const leaveActivity = createAsyncThunk(
  'activity/leaveActivity',
  async (activityId: string, { rejectWithValue }) => {
    try {
      const response = await activityAPI.leaveActivity(activityId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '取消报名失败');
    }
  }
);

export const fetchMyActivities = createAsyncThunk(
  'activity/fetchMyActivities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await activityAPI.getMyActivities();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取我的活动失败');
    }
  }
);

export const updateActivity = createAsyncThunk(
  'activity/updateActivity',
  async (params: { id: string; data: Partial<Activity> }, { rejectWithValue }) => {
    try {
      const response = await activityAPI.updateActivity(params.id, params.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '更新活动失败');
    }
  }
);

export const deleteActivity = createAsyncThunk(
  'activity/deleteActivity',
  async (id: string, { rejectWithValue }) => {
    try {
      await activityAPI.deleteActivity(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '删除活动失败');
    }
  }
);

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setCurrentActivity: (state, action: PayloadAction<Activity | null>) => {
      state.currentActivity = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    updateActivityParticipants: (state, action: PayloadAction<{ activityId: string; participants: Activity['participants'] }>) => {
      const { activityId, participants } = action.payload;
      
      // 更新当前活动的参与者
      if (state.currentActivity && state.currentActivity._id === activityId) {
        state.currentActivity.participants = participants;
        state.currentActivity.current_participants = participants.length;
      }
      
      // 更新活动列表中的参与者
      const activityIndex = state.activities.findIndex(activity => activity._id === activityId);
      if (activityIndex !== -1) {
        state.activities[activityIndex].participants = participants;
        state.activities[activityIndex].current_participants = participants.length;
      }
    },
  },
  extraReducers: (builder) => {
    // 获取活动列表
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.items;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
        state.error = null;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 获取活动详情
    builder
      .addCase(fetchActivityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentActivity = action.payload;
        state.error = null;
      })
      .addCase(fetchActivityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 创建活动
    builder
      .addCase(createActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.activities.unshift(action.payload);
        state.error = null;
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 参加活动
    builder
      .addCase(joinActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinActivity.fulfilled, (state, action) => {
        state.loading = false;
        // 通过updateActivityParticipants action更新参与者信息
        state.error = null;
      })
      .addCase(joinActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 取消参加活动
    builder
      .addCase(leaveActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveActivity.fulfilled, (state, action) => {
        state.loading = false;
        // 通过updateActivityParticipants action更新参与者信息
        state.error = null;
      })
      .addCase(leaveActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 获取我的活动
    builder
      .addCase(fetchMyActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.myActivities = action.payload;
        state.error = null;
      })
      .addCase(fetchMyActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 更新活动
    builder
      .addCase(updateActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        state.loading = false;
        const updatedActivity = action.payload;
        
        // 更新当前活动
        if (state.currentActivity && state.currentActivity._id === updatedActivity._id) {
          state.currentActivity = updatedActivity;
        }
        
        // 更新活动列表
        const activityIndex = state.activities.findIndex(activity => activity._id === updatedActivity._id);
        if (activityIndex !== -1) {
          state.activities[activityIndex] = updatedActivity;
        }
        
        state.error = null;
      })
      .addCase(updateActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 删除活动
    builder
      .addCase(deleteActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        
        // 从活动列表中移除
        state.activities = state.activities.filter(activity => activity._id !== deletedId);
        
        // 如果删除的是当前活动，清空当前活动
        if (state.currentActivity && state.currentActivity._id === deletedId) {
          state.currentActivity = null;
        }
        
        state.error = null;
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentActivity,
  clearError,
  setPage,
  updateActivityParticipants,
} = activitySlice.actions;

export default activitySlice.reducer;