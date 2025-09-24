// 格式化日期
export const formatDate = (date: string | Date, format: 'full' | 'date' | 'time' | 'relative' = 'full'): string => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return '无效日期';
  }
  
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  if (format === 'relative') {
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    if (days < 30) return `${Math.floor(days / 7)}周前`;
    if (days < 365) return `${Math.floor(days / 30)}个月前`;
    return `${Math.floor(days / 365)}年前`;
  }
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  
  if (format === 'full' || format === 'time') {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  if (format === 'time') {
    delete options.year;
    delete options.month;
    delete options.day;
  }
  
  return d.toLocaleDateString('zh-CN', options);
};

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
};

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// 深拷贝
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as { [key: string]: any };
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj as T;
  }
  
  return obj;
};

// 生成随机ID
export const generateId = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 验证邮箱格式
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 验证手机号格式
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// 验证密码强度
export const validatePassword = (password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
} => {
  const errors: string[] = [];
  let score = 0;
  
  if (password.length < 8) {
    errors.push('密码长度至少8位');
  } else {
    score += 1;
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('密码需包含小写字母');
  } else {
    score += 1;
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('密码需包含大写字母');
  } else {
    score += 1;
  }
  
  if (!/\d/.test(password)) {
    errors.push('密码需包含数字');
  } else {
    score += 1;
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('密码需包含特殊字符');
  } else {
    score += 1;
  }
  
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 4) strength = 'strong';
  else if (score >= 2) strength = 'medium';
  
  return {
    isValid: errors.length === 0,
    strength,
    errors
  };
};

// 计算两点间距离（公里）
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // 地球半径（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// 格式化距离
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}米`;
  }
  return `${distance.toFixed(1)}公里`;
};

// 获取攀岩难度颜色
export const getDifficultyColor = (difficulty: string): string => {
  const colors: { [key: string]: string } = {
    '5.6': '#4CAF50',
    '5.7': '#8BC34A',
    '5.8': '#CDDC39',
    '5.9': '#FFEB3B',
    '5.10a': '#FFC107',
    '5.10b': '#FF9800',
    '5.10c': '#FF5722',
    '5.10d': '#F44336',
    '5.11a': '#E91E63',
    '5.11b': '#9C27B0',
    '5.11c': '#673AB7',
    '5.11d': '#3F51B5',
    '5.12a': '#2196F3',
    '5.12b': '#03A9F4',
    '5.12c': '#00BCD4',
    '5.12d': '#009688',
    '5.13a': '#4CAF50',
    '5.13b': '#8BC34A',
    '5.13c': '#CDDC39',
    '5.13d': '#FFEB3B',
    '5.14a': '#FFC107',
    '5.14b': '#FF9800',
    '5.14c': '#FF5722',
    '5.14d': '#F44336',
    '5.15a': '#E91E63',
    '5.15b': '#9C27B0',
    '5.15c': '#673AB7',
    '5.15d': '#3F51B5'
  };
  
  return colors[difficulty] || '#757575';
};

// 获取攀岩类型图标
export const getClimbingTypeIcon = (type: string): string => {
  const icons: { [key: string]: string } = {
    'sport': '🧗‍♂️',
    'trad': '⚙️',
    'boulder': '🪨',
    'multi_pitch': '🏔️',
    'aid': '🔧',
    'ice': '🧊',
    'mixed': '❄️'
  };
  
  return icons[type] || '🧗‍♂️';
};

// 本地存储工具
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue || null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// URL参数工具
export const urlParams = {
  get: (param: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },
  
  set: (params: { [key: string]: string }): void => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.pushState({}, '', url.toString());
  },
  
  remove: (param: string): void => {
    const url = new URL(window.location.href);
    url.searchParams.delete(param);
    window.history.pushState({}, '', url.toString());
  }
};

// 图片压缩
export const compressImage = (
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 600,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // 计算新尺寸
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // 绘制图片
      ctx.drawImage(img, 0, 0, width, height);
      
      // 转换为Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// 复制到剪贴板
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // 降级方案
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
};

// 下载文件
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 获取设备类型
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// 滚动到元素
export const scrollToElement = (
  element: HTMLElement | string,
  behavior: 'smooth' | 'auto' = 'smooth',
  block: 'start' | 'center' | 'end' = 'start'
): void => {
  const target = typeof element === 'string' 
    ? document.querySelector(element) as HTMLElement
    : element;
    
  if (target) {
    target.scrollIntoView({ behavior, block });
  }
};

// 错误处理
export const handleError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return '发生未知错误';
};