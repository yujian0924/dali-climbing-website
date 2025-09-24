import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// 使用类型化的hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 导出常用的选择器
export const useAuth = () => useAppSelector((state) => state.auth);
export const useLocation = () => useAppSelector((state) => state.location);
export const useRoute = () => useAppSelector((state) => state.route);
export const useActivity = () => useAppSelector((state) => state.activity);
export const useForum = () => useAppSelector((state) => state.forum);

// 导出常用的状态选择器
export const useAuthUser = () => useAppSelector((state) => state.auth.user);
export const useAuthLoading = () => useAppSelector((state) => state.auth.loading);
export const useAuthError = () => useAppSelector((state) => state.auth.error);
export const useIsAuthenticated = () => useAppSelector((state) => state.auth.isAuthenticated);

export const useLocations = () => useAppSelector((state) => state.location.locations);
export const useLocationDetail = () => useAppSelector((state) => state.location.currentLocation);
export const useLocationLoading = () => useAppSelector((state) => state.location.loading);

export const useRoutes = () => useAppSelector((state) => state.route.routes);
export const useRouteDetail = () => useAppSelector((state) => state.route.currentRoute);
export const useRouteLoading = () => useAppSelector((state) => state.route.loading);

export const useActivities = () => useAppSelector((state) => state.activity.activities);
export const useActivityDetail = () => useAppSelector((state) => state.activity.currentActivity);
export const useActivityLoading = () => useAppSelector((state) => state.activity.loading);

export const usePosts = () => useAppSelector((state) => state.forum.posts);
export const usePostDetail = () => useAppSelector((state) => state.forum.currentPost);
export const useForumLoading = () => useAppSelector((state) => state.forum.loading);