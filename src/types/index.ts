// 用户相关类型
export interface User {
  _id: string;
  username: string;
  email: string;
  profile: {
    nickname: string;
    avatar: string;
    bio: string;
    experience_level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
    climbing_years: number;
  };
  climbing_records: ClimbingRecord[];
  created_at: string;
  updated_at: string;
}

export interface ClimbingRecord {
  location_id: string;
  route_id: string;
  date: string;
  difficulty: string;
  notes: string;
}

// 攀岩地点相关类型
export interface Location {
  _id: string;
  name: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: string;
  images: string[];
  features: string[];
  difficulty_range: string;
  best_season: string;
  transportation: string;
  facilities: string[];
  contact_info: string;
  status: 'open' | 'closed' | 'maintenance';
  created_at: string;
  updated_at: string;
}

// 路线相关类型
export interface Route {
  _id: string;
  location_id: string;
  name: string;
  description: string;
  difficulty: string;
  type: 'sport' | 'traditional' | 'bouldering';
  length: number;
  bolts_count: number;
  route_image: string;
  first_ascent: {
    climber: string;
    date: string;
  };
  safety_notes: string;
  gear_required: string[];
  ratings: Rating[];
  created_at: string;
  updated_at: string;
}

export interface Rating {
  user_id: string;
  rating: number;
  comment: string;
  date: string;
}

// 活动相关类型
export interface Activity {
  _id: string;
  title: string;
  description: string;
  organizer_id: string;
  location_id: string;
  date: string;
  duration: number;
  max_participants: number;
  current_participants: number;
  difficulty_level: string;
  equipment_provided: boolean;
  cost: number;
  requirements: string;
  participants: Participant[];
  status: 'registration' | 'full' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Participant {
  user_id: string;
  registered_at: string;
  status: 'registered' | 'confirmed' | 'cancelled';
}

// 论坛帖子相关类型
export interface Post {
  _id: string;
  author_id: string;
  title: string;
  content: string;
  category: 'technique' | 'equipment' | 'route_sharing' | 'activity_organization';
  images: string[];
  tags: string[];
  likes: string[];
  comments: Comment[];
  views: number;
  status: 'normal' | 'pinned' | 'hidden';
  created_at: string;
  updated_at: string;
}

export interface Comment {
  user_id: string;
  content: string;
  created_at: string;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

// 表单相关类型
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LocationFilter {
  region?: string;
  difficulty?: string;
  type?: string;
  facilities?: string[];
  sortBy?: 'distance' | 'rating' | 'popularity' | 'updated';
}

export interface RouteFilter {
  location_id?: string;
  difficulty_min?: string;
  difficulty_max?: string;
  type?: string;
  length_min?: number;
  length_max?: number;
  rating_min?: number;
}

// 组件Props类型
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ModalProps extends ComponentProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
}

export interface CardProps extends ComponentProps {
  title?: string;
  extra?: React.ReactNode;
  loading?: boolean;
}