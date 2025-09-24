import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Location, LocationFilter, PaginatedResponse } from '@types/index';
import { locationAPI } from '@services/locationAPI';

interface LocationState {
  locations: Location[];
  currentLocation: Location | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: LocationFilter;
}

const initialState: LocationState = {
  locations: [],
  currentLocation: null,
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
export const fetchLocations = createAsyncThunk(
  'location/fetchLocations',
  async (params: { page?: number; limit?: number; filters?: LocationFilter }, { rejectWithValue }) => {
    try {
      const response = await locationAPI.getLocations(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取地点列表失败');
    }
  }
);

export const fetchLocationById = createAsyncThunk(
  'location/fetchLocationById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await locationAPI.getLocationById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取地点详情失败');
    }
  }
);

export const searchLocations = createAsyncThunk(
  'location/searchLocations',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await locationAPI.searchLocations(query);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '搜索地点失败');
    }
  }
);

export const getNearbyLocations = createAsyncThunk(
  'location/getNearbyLocations',
  async (coords: { latitude: number; longitude: number; radius?: number }, { rejectWithValue }) => {
    try {
      const response = await locationAPI.getNearbyLocations(coords);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取附近地点失败');
    }
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<LocationFilter>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setCurrentLocation: (state, action: PayloadAction<Location | null>) => {
      state.currentLocation = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    // 获取地点列表
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload.items;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
        state.error = null;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 获取地点详情
    builder
      .addCase(fetchLocationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLocation = action.payload;
        state.error = null;
      })
      .addCase(fetchLocationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 搜索地点
    builder
      .addCase(searchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload.items;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
        state.error = null;
      })
      .addCase(searchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 获取附近地点
    builder
      .addCase(getNearbyLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNearbyLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
        state.error = null;
      })
      .addCase(getNearbyLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentLocation,
  clearError,
  setPage,
} = locationSlice.actions;

export default locationSlice.reducer;