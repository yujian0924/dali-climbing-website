import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Route, RouteFilter, Rating } from '@types/index';
import { routeAPI } from '@services/routeAPI';

interface RouteState {
  routes: Route[];
  currentRoute: Route | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: RouteFilter;
}

const initialState: RouteState = {
  routes: [],
  currentRoute: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  },
  filters: {},
};

// 异步actions
export const fetchRoutes = createAsyncThunk(
  'route/fetchRoutes',
  async (params: { page?: number; limit?: number; filters?: RouteFilter }, { rejectWithValue }) => {
    try {
      const response = await routeAPI.getRoutes(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取路线列表失败');
    }
  }
);

export const fetchRouteById = createAsyncThunk(
  'route/fetchRouteById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await routeAPI.getRouteById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取路线详情失败');
    }
  }
);

export const fetchRoutesByLocation = createAsyncThunk(
  'route/fetchRoutesByLocation',
  async (locationId: string, { rejectWithValue }) => {
    try {
      const response = await routeAPI.getRoutesByLocation(locationId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取地点路线失败');
    }
  }
);

export const searchRoutes = createAsyncThunk(
  'route/searchRoutes',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await routeAPI.searchRoutes(query);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '搜索路线失败');
    }
  }
);

export const addRouteRating = createAsyncThunk(
  'route/addRouteRating',
  async (params: { routeId: string; rating: Omit<Rating, 'date'> }, { rejectWithValue }) => {
    try {
      const response = await routeAPI.addRating(params.routeId, params.rating);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '添加评分失败');
    }
  }
);

const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<RouteFilter>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setCurrentRoute: (state, action: PayloadAction<Route | null>) => {
      state.currentRoute = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    updateRouteRating: (state, action: PayloadAction<{ routeId: string; rating: Rating }>) => {
      const { routeId, rating } = action.payload;
      
      // 更新当前路线的评分
      if (state.currentRoute && state.currentRoute._id === routeId) {
        state.currentRoute.ratings.push(rating);
      }
      
      // 更新路线列表中的评分
      const routeIndex = state.routes.findIndex(route => route._id === routeId);
      if (routeIndex !== -1) {
        state.routes[routeIndex].ratings.push(rating);
      }
    },
  },
  extraReducers: (builder) => {
    // 获取路线列表
    builder
      .addCase(fetchRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = action.payload.items;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
        state.error = null;
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 获取路线详情
    builder
      .addCase(fetchRouteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRouteById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoute = action.payload;
        state.error = null;
      })
      .addCase(fetchRouteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 获取地点路线
    builder
      .addCase(fetchRoutesByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutesByLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = action.payload;
        state.error = null;
      })
      .addCase(fetchRoutesByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 搜索路线
    builder
      .addCase(searchRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = action.payload.items;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
        state.error = null;
      })
      .addCase(searchRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 添加路线评分
    builder
      .addCase(addRouteRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRouteRating.fulfilled, (state, action) => {
        state.loading = false;
        // 评分添加成功后，通过updateRouteRating action更新状态
        state.error = null;
      })
      .addCase(addRouteRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentRoute,
  clearError,
  setPage,
  updateRouteRating,
} = routeSlice.actions;

export default routeSlice.reducer;